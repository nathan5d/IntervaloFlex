const CACHE_NAME = "intervalo-flex-cache-v1";
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
  "/IntervaloFlex/",
  "/IntervaloFlex/index.html",
  "/IntervaloFlex/icon.png",
  "/IntervaloFlex/service-worker.js",
  // Adicione outros recursos que deseja cachear aqui
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return (
              cacheName.startsWith("intervalo-flex-cache-") &&
              cacheName !== CACHE_NAME
            );
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
