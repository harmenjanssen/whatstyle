/**
 * Service Worker
 *
 * Provides offline fallback and caching.
 * We always try the cache first, then the network. Fresh responses are cached asynchronously.
 */
const version = "V0.13";
const staticCacheName = `${version}::static`;

// Install
addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      return staticCache.addAll([
        "/",
        "/offline",
        //"/css/styles.css",
        //"/js/main.js",
      ]);
    })
  );
});

// Fetch
addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  const url = new URL(request.url);
  console.log("fetching " + url);

  if (request.method !== "GET" || url.origin !== location.origin) {
    // Skip any POST requests, or requests to other domains.
    return;
  }
  fetchEvent.respondWith(
    // Check the cache first.
    caches.match(request).then((responseFromCache) => {
      if (responseFromCache) {
        // Store the fresh version in the cache asynchronously.
        fetchEvent.waitUntil(
          fetch(request).then((responseFromFetch) =>
            caches
              .open(staticCacheName)
              .then((cache) => cache.put(request, responseFromFetch))
          )
        );
        return responseFromCache;
      }
      // Check the network.
      return fetch(request)
        .then((responseFromFetch) => {
          const clonedResponse = responseFromFetch.clone();
          // Store the fresh version in the cache asynchronously.
          fetchEvent.waitUntil(
            caches
              .open(staticCacheName)
              .then((cache) => cache.put(request, clonedResponse))
          );
          return responseFromFetch;
        })
        .catch(() => {
          // Offline!
          if (request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline/");
          }
        });
    })
  );
});
