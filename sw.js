/* ============================================================
   Service worker : mode hors-ligne
   - Fichiers du site : réseau d'abord (toujours la dernière version
     quand on est en ligne), le cache sert de secours hors-ligne.
   - Police Google Fonts : cache d'abord, mise à jour en arrière-plan.

   Change le numéro de CACHE seulement si tu ajoutes, renommes ou
   supprimes un fichier de la liste ASSETS.
   ============================================================ */
const CACHE = 'verbes-v12';
const FONTS = 'verbes-fonts';
const NETWORK_TIMEOUT = 4000;   // en ms : au-delà, on utilise le cache s'il existe

const ASSETS = [
  './', './index.html', './style.css', './app.js', './verbs.js', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) event.respondWith(networkFirst(req));
  else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') event.respondWith(staleWhileRevalidate(req));
});

async function networkFirst(req){
  const cache = await caches.open(CACHE);
  const cached = (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? await cache.match('./index.html') : undefined);
  try {
    const network = fetch(req.url, { cache: 'no-cache' });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT));
    const res = await (cached ? Promise.race([network, timeout]) : network);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(req){
  const cache = await caches.open(FONTS);
  const hit = await cache.match(req);
  const network = fetch(req)
    .then(res => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; })
    .catch(() => hit);
  return hit || network;
}
