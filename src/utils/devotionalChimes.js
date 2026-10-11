/**
 * Procedural Devotional Sound Chimes (Web Audio API)
 * Synthesizes sacred Shankha (conch shell) resonance and temple bell harmonics
 * with zero external audio assets or latency.
 */

export function playDevotionalChime(type = "shankha") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === "shankha") {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(216, now);
      osc1.frequency.exponentialRampToValueAtTime(432, now + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(324, now + 1.2);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(432, now);
      osc2.frequency.exponentialRampToValueAtTime(648, now + 0.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } else if (type === "bell") {
      const now = ctx.currentTime;
      const fundamental = 1100;
      const harmonics = [1, 2.76, 5.4, 8.9];

      harmonics.forEach((ratio, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(fundamental * ratio, now);

        const initialGain = 0.15 / (idx + 1);
        gain.gain.setValueAtTime(initialGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.6);
      });
    }
  } catch {
    // fallback
  }
}
