"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * LivePresenceBadge — 2026 Ground-Reality Circadian Presence Engine
 * - Evolving, realistic 24-hour listener curve calibrated to genuine Indian cultural habits
 * - Dawn peak (4am - 6:30am) reflecting the iconic Mahalaya listening surge
 * - Natural afternoon and midnight lulls (no suspicious 1300+ constant numbers)
 * - Removed the weird orange/amber indicator dot for a clean, premium capsule aesthetic
 * - Smooth micro-drift (-1 to +1) reflecting organic listener departures & arrivals
 * - Cross-tab synchronization via BroadcastChannel
 */
export default function LivePresenceBadge() {
  const [onlineCount, setOnlineCount] = useState(48);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Smooth Circadian Baseline calibrated to ground-reality Indian cultural patterns
  const getCircadianBase = () => {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60; // Floating hour e.g. 14.5 for 2:30 PM

    if (hour >= 4 && hour < 7) {
      // Dawn Mahalaya spike (Iconic Bhorer Chandi Path peak: ~180 to ~340 listeners)
      const t = (hour - 4) / 3;
      return Math.round(180 + Math.sin(t * Math.PI) * 160);
    } else if (hour >= 7 && hour < 12) {
      // Morning devotional reflection hours: ~110 to ~180 listeners
      const t = (hour - 7) / 5;
      return Math.round(180 - t * 70);
    } else if (hour >= 12 && hour < 17) {
      // Afternoon lull (work/school/siesta): ~38 to ~65 listeners
      const t = (hour - 12) / 5;
      return Math.round(68 - Math.sin(t * Math.PI) * 26);
    } else if (hour >= 17 && hour < 22) {
      // Evening arati / festive soundscape peak: ~130 to ~240 listeners
      const t = (hour - 17) / 5;
      return Math.round(130 + Math.sin(t * Math.PI) * 110);
    } else if (hour >= 22 && hour < 24) {
      // Late night winding down: ~70 to ~110 listeners
      const t = (hour - 22) / 2;
      return Math.round(110 - t * 45);
    } else {
      // Deep midnight (00:00 - 04:00): Quietest night-owl hours (~18 to ~36 listeners)
      const t = hour / 4;
      return Math.round(52 - Math.sin(t * Math.PI) * 34);
    }
  };

  // Circadian & organic realistic listener simulation engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialBase = getCircadianBase() + Math.floor((Math.random() - 0.5) * 6);
    setOnlineCount(Math.max(12, initialBase));

    // Cross-tab sync via BroadcastChannel
    let channel;
    try {
      channel = new BroadcastChannel("mahalaya_presence_channel");
      channel.onmessage = (e) => {
        if (e.data?.count) {
          setOnlineCount(e.data.count);
        }
      };
    } catch {
      // BroadcastChannel fallback
    }

    // Organic drift interval (subtle -1, 0, or +1 fluctuations every 6.5s)
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const base = getCircadianBase();
        const minBound = Math.max(10, Math.floor(base * 0.85));
        const maxBound = Math.ceil(base * 1.15);
        const next = Math.max(minBound, Math.min(maxBound, prev + delta));

        if (channel) {
          channel.postMessage({ count: next });
        }
        return next;
      });
    }, 6500);

    return () => {
      clearInterval(interval);
      if (channel) channel.close();
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      document.addEventListener("touchstart", handleOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [isOpen]);

  const formattedCount = onlineCount.toLocaleString("en-IN");

  return (
    <div className="relative inline-flex items-center select-none" ref={popoverRef}>
      {/* 1. REAL-TIME PRESENCE TRIGGER PILL (Clean, No Stray Dot) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="View live listeners across regional hubs (লাইভ শ্রোতা)"
        aria-label={`${formattedCount} people currently listening live`}
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900/90 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-xl text-[11px] font-mono text-zinc-200 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5),0_0_12px_rgba(16,185,129,0.12)] cursor-pointer group active:scale-95"
      >
        {/* Living Green Radar Beacon with expanding shockwave */}
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
        </span>

        {/* Formatted Number */}
        <span className="font-semibold text-emerald-300 tracking-tight font-mono">
          {formattedCount}
        </span>

        {/* Label */}
        <span className="text-zinc-400 font-sans tracking-wide text-[10px] sm:text-[11px] hidden xs:inline">
          <span className="hidden sm:inline">Listening Live</span>
          <span className="sm:hidden">Live</span>
        </span>
      </button>

      {/* 2. REAL-TIME COLLECTIVE HARMONY COMMUNITY CARD */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2.5 z-50 w-72 sm:w-80 p-3.5 sm:p-4 rounded-2xl bg-[#0c0806]/96 border border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-semibold text-zinc-100 tracking-wide font-sans">
                Live Collective Harmony
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {formattedCount} Online
            </span>
          </div>

          {/* Subtext */}
          <p className="text-[11px] text-zinc-400 leading-relaxed mt-2.5 font-sans">
            You are sharing this sacred dawn soundscape in real-time with devotees across cultural hubs.
          </p>

          {/* Regional Hubs Distribution */}
          <div className="mt-3 space-y-1.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Active Regional Hubs
            </div>

            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-zinc-900/60 border border-zinc-800/50">
              <span className="text-zinc-300">🏛️ Kolkata & Bengal Core</span>
              <span className="font-mono text-emerald-300 font-medium">56%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-zinc-900/60 border border-zinc-800/50">
              <span className="text-zinc-300">🇮🇳 Bengaluru, Delhi NCR & Metros</span>
              <span className="font-mono text-emerald-300 font-medium">28%</span>
            </div>

            <div className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-zinc-900/60 border border-zinc-800/50">
              <span className="text-zinc-300">🌏 Global Diaspora (USA, UK, Canada)</span>
              <span className="font-mono text-emerald-300 font-medium">16%</span>
            </div>
          </div>

          {/* Status footer */}
          <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
            <span>📻 Akashvani Kolkata Sync</span>
            <span className="text-emerald-400 font-mono">128 kbps HD</span>
          </div>
        </div>
      )}
    </div>
  );
}
