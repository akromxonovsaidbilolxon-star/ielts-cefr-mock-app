import { useCallback, useEffect, useRef, useState } from 'react';
import type { CambridgeAudio } from '../content/cambridge/types';
import { PauseIcon, PlayIcon, StopIcon, SpeakerIcon } from './Icons';

/**
 * Plays a real Cambridge recording.
 *
 * The files live in the owner's Google Drive, not in this repository: a
 * Cambridge book is copyright material and 16 MP3s per book would bloat the
 * repo past what GitHub Pages serves comfortably. Each file is shared
 * "anyone with the link", so the browser can stream it directly.
 *
 * Google serves the same file from several hosts and changes which ones work
 * without notice, so the player tries each in turn and only gives up after all
 * of them fail. If none work, it offers the Drive preview and a download link
 * rather than showing a silently broken play button.
 */

const SOURCES = (id: string) => [
  `https://drive.usercontent.google.com/download?id=${id}&export=download`,
  `https://drive.google.com/uc?export=download&id=${id}`,
  `https://docs.google.com/uc?export=download&id=${id}`,
];

const PREVIEW = (id: string) => `https://drive.google.com/file/d/${id}/preview`;
const VIEW = (id: string) => `https://drive.google.com/file/d/${id}/view`;

interface Props {
  audio: CambridgeAudio;
  /** Shown under the player if playback fails. */
  onUnavailable?: () => void;
  label?: string;
}

export default function CambridgeAudioPlayer({ audio, label }: Props) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rate, setRate] = useState(1);
  const [failed, setFailed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
    setPlaying(false);
    setProgress(0);
    setDuration(null);
    setShowPreview(false);
  }, [audio.driveId]);

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
    // Try the next Drive host before declaring the recording unavailable.
    setSourceIndex((prev) => {
      const next = prev + 1;
      if (next >= SOURCES(audio.driveId).length) {
        setFailed(true);
        return prev;
      }
      return next;
    });
    setPlaying(false);
  }, [audio.driveId]);

  const toggle = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
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
  }, [handleError]);

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

  if (failed) {
    return (
      <div className="callout callout-warn" style={{ marginTop: '0.6rem' }}>
        <div className="callout-title">The recording did not load</div>
        <p style={{ margin: '0.35rem 0 0.6rem' }}>
          <b>{audio.filename}</b> is stored in your Google Drive. The browser could not stream it
          — usually because the file is no longer shared with "anyone with the link", or Drive is
          blocked on this network.
        </p>
        <div className="row wrap" style={{ gap: '0.5rem' }}>
          <button type="button" className="btn btn-sm" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? 'Hide Drive preview' : 'Try the Drive preview'}
          </button>
          <a
            className="btn btn-ghost btn-sm"
            href={VIEW(audio.driveId)}
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Drive ↗
          </a>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setSourceIndex(0);
              setFailed(false);
            }}
          >
            Retry
          </button>
        </div>
        {showPreview && (
          <iframe
            src={PREVIEW(audio.driveId)}
            title={`${audio.filename} preview`}
            style={{ width: '100%', height: 92, border: '1px solid var(--border)', borderRadius: 8, marginTop: '0.6rem' }}
            allow="autoplay"
          />
        )}
        <p className="tiny muted" style={{ marginTop: '0.6rem' }}>
          Teacher fix: in Drive, right-click the file → Share → General access →{' '}
          <b>Anyone with the link</b>. Then reload this page.
        </p>
      </div>
    );
  }

  return (
    <div className="audio-bar">
      <audio
        ref={audioRef}
        src={SOURCES(audio.driveId)[sourceIndex]}
        preload="metadata"
        onError={handleError}
      />

      <button
        type="button"
        className="play-btn"
        onClick={toggle}
        aria-label={playing ? 'Pause recording' : 'Play recording'}
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
