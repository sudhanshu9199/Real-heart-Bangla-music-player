"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { getDawnAudioEngine } from "@/utils/audioEngine";

/**
 * FestiveLandscapeLayer — 2026 Creative Motion Design Architecture:
 * - Dual-layer landscape: Peaceful Dawn (`upperLayer.png`) & Durga Puja (`DurgaPujaUpperLawer.png`)
 * - GSAP-driven inertial momentum & spring dynamics (quickTo + velocity squash & stretch)
 * - Intimate, reduced lens radius (~95px - 105px) for focused, high-precision exploration
 * - Sacred multi-harmonic "ziggling" flame perimeter with Catmull-Rom spline smoothing
 * - Live sympathetic resonance with Mahalaya Chandipath audio energy
 * - Triple-layer luminous caustics (sindoor vermilion -> saffron gold -> white-hot core)
 * - Buoyant marigold ember sparks system
 */
export default function FestiveLandscapeLayer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const hintRef = useRef(null);

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
    // Reduced lens radius (compact, jeweler's loupe precision)
    targetRadius: 100,
    currentRadius: 0,
    isHovering: false,
    hasInteracted: false,
    // Embers
    particles: [],
  });

  const [clipPolygon, setClipPolygon] = useState("circle(0px at 0px 0px)");
  const [hintVisible, setHintVisible] = useState(true);

  // GSAP quickTo setters for 120 FPS momentum gliding
  const quickSetters = useRef({
    x: null,
    y: null,
    r: null,
  });

  // Initialize initial resting preview on Maa Durga Pandal
  useEffect(() => {
    const initPreview = () => {
      if (!stateRef.current.hasInteracted) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Pandal coordinates on right house
        const px = w * 0.76;
        const py = h * 0.64;

        stateRef.current.targetX = px;
        stateRef.current.targetY = py;
        stateRef.current.currentX = px;
        stateRef.current.currentY = py;
        stateRef.current.lastX = px;
        stateRef.current.lastY = py;
        // Compact resting radius
        stateRef.current.targetRadius = 85;
      }
    };

    initPreview();
    window.addEventListener("resize", initPreview);
    return () => window.removeEventListener("resize", initPreview);
  }, []);

  // Initialize GSAP spring interpolators
  useEffect(() => {
    // GSAP quickTo with custom easing curves
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
      ease: "back.out(1.5)", // subtle spring overshoot on expansion
    });

    // Start with gentle radius reveal on pandal
    if (!stateRef.current.hasInteracted && quickSetters.current.r) {
      quickSetters.current.r(85);
    }
  }, []);

  // Pointer Movement Handler with Velocity Calculation
  const handlePointerMove = useCallback(
    (e) => {
      const state = stateRef.current;
      state.hasInteracted = true;
      state.isHovering = true;
      state.targetX = e.clientX;
      state.targetY = e.clientY;

      // Compact, refined radius on hover (reduced to 95px - 105px as requested)
      const responsiveRadius = Math.min(
        108,
        Math.max(90, window.innerWidth * 0.075),
      );
      state.targetRadius = responsiveRadius;

      // Trigger GSAP springs
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

  // Pointer Leave Handler
  const handlePointerLeave = useCallback(() => {
    const state = stateRef.current;
    state.isHovering = false;
    state.targetRadius = 0;
    if (quickSetters.current.r) quickSetters.current.r(0);
  }, []);

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
      // Damped smooth velocity
      state.velocityMag += (Math.min(rawSpeed, 600) - state.velocityMag) * 0.15;
      if (rawSpeed > 10) {
        state.velocityAngle = Math.atan2(dy, dx);
      }

      ctx.clearRect(0, 0, width, height);

      // Only compute when portal is visible
      if (state.currentRadius > 3) {
        // Read live audio energy from Mahalaya Chandipath
        const audioEnergy =
          audio && audio.isPlaying ? audio.getAudioEnergy() : 0;

        // Dynamic squash-and-stretch ratio based on velocity
        const stretchFactor = Math.min(0.24, state.velocityMag * 0.00045);
        const stretchAngle = state.velocityAngle;

        // Multi-harmonic "ziggling" wave amplitude
        const jiggleAmp = (6 + audioEnergy * 14) * (state.currentRadius / 100);

        // 72 vertices for continuous, organic curvature without polygonal stepping
        const numPoints = 72;
        const points = [];
        const polygonPoints = [];

        for (let i = 0; i < numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;

          // Sacred multi-harmonic frequency decomposition:
          // 4th harmonic: breathing macro contour
          // 7th harmonic: conch shell sacred vibration
          // 13th harmonic: high-frequency flickering flame tongue
          const h1 = Math.sin(theta * 4 + t * 5.2) * 0.44;
          const h2 = Math.cos(theta * 7 - t * 7.4) * 0.34;
          const h3 = Math.sin(theta * 13 + t * 12.8) * 0.22;
          const ziggle = (h1 + h2 + h3) * jiggleAmp;

          // Velocity-based squash & stretch along travel vector
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

        // 1. Update CSS clip-path for DurgaPujaUpperLawer
        setClipPolygon(`polygon(${polygonPoints.join(", ")})`);

        // 2. Draw Multi-Layered Luminous Caustic Rim on Canvas
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

        // 3. Buoyant Marigold & Saffron Embers Particle System
        if (state.particles.length < 28 && Math.random() < 0.55) {
          const randAngle = Math.random() * Math.PI * 2;
          const spawnDist = state.currentRadius * (0.88 + Math.random() * 0.22);
          state.particles.push({
            x: state.currentX + Math.cos(randAngle) * spawnDist,
            y: state.currentY + Math.sin(randAngle) * spawnDist,
            vx:
              (Math.random() - 0.5) * 1.8 +
              Math.cos(stretchAngle) * (state.velocityMag * 0.02),
            vy: -1.0 - Math.random() * 2.2, // upward thermal buoyancy
            size: 1.2 + Math.random() * 2.2,
            alpha: 1.0,
            decay: 0.016 + Math.random() * 0.026,
            flutterPhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.4 ? "#ffd166" : "#ff7b1a",
          });
        }

        // Update and render buoyant ember sparks
        for (let p = state.particles.length - 1; p >= 0; p--) {
          const part = state.particles[p];
          // Sinusoidal air draft flutter
          part.x += part.vx + Math.sin(t * 4 + part.flutterPhase) * 0.4;
          part.y += part.vy;
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
      } else {
        setClipPolygon("circle(0px at 0px 0px)");
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
      onMouseLeave={handlePointerLeave}
      className="absolute inset-x-0 bottom-0 w-full h-full select-none overflow-hidden z-10 cursor-none"
      style={{
        left: 0,
        right: 0,
        bottom: 0,
      }}
      aria-label="Interactive Durga Puja Festive Landscape"
    >
      {/* 1. BASE LAYER: Peaceful October Dawn Townscape */}
      <img
        src="/upperLayer.png"
        alt="Peaceful Dawn Townscape"
        className="absolute left-0 right-0 bottom-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
        style={{
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* 2. FESTIVE LAYER: Durga Puja Celebration (Lights, Pandal, Maa Durga, Diyas) */}
      {/* Clipped dynamically by the ziggling portal polygon */}
      <div
        className="absolute left-0 right-0 bottom-0 w-full h-full pointer-events-none select-none will-change-[clip-path]"
        style={{
          clipPath: clipPolygon,
          WebkitClipPath: clipPolygon,
        }}
      >
        <img
          src="/DurgaPujaUpperLawer.png"
          alt="Durga Puja Festive Townscape"
          className="absolute left-0 right-0 bottom-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
          style={{
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>

      {/* 3. PERIMETER CANVAS: Luminous Multi-Layer Flame Rim & Floating Embers */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
      />

      {/* 4. LUXURY 2026 GUIDANCE PILL: Elegant festive micro-interaction toast */}
      {hintVisible && (
        <div
          ref={hintRef}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500"
        >
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0d0806]/85 border border-[#ff7b1a]/60 shadow-[0_0_24px_rgba(255,123,26,0.35),0_0_48px_rgba(255,123,26,0.12)] backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ff7b1a] to-[#ffd166] animate-ping" />
            <span className="text-xs sm:text-sm font-medium tracking-wide text-[#ffbe76]">
              ✨ Hover to unveil the sacred celebration
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
