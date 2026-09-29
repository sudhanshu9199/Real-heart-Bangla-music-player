export default function manifest() {
  return {
    name: "মহিষাসুরমর্দ্দিনী — 4:00 AM Mahalaya & Durga Puja Dawn",
    short_name: "Mahalaya Dawn",
    description:
      "A living real-time October dawn atmosphere simulation synchronizing Birendra Krishna Bhadra's sacred Mahalaya Chandipath with living procedural skies and Durga Puja festive celebration.",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#ff7b1a",
    orientation: "any",
    categories: ["culture", "entertainment", "music"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
