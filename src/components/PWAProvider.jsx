"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useWakeLock } from "../utils/useWakeLock";
import SacredContributionModal from "./SacredContributionModal";

const PWAContext = createContext({
  isInstallable: false,
  isInstalled: false,
  installApp: async () => {},
  isWakeLockActive: false,
  isWakeLockSupported: false,
  toggleWakeLock: () => {},
  isOnline: true,
  isSecureContext: true,
  openDiyaModal: () => {},
});

export const usePWA = () => useContext(PWAContext);

export default function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSecure, setIsSecure] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isDiyaModalOpen, setIsDiyaModalOpen] = useState(false);

  // Global listener for opening Diya modal from anywhere
  useEffect(() => {
    const handleOpen = () => setIsDiyaModalOpen(true);
    window.addEventListener("open_diya_modal", handleOpen);
    return () => window.removeEventListener("open_diya_modal", handleOpen);
  }, []);

  // Screen Wake Lock hook
  const {
    isSupported: isWakeLockSupported,
    isActive: isWakeLockActive,
    toggle: toggleWakeLock,
    request: requestWakeLock,
  } = useWakeLock(false);

  // 1. Service Worker Registration & Secure Context Check
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check secure context
    setIsSecure(window.isSecureContext ?? (location.protocol === "https:" || location.hostname === "localhost"));

    // Online / Offline tracking
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered with scope:", registration.scope);

            // Check for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === "installed") {
                    if (navigator.serviceWorker.controller) {
                      console.log("[PWA] New content available; please refresh.");
                    } else {
                      console.log("[PWA] Content cached for offline use.");
                    }
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn("[PWA] Service Worker registration failed:", err);
          });
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 2. Catch Install Prompt (beforeinstallprompt)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("[PWA] App successfully installed!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // 3. User Triggered Install Action
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] User response to install prompt: ${outcome}`);
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        installApp,
        isWakeLockActive,
        isWakeLockSupported,
        toggleWakeLock,
        requestWakeLock,
        isOnline,
        isSecureContext: isSecure,
        openDiyaModal: () => setIsDiyaModalOpen(true),
      }}
    >
      {children}

      {/* Floating System Utilities (Light a Diya + Wake Lock + Install PWA badge with Mobile Safe-Area Support) */}
      <div className="fixed top-[max(0.875rem,env(safe-area-inset-top))] right-3 sm:right-5 z-40 flex items-center gap-1.5 sm:gap-2 select-none pointer-events-auto">
        {/* Sacred Patronage / Light a Diya Button */}
        <button
          onClick={() => setIsDiyaModalOpen(true)}
          title="Light a Sacred Diya & Support the Soundscape (প্রদীপ জ্বালান)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#2a1306]/90 to-[#451e08]/90 hover:from-[#3d1a08] hover:to-[#5c280b] border border-[#ff7b1a]/60 hover:border-[#ff7b1a] text-[#ffbe76] hover:text-white text-xs font-medium backdrop-blur-xl shadow-[0_0_16px_rgba(255,123,26,0.3)] transition-all duration-300 active:scale-95 cursor-pointer group flex-shrink-0"
        >
          <span className="text-xs group-hover:scale-110 transition-transform animate-pulse">🪔</span>
          <span className="hidden sm:inline">Light a Diya</span>
          <span className="sm:hidden">Diya</span>
        </button>

        {/* Offline indicator */}
        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-red-950/80 border border-red-700/60 backdrop-blur-md text-red-200 text-xs shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="hidden sm:inline">Offline Mode</span>
            <span className="sm:hidden">Offline</span>
          </div>
        )}

        {/* Screen Wake Lock Quick Toggle */}
        {isWakeLockSupported && (
          <button
            onClick={toggleWakeLock}
            title={
              isWakeLockActive
                ? "Screen Wake Lock active: screen will remain on during dawn viewing"
                : "Enable Screen Wake Lock to prevent display from sleeping"
            }
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-xl border transition-all duration-300 shadow-lg cursor-pointer active:scale-95 ${
              isWakeLockActive
                ? "bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-amber-950/40"
                : "bg-black/40 border-white/10 text-white/60 hover:text-white/90 hover:bg-black/60"
            }`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                isWakeLockActive ? "scale-110 text-amber-400" : "text-white/40"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="hidden sm:inline">{isWakeLockActive ? "Screen Awake" : "Keep Awake"}</span>
            <span className="sm:hidden">{isWakeLockActive ? "Awake" : "Awake"}</span>
          </button>
        )}

        {/* Install PWA Button (appears when browser triggers beforeinstallprompt) */}
        {isInstallable && !bannerDismissed && (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-700/30 border border-amber-500/40 backdrop-blur-md rounded-full px-3 py-1 shadow-xl animate-fade-in">
            <button
              onClick={installApp}
              className="flex items-center gap-2 text-xs font-semibold text-amber-200 hover:text-amber-100 transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 text-amber-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Install PWA</span>
            </button>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-white/40 hover:text-white/80 p-0.5 ml-1 transition-colors"
              aria-label="Dismiss install prompt"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Sacred Patronage / Contribution Modal */}
      <SacredContributionModal
        isOpen={isDiyaModalOpen}
        onClose={() => setIsDiyaModalOpen(false)}
      />
    </PWAContext.Provider>
  );
}
