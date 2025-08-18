// Service Worker for handling chunk loading errors and caching
const CACHE_NAME = 'vilandtravel-v1';
const CHUNK_CACHE_NAME = 'vilandtravel-chunks-v1';

// Files to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== CHUNK_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Handle JavaScript chunks with special retry logic
  if (url.pathname.includes('/_next/static/chunks/') || url.pathname.includes('.js')) {
    event.respondWith(handleChunkRequest(request));
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline');
        }
      })
  );
});

// Special handler for JavaScript chunks with retry logic
async function handleChunkRequest(request) {
  const chunkCache = await caches.open(CHUNK_CACHE_NAME);
  
  try {
    // Try to fetch from network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful response
      const responseToCache = response.clone();
      await chunkCache.put(request, responseToCache);
      return response;
    }
    
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.warn('Chunk fetch failed, trying cache:', request.url, error);
    
    // Try to get from cache
    const cachedResponse = await chunkCache.match(request);
    if (cachedResponse) {
      console.log('Serving chunk from cache:', request.url);
      return cachedResponse;
    }
    
    // If all fails, try to get a similar chunk or return error
    console.error('Chunk not available in cache either:', request.url);
    throw error;
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});
