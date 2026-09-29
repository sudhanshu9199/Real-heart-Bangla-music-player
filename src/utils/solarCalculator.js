/**
 * Astronomical Solar Calculation & 24-Hour Continuous Atmospheric Physics Model
 * Full Real-Time Engine & Celestial Arc:
 * - Sunrise in the East (Left side of the screen at X ~ 0.18)
 * - Midday Zenith in the South (Center of the sky at X ~ 0.50, high Y)
 * - Sunset in the West (Right side of the screen at X ~ 0.82)
 * - Subterranean night transit (sweeping beneath the earth from Right back to Left)
 * - 04:00 AM October Feeling: Deep Prussian Blue, Cool Mist, Dark Silhouettes
 * - 05:00 AM: Violet-Orange / Belt of Venus
 * - 05:30 AM: Soft Gold Horizon on the East/Left
 * - 06:00 AM: Radiant Sunrise crowning the left hills
 * - Daytime: Crisp 4K Autumn Azure, Sunlit Clouds, Golden Daylight
 * - Sunset & Twilight: Brilliant Amber-Vermilion, Rose-Crimson dusk on the Right
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function calculateSolarState(
  dayOfMonth = null,
  decimalHour = null,
  latitude = 22.57, // Kolkata / Bengal latitude (Durga Puja & Mahalaya sanctuary)
  longitude = 88.36 // 88.36° E
) {
  // If not provided, dynamically read real-time clock
  const now = new Date();
  const actualHour =
    decimalHour !== null
      ? decimalHour
      : now.getHours() +
        now.getMinutes() / 60 +
        now.getSeconds() / 3600 +
        now.getMilliseconds() / 3600000;

  const actualDay = dayOfMonth !== null ? dayOfMonth : now.getDate();
  const actualMonth = now.getMonth(); // 0-indexed (9 = October)

  // Day of year calculation
  const isOctober = actualMonth === 9;
  const dayOfYear = isOctober ? 273 + actualDay : now.getMonth() * 30 + actualDay;

  // Solar declination approximation (Cooper's equation)
  const declination = 23.45 * Math.sin(DEG2RAD * ((360 / 365) * (dayOfYear - 81)));

  // Equation of time (minutes)
  const b = (360 / 365) * (dayOfYear - 81) * DEG2RAD;
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);

  const standardMeridian = Math.round(longitude / 15) * 15;
  const timeOffset = (longitude - standardMeridian) * 4 + eot;
  const solarTime = (actualHour + timeOffset / 60 + 24) % 24;

  const hourAngle = (solarTime - 12) * 15;

  // Exact solar altitude
  const sinAltitude =
    Math.sin(latitude * DEG2RAD) * Math.sin(declination * DEG2RAD) +
    Math.cos(latitude * DEG2RAD) * Math.cos(declination * DEG2RAD) * Math.cos(hourAngle * DEG2RAD);
  const altitude = Math.asin(Math.max(-1, Math.min(1, sinAltitude))) * RAD2DEG;

  // Peak solar altitude on this day (solar noon)
  const sinMaxAltitude =
    Math.sin(latitude * DEG2RAD) * Math.sin(declination * DEG2RAD) +
    Math.cos(latitude * DEG2RAD) * Math.cos(declination * DEG2RAD);
  const maxAltitude = Math.asin(Math.max(-1, Math.min(1, sinMaxAltitude))) * RAD2DEG;

  // Exact solar azimuth
  const cosAzimuth =
    (Math.sin(declination * DEG2RAD) - Math.sin(latitude * DEG2RAD) * sinAltitude) /
    (Math.cos(latitude * DEG2RAD) * Math.cos(Math.asin(sinAltitude)));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAzimuth))) * RAD2DEG;
  if (hourAngle > 0) azimuth = 360 - azimuth;

  // Exact Astronomical Sunrise & Sunset Times
  const cosSunriseH0 =
    (Math.sin(-0.833 * DEG2RAD) - Math.sin(latitude * DEG2RAD) * Math.sin(declination * DEG2RAD)) /
    (Math.cos(latitude * DEG2RAD) * Math.cos(declination * DEG2RAD));
  const sunriseHalfDayDeg = Math.acos(Math.max(-1, Math.min(1, cosSunriseH0))) * RAD2DEG;
  const halfDayHours = sunriseHalfDayDeg / 15;
  const solarNoonHour = (12 - timeOffset / 60 + 24) % 24;
  const sunriseHour = (solarNoonHour - halfDayHours + 24) % 24;
  const sunsetHour = (solarNoonHour + halfDayHours + 24) % 24;

  const isAfternoon = actualHour >= solarNoonHour;
  const isRising = actualHour < solarNoonHour;

  // Continuous Realistic Solar Celestial Arc:
  // - Sunrise: East / Left side of the screen (X = 0.18)
  // - Midday Zenith: South / Center of the sky (X = 0.50)
  // - Sunset: West / Right side of the screen (X = 0.82)
  // - Night: Smooth continuous arc beneath the earth from Right back to Left
  let isDay = false;
  let dayProgress = 0;
  let sunNormalizedX = 0.5;
  let sunNormalizedY = 0; // 0 at horizon level, 1 at peak noon zenith, < 0 below horizon

  if (actualHour >= sunriseHour && actualHour <= sunsetHour) {
    isDay = true;
    dayProgress = (actualHour - sunriseHour) / (sunsetHour - sunriseHour);
    // Smooth harmonic celestial movement across the sky from Left to Right
    sunNormalizedX = 0.50 - 0.32 * Math.cos(Math.PI * dayProgress);
    sunNormalizedY = Math.sin(Math.PI * dayProgress);
  } else {
    isDay = false;
    let nightProgress;
    if (actualHour > sunsetHour) {
      nightProgress = (actualHour - sunsetHour) / (24 - sunsetHour + sunriseHour);
    } else {
      nightProgress = (actualHour + (24 - sunsetHour)) / (24 - sunsetHour + sunriseHour);
    }
    // Night transit smoothly loops beneath the earth from right (0.82) back to left (0.18)
    sunNormalizedX = 0.50 + 0.32 * Math.cos(Math.PI * nightProgress);
    sunNormalizedY = -Math.sin(Math.PI * nightProgress) * 0.35;
  }

  // Classify Dawn / Day / Dusk Phase
  let phaseName = "Night";
  let phaseDescription = "Deep midnight stillness";
  let phaseProgress = 0;

  if (altitude < -18) {
    phaseName = "Astronomical Night";
    phaseDescription = "Obsidian twilight with starlight clarity";
    phaseProgress = Math.max(0, (altitude + 24) / 6);
  } else if (altitude < -12) {
    phaseName = isAfternoon ? "Astronomical Dusk" : "Astronomical Dawn";
    phaseDescription = isAfternoon
      ? "Fading evening twilight into night"
      : "4:00 AM: Deep Prussian blue, cool mist, dark silhouettes";
    phaseProgress = (altitude - -18) / 6;
  } else if (altitude < -6) {
    phaseName = isAfternoon ? "Nautical Dusk" : "Nautical Dawn";
    phaseDescription = isAfternoon
      ? "Deep indigo-violet evening horizon on the west"
      : "4:30 AM: Blue-violet sky with quiet starlight on the east";
    phaseProgress = (altitude - -12) / 6;
  } else if (altitude < 0) {
    phaseName = isAfternoon ? "Civil Dusk" : "Civil Dawn";
    phaseDescription = isAfternoon
      ? "Violet-amber sunset afterglow lingering on the western right horizon"
      : "5:00 - 5:30 AM: Violet-orange to soft gold, Belt of Venus on the left";
    phaseProgress = (altitude - -6) / 6;
  } else if (altitude < 8) {
    phaseName = isAfternoon ? "Golden Hour Sunset" : "Sunrise & Golden Hour";
    phaseDescription = isAfternoon
      ? "Radiant evening sun descending behind the right hills"
      : "Radiant golden sun crowning the left hill horizon";
    phaseProgress = altitude / 8;
  } else {
    phaseName = isAfternoon ? "Afternoon Daylight" : "Morning Daylight";
    phaseDescription = "Luminous crisp autumn daylight with soft drifting clouds";
    phaseProgress = Math.min(1, (altitude - 8) / 35);
  }

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const tDawn = clamp((altitude - -18) / 26);

  // Compute 24-hour color palette with explicit morning dawn vs evening sunset dynamics
  const skyZenith = getSkyZenithColor(altitude, isAfternoon);
  const skyMid = getSkyMidColor(altitude, isAfternoon);
  const skyHorizon = getSkyHorizonColor(altitude, isAfternoon);
  const cloudFarColor = getCloudIllumination(altitude, "far", isAfternoon);
  const cloudMidColor = getCloudIllumination(altitude, "mid", isAfternoon);
  const cloudNearColor = getCloudIllumination(altitude, "near", isAfternoon);
  const fogColor = getFogColor(altitude, isAfternoon);
  const silhouetteColor = getSilhouetteColor(altitude, isAfternoon);
  const roadColor = getRoadColor(altitude, isAfternoon);
  const grassColor = getGrassColor(altitude, isAfternoon);

  const sunIntensity = clamp((altitude - -3) / 8);
  const ambientLightLux = getAmbientLux(altitude);
  const colorTempK = getColorTemperature(altitude, isAfternoon);
  const shadowSoftness = clamp(1 - (altitude - -2) / 14);
  const hazeDensity = clamp(0.72 - altitude * 0.015, 0.15, 0.88);
  const treeRimLight = clamp((altitude - -2.5) / 8);

  return {
    altitude,
    azimuth,
    maxAltitude,
    solarTime,
    actualHour,
    isAfternoon,
    isRising,
    isDay,
    sunriseHour,
    sunsetHour,
    solarNoonHour,
    phaseName,
    phaseDescription,
    phaseProgress: clamp(phaseProgress),
    sunPosition: {
      x: sunNormalizedX,
      y: sunNormalizedY,
    },
    tDawn,
    sunIntensity,
    ambientLightLux,
    colorTempK,
    shadowSoftness,
    hazeDensity,
    treeRimLight,
    colors: {
      skyZenith,
      skyMid,
      skyHorizon,
      cloudFarColor,
      cloudMidColor,
      cloudNearColor,
      fogColor,
      silhouetteColor,
      roadColor,
      grassColor,
    },
  };
}

function interpolateRgb(c1, c2, factor) {
  const f = Math.max(0, Math.min(1, factor));
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f),
  ];
}

// 24-Hour Zenith Color
function getSkyZenithColor(alt, isAfternoon) {
  if (alt <= -16) return [3, 7, 24]; // Midnight Prussian blue
  if (alt <= -10) return interpolateRgb([3, 7, 24], [16, 12, 38], (alt + 16) / 6); // 4:30 AM blue-violet
  if (alt <= -4) {
    // Evening dusk has deeper plum-purple than morning
    const target = isAfternoon ? [36, 18, 52] : [42, 26, 68];
    return interpolateRgb([16, 12, 38], target, (alt + 10) / 6);
  }
  if (alt <= 1) {
    const target = isAfternoon ? [52, 28, 76] : [62, 42, 92];
    return interpolateRgb([42, 26, 68], target, (alt + 4) / 5);
  }
  if (alt <= 12) return interpolateRgb([62, 42, 92], [48, 105, 178], (alt - 1) / 11);
  // Full Daylight Zenith
  return interpolateRgb([48, 105, 178], [64, 138, 218], Math.min(1, (alt - 12) / 30));
}

// 24-Hour Mid-Sky Color
function getSkyMidColor(alt, isAfternoon) {
  if (alt <= -16) return [6, 12, 32];
  if (alt <= -10) return interpolateRgb([6, 12, 32], [28, 18, 48], (alt + 16) / 6);
  if (alt <= -4) {
    // Sunset mid-sky: rich magenta-crimson Belt of Venus
    const target = isAfternoon ? [142, 42, 82] : [118, 52, 92];
    return interpolateRgb([28, 18, 48], target, (alt + 10) / 6);
  }
  if (alt <= 1) {
    const target = isAfternoon ? [215, 78, 92] : [182, 88, 105];
    return interpolateRgb([118, 52, 92], target, (alt + 4) / 5);
  }
  if (alt <= 12) {
    const morningMid = [132, 175, 218];
    const eveningMid = [165, 145, 195];
    const target = isAfternoon ? eveningMid : morningMid;
    return interpolateRgb([182, 88, 105], target, (alt - 1) / 11);
  }
  // Full Daylight Mid-Sky
  return interpolateRgb([132, 175, 218], [165, 205, 240], Math.min(1, (alt - 12) / 30));
}

// 24-Hour Horizon Color (Differentiates morning soft gold from evening vermilion-red)
function getSkyHorizonColor(alt, isAfternoon) {
  if (alt <= -16) return [8, 16, 36];
  if (alt <= -10) return interpolateRgb([8, 16, 36], [36, 22, 56], (alt + 16) / 6);
  if (alt <= -4) {
    // Sunset horizon: deep vermilion glow; Dawn horizon: violet-amber
    const target = isAfternoon ? [195, 52, 45] : [162, 68, 62];
    return interpolateRgb([36, 22, 56], target, (alt + 10) / 6);
  }
  if (alt <= 1) {
    // Sunset: flaming crimson-amber [255, 115, 52]; Dawn: radiant amber-gold [252, 178, 68]
    const target = isAfternoon ? [255, 115, 52] : [252, 178, 68];
    return interpolateRgb([162, 68, 62], target, (alt + 4) / 5);
  }
  if (alt <= 12) {
    const start = isAfternoon ? [255, 142, 68] : [252, 178, 68];
    return interpolateRgb(start, [245, 235, 210], (alt - 1) / 11);
  }
  // Full Daylight Horizon
  return interpolateRgb([245, 235, 210], [225, 240, 252], Math.min(1, (alt - 12) / 30));
}

// 24-Hour Cloud Illumination
function getCloudIllumination(alt, layer, isAfternoon) {
  const layerAltitudeOffset = layer === "far" ? 4.5 : layer === "mid" ? 2.0 : 0.0;
  const effectiveAlt = alt + layerAltitudeOffset;

  if (effectiveAlt <= -14) {
    return {
      base: [10, 16, 32],
      highlight: [18, 26, 48],
      opacity: layer === "far" ? 0.35 : layer === "mid" ? 0.45 : 0.28,
    };
  }
  if (effectiveAlt <= -8) {
    return {
      base: [22, 18, 44],
      highlight: [46, 34, 68],
      opacity: layer === "far" ? 0.45 : layer === "mid" ? 0.55 : 0.35,
    };
  }
  if (effectiveAlt <= -2) {
    // Sunset clouds catch intense deep crimson underbelly
    const highlight = isAfternoon ? [215, 72, 88] : [182, 84, 122];
    return {
      base: [68, 38, 72],
      highlight,
      opacity: layer === "far" ? 0.65 : layer === "mid" ? 0.70 : 0.45,
    };
  }
  if (effectiveAlt <= 4) {
    // Alpenglow: Dawn soft gold / rose vs Sunset fiery vermilion
    const highlight = isAfternoon
      ? layer === "far"
        ? [245, 112, 128]
        : [255, 155, 68]
      : layer === "far"
      ? [215, 118, 165]
      : [255, 196, 92];
    return {
      base: layer === "far" ? [125, 62, 118] : [158, 82, 64],
      highlight,
      opacity: layer === "far" ? 0.75 : layer === "mid" ? 0.82 : 0.55,
    };
  }
  if (effectiveAlt <= 14) {
    // Transition to daytime cumulus/cirrus
    const f = (effectiveAlt - 4) / 10;
    return {
      base: interpolateRgb([125, 62, 118], [185, 195, 215], f),
      highlight: interpolateRgb([255, 196, 92], [255, 255, 255], f),
      opacity: 0.78,
    };
  }
  // Full Daylight Cloud Luminance
  return {
    base: [195, 205, 222],
    highlight: [255, 255, 255],
    opacity: 0.8,
  };
}

// 24-Hour Fog & Mist
function getFogColor(alt, isAfternoon) {
  if (alt <= -14) return [14, 22, 42]; // Cool 4 AM mist
  if (alt <= -8) return interpolateRgb([14, 22, 42], [32, 26, 54], (alt + 14) / 6);
  if (alt <= -2) return interpolateRgb([32, 26, 54], [105, 58, 82], (alt + 8) / 6);
  if (alt <= 3) {
    // Sunset mist captures warm peach-amber; Dawn mist is golden
    const target = isAfternoon ? [245, 145, 95] : [235, 170, 105];
    return interpolateRgb([105, 58, 82], target, (alt + 2) / 5);
  }
  if (alt <= 12) return interpolateRgb([235, 170, 105], [235, 240, 245], (alt - 3) / 9);
  return [235, 242, 248]; // Daylight haze
}

// 24-Hour Tree Silhouettes & Ambient Lighting
function getSilhouetteColor(alt, isAfternoon) {
  if (alt <= -14) return [4, 6, 12];
  if (alt <= -8) return interpolateRgb([4, 6, 12], [10, 14, 22], (alt + 14) / 6);
  if (alt <= -2) return interpolateRgb([10, 14, 22], [22, 28, 24], (alt + 8) / 6);
  if (alt <= 3) return interpolateRgb([22, 28, 24], [42, 54, 38], (alt + 2) / 5);
  if (alt <= 14) return interpolateRgb([42, 54, 38], [55, 75, 46], (alt - 3) / 11);
  return [62, 85, 52]; // Sunlit forest green
}

// 24-Hour Dirt Road Color
function getRoadColor(alt, isAfternoon) {
  if (alt <= -14) return [10, 12, 18];
  if (alt <= -8) return interpolateRgb([10, 12, 18], [18, 18, 26], (alt + 14) / 6);
  if (alt <= -2) return interpolateRgb([18, 18, 26], [45, 38, 42], (alt + 8) / 6);
  if (alt <= 3) return interpolateRgb([45, 38, 42], [135, 108, 82], (alt + 2) / 5);
  if (alt <= 14) return interpolateRgb([135, 108, 82], [165, 138, 108], (alt - 3) / 11);
  return [175, 148, 118]; // Warm sunlit dirt road
}

// 24-Hour Grass Verge Color
function getGrassColor(alt, isAfternoon) {
  if (alt <= -14) return [6, 10, 14];
  if (alt <= -8) return interpolateRgb([6, 10, 14], [14, 18, 20], (alt + 14) / 6);
  if (alt <= -2) return interpolateRgb([14, 18, 20], [28, 36, 26], (alt + 8) / 6);
  if (alt <= 3) return interpolateRgb([28, 36, 26], [68, 86, 52], (alt + 2) / 5);
  if (alt <= 14) return interpolateRgb([68, 86, 52], [92, 118, 65], (alt - 3) / 11);
  return [105, 134, 74]; // Sunlit meadow grass
}

function getAmbientLux(alt) {
  if (alt <= -18) return 0.001;
  if (alt <= -12) return 0.01 + (alt + 18) * 0.015;
  if (alt <= -6) return 0.1 + (alt + 12) * 0.5;
  if (alt <= 0) return 3.0 + (alt + 6) * 45;
  if (alt <= 6) return 300 + alt * 800;
  if (alt <= 20) return 5000 + (alt - 6) * 3500;
  return 55000 + (alt - 20) * 1200; // Full noon sunlight
}

function getColorTemperature(alt, isAfternoon) {
  if (alt <= -12) return 12000;
  if (alt <= -6) return 9500 - (alt + 12) * 400;
  if (alt <= 0) return 7000 - (alt + 6) * 750;
  if (alt <= 4) {
    // Sunset is warmer (lower kelvin) due to accumulated aerosols
    return isAfternoon ? 2200 + alt * 300 : 2500 + alt * 350;
  }
  if (alt <= 15) return 3900 + (alt - 4) * 120;
  return 5400 + Math.min(800, (alt - 15) * 40); // Daylight 5500K-6200K
}
