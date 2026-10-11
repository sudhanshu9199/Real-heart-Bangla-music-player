/**
 * 2026 Living Darshan Catalog (স্বর্গীয় চার প্রহর দুর্গা দর্শন নির্দেশিকা)
 * Full Calendar Matrix across Bengali Durga Puja:
 * - 4 Sacred Daily Prahars: প্রভাত (04-10), মধ্যাহ্ন (10-16), সন্ধ্যা (16-22), নিশীথ (22-04)
 * - Authentic Kolkata Heritage Pandals (College Square, Bagbazar, Belur Math Kumari Puja, Dhunuchi Naach)
 * - Non-repeating, calendar-aware image progression day by day.
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
    shortNameBn: "প্রভাত",
    shortNameBonglish: "Prabhat",
    icon: "🌅",
    accentColor: "#ffa502",
    auraGradient: "radial-gradient(circle, rgba(255,165,2,0.35) 0%, rgba(255,123,26,0.12) 50%, transparent 80%)",
  },
  {
    id: "madhyahna",
    slotIndex: 2,
    startHour: 10,
    endHour: 16,
    timeRange: "10:00 AM – 04:00 PM",
    nameBn: "২. মধ্যাহ্ন দর্শন (পুষ্পাঞ্জলি ও কুমারী পূজা)",
    nameBonglish: "2. Madhyahna Darshan (Pushpanjali & Bhog)",
    nameEn: "2. Midday Darshan (Pushpanjali & Kumari Puja)",
    shortNameBn: "মধ্যাহ্ন",
    shortNameBonglish: "Madhyahna",
    icon: "☀️",
    accentColor: "#ff7b1a",
    auraGradient: "radial-gradient(circle, rgba(255,123,26,0.38) 0%, rgba(255,190,118,0.15) 50%, transparent 80%)",
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
    shortNameBn: "সন্ধ্যা",
    shortNameBonglish: "Sandhya",
    icon: "🪔",
    accentColor: "#ff4757",
    auraGradient: "radial-gradient(circle, rgba(255,71,87,0.38) 0%, rgba(255,123,26,0.18) 50%, transparent 80%)",
  },
  {
    id: "nishitha",
    slotIndex: 4,
    startHour: 22,
    endHour: 4, // Wraps around to 04:00 AM
    timeRange: "10:00 PM – 04:00 AM",
    nameBn: "৪. নিশীথ দর্শন (১০৮ প্রদীপ ও নিস্তব্ধ ধ্যান)",
    nameBonglish: "4. Nishitha Darshan (Midnight Sandhi & Stillness)",
    nameEn: "4. Midnight Darshan (Mystic 108 Diya Stillness)",
    shortNameBn: "নিশীথ",
    shortNameBonglish: "Nishitha",
    icon: "🌙",
    accentColor: "#70a1ff",
    auraGradient: "radial-gradient(circle, rgba(112,161,255,0.3) 0%, rgba(255,123,26,0.12) 50%, transparent 80%)",
  },
];

// 2. DAY-BY-DAY CALENDAR MATRIX (Ensures fresh, non-repeating images every day and every prahar!)
export const FESTIVAL_DAY_DARSHAN_MATRIX = {
  // Pre-Puja / Devi Paksha (Oct 11 - 15, 2026)
  devipaksha: {
    dayId: "devipaksha",
    dayTitleBn: "দেবীপক্ষ প্রস্তুতি ও আগমনী সুর",
    dayTitleBonglish: "Devipaksha Dawn & Agomoni",
    prabhat: {
      image: "/darshan/darshan_prabhat.jpg",
      pandalLocation: "কুমারটুলি স্টুডিও ও গঙ্গার ঘাট, উত্তর কলকাতা",
      titleBn: "কুমারটুলিতে মৃন্ময়ী প্রতিমার চক্ষুদান",
      titleBonglish: "Chokkhu Daan at Kumartuli Studios",
      titleEn: "Artisan Third-Eye Ceremony at Kumartuli",
      ritualBn: "শরতের ভোরে গঙ্গাস্নান ও পটুয়াপাড়ায় মায়ের অপার্থিব ত্রিনয়ন অঙ্কন।",
      ritualBonglish: "Ganga snan at dawn and breathing sacred life into Maa's third eye.",
      ritualEn: "Dawn sacred river bath and Kumartuli artisans breathing life into Maa's divine eyes.",
    },
    madhyahna: {
      image: "/darshan/pandal_bagbazar.jpg",
      pandalLocation: "বাগবাজার সর্বজনীন দুর্গোৎসব (প্রতিষ্ঠিত ১৯১৯), উত্তর কলকাতা",
      titleBn: "বাগবাজার সর্বজনীন ঐতিহ্যবাহী সাবেকী রূপ",
      titleBonglish: "Bagbazar Sarbojanin Classical Sabeki Ekchala",
      titleEn: "Bagbazar Sarbojanin Traditional Sabeki Darshan",
      ritualBn: "বিশুদ্ধ সাবেক ডাকের সাজের প্রতিমায় মা দুর্গার সৌম্য মাতৃত্বরূপ দর্শন।",
      ritualBonglish: "Darshan of pristine white Daker Saaj Sabeki Ekchala in heritage North Kolkata.",
      ritualEn: "Grand heritage courtyard darshan of Goddess Durga in pure silver filigree Daker Saaj.",
    },
    sandhya: {
      image: "/darshan/pandal_college_square.jpg",
      pandalLocation: "কলেজ স্কোয়ার দুর্গাপূজা ও সরোবর, মধ্য কলকাতা",
      titleBn: "কলেজ স্কোয়ার সরোবরের জলে আলোকচ্ছটার প্রতিফলন",
      titleBonglish: "College Square Illuminated Water Reflection Pandal",
      titleEn: "College Square Water Reflections & Grand Illumination",
      ritualBn: "সন্ধ্যায় দীপ্তিময় আলোয় সেজে ওঠা সুবিশাল প্রাসাদ প্যান্ডেল ও সরোবরের দর্শন।",
      ritualBonglish: "Dazzling illumination reflecting on College Square lake with traditional Sabeki idol.",
      ritualEn: "Breathtaking dusk illumination reflected over the sacred lake, revealing traditional sanctum.",
    },
    nishitha: {
      image: "/darshan/darshan_nishitha.jpg",
      pandalLocation: "শান্তিনিকেতন ও প্রাচীন ঠাকুরদালান",
      titleBn: "নিশীথ রাতের তারাময় নিস্তব্ধতায় দেবীর ধ্যান",
      titleBonglish: "Mystic Midnight Cosmic Meditation",
      titleEn: "Midnight Stillness & Cosmic Devotion",
      ritualBn: "১০৮ মাটির প্রদীপের মৃদু আলোয় গভীর রাতে মায়ের শান্ত রূপের নিস্তব্ধ দর্শন।",
      ritualBonglish: "Meditative midnight darshan surrounded by glowing clay lamps and starry autumn sky.",
      ritualEn: "Serene nocturnal contemplation under autumn constellations amidst flickering clay oil lamps.",
    },
  },

  // Maha Shashthi (Oct 16, 2026)
  shashthi: {
    dayId: "shashthi",
    dayTitleBn: "মহাষষ্ঠী — বেলতলায় দেবীর বোধন",
    dayTitleBonglish: "Maha Shashthi — Bodhon & Awakening",
    prabhat: {
      image: "/darshan/darshan_prabhat.jpg",
      pandalLocation: "বেলগাছিয়া ও প্রাচীন বনেদি ঠাকুরবাড়ি",
      titleBn: "বিল্ববৃক্ষমূলে দেবীর আমন্ত্রণ ও অধিবাস",
      titleBonglish: "Bodhon under the Sacred Bilva Tree",
      titleEn: "Sacred Awakening under the Bilva Tree",
      ritualBn: "বিল্ববৃক্ষে দেবীর জাগরণ, ঘট স্থাপন ও শুভ অধিবাস সূচনা।",
      ritualBonglish: "Awakening of Devi Mahamaya under the Bilva tree and invoking divine presence.",
      ritualEn: "Awakening of Mother Durga under the sacred wood-apple tree with ceremonial Kalash.",
    },
    madhyahna: {
      image: "/darshan/pandal_bagbazar.jpg",
      pandalLocation: "বাগবাজার সর্বজনীন, কলকাতা",
      titleBn: "মহাষষ্ঠীর মধ্যাহ্ন রূপ ও দেবীর বরণ",
      titleBonglish: "Maha Shashthi Midday Sabeki Darshan",
      titleEn: "Midday Classical Sabeki Sanctum",
      ritualBn: "সাবেক প্রতিমার সম্মুখে শাস্ত্রীয় বোধন পূজা ও গন্ধপুষ্প নিবেদন।",
      ritualBonglish: "Vedic Bodhon prayers and sacred Chandan offerings before the classical idol.",
      ritualEn: "Vedic chants and aromatic offerings before the century-old traditional sanctum.",
    },
    sandhya: {
      image: "/darshan/darshan_sandhya.jpg",
      pandalLocation: "শোভাবাজার রাজবাড়ি, কলকাতা",
      titleBn: "মহাষষ্ঠীর সান্ধ্য আমন্ত্রণ ও পঞ্চপ্রদীপ আরতি",
      titleBonglish: "Shashthi Sandhya Arati & Grand Invocation",
      titleEn: "Shashthi Twilight Arati & Royal Invocation",
      ritualBn: "কাঁসর-ঘণ্টা ও শঙ্খধ্বনির মাঝে পঞ্চপ্রদীপে মায়ের প্রথম আনুষ্ঠানিক সান্ধ্য আরতি।",
      ritualBonglish: "First ceremonial Sandhya Arati with flaming brass lamps and beating Dhaks.",
      ritualEn: "First grand evening arati with conch resonance and flaming multi-tiered brass lamps.",
    },
    nishitha: {
      image: "/darshan/pandal_college_square.jpg",
      pandalLocation: "কলেজ স্কোয়ার সরোবর, কলকাতা",
      titleBn: "মহাষষ্ঠীর নিশীথ রাতের আলোকোজ্জ্বল রূপ",
      titleBonglish: "College Square Midnight Reflection Darshan",
      titleEn: "Midnight Reflections of the Palace Pandal",
      ritualBn: "গভীর রাতের শান্ত বাতাসে সরোবরের জলে প্রদীপের প্রতিফলন ও দর্শন।",
      ritualBonglish: "Quiet midnight reflections across the water tank with devotees in reverence.",
      ritualEn: "Nocturnal water reflections of the glowing palace structure in sacred silence.",
    },
  },

  // Maha Saptami (Oct 17/18, 2026)
  saptami: {
    dayId: "saptami",
    dayTitleBn: "মহাসপ্তমী — নবপত্রিকা স্নান ও প্রাণপ্রতিষ্ঠা",
    dayTitleBonglish: "Maha Saptami — Nabapatrika Snan",
    prabhat: {
      image: "/darshan/ritual_nabapatrika.jpg",
      pandalLocation: "প্রিন্সেপ ঘাট ও বাজা কদমতলা ঘাট, হুগলি নদী",
      titleBn: "গঙ্গার পবিত্র জলে নবপত্রিকা (কলাবউ) স্নান",
      titleBonglish: "Nabapatrika Snan at Hooghly River Ghats",
      titleEn: "Holy Nabapatrika River Bath at Ganges Ghat",
      ritualBn: "সূর্যোদয়ে লালপেড়ে শাড়িতে সজ্জিতা নবপত্রিকাকে গঙ্গাস্নানের পর মণ্ডপে আনয়ন।",
      ritualBonglish: "Bathing the sacred Kola Bou plant in the Ganges at dawn, backed by Vidyasagar Setu.",
      ritualEn: "Ritual bathing of the sacred nine-plant deity (Kola Bou) in the holy river at sunrise.",
    },
    madhyahna: {
      image: "/darshan/darshan_madhyahna.jpg",
      pandalLocation: "লাহাবাড়ি ও সাবর্ণ রায়চৌধুরী ঠাকুরদালান",
      titleBn: "মহাসপ্তমীর মহাস্নান ও রাজকীয় অন্নভোগ",
      titleBonglish: "Maha Saptami Pran Pratishtha & Bhog",
      titleEn: "Saptami Sacred Consecration & Traditional Bhog",
      ritualBn: "দর্পণ স্নান, ঘট স্থাপন এবং মায়ের সামনে সপ্তমী ভোগ ও পুষ্পাঞ্জলি নিবেদন।",
      ritualBonglish: "Mirror reflection bath, Pran Pratishtha and offering Khichuri-Labra Mahabhog.",
      ritualEn: "Sacred mirror bathing ritual, consecration, and traditional feast offerings.",
    },
    sandhya: {
      image: "/darshan/darshan_sandhya.jpg",
      pandalLocation: "ম্যাডক্স স্কোয়ার ও একডালিয়া এভারগ্রিন",
      titleBn: "মহাসপ্তমীর সান্ধ্য ধুনুচি আরতি",
      titleBonglish: "Saptami Sandhya Aarti & Dhunuchi Dance",
      titleEn: "Saptami Twilight Aarti & Dhunuchi Celebration",
      ritualBn: "ধুনোর মিষ্টি সুগন্ধ ও আলোর রোশনাইয়ে দশপ্রহরণধারিণীর রণচণ্ডী দর্শন।",
      ritualBonglish: "Billowing fragrant Dhuno frankincense and golden flame lamps in festive ecstasy.",
      ritualEn: "Aromatic frankincense smoke rising as multi-tier brass oil lamps honor the warrior Goddess.",
    },
    nishitha: {
      image: "/darshan/darshan_nishitha.jpg",
      pandalLocation: "প্রাচীন বনিয়াদি পরিবারের ঠাকুরদালান",
      titleBn: "সপ্তমীর গভীর রাতের নিস্তব্ধ শান্তি দর্শন",
      titleBonglish: "Quiet Saptami Midnight Contemplation",
      titleEn: "Midnight Peace & Auspicious Stillness",
      ritualBn: "নীরব নিশীথে মাটির প্রদীপের স্নিগ্ধ আলোয় দেবীর পরম কৃপাদৃষ্টি।",
      ritualBonglish: "Serene midnight gaze of Devi Durga illuminated by sacred terracotta oil lamps.",
      ritualEn: "Gentle midnight gaze of the Mother Goddess amidst silent glowing earthen lamps.",
    },
  },

  // Maha Ashtami (Oct 19, 2026)
  ashtami: {
    dayId: "ashtami",
    dayTitleBn: "মহাষ্টমী — পুষ্পাঞ্জলি, কুমারী পূজা ও ১০৮ প্রদীপের সন্ধিপূজা",
    dayTitleBonglish: "Maha Ashtami — Pushpanjali, Kumari & Sandhi Puja",
    prabhat: {
      image: "/darshan/darshan_prabhat.jpg",
      pandalLocation: "বাগবাজার, হাতিবাগান ও শোভাবাজার",
      titleBn: "মহাষ্টমীর মহাস্নান ও মহা পুষ্পাঞ্জলি",
      titleBonglish: "Maha Ashtami Morning Pushpanjali",
      titleEn: "Grand Ashtami Morning Pushpanjali",
      ritualBn: "উপবাসী ভক্তবৃন্দের ভক্তিভরে করজোড়ে অষ্টমী পুষ্পাঞ্জলি মন্ত্রোচ্চারণ।",
      ritualBonglish: "Devotees in traditional white-red attires reciting the sacred Ashtami Pushpanjali mantra.",
      ritualEn: "Fasting devotees offering sacred Bel leaves and flowers during Ashtami morning prayers.",
    },
    madhyahna: {
      image: "/darshan/ritual_kumari_puja.jpg",
      pandalLocation: "বেলুড় মঠ ও রামকৃষ্ণ মিশন, হাওড়া/কলকাতা",
      titleBn: "মহাষ্টমীর পরম পবিত্র কুমারী পূজা",
      titleBonglish: "Belur Math Maha Ashtami Kumari Puja",
      titleEn: "Belur Math Sacred Kumari Puja Worship",
      ritualBn: "জীবন্ত দেবী জ্ঞানে বেনারসি পরিহিতা কুমারী কন্যার চরণপূজা ও আরতি।",
      ritualBonglish: "Revered monks worshipping a young girl as the living Goddess Durga at Belur Math.",
      ritualEn: "Monks in saffron robes performing arati to a young girl seated as the living divine Mother.",
    },
    sandhya: {
      image: "/darshan/darshan_sandhya.jpg",
      pandalLocation: "দেশপ্রিয় পার্ক ও সুরুচি সংঘ, দক্ষিণ কলকাতা",
      titleBn: "মহাষ্টমীর মহিসন্ধ্যা ও আলোকময় রূপ",
      titleBonglish: "Maha Ashtami Evening Illumination & Aarti",
      titleEn: "Ashtami Evening Grand Illumination & Aarti",
      ritualBn: "সন্ধিপূজার পূর্বে মণ্ডপে মণ্ডপে আলোর রোশনাই ও মহিষাসুরমর্দিনী দর্শন।",
      ritualBonglish: "Golden festive lights and beating Dhaks leading towards the sacred Sandhikala.",
      ritualEn: "Majestic festive lights and reverberating Dhak drums welcoming the auspicious Sandhikala.",
    },
    nishitha: {
      image: "/darshan/darshan_nishitha.jpg",
      pandalLocation: "ঐতিহাসিক বনেদি বাড়ি ও ঐতিহ্যবাহী মণ্ডপ",
      titleBn: "১০৮ প্রদীপ ও ১০৮ পদ্মের সন্ধিপূজা দর্শন",
      titleBonglish: "Sacred Sandhi Puja: 108 Lamps & 108 Lotuses",
      titleEn: "Sandhi Puja: 108 Terracotta Lamps & 108 Lotuses",
      ritualBn: "অষ্টমী-নবমীর মিলনক্ষণে ১০৮ মাটির প্রদীপ প্রজ্বলন ও দেবী চামুণ্ডার আরাধনা।",
      ritualBonglish: "Lighting 108 earthen diyas and offering 108 pink lotuses at the exact junction moment.",
      ritualEn: "Igniting 108 clay oil lamps and offering 108 lotuses at the sacred 48-minute Sandhikala.",
    },
  },

  // Maha Navami (Oct 20, 2026)
  navami: {
    dayId: "navami",
    dayTitleBn: "মহ Navami — নবমী হোম ও উন্মত্ত ধুনুচি নাচ",
    dayTitleBonglish: "Maha Navami — Homa & Dhunuchi Naach",
    prabhat: {
      image: "/darshan/ritual_nabapatrika.jpg",
      pandalLocation: "সন্তোষ মিত্র স্কোয়ার ও শ্রীভূমি",
      titleBn: "মহ Navami হোমযজ্ঞ ও পূর্ণাহুতি",
      titleBonglish: "Maha Navami Morning Sacred Yajna",
      titleEn: "Navami Morning Homa & Sacred Fire",
      ritualBn: "অগ্নিদেবকে সাক্ষী রেখে বিল্বপত্র ও ঘৃত সহযোগে মহা হোমযজ্ঞ সম্পাদন।",
      ritualBonglish: "Chanting Vedic hymns around the sacred homa fire with pure ghee and wood offerings.",
      ritualEn: "Solemn Vedic fire offerings (Homa) with pure ghee and sacred bel leaves at sunrise.",
    },
    madhyahna: {
      image: "/darshan/darshan_madhyahna.jpg",
      pandalLocation: "যোধপুর পার্ক ও ম্যাডক্স স্কোয়ার",
      titleBn: "মহ Navami মধ্যাহ্ন ভোগ আরতি",
      titleBonglish: "Maha Navami Grand Midday Bhog Arati",
      titleEn: "Navami Midday Royal Bhog & Prasadam",
      ritualBn: "খিচুড়ি, পোলাও, ছানার ডালনা ও পায়েসের পঞ্চব্যঞ্জন রাজকীয় ভোগ।",
      ritualBonglish: "Royal feast offerings of Basanti Pulao, Khichuri and Payesh before Maa Durga.",
      ritualEn: "Grand feast offering of traditional Bengali saffron pulao, payesh and delicacies.",
    },
    sandhya: {
      image: "/darshan/pandal_dhunuchi.jpg",
      pandalLocation: "উত্তর ও দক্ষিণ কলকাতার সর্বজনীন মণ্ডপ",
      titleBn: "মহ Navami সন্ধ্যার উন্মত্ত ধুনুচি নাচ",
      titleBonglish: "Ecstatic Navami Dhunuchi Naach Frenzy",
      titleEn: "Ecstatic Navami Dhunuchi Dance Frenzy",
      ritualBn: "কাঁসর-ঘণ্টা ও ঢাকের অবিরাম বোলে ধুনোর ধোঁয়ায় মাতোয়ারা ভক্তদের নৃত্য।",
      ritualBonglish: "Devotees balancing flaming clay Dhunuchi in hands and teeth to thunderous Dhaks.",
      ritualEn: "Dancers balancing smoking clay frankincense vessels in hands and teeth to beating drums.",
    },
    nishitha: {
      image: "/darshan/pandal_college_square.jpg",
      pandalLocation: "কলেজ স্কোয়ার সরোবর, কলকাতা",
      titleBn: "মহ Navami নিশীথ রাতের রূপকথা প্যান্ডেল দর্শন",
      titleBonglish: "Navami Midnight Fairy-Tale Pandal Darshan",
      titleEn: "Navami Midnight Palace Illumination",
      ritualBn: "নবমীর নিশি যেন না পোহায় — গভীর রাতে কোটি আলোর রোশনাইয়ে দেবীর দর্শন।",
      ritualBonglish: "Praying for Navami night never to end, gazing upon the illuminated Goddess.",
      ritualEn: "'May this night never end!' Devotees gazing in reverence at the illuminated Goddess.",
    },
  },

  // Bijoya Dashami (Oct 21, 2026)
  dashami: {
    dayId: "dashami",
    dayTitleBn: "বিজয়া দশমী — সিঁদুরখেলা ও বিষাদের বিদায়",
    dayTitleBonglish: "Bijoya Dashami — Sindoor Khela & Farewell",
    prabhat: {
      image: "/darshan/darshan_prabhat.jpg",
      pandalLocation: "উত্তর ও দক্ষিণ কলকাতার ঠাকুরদালান",
      titleBn: "বিজয়া দশমীর দেবী বরণ ও অপরাজিতা পূজা",
      titleBonglish: "Dashami Morning Devi Baran Ritual",
      titleEn: "Dashami Morning Devi Baran Ceremony",
      ritualBn: "পানপাতা, মিষ্টি ও দূর্বাঘাস দিয়ে চোখের জলে মাকে বিদায় সম্ভাষণ।",
      ritualBonglish: "Bidding tearful farewell with betel leaves and sweets before the immersion.",
      ritualEn: "Touching betel leaves and sweets to Maa's lips in loving, tearful farewell.",
    },
    madhyahna: {
      image: "/darshan/darshan_dashami.jpg",
      pandalLocation: "বাগবাজার, শোভাবাজার ও সমগ্র বাংলা",
      titleBn: "ঐতিহ্যবাহী সিঁদুরখেলা ও মিষ্টিমুখ",
      titleBonglish: "Iconic Bengali Sindoor Khela Celebration",
      titleEn: "Traditional Sindoor Khela & Joyous Celebration",
      ritualBn: "লালপেড়ে শাড়ি পরা সধবা নারীদের মাকে সিঁদুর পরিয়ে উলুধ্বনি ও সিঁদুরখেলা।",
      ritualBonglish: "Bengali women in traditional red-border sarees applying vermilion and sharing Sandesh.",
      ritualEn: "Women in red-and-white sarees applying crimson vermilion to Maa and each other with joy.",
    },
    sandhya: {
      image: "/darshan/darshan_dashami.jpg",
      pandalLocation: "বাবুঘাট ও বাজে কদমতলা ঘাট, হুগলি নদী",
      titleBn: "আসছে বছর আবার হবে — গঙ্গায় দেবী বিসর্জন",
      titleBonglish: "Asche Bochhor Abar Hobe: Holy Immersion",
      titleEn: "Sacred Immersion & Shubho Bijoya Blessings",
      ritualBn: "নৌকা থেকে গঙ্গায় প্রতিমা নিরঞ্জন এবং ভক্তদের কোলাকুলি ও শুভ বিজয়ার প্রণাম।",
      ritualBonglish: "Immersion of the idol in the Ganges as shouts of 'Shubho Bijoya' fill the night air.",
      ritualEn: "Sacred immersion into the river as chants of 'Mother will return next year!' fill the air.",
    },
    nishitha: {
      image: "/darshan/darshan_nishitha.jpg",
      pandalLocation: "বাংলার প্রতিটি গৃহকোণ",
      titleBn: "শুভ বিজয়ার আন্তরিক আশীর্বাদ ও শান্তি দর্শন",
      titleBonglish: "Shubho Bijoya Peace, Love & Resilience",
      titleEn: "Shubho Bijoya Peace, Blessings & Gratitude",
      ritualBn: "শান্তিজল গ্রহণ, গুরুজনদের প্রণাম এবং মিষ্টিমুখের মাধ্যমে শারদোৎসব সমাপন।",
      ritualBonglish: "Receiving Shanti Jal, touching elders' feet for blessings, and embracing unity.",
      ritualEn: "Sprinkling holy water for peace, seeking elders' blessings, and embracing community.",
    },
  },
};

// Sanskrit Mantras & Pronunciation
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
 * Maps any Date to the active festival day key
 */
export function getFestivalDayKey(date = new Date()) {
  const month = date.getMonth(); // 9 = October (0-indexed)
  const day = date.getDate();

  // If in October 2026:
  if (month === 9) {
    if (day <= 15) return "devipaksha";
    if (day === 16) return "shashthi";
    if (day === 17 || day === 18) return "saptami";
    if (day === 19) return "ashtami";
    if (day === 20) return "navami";
    if (day >= 21) return "dashami";
  }

  // Default fallback to active devipaksha progression
  return "devipaksha";
}

/**
 * Returns the active Prahar slot based on local time
 */
export function getActivePraharSlot(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 4 && hour < 10) {
    return PRAHAR_SLOTS[0]; // prabhat
  } else if (hour >= 10 && hour < 16) {
    return PRAHAR_SLOTS[1]; // madhyahna
  } else if (hour >= 16 && hour < 22) {
    return PRAHAR_SLOTS[2]; // sandhya
  } else {
    return PRAHAR_SLOTS[3]; // nishitha
  }
}

/**
 * Resolves the complete Darshan data for any given day and prahar slot
 */
export function getDarshanForDayAndSlot(dayKey = "devipaksha", slotId = "sandhya") {
  const dayData = FESTIVAL_DAY_DARSHAN_MATRIX[dayKey] || FESTIVAL_DAY_DARSHAN_MATRIX.devipaksha;
  const slotData = dayData[slotId] || dayData.sandhya;
  const slotDef = PRAHAR_SLOTS.find((s) => s.id === slotId) || PRAHAR_SLOTS[2];

  return {
    ...slotDef,
    ...slotData,
    dayId: dayKey,
    dayTitleBn: dayData.dayTitleBn,
    dayTitleBonglish: dayData.dayTitleBonglish,
  };
}

/**
 * Calculates countdown until next Prahar shift
 */
export function getNextPraharCountdown(date = new Date()) {
  const currentHour = date.getHours();

  let targetHour;
  let targetDayOffset = 0;

  if (currentHour >= 4 && currentHour < 10) {
    targetHour = 10;
  } else if (currentHour >= 10 && currentHour < 16) {
    targetHour = 16;
  } else if (currentHour >= 16 && currentHour < 22) {
    targetHour = 22;
  } else {
    targetHour = 4;
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
    shouldPreloadNext: totalSeconds <= 1200,
  };
}
