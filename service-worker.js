const CACHE_NAME = "intervalo-flex-cache-v1";
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
    "/",
    "/IntervaloFlex/",
    "/IntervaloFlex/index.html",
    "/IntervaloFlex/style.css",
    "/IntervaloFlex/icon.png",
    "/IntervaloFlex/logo.png",
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
            if (response) {
                return response;
            }

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }

                const cacheResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, cacheResponse);
                });

                return networkResponse;
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
