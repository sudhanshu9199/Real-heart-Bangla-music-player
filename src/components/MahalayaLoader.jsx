"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * MahalayaLoader — 2026 Interactive Creative Architecture
 * 
 * Requirements:
 * 1. FIXED CENTER RED BLOB WITH DYNAMIC EYE TRACKING:
 *    - The blob body is fixed at the exact center of the page (X & Y axis).
 *    - Only its eyes move, actively tracking the user's cursor across the entire screen.
 *    - Smooth spring-interpolated pupil gaze and natural lifelike blinks.
 * 
 * 2. TRANSPARENT "MAHALAYA" TEXT (MATCHES BG COLOR):
 *    - Text covers ~95vw across the viewport behind the blob.
 *    - Base state: Transparent, seamlessly matching the dark background (#050308).
 *    - Hover reveal: When the cursor sweeps over the text, ONLY the hovered area
 *      ignites in radiant festive colors (saffron gold, vermilion #e8483f, ruby).
 * 
 * 3. 50-SECOND CONTEMPLATIVE TIMELINE & EXPLORATION:
 *    - 50-second countdown with progress HUD.
 *    - Interactive ambient star dust & click ember bursts.
 *    - "Enter Sanctuary" skip button.
 */

const DURATION_SECONDS = 50;

// Exact geometry paths extracted from public/bloub-cercle-attentif-rouge-anime.svg
const BLOB_BODY_PATH =
  "M100.19 0.33C100.19 3.6 100.03 6.88 99.71 10.13C99.39 13.38 98.9 16.63 98.27 19.84C97.63 23.04 96.83 26.23 95.88 29.36C94.93 32.48 93.83 35.58 92.58 38.6C91.33 41.62 89.92 44.59 88.38 47.47C86.84 50.35 85.15 53.17 83.33 55.89C81.52 58.6 79.56 61.24 77.49 63.77C75.42 66.29 73.21 68.73 70.9 71.04C68.59 73.35 66.15 75.56 63.63 77.63C61.1 79.7 58.46 81.66 55.74 83.48C53.03 85.29 50.21 86.98 47.33 88.52C44.45 90.06 41.47 91.47 38.46 92.72C35.44 93.97 32.34 95.07 29.22 96.02C26.09 96.97 22.9 97.77 19.7 98.41C16.49 99.04 13.24 99.53 9.99 99.85C6.74 100.17 3.45 100.33 0.19 100.33C-3.08 100.33 -6.36 100.17 -9.61 99.85C-12.87 99.53 -16.12 99.04 -19.32 98.41C-22.53 97.77 -25.71 96.97 -28.84 96.02C-31.97 95.07 -35.06 93.97 -38.08 92.72C-41.1 91.47 -44.07 90.06 -46.95 88.52C-49.83 86.98 -52.65 85.29 -55.37 83.48C-58.09 81.66 -60.73 79.7 -63.25 77.63C-65.78 75.56 -68.21 73.35 -70.52 71.04C-72.83 68.73 -75.04 66.29 -77.11 63.77C-79.19 61.24 -81.14 58.6 -82.96 55.89C-84.77 53.17 -86.46 50.35 -88 47.47C-89.54 44.59 -90.95 41.62 -92.2 38.6C-93.45 35.58 -94.56 32.48 -95.51 29.36C-96.46 26.23 -97.25 23.04 -97.89 19.84C-98.53 16.63 -99.01 13.38 -99.33 10.13C-99.65 6.88 -99.81 3.6 -99.81 0.33C-99.81 -2.94 -99.65 -6.22 -99.33 -9.47C-99.01 -12.72 -98.53 -15.98 -97.89 -19.18C-97.25 -22.38 -96.46 -25.57 -95.51 -28.7C-94.56 -31.83 -93.45 -34.92 -92.2 -37.94C-90.95 -40.96 -89.54 -43.93 -88 -46.81C-86.46 -49.69 -84.77 -52.51 -82.96 -55.23C-81.14 -57.94 -79.19 -60.58 -77.11 -63.11C-75.04 -65.64 -72.83 -68.07 -70.52 -70.38C-68.21 -72.69 -65.78 -74.9 -63.25 -76.97C-60.73 -79.04 -58.09 -81 -55.37 -82.82C-52.65 -84.63 -49.83 -86.32 -46.95 -87.86C-44.07 -89.4 -41.1 -90.81 -38.08 -92.06C-35.06 -93.31 -31.97 -94.42 -28.84 -95.37C-25.71 -96.31 -22.53 -97.11 -19.32 -97.75C-16.12 -98.39 -12.87 -98.87 -9.61 -99.19C-6.36 -99.51 -3.08 -99.67 0.19 -99.67C3.45 -99.67 6.74 -99.51 9.99 -99.19C13.24 -98.87 16.49 -98.39 19.7 -97.75C22.9 -97.11 26.09 -96.31 29.22 -95.37C32.34 -94.42 35.44 -93.31 38.46 -92.06C41.47 -90.81 44.45 -89.4 47.33 -87.86C50.21 -86.32 53.03 -84.63 55.74 -82.82C58.46 -81 61.1 -79.04 63.63 -76.97C66.15 -74.9 68.59 -72.69 70.9 -70.38C73.21 -68.07 75.42 -65.64 77.49 -63.11C79.56 -60.58 81.52 -57.94 83.33 -55.23C85.15 -52.51 86.84 -49.69 88.38 -46.81C89.92 -43.93 91.33 -40.96 92.58 -37.94C93.83 -34.92 94.93 -31.83 95.88 -28.7C96.83 -25.57 97.63 -22.38 98.27 -19.18C98.9 -15.98 99.39 -12.72 99.71 -9.47C100.03 -6.22 100.19 -2.94 100.19 0.33Z";

const EYE_PILL_PATH =
  "M-10.5 -11.5A10.5 10.5 0 0 1 0 -22L0 -22A10.5 10.5 0 0 1 10.5 -11.5L10.5 11.5A10.5 10.5 0 0 1 0 22L0 22A10.5 10.5 0 0 1 -10.5 11.5Z";

const PHASES = [
  {
    start: 0,
    end: 12,
    badge: "01 / 04",
    title: "Brahma Muhurta (4:00 AM)",
    desc: "The sacred twilight realm awakens as celestial stars whisper the arrival of autumn dawn.",
  },
  {
    start: 12,
    end: 25,
    badge: "02 / 04",
    title: "Living Guardian Gaze",
    desc: "The red bloub watches your cursor intently. Move across the dark void to guide its eyes.",
  },
  {
    start: 25,
    end: 38,
    badge: "03 / 04",
    title: "Mahishasuramardini Secret Inscription",
    desc: "Sweep your cursor over the invisible text to reveal the sacred golden syllables of Mahalaya.",
  },
  {
    start: 38,
    end: 50,
    badge: "04 / 04",
    title: "Divine Dawn Portal Materialization",
    desc: "The gates of the golden sanctuary align. Prepare to enter the living dawn atmosphere.",
  },
];

export default function MahalayaLoader({ onComplete }) {
  const containerRef = useRef(null);
  const blobWrapperRef = useRef(null);
  const eye0Ref = useRef(null);
  const eye1Ref = useRef(null);
  const textContainerRef = useRef(null);
  const spotlightTextRef = useRef(null);
  const cursorBeamRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  // Time & Progress State
  const [elapsed, setElapsed] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  // High-performance physics state
  const physicsRef = useRef({
    // Cursor target position
    cursorX: 0,
    cursorY: 0,
    // Smooth spotlight position
    spotlightX: 0,
    spotlightY: 0,
    // Eye tracking offset
    eyeTargetX: 0,
    eyeTargetY: 0,
    eyeCurrentX: 0,
    eyeCurrentY: 0,
    // Blink control
    blinkProgress: 0,
    nextBlinkTime: 2.5,
    isBlinking: false,
    // General timer
    time: 0,
    particles: [],
  });

  // Calculate current active phase
  useEffect(() => {
    const currentPhase = PHASES.findIndex(
      (p) => elapsed >= p.start && elapsed < p.end
    );
    if (currentPhase !== -1 && currentPhase !== activePhaseIndex) {
      setActivePhaseIndex(currentPhase);
    }
  }, [elapsed, activePhaseIndex]);

  // Main 50-Second Countdown Timer
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const diffSec = (now - startTime) / 1000;

      if (diffSec >= DURATION_SECONDS) {
        setElapsed(DURATION_SECONDS);
        clearInterval(interval);
        handleEnterSanctuary();
      } else {
        setElapsed(diffSec);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Initialize Center Cursor Coordinates
  useEffect(() => {
    const initCenter = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      physicsRef.current.cursorX = w / 2;
      physicsRef.current.cursorY = h / 2;
      physicsRef.current.spotlightX = w / 2;
      physicsRef.current.spotlightY = h / 2;
    };

    initCenter();
    window.addEventListener("resize", initCenter);
    return () => window.removeEventListener("resize", initCenter);
  }, []);

  // Pointer Move Event (Mouse & Touch)
  const handlePointerMove = useCallback((e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX != null && clientY != null) {
      const p = physicsRef.current;
      p.cursorX = clientX;
      p.cursorY = clientY;

      // Calculate directional vector from screen center to cursor
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const deltaX = clientX - screenCenterX;
      const deltaY = clientY - screenCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.45;
      const normDist = Math.min(distance / maxDistance, 1.0);

      // Eye gaze displacement range (±14px horizontally, ±10px vertically)
      const lookIntensity = Math.pow(normDist, 0.85);
      p.eyeTargetX = Math.cos(angle) * lookIntensity * 14;
      p.eyeTargetY = Math.sin(angle) * lookIntensity * 10;

      // Spawn subtle glowing dust motes behind cursor
      if (Math.random() < 0.35 && p.particles.length < 80) {
        p.particles.push({
          x: clientX + (Math.random() - 0.5) * 20,
          y: clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 2.5 + 1,
          alpha: 1,
          color: Math.random() > 0.4 ? "#ffd166" : "#e8483f",
          life: 1,
          decay: Math.random() * 0.025 + 0.015,
        });
      }
    }
  }, []);

  // Pointer Down (Click Ember Burst)
  const handlePointerDown = useCallback((e) => {
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    if (clientX != null && clientY != null) {
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1.5;
        physicsRef.current.particles.push({
          x: clientX,
          y: clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.2,
          alpha: 1,
          color: i % 3 === 0 ? "#ffd166" : i % 3 === 1 ? "#e8483f" : "#ff9f1c",
          life: 1,
          decay: Math.random() * 0.02 + 0.012,
        });
      }
    }
  }, []);

  // Outro Transition & Completion
  const handleEnterSanctuary = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    if (containerRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // 1. Blob expands in divine radiance
      if (blobWrapperRef.current) {
        tl.to(
          blobWrapperRef.current,
          {
            scale: 2.6,
            opacity: 0,
            filter: "brightness(2.2) blur(10px)",
            duration: 0.85,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 2. Text radiates and ascends
      if (textContainerRef.current) {
        tl.to(
          textContainerRef.current,
          {
            opacity: 0,
            scale: 1.05,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0.1
        );
      }

      // 3. Whole container dissolves into the dawn sanctuary
      tl.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.9,
          ease: "power3.inOut",
        },
        0.25
      );
    } else {
      if (onComplete) onComplete();
    }
  }, [isExiting, onComplete]);

  // Main 120 FPS Loop: Eye Motion & Cursor Spotlight
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Subtle star dust particles
    const stars = Array.from({ length: 48 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.6,
      baseAlpha: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      phase: Math.random() * Math.PI * 2,
    }));

    const updateLoop = () => {
      const p = physicsRef.current;
      p.time += 0.016;

      // 1. Smooth Spotlight Lerp following cursor
      p.spotlightX += (p.cursorX - p.spotlightX) * 0.22;
      p.spotlightY += (p.cursorY - p.spotlightY) * 0.22;

      // 2. Update Cursor Spotlight Mask on the "MAHALAYA" Text
      // The text is completely transparent and matches #050308.
      // ONLY the area under the cursor gets illuminated with color!
      if (spotlightTextRef.current) {
        const radius = 195;
        const mask = `radial-gradient(circle ${radius}px at ${p.spotlightX}px ${p.spotlightY}px, black 0%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.18) 72%, transparent 100%)`;
        spotlightTextRef.current.style.webkitMaskImage = mask;
        spotlightTextRef.current.style.maskImage = mask;
      }

      // 3. Move the Cursor Flashlight Beam Lens
      if (cursorBeamRef.current) {
        cursorBeamRef.current.style.transform = `translate3d(${p.spotlightX}px, ${p.spotlightY}px, 0) translate(-50%, -50%)`;
      }

      // 4. Spring Eye Tracking Physics (Fixed in Center, Only Eyes Move!)
      p.eyeCurrentX += (p.eyeTargetX - p.eyeCurrentX) * 0.15;
      p.eyeCurrentY += (p.eyeTargetY - p.eyeCurrentY) * 0.15;

      // Natural Lifelike Blinking Mechanism
      if (!p.isBlinking && p.time >= p.nextBlinkTime) {
        p.isBlinking = true;
        p.blinkProgress = 0;
      }

      let eyeScaleY = 1.0;
      if (p.isBlinking) {
        p.blinkProgress += 0.12;
        if (p.blinkProgress < 0.5) {
          // Closing
          eyeScaleY = Math.max(0.12, 1.0 - p.blinkProgress * 1.76);
        } else if (p.blinkProgress <= 1.0) {
          // Opening
          eyeScaleY = Math.min(1.0, 0.12 + (p.blinkProgress - 0.5) * 1.76);
        } else {
          // Finished blink
          p.isBlinking = false;
          p.blinkProgress = 0;
          p.nextBlinkTime = p.time + 3.0 + Math.random() * 2.0; // Next blink in 3-5 seconds
        }
      }

      // Eye base translations from the original SVG:
      // Left eye default: (-16.5, -9.0)
      // Right eye default: (37.0, -11.5)
      const leftEyeX = -16.5 + p.eyeCurrentX;
      const leftEyeY = -9.0 + p.eyeCurrentY;
      const rightEyeX = 37.0 + p.eyeCurrentX;
      const rightEyeY = -11.5 + p.eyeCurrentY;

      if (eye0Ref.current) {
        eye0Ref.current.setAttribute(
          "transform",
          `matrix(0.98, -0.05, 0.08, ${0.99 * eyeScaleY}, ${leftEyeX.toFixed(2)}, ${leftEyeY.toFixed(2)})`
        );
      }
      if (eye1Ref.current) {
        eye1Ref.current.setAttribute(
          "transform",
          `matrix(0.92, -0.03, 0.08, ${0.99 * eyeScaleY}, ${rightEyeX.toFixed(2)}, ${rightEyeY.toFixed(2)})`
        );
      }

      // Gentle subtle breathing on the fixed central blob
      if (blobWrapperRef.current) {
        const breathe = 1.0 + Math.sin(p.time * 2.2) * 0.018;
        blobWrapperRef.current.style.transform = `translate(-50%, -50%) scale(${breathe})`;
      }

      // 5. Draw Particle Canvas (Embers & Star Dust)
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A. Subtle Stars
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const alpha = s.baseAlpha + Math.sin(p.time * s.pulseSpeed * 60 + s.phase) * 0.2;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 200, ${Math.max(0, alpha)})`;
          ctx.fill();
        }

        // B. Active Sparks & Embers
        for (let i = p.particles.length - 1; i >= 0; i--) {
          const pt = p.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.035;
          pt.alpha -= pt.decay;

          if (pt.alpha <= 0) {
            p.particles.splice(i, 1);
            continue;
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size * pt.alpha, 0, Math.PI * 2);
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = pt.color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Derived metrics
  const progressPercent = Math.min(100, Math.round((elapsed / DURATION_SECONDS) * 100));
  const remainingSeconds = Math.max(0, Math.ceil(DURATION_SECONDS - elapsed));
  const currentPhaseData = PHASES[activePhaseIndex] || PHASES[0];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className={`fixed inset-0 z-50 overflow-hidden bg-[#050308] select-none flex flex-col justify-between cursor-crosshair transition-opacity duration-700 ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ touchAction: "none" }}
    >
      {/* 1. Ambient Background Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* 2. Atmospheric Dark Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(3,2,6,0.95)_100%)]" />

      {/* 3. Header HUD: Sacred Identity & Skip Button */}
      <header className="relative z-30 flex items-center justify-between px-6 md:px-12 pt-6 md:pt-8 w-full pointer-events-auto">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-950/40 border border-red-500/30 shadow-[0_0_15px_rgba(232,72,63,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute opacity-60" />
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-red-400 uppercase font-semibold">
                মহিষাসুরমর্দ্দিনী
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">• 4:00 AM</span>
            </div>
            <p className="text-xs text-zinc-400 font-sans tracking-wide">
              Sacred Autumn Dawn Sanctuary
            </p>
          </div>
        </div>

        {/* Skip / Enter Sanctuary Button */}
        <button
          id="skip-loader-btn"
          onClick={handleEnterSanctuary}
          className="group relative flex items-center gap-2.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-zinc-900/60 hover:bg-red-950/40 border border-zinc-700/60 hover:border-red-500/50 backdrop-blur-md text-xs font-mono text-zinc-300 hover:text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(232,72,63,0.3)] active:scale-95 cursor-pointer"
        >
          <span className="text-zinc-400 group-hover:text-red-400 transition-colors">
            Enter Sanctuary
          </span>
          <span className="flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] bg-red-900/40 border border-red-500/30 text-red-300 font-semibold">
            {remainingSeconds}s
          </span>
          <svg
            className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </header>

      {/* 
        4. TEXT CONTAINER (z-10): Behind the central blob.
        Spans almost the full width (~95vw) of the screen.
        Base layer is TRANSPARENT (matches #050308).
        Spotlight layer reveals the color ONLY where the cursor hovers!
      */}
      <div
        ref={textContainerRef}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none select-none px-4"
      >
        {/* Bengali Calligraphic Tag (Revealed on hover with spotlight) */}
        <div className="mb-2 md:mb-4 text-center">
          <span className="inline-block px-3.5 py-1 rounded-full text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase bg-amber-950/20 border border-amber-500/15 text-amber-300/70 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            বীরেন্দ্রকৃষ্ণ ভদ্র • মহিষাসুরমর্দ্দিনী
          </span>
        </div>

        {/* 
          GRAND "MAHALAYA" TEXT:
          Base: Completely transparent matching the background color (#050308).
          Spotlight: Radiantly filled in festive colors wherever the cursor hovers!
        */}
        <div className="relative w-[95vw] max-w-[1700px] flex items-center justify-center">
          {/* Layer A: Base Transparent Text matching #050308 (Hidden in the dark) */}
          <div
            className="w-full text-center font-black uppercase tracking-wider leading-none whitespace-nowrap"
            style={{
              fontSize: "clamp(3.8rem, 16vw, 16rem)",
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              color: "#050308",
              WebkitTextFillColor: "#050308",
              WebkitTextStroke: "0px transparent",
            }}
          >
            MAHALAYA
          </div>

          {/* Layer B: Color Revealed Text (ONLY visible inside the cursor spotlight!) */}
          <div
            ref={spotlightTextRef}
            className="absolute inset-0 w-full text-center font-black uppercase tracking-wider leading-none whitespace-nowrap flex items-center justify-center will-change-[mask-image]"
            style={{
              fontSize: "clamp(3.8rem, 16vw, 16rem)",
              fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              background:
                "linear-gradient(135deg, #fff7ad 0%, #ffa040 22%, #e8483f 48%, #d81159 74%, #ffd166 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 30px rgba(232, 72, 63, 0.95)) drop-shadow(0 0 60px rgba(255, 160, 64, 0.6))",
              WebkitMaskImage: "radial-gradient(circle 195px at 50% 50%, black 0%, transparent 100%)",
              maskImage: "radial-gradient(circle 195px at 50% 50%, black 0%, transparent 100%)",
            }}
          >
            MAHALAYA
          </div>
        </div>

        {/* Sacred Bengali Chant Line (Transparent base, revealed with spotlight) */}
        <div className="mt-2 md:mt-3 text-center">
          <p
            className="text-base md:text-2xl font-bold tracking-[0.25em] uppercase font-serif"
            style={{
              color: "transparent",
              WebkitTextStroke: "0.5px rgba(255, 220, 180, 0.12)",
              textShadow: "0 0 20px rgba(232, 72, 63, 0.15)",
            }}
          >
            যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা
          </p>
        </div>
      </div>

      {/* 
        5. CURSOR FLASHLIGHT BEAM (z-15):
        Follows cursor position smoothly, providing a soft lantern glow
      */}
      <div
        ref={cursorBeamRef}
        className="fixed top-0 left-0 z-15 pointer-events-none will-change-transform w-80 h-80 rounded-full mix-blend-screen bg-[radial-gradient(circle,rgba(232,72,63,0.22)_0%,rgba(245,158,11,0.1)_45%,transparent_70%)]"
        style={{
          transform: "translate3d(50vw, 50vh, 0) translate(-50%, -50%)",
        }}
      />

      {/* 
        6. FIXED CENTERED RED BLOB (z-20):
        Stationed FIXED in the center of the screen (X & Y axis).
        Only the eyes move to track the cursor wherever it moves on the screen!
      */}
      <div
        ref={blobWrapperRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none will-change-transform flex items-center justify-center"
      >
        {/* Ambient Red Glow Halo */}
        <div className="absolute inset-0 -m-8 rounded-full border border-red-500/20 animate-ping opacity-30" />
        <div className="absolute inset-0 -m-6 rounded-full bg-red-600/15 blur-2xl" />

        {/* Exact Inline SVG with Reactive Eye Tracking */}
        <svg
          width="250"
          height="250"
          viewBox="-125 -125 250 250"
          role="img"
          aria-label="Animated Red Blob Avatar with Reactive Eyes"
          className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_0_35px_rgba(232,72,63,0.8)] select-none pointer-events-none"
        >
          <defs>
            {/* Dynamic Mask: white blob with black eye cutouts */}
            <mask
              id="blob-loader-eye-mask"
              maskUnits="userSpaceOnUse"
              x="-158"
              y="-158"
              width="316"
              height="316"
            >
              {/* Blob Body (White) */}
              <path d={BLOB_BODY_PATH} fill="#fff" />

              {/* Eye 0 (Left Eye Pill - Black Hole) */}
              <path
                ref={eye0Ref}
                d={EYE_PILL_PATH}
                fill="#000"
                style={{ transformBox: "view-box", transformOrigin: "0 0" }}
                transform="matrix(0.98, -0.05, 0.08, 0.99, -16.5, -9.0)"
              />

              {/* Eye 1 (Right Eye Pill - Black Hole) */}
              <path
                ref={eye1Ref}
                d={EYE_PILL_PATH}
                fill="#000"
                style={{ transformBox: "view-box", transformOrigin: "0 0" }}
                transform="matrix(0.92, -0.03, 0.08, 0.99, 37.0, -11.5)"
              />
            </mask>
          </defs>

          <g opacity="1">
            {/* White Eye Sclera / Background Underneath */}
            <path d={BLOB_BODY_PATH} fill="#f9f9f9" />

            {/* Red Blob Body Masked to reveal eye cutouts */}
            <g mask="url(#blob-loader-eye-mask)">
              <rect x="-158" y="-158" width="316" height="316" fill="#e8483f" />
            </g>
          </g>
        </svg>
      </div>

      {/* 7. Footer HUD: 50-Second Timeline & Stage Explorer */}
      <footer className="relative z-30 w-full px-6 md:px-12 pb-6 md:pb-8 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Dynamic 4-Phase Contemplative Guide */}
        <div className="max-w-md text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-red-950/60 border border-red-500/40 text-red-300">
              PHASE {currentPhaseData.badge}
            </span>
            <span className="text-xs font-semibold text-zinc-200 tracking-wide">
              {currentPhaseData.title}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            {currentPhaseData.desc}
          </p>
        </div>

        {/* Right: 50s Progress Bar & Countdown Gauge */}
        <div className="w-full md:w-80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Awakening Dawn Sanctuary
            </span>
            <span className="text-amber-400 font-semibold">
              {Math.round(elapsed)}s / {DURATION_SECONDS}s • {progressPercent}%
            </span>
          </div>

          {/* Golden-Vermilion Progress Line */}
          <div className="relative w-full h-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/40 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-150 ease-out bg-gradient-to-r from-amber-500 via-red-500 to-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.7)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive Exploration Hint */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
            <span>Hover to reveal hidden letters</span>
            <span>Blob watches your cursor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
