/* ============================================
   SERVICE WORKER - J.League WE 2000
   Cache offline para funcionamento como PWA
   ============================================ */

const CACHE_NAME = 'we2000-v1.0.0';
const RUNTIME_CACHE = 'we2000-runtime-v1';

// Arquivos essenciais (serão cacheados na instalação)
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/css/reset.css',
    '/css/style.css',
    '/css/retro.css',
    '/css/we2000-theme.css',
    '/css/team-selector.css',
    '/js/config.js',
    '/js/retroaudio.js',
    '/js/loader.js',
    '/js/teams.js',
    '/js/team-selector.js',
    '/js/players-encyclopedia.js',
    '/js/main.js',
    '/data/players.json',
    '/assets/images/logo.png',
    '/assets/images/japan-map.png',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/manifest.json',
];

/* ============================================
   INSTALAÇÃO - pré-cacheia os arquivos essenciais
   ============================================ */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Pré-cacheando arquivos...');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.warn('[Service Worker] Erro no pré-cache:', err))
    );
});

/* ============================================
   ATIVAÇÃO - limpa caches antigos
   ============================================ */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => {
                        console.log('[Service Worker] Removendo cache antigo:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

/* ============================================
   FETCH - estratégia de cache
   - Requisições próprias: Cache First (com fallback de rede)
   - CDNs externas: Network First
   ============================================ */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignora requisições não-GET
    if (request.method !== 'GET') return;

    // Ignora chamadas ao EmulatorJS (precisa de dados frescos)
    if (url.href.includes('emulatorjs.org') || url.href.includes('lemon-web.net')) {
        return;
    }

    // Ignora requisições para o backend/APIs
    if (url.pathname.startsWith('/api/')) return;

    // Arquivos locais: Cache First
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Retorna do cache E atualiza em background
                    fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                caches.open(RUNTIME_CACHE).then((cache) => {
                                    cache.put(request, response);
                                });
                            }
                        })
                        .catch(() => { /* offline: ignora */ });
                    return cachedResponse;
                }

                // Não está no cache: busca na rede
                return fetch(request)
                    .then((response) => {
                        // Cacheia apenas respostas OK
                        if (!response || response.status !== 200 || response.type === 'opaque') {
                            return response;
                        }
                        const responseClone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    })
                    .catch(() => {
                        // Fallback offline
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
        );
        return;
    }

    // Requisições externas (CDN, fontes, etc): Network First
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response || response.status !== 200 || response.type === 'opaque') {
                    return response;
                }
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            })
            .catch(() => caches.match(request))
    );
});

/* ============================================
   MENSAGENS - permite forçar atualização
   ============================================ */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});