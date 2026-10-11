"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import {
  getDawnAudioEngine,
  AUDIO_SOURCES,
  KOLKATA_RADIO_STATIONS,
  MAHALAYA_CHAPTERS,
} from "@/utils/audioEngine";
import { usePWA } from "./PWAProvider";

// Format seconds into MM:SS or H:MM:SS
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";
  const sec = Math.floor(seconds);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}:${remM.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function DawnMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState("mahalaya"); // "mahalaya" | "bangla-radio"
  const [radioState, setRadioState] = useState("idle");
  const [chapter, setChapter] = useState({
    title: "Aswiner Sharada Prate",
    subtitle: "Birendra Krishna Bhadra • Intro",
    cover: "/covers/cover-1.jpg",
  });
  const [currentStation, setCurrentStation] = useState(
    KOLKATA_RADIO_STATIONS[0],
  );
  const [stationIndex, setStationIndex] = useState(0);
  const [showCapsules, setShowCapsules] = useState(false); // Hidden by default; toggles on CD player click
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5400);
  const [equalizerBars, setEqualizerBars] = useState([0.15, 0.25, 0.18, 0.3]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { requestWakeLock } = usePWA();

  // Reduced motion media query listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Preload chapter covers & radio artwork for instantaneous transitions
  useEffect(() => {
    [1, 2, 3, 4, 5].forEach((num) => {
      const img = new Image();
      img.src = `/covers/cover-${num}.jpg`;
    });
    const radioImg = new Image();
    radioImg.src = "/covers/radio-bangla.jpg";
  }, []);

  // Dragging & Elastic Physics State
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef(null);
  const animRef = useRef(null);
  const tweenRef = useRef(null);

  const dragPhysics = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    currentRot: 0,
    hasMoved: false,
  });

  // Sync state and live frequency visualizer with AudioEngine
  useEffect(() => {
    const audio = getDawnAudioEngine();
    if (!audio) return;

    const handleSync = (eng) => {
      setIsPlaying(eng.isPlaying);
      setActiveSourceId(eng.activeSourceId);
      setRadioState(eng.radioState);
      setChapter(eng.getCurrentChapter());
      setCurrentTime(eng.currentTime);
      if (eng.getCurrentKolkataStation) {
        setCurrentStation(eng.getCurrentKolkataStation());
        setStationIndex(eng.currentKolkataStationIndex);
      }
      if (eng.duration) setDuration(eng.duration);
    };

    const unsubscribe = audio.subscribe(handleSync);

    // Initial state check
    setIsPlaying(audio.isPlaying);
    setActiveSourceId(audio.activeSourceId);
    setRadioState(audio.radioState);
    setChapter(audio.getCurrentChapter());
    setCurrentTime(audio.currentTime);
    if (audio.getCurrentKolkataStation) {
      setCurrentStation(audio.getCurrentKolkataStation());
      setStationIndex(audio.currentKolkataStationIndex);
    }

    // 60FPS Live Equalizer Frequency Loop (reacts to both Mahalaya & Radio)
    const loop = () => {
      if (audio.isPlaying) {
        const bands = audio.getEqualizerData();
        setEqualizerBars(bands);
      }
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      unsubscribe();
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // --- ELASTIC DRAG & SNAP-BACK PHYSICS ---
  const handlePointerDown = (e) => {
    if (e.target.closest("button") || e.target.closest(".no-drag")) {
      return;
    }

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const phys = dragPhysics.current;
    phys.isDown = true;
    phys.hasMoved = false;
    phys.startX = e.clientX;
    phys.startY = e.clientY;
    setIsDragging(true);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  const handlePointerMove = useCallback((e) => {
    const phys = dragPhysics.current;
    if (!phys.isDown) return;

    const rawDx = e.clientX - phys.startX;
    const rawDy = e.clientY - phys.startY;
    const dist = Math.hypot(rawDx, rawDy);

    if (dist > 4) {
      phys.hasMoved = true;
    }

    const tensionLimit = 360;
    const resistedDist = (dist * tensionLimit) / (dist + tensionLimit);
    const ratio = dist > 0 ? resistedDist / dist : 0;

    const resistedX = rawDx * ratio;
    const resistedY = rawDy * ratio;

    const tilt = Math.max(-14, Math.min(14, resistedX * 0.05));

    phys.currentX = resistedX;
    phys.currentY = resistedY;
    phys.currentRot = tilt;

    if (cardRef.current) {
      cardRef.current.style.transform = `translate3d(${resistedX.toFixed(2)}px, ${resistedY.toFixed(2)}px, 0px) rotate(${tilt.toFixed(2)}deg)`;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    const phys = dragPhysics.current;
    if (!phys.isDown) return;

    phys.isDown = false;
    setIsDragging(false);
    setTimeout(() => {
      phys.hasMoved = false;
    }, 50);

    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerUp);

    // GSAP Harmonic Elastic Snap-Back
    tweenRef.current = gsap.to(phys, {
      currentX: 0,
      currentY: 0,
      currentRot: 0,
      duration: 0.92,
      ease: "elastic.out(1.15, 0.36)",
      onUpdate: () => {
        if (cardRef.current) {
          cardRef.current.style.transform = `translate3d(${phys.currentX.toFixed(2)}px, ${phys.currentY.toFixed(2)}px, 0px) rotate(${phys.currentRot.toFixed(2)}deg)`;
        }
      },
      onComplete: () => {
        if (cardRef.current) {
          cardRef.current.style.transform = "none";
        }
      },
    });
  }, [handlePointerMove]);

  // Audio Playback Controls
  const handleTogglePlay = async (e) => {
    e.stopPropagation();
    if (isDragging) return;
    const audio = getDawnAudioEngine();
    if (!audio) return;
    if (!isPlaying && requestWakeLock) {
      requestWakeLock().catch(() => {});
    }
    await audio.toggle();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const audio = getDawnAudioEngine();
    if (!audio) return;
    audio.nextChapter();
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const audio = getDawnAudioEngine();
    if (!audio) return;
    audio.prevChapter();
  };

  const handleCDClick = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    setShowCapsules((prev) => !prev);
  };

  const handleSelectStation = async (idx) => {
    const audio = getDawnAudioEngine();
    if (audio) {
      await audio.setKolkataStation(idx);
    }
  };

  const handleSelectChapter = (idx) => {
    const audio = getDawnAudioEngine();
    if (audio) {
      const targetTime = MAHALAYA_CHAPTERS[idx].timeStart;
      audio.currentChapterIndex = idx;
      audio.currentTime = targetTime;
      audio.seekTo(targetTime);
      audio.updateMediaSessionMetadata();
      audio.notifyListeners();
      if (!audio.isPlaying) {
        audio.toggle();
      }
    }
  };

  const handleSelectSource = async (sourceId) => {
    const audio = getDawnAudioEngine();
    if (!audio) return;
    await audio.setSource(sourceId);
  };

  const handleRetryRadio = (e) => {
    e.stopPropagation();
    const audio = getDawnAudioEngine();
    if (!audio) return;
    audio.retryRadio();
  };

  // Determine active CD cover image
  const currentCover =
    activeSourceId === "bangla-radio"
      ? AUDIO_SOURCES["bangla-radio"].artwork
      : activeSourceId === "dhak"
      ? AUDIO_SOURCES.dhak?.artwork || "/covers/cover-2.jpg"
      : chapter?.cover || "/covers/cover-1.jpg";

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-30 w-[94vw] sm:w-[92vw] max-w-2xl select-none"
      style={{
        bottom: "max(1.125rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))",
      }}
      role="region"
      aria-label="Atmospheric Audio & Radio Player"
    >
      {/* 1. ZERO-GAP CAPSULE DRAWER DIRECTLY ABOVE CD PLAYER (Hidden by default, reveals on CD player click) */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ease-out no-drag flex justify-center ${
          showCapsules
            ? "max-h-20 opacity-100 mb-2 translate-y-0"
            : "max-h-0 opacity-0 mb-0 -translate-y-1 pointer-events-none"
        }`}
        aria-hidden={!showCapsules}
      >
        <div
          className="inline-flex items-stretch gap-0 rounded-full bg-[#0c0806]/95 backdrop-blur-xl border-[1.5px] border-[#ff7b1a] shadow-[0_0_20px_rgba(255,123,26,0.35),0_0_40px_rgba(255,123,26,0.15),inset_0_0_10px_rgba(255,123,26,0.08)] p-0.5 sm:p-1 overflow-hidden"
          role="tablist"
          aria-label="Audio Mode Selector"
        >
          {/* Capsule 1: মহিষাসুরমর্দ্দিনী */}
          <button
            role="tab"
            aria-selected={activeSourceId === "mahalaya"}
            aria-label="Mahalaya Chandipath recording"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSource("mahalaya");
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-4 text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border-r border-[#ff7b1a]/40 rounded-l-full select-none ${
              activeSourceId === "mahalaya"
                ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_14px_rgba(255,123,26,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                : "text-orange-200/80 hover:text-white hover:bg-[#ff7b1a]/20"
            }`}
          >
            <span className="text-[10px] sm:text-xs">💿</span>
            <span className="truncate">মহিষাসুরমর্দ্দিনী</span>
          </button>

          {/* Capsule 2: কলকাতা রেডিও (India) */}
          <button
            role="tab"
            aria-selected={activeSourceId === "bangla-radio"}
            aria-label="Kolkata West Bengal India live radio stations"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSource("bangla-radio");
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-4 text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border-r border-[#ff7b1a]/40 select-none ${
              activeSourceId === "bangla-radio"
                ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_14px_rgba(255,123,26,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                : "text-orange-200/80 hover:text-white hover:bg-[#ff7b1a]/20"
            }`}
          >
            <span className="text-[10px] sm:text-xs">📻</span>
            <span className="truncate">কলকাতা রেডিও</span>
            {activeSourceId === "bangla-radio" && isPlaying && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeSourceId === "bangla-radio" ? "bg-red-700" : "bg-red-500"
                } ml-0.5 shadow-[0_0_6px_#ff0000] ${
                  prefersReducedMotion ? "opacity-100" : "animate-pulse"
                }`}
              />
            )}
          </button>

          {/* Capsule 3: উৎসবের ঢাক (Dhak Music) */}
          <button
            role="tab"
            aria-selected={activeSourceId === "dhak"}
            aria-label="Festive Bengali Durga Puja Dhak Music"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectSource("dhak");
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3 text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border-r border-[#ff7b1a]/40 select-none ${
              activeSourceId === "dhak"
                ? "bg-[#ff7b1a] text-black font-bold shadow-[0_0_14px_rgba(255,123,26,0.7),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                : "text-orange-200/80 hover:text-white hover:bg-[#ff7b1a]/20"
            }`}
          >
            <span className={`text-[10px] sm:text-xs ${activeSourceId === "dhak" && isPlaying ? "animate-bounce" : ""}`}>🥁</span>
            <span className="truncate">ঢাকের বোল</span>
            {activeSourceId === "dhak" && isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5 shadow-[0_0_6px_#10b981] animate-pulse" />
            )}
          </button>

          {/* Capsule 4: প্রদীপ অর্ঘ্য (Light a Diya / Patronage) */}
          <button
            role="tab"
            aria-label="Light a Sacred Diya & Support Soundscape"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new Event("open_diya_modal"));
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3 text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer border-r border-[#ff7b1a]/40 select-none text-amber-200/90 hover:text-white hover:bg-[#ff7b1a]/30 group"
          >
            <span className="text-[10px] sm:text-xs animate-pulse">🪔</span>
            <span className="truncate">প্রদীপ অর্ঘ্য</span>
          </button>

          {/* Capsule 5: পুজোর নির্ঘণ্ট (Durga Puja Schedule & Rituals) */}
          <button
            role="tab"
            aria-label="Bengali Durga Puja Schedule & Daily Rituals"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new Event("open_puja_schedule"));
            }}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3 text-[10px] sm:text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer rounded-r-full select-none text-amber-200/90 hover:text-white hover:bg-[#ff7b1a]/30 group"
          >
            <span className="text-[10px] sm:text-xs group-hover:scale-110 transition-transform">📜</span>
            <span className="truncate hidden sm:inline">নির্ঘণ্ট • Schedule</span>
            <span className="truncate sm:hidden">Schedule</span>
          </button>
        </div>
      </div>

      {/* 2. DRAGGABLE PLAYER CAPSULE WITH ELASTIC TENSION FEEDBACK */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onClick={(e) => {
          if (dragPhysics.current.hasMoved || isDragging) return;
          if (e.target.closest("button") || e.target.closest("a")) return;
          setShowCapsules((prev) => !prev);
        }}
        style={{
          touchAction: "none",
        }}
        className={`relative flex items-center justify-between px-2.5 py-2 sm:px-4 sm:py-3 rounded-2xl bg-[#0c0806]/94 backdrop-blur-xl border-[1.5px] border-[#ff7b1a] transition-shadow duration-300 ${
          isDragging
            ? "cursor-grabbing shadow-[0_15px_35px_rgba(255,123,26,0.5),0_0_65px_rgba(255,123,26,0.25)]"
            : "cursor-grab shadow-[0_0_25px_rgba(255,123,26,0.35),0_0_55px_rgba(255,123,26,0.15),inset_0_0_15px_rgba(255,123,26,0.08)] hover:shadow-[0_0_35px_rgba(255,123,26,0.5),0_0_65px_rgba(255,123,26,0.22)]"
        }`}
      >
        {/* LEFT: 2026 Dynamic Rotating CD/Vinyl with Dynamic Artwork & Hologram */}
        <div
          className="relative flex-shrink-0 group cursor-pointer no-drag select-none"
          onClick={handleCDClick}
          title={
            showCapsules
              ? "Hide channels list (ক্লিক করে লুকান)"
              : "Click CD to view channels list (চ্যানেল তালিকা দেখুন)"
          }
          role="button"
          tabIndex={0}
          aria-label={
            showCapsules ? "Hide channel capsules" : "Show channel capsules"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCDClick(e);
            }
          }}
        >
          {/* Sympathetic Audio-Reactive Outer Aura (breathes with bass & mid frequency) */}
          <div
            className="absolute -inset-1 rounded-full transition-all duration-150 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,123,26,0.5) 0%, rgba(255,190,118,0.2) 60%, transparent 80%)",
              opacity: isPlaying
                ? 0.65 + (equalizerBars[0] + equalizerBars[1]) * 0.45
                : 0.2,
              filter: `blur(${
                isPlaying ? 6 + (equalizerBars[0] + equalizerBars[1]) * 8 : 4
              }px)`,
              transform: isPlaying
                ? `scale(${1 + (equalizerBars[0] + equalizerBars[1]) * 0.14})`
                : "scale(1)",
            }}
          />

          {/* THE ROTATING VINYL / CD DISC */}
          <div
            className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full border-[1.5px] border-[#ff7b1a] shadow-[0_0_16px_rgba(255,123,26,0.45)] flex items-center justify-center overflow-hidden bg-[#0a0503]"
            style={{
              animationName: prefersReducedMotion ? "none" : "spin",
              animationDuration: "10s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: isPlaying ? "running" : "paused",
              willChange: "transform",
            }}
          >
            {/* Dynamic Song / Radio Cover Artwork */}
            <img
              src={currentCover}
              alt={
                activeSourceId === "bangla-radio"
                  ? "Akashvani Bangla Radio"
                  : chapter?.title || "Mahalaya Cover"
              }
              className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-700 ease-out"
            />

            {/* Micro-Grooves Vinyl Texture Overlay */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "repeating-radial-gradient(circle, transparent 0, transparent 2.5px, rgba(0, 0, 0, 0.25) 3.5px, transparent 4.5px)",
              }}
            />

            {/* Dark Vinyl Outer Rim Vignette & Depth */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, transparent 46%, rgba(10,5,3,0.3) 68%, rgba(8,4,2,0.88) 95%, rgba(255,123,26,0.35) 100%)",
              }}
            />

            {/* 2026 Holographic Specular Sheen (Iridescent CD Glare) */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
              style={{
                background:
                  "conic-gradient(from 40deg, transparent 0deg, rgba(255,255,255,0.45) 45deg, transparent 90deg, rgba(255,190,118,0.35) 135deg, transparent 180deg, rgba(255,255,255,0.45) 225deg, transparent 270deg, rgba(255,190,118,0.35) 315deg, transparent 360deg)",
              }}
            />

            {/* Center Spindle Assembly: Metallic Brass Clamp & Spindle Core */}
            <div className="relative z-10 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full border border-[#ffbe76]/85 bg-gradient-to-tr from-[#1f1008] via-[#120804] to-[#2a170b] flex items-center justify-center shadow-[0_0_8px_rgba(255,123,26,0.6),inset_0_1px_3px_rgba(255,255,255,0.3)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#070403] border border-orange-500/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)]" />
            </div>
          </div>
        </div>

        {/* CENTER: Slot with Track Info & Real-Time Equalizer (No seek bar for live radio) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (isDragging) return;
            setShowCapsules((prev) => !prev);
          }}
          title={
            showCapsules
              ? "Hide options (ক্লিক করে লুকান)"
              : "Click to toggle options (অপশন দেখুন)"
          }
          className="flex-1 mx-1.5 sm:mx-3 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-[#ff7b1a]/70 bg-black/50 flex items-center justify-between min-w-0 shadow-[inset_0_0_10px_rgba(255,123,26,0.1)] cursor-pointer hover:border-[#ff7b1a] transition-colors"
        >
          <div className="flex flex-col min-w-0 pr-1">
            {activeSourceId === "mahalaya" ? (
              <>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-[11px] sm:text-sm font-semibold tracking-tight sm:tracking-wide text-[#ffbe76] truncate drop-shadow-[0_0_6px_rgba(255,190,118,0.4)]">
                    <span className="hidden sm:inline">মহিষাসুরমর্দ্দিনী • </span>
                    {chapter.title || "মহিষাসুরমর্দ্দিনী"}
                  </span>
                </div>
                <span className="text-[9.5px] sm:text-xs text-orange-200/65 tracking-wider truncate">
                  {formatTime(currentTime)} / {formatTime(duration)}
                  <span className="hidden sm:inline"> • {chapter.subtitle}</span>
                </span>
              </>
            ) : activeSourceId === "dhak" ? (
              <>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] sm:text-sm font-semibold tracking-tight sm:tracking-wide text-[#ffbe76] truncate drop-shadow-[0_0_6px_rgba(255,190,118,0.4)]">
                    🥁 উৎসবের ঢাকের বোল
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950/70 text-red-300 border border-red-500/30 flex-shrink-0 animate-pulse">
                    PUJA DHAK
                  </span>
                </div>
                <span className="text-[9.5px] sm:text-xs text-orange-200/65 tracking-wider truncate">
                  {formatTime(currentTime)} / {formatTime(duration)}
                  <span className="hidden sm:inline"> • ঐতিহ্যবাহী শারদীয়া বাদ্য</span>
                </span>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] sm:text-sm font-semibold tracking-tight sm:tracking-wide text-[#ffbe76] truncate drop-shadow-[0_0_6px_rgba(255,190,118,0.4)]">
                    {currentStation?.title || "আকাশবাণী কলকাতা"}
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono bg-orange-950/70 text-orange-300 border border-orange-500/30 flex-shrink-0">
                    {stationIndex + 1}/{KOLKATA_RADIO_STATIONS.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[9.5px] sm:text-xs tracking-wider truncate">
                  {radioState === "connecting" && (
                    <span className="text-amber-300/80 animate-pulse truncate">
                      Connecting...
                    </span>
                  )}
                  {radioState === "buffering" && (
                    <span className="text-amber-300/80 animate-pulse truncate">
                      Buffering...
                    </span>
                  )}
                  {radioState === "reconnecting" && (
                    <span className="text-amber-400 animate-pulse truncate">
                      Reconnecting...
                    </span>
                  )}
                  {radioState === "error" && (
                    <span className="text-red-400 flex items-center gap-1 truncate">
                      Stream offline •
                      <button
                        onClick={handleRetryRadio}
                        className="underline text-orange-300 hover:text-white cursor-pointer"
                      >
                        Retry
                      </button>
                    </span>
                  )}
                  {radioState === "offline" && (
                    <span className="text-red-400 truncate">
                      Offline
                    </span>
                  )}
                  {(radioState === "playing" ||
                    radioState === "paused" ||
                    radioState === "idle") && (
                    <div className="flex items-center gap-1 text-orange-200/70 truncate">
                      <span className="inline-flex items-center gap-1 text-red-400 font-bold flex-shrink-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full bg-red-500 ${
                            isPlaying && !prefersReducedMotion
                              ? "animate-ping"
                              : ""
                          }`}
                        />
                        <span>● LIVE</span>
                      </span>
                      <span className="truncate">
                        • {currentStation?.frequency || "Kolkata"}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Dynamic Equalizer Visualizer Bars synced directly with audio frequencies */}
          <div
            className="flex items-end gap-0.5 sm:gap-1 h-4 sm:h-6 flex-shrink-0 pl-1"
            aria-hidden="true"
          >
            {equalizerBars.map((level, i) => {
              const heightPx = Math.max(3, Math.round(level * 22));
              return (
                <span
                  key={i}
                  style={{
                    height: isPlaying ? `${heightPx}px` : "4px",
                  }}
                  className="w-0.5 sm:w-1 rounded-full bg-gradient-to-t from-[#ff7b1a] via-[#ffa502] to-[#ffd199] shadow-[0_0_8px_#ff7b1a] transition-all duration-75"
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT: Navigation & Play Controls (Interactive buttons ignore drag) */}
        <div className="flex items-center gap-0.5 sm:gap-2 flex-shrink-0 no-drag">
          {/* Previous Button (<) — works for both Mahalaya Chapters and Kolkata Radio Channels */}
          <button
            onClick={handlePrev}
            aria-label={
              activeSourceId === "bangla-radio"
                ? "Previous Kolkata Radio Station"
                : "Previous Chapter"
            }
            title={
              activeSourceId === "bangla-radio"
                ? `Previous Station: ${
                    KOLKATA_RADIO_STATIONS[
                      (stationIndex - 1 + KOLKATA_RADIO_STATIONS.length) %
                        KOLKATA_RADIO_STATIONS.length
                    ]?.title
                  }`
                : "Previous Chapter (পূর্ববর্তী অধ্যায়)"
            }
            className="p-1 sm:p-2 rounded-lg text-[#ff7b1a] hover:text-[#ffbe76] hover:bg-orange-500/15 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 stroke-current drop-shadow-[0_0_8px_rgba(255,123,26,0.6)]"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={handleTogglePlay}
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
            title={isPlaying ? "Pause" : "Play"}
            className="p-1 sm:p-2 rounded-full border border-[#ff7b1a] text-[#ff7b1a] hover:text-[#ffe4cc] hover:bg-[#ff7b1a]/20 hover:shadow-[0_0_16px_#ff7b1a] active:scale-90 transition-all duration-200 cursor-pointer"
          >
            {isPlaying ? (
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current drop-shadow-[0_0_8px_#ff7b1a]"
                viewBox="0 0 24 24"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current drop-shadow-[0_0_8px_#ff7b1a] translate-x-0.5"
                viewBox="0 0 24 24"
              >
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>

          {/* Next Button (>) — works for both Mahalaya Chapters and Kolkata Radio Channels */}
          <button
            onClick={handleNext}
            aria-label={
              activeSourceId === "bangla-radio"
                ? "Next Kolkata Radio Station"
                : "Next Chapter"
            }
            title={
              activeSourceId === "bangla-radio"
                ? `Next Station: ${
                    KOLKATA_RADIO_STATIONS[
                      (stationIndex + 1) % KOLKATA_RADIO_STATIONS.length
                    ]?.title
                  }`
                : "Next Chapter (পরবর্তী অধ্যায়)"
            }
            className="p-1 sm:p-2 rounded-lg text-[#ff7b1a] hover:text-[#ffbe76] hover:bg-orange-500/15 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 stroke-current drop-shadow-[0_0_8px_rgba(255,123,26,0.6)]"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
