import { useEffect, useState } from 'react';

/**
 * Chrome fires this when the app is genuinely installable. It is deliberately
 * absent from the DOM types, so it is declared here.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type WindowWithPrompt = Window & {
  __deferredInstallPrompt?: BeforeInstallPromptEvent | null;
};

const DISMISS_KEY = 'ielts-mock:install-banner-dismissed';

/** The event index.html captured before React mounted, if any. */
function capturedPrompt(): BeforeInstallPromptEvent | null {
  if (typeof window === 'undefined') return null;
  return (window as WindowWithPrompt).__deferredInstallPrompt ?? null;
}

/** True when the app is already running installed, so nothing should be shown. */
function isStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(display-mode: standalone)').matches;
}

function wasDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(DISMISS_KEY) === '1';
}

/**
 * A small "Install this app" bar for Android/desktop Chrome.
 *
 * Why this was rewritten
 * ----------------------
 * Two bugs stopped Android users installing the app:
 *
 *  1. The component was mounted inside <RequireAuth>, so it did not exist while
 *     the visitor was on the sign-in screen — which is exactly when Chrome
 *     fires `beforeinstallprompt`. The event was missed and never re-fired.
 *     It is now mounted at the top of the app, outside the auth gate.
 *
 *  2. `beforeinstallprompt` usually fires before React mounts. index.html now
 *     captures it into `window.__deferredInstallPrompt`, and this component
 *     reads that during its first render, so a late mount still sees it.
 *
 * If Chrome withholds the prompt entirely, Android users get short manual
 * instructions rather than a dead end. iPhone has no install API at all, so
 * Apple users still use Share → Add to Home Screen.
 */
export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(capturedPrompt);
  const [dismissed, setDismissed] = useState(wasDismissed);
  const [installed, setInstalled] = useState(isStandalone);
  const [manualHint, setManualHint] = useState(false);

  useEffect(() => {
    if (installed || dismissed) return;

    const use = (event: BeforeInstallPromptEvent) => setPromptEvent(event);

    // The page-level script captured the event before mount.
    const early = capturedPrompt();
    if (early) use(early);

    // It captured one later, and told us about it.
    const onAvailable = () => {
      const captured = capturedPrompt();
      if (captured) use(captured);
    };

    // It fired after we were already listening.
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      (window as WindowWithPrompt).__deferredInstallPrompt =
        event as BeforeInstallPromptEvent;
      use(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setManualHint(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('installpromptavailable', onAvailable);
    window.addEventListener('appinstalled', onInstalled);

    // Chrome sometimes never offers the prompt. On Android, fall back to
    // written instructions so there is always a route to the home screen.
    const isAndroid = /android/i.test(navigator.userAgent);
    const timer = window.setTimeout(() => {
      if (isAndroid && !capturedPrompt()) setManualHint(true);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('installpromptavailable', onAvailable);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [installed, dismissed]);

  const later = () => {
    setDismissed(true);
    setManualHint(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

  const install = async () => {
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'dismissed') later();
      else setPromptEvent(null);
    } catch {
      // The prompt is best-effort: never let it block the exam.
      later();
    }
  };

  // Installed already, or dismissed before: say nothing.
  if (installed || dismissed) return null;

  if (promptEvent) {
    return (
      <div className="install-bar" role="region" aria-label="Install this app">
        <span className="install-icon" aria-hidden>
          ⤓
        </span>
        <span className="install-text">
          <b>Install this app</b>
          <span className="tiny muted">Opens full-screen, no app store needed.</span>
        </span>
        <button type="button" className="btn btn-sm" onClick={install}>
          Install
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={later}
          aria-label="Not now"
        >
          Later
        </button>
      </div>
    );
  }

  if (manualHint) {
    return (
      <div className="install-bar" role="region" aria-label="Install this app">
        <span className="install-icon" aria-hidden>
          ⤓
        </span>
        <span className="install-text">
          <b>Add to home screen</b>
          <span className="tiny muted">
            Chrome menu ⋮ → <b>Add to Home screen</b>
          </span>
        </span>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={later}
          aria-label="Dismiss"
        >
          Got it
        </button>
      </div>
    );
  }

  return null;
}
