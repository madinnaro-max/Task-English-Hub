/* ==========================================================================
   Task&English Hub — service worker
   Rend l'application installable et utilisable hors ligne.
   - Page (index.html) : réseau d'abord, pour recevoir tout de suite vos mises à jour
     publiées sur GitHub ; copie locale si hors ligne ou si le réseau est trop lent.
   - Icônes / manifeste : copie locale d'abord, rafraîchie en arrière-plan.
   Les données (tâches, vocabulaire…) ne passent jamais par ici : elles restent dans
   le stockage local du navigateur.
   ========================================================================== */
'use strict';

const VERSION = '1.2.0';
const PREFIX = 'teh-';            // préfixe propre à cette appli (le domaine github.io peut héberger d'autres applis)
const CACHE = PREFIX + VERSION;
const SHELL = './index.html';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './maskable-192.png',
  './maskable-512.png',
  './apple-touch-icon.png',
];
const NET_TIMEOUT = 4000;         // au-delà, on sert la copie locale (réseau lent)

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Chaque fichier est mis en cache séparément : un fichier manquant ne bloque pas l'installation.
    await Promise.all(ASSETS.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Ne supprime QUE les anciennes versions de ce cache, jamais ceux des autres applis du domaine.
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(req.mode === 'navigate' ? page(event, url) : asset(event));
});

const isShell = url => url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(timer); resolve(v); }, e => { clearTimeout(timer); reject(e); });
  });
}

async function page(event, url) {
  const cache = await caches.open(CACHE);
  const key = isShell(url) ? SHELL : event.request;
  const network = fetch(event.request).then(res => {
    if (res && res.ok && res.type === 'basic') cache.put(key, res.clone());
    return res;
  });
  try {
    return await withTimeout(network, NET_TIMEOUT);
  } catch (err) {
    const hit = await cache.match(key, { ignoreSearch: true });
    if (hit) {
      event.waitUntil(network.catch(() => null));   // la version en ligne remplacera la copie pour la prochaine ouverture
      return hit;
    }
    return network;                                 // aucune copie locale : on attend le réseau
  }
}

async function asset(event) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(event.request, { ignoreSearch: true });
  const network = fetch(event.request).then(res => {
    if (res && res.ok && res.type === 'basic') cache.put(event.request, res.clone());
    return res;
  });
  if (hit) {
    event.waitUntil(network.catch(() => null));
    return hit;
  }
  return network;
}
