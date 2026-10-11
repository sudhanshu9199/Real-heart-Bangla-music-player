"use client";

import React, { useState, useEffect, useRef } from "react";
import { CONTRIBUTION_CONFIG, buildUpiIntentUrl } from "@/utils/contributionConfig";
import { getDawnAudioEngine } from "@/utils/audioEngine";

/**
 * SacredContributionModal — 2026 Mobile-Optimized Cultural Psychology & UPI Contribution Engine
 * - Viewport-Aware Responsive Architecture (Fits Vivo Y28, iPhones, and all mobile screens)
 * - Mobile Bottom-Sheet on smartphones (`max-h-[90dvh] flex flex-col`) with internal smooth scrolling
 * - Top Close 'X' and Header NEVER get clipped or overflow the screen
 * - 4-Column Single-Row Shagun Tiers (Zero vertical bloat, saves 120px+ vertical space)
 * - Compact Mobile QR + High-Prominence 1-Tap UPI Intent Button (PhonePe, GPay, Paytm)
 * - Bilingual Typography (Bengali + English) tailored for both Resident & Probashi Bengalis
 * - 40+ Rich Devotee Pool with dynamic shuffle and anti-repetition engine
 * - Personalized "Sankalp" Name Dedication with instant optimistic live-ticker update
 * - Verified Kotak Mahindra Bank Trust Architecture
 * - Fullscreen Golden Diya & Marigold Celebration Canvas
 * - Festive WhatsApp Sharing Loop for viral family blessings
 */
export default function SacredContributionModal({ isOpen, onClose }) {
  // Default selected tier: ₹51 (Pushpanjali Arghya - Popular choice)
  const [selectedTier, setSelectedTier] = useState(CONTRIBUTION_CONFIG.tiers[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [devoteeName, setDevoteeName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Shuffled live ticker pool to prevent repetitive name loops
  const [tickerList, setTickerList] = useState([]);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [activeQrSrc, setActiveQrSrc] = useState(CONTRIBUTION_CONFIG.qrImagePath);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const activeAmount = customAmount ? parseInt(customAmount) || 0 : selectedTier?.amount || 51;
  const upiIntentUrl = buildUpiIntentUrl({ amount: activeAmount });

  // Initialize and shuffle the 40+ devotee pool on mount
  useEffect(() => {
    const list = [...CONTRIBUTION_CONFIG.socialTicker];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    setTickerList(list);
  }, []);

  // Smooth live rotating devotee ticker (every 4.5 seconds)
  useEffect(() => {
    if (!isOpen || tickerList.length === 0) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % tickerList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isOpen, tickerList.length]);

  // Load custom QR image with resilient fallback
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

  // Trigger Celebratory Diya & Marigold Shower
  const handleConfirmOffering = () => {
    setIsSuccess(true);
    const trimmedName = devoteeName.trim();

    if (typeof window !== "undefined") {
      localStorage.setItem("mahalaya_diya_lit", "true");
      if (trimmedName) {
        localStorage.setItem("mahalaya_patron_name", trimmedName);
      }
      window.dispatchEvent(new Event("diya_lit_event"));
    }

    // Dynamic Social Proof: Optimistically prepend the user's offering to the ticker!
    if (trimmedName) {
      setTickerList((prev) => [
        {
          name: trimmedName,
          bnName: trimmedName,
          city: "Live Devotee",
          amount: activeAmount,
          time: "just now",
        },
        ...prev,
      ]);
      setTickerIndex(0);
    }

    // Acoustic sacred energy pulse
    const audio = getDawnAudioEngine();
    if (audio && audio.isPlaying && typeof audio.pulseEnergy === "function") {
      audio.pulseEnergy(1.6);
    }

    startCelebrationParticles();
  };

  // Canvas Celebration Particle Engine (Marigold Petals & Glowing Diya Embers)
  const startCelebrationParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 220,
        y: height * 0.65,
        vx: (Math.random() - 0.5) * 9,
        vy: -5 - Math.random() * 8.5,
        size: 2.8 + Math.random() * 5.2,
        color:
          Math.random() > 0.65
            ? "#ffd166"
            : Math.random() > 0.35
            ? "#ff7b1a"
            : "#e63946",
        alpha: 1.0,
        decay: 0.007 + Math.random() * 0.012,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.12,
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.085;
        p.rot += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;

          // Sacred marigold petal shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.75, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.75, 0);
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

  const currentDevotee = tickerList[tickerIndex] || CONTRIBUTION_CONFIG.socialTicker[0];
  const shareText = encodeURIComponent(
    `🪔 আমি মহালয়ার পবিত্র ভোরের সাউন্ডস্কেপে মা দুর্গার চরণে একটি প্রদীপ প্রজ্বলন করেছি।\n\nI lit a sacred Diya on the Mahalaya dawn soundscape. Listen live (100% ad-free):\n${
      typeof window !== "undefined" ? window.location.origin : "https://sudhans.vercel.app"
    }`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diya-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none backdrop-blur-md bg-black/85 animate-in fade-in duration-300 overflow-hidden"
    >
      {/* Fullscreen Celebration Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Main Responsive Modal / Bottom Sheet */}
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#0e0704]/98 border-t sm:border border-[#ff7b1a]/60 shadow-[0_0_60px_rgba(255,123,26,0.35),0_25px_60px_rgba(0,0,0,0.95)] max-h-[90dvh] sm:max-h-[88vh] flex flex-col text-zinc-100 backdrop-blur-2xl overflow-hidden animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200">
        
        {/* Mobile Pull-Down Indicator Bar */}
        <div className="w-10 h-1 rounded-full bg-zinc-700/60 mx-auto mt-2.5 sm:hidden flex-shrink-0" />

        {/* Sacred Saffron Top Atmospheric Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-b from-[#ff7b1a]/20 via-amber-500/10 to-transparent blur-xl pointer-events-none" />

        {/* 1. FIXED TOP HEADER BAR (Always Visible & Never Clipped) */}
        <div className="relative px-4 sm:px-6 pt-2 sm:pt-4 pb-2 border-b border-orange-500/15 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#2f1406] to-[#542107] border border-[#ff7b1a]/80 flex items-center justify-center shadow-[0_0_16px_rgba(255,123,26,0.5)] flex-shrink-0">
              <span className="text-xl sm:text-2xl animate-pulse">🪔</span>
            </div>
            <div>
              <h2 id="diya-modal-title" className="text-sm sm:text-base font-bold tracking-tight text-[#ffbe76] leading-tight">
                ভোরের আলো জ্বালিয়ে রাখুন
              </h2>
              <p className="text-[10px] sm:text-[11px] text-orange-200/90 font-medium leading-tight">
                Keep the Dawn Glowing • Light a Sacred Diya
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer z-10"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. INNER SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-2.5 sm:py-3 space-y-2.5 sm:space-y-3 overscroll-contain">
          {!isSuccess ? (
            <>
              {/* Devotee Social Proof Live Ticker */}
              <div className="py-1 px-2.5 rounded-xl bg-orange-950/40 border border-amber-500/25 flex items-center justify-between text-[10.5px] text-amber-200/90">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                  <span className="truncate">
                    🌸 <strong className="text-white">{currentDevotee.name}</strong> ({currentDevotee.city}) lit a Diya
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-1.5">
                  <span className="text-[9.5px] text-zinc-400 hidden xs:inline">{currentDevotee.time}</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    ₹{currentDevotee.amount}
                  </span>
                </div>
              </div>

              {/* Emotional Purpose Banner (Concise & Impactful) */}
              <div className="py-1.5 px-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-300 leading-snug">
                ১০০% বিজ্ঞাপনহীন এই ভোরের সাউন্ডস্কেপ অক্ষুণ্ণ রাখতে আপনার প্রদীপ অর্ঘ্য নিবেদন করুন (100% ad-free community soundscape).
              </div>

              {/* Auspicious Shagun Tiers Grid (Single Row of 4 — Saves 120px+ Vertical Space) */}
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {CONTRIBUTION_CONFIG.tiers.map((tier) => {
                  const isSelected = !customAmount && selectedTier?.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      onClick={() => {
                        setSelectedTier(tier);
                        setCustomAmount("");
                      }}
                      className={`relative p-1.5 sm:p-2 rounded-xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer border ${
                        isSelected
                          ? "bg-[#ff7b1a]/25 border-[#ff7b1a] shadow-[0_0_14px_rgba(255,123,26,0.45)] scale-[1.02]"
                          : "bg-zinc-950/70 border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/50"
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7.5px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff7b1a] to-[#ffd166] text-black px-1 py-0.2 rounded-full shadow-[0_0_6px_#ff7b1a] whitespace-nowrap">
                          ★ Popular
                        </span>
                      )}
                      <span className="text-base sm:text-lg mt-0.5">{tier.icon}</span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-100 mt-0.5 leading-tight truncate w-full">
                        {tier.name}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-sans leading-tight truncate w-full">
                        {tier.enName}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#ffd166] font-mono mt-0.5">
                        ₹{tier.amount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Personalized Sankalp & Custom Amount Inputs */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <input
                  type="text"
                  placeholder="Devotee Name (নাম / সংকল্প)..."
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/80 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-colors"
                />
                <input
                  type="number"
                  placeholder="₹ Other"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-20 sm:w-24 px-2 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/80 text-xs font-mono text-amber-300 placeholder-zinc-500 outline-none transition-colors"
                />
              </div>

              {/* Compact Payment Card (Responsive QR + 1-Tap Mobile Intent) */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-zinc-950/90 border border-orange-500/35 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Compact QR Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white p-1 flex items-center justify-center shadow-[0_0_16px_rgba(255,123,26,0.25)] flex-shrink-0">
                    {qrLoaded ? (
                      <img
                        src={activeQrSrc}
                        alt="Scan UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center w-full h-full p-0.5 bg-amber-50 rounded">
                        <span className="text-lg">🪔</span>
                        <span className="text-[8px] font-bold text-zinc-900">QR CODE</span>
                        <span className="text-[8px] text-zinc-800 font-mono font-bold">₹{activeAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Merchant Details & Copyable UPI */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1 text-[11px] leading-tight truncate">
                      <span className="text-emerald-400 font-bold">✓ Verified</span>
                      <span className="text-zinc-400">• Kotak Bank</span>
                    </div>

                    <div className="text-[11px] text-orange-200 mt-0.5 truncate">
                      প্রাপক: <strong className="text-white">{CONTRIBUTION_CONFIG.payeeName}</strong>
                    </div>

                    {/* Copyable UPI Pill */}
                    <div className="mt-1 flex items-center gap-1">
                      <span className="font-mono text-[10.5px] text-amber-300 bg-black/80 px-1.5 py-0.5 rounded border border-zinc-800 select-all font-semibold truncate max-w-[150px] sm:max-w-none">
                        {CONTRIBUTION_CONFIG.upiId}
                      </span>
                      <button
                        onClick={handleCopyUpi}
                        title="Copy UPI ID"
                        className="px-1.5 py-0.5 rounded bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-200 text-[10px] font-medium transition-all active:scale-95 cursor-pointer flex-shrink-0"
                      >
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 1-Tap Mobile Universal UPI App Trigger (Full Width Prominent CTA) */}
                <a
                  href={upiIntentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#ff7b1a] via-[#ffa502] to-[#ffd166] hover:brightness-110 text-black font-bold text-xs tracking-wide shadow-[0_0_16px_rgba(255,123,26,0.5)] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>⚡ Pay ₹{activeAmount} via UPI App (PhonePe / GPay / Paytm)</span>
                </a>
              </div>

              {/* Gratitude Confirmation Trigger */}
              <button
                onClick={handleConfirmOffering}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2f1406] to-[#4a1c07] hover:from-[#3f1b08] hover:to-[#5e2309] border border-[#ff7b1a] text-[#ffd166] hover:text-white font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_16px_rgba(255,123,26,0.3)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mb-1"
              >
                <span>✨ I Have Offered My Diya (অর্ঘ্য সম্পন্ন করেছি)</span>
              </button>
            </>
          ) : (
            /* GRATITUDE & SANKALP CELEBRATION BLESSING STATE */
            <div className="text-center py-3 animate-in zoom-in-95 duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-gradient-to-tr from-[#ff7b1a] to-[#ffd166] flex items-center justify-center shadow-[0_0_25px_#ff7b1a] text-2xl sm:text-3xl">
                🪔
              </div>
              <h3 className="mt-2.5 text-lg font-bold text-[#ffd166]">
                {CONTRIBUTION_CONFIG.copy.gratitudeTitle}
              </h3>
              <p className="text-[11px] text-orange-200/90 font-medium">
                {CONTRIBUTION_CONFIG.copy.gratitudeTitleEn}
              </p>

              {devoteeName.trim() && (
                <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-orange-950/60 border border-orange-500/40 text-[11px] font-medium text-amber-200">
                  শ্রী/শ্রীমতী <strong>{devoteeName.trim()}</strong> & Family
                </div>
              )}

              <div className="mt-2 text-[11px] sm:text-xs text-zinc-300 leading-relaxed max-w-sm mx-auto font-sans space-y-1">
                <p>{CONTRIBUTION_CONFIG.copy.gratitudeMessageBn}</p>
                <p className="text-[10px] text-zinc-400">{CONTRIBUTION_CONFIG.copy.gratitudeMessageEn}</p>
              </div>

              {/* Viral WhatsApp Festive Sharing Loop */}
              <div className="mt-3.5 flex flex-col gap-1.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs tracking-wide shadow-[0_0_14px_rgba(37,211,102,0.4)] active:scale-95 transition-all"
                >
                  <span>💬 Share Blessing on WhatsApp (পরিবারে শেয়ার করুন)</span>
                </a>

                <button
                  onClick={onClose}
                  className="mt-1 px-5 py-2 rounded-xl bg-[#ff7b1a] text-black font-bold text-xs tracking-wider shadow-[0_0_16px_rgba(255,123,26,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Return to Soundscape (ফিরে যান)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
