"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { getDawnAudioEngine } from "@/utils/audioEngine";

/**
 * Reusable Dawn Townscape Image
 */
function DawnTownscapeImage({ className = "" }) {
  return (
    <img
      src="/upperLayer.png"
      alt="Peaceful Dawn Townscape"
      className={`absolute left-0 right-0 bottom-0 w-full h-full object-cover object-bottom pointer-events-none select-none ${className}`}
      style={{ left: 0, right: 0, bottom: 0 }}
      draggable={false}
    />
  );
}

/**
 * Reusable Durga Puja Festive Image with responsive mobile/desktop art direction
 */
function DurgaPujaFestiveImage({ className = "" }) {
  return (
    <picture className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}>
      {/* Mobile phone portrait screens (max-width: 767px) */}
      <source
        media="(max-width: 767px)"
        srcSet="/DurgaPujaUpperLawer-Mobile.png"
      />
      {/* Desktop & tablet widescreen (min-width: 768px) */}
      <source
        media="(min-width: 768px)"
        srcSet="/DurgaPujaUpperLawer.png"
      />
      <img
        src="/DurgaPujaUpperLawer.png"
        alt="Durga Puja Festive Townscape"
        className="absolute left-0 right-0 bottom-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
        style={{ left: 0, right: 0, bottom: 0 }}
        draggable={false}
      />
    </picture>
  );
}

/**
 * FestiveLandscapeLayer — 2026 Creative Motion Architecture:
 * - Dual-layer landscape: Peaceful Dawn (`upperLayer.png`) & Durga Puja (`DurgaPujaUpperLawer.png`)
 * - GSAP-driven double-click / double-tap layer inversion (vice-versa)
 * - Epicenter-originating radial shockwave expansion clip-path
 * - 3D depth push & settle with bloom illumination
 * - Responsive mobile phone art direction (/DurgaPujaUpperLawer-Mobile.png)
 * - Multi-harmonic Catmull-Rom ziggling flame rim with live audio resonance
 * - Buoyant marigold ember sparks system + shockwave blast
 */
export default function FestiveLandscapeLayer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const hintRef = useRef(null);
  const baseLayerRef = useRef(null);
  const transitionLayerRef = useRef(null);

  // Layer state: false = Dawn base / Durga Puja portal; true = Durga Puja base / Dawn portal
  const [isFestivePrimary, setIsFestivePrimary] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(false);
  const [swapToast, setSwapToast] = useState(null);

  const isSwappingRef = useRef(false);
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

  // Core physics & motion state
  const stateRef = useRef({
    // Coordinates
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    // Velocity tracking for squash & stretch
    lastX: 0,
    lastY: 0,
    vx: 0,
    vy: 0,
    velocityMag: 0,
    velocityAngle: 0,
    // Lens radius
    targetRadius: 100,
    currentRadius: 0,
    isHovering: false,
    hasInteracted: false,
    // Embers and shockwave ripples
    particles: [],
    shockwaves: [],
  });

  const [clipPolygon, setClipPolygon] = useState("circle(0px at 0px 0px)");
  const [hintVisible, setHintVisible] = useState(true);

  // GSAP quickTo setters for 120 FPS momentum gliding
  const quickSetters = useRef({
    x: null,
    y: null,
    r: null,
  });

  // Initialize initial resting preview on desktop
  useEffect(() => {
    const initPreview = () => {
      if (!stateRef.current.hasInteracted) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isMobile = w < 768;

        if (isMobile) {
          // Clean initial mobile state with portal closed
          stateRef.current.targetRadius = 0;
          stateRef.current.currentRadius = 0;
          stateRef.current.targetX = w * 0.5;
          stateRef.current.targetY = h * 0.72;
          stateRef.current.currentX = w * 0.5;
          stateRef.current.currentY = h * 0.72;
          stateRef.current.lastX = w * 0.5;
          stateRef.current.lastY = h * 0.72;
        } else {
          // Desktop wide screen: gentle preview over the right pandal
          const px = w * 0.76;
          const py = h * 0.64;

          stateRef.current.targetX = px;
          stateRef.current.targetY = py;
          stateRef.current.currentX = px;
          stateRef.current.currentY = py;
          stateRef.current.lastX = px;
          stateRef.current.lastY = py;
          stateRef.current.targetRadius = 85;
        }
      }
    };

    initPreview();
    window.addEventListener("resize", initPreview);
    return () => window.removeEventListener("resize", initPreview);
  }, []);

  // Preload both mobile and desktop festive images
  useEffect(() => {
    if (typeof window === "undefined") return;
    const imgDesktop = new Image();
    imgDesktop.src = "/DurgaPujaUpperLawer.png";
    const imgMobile = new Image();
    imgMobile.src = "/DurgaPujaUpperLawer-Mobile.png";
    const imgDawn = new Image();
    imgDawn.src = "/upperLayer.png";
  }, []);

  // Initialize GSAP spring interpolators
  useEffect(() => {
    quickSetters.current.x = gsap.quickTo(stateRef.current, "currentX", {
      duration: 0.32,
      ease: "power3.out",
    });
    quickSetters.current.y = gsap.quickTo(stateRef.current, "currentY", {
      duration: 0.32,
      ease: "power3.out",
    });
    quickSetters.current.r = gsap.quickTo(stateRef.current, "currentRadius", {
      duration: 0.42,
      ease: "back.out(1.5)",
    });

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!stateRef.current.hasInteracted && quickSetters.current.r) {
      quickSetters.current.r(isMobile ? 0 : 85);
    }
  }, []);

  // Pointer Movement Handler
  const handlePointerMove = useCallback(
    (e) => {
      const state = stateRef.current;
      state.hasInteracted = true;
      state.isHovering = true;
      state.targetX = e.clientX;
      state.targetY = e.clientY;

      const isMobile = window.innerWidth < 768;
      const responsiveRadius = isMobile
        ? 88
        : Math.min(108, Math.max(90, window.innerWidth * 0.075));
      state.targetRadius = responsiveRadius;

      if (quickSetters.current.x) quickSetters.current.x(state.targetX);
      if (quickSetters.current.y) quickSetters.current.y(state.targetY);
      if (quickSetters.current.r) quickSetters.current.r(responsiveRadius);

      if (hintRef.current && hintVisible) {
        gsap.to(hintRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.4,
          onComplete: () => setHintVisible(false),
        });
      }
    },
    [hintVisible],
  );

  // Pointer Leave / Touch End Handler
  const handlePointerLeave = useCallback(() => {
    const state = stateRef.current;
    state.isHovering = false;
    state.targetRadius = 0;
    if (quickSetters.current.r) quickSetters.current.r(0);
  }, []);

  // 2026 GSAP Epicenter Radial Shockwave Layer Swap Engine
  const triggerLayerSwap = useCallback(
    (clientX, clientY) => {
      if (isSwappingRef.current) return;
      isSwappingRef.current = true;

      const targetWorld = !isFestivePrimary;
      setTransitionTarget(targetWorld);
      setIsTransitioning(true);

      const state = stateRef.current;
      const rect = containerRef.current?.getBoundingClientRect();
      const originX = clientX - (rect?.left || 0);
      const originY = clientY - (rect?.top || 0);

      // 1. Audio sympathetic impulse
      const audio = getDawnAudioEngine();
      if (audio && audio.isPlaying && typeof audio.pulseEnergy === "function") {
        audio.pulseEnergy(1.2);
      }

      // 2. Spawn 50 high-velocity embers in 360-degree radial blast
      for (let i = 0; i < 52; i++) {
        const angle = (i / 52) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const speed = 4.2 + Math.random() * 8.5;
        state.particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: 2.2 + Math.random() * 3.6,
          alpha: 1.0,
          decay: 0.012 + Math.random() * 0.02,
          flutterPhase: Math.random() * Math.PI * 2,
          color:
            Math.random() > 0.45
              ? "#ffd166"
              : Math.random() > 0.3
              ? "#ff7b1a"
              : "#e63946",
        });
      }

      // 3. Spawn radiant canvas shockwave ripple
      state.shockwaves.push({
        x: originX,
        y: originY,
        radius: 15,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.35,
        alpha: 1.0,
        color: targetWorld ? "#ff7b1a" : "#60a5fa",
      });

      // 4. Temporary toast indicator
      setSwapToast(
        targetWorld
          ? "🪔 Durga Puja Celebration Inverted (Base Layer)"
          : "🌅 Serene Dawn Townscape Inverted (Base Layer)"
      );
      setTimeout(() => setSwapToast(null), 2800);

      // 5. GSAP Advanced 3D Epicenter Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setIsFestivePrimary(targetWorld);
          setIsTransitioning(false);
          if (baseLayerRef.current) gsap.set(baseLayerRef.current, { clearProps: "all" });
          if (transitionLayerRef.current) gsap.set(transitionLayerRef.current, { clearProps: "all" });
          isSwappingRef.current = false;
        },
      });

      if (transitionLayerRef.current && baseLayerRef.current) {
        // Initial setup for transition overlay
        gsap.set(transitionLayerRef.current, {
          opacity: 1,
          scale: 1.05,
          filter: "brightness(1.28) contrast(1.08)",
          clipPath: `circle(0px at ${originX}px ${originY}px)`,
          WebkitClipPath: `circle(0px at ${originX}px ${originY}px)`,
        });

        // Outgoing base layer recesses back with subtle atmospheric blur
        tl.to(
          baseLayerRef.current,
          {
            scale: 0.965,
            filter: "brightness(0.72) blur(3px)",
            duration: 0.48,
            ease: "power2.inOut",
          },
          0
        );

        // Radial sweep expansion from click epicenter
        tl.to(
          transitionLayerRef.current,
          {
            clipPath: `circle(165% at ${originX}px ${originY}px)`,
            WebkitClipPath: `circle(165% at ${originX}px ${originY}px)`,
            duration: 0.88,
            ease: "power4.inOut",
          },
          0.04
        );

        // Settle scale & bloom lighting
        tl.to(
          transitionLayerRef.current,
          {
            scale: 1.0,
            filter: "brightness(1.0) contrast(1.0)",
            duration: 0.88,
            ease: "power3.out",
          },
          0.04
        );
      } else {
        // Fallback safety
        setIsFestivePrimary(targetWorld);
        setIsTransitioning(false);
        isSwappingRef.current = false;
      }
    },
    [isFestivePrimary]
  );

  // Native desktop double-click trigger
  const handleDoubleClick = useCallback(
    (e) => {
      e.preventDefault();
      triggerLayerSwap(e.clientX, e.clientY);
    },
    [triggerLayerSwap]
  );

  // Mobile double-tap detection in touch end
  const handleTouchEnd = useCallback(
    (e) => {
      const touch = e.changedTouches?.[0];
      if (touch) {
        const now = performance.now();
        const timeDiff = now - lastTapRef.current.time;
        const dist = Math.hypot(
          touch.clientX - lastTapRef.current.x,
          touch.clientY - lastTapRef.current.y
        );

        if (timeDiff > 35 && timeDiff < 340 && dist < 35) {
          e.preventDefault();
          triggerLayerSwap(touch.clientX, touch.clientY);
          lastTapRef.current = { time: 0, x: 0, y: 0 };
          return;
        }
        lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };
      }

      handlePointerLeave();
    },
    [handlePointerLeave, triggerLayerSwap]
  );

  // Main Creative Animation Loop (60 - 120 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const audio = getDawnAudioEngine();
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = Math.max(0.001, (now - lastTime) / 1000);
      lastTime = now;
      const state = stateRef.current;
      const t = now / 1000;

      // Compute cursor velocity and motion orientation for squash & stretch
      const dx = state.currentX - state.lastX;
      const dy = state.currentY - state.lastY;
      state.lastX = state.currentX;
      state.lastY = state.currentY;

      const rawSpeed = Math.sqrt(dx * dx + dy * dy) / dt;
      state.velocityMag += (Math.min(rawSpeed, 600) - state.velocityMag) * 0.15;
      if (rawSpeed > 10) {
        state.velocityAngle = Math.atan2(dy, dx);
      }

      ctx.clearRect(0, 0, width, height);

      // Render shockwave ripple waves
      for (let s = state.shockwaves.length - 1; s >= 0; s--) {
        const sw = state.shockwaves[s];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 14;
        sw.alpha *= 0.93;

        if (sw.alpha <= 0.015) {
          state.shockwaves.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha * 0.85;
        ctx.lineWidth = 4.5;
        ctx.shadowBlur = 24;
        ctx.shadowColor = sw.color;
        ctx.stroke();
        ctx.restore();
      }

      // Render portal flame rim only when portal is visible
      if (state.currentRadius > 3) {
        const audioEnergy =
          audio && audio.isPlaying ? audio.getAudioEnergy() : 0;

        const stretchFactor = Math.min(0.24, state.velocityMag * 0.00045);
        const stretchAngle = state.velocityAngle;
        const jiggleAmp = (6 + audioEnergy * 14) * (state.currentRadius / 100);

        const numPoints = 72;
        const points = [];
        const polygonPoints = [];

        for (let i = 0; i < numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;

          const h1 = Math.sin(theta * 4 + t * 5.2) * 0.44;
          const h2 = Math.cos(theta * 7 - t * 7.4) * 0.34;
          const h3 = Math.sin(theta * 13 + t * 12.8) * 0.22;
          const ziggle = (h1 + h2 + h3) * jiggleAmp;

          const align = Math.cos(theta - stretchAngle);
          const velocityStretch =
            align * align * stretchFactor * state.currentRadius;

          const r = Math.max(
            12,
            state.currentRadius + ziggle + velocityStretch,
          );
          const px = state.currentX + Math.cos(theta) * r;
          const py = state.currentY + Math.sin(theta) * r;

          points.push({ x: px, y: py });
          polygonPoints.push(`${px.toFixed(1)}px ${py.toFixed(1)}px`);
        }

        // Update CSS clip-path for upper reveal layer
        setClipPolygon(`polygon(${polygonPoints.join(", ")})`);

        // Draw Multi-Layered Luminous Caustic Rim on Canvas
        ctx.save();

        // Layer A: Deep Sindoor Vermilion Ambient Dispersion Halo
        ctx.shadowBlur = 24 + audioEnergy * 20;
        ctx.shadowColor = "#e63946";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();

        ctx.strokeStyle = `rgba(230, 57, 70, ${0.45 + audioEnergy * 0.35})`;
        ctx.lineWidth = 5.5 + audioEnergy * 2.5;
        ctx.stroke();

        // Layer B: Saffron Flame Body with Screening Bloom
        ctx.globalCompositeOperation = "screen";
        ctx.shadowBlur = 14 + audioEnergy * 12;
        ctx.shadowColor = "#ff7b1a";

        ctx.strokeStyle = `rgba(255, 123, 26, ${0.85 + audioEnergy * 0.15})`;
        ctx.lineWidth = 3.0;
        ctx.stroke();

        // Layer C: Incandescent Golden-White Hot Rim
        ctx.strokeStyle = `rgba(255, 243, 176, ${0.92 + audioEnergy * 0.08})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.globalCompositeOperation = "source-over";

        // Buoyant Marigold & Saffron Embers Particle Generation
        if (state.particles.length < 32 && Math.random() < 0.55) {
          const randAngle = Math.random() * Math.PI * 2;
          const spawnDist = state.currentRadius * (0.88 + Math.random() * 0.22);
          state.particles.push({
            x: state.currentX + Math.cos(randAngle) * spawnDist,
            y: state.currentY + Math.sin(randAngle) * spawnDist,
            vx:
              (Math.random() - 0.5) * 1.8 +
              Math.cos(stretchAngle) * (state.velocityMag * 0.02),
            vy: -1.0 - Math.random() * 2.2,
            size: 1.2 + Math.random() * 2.2,
            alpha: 1.0,
            decay: 0.016 + Math.random() * 0.026,
            flutterPhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.4 ? "#ffd166" : "#ff7b1a",
          });
        }

        ctx.restore();
      } else {
        setClipPolygon("circle(0px at 0px 0px)");
      }

      // Update and render buoyant ember sparks & blast particles
      if (state.particles.length > 0) {
        ctx.save();
        for (let p = state.particles.length - 1; p >= 0; p--) {
          const part = state.particles[p];
          part.x += part.vx + Math.sin(t * 4 + part.flutterPhase) * 0.4;
          part.y += part.vy;
          part.vx *= 0.98;
          part.vy *= 0.98;
          part.alpha -= part.decay;

          if (part.alpha <= 0) {
            state.particles.splice(p, 1);
            continue;
          }

          ctx.fillStyle = part.color;
          ctx.globalAlpha = part.alpha;
          ctx.shadowBlur = 8;
          ctx.shadowColor = part.color;
          ctx.beginPath();
          ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onTouchMove={(e) => {
        if (e.touches[0]) handlePointerMove(e.touches[0]);
      }}
      onTouchStart={(e) => {
        if (e.touches[0]) handlePointerMove(e.touches[0]);
      }}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseLeave={handlePointerLeave}
      onDoubleClick={handleDoubleClick}
      className="absolute inset-x-0 bottom-0 w-full h-full select-none overflow-hidden z-10 cursor-none"
      style={{
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: "none",
      }}
      aria-label="Interactive Durga Puja & Dawn Landscape Layer"
    >
      {/* 1. BASE LAYER (Lower Layer) */}
      {/* Inverts between Peaceful Dawn and Durga Puja Celebration */}
      <div
        ref={baseLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none will-change-transform"
      >
        {isFestivePrimary ? <DurgaPujaFestiveImage /> : <DawnTownscapeImage />}
      </div>

      {/* 2. TRANSITION SWEEP LAYER (GSAP Epicenter Radial Expansion) */}
      {isTransitioning && (
        <div
          ref={transitionLayerRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 will-change-[clip-path,transform]"
        >
          {transitionTarget ? <DurgaPujaFestiveImage /> : <DawnTownscapeImage />}
        </div>
      )}

      {/* 3. REVEALED PORTAL LAYER (Upper Layer) */}
      {/* Clipped dynamically by the ziggling portal polygon */}
      {/* Shows the alternate world through the loupe */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-20 will-change-[clip-path]"
        style={{
          clipPath: clipPolygon,
          WebkitClipPath: clipPolygon,
        }}
      >
        {isFestivePrimary ? <DawnTownscapeImage /> : <DurgaPujaFestiveImage />}
      </div>

      {/* 4. PERIMETER CANVAS: Luminous Multi-Layer Flame Rim & Floating Embers */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-30"
      />

      {/* 5. TOAST NOTIFICATION: Layer Swap Inversion Feedback */}
      {swapToast && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-in fade-in zoom-in-95 duration-300 px-4 max-w-[92vw]">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-950/90 border border-amber-500/50 shadow-[0_0_24px_rgba(245,158,11,0.35)] backdrop-blur-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-amber-200 whitespace-nowrap">
              {swapToast}
            </span>
          </div>
        </div>
      )}

      {/* 6. LUXURY 2026 GUIDANCE PILL: Elegant festive micro-interaction toast */}
      {hintVisible && !swapToast && (
        <div
          ref={hintRef}
          className="absolute top-[max(4.25rem,calc(3.5rem+env(safe-area-inset-top,0px)))] sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 w-auto px-4 max-w-[92vw]"
        >
          <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0d0806]/90 border border-[#ff7b1a]/50 shadow-[0_0_24px_rgba(255,123,26,0.35),0_0_48px_rgba(255,123,26,0.12)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff7b1a] to-[#ffd166] animate-ping flex-shrink-0" />
            <span className="text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-[#ffbe76] whitespace-nowrap">
              ✨ <span className="hidden sm:inline">Double-click to invert worlds · Hover to unveil</span>
              <span className="sm:hidden">Double-tap to invert worlds · Touch to unveil</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

