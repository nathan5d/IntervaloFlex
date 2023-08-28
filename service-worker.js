const CACHE_NAME = "intervalo-flex-cache-v2";
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
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
    caches.match(event.request)
      .then((response) => {
        // Se encontrarmos uma resposta no cache, retornamos a resposta do cache
        if (response) {
          return response;
        }
        
        // Caso contrário, fazemos uma solicitação de rede
        return fetch(event.request)
          .then((networkResponse) => {
            // Se a solicitação de rede for bem-sucedida, adicionamos a resposta ao cache
            if (networkResponse) {
              const cacheCopy = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, cacheCopy);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Se a solicitação de rede falhar, podemos retornar uma página de fallback
            // ou uma mensagem de erro, dependendo do que você deseja
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

// Verificar status da conexão e exibir mensagem offline ao carregar a página
self.addEventListener("fetch", (event) => {
    if (!navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }

                return new Response("Você está offline. O conteúdo pode não estar atualizado.");
            })
        );
    }
});