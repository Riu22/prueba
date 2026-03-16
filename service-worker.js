const CACHE = 'auditor-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // No interceptar: API, recursos externos (CDNs), o peticiones no-GET
  if (e.request.method !== 'GET') return;
  if (url.includes('/api/')) return;
  if (!url.includes(location.hostname)) return; // 👈 clave para el error CORS

  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});