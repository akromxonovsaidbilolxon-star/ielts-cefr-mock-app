import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Countdown timer in seconds. Uses wall-clock time so throttled background
 * tabs cannot drift, and only counts down while `running` is true.
 */
export function useCountdown(totalSeconds: number, running: boolean) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [exhausted, setExhausted] = useState(false);
  const deadlineRef = useRef<number | null>(null);
  const remainingRef = useRef(totalSeconds);

  remainingRef.current = remaining;

  useEffect(() => {
    if (!running) {
      deadlineRef.current = null;
      return;
    }
    deadlineRef.current = Date.now() + remainingRef.current * 1000;

    const tick = () => {
      if (deadlineRef.current === null) return;
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setRemaining((prev) => (prev === left ? prev : left));
      if (left <= 0) {
        setExhausted(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const reset = useCallback((seconds: number) => {
    setRemaining(seconds);
    setExhausted(false);
    deadlineRef.current = Date.now() + seconds * 1000;
  }, []);

  return { remaining, exhausted, reset, setRemaining };
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** mm:ss for timers longer than an hour would need h:mm:ss. */
export function formatLongClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function timerToneClass(remaining: number, total: number): string {
  if (remaining <= 60) return 'danger';
  if (remaining <= total * 0.2) return 'warn';
  return '';
}
