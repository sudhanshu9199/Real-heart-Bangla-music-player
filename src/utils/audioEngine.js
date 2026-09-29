/**
 * Centralized Atmospheric & Multi-Source Audio Engine (Web Audio API)
 * Seamlessly integrates:
 * - Mahalaya Chandipath (Birendra Krishna Bhadra recording with chapters)
 * - Bengali Live Internet Radio (Akashvani Kolkata / Live Bangla stream)
 * - Single active playback element with smooth crossfade source switching
 * - Live real-time frequency analysis (AnalyserNode) driving UI visualizers for all sources
 * - Atmospheric dawn synchronization & ambient autumn breeze
 * - Comprehensive Media Session API integration
 * - Network resilience & explicit connection states
 */

import {
  AUDIO_SOURCES,
  MAHALAYA_CHAPTERS,
  KOLKATA_RADIO_STATIONS,
} from "@/config/audioSources";
import { NativeAudioAdapter } from "./audioAdapters";

export { MAHALAYA_CHAPTERS, AUDIO_SOURCES, KOLKATA_RADIO_STATIONS };

class DawnAudioEngine {
  constructor() {
    this.ctx = null;
    this.audioEl = null;
    this.sourceNode = null;
    this.analyser = null;
    this.masterGain = null;
    this.musicGain = null;
    this.windGain = null;

    // Source state
    this.activeSourceId = "mahalaya"; // "mahalaya" | "bangla-radio"
    this.adapter = null;

    // Kolkata Radio station state (100% authentic Kolkata, West Bengal, India)
    this.currentKolkataStationIndex = 0;

    // Radio connection state: "idle" | "connecting" | "buffering" | "playing" | "paused" | "reconnecting" | "error" | "offline"
    this.radioState = "idle";
    this.radioRetryCount = 0;
    this.maxRadioRetries = 2;
    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    // Playback state
    this.isPlaying = false;
    this.currentChapterIndex = 0;
    this.duration = 5400; // estimated duration fallback
    this.currentTime = 0;

    // Frequency analysis
    this.frequencyData = new Uint8Array(32);
    this.listeners = new Set();
    this.isLoaded = false;
    this.altitude = -18;

    // Crossfade lock
    this.isTransitioning = false;
  }

  init() {
    if (this.ctx && this.audioEl) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master output gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Dedicated music gain for smooth crossfades
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(1.0, this.ctx.currentTime);

    // Real-time Analyser node for live frequency reaction (works for all sources)
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.analyser.smoothingTimeConstant = 0.82;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

    this.musicGain.connect(this.analyser);
    this.analyser.connect(this.masterGain);

    // Exactly ONE shared HTML5 Audio Element for all playback
    this.audioEl = new Audio();
    this.audioEl.preload = "auto";
    this.audioEl.crossOrigin = "anonymous";

    // Initialize protocol adapter
    this.adapter = new NativeAudioAdapter(this.audioEl, (state) => {
      this.radioState = state;
      this.notifyListeners();
    });

    // Attach comprehensive media event listeners
    this.setupMediaEventListeners();

    // Connect single audio element into Web Audio graph
    try {
      this.sourceNode = this.ctx.createMediaElementSource(this.audioEl);
      this.sourceNode.connect(this.musicGain);
    } catch (err) {
      console.warn("[AudioEngine] MediaElementSource connection warning:", err);
    }

    // Network resilience listeners
    this.setupNetworkListeners();

    // Media Session API initialization
    this.setupMediaSession();

    // Background atmospheric sound
    this.initAtmosphericBackground();

    // Initial load: Mahalaya
    this.loadActiveSource();
  }

  setupMediaEventListeners() {
    if (!this.audioEl) return;

    this.audioEl.addEventListener("loadedmetadata", () => {
      if (this.audioEl.duration && !isNaN(this.audioEl.duration) && isFinite(this.audioEl.duration)) {
        this.duration = this.audioEl.duration;
      }
      this.isLoaded = true;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("timeupdate", () => {
      this.currentTime = this.audioEl.currentTime;
      if (this.activeSourceId === "mahalaya") {
        this.updateChapterByTime(this.currentTime);
      }
      this.notifyListeners();
    });

    this.audioEl.addEventListener("play", () => {
      this.isPlaying = true;
      if (this.activeSourceId === "bangla-radio") {
        this.radioState = "playing";
      }
      this.updateMediaSessionState();
      this.notifyListeners();
    });

    this.audioEl.addEventListener("playing", () => {
      this.isPlaying = true;
      if (this.activeSourceId === "bangla-radio") {
        this.radioState = "playing";
        this.radioRetryCount = 0;
      }
      this.notifyListeners();
    });

    this.audioEl.addEventListener("pause", () => {
      this.isPlaying = false;
      if (this.activeSourceId === "bangla-radio" && this.radioState !== "error") {
        this.radioState = "paused";
      }
      this.updateMediaSessionState();
      this.notifyListeners();
    });

    this.audioEl.addEventListener("waiting", () => {
      if (this.activeSourceId === "bangla-radio") {
        this.radioState = "buffering";
        this.notifyListeners();
      }
    });

    this.audioEl.addEventListener("ended", () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("error", (e) => {
      console.warn("[AudioEngine] Media stream warning/error:", e);
      if (this.activeSourceId === "mahalaya") {
        // Fallback to encoded filename if clean alias failed
        const mahalayaSrc = AUDIO_SOURCES.mahalaya.fallbackUrl;
        if (this.audioEl.src !== mahalayaSrc) {
          this.audioEl.src = mahalayaSrc;
          this.audioEl.load();
        }
      } else if (this.activeSourceId === "bangla-radio") {
        this.handleRadioError();
      }
    });
  }

  setupNetworkListeners() {
    if (typeof window === "undefined") return;

    window.addEventListener("online", () => {
      this.isOnline = true;
      if (this.activeSourceId === "bangla-radio" && (this.radioState === "offline" || this.radioState === "error")) {
        this.retryRadio();
      }
      this.notifyListeners();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      if (this.activeSourceId === "bangla-radio") {
        this.radioState = "offline";
        this.notifyListeners();
      }
    });
  }

  getCurrentKolkataStation() {
    return (
      KOLKATA_RADIO_STATIONS[this.currentKolkataStationIndex] ||
      KOLKATA_RADIO_STATIONS[0]
    );
  }

  async setKolkataStation(index) {
    if (index < 0 || index >= KOLKATA_RADIO_STATIONS.length) return;
    this.currentKolkataStationIndex = index;
    const station = this.getCurrentKolkataStation();

    if (this.activeSourceId === "bangla-radio") {
      this.radioState = "connecting";
      this.radioRetryCount = 0;
      this.notifyListeners();

      if (this.adapter) {
        await this.adapter.load(station.streamUrl, "hls", this.isPlaying);
      }
      this.updateMediaSessionMetadata();
      this.notifyListeners();
    }
  }

  async nextKolkataStation() {
    const nextIdx =
      (this.currentKolkataStationIndex + 1) % KOLKATA_RADIO_STATIONS.length;
    await this.setKolkataStation(nextIdx);
  }

  async prevKolkataStation() {
    const prevIdx =
      (this.currentKolkataStationIndex - 1 + KOLKATA_RADIO_STATIONS.length) %
      KOLKATA_RADIO_STATIONS.length;
    await this.setKolkataStation(prevIdx);
  }

  handleRadioError() {
    if (!this.isOnline) {
      this.radioState = "offline";
      this.notifyListeners();
      return;
    }

    if (this.radioRetryCount < this.maxRadioRetries) {
      this.radioRetryCount++;
      this.radioState = "reconnecting";
      this.notifyListeners();
      setTimeout(() => {
        if (this.activeSourceId === "bangla-radio") {
          const currentStation = this.getCurrentKolkataStation();
          // Fallback to alternate Kolkata station if current stream has momentary issues
          const fallbackIdx =
            (this.currentKolkataStationIndex + 1) %
            KOLKATA_RADIO_STATIONS.length;
          const urlToTry =
            this.radioRetryCount === 1
              ? currentStation.streamUrl
              : KOLKATA_RADIO_STATIONS[fallbackIdx].streamUrl;

          if (this.adapter) {
            this.adapter.load(urlToTry, "hls", this.isPlaying);
          }
        }
      }, 1800);
    } else {
      this.radioState = "error";
      this.notifyListeners();
    }
  }

  retryRadio() {
    if (this.activeSourceId !== "bangla-radio") return;
    this.radioRetryCount = 0;
    this.radioState = "connecting";
    this.notifyListeners();
    const station = this.getCurrentKolkataStation();
    if (this.adapter) {
      this.adapter.load(station.streamUrl, "hls", true);
    }
  }

  loadActiveSource() {
    const source = AUDIO_SOURCES[this.activeSourceId];
    if (!source || !this.adapter) return;

    if (this.activeSourceId === "bangla-radio") {
      this.radioState = "connecting";
      const station = this.getCurrentKolkataStation();
      this.adapter.load(station.streamUrl, "hls");
    } else {
      this.adapter.load(source.streamUrl, source.protocol);
    }
    this.updateMediaSessionMetadata();
  }

  // --- SOURCE SWITCHING WITH SMOOTH CROSSFADE ---
  async setSource(sourceId) {
    if (this.activeSourceId === sourceId || this.isTransitioning) return;
    if (!AUDIO_SOURCES[sourceId]) return;

    this.init();
    this.isTransitioning = true;
    const wasPlaying = this.isPlaying;

    // 1. Smooth Fade Out of previous source
    if (this.ctx && this.musicGain && wasPlaying) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(1.0, now);
      this.musicGain.gain.linearRampToValueAtTime(0.01, now + 0.22);
      await new Promise((r) => setTimeout(r, 230));
    }

    // 2. Switch active source ID
    this.activeSourceId = sourceId;
    this.radioRetryCount = 0;

    // 3. Load new source into single audio element
    if (sourceId === "bangla-radio") {
      this.radioState = "connecting";
      // Wind gain should be completely silent for live radio broadcast
      if (this.windGain && this.ctx) {
        this.windGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      }
      const station = this.getCurrentKolkataStation();
      if (this.adapter) {
        await this.adapter.load(station.streamUrl, "hls", wasPlaying);
      }
    } else {
      this.radioState = "idle";
      const newSource = AUDIO_SOURCES[sourceId];
      if (this.adapter) {
        await this.adapter.load(
          newSource.streamUrl,
          newSource.protocol,
          wasPlaying
        );
      }
    }
    this.notifyListeners();

    // 4. Start playback if user had audio playing
    if (wasPlaying) {
      try {
        await this.audioEl.play();
        this.isPlaying = true;
      } catch (err) {
        console.warn("[AudioEngine] Playback resume on source switch:", err);
      }
    }

    // 5. Smooth Fade In of new source
    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(0.01, now);
      this.musicGain.gain.linearRampToValueAtTime(1.0, now + 0.28);
    }

    this.isTransitioning = false;
    this.updateMediaSessionMetadata();
    this.notifyListeners();
  }

  initAtmosphericBackground() {
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(80, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    // Start completely muted — zero dial tone or whistling
    this.windGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    whiteNoise.start();
  }

  updateChapterByTime(time) {
    for (let i = MAHALAYA_CHAPTERS.length - 1; i >= 0; i--) {
      if (time >= MAHALAYA_CHAPTERS[i].timeStart) {
        if (this.currentChapterIndex !== i) {
          this.currentChapterIndex = i;
          this.updateMediaSessionMetadata();
        }
        break;
      }
    }
  }

  getSimulatedDawnTime() {
    if (!this.duration || this.duration <= 0) return 4.0;
    const progress = Math.min(1, Math.max(0, this.currentTime / this.duration));
    return 4.0 + progress * 2.45;
  }

  getEqualizerData() {
    if (!this.analyser || !this.isPlaying) {
      return [0.15, 0.25, 0.18, 0.3];
    }
    this.analyser.getByteFrequencyData(this.frequencyData);

    const b0 = this.frequencyData[1] / 255;
    const b1 = this.frequencyData[4] / 255;
    const b2 = this.frequencyData[8] / 255;
    const b3 = this.frequencyData[14] / 255;

    return [
      Math.max(0.12, b0),
      Math.max(0.15, b1),
      Math.max(0.12, b2),
      Math.max(0.15, b3),
    ];
  }

  getAudioEnergy() {
    if (!this.analyser || !this.isPlaying) return 0;
    this.analyser.getByteFrequencyData(this.frequencyData);
    let sum = 0;
    for (let i = 0; i < 16; i++) {
      sum += this.frequencyData[i];
    }
    return sum / (16 * 255);
  }

  async toggle() {
    this.init();

    if (this.ctx && this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (!this.audioEl) return false;

    if (this.isPlaying) {
      this.audioEl.pause();
      this.isPlaying = false;
      if (this.activeSourceId === "bangla-radio") {
        this.radioState = "paused";
      }
    } else {
      try {
        if (this.activeSourceId === "bangla-radio" && this.adapter && this.adapter.hlsInstance) {
          this.adapter.hlsInstance.startLoad();
        }
        await this.audioEl.play();
        this.isPlaying = true;
        if (this.activeSourceId === "bangla-radio") {
          this.radioState = "playing";
        }
      } catch (err) {
        console.warn("[AudioEngine] Audio play error (e.g. autoplay block):", err);
        return false;
      }
    }

    this.notifyListeners();
    return this.isPlaying;
  }

  seekTo(seconds) {
    if (this.activeSourceId !== "mahalaya") return; // Live radio cannot seek
    if (!this.audioEl) this.init();
    this.audioEl.currentTime = Math.max(0, Math.min(this.duration, seconds));
    this.currentTime = this.audioEl.currentTime;
    this.updateChapterByTime(this.currentTime);
    this.notifyListeners();
  }

  nextChapter() {
    if (this.activeSourceId === "bangla-radio") {
      this.nextKolkataStation();
      return;
    }
    if (this.activeSourceId !== "mahalaya") return;
    const nextIdx = (this.currentChapterIndex + 1) % MAHALAYA_CHAPTERS.length;
    this.seekTo(MAHALAYA_CHAPTERS[nextIdx].timeStart);
    if (!this.isPlaying) {
      this.toggle();
    }
  }

  prevChapter() {
    if (this.activeSourceId === "bangla-radio") {
      this.prevKolkataStation();
      return;
    }
    if (this.activeSourceId !== "mahalaya") return;
    if (this.currentTime - MAHALAYA_CHAPTERS[this.currentChapterIndex].timeStart > 5) {
      this.seekTo(MAHALAYA_CHAPTERS[this.currentChapterIndex].timeStart);
    } else {
      const prevIdx =
        (this.currentChapterIndex - 1 + MAHALAYA_CHAPTERS.length) % MAHALAYA_CHAPTERS.length;
      this.seekTo(MAHALAYA_CHAPTERS[prevIdx].timeStart);
    }
    if (!this.isPlaying) {
      this.toggle();
    }
  }

  getCurrentChapter() {
    return MAHALAYA_CHAPTERS[this.currentChapterIndex];
  }

  getActiveSource() {
    return AUDIO_SOURCES[this.activeSourceId];
  }

  updateAtmosphere(altitude) {
    this.altitude = altitude;
    if (this.windGain && this.ctx) {
      if (this.activeSourceId === "mahalaya" && this.isPlaying) {
        this.windGain.gain.setValueAtTime(0.012, this.ctx.currentTime);
      } else {
        this.windGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      }
    }
  }

  // --- MEDIA SESSION INTEGRATION ---
  setupMediaSession() {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.setActionHandler("play", () => this.toggle());
      navigator.mediaSession.setActionHandler("pause", () => this.toggle());
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        if (this.activeSourceId === "bangla-radio") this.prevKolkataStation();
        else if (this.activeSourceId === "mahalaya") this.prevChapter();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        if (this.activeSourceId === "bangla-radio") this.nextKolkataStation();
        else if (this.activeSourceId === "mahalaya") this.nextChapter();
      });
    } catch (e) {
      console.warn("[AudioEngine] MediaSession handler warning:", e);
    }
  }

  updateMediaSessionMetadata() {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      if (this.activeSourceId === "mahalaya") {
        const chap = this.getCurrentChapter();
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `মহিষাসুরমর্দ্দিনী • ${chap.title}`,
          artist: "Birendra Krishna Bhadra",
          album: "Mahalaya Dawn Recitation",
          artwork: [
            { src: chap.cover || "/covers/cover-1.jpg", sizes: "512x512", type: "image/jpeg" },
          ],
        });
      } else {
        const station = this.getCurrentKolkataStation();
        navigator.mediaSession.metadata = new MediaMetadata({
          title: station.title,
          artist: `${station.frequency} • Akashvani Kolkata`,
          album: "Kolkata, West Bengal (India) Live",
          artwork: [
            { src: "/covers/radio-bangla.jpg", sizes: "512x512", type: "image/jpeg" },
          ],
        });
      }
    } catch (e) {
      // safe fallback
    }
  }

  updateMediaSessionState() {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.playbackState = this.isPlaying ? "playing" : "paused";
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => fn(this));
  }
}

let instance = null;
export function getDawnAudioEngine() {
  if (typeof window === "undefined") return null;
  if (!instance) {
    instance = new DawnAudioEngine();
  }
  return instance;
}
