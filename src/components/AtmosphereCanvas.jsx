"use client";

import React, { useRef, useEffect } from "react";
import { simplex2D, fbm2D } from "@/utils/noise";

/**
 * AtmosphereCanvas — 4K High-Fidelity Living Atmosphere Engine:
 * - 4K High-DPI canvas buffer (Retina / UHD crispness)
 * - 3 Volumetric procedural cloud depth layers with exact speed ratios:
 *   • Far Cloud Layer: 0.003 speed (high-altitude swept cirrus, alpenglow rim)
 *   • Middle Cloud Layer: 0.006 speed (stratocumulus shelves with volumetric depth)
 *   • Near Wispy Cloud: 0.010 speed (shredded fractus wisps)
 *   • Atmospheric Valley Mist (ground-hugging laminar flow)
 * - Real-Time Solar Sun Positioning & Crepuscular God Rays
 * - Perspective Dirt Road, Majestic Banyan Tree (buttress roots + vines), Autumn Red Tree
 * - Sub-frame delta-time smoothing for 60/120 FPS fluid motion
 */
export default function AtmosphereCanvas({
  solarState,
  layersVisible = {
    farClouds: true,
    midClouds: true,
    nearClouds: true,
    valleyMist: true,
    godRays: true,
    landscape: true,
    stars: true,
  },
  fogDensity = 1.0,
  cloudDensity = 1.0,
  windSpeed = 1.0,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Time accumulators for distinct slow-moving layers
  const driftRef = useRef({
    farCloudOffset: 0,
    midCloudOffset: 0,
    nearCloudOffset: 0,
    mistOffset: 0,
    dustOffset: 0,
  });

  const starsRef = useRef(null);
  const dustParticlesRef = useRef(null);

  // Initialize stars and floating atmospheric dust motes
  useEffect(() => {
    // 180 Starlight points for twilight & night
    const starCount = 180;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random() * 0.52,
        radius: 0.6 + Math.random() * 1.6,
        scintillationSpeed: 0.8 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }
    starsRef.current = stars;

    // 40 Floating atmospheric dew / dust motes
    const dustCount = 42;
    const dust = [];
    for (let i = 0; i < dustCount; i++) {
      dust.push({
        x: Math.random(),
        y: 0.55 + Math.random() * 0.42,
        r: 0.7 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.008,
        speedY: -0.004 - Math.random() * 0.008,
        pulseSpeed: 1.2 + Math.random() * 2.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    dustParticlesRef.current = dust;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const handleResize = () => {
      if (!canvas) return;
      // 4K Ultra-HD Crisp DPI scaling (up to 3x device ratio)
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const render = (now) => {
      // Delta time with 60/120 FPS clamping
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Update cloud layer drifts with user-specified natural velocities:
      // Far clouds: 0.003
      // Middle clouds: 0.006
      // Near clouds: 0.010
      const drift = driftRef.current;
      drift.farCloudOffset += 0.003 * windSpeed * dt * 10;
      drift.midCloudOffset += 0.006 * windSpeed * dt * 10;
      drift.nearCloudOffset += 0.010 * windSpeed * dt * 10;
      drift.mistOffset += 0.007 * windSpeed * dt * 10;
      drift.dustOffset += dt * 0.8;

      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Horizon line position matching reference image (Y ~ 0.61 of viewport)
      const horizonY = h * 0.61;
      const skyTopY = h * 0.14; // Peak celestial altitude boundary

      // Continuous astronomical solar trajectory:
      // Sunrise in East (Left: X ~ 0.18) -> Midday Zenith (Center: X ~ 0.50) -> Sunset in West (Right: X ~ 0.82)
      const sunNormX = solarState.sunPosition?.x ?? 0.5;
      const sunX = w * sunNormX;

      let sunY;
      const alt = solarState.altitude;
      if (alt >= 0) {
        // Celestial arc above horizon (curved spherical ascent towards skyTopY)
        const maxAlt = Math.max(35, solarState.maxAltitude || 55);
        const altRatio = Math.min(1, Math.max(0, alt / maxAlt));
        const arcT = Math.sin(altRatio * Math.PI * 0.5);
        sunY = horizonY - arcT * (horizonY - skyTopY);
      } else {
        // Subterranean depth during dawn twilight and night
        const nightDepth = Math.min(1, Math.abs(alt) / 18);
        sunY = horizonY + nightDepth * 65;
      }

      ctx.clearRect(0, 0, w, h);

      // 1. SKY GRADIENT (Continuous Rayleigh & Mie Scattering)
      drawSky(ctx, w, h, horizonY, sunX, sunY, solarState);

      // 2. STARS (Scintillating starlight during dawn & night)
      if (layersVisible.stars && solarState.altitude < -6) {
        drawStars(ctx, w, h, solarState, starsRef.current, now / 1000);
      }

      // 3. SUN DISC & ATMOSPHERIC CORONAL GLOW
      drawSunDisc(ctx, w, h, horizonY, sunX, sunY, solarState);

      // 4. CREPUSCULAR GOD RAYS (When sun is between -3° and +14°)
      if (layersVisible.godRays && solarState.altitude > -4 && solarState.altitude < 16) {
        drawGodRays(ctx, w, h, horizonY, sunX, sunY, solarState, now / 1000);
      }

      // 5. 3 VOLUMETRIC CLOUD DEPTH LAYERS
      // Far Cloud Layer (0.003 speed)
      if (layersVisible.farClouds) {
        drawFarCloudLayer(ctx, w, h, horizonY, sunX, solarState, drift.farCloudOffset, cloudDensity);
      }

      // Middle Cloud Layer (0.006 speed)
      if (layersVisible.midClouds) {
        drawMiddleCloudLayer(ctx, w, h, horizonY, sunX, solarState, drift.midCloudOffset, cloudDensity);
      }

      // Near Wispy Cloud Layer (0.010 speed)
      if (layersVisible.nearClouds) {
        drawNearCloudLayer(ctx, w, h, horizonY, sunX, solarState, drift.nearCloudOffset, cloudDensity);
      }

      // 6. DISTANT FOREST LINE & HORIZON TREES
      if (layersVisible.landscape) {
        drawHorizonForest(ctx, w, h, horizonY, sunX, solarState);
      }

      // 7. PERSPECTIVE DIRT ROAD & MEADOW (Leading to sunrise horizon)
      if (layersVisible.landscape) {
        drawDirtRoadAndMeadow(ctx, w, h, horizonY, sunX, solarState);
      }

      // 8. ATMOSPHERIC VALLEY MIST (Ground-hugging laminar flow)
      if (layersVisible.valleyMist) {
        drawAtmosphericMist(ctx, w, h, horizonY, sunX, solarState, drift.mistOffset, fogDensity);
      }

      // 9. LEFT AUTUMN TREE (Reddish-orange leaf clusters)
      if (layersVisible.landscape) {
        drawLeftAutumnTree(ctx, w, h, horizonY, sunX, solarState, now / 1000);
      }

      // 10. RIGHT BANYAN TREE (Exposed sprawling roots and hanging aerial vines)
      if (layersVisible.landscape) {
        drawRightBanyanTree(ctx, w, h, horizonY, sunX, solarState, now / 1000);
      }

      // 11. FOREGROUND VEGETATION & WEEDS
      if (layersVisible.landscape) {
        drawForegroundWeeds(ctx, w, h, horizonY, solarState, now / 1000);
      }

      // 12. FLOATING ATMOSPHERIC DEW / DUST MOTES
      drawAtmosphericDust(ctx, w, h, horizonY, sunX, solarState, dustParticlesRef.current, dt, now / 1000);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [solarState, layersVisible, fogDensity, cloudDensity, windSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ display: "block" }}
    />
  );
}

// -------------------------------------------------------------
// 4K HIGH-FIDELITY RENDERER FUNCTIONS
// -------------------------------------------------------------

function rgb(c, a = 1) {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}

/**
 * 1. Sky Gradient & Rayleigh/Mie Scatter Dome
 */
function drawSky(ctx, w, h, horizonY, sunX, sunY, solar) {
  const { skyZenith, skyMid, skyHorizon } = solar.colors;

  // 4-stop vertical atmosphere gradient extending full canvas height
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, rgb(skyZenith));
  grad.addColorStop(Math.min(0.42, (horizonY / h) * 0.65), rgb(skyZenith, 0.98));
  grad.addColorStop(Math.min(0.68, (horizonY / h) * 0.92), rgb(skyMid, 0.95));
  grad.addColorStop(Math.min(0.88, (horizonY / h) * 1.05), rgb(skyHorizon, 0.95));
  grad.addColorStop(1, rgb(skyHorizon));

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Atmospheric scattering dome centered on the sun
  const domeRadius = Math.max(w * 0.55, 520);
  const domeY = Math.min(horizonY, sunY + 20);
  const domeGrad = ctx.createRadialGradient(sunX, domeY, 0, sunX, domeY, domeRadius);

  const domeAlpha = Math.max(0, Math.min(1, (solar.altitude + 12) / 16));
  if (solar.isAfternoon) {
    // Rich sunset scattering on the right: fiery amber, vermilion, deep purple-red
    domeGrad.addColorStop(0, `rgba(255, 205, 110, ${0.62 * domeAlpha})`);
    domeGrad.addColorStop(0.28, `rgba(255, 125, 60, ${0.42 * domeAlpha})`);
    domeGrad.addColorStop(0.65, `rgba(215, 60, 85, ${0.22 * domeAlpha})`);
    domeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  } else {
    // Crisp dawn scattering on the left: golden yellow, peach, soft rose
    domeGrad.addColorStop(0, `rgba(255, 225, 130, ${0.58 * domeAlpha})`);
    domeGrad.addColorStop(0.28, `rgba(252, 175, 75, ${0.36 * domeAlpha})`);
    domeGrad.addColorStop(0.65, `rgba(215, 95, 102, ${0.18 * domeAlpha})`);
    domeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  }

  ctx.fillStyle = domeGrad;
  ctx.fillRect(0, 0, w, h);
}

/**
 * 2. Starfield with scintillation (scintillates naturally, fades at civil dawn)
 */
function drawStars(ctx, w, h, solar, stars, t) {
  if (!stars) return;
  const starOpacity = Math.max(0, Math.min(1, (-6 - solar.altitude) / 10));
  if (starOpacity <= 0) return;

  ctx.save();
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = 0.6 + 0.4 * Math.sin(t * s.scintillationSpeed + s.phase);
    const alpha = s.brightness * twinkle * starOpacity;

    const sx = s.x * w;
    const sy = s.y * h * 0.52;

    ctx.fillStyle = `rgba(235, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, s.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * 3. Radiant Sun Disc & Atmospheric Bloom Halo (Sunrise East / Left & Sunset West / Right)
 */
function drawSunDisc(ctx, w, h, horizonY, sunX, sunY, solar) {
  // Pre-sunrise (East/Left) or post-sunset (West/Right) atmospheric horizon glow
  if (solar.altitude > -10 && solar.altitude < 0) {
    const glowFactor = (solar.altitude + 10) / 10;
    const preGlow = ctx.createRadialGradient(sunX, horizonY, 10, sunX, horizonY, 240);
    if (solar.isAfternoon) {
      preGlow.addColorStop(0, `rgba(255, 135, 55, ${0.72 * glowFactor})`);
      preGlow.addColorStop(0.45, `rgba(225, 65, 75, ${0.38 * glowFactor})`);
      preGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      preGlow.addColorStop(0, `rgba(255, 175, 75, ${0.65 * glowFactor})`);
      preGlow.addColorStop(0.5, `rgba(235, 95, 80, ${0.32 * glowFactor})`);
      preGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    ctx.fillStyle = preGlow;
    ctx.fillRect(sunX - 280, horizonY - 180, 560, 200);
  }

  // Rising or setting Sun Disc
  if (solar.altitude > -2) {
    const sunFactor = Math.min(1, Math.max(0, (solar.altitude + 2) / 4));
    const sunRadius = 50 + Math.min(Math.max(0, solar.altitude), 8) * 1.2;

    // Atmospheric bloom corona
    const halo = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.75, sunX, sunY, sunRadius * 3.8);
    if (solar.isAfternoon) {
      halo.addColorStop(0, `rgba(255, 215, 130, ${0.88 * sunFactor})`);
      halo.addColorStop(0.32, `rgba(255, 140, 60, ${0.60 * sunFactor})`);
      halo.addColorStop(0.72, `rgba(230, 85, 60, ${0.25 * sunFactor})`);
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      halo.addColorStop(0, `rgba(255, 235, 150, ${0.85 * sunFactor})`);
      halo.addColorStop(0.32, `rgba(255, 180, 80, ${0.55 * sunFactor})`);
      halo.addColorStop(0.72, `rgba(240, 115, 65, ${0.20 * sunFactor})`);
      halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 3.8, 0, Math.PI * 2);
    ctx.fill();

    // Solid gradient sun disc (White-yellow top to radiant amber base)
    const discGrad = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
    if (solar.isAfternoon) {
      discGrad.addColorStop(0, `rgba(255, 252, 235, ${0.99 * sunFactor})`);
      discGrad.addColorStop(0.3, `rgba(255, 215, 145, ${0.96 * sunFactor})`);
      discGrad.addColorStop(0.7, `rgba(255, 145, 52, ${0.95 * sunFactor})`);
      discGrad.addColorStop(1, `rgba(235, 85, 35, ${0.92 * sunFactor})`);
    } else {
      discGrad.addColorStop(0, `rgba(255, 255, 245, ${0.99 * sunFactor})`);
      discGrad.addColorStop(0.32, `rgba(255, 240, 175, ${0.96 * sunFactor})`);
      discGrad.addColorStop(0.74, `rgba(255, 172, 65, ${0.94 * sunFactor})`);
      discGrad.addColorStop(1, `rgba(245, 115, 42, ${0.90 * sunFactor})`);
    }

    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // Cinema-grade horizontal lens glare streak
    if (solar.altitude > 0) {
      const streakW = w * 0.42;
      const streakGrad = ctx.createLinearGradient(sunX - streakW, sunY, sunX + streakW, sunY);
      streakGrad.addColorStop(0, "rgba(255, 205, 120, 0)");
      streakGrad.addColorStop(
        0.5,
        solar.isAfternoon
          ? `rgba(255, 225, 180, ${0.38 * sunFactor})`
          : `rgba(255, 245, 220, ${0.35 * sunFactor})`
      );
      streakGrad.addColorStop(1, "rgba(255, 205, 120, 0)");

      ctx.fillStyle = streakGrad;
      ctx.fillRect(sunX - streakW, sunY - 2.5, streakW * 2, 5);
    }
  }
}

/**
 * 4. Crepuscular God Rays (Atmospheric shafts dynamically sweeping across landscape)
 */
function drawGodRays(ctx, w, h, horizonY, sunX, sunY, solar, t) {
  const rayIntensity = Math.min(1, Math.max(0, (solar.altitude + 3) / 6)) * 0.20;
  const rayCount = 8;

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  // Dynamic slant: rays sweep towards the center/opposite side of the screen
  const normX = sunX / w;
  const directionalBias = (0.5 - normX) * 0.65;

  for (let i = 0; i < rayCount; i++) {
    const angleBase =
      -Math.PI * 0.44 + (i / (rayCount - 1)) * Math.PI * 0.88 + directionalBias;
    // Harmonic organic sway & shimmer
    const sway = Math.sin(t * 0.16 + i * 1.7) * 0.032 + Math.cos(t * 0.32 + i) * 0.012;
    const angle = angleBase + sway;

    const length = h * 0.92;
    const tx = sunX + Math.sin(angle) * length;
    const ty = sunY - Math.cos(angle) * length;

    const rayGrad = ctx.createLinearGradient(sunX, sunY, tx, ty);
    if (solar.isAfternoon) {
      rayGrad.addColorStop(0, `rgba(255, 215, 135, ${rayIntensity * 1.45})`);
      rayGrad.addColorStop(0.45, `rgba(255, 140, 85, ${rayIntensity * 0.75})`);
      rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      rayGrad.addColorStop(0, `rgba(255, 225, 145, ${rayIntensity * 1.35})`);
      rayGrad.addColorStop(0.45, `rgba(250, 165, 98, ${rayIntensity * 0.65})`);
      rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(tx - 38, ty);
    ctx.lineTo(tx + 38, ty);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * 5. FAR CLOUD LAYER (Speed 0.003)
 * High-altitude swept cirrus with multi-octave fBm flow and alpenglow.
 */
function drawFarCloudLayer(ctx, w, h, horizonY, sunX, solar, offset, cloudDensity) {
  const { cloudFarColor } = solar.colors;
  const opacity = cloudFarColor.opacity * cloudDensity;
  if (opacity <= 0.02) return;

  ctx.save();
  const stepX = 20;
  const layerHeight = horizonY * 0.50;

  for (let band = 0; band < 3; band++) {
    const bandY = layerHeight * (0.22 + band * 0.30);
    const bandOffset = offset + band * 14;

    ctx.beginPath();
    let first = true;

    for (let x = -20; x <= w + 40; x += stepX) {
      const nx = x * 0.0013 + bandOffset * 0.038;
      // fBm multi-octave organic turbulence
      const wave = simplex2D(nx, band * 2.1) * 34 + fbm2D(nx * 2, 0.4, 3, 2, 0.5) * 18;
      const slant = (x / w - 0.5) * -16;
      const y = bandY + wave + slant;

      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    for (let x = w + 40; x >= -20; x -= stepX) {
      const nx = x * 0.0013 + bandOffset * 0.038;
      const wave = simplex2D(nx + 6, band * 2.1 + 1) * 24;
      const y = bandY + 30 + wave;
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, bandY - 22, 0, bandY + 48);
    grad.addColorStop(0, rgb(cloudFarColor.highlight, opacity * 0.78));
    grad.addColorStop(0.55, rgb(cloudFarColor.base, opacity * 0.58));
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 6. MIDDLE CLOUD LAYER (Speed 0.006)
 * Stratocumulus horizontal shelves with volumetric depth and sunlit underbelly.
 */
function drawMiddleCloudLayer(ctx, w, h, horizonY, sunX, solar, offset, cloudDensity) {
  const { cloudMidColor } = solar.colors;
  const opacity = cloudMidColor.opacity * cloudDensity;
  if (opacity <= 0.02) return;

  ctx.save();
  const stepX = 16;
  const baseY = horizonY * 0.52;

  for (let shelf = 0; shelf < 2; shelf++) {
    const shelfY = baseY + shelf * 26;
    const shelfOffset = offset * (shelf === 0 ? 1 : 1.22) + shelf * 8;

    ctx.beginPath();
    let first = true;

    for (let x = -30; x <= w + 30; x += stepX) {
      const nx = x * 0.0022 + shelfOffset * 0.055;
      const wave = simplex2D(nx, shelf * 1.8) * 26 + simplex2D(nx * 3.2, 2.6) * 9;
      const y = shelfY + wave;

      if (first) {
        ctx.moveTo(x, y);
        first = false;
      } else {
        ctx.lineTo(x, y);
      }
    }

    for (let x = w + 30; x >= -30; x -= stepX) {
      const nx = x * 0.0022 + shelfOffset * 0.055;
      const wave = simplex2D(nx + 8, shelf * 1.8 + 0.8) * 20;
      const y = shelfY + 24 + wave;
      ctx.lineTo(x, y);
    }
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, shelfY - 16, 0, shelfY + 28);
    grad.addColorStop(0, rgb(cloudMidColor.highlight, opacity * 0.88));
    grad.addColorStop(0.65, rgb(cloudMidColor.base, opacity * 0.68));
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = grad;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 7. NEAR WISPY CLOUD LAYER (Speed 0.010)
 * Delicate, shredded fractus wisps drifting across tree ridges.
 */
function drawNearCloudLayer(ctx, w, h, horizonY, sunX, solar, offset, cloudDensity) {
  const { cloudNearColor } = solar.colors;
  const opacity = cloudNearColor.opacity * cloudDensity;
  if (opacity <= 0.02) return;

  ctx.save();
  const stepX = 14;
  const baseY = horizonY * 0.68;

  ctx.beginPath();
  let first = true;

  for (let x = -20; x <= w + 20; x += stepX) {
    const nx = x * 0.0034 + offset * 0.088;
    const wave = simplex2D(nx, 4.4) * 18 + simplex2D(nx * 2.6, 3.2) * 7;
    const y = baseY + wave;

    if (first) {
      ctx.moveTo(x, y);
      first = false;
    } else {
      ctx.lineTo(x, y);
    }
  }

  for (let x = w + 20; x >= -20; x -= stepX) {
    const nx = x * 0.0034 + offset * 0.088;
    const wave = simplex2D(nx + 4, 5.2) * 11;
    const y = baseY + 15 + wave;
    ctx.lineTo(x, y);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, baseY - 12, 0, baseY + 22);
  grad.addColorStop(0, rgb(cloudNearColor.highlight, opacity * 0.62));
  grad.addColorStop(0.55, rgb(cloudNearColor.base, opacity * 0.42));
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

/**
 * 8. Distant Horizon Forest Tree Line
 */
function drawHorizonForest(ctx, w, h, horizonY, sunX, solar) {
  const { silhouetteColor, skyHorizon } = solar.colors;

  ctx.save();
  const forestBaseY = horizonY;

  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, forestBaseY);

  for (let x = 0; x <= w; x += 12) {
    const nx = x * 0.003;
    const crown =
      Math.abs(Math.sin(nx * 6.5)) * 28 +
      Math.sin(nx * 14.2) * 10 +
      simplex2D(nx * 4, 1.5) * 14;
    const y = forestBaseY - crown - 8;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(w, forestBaseY);
  ctx.lineTo(w, h);
  ctx.closePath();

  const forestGrad = ctx.createLinearGradient(0, horizonY - 45, 0, horizonY + 20);
  forestGrad.addColorStop(0, rgb(silhouetteColor, 0.86));
  forestGrad.addColorStop(0.5, rgb(skyHorizon, 0.42));
  forestGrad.addColorStop(1, rgb(silhouetteColor, 0.96));

  ctx.fillStyle = forestGrad;
  ctx.fill();

  if (solar.treeRimLight > 0.05) {
    const rimRadius = 190;
    const rimGrad = ctx.createRadialGradient(sunX, horizonY, 0, sunX, horizonY, rimRadius);
    rimGrad.addColorStop(0, `rgba(255, 218, 125, ${0.68 * solar.treeRimLight})`);
    rimGrad.addColorStop(0.42, `rgba(245, 155, 65, ${0.36 * solar.treeRimLight})`);
    rimGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = rimGrad;
    ctx.fillRect(sunX - rimRadius, horizonY - 45, rimRadius * 2, 70);
  }

  ctx.restore();
}

/**
 * 9. Perspective Dirt Road & Meadow (Receding towards the sunrise vanishing point)
 */
function drawDirtRoadAndMeadow(ctx, w, h, horizonY, sunX, solar) {
  const { grassColor, roadColor, silhouetteColor } = solar.colors;

  ctx.save();

  // 1. Meadow Base
  const meadowGrad = ctx.createLinearGradient(0, horizonY, 0, h);
  meadowGrad.addColorStop(0, rgb(grassColor, 0.9));
  meadowGrad.addColorStop(0.42, rgb(grassColor, 0.95));
  meadowGrad.addColorStop(1, rgb(silhouetteColor, 0.98));

  ctx.fillStyle = meadowGrad;
  ctx.fillRect(0, horizonY, w, h - horizonY);

  // 2. Stable Dirt Road Vanishing Point in Landscape Perspective
  const vpX = w * 0.56;
  const vpY = horizonY + 6;

  const roadLeftBottom = w * 0.15;
  const roadRightBottom = w * 0.72;

  ctx.beginPath();
  ctx.moveTo(roadLeftBottom, h);
  ctx.quadraticCurveTo(w * 0.32, h * 0.82, w * 0.48, h * 0.72);
  ctx.quadraticCurveTo(w * 0.54, h * 0.66, vpX, vpY);

  ctx.lineTo(vpX + 18, vpY);
  ctx.quadraticCurveTo(w * 0.62, h * 0.66, w * 0.63, h * 0.74);
  ctx.quadraticCurveTo(w * 0.68, h * 0.85, roadRightBottom, h);
  ctx.closePath();

  const roadGrad = ctx.createLinearGradient(0, vpY, 0, h);
  roadGrad.addColorStop(0, rgb(roadColor, 0.86));
  roadGrad.addColorStop(0.45, rgb(roadColor, 0.96));
  roadGrad.addColorStop(1, rgb(roadColor, 1.0));

  ctx.fillStyle = roadGrad;
  ctx.fill();

  // 3. Wheel Tracks / Natural Texture
  ctx.strokeStyle = `rgba(38, 28, 22, ${0.46 * Math.min(1, (solar.altitude + 12) / 14)})`;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w * 0.34, h);
  ctx.quadraticCurveTo(w * 0.45, h * 0.82, vpX + 4, vpY + 2);
  ctx.stroke();

  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.52, h);
  ctx.quadraticCurveTo(w * 0.58, h * 0.82, vpX + 10, vpY + 2);
  ctx.stroke();

  // 4. Directional Sunlight Wash on the Dirt Road (casts from sunX towards road)
  if (solar.altitude > -2) {
    const roadLightFactor = Math.min(1, Math.max(0, (solar.altitude + 2) / 5));
    const roadGlow = ctx.createLinearGradient(sunX, horizonY, vpX, h);
    if (solar.isAfternoon) {
      roadGlow.addColorStop(0, `rgba(255, 195, 115, ${0.48 * roadLightFactor})`);
      roadGlow.addColorStop(0.5, `rgba(250, 140, 75, ${0.28 * roadLightFactor})`);
      roadGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    } else {
      roadGlow.addColorStop(0, `rgba(255, 225, 140, ${0.44 * roadLightFactor})`);
      roadGlow.addColorStop(0.5, `rgba(250, 175, 90, ${0.26 * roadLightFactor})`);
      roadGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    }

    ctx.fillStyle = roadGlow;
    ctx.beginPath();
    ctx.moveTo(roadLeftBottom + 20, h);
    ctx.quadraticCurveTo(w * 0.45, h * 0.78, vpX, vpY);
    ctx.lineTo(vpX + 16, vpY);
    ctx.quadraticCurveTo(w * 0.62, h * 0.78, roadRightBottom - 20, h);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 10. Atmospheric Valley Mist & Dust Haze
 */
function drawAtmosphericMist(ctx, w, h, horizonY, sunX, solar, offset, fogDensity) {
  const { fogColor } = solar.colors;
  const baseAlpha = 0.42 * fogDensity * solar.hazeDensity;
  if (baseAlpha <= 0.02) return;

  ctx.save();
  const mistBands = 3;

  for (let b = 0; b < mistBands; b++) {
    const mistY = horizonY - 10 + b * 25;
    const bandHeight = 42 + b * 18;
    const speed = 0.8 + b * 0.35;
    const currentOffset = offset * speed + b * 18;

    ctx.beginPath();
    ctx.moveTo(0, mistY + bandHeight);

    for (let x = 0; x <= w + 20; x += 18) {
      const nx = x * 0.0028 + currentOffset * 0.05;
      const wave = Math.sin(nx * 2.2) * 12 + simplex2D(nx * 1.6, b * 2.8) * 14;
      ctx.lineTo(x, mistY + wave);
    }

    ctx.lineTo(w, mistY + bandHeight);
    ctx.closePath();

    const mistGrad = ctx.createLinearGradient(0, mistY - 8, 0, mistY + bandHeight);
    mistGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    mistGrad.addColorStop(0.4, rgb(fogColor, baseAlpha * (0.82 - b * 0.15)));
    mistGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = mistGrad;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 11. Left Autumn Tree (Vibrant reddish-orange foliage clusters)
 */
function drawLeftAutumnTree(ctx, w, h, horizonY, sunX, solar, t) {
  const { silhouetteColor } = solar.colors;
  const rimStrength = solar.treeRimLight;

  ctx.save();
  const treeX = w * 0.08;
  const treeBaseY = horizonY + 70;
  const treeH = h * 0.52;

  // Trunk & Arching Branches
  ctx.strokeStyle = rgb(silhouetteColor, 0.98);
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(treeX, treeBaseY);
  ctx.quadraticCurveTo(treeX - 10, treeBaseY - treeH * 0.45, treeX + 8, treeBaseY - treeH * 0.75);
  ctx.stroke();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(treeX + 4, treeBaseY - treeH * 0.55);
  ctx.quadraticCurveTo(treeX + 45, treeBaseY - treeH * 0.65, treeX + 75, treeBaseY - treeH * 0.72);
  ctx.moveTo(treeX, treeBaseY - treeH * 0.4);
  ctx.quadraticCurveTo(treeX - 40, treeBaseY - treeH * 0.55, treeX - 55, treeBaseY - treeH * 0.65);
  ctx.stroke();

  // Autumn Foliage Clusters (Reddish-Orange)
  const alt = solar.altitude;
  const autumnRed =
    alt <= -6
      ? [42, 16, 18]
      : alt <= 0
      ? [148, 42, 28]
      : [215, 68, 35];

  const autumnOrange =
    alt <= -6
      ? [56, 22, 18]
      : alt <= 0
      ? [185, 78, 36]
      : [248, 122, 48];

  const clusterCount = 14;
  for (let i = 0; i < clusterCount; i++) {
    const sway = Math.sin(t * 1.1 + i) * 3;
    const cx = treeX - 35 + (i % 4) * 32 + (i > 6 ? 24 : -12) + sway;
    const cy = treeBaseY - treeH * 0.55 - (i * 12) + (i % 3) * 14;
    const r = 22 + (i % 3) * 8;

    ctx.fillStyle = rgb(autumnRed, 0.92);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    if (rimStrength > 0.05) {
      ctx.fillStyle = rgb(autumnOrange, 0.75 * rimStrength);
      ctx.beginPath();
      ctx.arc(cx + r * 0.25, cy - r * 0.15, r * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Midground green tree cluster
  drawTreeCluster(ctx, treeX + 110, horizonY + 30, 95, silhouetteColor, rimStrength, [38, 52, 35], t, 1);
  drawTreeCluster(ctx, treeX + 185, horizonY + 22, 80, silhouetteColor, rimStrength, [34, 48, 32], t, 2);

  ctx.restore();
}

/**
 * 12. Right Banyan Tree (Exposed sprawling buttress roots and hanging aerial vines)
 */
function drawRightBanyanTree(ctx, w, h, horizonY, sunX, solar, t) {
  const { silhouetteColor } = solar.colors;
  const rimStrength = solar.treeRimLight;

  ctx.save();
  const treeX = w * 0.88;
  const treeBaseY = horizonY + 110;
  const treeH = h * 0.62;

  // 1. Sprawling Surface Buttress Roots
  ctx.strokeStyle = rgb(silhouetteColor, 0.98);
  ctx.lineCap = "round";

  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(treeX - 25, treeBaseY - 45);
  ctx.quadraticCurveTo(treeX - 65, treeBaseY - 15, treeX - 110, treeBaseY + 12);
  ctx.stroke();

  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(treeX - 45, treeBaseY - 25);
  ctx.quadraticCurveTo(treeX - 95, treeBaseY + 5, treeX - 145, treeBaseY + 22);
  ctx.stroke();

  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(treeX + 35, treeBaseY - 40);
  ctx.quadraticCurveTo(treeX + 70, treeBaseY - 10, treeX + 95, treeBaseY + 15);
  ctx.stroke();

  // 2. Multi-Stem Trunk
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(treeX, treeBaseY - 20);
  ctx.quadraticCurveTo(treeX - 8, treeBaseY - treeH * 0.35, treeX + 5, treeBaseY - treeH * 0.58);
  ctx.stroke();

  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(treeX, treeBaseY - treeH * 0.48);
  ctx.quadraticCurveTo(treeX - 65, treeBaseY - treeH * 0.56, treeX - 115, treeBaseY - treeH * 0.62);
  ctx.moveTo(treeX + 5, treeBaseY - treeH * 0.48);
  ctx.quadraticCurveTo(treeX + 60, treeBaseY - treeH * 0.58, treeX + 95, treeBaseY - treeH * 0.65);
  ctx.stroke();

  // 3. Hanging Aerial Roots / Vines (With subtle living wind sway)
  ctx.lineWidth = 2.2;
  const vineOffsets = [-85, -65, -45, -28, -12, 18, 38, 62];
  for (let i = 0; i < vineOffsets.length; i++) {
    const vx = treeX + vineOffsets[i];
    const vyStart = treeBaseY - treeH * (0.55 + (i % 3) * 0.05);
    const vyEnd = treeBaseY - 5 + (i % 4) * 8;
    const sway = Math.sin(t * 1.25 + i * 0.9) * 2.8;

    ctx.beginPath();
    ctx.moveTo(vx, vyStart);
    ctx.quadraticCurveTo(vx + sway, (vyStart + vyEnd) * 0.5, vx + sway * 0.6, vyEnd);
    ctx.stroke();

    // Golden morning rim light on left edge
    if (rimStrength > 0.1) {
      ctx.strokeStyle = `rgba(255, 205, 110, ${0.58 * rimStrength})`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(vx - 0.8, vyStart);
      ctx.quadraticCurveTo(vx - 0.8 + sway, (vyStart + vyEnd) * 0.5, vx - 0.8 + sway * 0.6, vyEnd);
      ctx.stroke();
      ctx.strokeStyle = rgb(silhouetteColor, 0.98);
      ctx.lineWidth = 2.2;
    }
  }

  // 4. Lush Foliage Canopy
  const foliageLeaves = [
    { x: -110, y: -0.62, r: 48 },
    { x: -75, y: -0.72, r: 58 },
    { x: -35, y: -0.80, r: 64 },
    { x: 10, y: -0.84, r: 70 },
    { x: 55, y: -0.78, r: 62 },
    { x: 95, y: -0.68, r: 52 },
    { x: -50, y: -0.62, r: 46 },
    { x: 30, y: -0.65, r: 54 },
  ];

  const canopyColor =
    solar.altitude <= -4
      ? [18, 24, 20]
      : solar.altitude <= 0
      ? [36, 48, 32]
      : [52, 72, 45];

  for (let i = 0; i < foliageLeaves.length; i++) {
    const leaf = foliageLeaves[i];
    const lx = treeX + leaf.x;
    const ly = treeBaseY + treeH * leaf.y;

    ctx.fillStyle = rgb(canopyColor, 0.96);
    ctx.beginPath();
    ctx.arc(lx, ly, leaf.r, 0, Math.PI * 2);
    ctx.fill();

    if (rimStrength > 0.05) {
      const leafRimGrad = ctx.createRadialGradient(
        lx - leaf.r * 0.35,
        ly + leaf.r * 0.15,
        leaf.r * 0.2,
        lx,
        ly,
        leaf.r
      );
      leafRimGrad.addColorStop(0, `rgba(255, 218, 115, ${0.75 * rimStrength})`);
      leafRimGrad.addColorStop(0.5, `rgba(215, 145, 55, ${0.45 * rimStrength})`);
      leafRimGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = leafRimGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, leaf.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Golden rim along left edge of trunk
  if (rimStrength > 0.05) {
    ctx.strokeStyle = `rgba(255, 210, 110, ${0.68 * rimStrength})`;
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(treeX - 18, treeBaseY - 20);
    ctx.quadraticCurveTo(treeX - 24, treeBaseY - treeH * 0.35, treeX - 12, treeBaseY - treeH * 0.58);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(treeX - 25, treeBaseY - 45);
    ctx.quadraticCurveTo(treeX - 65, treeBaseY - 15, treeX - 110, treeBaseY + 12);
    ctx.stroke();
  }

  ctx.restore();
}

function drawTreeCluster(ctx, x, baseY, height, silColor, rimStrength, leafColor, t, seed) {
  ctx.save();
  ctx.strokeStyle = rgb(silColor);
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(x, baseY);
  ctx.lineTo(x, baseY - height * 0.6);
  ctx.stroke();

  const sway = Math.sin(t * 0.8 + seed) * 3;
  ctx.fillStyle = rgb(leafColor, 0.95);
  ctx.beginPath();
  ctx.arc(x + sway, baseY - height * 0.7, height * 0.38, 0, Math.PI * 2);
  ctx.fill();

  if (rimStrength > 0.05) {
    ctx.fillStyle = `rgba(255, 200, 95, ${0.5 * rimStrength})`;
    ctx.beginPath();
    ctx.arc(x + sway - height * 0.1, baseY - height * 0.7, height * 0.26, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawForegroundWeeds(ctx, w, h, horizonY, solar, t) {
  const { silhouetteColor } = solar.colors;
  const rim = solar.treeRimLight;

  ctx.save();
  const weedCount = 28;

  for (let i = 0; i < weedCount; i++) {
    const isLeft = i < weedCount * 0.55;
    const wx = isLeft ? (i / (weedCount * 0.55)) * (w * 0.28) : w * 0.7 + ((i - weedCount * 0.55) / (weedCount * 0.45)) * (w * 0.3);
    const wy = h - 5 + Math.sin(i * 1.5) * 20;
    const weedH = 18 + (i % 4) * 8;
    const sway = Math.sin(t * 1.8 + i * 0.4) * 4;

    ctx.strokeStyle = rgb(silhouetteColor);
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + sway * 0.5, wy - weedH * 0.5, wx + sway, wy - weedH);
    ctx.stroke();

    if (rim > 0.1) {
      ctx.strokeStyle = `rgba(255, 220, 130, ${0.45 * rim})`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(wx + sway * 0.8, wy - weedH * 0.8);
      ctx.lineTo(wx + sway, wy - weedH);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * 13. Floating Atmospheric Dew / Dust Particles (Sparkling in morning sun rays)
 */
function drawAtmosphericDust(ctx, w, h, horizonY, sunX, solar, dust, dt, t) {
  if (!dust || solar.altitude < -4) return;

  const sunIntensity = Math.min(1, Math.max(0, (solar.altitude + 4) / 8));
  ctx.save();

  for (let i = 0; i < dust.length; i++) {
    const p = dust[i];
    p.x += p.speedX * dt * 8;
    p.y += p.speedY * dt * 8;

    if (p.y < 0.35) p.y = 0.95;
    if (p.x < 0) p.x = 1;
    if (p.x > 1) p.x = 0;

    const px = p.x * w;
    const py = p.y * h;

    const distFromSun = Math.hypot(px - sunX, py - horizonY);
    const proximityGain = Math.max(0.2, 1 - distFromSun / (w * 0.6));
    const pulse = 0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.phase);
    const alpha = 0.45 * pulse * proximityGain * sunIntensity;

    ctx.fillStyle = `rgba(255, 240, 195, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
