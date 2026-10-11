/**
 * Sacred Patronage & Contribution Configuration — 2026 SaaS Product Architecture
 * Easily customize your receiving UPI ID, Payee Name, and QR Code image.
 */

export const CONTRIBUTION_CONFIG = {
  // 1. UPI ID (Virtual Payment Address) for Google Pay, PhonePe, Paytm, BHIM, Cred, etc.
  upiId: "sudhanshu9713@okaxis", // <-- Replace with your UPI ID (e.g. yourname@oksbi, yourname@upi)
  payeeName: "Sudhanshu Ghosh", // <-- Your display name shown on UPI apps
  defaultNote: "Mahalaya Dawn Soundscape Sacred Diya",

  // 2. Path to custom QR code image in public/ folder.
  // Directly connects your attached receiving money QR image
  qrImagePath: "/my-QR.jpeg",

  // 3. Cultural Patronage Tiers (Emotional & Attractive Framing)
  tiers: [
    {
      id: "mati-diya",
      name: "মাটির প্রদীপ",
      subName: "Mati Diya",
      amount: 21,
      badge: "Warm the Dawn",
      icon: "🪔",
      desc: "Light a gentle earthen lamp in the virtual dawn sky",
      popular: false,
    },
    {
      id: "shiuli-arghya",
      name: "শিউলি অর্ঘ্য",
      subName: "Shiuli Arghya",
      amount: 51,
      badge: "Most Blessed",
      icon: "🌸",
      desc: "Sponsor ad-free Akashvani Kolkata radio streaming bandwidth",
      popular: true,
    },
    {
      id: "mahapuja-patron",
      name: "মহাপূজা পৃষ্ঠপোষক",
      subName: "Mahapuja Patron",
      amount: 101,
      badge: "Guardian",
      icon: "👑",
      desc: "Keep the 4K dynamic sky & audio servers glowing all year",
      popular: false,
    },
  ],

  // 4. Cultural Emotional Copy
  copy: {
    badgeText: "🪔 Light a Diya",
    badgeSubText: "প্রদীপ জ্বালান",
    headline: "ভোরের আলো জ্বালিয়ে রাখুন",
    subHeadline: "Light a Sacred Diya for Maa Durga",
    mission:
      "This living October dawn soundscape & Akashvani radio relay is crafted with pure devotion — 100% ad-free and open for Bengalis across the globe. When you offer an arghya (প্রদীপ), you directly empower server bandwidth, audio preservation, and continuous creative engineering.",
    gratitudeTitle: "অর্ঘ্য সফল হয়েছে • ধন্য আপনার ভক্তি!",
    gratitudeMessage:
      "May Maa Durga bless you with serenity, joy, and prosperity. Your sacred diya is now glowing in the collective dawn soundscape.",
  },
};

/**
 * Builds standard UPI Universal Intent URL
 * Works on Android, iOS, and UPI desktop clients
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
