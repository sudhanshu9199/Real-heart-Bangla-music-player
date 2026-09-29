"use client";

import React, { useState } from "react";

export default function EngineControls({
  timeDecimal,
  setTimeDecimal,
  dayOfMonth,
  setDayOfMonth,
  isPlaying,
  setIsPlaying,
  playbackSpeed,
  setPlaybackSpeed,
  layersVisible,
  setLayersVisible,
  fogDensity,
  setFogDensity,
  cloudDensity,
  setCloudDensity,
  windSpeed,
  setWindSpeed,
  audioMuted,
  setAudioMuted,
  audioVolume,
  setAudioVolume,
  onPhaseSelect,
}) {
  const [activeTab, setActiveTab] = useState("timeline"); // timeline | layers | environment

  const phases = [
    {
      time: 4.0,
      label: "4:00 AM",
      subtitle: "Deep Blue & Cool Mist",
      color: "from-blue-950 to-indigo-950",
      border: "border-blue-900/60",
    },
    {
      time: 4.5,
      label: "4:30 AM",
      subtitle: "Blue-Violet",
      color: "from-indigo-950 to-purple-950",
      border: "border-purple-900/60",
    },
    {
      time: 5.0,
      label: "5:00 AM",
      subtitle: "Violet-Orange",
      color: "from-purple-900 to-rose-950",
      border: "border-rose-900/60",
    },
    {
      time: 5.5,
      label: "5:30 AM",
      subtitle: "Soft Gold",
      color: "from-rose-900 to-amber-950",
      border: "border-amber-700/60",
    },
    {
      time: 6.25,
      label: "6:15 AM",
      subtitle: "Sunrise Horizon",
      color: "from-amber-800 to-yellow-600",
      border: "border-yellow-500/60",
    },
  ];

  const speeds = [
    { label: "1x Realtime", val: 1 },
    { label: "30x Dawn", val: 30 },
    { label: "120x Fast", val: 120 },
    { label: "300x Timelapse", val: 300 },
  ];

  return (
    <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl text-xs font-mono text-zinc-300 transition-all max-w-4xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "timeline"
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Dawn Timeline & Phases
          </button>
          <button
            onClick={() => setActiveTab("layers")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "layers"
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Cloud Depth Hierarchy
          </button>
          <button
            onClick={() => setActiveTab("environment")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              activeTab === "environment"
                ? "bg-white text-black shadow-lg shadow-white/10"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            Atmospheric Sensors
          </button>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              !audioMuted
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
            }`}
            title="Procedural Dawn Audio Synthesizer (Web Audio API)"
          >
            <span>{!audioMuted ? "🔊 Audio On" : "🔈 Ambient Sound"}</span>
          </button>
          {!audioMuted && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audioVolume}
              onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
              className="w-16 accent-emerald-400 h-1 bg-white/20 rounded-lg cursor-pointer"
              title="Soundscape Volume"
            />
          )}
        </div>
      </div>

      {/* TAB 1: DAWN TIMELINE & PRESETS */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {/* Quick Dawn Transition Presets */}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2">
              Atmosphere Engine Progression Presets
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {phases.map((p) => {
                const isActive = Math.abs(timeDecimal - p.time) < 0.2;
                return (
                  <button
                    key={p.label}
                    onClick={() => onPhaseSelect(p.time)}
                    className={`flex flex-col text-left p-3 rounded-2xl border transition-all relative overflow-hidden group ${
                      isActive
                        ? `${p.border} bg-white/10 shadow-lg ring-1 ring-white/20`
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-30 group-hover:opacity-50 transition-opacity`}
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{p.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      )}
                    </div>
                    <span className="relative z-10 text-[10px] text-zinc-400 mt-1 line-clamp-1">
                      {p.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Timeline Scrubber */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isPlaying
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  {isPlaying ? "⏸ Pause Timelapse" : "▶ Play Timelapse"}
                </button>

                <div className="flex items-center gap-1 bg-black/40 rounded-xl p-1 border border-white/5">
                  {speeds.map((s) => (
                    <button
                      key={s.val}
                      onClick={() => setPlaybackSpeed(s.val)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] transition-all ${
                        playbackSpeed === s.val
                          ? "bg-white/20 text-white font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* October Day Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-400">Date:</span>
                <select
                  value={dayOfMonth}
                  onChange={(e) => setDayOfMonth(parseInt(e.target.value))}
                  className="bg-black/60 text-white border border-white/10 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      October {d}, 2026
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Range Scrubber */}
            <div className="pt-2">
              <div className="relative">
                <input
                  type="range"
                  min="3.0"
                  max="7.5"
                  step="0.01"
                  value={timeDecimal}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setTimeDecimal(parseFloat(e.target.value));
                  }}
                  className="w-full h-2 bg-gradient-to-r from-blue-950 via-purple-950 via-rose-900 to-amber-400 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>03:00 AM (Deep Night)</span>
                <span>04:00 AM</span>
                <span>05:00 AM</span>
                <span>06:00 AM (Sunrise)</span>
                <span>07:30 AM (Full Dawn)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUD DEPTH HIERARCHY */}
      {activeTab === "layers" && (
        <div className="space-y-4">
          <div className="text-[10px] uppercase tracking-wider text-zinc-400">
            Atmospheric Cloud Depth Stack (No DOM Spans — High-Performance Canvas)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Far Clouds */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Far Cloud Layer</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px]">
                    0.003 Speed
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  High-altitude cirrostratus; catches alpenglow first.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.farClouds}
                onChange={(e) =>
                  setLayersVisible((v) => ({ ...v, farClouds: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Middle Clouds */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Middle Cloud Layer</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                    0.006 Speed
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Stratocumulus banks with volumetric depth shading.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.midClouds}
                onChange={(e) =>
                  setLayersVisible((v) => ({ ...v, midClouds: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Near Wispy */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Near Wispy Cloud</span>
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px]">
                    0.010 Speed
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Shredded fractus wisps drifting across ridge lines.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.nearClouds}
                onChange={(e) =>
                  setLayersVisible((v) => ({ ...v, nearClouds: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Atmospheric Mist */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Atmospheric Mist</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px]">
                    Laminar Valley Flow
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Ground-hugging lake fog with optical Mie backscatter.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.valleyMist}
                onChange={(e) =>
                  setLayersVisible((v) => ({ ...v, valleyMist: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* God Rays */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Crepuscular God Rays</span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Volumetric morning shafts breaking through mist.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.godRays}
                onChange={(e) =>
                  setLayersVisible((v) => ({ ...v, godRays: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Landscape & Lake Reflections */}
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Lake Reflections & Pines</span>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Mirror water ripples and silhouetted autumn pines.
                </p>
              </div>
              <input
                type="checkbox"
                checked={layersVisible.landscape}
                onChange={(e) =>
                  setLayersVisible((v) => ({
                    ...v,
                    landscape: e.target.checked,
                    reflections: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENVIRONMENTAL OVERRIDES */}
      {activeTab === "environment" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-zinc-400 text-[10px]">
              <span>Fog & Mist Density</span>
              <span className="text-white">{(fogDensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.05"
              value={fogDensity}
              onChange={(e) => setFogDensity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-white/20 rounded cursor-pointer"
            />
            <p className="text-[9px] text-zinc-500">
              Modulates cold ground inversion layer and lake steam.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-zinc-400 text-[10px]">
              <span>Cloud Cover & Opacity</span>
              <span className="text-white">{(cloudDensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.8"
              step="0.05"
              value={cloudDensity}
              onChange={(e) => setCloudDensity(parseFloat(e.target.value))}
              className="w-full accent-purple-400 h-1 bg-white/20 rounded cursor-pointer"
            />
            <p className="text-[9px] text-zinc-500">
              Alters optical depth across far, mid, and near layers.
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-zinc-400 text-[10px]">
              <span>Drift Wind Velocity</span>
              <span className="text-white">{windSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-white/20 rounded cursor-pointer"
            />
            <p className="text-[9px] text-zinc-500">
              Scales the 0.003, 0.006, and 0.010 natural velocity ratios.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
