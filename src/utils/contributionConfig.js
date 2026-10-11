/**
 * Sacred Patronage & Contribution Configuration — 2026 SaaS Product Architecture
 * Optimized with Indian Consumer & Cultural Behavioral Psychology (Auspicious Shagun & UPI Trust)
 */

export const CONTRIBUTION_CONFIG = {
  // 1. Official Verified Kotak Mahindra Bank UPI ID (Virtual Payment Address)
  upiId: "sudhanshughosh@kotakbank",
  payeeName: "Sudhanshu Ghosh",
  bankName: "Kotak Mahindra Bank",
  defaultNote: "Mahalaya Sharodiya Pujor Arghya",

  // 2. Attached QR Code image in public folder
  qrImagePath: "/my-QR.jpeg",

  // 3. Indian Auspicious Shagun Tiers (Ending in +1 for continuity & divine blessings)
  tiers: [
    {
      id: "mati-diya",
      name: "মাটির প্রদীপ",
      subName: "Mati Diya",
      amount: 21,
      badge: "শুভ সংকল্প",
      icon: "🪔",
      desc: "ভোরের আলোয় একটি পবিত্র মাটির প্রদীপ প্রজ্বলন করুন",
      popular: false,
    },
    {
      id: "pushpanjali-arghya",
      name: "পুষ্পাঞ্জলি অর্ঘ্য",
      subName: "Pushpanjali Arghya",
      amount: 51,
      badge: "ভক্তদের প্রথম পছন্দ",
      icon: "🌸",
      desc: "আকাশবাণী কলকাতা ও লাইভ রেডিওয় ১ দিনের ব্যান্ডউইথ অক্ষুণ্ণ রাখুন",
      popular: true,
    },
    {
      id: "chandipath-seva",
      name: "চণ্ডীপাঠ সেবা",
      subName: "Chandipath Seva",
      amount: 101,
      badge: "ঐতিহ্য সংরক্ষণ",
      icon: "📜",
      desc: "বীরেন্দ্রকৃষ্ণের অমর চণ্ডীপাঠ ও সার্বক্ষণিক সার্ভার চিরন্তন রাখুন",
      popular: false,
    },
    {
      id: "mahapuja-patron",
      name: "মহাপূজা পৃষ্ঠপোষক",
      subName: "Mahapuja Patron",
      amount: 251,
      badge: "চিরন্তন আশীর্বাদ",
      icon: "👑",
      desc: "৪কে লিভিং স্কাই ও দুর্গাপূজা হেরিটেজ আর্টওয়ার্কের আজীবন পৃষ্ঠপোষক",
      popular: false,
    },
  ],

  // 4. Rotating Social Proof Devotee Stream (Cultural Bandwagon Effect)
  socialTicker: [
    { name: "সৌরভ মুখোপাধ্যায়", city: "কলকাতা", amount: 51, time: "২ মিনিট আগে" },
    { name: "অনন্যা সেন", city: "শিলিগুড়ি", amount: 21, time: "৫ মিনিট আগে" },
    { name: "দেবস্মিতা রায়", city: "ঢাকা", amount: 101, time: "৭ মিনিট আগে" },
    { name: "রাহুল বোস", city: "হাওড়া", amount: 51, time: "১২ মিনিট আগে" },
    { name: "অরিন্দম ও পরিবার", city: "লন্ডন", amount: 101, time: "১৫ মিনিট আগে" },
    { name: "প্রিয়াঙ্কা চক্রবর্তী", city: "দুর্গাপুর", amount: 21, time: "১৮ মিনিট আগে" },
  ],

  // 5. Cultural Emotional Framing Copy
  copy: {
    badgeText: "🪔 প্রদীপ অর্ঘ্য",
    badgeSubText: "Light a Diya",
    headline: "ভোরের আলো জ্বালিয়ে রাখুন",
    subHeadline: "মা দুর্গার চরণে আপনার পবিত্র প্রদীপ প্রজ্বলন করুন",
    mission:
      "এই ভোরের আকাশ ও বীরেন্দ্রকৃষ্ণের অমর চণ্ডীপাঠ সম্পূর্ণরূপে বিজ্ঞাপনহীন এবং বিশ্বজুড়ে প্রতিটি বাঙালির জন্য মুক্ত রাখা হয়েছে। আপনার দেওয়া একটি প্রদীপ সরাসরি লাইভ স্ট্রিমিং ও সার্ভারকে আলোকিত রাখবে।",
    trustText: "🛡️ 100% সুরক্ষিত ব্যাংক ট্রান্সফার • Kotak Mahindra Bank UPI",
    gratitudeTitle: "অর্ঘ্য সফল হয়েছে • শুভ শারদীয়া!",
    gratitudeMessage:
      "মা দুর্গার অশেষ আশীর্বাদে আপনার পরিবার সুখ, শান্তি ও সুস্বাস্থ্যে ভরে উঠুক। আপনার প্রজ্বলিত প্রদীপ সমগ্র বাংলার ভোরকে আলোকিত করছে।",
  },
};

/**
 * Builds standard UPI Universal Intent URL
 * Supported by Google Pay, PhonePe, Paytm, BHIM, Cred, and mobile browsers
 */
export function buildUpiIntentUrl({
  upiId = CONTRIBUTION_CONFIG.upiId,
  payeeName = CONTRIBUTION_CONFIG.payeeName,
  amount = 51,
  note = CONTRIBUTION_CONFIG.defaultNote,
} = {}) {
  const cleanUpi = encodeURIComponent(upiId.trim());
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(note.trim());
  const cleanAmount = amount ? `&am=${amount}` : "";

  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}${cleanAmount}&tn=${cleanNote}&cu=INR`;
}
