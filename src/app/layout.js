import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWAProvider from "@/components/PWAProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0806" },
    { media: "(prefers-color-scheme: light)", color: "#1e130c" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  title: "মহিষাসুরমর্দ্দিনী — 4:00 AM Mahalaya & Durga Puja Dawn",
  description:
    "An atmospheric 4:00 AM autumn dawn sanctuary synchronizing Birendra Krishna Bhadra's sacred Mahalaya Chandipath with living procedural twilight skies, radiant sunrise transitions, and an interactive portal unveiling the illuminated Durga Puja festival celebration.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "মহিষাসুরমর্দ্দিনী",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-zinc-100 overflow-hidden">
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  );
}
