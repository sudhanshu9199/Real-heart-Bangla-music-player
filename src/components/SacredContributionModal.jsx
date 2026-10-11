"use client";

import React, { useState, useEffect, useRef } from "react";
import { CONTRIBUTION_CONFIG, buildUpiIntentUrl } from "@/utils/contributionConfig";
import { getDawnAudioEngine } from "@/utils/audioEngine";

/**
 * SacredContributionModal — 2026 Cultural Psychology & Indian Consumer Donation Engine
 * - Auspicious Indian Shagun Tiers (₹21, ₹51, ₹101, ₹251)
 * - Live Devotee Social Proof Ticker (Bandwagon & Communal Validation)
 * - 1-Click Mobile UPI Deep Links for PhonePe, Google Pay, Paytm, and BHIM
 * - Personalized "Sankalp" Name Dedication for divine blessing
 * - Verified Kotak Mahindra Bank Trust Architecture
 * - Fullscreen Golden Diya & Marigold Celebration Canvas
 * - Festive WhatsApp Sharing Loop for viral family blessings
 */
export default function SacredContributionModal({ isOpen, onClose }) {
  const [selectedTier, setSelectedTier] = useState(CONTRIBUTION_CONFIG.tiers[1]); // default: Pushpanjali Arghya (₹51)
  const [customAmount, setCustomAmount] = useState("");
  const [devoteeName, setDevoteeName] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [activeQrSrc, setActiveQrSrc] = useState(CONTRIBUTION_CONFIG.qrImagePath);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const activeAmount = customAmount ? parseInt(customAmount) || 0 : selectedTier?.amount || 51;
  const upiIntentUrl = buildUpiIntentUrl({ amount: activeAmount });

  // Rotating Live Social Proof Devotee Ticker
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % CONTRIBUTION_CONFIG.socialTicker.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Load custom QR image
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
    if (typeof window !== "undefined") {
      localStorage.setItem("mahalaya_diya_lit", "true");
      if (devoteeName.trim()) {
        localStorage.setItem("mahalaya_patron_name", devoteeName.trim());
      }
      window.dispatchEvent(new Event("diya_lit_event"));
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

  const currentDevotee = CONTRIBUTION_CONFIG.socialTicker[tickerIndex];
  const shareText = encodeURIComponent(
    `🪔 আমি মহালয়ার পবিত্র ভোরের সাউন্ডস্কেপে মা দুর্গার চরণে একটি প্রদীপ প্রজ্বলন করেছি।\n\nবীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ ও আকাশবাণী কলকাতা সরাসরি শুনুন:\n${typeof window !== "undefined" ? window.location.origin : "https://sudhans.vercel.app"}`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="diya-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none backdrop-blur-md bg-black/80 animate-in fade-in duration-300"
    >
      {/* Fullscreen Celebration Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Main Glassmorphic Modal Dialog */}
      <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-[#0e0704]/96 border border-[#ff7b1a]/60 shadow-[0_0_60px_rgba(255,123,26,0.38),0_25px_60px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(255,123,26,0.1)] p-5 sm:p-7 text-zinc-100 backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Sacred Saffron Top Atmospheric Flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-gradient-to-b from-[#ff7b1a]/25 via-amber-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer z-10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSuccess ? (
          <div>
            {/* Header: Sacred Diya Symbol + Emotional Resonance */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2f1406] to-[#542107] border border-[#ff7b1a]/80 flex items-center justify-center shadow-[0_0_22px_rgba(255,123,26,0.55)] flex-shrink-0">
                <span className="text-2xl animate-pulse">🪔</span>
              </div>
              <div className="pr-6">
                <h2 id="diya-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-[#ffbe76]">
                  {CONTRIBUTION_CONFIG.copy.headline}
                </h2>
                <p className="text-xs text-orange-200/85 font-medium">
                  {CONTRIBUTION_CONFIG.copy.subHeadline}
                </p>
              </div>
            </div>

            {/* Social Proof Devotee Stream (Cultural Bandwagon Effect) */}
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-orange-950/40 border border-amber-500/25 flex items-center justify-between text-[11px] text-amber-200/90 animate-fade-in">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
                <span className="truncate">
                  🌸 <strong className="text-white">{currentDevotee.name}</strong> ({currentDevotee.city}) প্রদীপ জ্বালিয়েছেন
                </span>
              </div>
              <span className="font-mono text-emerald-300 font-bold ml-2 flex-shrink-0">
                ₹{currentDevotee.amount}
              </span>
            </div>

            {/* Emotional Cultural Framing Copy */}
            <p className="mt-3 text-xs sm:text-[12.5px] leading-relaxed text-zinc-300/90 font-sans">
              {CONTRIBUTION_CONFIG.copy.mission}
            </p>

            {/* Auspicious Shagun Tiers Grid (Ending in +1) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CONTRIBUTION_CONFIG.tiers.map((tier) => {
                const isSelected = !customAmount && selectedTier?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      setCustomAmount("");
                    }}
                    className={`relative p-2.5 rounded-2xl flex flex-col items-center text-center transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? "bg-[#ff7b1a]/25 border-[#ff7b1a] shadow-[0_0_18px_rgba(255,123,26,0.45)] scale-[1.03]"
                        : "bg-zinc-950/70 border-zinc-800/80 hover:border-orange-500/40 hover:bg-zinc-900/50"
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff7b1a] to-[#ffd166] text-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#ff7b1a] whitespace-nowrap">
                        ভক্তপ্রিয়
                      </span>
                    )}
                    <span className="text-xl mt-0.5">{tier.icon}</span>
                    <span className="text-xs font-semibold text-zinc-100 mt-1 line-clamp-1">
                      {tier.name}
                    </span>
                    <span className="text-sm font-bold text-[#ffd166] font-mono mt-0.5">
                      ₹{tier.amount}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Personalized Sankalp (Name for Blessing) */}
            <div className="mt-3.5 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="আপনার বা পরিবারের নাম (ঐচ্ছিক সংকল্প)..."
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/80 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="অন্য অঙ্ক ₹"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 focus:border-amber-500/80 text-xs font-mono text-amber-300 placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* QR Code & Direct UPI Intent Section */}
            <div className="mt-3.5 p-3.5 rounded-2xl bg-zinc-950/80 border border-orange-500/35 flex flex-col sm:flex-row items-center gap-3.5">
              {/* QR Code Container */}
              <div className="relative w-36 h-36 rounded-xl bg-white p-2 flex items-center justify-center shadow-[0_0_24px_rgba(255,123,26,0.3)] flex-shrink-0">
                {qrLoaded ? (
                  <img
                    src={activeQrSrc}
                    alt="Scan UPI QR Code to contribute"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center w-full h-full p-1 bg-amber-50 rounded border border-amber-300">
                    <span className="text-2xl">🪔</span>
                    <span className="text-[10px] font-bold text-zinc-900 mt-1">
                      UPI QR CODE
                    </span>
                    <span className="text-[10px] text-zinc-800 font-mono font-bold">
                      ₹{activeAmount}
                    </span>
                  </div>
                )}
                <div className="absolute -inset-1 rounded-xl border border-amber-400/40 pointer-events-none" />
              </div>

              {/* Instructions, Verified Kotak ID & 1-Tap UPI Intent */}
              <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
                {/* Kotak Bank Verified Seal */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs">
                  <span className="text-emerald-400 font-bold">✓ Verified Merchant</span>
                  <span className="text-zinc-400">• {CONTRIBUTION_CONFIG.bankName}</span>
                </div>

                <div className="text-xs text-orange-200 mt-1">
                  প্রাপক: <strong className="text-white">{CONTRIBUTION_CONFIG.payeeName}</strong>
                </div>

                {/* Copyable Official Kotak Bank UPI ID */}
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="font-mono text-xs text-amber-300 bg-black/80 px-2 py-1 rounded-lg border border-zinc-800 select-all font-semibold">
                    {CONTRIBUTION_CONFIG.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpi}
                    title="Copy UPI ID"
                    className="px-2 py-1 rounded-lg bg-orange-950/80 hover:bg-orange-900 border border-orange-500/50 text-orange-200 text-xs font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {/* 1-Tap Mobile Universal UPI App Trigger */}
                <a
                  href={upiIntentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff7b1a] via-[#ffa502] to-[#ffd166] hover:brightness-110 text-black font-bold text-xs tracking-wide shadow-[0_0_18px_rgba(255,123,26,0.6)] active:scale-95 transition-all text-center"
                >
                  <span>⚡ সরাসরি UPI অ্যাপে পাঠান (₹{activeAmount})</span>
                </a>

                <div className="text-[10px] text-zinc-400 mt-1.5">
                  Google Pay • PhonePe • Paytm • BHIM • Cred
                </div>
              </div>
            </div>

            {/* Gratitude Confirmation Trigger */}
            <div className="mt-3.5">
              <button
                onClick={handleConfirmOffering}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#2f1406] to-[#4a1c07] hover:from-[#3f1b08] hover:to-[#5e2309] border border-[#ff7b1a] text-[#ffd166] hover:text-white font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(255,123,26,0.35)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✨ আমি প্রদীপ অর্পণ করেছি (Confirm My Diya)</span>
              </button>
            </div>
          </div>
        ) : (
          /* GRATITUDE & SANKALP CELEBRATION BLESSING STATE */
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#ff7b1a] to-[#ffd166] flex items-center justify-center shadow-[0_0_35px_#ff7b1a] text-3xl">
              🪔
            </div>
            <h3 className="mt-4 text-xl font-bold text-[#ffd166]">
              {CONTRIBUTION_CONFIG.copy.gratitudeTitle}
            </h3>

            {/* Personalized Devotee Name Blessing */}
            {devoteeName.trim() && (
              <div className="mt-2 inline-block px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/40 text-xs font-medium text-amber-200">
                শ্রী/শ্রীমতী <strong>{devoteeName.trim()}</strong> ও পরিবার
              </div>
            )}

            <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto font-sans">
              {CONTRIBUTION_CONFIG.copy.gratitudeMessage}
            </p>

            {/* Viral WhatsApp Festive Sharing Loop */}
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs tracking-wide shadow-[0_0_16px_rgba(37,211,102,0.4)] active:scale-95 transition-all"
              >
                <span>💬 পরিবার ও বন্ধুদের সাথে আশীর্বাদ শেয়ার করুন</span>
              </a>

              <button
                onClick={onClose}
                className="mt-1 px-6 py-2 rounded-xl bg-[#ff7b1a] text-black font-bold text-xs tracking-wider shadow-[0_0_20px_rgba(255,123,26,0.6)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                পবিত্র সাউন্ডস্কেপে ফিরে যান (Return)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
