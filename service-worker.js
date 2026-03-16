const CACHE = 'auditor-v2'; // <-- sube el número cada vez que despliegues
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE).then(c => c.addAll(ASSETS))
    );
});

self.addEventListener('activate', e => {
    // Borrar cachés antiguas al activar
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE).map(k => caches.delete(k))
            )
        ).then(() => clients.claim())
    );
});

self.addEventListener('fetch', e => {
    const url = e.request.url;

    if (e.request.method !== 'GET') return;
    if (url.includes('/api/')) return;
    if (!url.includes(location.hostname)) return;

    e.respondWith(
        // Intentar red primero, caché como fallback
        fetch(e.request)
            .then(response => {
                const clone = response.clone();
                caches.open(CACHE).then(c => c.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});