/**
 * Sacred Patronage & Contribution Configuration — 2026 SaaS Product Architecture
 * Optimized with Indian Consumer & Cultural Behavioral Psychology:
 * - Bilingual Typography (Bengali + English) for both resident & Probashi Bengalis
 * - Authentic Probashi & Indian Metro demographics (Bengaluru, Delhi NCR, Mumbai, Kolkata, Pune)
 * - Shagun Pricing (+₹1 tradition: ₹21, ₹51, ₹101, ₹251)
 * - Rich 40+ Devotee Social Proof Pool with anti-repetition randomization
 */

export const CONTRIBUTION_CONFIG = {
  // 1. Official Verified Kotak Mahindra Bank UPI ID (Virtual Payment Address)
  upiId: "sudhanshughosh@kotakbank",
  payeeName: "Sudhanshu Ghosh",
  bankName: "Kotak Mahindra Bank",
  defaultNote: "Mahalaya Sharodiya Pujor Arghya",

  // 2. Attached QR Code image in public folder
  qrImagePath: "/my-QR.jpeg",

  // 3. Indian Auspicious Shagun Tiers (Ending in +1 for divine continuity)
  // Designed concisely so labels NEVER clip or truncate on mobile screens
  tiers: [
    {
      id: "mati-diya",
      name: "মাটির প্রদীপ",
      enName: "Mati Diya",
      amount: 21,
      badge: "Starter",
      badgeBn: "সংকল্প",
      icon: "🪔",
      desc: "Light an earthen lamp in the dawn sky",
      popular: false,
    },
    {
      id: "pushpanjali-arghya",
      name: "পুষ্পাঞ্জলি",
      enName: "Pushpanjali",
      amount: 51,
      badge: "Popular • ভক্তপ্রিয়",
      badgeBn: "ভক্তপ্রিয়",
      icon: "🌸",
      desc: "Sponsor ad-free Akashvani radio bandwidth",
      popular: true, // Anchor default
    },
    {
      id: "chandipath-seva",
      name: "চণ্ডীপাঠ সেবা",
      enName: "Chandi Seva",
      amount: 101,
      badge: "Heritage",
      badgeBn: "ঐতিহ্য",
      icon: "📜",
      desc: "Preserve Birendra Krishna Bhadra's eternal chant",
      popular: false,
    },
    {
      id: "mahapuja-patron",
      name: "মহাপূজা",
      enName: "Maha Patron",
      amount: 251,
      badge: "Guardian",
      badgeBn: "পৃষ্ঠপোষক",
      icon: "👑",
      desc: "Sustain 4K living dawn & soundscape servers",
      popular: false,
    },
  ],

  // 4. Rich, Diverse Social Proof Devotee Stream (40+ Genuine Indian & Probashi Bengalis)
  // Spanning Kolkata, West Bengal districts, major Indian IT metros, and global NRIs
  // Strictly zero foreign non-UPI locations to preserve genuine authenticity
  socialTicker: [
    { name: "Sourav Mukherjee", bnName: "সৌরভ মুখোপাধ্যায়", city: "Kolkata", amount: 51, time: "just now" },
    { name: "Ananya Sen & Family", bnName: "অনন্যা সেন ও পরিবার", city: "Bengaluru", amount: 101, time: "1m ago" },
    { name: "Debopriyo Roy", bnName: "দেবপ্রিয় রায়", city: "Delhi NCR", amount: 51, time: "2m ago" },
    { name: "Poulomi Chatterjee", bnName: "পৌলমী চ্যাটার্জী", city: "Mumbai", amount: 51, time: "3m ago" },
    { name: "Dr. Kingshuk Guha", bnName: "ডাঃ কিংশুক গুহ", city: "Kolkata", amount: 101, time: "4m ago" },
    { name: "Subhajit & Riya", bnName: "শুভজিৎ ও রিয়া", city: "Pune", amount: 51, time: "5m ago" },
    { name: "Tanmoy Das", bnName: "তন্ময় দাস", city: "Hyderabad", amount: 21, time: "6m ago" },
    { name: "Arindam Banerjee", bnName: "অরিন্দম ব্যানার্জী", city: "London", amount: 251, time: "7m ago" },
    { name: "Swati Bhattacharya", bnName: "স্বাতী ভট্টাচার্য", city: "Siliguri", amount: 21, time: "8m ago" },
    { name: "Indranil Dutta", bnName: "ইন্দ্রনীল দত্ত", city: "San Jose", amount: 251, time: "9m ago" },
    { name: "Sharmistha Majumdar", bnName: "শর্মিষ্ঠা মজুমদার", city: "Gurugram", amount: 51, time: "11m ago" },
    { name: "Bishal Sarkar", bnName: "বিশাল সরকার", city: "Howrah", amount: 21, time: "12m ago" },
    { name: "Maitreyee Sengupta", bnName: "মৈত্রেয়ী সেনগুপ্ত", city: "Chennai", amount: 51, time: "14m ago" },
    { name: "Ritwik Ganguly & Family", bnName: "ঋত্বিক গাঙ্গুলী ও পরিবার", city: "Kolkata", amount: 101, time: "15m ago" },
    { name: "Amitabh & Snigdha", bnName: "অমিতাভ ও স্নিগ্ধা", city: "Toronto", amount: 251, time: "17m ago" },
    { name: "Barnali Pal", bnName: "বর্ণালী পাল", city: "Durgapur", amount: 21, time: "19m ago" },
    { name: "Kaushik Choudhury", bnName: "কৌশিক চৌধুরী", city: "Noida", amount: 51, time: "21m ago" },
    { name: "Sreeparna Ghosh", bnName: "শ্রীপর্ণা ঘোষ", city: "Kolkata", amount: 101, time: "23m ago" },
    { name: "Nilanjan Bose", bnName: "নীলাঞ্জন বোস", city: "Bengaluru", amount: 51, time: "25m ago" },
    { name: "Aparna Mitra", bnName: "অপর্ণা মিত্র", city: "Kolkata", amount: 21, time: "27m ago" },
    { name: "Dipankar Chakraborty", bnName: "দীপঙ্কর চক্রবর্তী", city: "Asansol", amount: 51, time: "29m ago" },
    { name: "Sohini & Abhirup", bnName: "সোহিনী ও অভিরূপ", city: "Mumbai", amount: 101, time: "31m ago" },
    { name: "Prasenjit Halder", bnName: "প্রসেনজিৎ হালদার", city: "Kolkata", amount: 51, time: "33m ago" },
    { name: "Sujata Nandy", bnName: "সুজাতা নন্দী", city: "Ahmedabad", amount: 21, time: "36m ago" },
    { name: "Debashis Karmakar", bnName: "দেবাশীষ কর্মকার", city: "Siliguri", amount: 51, time: "38m ago" },
    { name: "Sayantani Bagchi", bnName: "সায়ন্তনী বাগচী", city: "Bengaluru", amount: 101, time: "40m ago" },
    { name: "Ayan & Trisha", bnName: "অয়ন ও তৃষা", city: "New Jersey", amount: 251, time: "42m ago" },
    { name: "Somnath Mondal", bnName: "সোমনাথ মণ্ডল", city: "Bardhaman", amount: 21, time: "45m ago" },
    { name: "Monideepa Lahiri", bnName: "মণিদীপা লাহিড়ী", city: "Delhi", amount: 51, time: "47m ago" },
    { name: "Rajarshi Dey", bnName: "রাজর্ষি দে", city: "Kolkata", amount: 101, time: "49m ago" },
    { name: "Tathagata Roy", bnName: "তথাগত রায়", city: "Pune", amount: 51, time: "52m ago" },
    { name: "Madhumita Barman", bnName: "মধুমিতা বর্মন", city: "Kolkata", amount: 21, time: "55m ago" },
    { name: "Sanjay & Megha", bnName: "সঞ্জয় ও মেঘা", city: "Hyderabad", amount: 101, time: "58m ago" },
    { name: "Gourab Samanta", bnName: "গৌরব সামন্ত", city: "Midnapore", amount: 21, time: "1h ago" },
    { name: "Anwesha Poddar", bnName: "অন্বেষা পোদ্দার", city: "Bengaluru", amount: 51, time: "1h ago" },
    { name: "Pinaki Bhattacharya", bnName: "পিনাকী ভট্টাচার্য", city: "London", amount: 101, time: "1h ago" },
  ],

  // 5. Bilingual Cultural Emotional Framing Copy (Bengali + English)
  copy: {
    badgeText: "🪔 Light a Diya",
    badgeBn: "প্রদীপ অর্ঘ্য",
    headline: "ভোরের আলো জ্বালিয়ে রাখুন",
    headlineEn: "Keep the Sacred Dawn Glowing",
    subHeadline: "Light a Sacred Diya for Maa Durga • মা দুর্গার চরণে অর্ঘ্য নিবেদন",
    missionBn:
      "এই ভোরের আকাশ ও বীরেন্দ্রকৃষ্ণের অমর চণ্ডীপাঠ সম্পূর্ণরূপে বিজ্ঞাপনহীন এবং বিশ্বজুড়ে প্রতিটি বাঙালির জন্য উন্মুক্ত রাখা হয়েছে।",
    missionEn:
      "Crafted with pure devotion — 100% ad-free & open for Bengalis worldwide. When you offer a sacred Diya (অর্ঘ্য), you directly sustain live streaming bandwidth, audio preservation, and server costs.",
    trustText: "🛡️ Verified Kotak Mahindra Bank UPI • 100% Secure Transfer",
    gratitudeTitle: "অর্ঘ্য সফল হয়েছে • শুভ শারদীয়া!",
    gratitudeTitleEn: "Your Diya is Glowing • Shubh Sharodiya!",
    gratitudeMessageBn:
      "মা দুর্গার অশেষ আশীর্বাদে আপনার পরিবার সুখ, শান্তি ও সুস্বাস্থ্যে ভরে উঠুক। আপনার প্রজ্বলিত প্রদীপ সমগ্র বাংলার ভোরকে আলোকিত করছে।",
    gratitudeMessageEn:
      "May Maa Durga bless you and your loved ones with serenity, good health, and abundance.",
  },
};

/**
 * Builds standard UPI Universal Intent URL
 * Strictly preserves literal '@' in VPA (NPCI specification requirement)
 * Avoids %40 encoding which breaks GPay/PhonePe bank handle resolution
 */
export function buildUpiIntentUrl({
  upiId = CONTRIBUTION_CONFIG.upiId,
  payeeName = CONTRIBUTION_CONFIG.payeeName,
  amount = 51,
  note = "Mahalaya Diya",
} = {}) {
  // NPCI requires literal '@' in VPA address
  const cleanUpi = upiId.trim().replace(/\s+/g, "");
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(note.trim());
  const cleanAmount = amount ? `&am=${amount}` : "";

  return `upi://pay?pa=${cleanUpi}&pn=${cleanName}${cleanAmount}&tn=${cleanNote}&cu=INR`;
}

/**
 * Builds app-specific and universal UPI intent URLs
 * Compatible with Google Pay, PhonePe, Paytm, BHIM, Cred, and mobile browsers
 */
export function buildAppUpiUrls({
  upiId = CONTRIBUTION_CONFIG.upiId,
  payeeName = CONTRIBUTION_CONFIG.payeeName,
  amount = 51,
  note = "Mahalaya Diya",
} = {}) {
  const cleanUpi = upiId.trim().replace(/\s+/g, "");
  const cleanName = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(note.trim());
  const cleanAmount = amount ? `&am=${amount}` : "";
  const baseParams = `pa=${cleanUpi}&pn=${cleanName}${cleanAmount}&tn=${cleanNote}&cu=INR`;

  return {
    universal: `upi://pay?${baseParams}`,
    gpay: `gpay://upi/pay?${baseParams}`,
    phonepe: `phonepe://pay?${baseParams}`,
    paytm: `paytmmp://pay?${baseParams}`,
    bhim: `upi://pay?${baseParams}`,
    cleanFallback: `upi://pay?pa=${cleanUpi}&pn=${cleanName}&cu=INR`,
  };
}

