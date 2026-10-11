"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DURGA_PUJA_SCHEDULE } from "@/data/durgaPujaSchedule";
import {
  getFestivalRealtimeStatus,
  calculateTimeDelta,
  FESTIVAL_DATES_2026,
} from "@/utils/durgaPujaRealtime";
import { getDhakAudioEngine } from "@/utils/dhakAudioEngine";

/**
 * Procedural Web Audio Synthesizer for instant sacred chime feedback (0KB dependencies)
 * Used for instant Shankha (conch) swell and Temple Bell chime.
 */
function playDevotionalChime(type = "shankha") {
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

// Format seconds into MM:SS
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const sec = Math.floor(seconds);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Convert numbers into Bengali numerals if lang is Bengali
function formatDigit(num, langMode) {
  const str = String(num).padStart(2, "0");
  if (langMode === "bn") {
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return str
      .split("")
      .map((d) => bnDigits[parseInt(d, 10)] ?? d)
      .join("");
  }
  return str;
}

export default function DurgaPujaScheduleModal({ isOpen, onClose }) {
  // Language mode: "bonglish" (Spoken Bengali for diaspora) | "bn" | "en"
  const [langMode, setLangMode] = useState("bonglish");
  const [selectedDayId, setSelectedDayId] = useState("shashthi");
  const [copiedMantra, setCopiedMantra] = useState(false);
  const [sharedStatus, setSharedStatus] = useState(false);
  const [activeSection, setActiveSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingChime, setPlayingChime] = useState(null);

  // Audio Engine synchronized state for Dhak song (/Dhak-music.mp3)
  const [isDhakPlaying, setIsDhakPlaying] = useState(false);
  const [dhakCurrentTime, setDhakCurrentTime] = useState(0);
  const [dhakDuration, setDhakDuration] = useState(0);
  const [showDhakPlayerBar, setShowDhakPlayerBar] = useState(false);

  // Real-time ticking date for countdowns (updates every second)
  const [nowDate, setNowDate] = useState(() => new Date());

  const modalRef = useRef(null);
  const tabRailRef = useRef(null);

  // Real-time timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute festival-wide real-time status
  const realtimeStatus = useMemo(() => {
    return getFestivalRealtimeStatus(nowDate);
  }, [nowDate]);

  // Sync with independent DhakAudioEngine for autonomous Dhak playback
  useEffect(() => {
    const dhakAudio = getDhakAudioEngine();
    if (!dhakAudio) return;

    const handleDhakSync = (eng) => {
      setIsDhakPlaying(eng.isPlaying);
      setDhakCurrentTime(eng.currentTime);
      if (eng.duration) setDhakDuration(eng.duration);
    };

    const unsubscribe = dhakAudio.subscribe(handleDhakSync);
    return () => {
      unsubscribe();
    };
  }, []);

  // Load saved language preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("durga_puja_schedule_lang_mode");
      if (saved && ["bn", "bonglish", "en"].includes(saved)) {
        setLangMode(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-focus next upcoming event when modal opens
  useEffect(() => {
    if (isOpen && realtimeStatus.nextEventId) {
      setSelectedDayId(realtimeStatus.nextEventId);
    }
  }, [isOpen]);

  const handleSelectLang = (mode) => {
    setLangMode(mode);
    try {
      localStorage.setItem("durga_puja_schedule_lang_mode", mode);
      window.dispatchEvent(
        new CustomEvent("puja_language_changed", { detail: mode })
      );
    } catch {
      // ignore
    }
  };

  const activeDay = useMemo(() => {
    return (
      DURGA_PUJA_SCHEDULE.find((d) => d.id === selectedDayId) ||
      DURGA_PUJA_SCHEDULE[1] // Default to Shashthi
    );
  }, [selectedDayId]);

  const activeIndex = useMemo(() => {
    return DURGA_PUJA_SCHEDULE.findIndex((d) => d.id === selectedDayId);
  }, [selectedDayId]);

  // Time delta specifically for the currently active day tab
  const activeDayCountdown = useMemo(() => {
    const dates = FESTIVAL_DATES_2026[selectedDayId];
    if (!dates) return null;
    return calculateTimeDelta(dates.start, nowDate);
  }, [selectedDayId, nowDate]);

  // Current status of the active day tab
  const activeDayStatus = realtimeStatus.statuses[selectedDayId] || "upcoming";

  // Text accessor based on chosen language mode
  const t = useCallback(
    (fieldObj) => {
      if (!fieldObj) return "";
      if (typeof fieldObj === "string") return fieldObj;
      return fieldObj[langMode] || fieldObj.bonglish || fieldObj.bn || fieldObj.en || "";
    },
    [langMode]
  );

  // Play / Pause independent festive Dhak Music (autonomous parallel layer)
  const handleToggleDhakMusic = async () => {
    const dhakAudio = getDhakAudioEngine();
    if (!dhakAudio) return;
    await dhakAudio.toggle();
    setShowDhakPlayerBar(true);
  };

  // Play short ceremonial sounds (Shankha / Bell)
  const handlePlayChime = (type) => {
    setPlayingChime(type);
    playDevotionalChime(type);
    setTimeout(() => setPlayingChime(null), type === "shankha" ? 1800 : 900);
  };

  // Keyboard navigation & trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        const nextIdx = (activeIndex + 1) % DURGA_PUJA_SCHEDULE.length;
        setSelectedDayId(DURGA_PUJA_SCHEDULE[nextIdx].id);
      } else if (e.key === "ArrowLeft") {
        const prevIdx =
          (activeIndex - 1 + DURGA_PUJA_SCHEDULE.length) %
          DURGA_PUJA_SCHEDULE.length;
        setSelectedDayId(DURGA_PUJA_SCHEDULE[prevIdx].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, onClose]);

  // Center active tab in scrollable rail
  useEffect(() => {
    if (!tabRailRef.current) return;
    const activeTab = tabRailRef.current.querySelector(
      `[data-tab-id="${selectedDayId}"]`
    );
    if (activeTab) {
      activeTab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDayId]);

  // Handle Mantra Copy
  const handleCopyMantra = useCallback(() => {
    if (!activeDay?.mantra) return;
    const titleText = t(activeDay.title);
    const meaningText = t(activeDay.mantra.meaning);

    const shareContent = `🌸 ${titleText} — পুষ্পাঞ্জলি মন্ত্র ও শুভ শারদীয়া\n\n[সংস্কৃত শ্লোক]:\n${activeDay.mantra.sanskritBengali}\n\n[উচ্চারণ / Chanting Phonetics]:\n${activeDay.mantra.phonetic}\n\n[অর্থ / Meaning]:\n${meaningText}\n\n✨ দুর্গোৎসব ২০২৬ • বাজলো তোমার আলোর বেণু!`;

    navigator.clipboard
      .writeText(shareContent)
      .then(() => {
        setCopiedMantra(true);
        setTimeout(() => setCopiedMantra(false), 2400);
      })
      .catch(() => {});
  }, [activeDay, t]);

  // Handle Web Share API
  const handleShareDay = useCallback(() => {
    if (typeof window === "undefined") return;
    const titleText = t(activeDay.title);
    const timingText = t(activeDay.auspiciousTiming);
    const shareText = `🌸 ${titleText} (${t(activeDay.subtitle)})\n⏱️ সময়: ${timingText}\n\n"${t(
      activeDay.heroVerse
    )}"\n\nবাঙালির দুর্গাপূজা নির্ঘণ্ট ও কাউন্টডাউন ২০২৬`;

    if (navigator.share) {
      navigator
        .share({
          title: `${titleText} — দুর্গাপূজা নির্ঘণ্ট`,
          text: shareText,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setSharedStatus(true);
        setTimeout(() => setSharedStatus(false), 2000);
      });
    }
  }, [activeDay, t]);

  const handleNextDay = () => {
    const nextIdx = (activeIndex + 1) % DURGA_PUJA_SCHEDULE.length;
    setSelectedDayId(DURGA_PUJA_SCHEDULE[nextIdx].id);
  };

  const handlePrevDay = () => {
    const prevIdx =
      (activeIndex - 1 + DURGA_PUJA_SCHEDULE.length) %
      DURGA_PUJA_SCHEDULE.length;
    setSelectedDayId(DURGA_PUJA_SCHEDULE[prevIdx].id);
  };

  // Filtered rituals based on search query
  const filteredRituals = useMemo(() => {
    if (!searchQuery.trim()) return activeDay.rituals;
    const q = searchQuery.toLowerCase().trim();
    return activeDay.rituals.filter((r) => {
      const matchBn =
        r.title.bn?.toLowerCase().includes(q) ||
        r.desc.bn?.toLowerCase().includes(q);
      const matchBonglish =
        r.title.bonglish?.toLowerCase().includes(q) ||
        r.desc.bonglish?.toLowerCase().includes(q);
      const matchEn =
        r.title.en?.toLowerCase().includes(q) ||
        r.desc.en?.toLowerCase().includes(q);
      return matchBn || matchBonglish || matchEn;
    });
  }, [activeDay, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="puja-schedule-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* MAIN CONTAINER: 2026 Obsidian Glassmorphism Chassis */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[94dvh] sm:max-h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl bg-[#090503]/98 border border-[#ff7b1a]/45 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_65px_rgba(255,123,26,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-3xl overflow-hidden transition-all duration-300"
      >
        {/* TOP GLOW ACCENT LINE */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff7b1a] to-transparent pointer-events-none" />

        {/* 1. MODAL HEADER: Title, 2026 Multi-Script Switcher & Controls */}
        <div className="flex flex-col gap-2.5 px-4 sm:px-6 pt-3.5 sm:pt-4 pb-3 border-b border-[#ff7b1a]/25 bg-[#0e0704]/95 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            {/* Title & Cultural Emblem */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#2a1306] to-[#451e08] border border-[#ff7b1a]/60 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(255,123,26,0.45)] flex-shrink-0">
                📜
              </div>
              <div className="min-w-0">
                <h2
                  id="puja-schedule-title"
                  className="text-sm sm:text-base md:text-lg font-bold text-[#ffbe76] tracking-wide truncate flex items-center gap-2"
                >
                  {langMode === "bn" && "বাঙালির দুর্গাপূজা নির্ঘণ্ট ২০২৬"}
                  {langMode === "bonglish" && "Bengali Durga Puja Schedule 2026"}
                  {langMode === "en" && "Sharodiya Durga Puja Guide 2026"}

                  {/* Real-time Devi Paksha Active Badge */}
                  {realtimeStatus.isDevipaksha && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {langMode === "bn"
                        ? "দেবীপক্ষ চলছে"
                        : langMode === "bonglish"
                        ? "Debipaksha Live"
                        : "Devipaksha Ongoing"}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] sm:text-xs text-orange-200/65 truncate">
                  {langMode === "bn" &&
                    "মহালয়া থেকে দশমী — প্রতিটি তিথির পূর্ণাঙ্গ শাস্ত্রীয় বিধি ও রিয়েল-টাইম কাউন্টডাউন"}
                  {langMode === "bonglish" &&
                    "Mahalaya theke Dashami — Daily Rituals, Live Countdowns & Spoken Bengali"}
                  {langMode === "en" &&
                    "Complete Day-by-Day Sacred Rituals, Live Event Countdown & Traditional Bhog"}
                </p>
              </div>
            </div>

            {/* Dhak Song Play/Pause, Chimes & Close Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* PRIMARY: Authentic Dhak Song Play/Pause (/Dhak-music.mp3) */}
              <button
                onClick={handleToggleDhakMusic}
                title={
                  isDhakPlaying
                    ? "ঢাক থামান (Pause Dhak Music)"
                    : "শারদীয়া ঢাকের গান বাজান (Play Festive Dhak Music)"
                }
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer active:scale-95 ${
                  isDhakPlaying
                    ? "bg-gradient-to-r from-red-600 to-amber-600 border-amber-300 text-white shadow-[0_0_18px_rgba(255,100,20,0.6)] animate-pulse"
                    : "bg-[#251006] hover:bg-[#3d1808] border-[#ff7b1a]/50 text-[#ffd199] hover:text-white"
                }`}
              >
                <span className={`text-xs sm:text-sm ${isDhakPlaying ? "animate-bounce" : ""}`}>
                  🥁
                </span>
                <span className="text-[11px] font-semibold hidden xs:inline">
                  {isDhakPlaying ? "Dhak Playing" : "Play Dhak"}
                </span>
                {isDhakPlaying ? (
                  <span className="text-xs">⏸</span>
                ) : (
                  <span className="text-[10px] opacity-75">▶</span>
                )}
              </button>

              {/* Shankha Chime */}
              <button
                onClick={() => handlePlayChime("shankha")}
                title="শঙ্খধ্বনি (Play Sacred Conch)"
                className="p-1.5 sm:p-2 rounded-full bg-[#1e0f06] hover:bg-[#381a0b] border border-[#ff7b1a]/40 text-[#ffd199] hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <span
                  className={`text-xs sm:text-sm ${
                    playingChime === "shankha" ? "animate-spin" : ""
                  }`}
                >
                  🐚
                </span>
              </button>

              {/* Temple Bell */}
              <button
                onClick={() => handlePlayChime("bell")}
                title="কাঁসর-ঘণ্টা (Play Temple Bell)"
                className="p-1.5 sm:p-2 rounded-full bg-[#1e0f06] hover:bg-[#381a0b] border border-[#ff7b1a]/40 text-[#ffd199] hover:text-white transition-all cursor-pointer active:scale-90"
              >
                <span className="text-xs sm:text-sm">🔔</span>
              </button>

              {/* Close Modal */}
              <button
                onClick={onClose}
                title="বন্ধ করুন (Close Dialog)"
                aria-label="Close Schedule Dialog"
                className="p-1.5 sm:p-2 rounded-full bg-zinc-900/80 hover:bg-red-950/80 border border-zinc-700/60 hover:border-red-500/60 text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-90 ml-1"
              >
                <svg
                  className="w-4 h-4 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.4"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* PSYCHOLOGICAL INCLUSIVITY BAR: 3-Way Language/Script Switcher & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-orange-500/15">
            {/* 3-Mode Pill Switcher */}
            <div className="flex items-center gap-1 bg-[#150a04] p-0.5 rounded-xl border border-[#ff7b1a]/30 self-start sm:self-auto">
              <span className="text-[10px] uppercase font-mono text-orange-300/60 px-2 hidden sm:inline">
                ভাষা / Mode:
              </span>

              {/* Bonglish (Primary for Pravasi Bengalis) */}
              <button
                onClick={() => handleSelectLang("bonglish")}
                title="বাংলা বলতে পারেন কিন্তু পড়তে পারেন না? এই মোডটি আপনার জন্য! (Spoken Bengali in English alphabet)"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  langMode === "bonglish"
                    ? "bg-gradient-to-r from-[#ff7b1a] to-[#ff5722] text-black font-bold shadow-[0_0_12px_rgba(255,123,26,0.6)]"
                    : "text-orange-200/70 hover:text-white hover:bg-orange-500/15"
                }`}
              >
                <span>Bonglish</span>
                <span className="text-[9px] opacity-75 font-mono">(কথ্য)</span>
              </button>

              {/* Bengali Script */}
              <button
                onClick={() => handleSelectLang("bn")}
                title="বিশুদ্ধ বাংলা হরফে পড়ুন (Pure Bengali Script)"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  langMode === "bn"
                    ? "bg-gradient-to-r from-[#ff7b1a] to-[#ff5722] text-black font-bold shadow-[0_0_12px_rgba(255,123,26,0.6)]"
                    : "text-orange-200/70 hover:text-white hover:bg-orange-500/15"
                }`}
              >
                <span>বাংলা</span>
                <span className="text-[9px] opacity-75 font-mono">(লিপি)</span>
              </button>

              {/* English Context */}
              <button
                onClick={() => handleSelectLang("en")}
                title="Read in English with full cultural context & meanings"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                  langMode === "en"
                    ? "bg-gradient-to-r from-[#ff7b1a] to-[#ff5722] text-black font-bold shadow-[0_0_12px_rgba(255,123,26,0.6)]"
                    : "text-orange-200/70 hover:text-white hover:bg-orange-500/15"
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* Quick Keyword Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-orange-400/50 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  langMode === "bn"
                    ? "খুঁজুন (যেমন: অঞ্জলি, ভোগ, ধুনুচি...)"
                    : langMode === "bonglish"
                    ? "Search (e.g. anjali, bhog, dhunuchi)..."
                    : "Search rituals, food, chants..."
                }
                className="w-full pl-7 pr-3 py-1 bg-[#120703] border border-[#ff7b1a]/25 rounded-lg text-xs text-orange-100 placeholder-orange-300/35 focus:outline-none focus:border-[#ff7b1a] focus:ring-1 focus:ring-[#ff7b1a]/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-300/60 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE DHAK MUSIC PLAYBACK BAR (Revealed when playing or toggled) */}
          {(isDhakPlaying || showDhakPlayerBar) && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#200a03] via-[#331105] to-[#200a03] border border-[#ff7b1a]/40 shadow-[0_0_15px_rgba(255,123,26,0.2)] animate-in fade-in duration-300">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm animate-bounce">🥁</span>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-[#ffbe76] truncate block">
                    {langMode === "bn"
                      ? "শারদীয়া ঢাকের গান বাজছে"
                      : "Playing Authentic Sharodiya Dhak"}
                  </span>
                  <span className="text-[10px] text-orange-200/60 font-mono">
                    {formatDuration(dhakCurrentTime)} / {formatDuration(dhakDuration || 360)} • High Quality 320kbps
                  </span>
                </div>
              </div>

              {/* Visualizer Waves & Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-3">
                  {[0.4, 0.8, 1.0, 0.6, 0.9, 0.5].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        height: isDhakPlaying ? `${Math.round(h * 12)}px` : "3px",
                      }}
                      className="w-0.5 rounded-full bg-[#ff7b1a] animate-pulse transition-all"
                    />
                  ))}
                </div>

                <button
                  onClick={handleToggleDhakMusic}
                  className="px-2 py-0.5 rounded-md bg-[#ff7b1a] text-black text-xs font-bold hover:bg-[#ffa502] transition-colors cursor-pointer"
                >
                  {isDhakPlaying ? "Pause" : "Resume"}
                </button>

                <button
                  onClick={() => setShowDhakPlayerBar(false)}
                  className="text-orange-400/60 hover:text-white text-xs p-1 cursor-pointer"
                  title="Hide Dhak Bar"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. HORIZONTAL DAY NAVIGATION RAIL (Segmented days with real-time status pills) */}
        <div
          ref={tabRailRef}
          role="tablist"
          aria-label="Durga Puja Days Navigation"
          className="flex items-center gap-1.5 px-3 sm:px-6 py-2 sm:py-2.5 bg-[#070302] border-b border-[#ff7b1a]/15 overflow-x-auto no-scrollbar flex-shrink-0"
        >
          {DURGA_PUJA_SCHEDULE.map((day) => {
            const isSelected = day.id === selectedDayId;
            const status = realtimeStatus.statuses[day.id] || "upcoming";
            return (
              <button
                key={day.id}
                role="tab"
                data-tab-id={day.id}
                aria-selected={isSelected}
                onClick={() => setSelectedDayId(day.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex-shrink-0 relative ${
                  isSelected
                    ? "bg-gradient-to-r from-[#ff7b1a] to-[#ff4d4d] text-black font-bold shadow-[0_0_18px_rgba(255,123,26,0.65),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-[1.02]"
                    : "text-orange-200/70 hover:text-white hover:bg-[#ff7b1a]/15 border border-transparent hover:border-[#ff7b1a]/30"
                }`}
              >
                <span className="text-xs">{day.icon}</span>
                <span>{t(day.title)}</span>

                {/* Day status badge */}
                {status === "live" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping ml-0.5" />
                )}
                {status === "next" && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 animate-pulse" />
                )}
                {status === "past" && (
                  <span className="text-[9px] opacity-60">✓</span>
                )}

                <span
                  className={`text-[9px] font-mono px-1 rounded ${
                    isSelected
                      ? "bg-black/25 text-black font-bold"
                      : "text-orange-300/50"
                  }`}
                >
                  {langMode === "bn" ? day.number : day.numberRoman}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3. SCROLLABLE ACTIVE DAY SHOWCASE */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 no-scrollbar">
          {/* A. REAL-TIME COUNTDOWN CARD: "পূজোর ক'টা দিন বাকি?" (Live Countdown Engine) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#170803] via-[#240c04] to-[#170803] border border-[#ff7b1a]/50 shadow-[0_0_25px_rgba(255,123,26,0.2)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm animate-pulse">⏳</span>
                  <span className="text-xs sm:text-sm font-bold text-[#ffbe76] tracking-wide">
                    {activeDayStatus === "live" && (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {langMode === "bn"
                          ? `আজ ${t(activeDay.title)} — উৎসবের মহাক্ষণ চলছে!`
                          : `${t(activeDay.title)} is happening Live Right Now!`}
                      </span>
                    )}
                    {activeDayStatus === "past" && (
                      <span className="text-orange-300/70">
                        {langMode === "bn"
                          ? `${t(activeDay.title)} তিথিটি সম্পন্ন হয়েছে`
                          : `${t(activeDay.title)} has concluded`}
                      </span>
                    )}
                    {(activeDayStatus === "upcoming" || activeDayStatus === "next") && (
                      <span>
                        {langMode === "bn"
                          ? `${t(activeDay.title)} ও পুণ্যলগ্নের আর বাকি:`
                          : langMode === "bonglish"
                          ? `${t(activeDay.title)} ash-te ar baki:`
                          : `Countdown to ${t(activeDay.title)}:`}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-[11px] text-orange-200/60 mt-0.5">
                  ⏱️ {t(activeDay.auspiciousTiming)}
                </p>
              </div>

              {/* LIVE DIGIT TICKING BLOCKS */}
              {activeDayCountdown && !activeDayCountdown.isPast && (
                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  {/* Days */}
                  <div className="flex flex-col items-center justify-center w-12 sm:w-14 py-1.5 rounded-xl bg-black/60 border border-[#ff7b1a]/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                    <span className="text-sm sm:text-base font-extrabold text-[#ffd199] font-mono leading-none">
                      {formatDigit(activeDayCountdown.days, langMode)}
                    </span>
                    <span className="text-[9px] uppercase font-mono text-orange-300/70 mt-1">
                      {langMode === "bn" ? "দিন" : "Days"}
                    </span>
                  </div>

                  <span className="text-amber-500 font-bold">:</span>

                  {/* Hours */}
                  <div className="flex flex-col items-center justify-center w-12 sm:w-14 py-1.5 rounded-xl bg-black/60 border border-[#ff7b1a]/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                    <span className="text-sm sm:text-base font-extrabold text-[#ffd199] font-mono leading-none">
                      {formatDigit(activeDayCountdown.hours, langMode)}
                    </span>
                    <span className="text-[9px] uppercase font-mono text-orange-300/70 mt-1">
                      {langMode === "bn" ? "ঘণ্টা" : "Hours"}
                    </span>
                  </div>

                  <span className="text-amber-500 font-bold">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center justify-center w-12 sm:w-14 py-1.5 rounded-xl bg-black/60 border border-[#ff7b1a]/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                    <span className="text-sm sm:text-base font-extrabold text-[#ffd199] font-mono leading-none">
                      {formatDigit(activeDayCountdown.minutes, langMode)}
                    </span>
                    <span className="text-[9px] uppercase font-mono text-orange-300/70 mt-1">
                      {langMode === "bn" ? "মিনিট" : "Mins"}
                    </span>
                  </div>

                  <span className="text-amber-500 font-bold">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center justify-center w-12 sm:w-14 py-1.5 rounded-xl bg-black/60 border border-[#ff7b1a]/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]">
                    <span className="text-sm sm:text-base font-extrabold text-[#ff7b1a] font-mono leading-none animate-pulse">
                      {formatDigit(activeDayCountdown.seconds, langMode)}
                    </span>
                    <span className="text-[9px] uppercase font-mono text-orange-300/70 mt-1">
                      {langMode === "bn" ? "সেকেন্ড" : "Secs"}
                    </span>
                  </div>
                </div>
              )}

              {/* Status if Past */}
              {activeDayStatus === "past" && (
                <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-orange-500/20 text-orange-300/70 text-xs font-serif italic">
                  ✨ আসছে বছর আবার হবে!
                </div>
              )}
            </div>
          </div>

          {/* B. HERO BANNER CARD */}
          <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1a0c05] via-[#120703] to-[#241006] border border-[#ff7b1a]/40 shadow-[0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Background Festive Watermark Icon */}
            <div className="absolute -right-2 -bottom-4 text-7xl sm:text-8xl opacity-10 pointer-events-none select-none">
              {activeDay.icon}
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#ff7b1a] text-black shadow-[0_0_8px_rgba(255,123,26,0.6)]">
                  {langMode === "bn" ? `দিন ${activeDay.number}` : `Day ${activeDay.numberRoman}`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#ff7b1a]/20 text-[#ffd199] border border-[#ff7b1a]/40">
                  {t(activeDay.tithi)}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] text-orange-200/60 bg-black/40">
                  {t(activeDay.phase)}
                </span>

                {/* Diaspora Psychological Reassurance Badge */}
                {langMode === "bonglish" && (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-600/30">
                    Spoken Bengali (কথ্য বাংলা)
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#ffbe76] tracking-wide drop-shadow-[0_2px_8px_rgba(255,190,118,0.3)] flex items-baseline gap-2 flex-wrap">
                  <span>{t(activeDay.title)}</span>
                  {/* Subtle Bengali Calligraphy Sub-Pill when in Bonglish/English */}
                  {langMode !== "bn" && (
                    <span className="text-sm font-normal text-orange-300/60 bg-black/40 px-2 py-0.5 rounded-md border border-orange-500/20 font-serif">
                      {activeDay.title.bn}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-normal text-orange-200/60">
                    — {t(activeDay.subtitle)}
                  </span>
                </h3>

                <span className="text-[11px] sm:text-xs text-[#ffd199] font-medium flex items-center gap-1 flex-shrink-0">
                  ⏱️ {t(activeDay.auspiciousTiming)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed font-sans mt-1">
                {t(activeDay.summary)}
              </p>

              {/* Poetic Tagline & Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-[#ff7b1a]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs italic text-[#ffbe76]/90 font-serif">
                  <span>✨</span>
                  <span>"{t(activeDay.heroVerse)}"</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Quick Dhak Button */}
                  <button
                    onClick={handleToggleDhakMusic}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#2b1206] hover:bg-[#ff7b1a]/25 border border-[#ff7b1a]/40 text-[#ffd199] hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    <span>🥁</span>
                    <span>{isDhakPlaying ? "Pause Dhak" : "Play Dhak"}</span>
                  </button>

                  {/* Share with Family Button */}
                  <button
                    onClick={handleShareDay}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#241006] hover:bg-[#ff7b1a]/20 border border-[#ff7b1a]/40 text-[#ffd199] hover:text-white transition-all cursor-pointer active:scale-95"
                  >
                    <span>{sharedStatus ? "✓" : "📲"}</span>
                    <span>
                      {sharedStatus
                        ? "কপি হয়েছে!"
                        : langMode === "bn"
                        ? "পরিবারকে জানান"
                        : "Share with Family"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* C. SECTION FILTER TABS (Quick jump between categories) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              {
                id: "all",
                label:
                  langMode === "bn"
                    ? "সমগ্র বিবরণ"
                    : langMode === "bonglish"
                    ? "Shob Biboron (All)"
                    : "Full Overview",
                icon: "📑",
              },
              {
                id: "rituals",
                label:
                  langMode === "bn"
                    ? "মূল শাস্ত্রীয় আচার"
                    : langMode === "bonglish"
                    ? "Shastro Niyom (Rituals)"
                    : "Sacred Rituals",
                icon: "🕉️",
              },
              {
                id: "vibes",
                label:
                  langMode === "bn"
                    ? "বাঙালির সংস্কৃতি"
                    : langMode === "bonglish"
                    ? "Bangalir Abeg (Traditions)"
                    : "Cultural Vibes",
                icon: "🥁",
              },
              {
                id: "bhog",
                label:
                  langMode === "bn"
                    ? "মহাভোগ ও প্রসাদ"
                    : langMode === "bonglish"
                    ? "Maha Bhog & Prasad"
                    : "Sacred Food & Feast",
                icon: "🍲",
              },
              {
                id: "mantra",
                label:
                  langMode === "bn"
                    ? "পুষ্পাঞ্জলি মন্ত্র"
                    : langMode === "bonglish"
                    ? "Pushpanjali Mantra"
                    : "Sacred Chant",
                icon: "📜",
              },
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-1 rounded-lg text-[11px] sm:text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none flex items-center gap-1.5 ${
                  activeSection === sec.id
                    ? "bg-[#ff7b1a]/25 text-[#ffd199] border border-[#ff7b1a] shadow-[0_0_12px_rgba(255,123,26,0.3)] font-semibold"
                    : "bg-[#120804]/80 text-orange-200/60 hover:text-white border border-orange-500/15"
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            ))}
          </div>

          {/* D. RITUALS GRID */}
          {(activeSection === "all" || activeSection === "rituals") && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#ffd199] tracking-wider uppercase">
                <div className="flex items-center gap-2">
                  <span>🕉️</span>
                  <span>
                    {langMode === "bn"
                      ? "প্রধান শাস্ত্রীয় বিধি ও আচার"
                      : langMode === "bonglish"
                      ? "Prodhan Shastriya Niyom o Achar"
                      : "Essential Sacred Rituals"}
                  </span>
                </div>
                <span className="text-[10px] text-orange-300/50 font-mono">
                  ({filteredRituals.length} {langMode === "bn" ? "টি বিধি" : "rituals"})
                </span>
              </div>

              {filteredRituals.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#120804]/60 border border-orange-500/15 text-center text-xs text-orange-300/60">
                  {langMode === "bn"
                    ? "কোনো আচার খুঁজে পাওয়া যায়নি।"
                    : "No rituals matched your search."}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredRituals.map((ritual, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#120804]/90 border border-[#ff7b1a]/25 hover:border-[#ff7b1a]/55 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#ff7b1a]/20 text-[#ffbe76] text-[10px] font-bold flex items-center justify-center font-mono border border-[#ff7b1a]/30">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-orange-100 group-hover:text-[#ffd199] transition-colors flex items-baseline gap-1.5 flex-wrap">
                          <span>{t(ritual.title)}</span>
                          {langMode !== "bn" && ritual.title.bn && (
                            <span className="text-[10px] text-orange-300/50 font-serif">
                              ({ritual.title.bn})
                            </span>
                          )}
                        </h4>
                      </div>
                      <p className="text-[11px] sm:text-xs text-orange-200/70 leading-relaxed font-sans pl-7">
                        {t(ritual.desc)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* E. CULTURAL VIBES & BENGALI EMOTIONS */}
          {(activeSection === "all" || activeSection === "vibes") && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#170a05] to-[#200e06] border border-[#ff7b1a]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffd199] tracking-wider uppercase">
                <span>🥁</span>
                <span>
                  {langMode === "bn"
                    ? "বাঙালির আবেগ ও সংস্কৃতি"
                    : langMode === "bonglish"
                    ? "Bangalir Abeg o Shonshkriti"
                    : "Cultural Atmosphere & Diaspora Sentiment"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100/85 leading-relaxed font-sans">
                {t(activeDay.culturalVibes)}
              </p>
            </div>
          )}

          {/* F. BHOG & PRASAD */}
          {(activeSection === "all" || activeSection === "bhog") && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#120804]/90 border border-[#ff7b1a]/30 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffd199] tracking-wider uppercase">
                <span>🍲</span>
                <span>
                  {langMode === "bn"
                    ? "মহাভোগ ও প্রসাদ আহার"
                    : langMode === "bonglish"
                    ? "Maha Bhog o Prasad Ahar"
                    : "Traditional Sacred Bhog & Festive Feast"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-orange-100/85 leading-relaxed font-sans">
                {t(activeDay.bhogAndPrasad)}
              </p>
            </div>
          )}

          {/* G. SACRED ANJALI MANTRA CARD (With 1-Tap Copy & Phonetics) */}
          {(activeSection === "all" || activeSection === "mantra") && (
            <div className="p-4 rounded-2xl bg-[#140804] border border-[#ff7b1a]/40 shadow-[0_0_20px_rgba(255,123,26,0.15)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📜</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#ffbe76]">
                    {langMode === "bn"
                      ? "পবিত্র পুষ্পাঞ্জলি মন্ত্র ও স্তোত্র"
                      : langMode === "bonglish"
                      ? "Pabitra Pushpanjali Mantra & Pronam"
                      : "Sacred Flower Offering Chant (Pushpanjali)"}
                  </span>
                </div>

                <button
                  onClick={handleCopyMantra}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    copiedMantra
                      ? "bg-emerald-500 text-black font-bold shadow-[0_0_12px_#10b981]"
                      : "bg-[#241006] text-[#ffd199] hover:bg-[#ff7b1a]/25 border border-[#ff7b1a]/40"
                  }`}
                >
                  <span>{copiedMantra ? "✓" : "📋"}</span>
                  <span>
                    {copiedMantra
                      ? langMode === "bn"
                        ? "কপি হয়েছে!"
                        : "Copied!"
                      : langMode === "bn"
                      ? "মন্ত্র কপি করুন"
                      : "Copy Mantra"}
                  </span>
                </button>
              </div>

              {/* Sanskrit-Bengali Original Verse */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-[#ff7b1a]/20">
                <span className="text-[10px] font-mono uppercase text-orange-300/50 block mb-1">
                  মূল স্তোত্র (Original Sacred Sloka):
                </span>
                <pre className="text-xs sm:text-sm text-[#ffd199] font-serif leading-relaxed whitespace-pre-wrap font-sans">
                  {activeDay.mantra.sanskritBengali}
                </pre>
              </div>

              {/* Phonetic Pronunciation (Crucial for diaspora Bengalis who speak Bangla) */}
              <div className="space-y-1 p-3 rounded-xl bg-[#190c05]/60 border border-[#ff7b1a]/15">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#ffbe76] tracking-wider font-semibold">
                    🗣️ উচ্চারণ ও পাঠ বিধি (How to Chant / Phonetics):
                  </span>
                  <span className="text-[9px] text-orange-300/60 font-mono">
                    Read aloud easily
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-orange-100 font-mono italic whitespace-pre-wrap leading-relaxed">
                  {activeDay.mantra.phonetic}
                </p>
              </div>

              {/* Meaning in Chosen Language */}
              <div className="space-y-1 pt-1 border-t border-[#ff7b1a]/15">
                <span className="text-[10px] font-mono uppercase text-orange-300/60 tracking-wider">
                  ভাবার্থ (Spiritual Meaning):
                </span>
                <p className="text-[11px] sm:text-xs text-orange-200/85 font-sans leading-relaxed">
                  {t(activeDay.mantra.meaning)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. FOOTER: Navigation Next/Prev + Day Counters */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-[#ff7b1a]/25 bg-[#0a0503] flex-shrink-0">
          <button
            onClick={handlePrevDay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-orange-200/80 hover:text-white bg-[#1e0f06] hover:bg-[#381a0b] border border-[#ff7b1a]/30 transition-all cursor-pointer active:scale-95"
          >
            <span>←</span>
            <span className="hidden sm:inline">
              {langMode === "bn" ? "পূর্ববর্তী দিন" : "Previous Day"}
            </span>
            <span className="sm:hidden">
              {langMode === "bn" ? "আগের" : "Prev"}
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-orange-200/60 font-mono">
            <span>{langMode === "bn" ? activeDay.number : activeDay.numberRoman}</span>
            <span>/</span>
            <span>{langMode === "bn" ? "০৮" : "08"}</span>
            <span className="hidden sm:inline ml-1.5 font-sans text-[11px] text-[#ffbe76]">
              • {t(activeDay.title)}
            </span>
          </div>

          <button
            onClick={handleNextDay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-orange-200/80 hover:text-white bg-[#1e0f06] hover:bg-[#381a0b] border border-[#ff7b1a]/30 transition-all cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">
              {langMode === "bn" ? "পরবর্তী দিন" : "Next Day"}
            </span>
            <span className="sm:hidden">
              {langMode === "bn" ? "পরের" : "Next"}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
