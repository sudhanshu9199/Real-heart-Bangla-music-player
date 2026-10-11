"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLivingDarshan } from "@/utils/durgaDarshanEngine";
import { PRAHAR_SLOTS, DARSHAN_MANTRAS } from "@/data/durgaDarshanCatalog";
import { playDevotionalChime } from "@/utils/devotionalChimes";
import { getDhakAudioEngine } from "@/utils/dhakAudioEngine";

export default function DurgaDarshanModal({ isOpen, onClose }) {
  const { currentSlot, countdown, todayTimeline } = useLivingDarshan();
  
  // Selected slot for viewing (defaults to active live slot)
  const [selectedSlotId, setSelectedSlotId] = useState(currentSlot?.id || "sandhya");
  
  // Fullscreen wallpaper view mode
  const [isFullscreenView, setIsFullscreenView] = useState(false);
  
  // Script / Language mode: "bonglish" | "bn" | "en"
  const [langMode, setLangMode] = useState("bonglish");
  
  // Copied state
  const [copiedMantra, setCopiedMantra] = useState(false);
  
  // Audio chimes
  const [playingChime, setPlayingChime] = useState(null);
  
  // Dhak audio sync
  const [isDhakPlaying, setIsDhakPlaying] = useState(false);

  // Sync selected slot to active slot on open
  useEffect(() => {
    if (isOpen && currentSlot?.id) {
      setSelectedSlotId(currentSlot.id);
    }
  }, [isOpen, currentSlot?.id]);

  // Load saved language preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("durga_puja_schedule_lang_mode");
      if (saved && ["bn", "bonglish", "en"].includes(saved)) {
        setLangMode(saved);
      }
    } catch {}
  }, []);

  // Sync Dhak audio state
  useEffect(() => {
    const dhak = getDhakAudioEngine();
    if (!dhak) return;
    const unsub = dhak.subscribe((eng) => setIsDhakPlaying(eng.isPlaying));
    return () => unsub();
  }, []);

  // Currently viewed slot data
  const viewedSlot = useMemo(() => {
    return PRAHAR_SLOTS.find((s) => s.id === selectedSlotId) || currentSlot;
  }, [selectedSlotId, currentSlot]);

  const isViewingLiveSlot = viewedSlot.id === currentSlot.id;

  // Language switcher
  const handleSelectLang = (mode) => {
    setLangMode(mode);
    try {
      localStorage.setItem("durga_puja_schedule_lang_mode", mode);
    } catch {}
  };

  // Play chime
  const handleChime = (type) => {
    setPlayingChime(type);
    playDevotionalChime(type);
    setTimeout(() => setPlayingChime(null), type === "shankha" ? 1800 : 900);
  };

  // Toggle Dhak
  const handleToggleDhak = () => {
    const dhak = getDhakAudioEngine();
    if (dhak) dhak.toggle();
  };

  // Copy mantra
  const handleCopyMantra = () => {
    const m = DARSHAN_MANTRAS.pranam;
    const text = `${m.title}\n\n${m.sanskrit}\n\n${m.phonetic}\n\n${m.meaning[langMode] || m.meaning.bonglish}`;
    navigator.clipboard.writeText(text);
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2200);
  };

  // Share to WhatsApp
  const handleShare = () => {
    const text = `🪷 শ্রীশ্রী দুর্গা দর্শন ২০২৬ 🪷\n${viewedSlot.nameBn}\nসময়: ${viewedSlot.timeRange}\n\n${viewedSlot.ritual[langMode] || viewedSlot.ritual.bonglish}\n\nআজকের মহালয়া ও দুর্গাপূজা দর্শন শুনুন এবং দেখুন: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isFullscreenView) {
          setIsFullscreenView(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreenView, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="স্বর্গীয় চার প্রহর দুর্গা দর্শন"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* FULLSCREEN WALLPAPER IMMERSION MODE */}
      {isFullscreenView ? (
        <div
          className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={() => setIsFullscreenView(false)}
        >
          <img
            src={viewedSlot.image}
            alt={viewedSlot.nameBn}
            className="w-full h-full object-contain object-center drop-shadow-[0_0_50px_rgba(255,123,26,0.5)]"
          />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-orange-500/50 text-amber-200 text-xs flex items-center gap-2">
            <span>✕ প্রস্থান (Click anywhere or ESC to exit)</span>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-orange-500/50 text-amber-200 text-sm font-medium flex items-center gap-3">
            <span>{viewedSlot.icon} {viewedSlot.nameBn}</span>
            <span className="text-orange-400">•</span>
            <span className="text-orange-300/80">{viewedSlot.timeRange}</span>
          </div>
        </div>
      ) : (
        /* MAIN 2026 OBSIDIAN GLASS CHASSIS */
        <div
          className="relative w-full max-w-4xl max-h-[94dvh] sm:max-h-[90vh] flex flex-col rounded-3xl bg-[#080402]/98 border border-[#ff7b1a]/45 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_70px_rgba(255,123,26,0.28),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-3xl overflow-hidden transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Amber Light Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff7b1a] to-transparent pointer-events-none" />

          {/* 1. HEADER: Title, Script Switcher & Close */}
          <div className="flex flex-col gap-2.5 px-4 sm:px-6 pt-4 pb-3 border-b border-[#ff7b1a]/25 bg-[#0e0603]/95 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              {/* Emblem & Title */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#2a1306] to-[#451e08] border border-[#ff7b1a]/60 flex items-center justify-center text-sm sm:text-base shadow-[0_0_14px_rgba(255,123,26,0.45)] flex-shrink-0">
                  🪷
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#ffbe76] tracking-wide truncate flex items-center gap-2">
                    {langMode === "bn" && "স্বর্গীয় চার প্রহর দুর্গা দর্শন ২০২৬"}
                    {langMode === "bonglish" && "Living 4-Prahar Durga Darshan 2026"}
                    {langMode === "en" && "Sacred Living Durga Darshan 2026"}
                    
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-500/40 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      LIVE
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-orange-200/65 truncate">
                    {langMode === "bn" && "দিনে ৪ বার তিথি অনুযায়ী স্বয়ংক্রিয় রূপবদল • ভোর, দুপুর, সন্ধ্যা ও নিশীথ"}
                    {langMode === "bonglish" && "Automatically shifts 4 times daily • Dawn, Midday, Evening & Midnight"}
                    {langMode === "en" && "Autonomous 4-phase daily darshan • Morning, Midday, Twilight & Midnight"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full border border-orange-500/40 text-orange-300 hover:text-white hover:bg-orange-500/20 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* 3-Script Mode Switcher */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#ff7b1a]/15">
              <span className="text-[10px] sm:text-[11px] text-orange-300/75 uppercase tracking-wider font-mono">
                Script / ভাষা:
              </span>
              <div className="flex items-center gap-1 bg-[#1a0c06] p-0.5 rounded-full border border-[#ff7b1a]/30">
                <button
                  onClick={() => handleSelectLang("bonglish")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                    langMode === "bonglish"
                      ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_8px_#ff7b1a]"
                      : "text-orange-200/70 hover:text-white"
                  }`}
                >
                  Bonglish (কথ্য)
                </button>
                <button
                  onClick={() => handleSelectLang("bn")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                    langMode === "bn"
                      ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_8px_#ff7b1a]"
                      : "text-orange-200/70 hover:text-white"
                  }`}
                >
                  বাংলা (লিপি)
                </button>
                <button
                  onClick={() => handleSelectLang("en")}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                    langMode === "en"
                      ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_8px_#ff7b1a]"
                      : "text-orange-200/70 hover:text-white"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* 2. PRAHAR STEPPER TABS (4 Quarters of the Day) */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#0a0503] border-b border-[#ff7b1a]/20 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
            {todayTimeline.map((slot) => {
              const isSelected = slot.id === selectedSlotId;
              const isLive = slot.id === currentSlot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex-shrink-0 border ${
                    isSelected
                      ? "bg-[#ff7b1a]/25 border-[#ff7b1a] text-amber-200 shadow-[0_0_12px_rgba(255,123,26,0.35)]"
                      : "bg-black/40 border-orange-500/20 text-orange-200/70 hover:text-white hover:border-orange-500/40"
                  }`}
                >
                  <span>{slot.icon}</span>
                  <span className="whitespace-nowrap">
                    {langMode === "bn" ? slot.nameBn : langMode === "bonglish" ? slot.nameBonglish : slot.nameEn}
                  </span>
                  {isLive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping ml-0.5" />
                  )}
                </button>
              );
            })}

            {!isViewingLiveSlot && (
              <button
                onClick={() => setSelectedSlotId(currentSlot.id)}
                className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-500/50 hover:bg-red-900 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {langMode === "bn" ? "লাইভ দর্শনে ফিরুন" : "Back to Live"}
              </button>
            )}
          </div>

          {/* 3. SCROLLABLE CONTENT BODY */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
            {/* A. HERO IMAGE CHASSIS */}
            <div className="relative w-full aspect-video sm:h-[42vh] rounded-2xl overflow-hidden border border-[#ff7b1a]/50 shadow-[0_0_30px_rgba(255,123,26,0.25)] group bg-black flex-shrink-0">
              <img
                src={viewedSlot.image}
                alt={viewedSlot.nameBn}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />

              {/* Shimmer & Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Image Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/75 backdrop-blur-md border border-[#ff7b1a]/60 text-amber-200 shadow-[0_0_12px_rgba(255,123,26,0.5)] flex items-center gap-1.5">
                  <span>{viewedSlot.icon}</span>
                  <span>{viewedSlot.timeRange}</span>
                </span>
                {isViewingLiveSlot && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-600/90 text-white shadow-[0_0_12px_#ef4444] animate-pulse">
                    ● এখন চলমান (CURRENT PRAHAR)
                  </span>
                )}
              </div>

              {/* Fullscreen Expansion Button */}
              <button
                onClick={() => setIsFullscreenView(true)}
                title="পূর্ণ দর্শনে দেখুন (Fullscreen Wallpaper View)"
                className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs bg-black/75 backdrop-blur-md border border-[#ff7b1a]/50 text-amber-200 hover:text-white hover:bg-orange-500/40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">পূর্ণ দর্শন (Full View)</span>
              </button>

              {/* Bottom Image Overlay Details */}
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2 pointer-events-none">
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {langMode === "bn" ? viewedSlot.nameBn : langMode === "bonglish" ? viewedSlot.nameBonglish : viewedSlot.nameEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-orange-200/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] line-clamp-1">
                    {viewedSlot.significance[langMode] || viewedSlot.significance.bonglish}
                  </p>
                </div>
              </div>
            </div>

            {/* B. LIVE COUNTDOWN BANNER (How much time left for next image change) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-[#210d05] via-[#1a0a04] to-[#210d05] border border-[#ff7b1a]/40 shadow-[0_0_20px_rgba(255,123,26,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/50 flex items-center justify-center text-lg animate-pulse flex-shrink-0">
                  ⏳
                </div>
                <div>
                  <div className="text-xs text-orange-300 font-medium">
                    {langMode === "bn" && "পরবর্তী রূপ পরিবর্তন (Next Darshan Transformation):"}
                    {langMode === "bonglish" && "Next Darshan Image Transformation:"}
                    {langMode === "en" && "Next Circadian Image Shift:"}
                  </div>
                  <div className="text-sm font-bold text-amber-100 flex items-center gap-1.5">
                    <span>{countdown.nextSlot?.icon}</span>
                    <span>{langMode === "bn" ? countdown.nextSlot?.nameBn : countdown.nextSlot?.nameBonglish}</span>
                  </div>
                </div>
              </div>

              {/* Digital Countdown Timer */}
              <div className="flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold text-amber-200 bg-black/60 px-3.5 py-1.5 rounded-xl border border-orange-500/40 shadow-[inset_0_0_8px_rgba(255,123,26,0.3)]">
                <span className="text-orange-400 text-xs">আর</span>
                <span>{countdown.hours.toString().padStart(2, "0")}h</span>
                <span className="text-orange-500">:</span>
                <span>{countdown.minutes.toString().padStart(2, "0")}m</span>
                <span className="text-orange-500">:</span>
                <span className="text-[#ff7b1a]">{countdown.seconds.toString().padStart(2, "0")}s</span>
              </div>
            </div>

            {/* C. RITUAL CONTEXT & CULTURAL SIGNIFICANCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Daily Ritual Box */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-orange-500/25 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  <span>📜 শাস্ত্রীয় বিধি ও আরতি</span>
                  <span>• Rituals</span>
                </div>
                <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed">
                  {viewedSlot.ritual[langMode] || viewedSlot.ritual.bonglish}
                </p>
              </div>

              {/* Devotional Significance Box */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-orange-500/25 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  <span>✨ আধ্যাত্মিক মাহাত্ম্য</span>
                  <span>• Significance</span>
                </div>
                <p className="text-xs sm:text-sm text-orange-100/90 leading-relaxed">
                  {viewedSlot.significance[langMode] || viewedSlot.significance.bonglish}
                </p>
              </div>
            </div>

            {/* D. SACRED MANTRAS & DEVOTIONAL CHIMES */}
            <div className="p-4 rounded-2xl bg-[#140803] border border-[#ff7b1a]/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🪔</span>
                  <span className="text-xs sm:text-sm font-bold text-[#ffbe76]">
                    {DARSHAN_MANTRAS.pranam.title}
                  </span>
                </div>
                <button
                  onClick={handleCopyMantra}
                  className="px-2.5 py-1 rounded-lg text-xs bg-orange-500/20 border border-orange-500/40 text-amber-200 hover:text-white hover:bg-orange-500/30 transition-all cursor-pointer"
                >
                  {copiedMantra ? "✓ অনুলিপি হয়েছে (Copied!)" : "📋 কপি করুন (Copy)"}
                </button>
              </div>

              {/* Sanskrit Mantra with Phonetics */}
              <div className="p-3 rounded-xl bg-black/60 border border-orange-500/20 font-serif text-center flex flex-col gap-1">
                <div className="text-sm sm:text-base text-amber-200 font-bold whitespace-pre-line leading-relaxed">
                  {DARSHAN_MANTRAS.pranam.sanskrit}
                </div>
                <div className="text-xs text-orange-300/80 italic font-mono pt-1">
                  {DARSHAN_MANTRAS.pranam.phonetic}
                </div>
              </div>

              {/* Meaning */}
              <p className="text-xs text-orange-200/75 leading-relaxed text-center">
                {DARSHAN_MANTRAS.pranam.meaning[langMode] || DARSHAN_MANTRAS.pranam.meaning.bonglish}
              </p>

              {/* Devotional Sound Buttons (Shankha, Bell, Dhak) */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-orange-500/20">
                <button
                  onClick={() => handleChime("shankha")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    playingChime === "shankha"
                      ? "bg-amber-500 text-black font-bold shadow-[0_0_12px_#f59e0b]"
                      : "bg-black/40 border-orange-500/40 text-amber-200 hover:bg-orange-500/20"
                  }`}
                >
                  <span>🐚</span>
                  <span>শঙ্খধ্বনি (Shankha)</span>
                </button>

                <button
                  onClick={() => handleChime("bell")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    playingChime === "bell"
                      ? "bg-amber-500 text-black font-bold shadow-[0_0_12px_#f59e0b]"
                      : "bg-black/40 border-orange-500/40 text-amber-200 hover:bg-orange-500/20"
                  }`}
                >
                  <span>🔔</span>
                  <span>কাঁসর-ঘণ্টা (Bell)</span>
                </button>

                <button
                  onClick={handleToggleDhak}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDhakPlaying
                      ? "bg-red-600 text-white font-bold shadow-[0_0_14px_rgba(239,68,68,0.7)] animate-pulse"
                      : "bg-black/40 border-orange-500/40 text-amber-200 hover:bg-orange-500/20"
                  }`}
                >
                  <span>🥁</span>
                  <span>{isDhakPlaying ? "ঢাক থামান (Pause Dhak)" : "ঢাক বাজান (Play Dhak)"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border bg-emerald-950/70 border-emerald-500/40 text-emerald-200 hover:bg-emerald-900 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <span>💬</span>
                  <span>শেয়ার করুন (Share)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
