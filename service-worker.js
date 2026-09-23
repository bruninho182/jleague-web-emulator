/* ============================================
   SERVICE WORKER - J.League WE 2000
   Versão resiliente: não falha se algum arquivo estiver ausente
   ============================================ */

const CACHE_NAME = 'we2000-v1.0.1';
const RUNTIME_CACHE = 'we2000-runtime-v1';

// Arquivos essenciais
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
    '/manifest.json',
];

/* ============================================
   INSTALAÇÃO - cacheia um por um (ignora erros)
   ============================================ */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log('[Service Worker] Pré-cacheando arquivos...');

            // Cacheia individualmente, ignorando arquivos que não existem
            const results = await Promise.allSettled(
                PRECACHE_URLS.map(async (url) => {
                    try {
                        const response = await fetch(url, { cache: 'no-cache' });
                        if (response.ok) {
                            await cache.put(url, response);
                            console.log(`[SW] ✓ Cacheado: ${url}`);
                        } else {
                            console.warn(`[SW] ✗ Ignorado (${response.status}): ${url}`);
                        }
                    } catch (err) {
                        console.warn(`[SW] ✗ Falha ao cachear ${url}:`, err.message);
                    }
                })
            );

            const ok = results.filter(r => r.status === 'fulfilled').length;
            console.log(`[Service Worker] ${ok}/${PRECACHE_URLS.length} arquivos cacheados.`);
        }).then(() => self.skipWaiting())
    );
});

/* ============================================
   ATIVAÇÃO
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
   ============================================ */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') return;

    // Não intercepta EmulatorJS nem APIs
    if (url.href.includes('emulatorjs.org') ||
        url.href.includes('lemon-web.net') ||
        url.pathname.startsWith('/api/')) {
        return;
    }

    // Arquivos locais: Cache First com atualização em background
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                caches.open(RUNTIME_CACHE).then((cache) => {
                                    cache.put(request, response);
                                });
                            }
                        })
                        .catch(() => { /* offline, ignora */ });
                    return cachedResponse;
                }

                return fetch(request)
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
                    .catch(() => {
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
        );
        return;
    }

    // Externos: Network First
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