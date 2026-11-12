import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScriptLine } from '../types';
import { PauseIcon, PlayIcon, SpeakerIcon, StopIcon, VolumeOffIcon } from './Icons';

interface SpeechPlayerProps {
  lines: ScriptLine[];
  /** 0-based index of the line currently being spoken */
  currentLine: number;
  playing: boolean;
  supported: boolean;
  rate: number;
  onRateChange: (rate: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  progress: number;
}

/** Which index the synthesiser is on, tracked outside React for pause/resume. */
export function useSpeechScript(lines: ScriptLine[]) {
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [supported, setSupported] = useState(false);
  const [rate, setRate] = useState(0.95);
  const rateRef = useRef(rate);
  const indexRef = useRef(-1);
  const cancelledRef = useRef(false);
  const rateChangeHandler = useRef(false);

  rateRef.current = rate;

  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof window.SpeechSynthesisUtterance !== 'undefined',
    );
  }, []);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    setPlaying(false);
    setCurrentLine(-1);
    indexRef.current = -1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakFrom = useCallback(
    (startIndex: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      cancelledRef.current = false;

      const voices = window.speechSynthesis.getVoices();
      const pickVoice = (speaker: string) => {
        if (!voices.length) return undefined;
        const english = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
        const pool = english.length ? english : voices;
        // Stable per-speaker voice assignment
        const hash = [...speaker].reduce((a, c) => a + c.charCodeAt(0), 0);
        return pool[hash % pool.length];
      };

      const speakAt = (i: number) => {
        if (cancelledRef.current || i >= lines.length) {
          if (!cancelledRef.current) {
            setPlaying(false);
            setCurrentLine(-1);
            indexRef.current = -1;
          }
          return;
        }
        indexRef.current = i;
        setCurrentLine(i);
        const line = lines[i];
        const utterance = new SpeechSynthesisUtterance(line.text);
        const voice = pickVoice(line.speaker);
        if (voice) utterance.voice = voice;
        utterance.rate = rateRef.current;
        utterance.pitch = 1;
        utterance.lang = voice?.lang ?? 'en-GB';
        utterance.onend = () => {
          if (!cancelledRef.current) speakAt(i + 1);
        };
        utterance.onerror = () => {
          if (!cancelledRef.current) speakAt(i + 1);
        };
        window.speechSynthesis.speak(utterance);
      };

      setPlaying(true);
      speakAt(Math.max(0, startIndex));
    },
    [lines],
  );

  const playPause = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playing) {
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      speakFrom(indexRef.current >= 0 ? indexRef.current : 0);
    }
  }, [playing, speakFrom]);

  // Changing rate mid-playback restarts from the current line.
  const changeRate = useCallback(
    (next: number) => {
      setRate(next);
      rateRef.current = next;
      if (playing && !rateChangeHandler.current) {
        rateChangeHandler.current = true;
        const at = indexRef.current;
        window.setTimeout(() => {
          rateChangeHandler.current = false;
          if (playing) speakFrom(at);
        }, 0);
      }
    },
    [playing, speakFrom],
  );

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const progress = lines.length ? ((currentLine + 1) / lines.length) * 100 : 0;

  const props: SpeechPlayerProps = {
    lines,
    currentLine,
    playing,
    supported,
    rate,
    onRateChange: changeRate,
    onPlayPause: playPause,
    onStop: stop,
    progress: playing || currentLine >= 0 ? progress : 0,
  };

  return props;
}

export default function AudioPlayer({
  currentLine,
  playing,
  supported,
  rate,
  onRateChange,
  onPlayPause,
  onStop,
  progress,
  lines,
}: SpeechPlayerProps) {
  if (!supported) {
    return (
      <div className="callout callout-warn">
        <div className="callout-title">Audio not available in this browser</div>
        Your browser does not support speech synthesis. Open the transcript below
        to read the recording instead — you can still answer every question.
      </div>
    );
  }

  return (
    <>
      <div className="audio-bar">
        <button
          type="button"
          className="play-btn"
          onClick={onPlayPause}
          aria-label={playing ? 'Pause recording' : 'Play recording'}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onStop}
          aria-label="Stop and rewind recording"
        >
          <StopIcon className="" />
          <span>Rewind</span>
        </button>

        <div className="audio-progress" aria-hidden>
          <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <span className="tiny faint nowrap">
          {currentLine >= 0 ? `Line ${currentLine + 1} / ${lines.length}` : `${lines.length} lines`}
        </span>

        <label className="row tiny" style={{ gap: '0.35rem' }}>
          <SpeakerIcon className="" />
          <select
            className="input"
            style={{ width: 'auto', padding: '0.28rem 0.45rem', fontSize: '0.8rem' }}
            value={rate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            aria-label="Playback speed"
          >
            <option value={0.75}>0.75×</option>
            <option value={0.9}>0.9×</option>
            <option value={0.95}>1×</option>
            <option value={1.1}>1.1×</option>
          </select>
        </label>
      </div>
    </>
  );
}

export function Transcript({ lines, currentLine }: { lines: ScriptLine[]; currentLine: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card card-pad" style={{ marginTop: '0.85rem' }}>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? <VolumeOffIcon className="" /> : <SpeakerIcon className="" />}
        {open ? 'Hide transcript' : 'Show transcript (practice mode)'}
      </button>
      {open && (
        <>
          <div className="callout callout-warn" style={{ marginTop: '0.75rem' }}>
            Reading the transcript while you answer is <b>not</b> exam conditions —
            use it to check your answers or to study after the test.
          </div>
          <div className="transcript" style={{ marginTop: '0.75rem' }}>
            {lines.map((line, i) => (
              <div
                key={i}
                className={`transcript-line${i === currentLine ? ' transcript-current' : ''}`}
              >
                <div className="transcript-speaker">{line.speaker}</div>
                <div>{line.text}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
