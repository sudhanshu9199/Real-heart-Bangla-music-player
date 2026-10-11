"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import AtmosphereCanvas from "./AtmosphereCanvas";
import DawnMusicPlayer from "./DawnMusicPlayer";
import FestiveLandscapeLayer from "./FestiveLandscapeLayer";
import { calculateSolarState } from "@/utils/solarCalculator";
import { getDawnAudioEngine } from "@/utils/audioEngine";

import MahalayaLoader from "./MahalayaLoader";
import LivePresenceBadge from "./LivePresenceBadge";

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
  const [isLoading, setIsLoading] = useState(true);

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
    <main
      suppressHydrationWarning
      className="relative w-screen h-screen h-[100dvh] min-h-[100dvh] overflow-hidden bg-black select-none font-sans"
    >
      {/* 1. 4K High-Fidelity Living Sky Engine (Celestial Stars, 3-Tier Moving Clouds, Sun, Crepuscular Rays, Mist) */}
      {/* NOTE: landscape is set to false because FestiveLandscapeLayer provides the high-res illustrated townscape */}
      <AtmosphereCanvas
        solarState={solarState}
        layersVisible={{
          farClouds: true,
          midClouds: true,
          nearClouds: true,
          valleyMist: true,
          godRays: true,
          landscape: false,
          stars: true,
        }}
        fogDensity={1.0}
        cloudDensity={1.0}
        windSpeed={1.0}
      />

      {/* 2. Interactive Dual-Layer Landscape: Peaceful Dawn & Durga Puja Ziggling Reveal */}
      <FestiveLandscapeLayer />

      {/* 3. Cinematic Subtle Vignette */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.5)_100%)]" />

      {/* 4. Mahalaya Chandipath Audio Player Capsule */}
      <DawnMusicPlayer />

      {/* 5. Top Left HUD: Real-Time Collective Presence Badge */}
      <div className="fixed top-[max(0.875rem,env(safe-area-inset-top))] left-3 sm:left-5 z-30 flex items-center gap-1.5 sm:gap-2">
        <LivePresenceBadge />
      </div>

      {/* 6. Mahalaya Bloub Animation Loader Overlay (~50 seconds exploration) */}
      {isLoading && (
        <MahalayaLoader onComplete={() => setIsLoading(false)} />
      )}

      {/* NOTE: No atmosphere engine controllers are rendered — it operates 100% autonomously on real-time */}
    </main>
  );
}
