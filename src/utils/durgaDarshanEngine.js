"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PRAHAR_SLOTS,
  FESTIVAL_DAY_DARSHAN_MATRIX,
  getFestivalDayKey,
  getActivePraharSlot,
  getDarshanForDayAndSlot,
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
 * Preload all core images for the current active day
 */
export function preloadAllDarshanImages() {
  if (typeof window === "undefined") return;
  const dayKey = getFestivalDayKey(new Date());
  PRAHAR_SLOTS.forEach((slot) => {
    const data = getDarshanForDayAndSlot(dayKey, slot.id);
    if (data?.image) preloadDarshanImage(data.image);
  });
}

/**
 * Custom React Hook for Living Darshan Synchronization
 * Continuously computes the active day, active slot, countdown, and timeline.
 */
export function useLivingDarshan() {
  const [nowDate, setNowDate] = useState(() => new Date());

  // High precision timer (updates every second for live countdowns)
  useEffect(() => {
    preloadAllDarshanImages();

    const timer = setInterval(() => {
      setNowDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 1. Current Festival Day Key (e.g. devipaksha, shashthi, saptami, ashtami, navami, dashami)
  const currentDayKey = useMemo(() => {
    return getFestivalDayKey(nowDate);
  }, [nowDate]);

  // 2. Current Active Prahar Slot Definition
  const currentSlot = useMemo(() => {
    return getActivePraharSlot(nowDate);
  }, [nowDate]);

  // 3. Current Live Darshan details (includes the day's specific image, title, pandal, and ritual)
  const currentDarshan = useMemo(() => {
    return getDarshanForDayAndSlot(currentDayKey, currentSlot.id);
  }, [currentDayKey, currentSlot.id]);

  // 4. Countdown to next Prahar transformation
  const countdown = useMemo(() => {
    const data = getNextPraharCountdown(nowDate);
    // Preload next image if within 20 minutes
    if (data.shouldPreloadNext && data.nextSlot) {
      const nextDarshan = getDarshanForDayAndSlot(currentDayKey, data.nextSlot.id);
      if (nextDarshan?.image) preloadDarshanImage(nextDarshan.image);
    }
    return data;
  }, [nowDate, currentDayKey]);

  // 5. Today's 4-Prahar Timeline Array with live status (past / active / upcoming)
  const todayTimeline = useMemo(() => {
    const currentHour = nowDate.getHours();

    return PRAHAR_SLOTS.map((slot) => {
      let status = "upcoming";

      if (slot.id === currentSlot.id) {
        status = "active";
      } else {
        if (slot.id === "nishitha") {
          status = currentHour >= 22 || currentHour < 4 ? "active" : currentHour >= 4 ? "past" : "upcoming";
        } else if (currentHour >= slot.endHour) {
          status = "past";
        } else if (currentHour < slot.startHour) {
          status = "upcoming";
        }
      }

      const darshanData = getDarshanForDayAndSlot(currentDayKey, slot.id);

      return {
        ...slot,
        ...darshanData,
        status,
        isActive: slot.id === currentSlot.id,
      };
    });
  }, [nowDate, currentDayKey, currentSlot]);

  return {
    nowDate,
    currentDayKey,
    currentSlot,
    currentDarshan,
    countdown,
    todayTimeline,
    allSlots: PRAHAR_SLOTS,
    allDays: Object.keys(FESTIVAL_DAY_DARSHAN_MATRIX).map((key) => ({
      key,
      ...FESTIVAL_DAY_DARSHAN_MATRIX[key],
    })),
  };
}

/**
 * Global modal triggers
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
