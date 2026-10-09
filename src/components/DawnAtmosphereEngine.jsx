"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import AtmosphereCanvas from "./AtmosphereCanvas";
import DawnMusicPlayer from "./DawnMusicPlayer";
import FestiveLandscapeLayer from "./FestiveLandscapeLayer";
import { calculateSolarState } from "@/utils/solarCalculator";
import { getDawnAudioEngine } from "@/utils/audioEngine";

import MahalayaLoader from "./MahalayaLoader";

// Utility to extract continuous decimal hour from the local real-time clock
function getRealTimeDecimal() {
  const now = new Date();
  return (
    now.getHours() +
    now.getMinutes() / 60 +
    now.getSeconds() / 3600 +
    now.getMilliseconds() / 3600000
  );
}

export default function DawnAtmosphereEngine() {
  // 1. Autonomous Real-Time Clock Synchronization
  const [timeDecimal, setTimeDecimal] = useState(getRealTimeDecimal);
  const [dayOfMonth, setDayOfMonth] = useState(() => new Date().getDate());
  const [isLoading, setIsLoading] = useState(false);

  // Compute live solar atmospheric physics based on exact real-time clock
  const solarState = useMemo(() => {
    return calculateSolarState(dayOfMonth, timeDecimal);
  }, [dayOfMonth, timeDecimal]);

  // High-precision real-time clock driver (60/120 FPS sub-second continuous synchronization)
  useEffect(() => {
    let frameId;

    const updateToRealTime = () => {
      setTimeDecimal(getRealTimeDecimal());
      setDayOfMonth(new Date().getDate());
      frameId = requestAnimationFrame(updateToRealTime);
    };

    frameId = requestAnimationFrame(updateToRealTime);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Sync procedural audio engine with real solar altitude
  useEffect(() => {
    const audio = getDawnAudioEngine();
    if (audio && audio.isPlaying) {
      audio.updateAtmosphere(solarState.altitude);
    }
  }, [solarState.altitude]);

  return (
    <main suppressHydrationWarning className="relative w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {/* 1. 4K High-Fidelity Atmosphere Canvas Engine (Sky, 3-Tier Clouds, Sun, Rays, Stars, Trees, Road) */}
      <AtmosphereCanvas
        solarState={solarState}
        layersVisible={{
          farClouds: true,
          midClouds: true,
          nearClouds: true,
          valleyMist: true,
          godRays: true,
          landscape: true,
          stars: true,
        }}
        fogDensity={1.0}
        cloudDensity={1.0}
        windSpeed={1.0}
      />

      {/* 2. Interactive Dual-Layer Landscape: Peaceful Dawn & Durga Puja Ziggling Reveal */}
      <FestiveLandscapeLayer />

      {/* 3. Cinematic Subtle Vignette */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_58%,rgba(0,0,0,0.42)_100%)]" />

      {/* 4. Mahalaya Chandipath Audio Player Capsule */}
      <DawnMusicPlayer />

      {/* 5. Replay Loader Trigger HUD (Visible when loader is closed) */}
      {!isLoading && (
        <button
          onClick={() => setIsLoading(true)}
          title="Replay Mahalaya Bloub Animation Loader (50s)"
          className="fixed top-5 left-5 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/70 hover:bg-red-950/60 border border-zinc-800 hover:border-red-500/40 backdrop-blur-md text-[11px] font-mono text-zinc-300 hover:text-red-300 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-pointer group"
        >
          <img
            src="/bloub-cercle-attentif-rouge-anime.svg"
            alt=""
            className="w-4 h-4 object-contain group-hover:scale-110 transition-transform"
          />
          <span className="tracking-wider">Replay Loader</span>
        </button>
      )}

      {/* 6. Mahalaya Bloub Animation Loader Overlay (~50 seconds exploration) */}
      {isLoading && (
        <MahalayaLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* NOTE: No atmosphere engine controllers are rendered — it operates 100% autonomously on real-time */}
    </main>
  );
}
