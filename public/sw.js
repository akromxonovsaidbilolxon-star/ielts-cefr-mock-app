/*
 * Service worker for the IELTS / CEFR mock exam.
 *
 * Two jobs:
 *   1. Make the app installable. Chrome (Android and desktop) refuses to offer
 *      "Install app" unless a service worker with a fetch handler is
 *      registered — even when the app works fine online. That missing worker
 *      was the reason Android users could not install the app.
 *   2. Keep the exam usable on a weak or dropped connection.
 *
 * Caching rules, chosen so a deploy can never leave a stale exam behind:
 *   - Navigations and the HTML shell: network first, cache only as a fallback.
 *     A new deploy is therefore picked up on the next online load.
 *   - Built assets (hashed filenames like index-CaNDG8G-.js): cache first.
 *     The hash changes with the content, so a cached copy is always the right
 *     copy for that filename.
 *   - Everything cross-origin (Supabase, Google Drive audio): untouched.
 *
 * CACHE_VERSION must be bumped whenever the caching rules below change, and
 * whenever the app stops shipping content that was previously cached. It was
 * moved to v2 when Cambridge book text left the bundle: an installed app must
 * not keep serving the old, content-bearing JavaScript from cache. It does
 * NOT need bumping for normal deploys, because asset filenames are hashed.
 */

const CACHE_VERSION = 'v2';
const CACHE_PREFIX = 'ielts-mock';
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${CACHE_VERSION}`;
const SHELL_CACHE = `${CACHE_PREFIX}-shell-${CACHE_VERSION}`;

/** Kept small and dependency-free: only what is needed to open the app. */
const SHELL_URLS = ['./', './index.html', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individual failures must not abort the install — a missing manifest
      // should never be the reason the worker never activates.
      await Promise.allSettled(SHELL_URLS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop caches from any previous version.
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith(`${CACHE_PREFIX}-`) && !key.endsWith(CACHE_VERSION))
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only GETs are cacheable, and cross-origin requests are left alone: the
  // recordings and the sign-in API must always go straight to the network.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // A page load, and the shell files themselves: network first so a deploy
  // lands immediately, cache as an offline fallback.
  const isShell =
    request.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('manifest.webmanifest');

  if (isShell) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  // Hashed build output and static images: cache first, refresh in background.
  event.respondWith(cacheFirst(request, ASSET_CACHE));
});

/**
 * Try the network, fall back to the cache, then to the cached shell so a deep
 * link still opens offline.
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = await cache.match('./index.html');
      if (shell) return shell;
    }
    return new Response('You are offline and this page is not cached yet.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/** Serve from cache when possible; otherwise fetch and store a copy. */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Opaque and error responses are not worth storing.
    if (response && response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 504 });
  }
}
