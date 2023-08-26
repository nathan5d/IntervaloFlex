const CACHE_NAME = "intervalo-flex-cache-v1";
const urlsToCache = [
  "/IntervaloFlex/",
  "/IntervaloFlex/index.html",
  "/IntervaloFlex/icon.png",
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
