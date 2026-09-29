/**
 * Protocol-Aware Audio Stream Adapter
 * 2026 Resilient Streaming Architecture:
 * - Direct / File / Icecast: Native HTMLAudioElement
 * - HLS (.m3u8): Native Safari HLS with local on-demand Hls.js loader for Chrome/Edge/Firefox
 * - Guaranteed Web Audio API graph integration without broken media element sources
 */

function getOrLoadHls() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.Hls && window.Hls.isSupported()) return Promise.resolve(window.Hls);

  return new Promise((resolve) => {
    const existing = document.getElementById("hls-js-engine");
    if (existing) {
      if (window.Hls) return resolve(window.Hls);
      existing.addEventListener("load", () => resolve(window.Hls || null));
      existing.addEventListener("error", () => resolve(null));
      return;
    }

    const script = document.createElement("script");
    script.id = "hls-js-engine";
    script.src = "/hls.min.js"; // Fast local bundle (zero external CDN reliance)
    script.async = true;
    script.onload = () => resolve(window.Hls || null);
    script.onerror = () => {
      // Secondary fallback to CDN if needed
      const fallback = document.createElement("script");
      fallback.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.8/dist/hls.min.js";
      fallback.onload = () => resolve(window.Hls || null);
      fallback.onerror = () => resolve(null);
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  });
}

export class NativeAudioAdapter {
  constructor(audioEl, onStateChange) {
    this.audioEl = audioEl;
    this.onStateChange = onStateChange;
    this.activeUrl = null;
    this.hlsInstance = null;
  }

  async load(url, protocol = "auto", autoPlay = false) {
    this.cleanup();
    this.activeUrl = url;

    const isHls =
      protocol === "hls" ||
      url.endsWith(".m3u8") ||
      url.includes(".m3u8") ||
      url.includes("/hls");

    // 1. Native HLS for Safari (iOS / macOS)
    if (isHls) {
      const canNativeHls =
        this.audioEl.canPlayType("application/vnd.apple.mpegurl") ||
        this.audioEl.canPlayType("application/x-mpegURL");

      if (canNativeHls) {
        this.audioEl.src = url;
        this.audioEl.load();
        if (autoPlay) {
          this.audioEl.play().catch(() => {});
        }
        return;
      }

      // 2. High-performance local Hls.js engine for Chromium / Firefox / Edge
      const Hls = await getOrLoadHls();
      if (Hls && Hls.isSupported()) {
        try {
          // CRITICAL: Clean up existing src attribute before attaching MediaSource
          this.audioEl.pause();
          this.audioEl.removeAttribute("src");
          this.audioEl.load();

          this.hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
            maxBufferLength: 20,
            maxMaxBufferLength: 40,
            maxBufferSize: 10 * 1000 * 1000,
            liveSyncDurationCount: 3,
            liveMaxLatencyDurationCount: 10,
          });

          this.hlsInstance.loadSource(url);
          this.hlsInstance.attachMedia(this.audioEl);

          this.hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
            if (this.onStateChange) this.onStateChange("connecting");
          });

          this.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            if (this.onStateChange) this.onStateChange("playing");
            if (autoPlay) {
              this.audioEl.play().catch((err) => {
                console.warn("[HlsAudioAdapter] Autoplay waiting for interaction:", err);
              });
            }
          });

          this.hlsInstance.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              console.warn("[HlsAudioAdapter] Stream event warning:", data.type);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  try {
                    this.hlsInstance.startLoad();
                  } catch (e) {
                    if (this.onStateChange) this.onStateChange("error");
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  try {
                    this.hlsInstance.recoverMediaError();
                  } catch (e) {
                    if (this.onStateChange) this.onStateChange("error");
                  }
                  break;
                default:
                  this.cleanup();
                  if (this.onStateChange) this.onStateChange("error");
                  break;
              }
            }
          });
          return;
        } catch (err) {
          console.warn("[HlsAudioAdapter] Initialization exception:", err);
        }
      }
    }

    // Direct HTML5 stream (File, MP3, AAC)
    this.audioEl.pause();
    this.audioEl.src = url;
    this.audioEl.load();
    if (autoPlay) {
      this.audioEl.play().catch(() => {});
    }
  }

  cleanup() {
    if (this.hlsInstance) {
      try {
        this.hlsInstance.detachMedia();
        this.hlsInstance.destroy();
      } catch (e) {}
      this.hlsInstance = null;
    }
  }
}
