/**
 * Registers the service worker that makes the app installable.
 *
 * Chrome on Android will not offer "Install app" (and will not fire
 * `beforeinstallprompt`) unless the page registers a service worker that has a
 * fetch handler. Without this file the app worked perfectly in a browser tab
 * but could not be installed — which is exactly what Android users reported.
 *
 * Notes:
 *  - Only in a production build. During `npm run dev` a worker would sit in
 *    front of Vite's hot reload and serve stale files.
 *  - The scope is the app's base path (`base: './'`), so the same code works at
 *    the site root and under /ielts-cefr-mock-app/ on GitHub Pages.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    // Resolve against the document so the path is correct under any base path.
    const swUrl = new URL('sw.js', document.baseURI).href;
    const scope = new URL('./', document.baseURI).href;

    navigator.serviceWorker.register(swUrl, { scope }).catch((error) => {
      // An install failure must never break the exam itself.
      console.warn('Service worker registration failed:', error);
    });
  });
}
