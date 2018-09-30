/**
 * Service Worker V0.01
 *
 * Provide some simple offline handling and caching.
 *
 * HTML files: try the network first, then the cache.
 * Other files: try the cache first, then the network.
 * Both: cache a fresh version if possible.
 *
 * Adapted from Adactio: https://gist.github.com/adactio/3717b7da007a9363ddf21f584aae34af
 */
const version = 'V0.02';
const staticCacheName = 'static';

// Install
//addEventListener('install', installEvent => {
  //installEvent.waitUntil(
    //caches.open(staticCacheName)
      //.then(staticCache => {
        //return staticCache.addAll([
          //'/css/styles.css',
          //'/js/main.js',
          ////'/offline'
        //]);
      //})
  //);
//});

// Fetch
addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  if (request.method !== 'GET') {
    return;
  }
  const url = new URL(request.url);
  if (url.origin !== location.origin) {
      return;
  }
  fetchEvent.respondWith(async function() {
    const fetchPromise = fetch(request);
    fetchEvent.waitUntil(async function() {
      const responseFromFetch = await fetchPromise;
      const responseCopy = responseFromFetch.clone();
      const myCache = await caches.open(staticCacheName);
      return myCache.put(request, responseCopy);
    }());
    if (request.headers.get('Accept').includes('text/html')) {
      try {
        return fetchPromise;
      }
      catch(error) {
        return caches.match(request) || caches.match('/offline');
      }
    } else {
      const responseFromCache = await caches.match(request);
      return responseFromCache || fetchPromise;
    }
  }());
});
