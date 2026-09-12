const CACHE_NAME = 'bday-site-v4';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './lang.js',
  './jscp/settings.js',
  './jscp/visualizer.js',
  './jscp/3d_cake.js',
  './jscp/minigame.js',
  './jscp/ui.js',
  './image/logo.png',
  './music/aseel.mp3',
  './music/spiderAseel.mp3'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Remove any old cache versions so a code update actually reaches the phone
// instead of being shadowed by yesterday's cached ui.js/settings.js.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
