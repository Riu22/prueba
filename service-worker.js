const CACHE = 'auditor-v1';
const ASSETS = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  // Las llamadas a la API nunca se cachean
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});