"use client";

import React, { useState, useEffect } from "react";
import { useLivingDarshan, openDarshanModal } from "@/utils/durgaDarshanEngine";

/**
 * Option A: Celestial Darshan Sky Layer (স্বর্গীয় আকাশ দর্শন)
 * Subtly renders the active Prahar's sacred Maa Durga image amidst the clouds
 * above the horizon with ethereal feathered masking, golden auric breathing,
 * and seamless time-based crossfade.
 */
export default function CelestialDarshanSkyLayer({ solarState }) {
  const { currentSlot } = useLivingDarshan();
  const [displayImage, setDisplayImage] = useState(currentSlot?.image || "/darshan/darshan_sandhya.jpg");
  const [prevImage, setPrevImage] = useState(null);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle smooth 1.5s crossfade between Prahar transitions
  useEffect(() => {
    if (currentSlot?.image && currentSlot.image !== displayImage) {
      setPrevImage(displayImage);
      setDisplayImage(currentSlot.image);
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setIsCrossfading(false);
        setPrevImage(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentSlot?.image, displayImage]);

  // Adjust celestial opacity based on solar altitude (more pronounced at dawn/dusk/night)
  const baseOpacity = 0.78;

  return (
    <div
      className="absolute inset-0 z-1 pointer-events-none overflow-hidden select-none flex items-center justify-center"
      aria-hidden="true"
    >
      {/* 1. Celestial Auric Glow / Radial Halo */}
      <div
        className="absolute top-[8%] sm:top-[6%] w-[90vw] sm:w-[70vw] md:w-[55vw] max-w-4xl h-[45vh] sm:h-[55vh] rounded-full transition-all duration-1000 ease-out pointer-events-none"
        style={{
          background: currentSlot?.auraGradient || "radial-gradient(circle, rgba(255,123,26,0.3) 0%, transparent 70%)",
          filter: "blur(48px)",
          opacity: 0.85,
        }}
      />

      {/* 2. Previous Image (during crossfade) */}
      {isCrossfading && prevImage && (
        <div
          className="absolute top-[6%] sm:top-[4%] w-[88vw] sm:w-[72vw] md:w-[60vw] max-w-4xl h-[42vh] sm:h-[52vh] transition-opacity duration-1000 ease-out pointer-events-none"
          style={{
            opacity: 0,
            maskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.6) 55%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.6) 55%, transparent 75%)",
          }}
        >
          <img
            src={prevImage}
            alt="Previous Darshan"
            className="w-full h-full object-cover object-center rounded-3xl"
          />
        </div>
      )}

      {/* 3. Active Living Prahar Artwork */}
      <div
        className={`absolute top-[6%] sm:top-[4%] w-[88vw] sm:w-[72vw] md:w-[60vw] max-w-4xl h-[42vh] sm:h-[52vh] transition-all duration-1000 ease-out pointer-events-auto cursor-pointer group`}
        onClick={() => openDarshanModal()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="শ্রীশ্রী দুর্গা দর্শন (Click to enter full Sacred Darshan)"
        style={{
          opacity: isCrossfading ? 1 : baseOpacity,
          maskImage:
            "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 70%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,1) 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.2) 70%, transparent 85%)",
        }}
      >
        <img
          src={displayImage}
          alt={currentSlot?.nameBn || "Maa Durga Darshan"}
          className="w-full h-full object-cover object-center rounded-3xl transition-transform duration-[8000ms] ease-in-out group-hover:scale-105"
          style={{
            filter: "contrast(1.05) brightness(0.95)",
          }}
        />

        {/* 4. Subtle Shimmering Golden Rim Highlight */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-500 opacity-30 group-hover:opacity-70"
          style={{
            boxShadow: `inset 0 0 40px ${currentSlot?.accentColor || "#ff7b1a"}`,
          }}
        />

        {/* 5. Discrete Celestial Tooltip on Hover */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-orange-500/40 text-[11px] text-amber-200 font-medium shadow-[0_0_15px_rgba(255,123,26,0.4)] whitespace-nowrap">
          {currentSlot?.icon} {currentSlot?.nameBn} • সম্পূর্ণ দর্শন করতে ক্লিক করুন
        </div>
      </div>
    </div>
  );
}
