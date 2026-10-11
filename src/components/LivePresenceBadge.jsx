"use client";

import React, { useState, useEffect, useRef } from "react";

/**
 * LivePresenceBadge — 2026 SaaS Real-Time Presence & Collective Social Proof Engine
 * - Living organic listener calculation calibrated to circadian Mahalaya listening patterns
 * - Cross-tab state synchronization via BroadcastChannel
 * - Micro-fluctuations with smoothed Poisson drift
 * - Interactive global community breakdown card
 */
export default function LivePresenceBadge() {
  const [onlineCount, setOnlineCount] = useState(1480);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLitDiya, setHasLitDiya] = useState(false);
  const popoverRef = useRef(null);

  // Check if current user has lit a sacred diya
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkDiya = () => {
      setHasLitDiya(localStorage.getItem("mahalaya_diya_lit") === "true");
    };
    checkDiya();
    window.addEventListener("storage", checkDiya);
    window.addEventListener("diya_lit_event", checkDiya);
    return () => {
      window.removeEventListener("storage", checkDiya);
      window.removeEventListener("diya_lit_event", checkDiya);
    };
  }, []);

  // Circadian & organic realistic listener simulation engine
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Calculate baseline based on current local hour (Dawn 4am-7am spikes highest)
    const getCircadianBase = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour <= 7) return 2450; // Dawn peak
      if (hour >= 8 && hour <= 12) return 1820; // Morning
      if (hour >= 18 && hour <= 23) return 1640; // Evening
      return 1320; // Night
    };

    const initialBase = getCircadianBase() + Math.floor((Math.random() - 0.5) * 80);
    setOnlineCount(initialBase);

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

    // Organic drift interval (drifts smoothly every 4-7 seconds)
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const base = getCircadianBase();
        const minBound = Math.floor(base * 0.85);
        const maxBound = Math.floor(base * 1.15);
        const next = Math.max(minBound, Math.min(maxBound, prev + delta));

        if (channel) {
          channel.postMessage({ count: next });
        }
        return next;
      });
    }, 5500);

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
      {/* 1. REAL-TIME PRESENCE TRIGGER PILL */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="View live global listeners across cities (শ্রোতাদের উপস্থিতি)"
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

        {/* Diya Patron Mini Ribbon if user has contributed */}
        {hasLitDiya && (
          <span
            title="You lit a sacred diya for Maa Durga!"
            className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] ml-0.5"
          />
        )}
      </button>

      {/* 2. 2026 SAAS COLLECTIVE PRESENCE COMMUNITY CARD */}
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
            You are sharing this sacred dawn soundscape in real-time with thousands of listeners across 42 global cities.
          </p>

          {/* Top Cities Distribution (2026 SaaS Social Proof Grid) */}
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
