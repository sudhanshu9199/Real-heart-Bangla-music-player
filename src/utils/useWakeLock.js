"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom React hook for the W3C Screen Wake Lock API.
 * Keeps the device screen awake during dawn ambient viewing or audio playback.
 * Automatically reacquires the lock when the tab regains visibility.
 */
export function useWakeLock(autoAcquire = false) {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const wakeLockRef = useRef(null);
  const shouldReacquireRef = useRef(autoAcquire);

  useEffect(() => {
    setIsSupported("wakeLock" in navigator);
  }, []);

  const request = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      setError("Screen Wake Lock API not supported in this browser.");
      return false;
    }

    try {
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        setIsActive(true);
        return true;
      }

      const lock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = lock;
      shouldReacquireRef.current = true;
      setIsActive(true);
      setError(null);

      lock.addEventListener("release", () => {
        setIsActive(false);
        wakeLockRef.current = null;
      });

      return true;
    } catch (err) {
      console.warn("Wake Lock request failed:", err);
      setError(err.message || "Failed to activate screen wake lock.");
      setIsActive(false);
      return false;
    }
  }, []);

  const release = useCallback(async () => {
    shouldReacquireRef.current = false;
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
      } catch (err) {
        console.warn("Wake Lock release error:", err);
      } finally {
        wakeLockRef.current = null;
        setIsActive(false);
      }
    }
  }, []);

  const toggle = useCallback(() => {
    if (isActive) {
      return release();
    } else {
      return request();
    }
  }, [isActive, request, release]);

  // Handle visibility change: Screen Wake Lock automatically releases when tab/window is hidden
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && shouldReacquireRef.current) {
        await request();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [request]);

  // Auto-acquire on mount if requested
  useEffect(() => {
    if (autoAcquire && isSupported) {
      request();
    }
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
      }
    };
  }, [autoAcquire, isSupported, request]);

  return {
    isSupported,
    isActive,
    error,
    request,
    release,
    toggle,
  };
}
