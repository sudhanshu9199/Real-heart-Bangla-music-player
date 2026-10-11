"use client";

import React, { useState, useEffect } from "react";
import { useLivingDarshan, openDarshanModal } from "@/utils/durgaDarshanEngine";

/**
 * Option A: Celestial Darshan Sky Layer (স্বর্গীয় আকাশ দর্শন)
 * Subtly renders the active Prahar's sacred Maa Durga image amidst the clouds
 * above the horizon with feathered multi-stop masking, golden auric breathing,
 * and zero harsh rectangular boundaries across both desktop and mobile viewports.
 */
export default function CelestialDarshanSkyLayer({ solarState }) {
  const { currentDarshan, currentSlot } = useLivingDarshan();
  const [displayImage, setDisplayImage] = useState(currentDarshan?.image || "/darshan/darshan_sandhya.jpg");
  const [prevImage, setPrevImage] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth crossfade on image transition
  useEffect(() => {
    if (currentDarshan?.image && currentDarshan.image !== displayImage) {
      setPrevImage(displayImage);
      setDisplayImage(currentDarshan.image);
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setIsCrossfading(false);
        setPrevImage(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentDarshan?.image, displayImage]);

  return (
    <div
      className="absolute inset-0 z-1 pointer-events-none overflow-hidden select-none flex items-start justify-center"
      aria-hidden="true"
    >
      {/* 1. Celestial Auric Glow / Radial Halo */}
      <div
        className="absolute top-[3.5rem] sm:top-[3rem] md:top-[2.5rem] w-[92vw] sm:w-[75vw] md:w-[60vw] max-w-4xl h-[34vh] sm:h-[46vh] rounded-full transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: currentSlot?.auraGradient || "radial-gradient(circle, rgba(255,123,26,0.3) 0%, transparent 70%)",
          filter: "blur(54px)",
          opacity: 0.85,
        }}
      />

      {/* 2. Previous Image (during crossfade) */}
      {isCrossfading && prevImage && (
        <div
          className="absolute top-[3.5rem] sm:top-[3rem] md:top-[2.5rem] w-[90vw] sm:w-[76vw] md:w-[62vw] max-w-4xl h-[32vh] sm:h-[44vh] md:h-[48vh] transition-opacity duration-1000 ease-out pointer-events-none"
          style={{
            opacity: 0,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.15) 86%, transparent 98%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,1) 30%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 72%, rgba(0,0,0,0.15) 86%, transparent 98%)",
          }}
        >
          <img
            src={prevImage}
            alt="Previous Darshan"
            className="w-full h-full object-cover object-[center_35%] rounded-3xl"
          />
        </div>
      )}

      {/* 3. Active Living Prahar Artwork */}
      <div
        className="absolute top-[3.5rem] sm:top-[3rem] md:top-[2.5rem] w-[90vw] sm:w-[76vw] md:w-[62vw] max-w-4xl h-[32vh] sm:h-[44vh] md:h-[48vh] transition-all duration-1000 ease-out pointer-events-auto cursor-pointer group"
        onClick={() => openDarshanModal()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={`${currentDarshan?.titleBn || "শ্রীশ্রী দুর্গা দর্শন"} (Click to view full Sacred Darshan)`}
        style={{
          opacity: isCrossfading ? 0.95 : 0.82,
          maskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 14%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.15) 86%, transparent 98%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 14%, rgba(0,0,0,1) 28%, rgba(0,0,0,1) 52%, rgba(0,0,0,0.65) 72%, rgba(0,0,0,0.15) 86%, transparent 98%)",
        }}
      >
        <img
          src={displayImage}
          alt={currentDarshan?.titleBn || "Maa Durga Darshan"}
          className="w-full h-full object-cover object-[center_32%] rounded-3xl transition-transform duration-[8000ms] ease-in-out group-hover:scale-103"
          style={{
            filter: "contrast(1.04) brightness(0.96)",
          }}
        />

        {/* 4. Subtle Shimmering Golden Rim Highlight */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-60"
          style={{
            boxShadow: `inset 0 0 35px ${currentSlot?.accentColor || "#ff7b1a"}`,
          }}
        />

        {/* 5. Discrete Celestial Tooltip on Hover */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/85 backdrop-blur-md px-3.5 py-1 rounded-full border border-orange-500/50 text-[11px] text-amber-200 font-medium shadow-[0_0_18px_rgba(255,123,26,0.5)] whitespace-nowrap flex items-center gap-1.5">
          <span>{currentSlot?.icon}</span>
          <span>{currentDarshan?.titleBn || currentSlot?.nameBn}</span>
          <span className="text-orange-400">•</span>
          <span className="text-orange-300/80">ক্লিক করে দর্শন করুন</span>
        </div>
      </div>
    </div>
  );
}
