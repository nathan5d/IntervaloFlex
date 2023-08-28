const CACHE_VERSION = "v3"; // Atualize a versão sempre que fizer alterações no cache
const CACHE_NAME = `intervalo-flex-cache-${CACHE_VERSION}`;
const CACHE_TIME = 5 * 24 * 60 * 60 * 1000; // 5 dias em milissegundos

const urlsToCache = [
    "/IntervaloFlex/",
    "/IntervaloFlex/index.html",
    "/IntervaloFlex/style.css",
    "/IntervaloFlex/icon.png",
    "/IntervaloFlex/logo.png",
    // Adicione outros recursos que deseja cachear aqui
];

// Função para limpar caches antigos
const cleanOldCaches = () => {
    return caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME) {
                    return caches.delete(cacheName);
                }
            })
        );
    });
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        cleanOldCaches()
    );
});

// Dentro do fetch event no Service Worker
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                // Recurso encontrado no cache, atualiza o elemento com a mensagem
                updateCacheStatus(true);
                return response;
            }

            return fetch(event.request).then((networkResponse) => {
                const cacheResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, cacheResponse);
                });

                // Recurso carregado do servidor, atualiza o elemento com a mensagem
                updateCacheStatus(false);
                return networkResponse;
            });
        })
    );
});

// Função para atualizar o elemento de status do cache
function updateCacheStatus(fromCache) {
    const cacheStatusElement = document.getElementById('cache-status');
    cacheStatusElement.textContent = fromCache ? 'Carregado do Cache' : 'Carregado do Servidor';
}

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
