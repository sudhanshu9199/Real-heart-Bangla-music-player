/**
 * Dedicated Independent Festive Dhak Audio Engine
 * Plays /Dhak-music.mp3 completely autonomously in parallel with Mahalaya & Live Radio.
 * - 100% Independent lifecycle: starting or stopping Mahalaya/Radio never interrupts Dhak
 * - Seamless looping festive soundscape layer
 * - Global synchronization across Schedule Modal, Audio Player Capsule, and HUD
 */

class DhakAudioEngine {
  constructor() {
    this.audioEl = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 0.85;
    this.listeners = new Set();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") return;

    this.audioEl = new Audio();
    this.audioEl.src = "/Dhak-music.mp3";
    this.audioEl.preload = "auto";
    this.audioEl.loop = true; // Seamless looping for continuous festival atmosphere
    this.audioEl.volume = this.volume;

    this.audioEl.addEventListener("play", () => {
      this.isPlaying = true;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("pause", () => {
      this.isPlaying = false;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("timeupdate", () => {
      this.currentTime = this.audioEl.currentTime;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("loadedmetadata", () => {
      this.duration = this.audioEl.duration;
      this.notifyListeners();
    });

    this.audioEl.addEventListener("ended", () => {
      if (!this.audioEl.loop) {
        this.audioEl.currentTime = 0;
        this.audioEl.play().catch(() => {});
      }
    });

    this.isInitialized = true;
  }

  async play() {
    this.init();
    if (!this.audioEl) return false;
    try {
      await this.audioEl.play();
      this.isPlaying = true;
      this.notifyListeners();
      return true;
    } catch (err) {
      console.warn("[DhakAudioEngine] Playback prevented by browser autoplay:", err);
      return false;
    }
  }

  pause() {
    if (!this.audioEl) return;
    this.audioEl.pause();
    this.isPlaying = false;
    this.notifyListeners();
  }

  async toggle() {
    this.init();
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      return await this.play();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    this.notifyListeners();
  }

  seekTo(seconds) {
    if (this.audioEl) {
      this.audioEl.currentTime = Math.max(0, Math.min(this.duration || 9999, seconds));
      this.currentTime = this.audioEl.currentTime;
      this.notifyListeners();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Send immediate initial sync
    listener(this);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((fn) => {
      try {
        fn(this);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

let dhakInstance = null;

export function getDhakAudioEngine() {
  if (typeof window === "undefined") return null;
  if (!dhakInstance) {
    dhakInstance = new DhakAudioEngine();
  }
  return dhakInstance;
}
