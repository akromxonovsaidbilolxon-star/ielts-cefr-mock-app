import { useCallback, useEffect, useRef, useState } from 'react';
import type { CambridgeAudio } from '../content/cambridge/types';
import { getSupabase, isConfigured } from '../lib/supabase';
import { PauseIcon, PlayIcon, StopIcon, SpeakerIcon } from './Icons';

/**
 * Plays a real Cambridge recording.
 *
 * Private Supabase Storage is preferred: the app requests a short-lived signed
 * URL and plays it through the same one-click audio control. Legacy Google
 * Drive links remain as a fallback while the owner moves the files over.
 *
 * Google serves files from multiple hosts, so the player tries each in turn.
 * If those fail too, it falls back to Drive's embedded player.
 */

const SOURCES = (id: string) => [
  `https://drive.usercontent.google.com/download?id=${id}&export=download`,
  `https://drive.google.com/uc?export=download&id=${id}`,
  `https://docs.google.com/uc?export=download&id=${id}`,
];

const PREVIEW = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

interface Props {
  audio: CambridgeAudio;
  /** Shown under the player if playback fails. */
  onUnavailable?: () => void;
  label?: string;
}

export default function CambridgeAudioPlayer({ audio, label }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rate, setRate] = useState(1);
  const [failed, setFailed] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
    setPlaying(false);
    setProgress(0);
    setDuration(null);
  }, [audio.driveId, audio.storagePath]);

  useEffect(() => {
    let cancelled = false;
    setSignedUrl(null);

    if (!audio.storagePath || !isConfigured) {
      return () => {
        cancelled = true;
      };
    }

    void getSupabase()
      .storage.from('cambridge-audio')
      .createSignedUrl(audio.storagePath, 4 * 60 * 60)
      .then(({ data, error }) => {
        if (!cancelled) setSignedUrl(error ? null : data?.signedUrl ?? null);
      })
      .catch(() => {
        if (!cancelled) setSignedUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [audio.storagePath]);

  const driveSources = audio.driveId ? SOURCES(audio.driveId) : [];
  const activeSource = signedUrl ?? driveSources[sourceIndex] ?? null;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => {
      if (el.duration > 0) setProgress((el.currentTime / el.duration) * 100);
    };
    const onMeta = () => setDuration(Number.isFinite(el.duration) ? el.duration : null);
    const onEnd = () => {
      setPlaying(false);
      setProgress(100);
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
    };
  }, [sourceIndex]);

  const handleError = useCallback(() => {
    setPlaying(false);

    // If private Storage failed, switch to the legacy Drive stream first.
    if (signedUrl) {
      setSignedUrl(null);
      setSourceIndex(0);
      return;
    }

    // Try Drive's alternate stream hosts before showing the embedded fallback.
    setSourceIndex((prev) => {
      const next = prev + 1;
      if (next >= driveSources.length) {
        setFailed(true);
        return prev;
      }
      return next;
    });
  }, [driveSources.length, signedUrl]);

  const toggle = useCallback(async () => {
    const el = audioRef.current;
    if (!el || !activeSource) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        handleError();
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  }, [activeSource, handleError]);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setProgress(0);
  }, []);

  const changeRate = useCallback((next: number) => {
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }, []);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = (Number(e.target.value) / 100) * el.duration;
  }, []);

  const [mm, ss] = duration ? formatClock(duration) : ['--', '--'];

  if (failed && audio.driveId) {
    return (
      <div className="audio-bar" aria-label="Remote audio player">
        <iframe
          src={PREVIEW(audio.driveId)}
          title={`${audio.filename} audio player`}
          style={{ width: '100%', height: 72, border: 0, borderRadius: 8 }}
          allow="autoplay; encrypted-media"
        />
      </div>
    );
  }

  if (failed) {
    return <div className="audio-bar tiny muted">Recording unavailable. Contact your teacher.</div>;
  }

  return (
    <div className="audio-bar">
      <audio
        ref={audioRef}
        src={activeSource ?? undefined}
        preload="metadata"
        onError={handleError}
      />

      <button
        type="button"
        className="play-btn"
        onClick={toggle}
        disabled={!activeSource}
        aria-label={playing ? 'Pause recording' : activeSource ? 'Play recording' : 'Preparing recording'}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button type="button" className="btn btn-ghost btn-sm" onClick={stop}>
        <StopIcon className="" />
        <span>Rewind</span>
      </button>

      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(progress)}
        onChange={seek}
        className="caudio-seek"
        aria-label="Seek within the recording"
      />

      <span className="tiny nowrap muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {mm}:{ss}
      </span>

      <span className="badge badge-ok">Real recording</span>

      <label className="row tiny" style={{ gap: '0.35rem' }}>
        <SpeakerIcon className="" />
        <select
          className="input"
          style={{ width: 'auto', padding: '0.28rem 0.45rem', fontSize: '0.8rem' }}
          value={rate}
          onChange={(e) => changeRate(Number(e.target.value))}
          aria-label="Playback speed"
        >
          <option value={0.9}>0.9×</option>
          <option value={1}>1×</option>
          <option value={1.1}>1.1×</option>
          <option value={1.25}>1.25×</option>
        </select>
      </label>

      {label && <span className="tiny faint">{label}</span>}
    </div>
  );
}

function formatClock(totalSeconds: number): [string, string] {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return [String(m).padStart(2, '0'), String(s).padStart(2, '0')];
}
