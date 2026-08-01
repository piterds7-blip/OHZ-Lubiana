/* OHZ Lubiana — Żywienie | service worker */
const WERSJA = 'ohz-lubiana-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './ikony/ikona-192.png',
  './ikony/ikona-512.png',
  './ikony/ikona-192-maskable.png',
  './ikony/ikona-512-maskable.png',
  './ikony/apple-touch-icon.png',
  './ikony/favicon-64.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(WERSJA)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== WERSJA).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Ruch do Firestore/Google API — zawsze sieć, nigdy cache (SDK ma własny cache offline)
  if (/googleapis\.com|firebaseio\.com|firebaseinstallations|identitytoolkit/.test(url.hostname)) return;

  // Firebase SDK z gstatic — cache first (żeby aplikacja wstała offline)
  if (url.hostname === 'www.gstatic.com') {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const kopia = res.clone();
        caches.open(WERSJA).then(c => c.put(req, kopia));
        return res;
      }))
    );
    return;
  }

  // Własne zasoby — sieć, w razie porażki cache
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const kopia = res.clone();
        caches.open(WERSJA).then(c => c.put(req, kopia));
      }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
