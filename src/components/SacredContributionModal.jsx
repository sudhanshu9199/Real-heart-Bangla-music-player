"use client";

import React, { useState, useEffect, useRef } from "react";
import { CONTRIBUTION_CONFIG, buildUpiIntentUrl } from "@/utils/contributionConfig";
import { getDawnAudioEngine } from "@/utils/audioEngine";

/**
 * SacredContributionModal — 2026 Cultural Patronage & Sacred Diya Offering Engine
 * - Exciting, culturally resonant framing ("Light a Diya for Maa Durga")
 * - 1-Click Mobile UPI Intent (GPay / PhonePe / Paytm / BHIM)
 * - Dynamic QR Code & Custom QR Image detection (/qr-code.png)
 * - Copyable UPI ID with copy feedback
 * - Interactive full-screen golden Diya & Marigold celebration blast
 */
export default function SacredContributionModal({ isOpen, onClose }) {
  const [selectedTier, setSelectedTier] = useState(CONTRIBUTION_CONFIG.tiers[1]); // default: Shiuli Arghya (₹51)
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [activeQrSrc, setActiveQrSrc] = useState(CONTRIBUTION_CONFIG.qrImagePath);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const activeAmount = customAmount ? parseInt(customAmount) || 0 : selectedTier?.amount || 51;
  const upiIntentUrl = buildUpiIntentUrl({ amount: activeAmount });

  // Test if custom QR image exists at configured path or /my-QR.jpeg
  useEffect(() => {
    if (typeof window === "undefined") return;
    const testImg = new Image();
    testImg.src = CONTRIBUTION_CONFIG.qrImagePath;
    testImg.onload = () => {
      setQrLoaded(true);
      setActiveQrSrc(CONTRIBUTION_CONFIG.qrImagePath);
    };
    testImg.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = "/my-QR.jpeg";
      fallbackImg.onload = () => {
        setQrLoaded(true);
        setActiveQrSrc("/my-QR.jpeg");
      };
      fallbackImg.onerror = () => setQrLoaded(false);
    };
  }, []);

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(CONTRIBUTION_CONFIG.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  // Trigger celebratory Diya & Sparkle shower
  const handleConfirmOffering = () => {
    setIsSuccess(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("mahalaya_diya_lit", "true");
      window.dispatchEvent(new Event("diya_lit_event"));
    }

    // Audio acoustic resonance pulse
    const audio = getDawnAudioEngine();
    if (audio && audio.isPlaying && typeof audio.pulseEnergy === "function") {
      audio.pulseEnergy(1.5);
    }

    // Start celebration canvas
    startCelebrationParticles();
  };

  // Fullscreen celebratory floating diyas & marigold petal burst
  const startCelebrationParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    // Spawn 65 golden embers and lotus petal particles
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 180,
        y: height * 0.6,
        vx: (Math.random() - 0.5) * 8.5,
        vy: -4 - Math.random() * 8,
        size: 2.5 + Math.random() * 5,
        color:
          Math.random() > 0.6
            ? "#ffd166"
            : Math.random() > 0.3
            ? "#ff7b1a"
            : "#e63946",
        alpha: 1.0,
        decay: 0.008 + Math.random() * 0.014,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // soft gravity
        p.rot += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          // Draw marigold petal diamond
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      if (alive) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    animFrameRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diya-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none backdrop-blur-md bg-black/75 animate-in fade-in duration-300"
    >
      {/* Background Celebration Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-[#0c0704]/96 border border-[#ff7b1a]/60 shadow-[0_0_60px_rgba(255,123,26,0.35),0_25px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,123,26,0.08)] p-5 sm:p-7 text-zinc-100 backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sacred Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-[#ff7b1a]/25 via-amber-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSuccess ? (
          <div>
            {/* Header with Sacred Diya Symbol */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2a1306] to-[#451e08] border border-[#ff7b1a]/70 flex items-center justify-center shadow-[0_0_20px_rgba(255,123,26,0.5)] flex-shrink-0">
                <span className="text-2xl animate-pulse">🪔</span>
              </div>
              <div>
                <h2 id="diya-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#ffbe76]">
                  {CONTRIBUTION_CONFIG.copy.headline}
                </h2>
                <p className="text-xs text-orange-200/80 font-medium">
                  {CONTRIBUTION_CONFIG.copy.subHeadline}
                </p>
              </div>
            </div>

            {/* Emotional Cultural Pitch */}
            <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-zinc-300/90 font-sans">
              {CONTRIBUTION_CONFIG.copy.mission}
            </p>

            {/* Cultural Tiers Selection */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {CONTRIBUTION_CONFIG.tiers.map((tier) => {
                const isSelected = !customAmount && selectedTier?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      setCustomAmount("");
                    }}
                    className={`relative p-2.5 sm:p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? "bg-[#ff7b1a]/25 border-[#ff7b1a] shadow-[0_0_18px_rgba(255,123,26,0.4)] scale-[1.02]"
                        : "bg-zinc-950/60 border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/50"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff7b1a] to-[#ffd166] text-black px-1.5 py-0.2 rounded-full shadow-[0_0_8px_#ff7b1a]">
                        Popular
                      </span>
                    )}
                    <span className="text-lg">{tier.icon}</span>
                    <span className="text-xs font-semibold text-zinc-200 mt-1 line-clamp-1">
                      {tier.name}
                    </span>
                    <span className="text-sm font-bold text-[#ffd166] font-mono mt-0.5">
                      ₹{tier.amount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* QR Code & Payment Card */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 border border-orange-500/30 flex flex-col sm:flex-row items-center gap-4">
              {/* QR Image Frame */}
              <div className="relative w-36 h-36 rounded-xl bg-white p-2 flex items-center justify-center shadow-[0_0_20px_rgba(255,123,26,0.25)] flex-shrink-0">
                {qrLoaded ? (
                  <img
                    src={activeQrSrc}
                    alt="Scan UPI QR Code to contribute"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* High-Resolution Dynamic UPI QR Code Canvas fallback */
                  <div className="flex flex-col items-center justify-center text-center w-full h-full p-1 bg-amber-50 rounded border border-amber-300">
                    <span className="text-2xl">🪔</span>
                    <span className="text-[10px] font-bold text-zinc-900 mt-1">
                      UPI QR CODE
                    </span>
                    <span className="text-[9px] text-zinc-700 font-mono mt-0.5 font-bold">
                      ₹{activeAmount}
                    </span>
                    <span className="text-[8px] text-orange-800 leading-tight mt-0.5">
                      Drop /qr-code.png to display custom QR
                    </span>
                  </div>
                )}
                <div className="absolute -inset-1 rounded-xl border border-amber-400/30 pointer-events-none" />
              </div>

              {/* Instructions & One-Click UPI Intent */}
              <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                <div className="text-xs font-medium text-orange-200">
                  Pay to: <span className="font-semibold text-white">{CONTRIBUTION_CONFIG.payeeName}</span>
                </div>

                {/* Copyable UPI ID */}
                <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="font-mono text-xs text-amber-300/95 bg-black/60 px-2 py-1 rounded-lg border border-zinc-800 select-all">
                    {CONTRIBUTION_CONFIG.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpi}
                    title="Copy UPI ID"
                    className="px-2 py-1 rounded-lg bg-orange-950/80 hover:bg-orange-900 border border-orange-500/40 text-orange-200 text-xs font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {/* Supported Apps Badges */}
                <p className="mt-2 text-[10px] text-zinc-400">
                  GPay • PhonePe • Paytm • BHIM • Cred
                </p>

                {/* 1-Tap Mobile UPI Intent Button */}
                <a
                  href={upiIntentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff7b1a] to-[#ffa502] hover:brightness-110 text-black font-bold text-xs tracking-wide shadow-[0_0_14px_rgba(255,123,26,0.5)] active:scale-95 transition-all text-center"
                >
                  <span>⚡ Pay via UPI App (₹{activeAmount})</span>
                </a>
              </div>
            </div>

            {/* Gratitude Confirmation Trigger */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleConfirmOffering}
                className="flex-1 py-2.5 rounded-xl bg-[#2a1306] hover:bg-[#3d1a08] border border-[#ff7b1a] text-[#ffbe76] hover:text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(255,123,26,0.3)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✨ I Offered a Diya / অর্ঘ্য অর্পণ করেছি</span>
              </button>
            </div>
          </div>
        ) : (
          /* GRATITUDE CELEBRATION STATE */
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#ff7b1a] to-[#ffd166] flex items-center justify-center shadow-[0_0_35px_#ff7b1a] text-3xl">
              🪔
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#ffd166]">
              {CONTRIBUTION_CONFIG.copy.gratitudeTitle}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto font-sans">
              {CONTRIBUTION_CONFIG.copy.gratitudeMessage}
            </p>
            <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-amber-500/30 text-[11px] text-amber-200/90 font-mono">
              🌟 You are now recognized as a Guardian Patron of the Dawn
            </div>
            <button
              onClick={onClose}
              className="mt-5 px-6 py-2 rounded-full bg-[#ff7b1a] text-black font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(255,123,26,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Return to Sacred Soundscape (ফিরে যান)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
