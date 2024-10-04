/**
 * Service Worker
 *
 * Provides offline fallback and caching.
 * We always try the cache first, then the network. Fresh responses are cached asynchronously.
 */
const version = "V0.21";
const staticCacheName = `${version}::static`;

// Install
addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      return staticCache
        .addAll(["/", "/cv", "/offline", "/images/harmen.jpeg"])
        .catch((error) => {
          console.error("Failed to cache static assets:", error);
          throw error;
        });
    }),
  );
});

// Fetch
addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  if (request.url.startsWith("http://localhost")) {
    console.log("Skip fetch for localhost");
    return;
  }
  const url = new URL(request.url);
  console.log("Fetching: " + url);

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
          fetch(request)
            .then((responseFromFetch) =>
              caches.open(staticCacheName).then((cache) => {
                console.log(
                  "Fetched fresh response in the background, updating cache.",
                );
                cache.put(request, responseFromFetch);
              }),
            )
            .catch(() => {
              console.log(
                "Unable to fetch fresh response, not updating cache.",
              );
            }),
        );
        console.log("Found cached response, return response from cache.");
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
              .then((cache) => cache.put(request, clonedResponse)),
          );
          console.log("Fetch succeeded, return response from fetch.");
          return responseFromFetch;
        })
        .catch(() => {
          console.log("Fetch failed, attempt to return offline page.");
          // Offline!
          if (request.headers.get("Accept").includes("text/html")) {
            return caches.match("/offline");
          }
          // Return regular 404 response.
          return new Response(null, {
            status: 404,
            statusText: "Not found",
          });
        });
    }),
  );
});
