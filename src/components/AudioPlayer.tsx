import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScriptLine } from '../types';
import { audioFor, hasRealAudio, type AudioKey } from '../lib/audioManifest';
import { assignVoices, waitForVoices, type VoiceAssignment } from '../lib/voices';
import { PauseIcon, PlayIcon, SpeakerIcon, StopIcon, VolumeOffIcon } from './Icons';

interface SpeechPlayerProps {
  lines: ScriptLine[];
  currentLine: number;
  playing: boolean;
  supported: boolean;
  rate: number;
  onRateChange: (rate: number) => void;
  onPlayPause: () => void;
  onStop: () => void;
  progress: number;
  /** When set and a real recording exists, the MP3 is played instead of TTS. */
  audioKey?: AudioKey;
  /** Voice quality, surfaced to the UI. */
  voiceQuality?: 'real' | 'neural' | 'premium' | 'standard' | 'fallback';
}

/**
 * Plays a listening part.
 *
 * Priority:
 *   1. A real recording, if one is registered for this part in the manifest.
 *   2. The best available natural voice from the browser (ranked, not random).
 *
 * The old implementation picked voices with `pool[hash % pool.length]`, which
 * regularly landed on eSpeak or "compact" voices — the robotic sound users
 * complained about. Voices are now ranked in `lib/voices.ts`.
 */
export function useSpeechScript(lines: ScriptLine[], audioKey?: AudioKey) {
  const [playing, setPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [supported, setSupported] = useState(false);
  const [rate, setRate] = useState(0.95);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceMap, setVoiceMap] = useState<Record<string, VoiceAssignment>>({});

  const rateRef = useRef(rate);
  const indexRef = useRef(-1);
  const cancelledRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  rateRef.current = rate;

  const realAudio = audioKey ? audioFor(audioKey) : undefined;
  const hasReal = audioKey ? hasRealAudio(audioKey) : false;

  /* ---------------- capability + voice loading ---------------- */
  useEffect(() => {
    setSupported(
      typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof window.SpeechSynthesisUtterance !== 'undefined',
    );
    let cancelled = false;
    void waitForVoices().then((list) => {
      if (!cancelled) setVoices(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- assign a voice per speaker ---------------- */
  useEffect(() => {
    if (voices.length === 0) return;
    const speakers = [...new Set(lines.map((l) => l.speaker))];
    setVoiceMap(assignVoices(voices, speakers));
  }, [voices, lines]);

  /* ---------------- real audio element ---------------- */
  useEffect(() => {
    if (!realAudio) return;
    const audio = new Audio(realAudio.src);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onEnd = () => {
      setPlaying(false);
      setCurrentLine(-1);
    };
    const onTime = () => {
      if (!audio.duration || !realAudio.timestamps?.length) return;
      const t = audio.currentTime;
      const idx = realAudio.timestamps.findIndex((stamp, i) => {
        const next = realAudio.timestamps![i + 1] ?? Infinity;
        return t >= stamp && t < next;
      });
      if (idx >= 0) setCurrentLine(idx);
    };

    audio.addEventListener('ended', onEnd);
    audio.addEventListener('timeupdate', onTime);
    return () => {
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('timeupdate', onTime);
      audio.pause();
      audioRef.current = null;
    };
  }, [realAudio]);

  /* ---------------- speech synthesis ---------------- */
  const speakFrom = useCallback(
    (startIndex: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      cancelledRef.current = false;

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
        const assignment = voiceMap[line.speaker];
        if (assignment?.voice) {
          utterance.voice = assignment.voice;
          utterance.lang = assignment.voice.lang;
        } else {
          utterance.lang = 'en-GB';
        }
        utterance.rate = rateRef.current;
        // Small pitch variation between two speakers makes a dialogue clearer.
        utterance.pitch = 1;
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
    [lines, voiceMap],
  );

  const playPause = useCallback(() => {
    // Real recording path
    if (hasReal && audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        void audio.play();
        setPlaying(true);
      } else {
        audio.pause();
        setPlaying(false);
      }
      return;
    }

    // Speech synthesis path
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (playing) {
      cancelledRef.current = true;
      window.speechSynthesis.cancel();
      setPlaying(false);
    } else {
      speakFrom(indexRef.current >= 0 ? indexRef.current : 0);
    }
  }, [hasReal, playing, speakFrom]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    setPlaying(false);
    setCurrentLine(-1);
    indexRef.current = -1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const changeRate = useCallback(
    (next: number) => {
      setRate(next);
      rateRef.current = next;
      if (audioRef.current) audioRef.current.playbackRate = next;
      if (playing && !hasReal) {
        // Speech synthesis needs a restart to apply a new rate.
        const at = indexRef.current;
        window.setTimeout(() => {
          if (playing) speakFrom(at);
        }, 0);
      }
    },
    [playing, speakFrom, hasReal],
  );

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Progress: real audio uses its own time; TTS uses line count.
  const [audioProgress, setAudioProgress] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration > 0) setAudioProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', onTime);
    return () => audio.removeEventListener('timeupdate', onTime);
  }, [realAudio]);

  const ttsProgress = lines.length ? ((currentLine + 1) / lines.length) * 100 : 0;

  const quality: SpeechPlayerProps['voiceQuality'] = hasReal
    ? 'real'
    : (() => {
        const anyAssignment = Object.values(voiceMap)[0];
        return anyAssignment?.quality ?? 'standard';
      })();

  const props: SpeechPlayerProps = {
    lines,
    currentLine,
    playing,
    supported: hasReal || supported,
    rate,
    onRateChange: changeRate,
    onPlayPause: playPause,
    onStop: stop,
    progress: hasReal ? audioProgress : playing || currentLine >= 0 ? ttsProgress : 0,
    audioKey,
    voiceQuality: quality,
  };

  return props;
}

const QUALITY_LABEL: Record<string, { text: string; tone: string }> = {
  real: { text: 'Recorded audio', tone: 'badge-ok' },
  neural: { text: 'Neural voice', tone: 'badge-ok' },
  premium: { text: 'Enhanced voice', tone: 'badge-brand' },
  standard: { text: 'Standard voice', tone: 'badge-warn' },
  fallback: { text: 'Basic voice', tone: 'badge-bad' },
};

export default function AudioPlayer({
  playing,
  supported,
  rate,
  onRateChange,
  onPlayPause,
  onStop,
  progress,
  voiceQuality = 'standard',
}: SpeechPlayerProps) {
  const quality = QUALITY_LABEL[voiceQuality] ?? QUALITY_LABEL.standard;

  if (!supported) {
    return (
      <div className="callout callout-warn">
        <div className="callout-title">Audio not available in this browser</div>
        Your browser does not support speech synthesis and no recording is
        available for this part. Open the transcript below to read it instead.
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

        <span className={`badge ${quality.tone}`}>{quality.text}</span>

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

      {(voiceQuality === 'standard' || voiceQuality === 'fallback') && (
        <div className="callout callout-warn small" style={{ marginTop: '0.6rem' }}>
          <b>This device only has a basic voice</b>, so the recording sounds
          synthetic. To hear a natural voice, open the app in{' '}
          <b>Chrome on Android</b>, <b>Microsoft Edge</b>, or <b>Safari on
          iPhone</b> — these ship with high-quality English voices.
        </div>
      )}
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
