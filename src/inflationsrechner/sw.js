self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('inflationsrechner-v08').then(function(cache) {
     return cache.addAll([
       '/inflationsrechner/EN/index.html',
       '/inflationsrechner/EN/js/vendor/destatis_theme_en.min.js',
       '/inflationsrechner/EN/js/app.min.js',
       '/inflationsrechner/',
       '/inflationsrechner/index.html',
       '/inflationsrechner/js/vendor/jquery.min.js',
       '/inflationsrechner/js/vendor/what-input.min.js',
       '/inflationsrechner/js/vendor/foundation.min.js',
       '/inflationsrechner/js/vendor/highcharts.js',
       '/inflationsrechner/js/vendor/modules/series-label.js',
       '/inflationsrechner/js/vendor/modules/data.js',
       '/inflationsrechner/js/vendor/modules/exporting.js',
       '/inflationsrechner/js/vendor/modules/export-data.js',
       '/inflationsrechner/js/vendor/modules/accessibility.js',
       '/inflationsrechner/js/vendor/modules/offline-exporting.js',
       '/inflationsrechner/js/vendor/destatis_theme.min.js',
       '/inflationsrechner/js/app.min.js',
       '/inflationsrechner/browserconfig.xml',
       '/inflationsrechner/site.webmanifest',
       '/inflationsrechner/css/app.min.css',
       '/inflationsrechner/data/inflationsrechner.csv',
       '/inflationsrechner/fonts/StatisSans-Bold.woff2',
       '/inflationsrechner/fonts/StatisSans-Regular.woff2',
       '/inflationsrechner/img/thumbnail.jpg',
       '/inflationsrechner/img/android-chrome-192x192.png',
       '/inflationsrechner/img/android-chrome-512x512.png',
       '/inflationsrechner/img/apple-touch-icon.png',
       '/inflationsrechner/img/favicon-16x16.png',
       '/inflationsrechner/img/favicon-32x32.png',
       '/inflationsrechner/img/mstile-150x150.png',
       '/inflationsrechner/img/favicon.svg',
       '/inflationsrechner/img/favicon.ico',
       '/inflationsrechner/img/safari-pinned-tab.svg',
     ]);
   })
 );
});

self.addEventListener('activate', function(event) {
  
  var cacheKeeplist = ['inflationsrechner-v08'];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {

 event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request).then((response) => {
        return caches.open('inflationsrechner-v08').then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});
