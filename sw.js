// const CACHE_NAME = "my-site-cache-v1";

// const FILES_TO_CACHE = [
//   "./",
//   "./index.html",
//   "./style.css",
//   "./script.js",
//   "./data.js",
//   "./about.html",
//   "./common.html",
//   "./deadlines.html",
//   "./exams.html",
//   "./offdays.html",
// ];

// // INSTALL
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(FILES_TO_CACHE);
//     }),
//   );
//   self.skipWaiting();
// });

// // ACTIVATE
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys.map((key) => {
//           if (key !== CACHE_NAME) {
//             return caches.delete(key);
//           }
//         }),
//       );
//     }),
//   );
//   self.clients.claim();
// });

// // FETCH (Cache First Strategy)
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       if (response) {
//         return response;
//       }

//       return fetch(event.request)
//         .then((networkResponse) => {
//           return networkResponse;
//         })
//         .catch(() => {
//           // If it's a page navigation, return index.html
//           if (event.request.mode === "navigate") {
//             return caches.match("./index.html");
//           }

//           // Otherwise return a basic empty response
//           return new Response("", { status: 404 });
//         });
//     })
//   );
// });
