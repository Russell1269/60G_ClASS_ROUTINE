// const cacheName = "static-cache-v5";

// self.addEventListener("install", (event) => {
//   console.log("SW installed");
//   self.skipWaiting(); // Skips waiting for the service worker to activate
//   event.waitUntil(precache());
// });

// self.addEventListener("activate", (event) => {
//   console.log("SW activated");
//   event.waitUntil(cleanupCache());
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((cachedResponse) => {
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       return fetch(event.request).catch(() => {
//         // fallback when nothing exists
//         return caches.match("/index.html");
//       });
//     }),
//   );
// });

// const staticAssets = [
//   "/",
//   "/data.js",
//   "/index.html",
//   "/script.js",
//   "/style.css"
// ];

// async function precache() {
//   const cache = await caches.open(cacheName);
//   return cache.addAll(staticAssets);
// }

// async function fetchAssets(event) {
//   try {
//     const response = await fetch(event.request);
//     return response;
//   } catch (error) {
//     const cache = await caches.open(cacheName);
//     return cache.match(event.request);
//   }
// }

// async function cleanupCache() {
//   const keys = await caches.keys();
//   return Promise.all(
//     keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)),
//   );
// }

const CACHE_NAME = "my-site-cache-v18";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./data.js",
  "./about.html",
  "./common.html",
  "./deadlines.html",
  "./exams.html",
  "./offdays.html",
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// FETCH (Cache First Strategy)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse;
        })
        .catch(() => {
          // If it's a page navigation, return index.html
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }

          // Otherwise return a basic empty response
          return new Response("", { status: 404 });
        });
    })
  );
});
