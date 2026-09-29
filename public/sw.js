/**
 * Service Worker — Mahalaya Dawn Atmosphere & Durga Puja PWA
 * Provides offline caching, network-first strategy, and installability triggers.
 */

const CACHE_NAME = "mahalaya-dawn-v1";
const OFFLINE_URL = "/";

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/upperLayer.png",
];

// Install: Cache essential app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Service worker precache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network first, cache fallback (ignores range requests for large audio streaming)
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Audio files (.mp3) use native streaming / range requests, bypass cache
  if (url.pathname.endsWith(".mp3") || event.request.headers.get("range")) {
    return;
  }

  // Handle standard navigation and asset fetches
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          // Cache successful static responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || (event.request.mode === "navigate" ? caches.match(OFFLINE_URL) : null);
          });
        })
    );
  }
});
