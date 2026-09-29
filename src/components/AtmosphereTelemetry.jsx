"use client";

import React from "react";

export default function AtmosphereTelemetry({ solarState, dayOfMonth, timeDecimal }) {
  const {
    altitude,
    azimuth,
    phaseName,
    phaseDescription,
    sunIntensity,
    ambientLightLux,
    colorTempK,
    shadowSoftness,
    hazeDensity,
    treeRimLight,
    colors,
  } = solarState;

  // Format time as HH:MM:SS AM/PM
  const hours = Math.floor(timeDecimal);
  const minutes = Math.floor((timeDecimal - hours) * 60);
  const seconds = Math.floor(((timeDecimal - hours) * 60 - minutes) * 60);
  const isPM = hours >= 12;
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeFormatted = `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} ${isPM ? "PM" : "AM"}`;

  const rgbHex = (rgb) =>
    "#" + rgb.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

  return (
    <div className="flex flex-col gap-4 text-xs font-mono text-zinc-300">
      {/* Top Header Card */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span className="font-semibold tracking-wider text-white uppercase text-[11px]">
              Dawn Atmosphere Engine
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-zinc-300 border border-white/10">
            OCT {dayOfMonth}, 2026
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div className="text-3xl font-extralight tracking-tight text-white font-sans">
            {timeFormatted}
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Phase</div>
            <div className="text-xs font-medium text-amber-200">{phaseName}</div>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 mt-2 italic leading-relaxed border-t border-white/5 pt-2">
          "{phaseDescription}"
        </p>
      </div>

      {/* Solar Altitude Gauge */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="uppercase tracking-wider text-[10px] text-zinc-400">
            Solar Altitude & Elevation
          </span>
          <span className="font-semibold text-white">
            {altitude > 0 ? `+${altitude.toFixed(1)}°` : `${altitude.toFixed(1)}°`}
          </span>
        </div>

        {/* Visual Arc Scale */}
        <div className="relative w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/5 my-1">
          {/* Night band (-24 to -18) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-indigo-950"
            style={{ width: "20%" }}
            title="Night (< -18°)"
          />
          {/* Astronomical Dawn (-18 to -12) */}
          <div
            className="absolute top-0 bottom-0 bg-blue-900/80"
            style={{ left: "20%", width: "20%" }}
            title="Astronomical Dawn (-18° to -12°)"
          />
          {/* Nautical Dawn (-12 to -6) */}
          <div
            className="absolute top-0 bottom-0 bg-violet-800/80"
            style={{ left: "40%", width: "20%" }}
            title="Nautical Dawn (-12° to -6°)"
          />
          {/* Civil Dawn (-6 to 0) */}
          <div
            className="absolute top-0 bottom-0 bg-amber-600/80"
            style={{ left: "60%", width: "20%" }}
            title="Civil Dawn (-6° to 0°)"
          />
          {/* Sunrise (> 0) */}
          <div
            className="absolute top-0 bottom-0 bg-amber-300"
            style={{ left: "80%", width: "20%" }}
            title="Sunrise & Daylight (> 0°)"
          />

          {/* Current Solar Altitude Marker */}
          {(() => {
            // Map -24° to +6° to 0% - 100%
            const pct = Math.max(0, Math.min(100, ((altitude - (-24)) / 30) * 100));
            return (
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#ffffff] -ml-[3px] transition-all duration-150"
                style={{ left: `${pct}%` }}
              />
            );
          })()}
        </div>

        <div className="flex justify-between text-[9px] text-zinc-500 mt-1">
          <span>-24° (Night)</span>
          <span>-18° (Astro)</span>
          <span>-12° (Naut)</span>
          <span>-6° (Civil)</span>
          <span className="text-amber-400 font-semibold">0° (Horizon)</span>
          <span>+6°</span>
        </div>
      </div>

      {/* Atmospheric Driver Telemetry Grid */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium pb-1 border-b border-white/5 flex items-center justify-between">
          <span>Driven Parameters</span>
          <span className="text-[9px] text-emerald-400">● Real-time Physics</span>
        </div>

        {/* Ambient Light & Kelvin */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-zinc-400">Ambient Illuminance</div>
            <div className="text-sm font-light text-white mt-0.5">
              {ambientLightLux < 1
                ? `${ambientLightLux.toFixed(3)} lx`
                : `${Math.round(ambientLightLux)} lx`}
            </div>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-[9px] text-zinc-400">Color Temperature</div>
            <div className="text-sm font-light text-amber-200 mt-0.5">
              {Math.round(colorTempK)} K
            </div>
          </div>
        </div>

        {/* Parameter Bars */}
        <div className="space-y-2 text-[10px]">
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Sun Intensity</span>
              <span className="text-white">{(sunIntensity * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-150"
                style={{ width: `${sunIntensity * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Cool Mist & Haze</span>
              <span className="text-white">{(hazeDensity * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-900 to-cyan-400 transition-all duration-150"
                style={{ width: `${hazeDensity * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Tree Backlight Rim</span>
              <span className="text-white">{(treeRimLight * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-zinc-700 to-amber-400 transition-all duration-150"
                style={{ width: `${treeRimLight * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Shadow Softness</span>
              <span className="text-white">{(shadowSoftness * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-400 transition-all duration-150"
                style={{ width: `${shadowSoftness * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Palette Swatches */}
        <div className="pt-2 border-t border-white/5">
          <div className="text-[9px] uppercase tracking-wider text-zinc-400 mb-2">
            Dynamic Atmosphere Chromatics
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="flex flex-col items-center">
              <div
                className="w-full h-6 rounded-lg border border-white/10 shadow-inner"
                style={{ backgroundColor: rgbHex(colors.skyZenith) }}
              />
              <span className="text-[8px] text-zinc-400 mt-1">Zenith</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-full h-6 rounded-lg border border-white/10 shadow-inner"
                style={{ backgroundColor: rgbHex(colors.skyHorizon) }}
              />
              <span className="text-[8px] text-zinc-400 mt-1">Horizon</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-full h-6 rounded-lg border border-white/10 shadow-inner"
                style={{ backgroundColor: rgbHex(colors.fogColor) }}
              />
              <span className="text-[8px] text-zinc-400 mt-1">Mist</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-full h-6 rounded-lg border border-white/10 shadow-inner"
                style={{ backgroundColor: rgbHex(colors.silhouetteColor) }}
              />
              <span className="text-[8px] text-zinc-400 mt-1">Silhouette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
