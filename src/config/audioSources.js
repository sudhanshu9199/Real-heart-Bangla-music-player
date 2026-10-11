/**
 * Centralized Audio Sources Configuration
 * Data-driven source registry for Mahalaya Chandipath and Kolkata (West Bengal, India) Live Radio.
 * Supports environment variable overrides for custom stream endpoints.
 */

export const MAHALAYA_CHAPTERS = [
  {
    id: 1,
    title: "Aswiner Sharada Prate",
    subtitle: "Birendra Krishna Bhadra • Intro",
    timeStart: 0,
    dawnTime: 4.0, // 4:00 AM (Stars & Night Mist)
    cover: "/covers/cover-1.jpg",
  },
  {
    id: 2,
    title: "Chandipath & Shankhadhwani",
    subtitle: "Conch Shell & Sacred Invocations",
    timeStart: 380, // ~6m 20s
    dawnTime: 4.6, // 4:36 AM (Blue-Violet Dawn)
    cover: "/covers/cover-2.jpg",
  },
  {
    id: 3,
    title: "Ya Devi Sarvabhuteshu",
    subtitle: "Mahishasuramardini Shlokas",
    timeStart: 1200, // ~20m
    dawnTime: 5.25, // 5:15 AM (Magenta Horizon)
    cover: "/covers/cover-3.jpg",
  },
  {
    id: 4,
    title: "Jaya Jaya Japyajaye",
    subtitle: "Divine Awakening Chants",
    timeStart: 2280, // ~38m
    dawnTime: 5.85, // 5:51 AM (Golden Crepuscular Glow)
    cover: "/covers/cover-4.jpg",
  },
  {
    id: 5,
    title: "Rupang Dehi Jayang Dehi",
    subtitle: "Radiant Sunrise & Benediction",
    timeStart: 3300, // ~55m
    dawnTime: 6.35, // 6:21 AM (Rising Sun Disc)
    cover: "/covers/cover-5.jpg",
  },
];

// Verified 100% authentic Kolkata (West Bengal, India) Radio Stations
export const KOLKATA_RADIO_STATIONS = [
  {
    id: "kolkata-geetanjali",
    title: "আকাশবাণী কলকাতা গীতাঞ্জলি",
    frequency: "1008 kHz AM • Kolkata, India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio055/hlspbaudio055_Auto.m3u8",
    description: "Heritage Akashvani Kolkata • Home of Mahalaya",
    city: "Kolkata, West Bengal (India)",
  },
  {
    id: "kolkata-rainbow",
    title: "এফএম রেইনবো কলকাতা",
    frequency: "107.0 FM • Kolkata, India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio058/hlspbaudio058_Auto.m3u8",
    description: "Kolkata Bengali Music, Hits & Live RJs",
    city: "Kolkata, West Bengal (India)",
  },
  {
    id: "kolkata-gold",
    title: "এফএম গোল্ড কলকাতা",
    frequency: "100.2 FM • Kolkata, India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio057/hlspbaudio057_Auto.m3u8",
    description: "Classic Bengali Melodies & Kolkata News",
    city: "Kolkata, West Bengal (India)",
  },
  {
    id: "kolkata-bangla",
    title: "আকাশবাণী বাংলা কলকাতা",
    frequency: "AIR Bangla • Kolkata, India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio137/hlspbaudio137_Auto.m3u8",
    description: "24x7 Bengali Cultural & Music Broadcast",
    city: "Kolkata, West Bengal (India)",
  },
  {
    id: "kolkata-sanchayita",
    title: "আকাশবাণী সঞ্চয়িতা কলকাতা",
    frequency: "AIR Kolkata (Ch B) • India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio056/hlspbaudio056_Auto.m3u8",
    description: "Bengali Literature, Arts & Drama",
    city: "Kolkata, West Bengal (India)",
  },
  {
    id: "kolkata-vbs",
    title: "বিবিধ ভারতী কলকাতা",
    frequency: "VBS Kolkata • West Bengal, India",
    streamUrl:
      "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio275/hlspbaudio275_Auto.m3u8",
    description: "Commercial Music Service Kolkata",
    city: "Kolkata, West Bengal (India)",
  },
];

export const AUDIO_SOURCES = {
  mahalaya: {
    id: "mahalaya",
    type: "recording",
    title: "মহিষাসুরমর্দ্দিনী",
    subtitle: "Birendra Krishna Bhadra • Mahalaya",
    streamUrl: "/mahalaya.mp3",
    fallbackUrl:
      "/Mahalaya%20Original%20Chandi%20Path%20Birendra%20Krishna%20Bhadra%20full%20Chandipath%20%23%E0%A6%AE%E0%A6%B9%E0%A6%BF%E0%A6%B7%E0%A6%BE%E0%A6%B8%E0%A7%81%E0%A6%B0%E0%A6%AE%E0%A6%B0%E0%A7%8D%E0%A6%A6%E0%A6%BF%E0%A6%A8%E0%A7%80.mp3",
    protocol: "file",
    artwork: "/covers/cover-1.jpg",
    chapters: MAHALAYA_CHAPTERS,
  },
  "bangla-radio": {
    id: "bangla-radio",
    type: "live-radio",
    title: "কলকাতা রেডিও (India)",
    subtitle: "All India Radio • Kolkata Stations",
    stations: KOLKATA_RADIO_STATIONS,
    streamUrl:
      process.env.NEXT_PUBLIC_BANGLA_RADIO_STREAM_URL ||
      KOLKATA_RADIO_STATIONS[0].streamUrl,
    fallbackUrl: KOLKATA_RADIO_STATIONS[1].streamUrl,
    tertiaryUrl: KOLKATA_RADIO_STATIONS[2].streamUrl,
    protocol: process.env.NEXT_PUBLIC_BANGLA_RADIO_STREAM_PROTOCOL || "hls",
    metadataUrl: process.env.NEXT_PUBLIC_BANGLA_RADIO_METADATA_URL || null,
    artwork: "/covers/radio-bangla.jpg",
  },
  dhak: {
    id: "dhak",
    type: "recording",
    title: "উৎসবের ঢাকের বোল",
    titleBonglish: "Sharodiya Dhak",
    subtitle: "Authentic Bengali Durga Puja Dhak Rhythm",
    streamUrl: "/Dhak-music.mp3",
    protocol: "file",
    artwork: "/covers/cover-2.jpg",
  },
};
