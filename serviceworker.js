
// // service worker 
// // https://developers.google.com/web/fundamentals/primers/service-workers

// //Cacheing assets on install 

// var CACHE_NAME = 'StatsApp-v1';
// var urlsToCache = [
//   './',
//   './style.css',
//   './ball.js',
//   'https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css',
// 'https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js'
// // 	'https://www.gstatic.com/charts/loader.js'
// ];

// self.addEventListener('install', (event)=> {
//   // Perform install steps
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache)=> {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
// });


// //on subsequent laods of the app, want to serve those assets from the cache
// //intercept fetch request from page
// self.addEventListener('fetch', (event)=> {
//   event.respondWith(
// 	  //look in cache to see if we've already stored that
//     caches.match(event.request)
//       .then((response)=> {
//         // Cache hit - return response
//         if (response) {
//           return response;
//         }

//         return fetch(event.request)
// 			.then((response)=> {
//             // Check if we received a valid response
//             if(!response || response.status !== 200 || response.type !== 'basic') {
//               return response;
//             }

//             // IMPORTANT: Clone the response. A response is a stream
//             // and because we want the browser to consume the response
//             // as well as the cache consuming the response, we need
//             // to clone it so we have two streams.
//             let responseToCache = response.clone();

//             caches.open(CACHE_NAME)
//               .then((cache)=> {
//                 cache.put(event.request, responseToCache);
//               });

//             return response;
//           }
//         );
//       })
//     );
// });



// self.addEventListener('activate', (event)=> {

//   var cacheWhitelist = ['StatsApp-v1'];

//   event.waitUntil(
//     caches.keys().then((cacheNames)=> {
//       return Promise.all(
//         cacheNames.map((cacheName)=> {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });