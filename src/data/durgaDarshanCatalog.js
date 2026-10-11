/**
 * 2026 Living Darshan Catalog (স্বর্গীয় চার প্রহর দর্শন নির্দেশিকা)
 * Maps the 4 Sacred Daily Prahars (ভোর, দুপুর, সন্ধ্যা, নিশীথ)
 * across the Bengali Durga Puja festive calendar with authentic rituals and 8K visual assets.
 */

// 1. Definition of the 4 Sacred Daily Prahars
export const PRAHAR_SLOTS = [
  {
    id: "prabhat",
    slotIndex: 1,
    startHour: 4,
    endHour: 10,
    timeRange: "04:00 AM – 10:00 AM",
    nameBn: "১. প্রভাত দর্শন (ভোর ও চক্ষুদান)",
    nameBonglish: "1. Prabhat Darshan (Dawn & Awakening)",
    nameEn: "1. Dawn Darshan (Sacred Awakening)",
    icon: "🌅",
    image: "/darshan/darshan_prabhat.jpg",
    accentColor: "#ffa502",
    auraGradient: "radial-gradient(circle, rgba(255,165,2,0.4) 0%, rgba(255,123,26,0.15) 50%, transparent 80%)",
    ritual: {
      bn: "চণ্ডীপাঠ, গঙ্গাস্নান, শিউলি ফুল নিবেদন ও মৃন্ময়ী প্রতিমার চক্ষুদান বিধি।",
      bonglish: "Chandipath, holy Ganga snan, Shiuli phul offering and divine Chokkhu Daan by Kumartuli artisans.",
      en: "Dawn Chandipath recitation, holy bath, Shiuli floral offerings, and artisan third-eye painting ceremony.",
    },
    significance: {
      bn: "শরতের কুয়াশাচ্ছন্ন ভোরে দেবী মহামায়ার মর্তে পদার্পণ ও চক্ষুদান।",
      bonglish: "The awakening of Devi Mahamaya at the misty autumn dawn as artisans breathe life into her divine eyes.",
      en: "The divine descent of Goddess Durga on a misty autumn dawn, as life is ritually awakened in the clay sculpture.",
    },
  },
  {
    id: "madhyahna",
    slotIndex: 2,
    startHour: 10,
    endHour: 16,
    timeRange: "10:00 AM – 04:00 PM",
    nameBn: "২. মধ্যাহ্ন দর্শন (পুষ্পাঞ্জলি ও ভোগ)",
    nameBonglish: "2. Madhyahna Darshan (Pushpanjali & Bhog)",
    nameEn: "2. Midday Darshan (Pushpanjali & Sacred Feast)",
    icon: "☀️",
    image: "/darshan/darshan_madhyahna.jpg",
    accentColor: "#ff7b1a",
    auraGradient: "radial-gradient(circle, rgba(255,123,26,0.45) 0%, rgba(255,190,118,0.2) 50%, transparent 80%)",
    ritual: {
      bn: "মহা পুষ্পাঞ্জলি, অষ্টমী কুমারী পূজা, খিচুড়ি ও লাবড়া অন্নভোগ নিবেদন।",
      bonglish: "Maha Pushpanjali, Ashtami Kumari Puja, sacred Khichuri, Labra & Payesh bhog arati.",
      en: "Grand Pushpanjali prayer offerings, sacred Kumari Puja, and traditional royal Bhog feast offerings.",
    },
    significance: {
      bn: "ঐতিহ্যবাহী সাবেক একচালা ও ডাকের সাজে মায়ের রাজকীয় মধ্যাহ্ন রূপ।",
      bonglish: "The majestic midday darshan of Maa Durga in heritage Sabeki Ekchala form adorned with shimmering Daker Saaj.",
      en: "The regal midday presence of Mother Durga in heritage Kolkata architecture, shimmering in silver and gold filigree.",
    },
  },
  {
    id: "sandhya",
    slotIndex: 3,
    startHour: 16,
    endHour: 22,
    timeRange: "04:00 PM – 10:00 PM",
    nameBn: "৩. সন্ধ্যা দর্শন (সন্ধ্যাপূজা ও ধুনুচি আরতি)",
    nameBonglish: "3. Sandhya Darshan (Aarti & Dhunuchi Naach)",
    nameEn: "3. Twilight Darshan (Grand Aarti & Dhunuchi)",
    icon: "🪔",
    image: "/darshan/darshan_sandhya.jpg",
    accentColor: "#ff4757",
    auraGradient: "radial-gradient(circle, rgba(255,71,87,0.45) 0%, rgba(255,123,26,0.2) 50%, transparent 80%)",
    ritual: {
      bn: "পঞ্চপ্রদীপ আরতি, সুগন্ধি ধুনুচি নাচ, কাঁসর-ঘণ্টা ও শঙ্খধ্বনি।",
      bonglish: "Pancha-pradip arati, fragrant Dhunuchi Naach incense dance, rhythmic temple bells and shankhadhwani.",
      en: "Multi-tiered Pancha Pradip fire offering, billowing aromatic frankincense Dhunuchi dance, and ecstatic temple gongs.",
    },
    significance: {
      bn: "মহিষাসুরমর্দিনী দশপ্রহরণধারিণী রণচণ্ডী মায়ের উজ্জ্বল জ্যোতির্ময় রূপ।",
      bonglish: "The radiant, fiery warrior form of Mahishasuramardini with trident raised amidst swirling frankincense.",
      en: "The blazing celestial warrior form of Mother Durga wielding sacred weapons, victorious over darkness.",
    },
  },
  {
    id: "nishitha",
    slotIndex: 4,
    startHour: 22,
    endHour: 4, // Wraps to next day 04:00 AM
    timeRange: "10:00 PM – 04:00 AM",
    nameBn: "৪. নিশীথ দর্শন (১০৮ প্রদীপ ও শান্তিময় রূপ)",
    nameBonglish: "4. Nishitha Darshan (Midnight Sandhi & Stillness)",
    nameEn: "4. Midnight Darshan (Mystic 108 Diya Stillness)",
    icon: "🌙",
    image: "/darshan/darshan_nishitha.jpg",
    accentColor: "#70a1ff",
    auraGradient: "radial-gradient(circle, rgba(112,161,255,0.35) 0%, rgba(255,123,26,0.15) 50%, transparent 80%)",
    ritual: {
      bn: "১০৮ মাটির প্রদীপ প্রজ্বলন, ১০৮ পদ্ম নিবেদন, সন্ধিপূজার নিস্তব্ধ ধ্যান।",
      bonglish: "Lighting 108 sacred clay oil lamps, offering 108 pink lotuses, and meditative midnight Sandhi Puja.",
      en: "Igniting 108 terracotta oil lamps, offering 108 lotuses, and silent transcendental midnight meditation.",
    },
    significance: {
      bn: "গভীর রাতের তারাময় আকাশে দেবীর অপার্থিব চামুণ্ডা রূপ ও আশীর্বাদ।",
      bonglish: "The mystical Chamunda grace of Maa Durga under the starry autumn constellations, radiating cosmic peace.",
      en: "The mystical nocturnal serenity of the Goddess under starry autumn skies, blessing devotees with cosmic peace.",
    },
  },
];

// Special Day Masterpieces (e.g. Bijoya Dashami Sindoor Khela)
export const SPECIAL_DARSHAN_EVENTS = {
  dashami: {
    id: "dashami",
    title: {
      bn: "বিজয়া দশমী — সিঁদুরখেলা ও বিষাদের বিদায়",
      bonglish: "Bijoya Dashami — Sindoor Khela & Tearful Farewell",
      en: "Bijoya Dashami — Vermilion Celebration & Sacred Immersion",
    },
    image: "/darshan/darshan_dashami.jpg",
    timingLabel: "বিজয়া দশমী শুভক্ষণ",
    ritual: {
      bn: "দেবী বরণ, পান-মিষ্টি মুখে দিয়ে মায়ের বিদায় সম্ভাষণ ও সিঁদুরখেলা।",
      bonglish: "Devi Baran, offering Paan & Sandesh sweets to Maa, tearful farewell and joyous Sindoor Khela.",
      en: "Bidding farewell to Mother Durga with sweet Sandesh and betel leaves, accompanied by the iconic Sindoor Khela.",
    },
    significance: {
      bn: "আসছে বছর আবার হবে — মা দুর্গার কৈলাসে প্রত্যাবর্তন ও শুভ বিজয়ার শুভেচ্ছা।",
      bonglish: "Asche bochhor abar hobe! Maa returns to Kailash, leaving us with love, resilience and Shubho Bijoya blessings.",
      en: "'Mother will return next year!' Maa returns to Mount Kailash, leaving peace, resilience, and Shubho Bijoya.",
    },
  },
};

// Sanskrit Mantras & Pronunciation for the Living Darshan
export const DARSHAN_MANTRAS = {
  pranam: {
    title: "প্রণাম মন্ত্র (Devotional Pranam Mantra)",
    sanskrit: "সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে।\nশরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোহস্তুতে॥",
    phonetic: "Sarva Mangala Mangalye Shive Sarvartha Sadhike,\nSharanye Tryambake Gauri Narayani Namostute.",
    meaning: {
      bn: "হে সর্বমঙ্গলদায়িনী, হে কল্যাণকারী শিবে, হে সকল মনোবাঞ্ছাপূর্ণকারিণী, শরণদাত্রী ত্রিনয়নী গৌরী নারায়ণী, তোমায় প্রণাম।",
      bonglish: "O Auspicious One, giver of all blessings, fulfiller of all desires, three-eyed Gauri Narayani, we bow to you.",
      en: "O auspicious Goddess who bestows all auspiciousness, fulfiller of every devotion, refuge of the worlds, we bow to you.",
    },
  },
  sandhi: {
    title: "সন্ধিপূজা চামুণ্ডা মন্ত্র (Sandhi Puja Mantra)",
    sanskrit: "ওঁ জয়ন্তী মঙ্গলা কালী ভদ্রকালী কপালিনী।\nদুর্গা শিবা ক্ষমা ধাত্রী স্বাহা স্বধা নমোহস্তুতে॥",
    phonetic: "Om Jayanti Mangala Kali Bhadrakali Kapalini,\nDurga Shiva Kshama Dhatri Svaha Svadha Namostute.",
    meaning: {
      bn: "হে জয়ন্তী, মঙ্গলা, কালী, ভদ্রকালী, কপালিনী, দুর্গা, ক্ষমা ও ধাত্রী রূপিণী দেবী—তোমায় কোটি কোটি প্রণাম।",
      bonglish: "O victorious, benevolent, supreme Kali, Bhadrakali, Kapalini, Durga, forgiving Mother—we bow before you.",
      en: "O victorious Mother who removes all fear and suffering, supreme protector of all living beings, we bow to you.",
    },
  },
};

/**
 * Returns the active Prahar slot based on the local decimal hour or Date object
 */
export function getActivePraharSlot(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 4 && hour < 10) {
    return PRAHAR_SLOTS[0]; // prabhat (04:00 - 10:00)
  } else if (hour >= 10 && hour < 16) {
    return PRAHAR_SLOTS[1]; // madhyahna (10:00 - 16:00)
  } else if (hour >= 16 && hour < 22) {
    return PRAHAR_SLOTS[2]; // sandhya (16:00 - 22:00)
  } else {
    return PRAHAR_SLOTS[3]; // nishitha (22:00 - 04:00)
  }
}

/**
 * Calculates countdown until the next Prahar image transformation
 */
export function getNextPraharCountdown(date = new Date()) {
  const currentHour = date.getHours();
  const currentMin = date.getMinutes();
  const currentSec = date.getSeconds();

  let targetHour;
  let targetDayOffset = 0;

  if (currentHour >= 4 && currentHour < 10) {
    targetHour = 10; // next is madhyahna at 10:00
  } else if (currentHour >= 10 && currentHour < 16) {
    targetHour = 16; // next is sandhya at 16:00
  } else if (currentHour >= 16 && currentHour < 22) {
    targetHour = 22; // next is nishitha at 22:00
  } else {
    targetHour = 4; // next is prabhat at 04:00 (next day if after 22)
    if (currentHour >= 22) {
      targetDayOffset = 1;
    }
  }

  const target = new Date(date);
  target.setDate(target.getDate() + targetDayOffset);
  target.setHours(targetHour, 0, 0, 0);

  const diffMs = Math.max(0, target.getTime() - date.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Next upcoming slot object
  const currentSlot = getActivePraharSlot(date);
  const currentIdx = PRAHAR_SLOTS.findIndex((s) => s.id === currentSlot.id);
  const nextSlot = PRAHAR_SLOTS[(currentIdx + 1) % PRAHAR_SLOTS.length];

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    formatted: `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    nextSlot,
    // Should we preload the next slot image? (Yes if <= 20 minutes remaining)
    shouldPreloadNext: totalSeconds <= 1200,
  };
}
