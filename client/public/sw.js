self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('static')
      .then(cache => {
        cache.addAll([
          '/',
          '/index.html',
          '/js/app.js',
          '/js/jquery.min.js',
          '/js/popper.min.js',
          '/js/bootstrap.min.js',
          '/css/bootstrap.css',
          '/img/hamburger.svg',
          'https://use.fontawesome.com/releases/v5.7.0/css/all.css'
        ]);
      })
  );
});


self.addEventListener('activate', function (event) {
  return self.clients.claim();
});


// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(res => {
//               return caches.open('dynamic')
//                 .then(cache => {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             });
//         }
//       })
//   );
// });