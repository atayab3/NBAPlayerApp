//Followed Hayes Class Tutorial on 04/08/2020
//



var CACHE_NAME = 'nba-app-v2';
var urlsToCache = [
  './',
  './style.css',
   './ball.js',
	'./site.webmanifest',
	'https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css',
	'https://fonts.googleapis.com/css?family=Roboto Condensed|Josefin Sans|Cinzel Decorative|Source Code Pro|News Cycle'
	
//   './s.js'
];

self.addEventListener('install', (event)=> {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache)=> {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});



//fetch event handler
self.addEventListener('fetch', (event)=> {
  event.respondWith(
    caches.match(event.request)
      .then((response)=> {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response)=> {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            let responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache)=> {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['nba-app-v2',];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});





