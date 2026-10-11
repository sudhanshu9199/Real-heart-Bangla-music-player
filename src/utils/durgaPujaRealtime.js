/**
 * Real-Time Durga Puja Festival Calculator & Astronomical Countdown Engine
 * Accurately tracks 2026 Sharodiya Durga Puja Panjika dates and live time deltas.
 */

// Canonical 2026 Durga Puja Panjika Dates (IST +05:30)
export const FESTIVAL_DATES_2026 = {
  mahalaya: {
    start: "2026-10-10T04:00:00+05:30",
    end: "2026-10-10T23:59:59+05:30",
  },
  shashthi: {
    start: "2026-10-16T06:00:00+05:30",
    end: "2026-10-16T23:59:59+05:30",
  },
  saptami: {
    start: "2026-10-18T06:00:00+05:30",
    end: "2026-10-18T23:59:59+05:30",
  },
  ashtami: {
    start: "2026-10-19T06:00:00+05:30",
    end: "2026-10-19T17:44:59+05:30",
  },
  sandhi_puja: {
    start: "2026-10-19T17:45:00+05:30",
    end: "2026-10-19T18:33:00+05:30", // Sacred 48 minutes
  },
  navami: {
    start: "2026-10-20T06:00:00+05:30",
    end: "2026-10-20T23:59:59+05:30",
  },
  dashami: {
    start: "2026-10-21T06:00:00+05:30",
    end: "2026-10-21T23:59:59+05:30",
  },
  lakshmi_puja: {
    start: "2026-10-25T18:00:00+05:30",
    end: "2026-10-25T23:59:59+05:30",
  },
};

/**
 * Calculates countdown breakdown: days, hours, minutes, seconds between now and target.
 */
export function calculateTimeDelta(targetDateStr, referenceDate = new Date()) {
  const target = new Date(targetDateStr).getTime();
  const now = referenceDate.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return {
      isPast: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isPast: false,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
  };
}

/**
 * Determines current festival status:
 * - Which event is live right now
 * - Which is the next grand event
 * - Day by day status: "past" | "live" | "next" | "upcoming"
 */
export function getFestivalRealtimeStatus(referenceDate = new Date()) {
  const now = referenceDate.getTime();

  let liveEventId = null;
  let nextEventId = null;
  const statuses = {};

  const order = [
    "mahalaya",
    "shashthi",
    "saptami",
    "ashtami",
    "sandhi_puja",
    "navami",
    "dashami",
    "lakshmi_puja",
  ];

  for (const id of order) {
    const dates = FESTIVAL_DATES_2026[id];
    if (!dates) continue;

    const start = new Date(dates.start).getTime();
    const end = new Date(dates.end).getTime();

    if (now >= start && now <= end) {
      statuses[id] = "live";
      if (!liveEventId) liveEventId = id;
    } else if (now > end) {
      statuses[id] = "past";
    } else {
      if (!nextEventId) {
        nextEventId = id;
        statuses[id] = "next";
      } else {
        statuses[id] = "upcoming";
      }
    }
  }

  // If before all events (e.g. before Mahalaya)
  if (!nextEventId && !liveEventId) {
    nextEventId = "shashthi";
  }

  // Default next grand event if between Mahalaya and Shashthi
  const mainEventTarget = liveEventId || nextEventId || "shashthi";
  const mainCountdown = calculateTimeDelta(
    FESTIVAL_DATES_2026[mainEventTarget]?.start || FESTIVAL_DATES_2026.shashthi.start,
    referenceDate
  );

  return {
    liveEventId,
    nextEventId,
    mainEventTarget,
    mainCountdown,
    statuses,
    isDevipaksha: now >= new Date(FESTIVAL_DATES_2026.mahalaya.start).getTime(),
  };
}
