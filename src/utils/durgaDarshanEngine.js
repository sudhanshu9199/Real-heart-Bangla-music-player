"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PRAHAR_SLOTS,
  SPECIAL_DARSHAN_EVENTS,
  getActivePraharSlot,
  getNextPraharCountdown,
} from "@/data/durgaDarshanCatalog";

/**
 * Preloads an image into browser memory to eliminate visual delay on phase transition
 */
const preloadedImages = new Set();
export function preloadDarshanImage(url) {
  if (typeof window === "undefined" || !url || preloadedImages.has(url)) return;
  const img = new Image();
  img.src = url;
  preloadedImages.add(url);
}

/**
 * Preload all core 4 Prahar images once on initial mount
 */
export function preloadAllDarshanImages() {
  if (typeof window === "undefined") return;
  PRAHAR_SLOTS.forEach((slot) => {
    preloadDarshanImage(slot.image);
  });
  preloadDarshanImage(SPECIAL_DARSHAN_EVENTS.dashami.image);
}

/**
 * Custom React Hook for Living Darshan Synchronization
 * Continuously computes the active slot, countdown, and timeline.
 */
export function useLivingDarshan() {
  const [nowDate, setNowDate] = useState(() => new Date());

  // High precision timer (updates every second for live countdowns)
  useEffect(() => {
    // Initial preload of all assets
    preloadAllDarshanImages();

    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 1. Current Active Prahar Slot
  const currentSlot = useMemo(() => {
    return getActivePraharSlot(nowDate);
  }, [nowDate]);

  // 2. Countdown to next Prahar transformation
  const countdown = useMemo(() => {
    const data = getNextPraharCountdown(nowDate);
    // Preload next image if within 20 minutes
    if (data.shouldPreloadNext && data.nextSlot) {
      preloadDarshanImage(data.nextSlot.image);
    }
    return data;
  }, [nowDate]);

  // 3. Today's 4-Prahar Timeline Array with live status (past / active / upcoming)
  const todayTimeline = useMemo(() => {
    const currentHour = nowDate.getHours();

    return PRAHAR_SLOTS.map((slot) => {
      let status = "upcoming";

      if (slot.id === currentSlot.id) {
        status = "active";
      } else {
        // Special handle for nishitha (wraps around midnight)
        if (slot.id === "nishitha") {
          status = currentHour >= 22 || currentHour < 4 ? "active" : currentHour >= 4 ? "past" : "upcoming";
        } else if (currentHour >= slot.endHour) {
          status = "past";
        } else if (currentHour < slot.startHour) {
          status = "upcoming";
        }
      }

      return {
        ...slot,
        status,
        isActive: slot.id === currentSlot.id,
      };
    });
  }, [nowDate, currentSlot]);

  return {
    nowDate,
    currentSlot,
    countdown,
    todayTimeline,
    allSlots: PRAHAR_SLOTS,
  };
}

/**
 * Helper to dispatch open/close modal events globally
 */
export function openDarshanModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("open_darshan_modal"));
  }
}

export function closeDarshanModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("close_darshan_modal"));
  }
}
