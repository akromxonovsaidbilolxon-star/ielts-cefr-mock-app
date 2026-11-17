import { useEffect, useState } from 'react';

/**
 * Chrome fires this when the app is genuinely installable. It is deliberately
 * absent from the DOM types, so it is declared here.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'ielts-mock:install-banner-dismissed';

/**
 * A small "Install this app" bar for Android/desktop Chrome.
 *
 * Before this existed the only way in was Chrome's ⋮ menu, which most students
 * never find. The browser only fires `beforeinstallprompt` once the app is
 * genuinely installable (HTTPS + manifest + service worker with a fetch
 * handler), so if this bar never appears, installation is not available yet.
 *
 * iPhone cannot show a prompt: iOS has no such API, so Apple users still use
 * Share → Add to Home Screen. The banner is therefore Android/desktop only.
 */
export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed, or the user dismissed it before: say nothing.
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const onBeforeInstall = (event: Event) => {
      // Chrome's own mini-infobar is worse than this bar; take it over.
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    const onInstalled = () => {
      setVisible(false);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (!visible || !promptEvent) return null;

  const install = async () => {
    // The event can only be used once; hide the bar either way.
    setVisible(false);
    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === 'dismissed') {
        localStorage.setItem(DISMISS_KEY, '1');
      }
    } catch {
      /* The prompt is best-effort: never let it block the exam. */
    }
    setPromptEvent(null);
  };

  const later = () => {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, '1');
  };

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
      <button type="button" className="btn btn-sm btn-ghost" onClick={later} aria-label="Not now">
        Later
      </button>
    </div>
  );
}
