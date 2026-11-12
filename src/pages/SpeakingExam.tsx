import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPEAKING_PARTS } from '../content/speaking';
import { newAttempt, saveAttempt } from '../lib/storage';
import { formatClock } from '../hooks/useCountdown';
import { MicIcon, PlayIcon, StopIcon, ClockIcon } from '../components/Icons';

type Phase = 'idle' | 'prep' | 'speak' | 'done';

export default function SpeakingExam() {
  const navigate = useNavigate();
  const [partIndex, setPartIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(0);
  const [practised, setPractised] = useState<Set<string>>(new Set());
  const [selfBands, setSelfBands] = useState({ fluency: 6, lexical: 6, grammar: 6, pronunciation: 6 });
  const [saved, setSaved] = useState(false);

  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const part = SPEAKING_PARTS[partIndex];
  const question = part.questions[questionIndex];

  /* ---------------- countdown ---------------- */
  useEffect(() => {
    if (phase !== 'prep' && phase !== 'speak') return;
    const id = window.setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (seconds !== 0) return;
    if (phase === 'prep') {
      setPhase('speak');
      setSeconds(part.speakSeconds);
    } else if (phase === 'speak') {
      setPhase('done');
      setPractised((prev) => new Set(prev).add(question?.id ?? `${partIndex}`));
    }
  }, [seconds, phase, part.speakSeconds, question, partIndex]);

  const startPrep = useCallback(() => {
    if (part.prepSeconds > 0) {
      setPhase('prep');
      setSeconds(part.prepSeconds);
    } else {
      setPhase('speak');
      setSeconds(part.speakSeconds);
    }
  }, [part.prepSeconds, part.speakSeconds]);

  const stopTimer = useCallback(() => {
    setPhase('idle');
    setSeconds(0);
  }, []);

  /* ---------------- recording ---------------- */
  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }, []);

  const toggleRecording = useCallback(async () => {
    if (recording) {
      stopRecording();
      return;
    }
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError('Recording is not supported in this browser. You can still practise with timers.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecordingUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setMicError(
        'Microphone access was blocked. Allow it in your browser settings, or practise using the timers only.',
      );
    }
  }, [recording, stopRecording]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- submit ---------------- */
  const partBands = SPEAKING_PARTS.map((p) => p);

  function computeBand() {
    const { fluency, lexical, grammar, pronunciation } = selfBands;
    const mean = (fluency + lexical + grammar + pronunciation) / 4;
    return Math.round(mean * 2) / 2;
  }

  const submit = () => {
    if (saved) return;
    setSaved(true);
    const band = computeBand();
    saveAttempt(
      newAttempt({
        speaking: {
          band,
          detail: {
            fluency: selfBands.fluency,
            lexical: selfBands.lexical,
            grammar: selfBands.grammar,
            pronunciation: selfBands.pronunciation,
          },
          feedback: `Self-assessed after ${practised.size} of ${partBands.reduce(
            (n, p) => n + p.questions.length,
            0,
          )} questions.`,
        },
      }),
    );
    navigate('/results?skill=speaking');
  };

  const totalQuestions = SPEAKING_PARTS.reduce((n, p) => n + p.questions.length, 0);
  const timerMax = phase === 'prep' ? part.prepSeconds : part.speakSeconds;
  const pct = timerMax ? ((timerMax - seconds) / timerMax) * 100 : 0;
  const tone = phase === 'speak' && seconds <= 15 ? 'danger' : progressTone(pct);

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Speaking Test</h2>
          <p>
            3 parts · 11–14 minutes. Record yourself, then score your performance
            honestly against the band descriptors.
          </p>
        </div>
        <span className="badge badge-brand">Self-assessed</span>
      </div>

      <div className="exam">
        <div>
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {SPEAKING_PARTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`btn btn-sm ${i === partIndex ? '' : 'btn-ghost'}`}
                onClick={() => {
                  stopTimer();
                  setPartIndex(i);
                  setQuestionIndex(0);
                }}
              >
                Part {p.id}
              </button>
            ))}
          </div>

          <div className="callout callout-info" style={{ marginBottom: '1rem' }}>
            <b>{part.title}</b>
            <div style={{ marginTop: '0.2rem' }}>{part.description}</div>
          </div>

          {part.cueCard && (
            <div className="cue-card" style={{ marginBottom: '1rem' }}>
              <div className="cue-topic">{part.cueCard.topic}</div>
              <div className="small strong" style={{ marginBottom: '0.4rem' }}>
                You should say:
              </div>
              <ul className="cue-list">
                {part.cueCard.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="cue-final">{part.cueCard.finalLine}</div>
            </div>
          )}

          {/* timer / controls */}
          <div className="big-timer-wrap" style={{ marginBottom: '1rem' }}>
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)' }}>
              {phase === 'prep'
                ? 'Preparation time'
                : phase === 'speak'
                  ? 'Speaking time'
                  : phase === 'done'
                    ? 'Time is up'
                    : 'Ready'}
            </div>
            <div className={`big-timer ${tone}`}>
              {formatClock(phase === 'idle' ? (part.prepSeconds > 0 ? part.prepSeconds : part.speakSeconds) : seconds)}
            </div>
            <div className="progress-bar" style={{ width: '100%', maxWidth: 420 }}>
              <div
                className="progress-fill"
                style={{ width: `${phase === 'idle' ? 0 : pct}%` }}
              />
            </div>

            <div className="row wrap" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {phase === 'idle' && (
                <button type="button" className="btn btn-lg" onClick={startPrep}>
                  <ClockIcon className="" />
                  {part.prepSeconds > 0 ? 'Start 1-minute prep' : 'Start speaking'}
                </button>
              )}
              {(phase === 'prep' || phase === 'speak') && (
                <button type="button" className="btn btn-ghost" onClick={stopTimer}>
                  <StopIcon className="" />
                  Stop
                </button>
              )}
              {phase === 'done' && (
                <button type="button" className="btn" onClick={startPrep}>
                  <PlayIcon className="" />
                  Try again
                </button>
              )}
              <button
                type="button"
                className={`btn ${recording ? 'btn-danger' : 'btn-ghost'}`}
                onClick={toggleRecording}
              >
                <MicIcon className="" />
                {recording ? 'Stop recording' : 'Record answer'}
              </button>
            </div>

            {recordingUrl && (
              <div style={{ width: '100%', maxWidth: 460, marginTop: '0.6rem' }}>
                <div className="tiny faint" style={{ marginBottom: '0.3rem' }}>
                  Listen back — self-correction is the fastest way to improve.
                </div>
                <audio controls src={recordingUrl} style={{ width: '100%' }} />
              </div>
            )}
            {micError && (
              <div className="callout callout-warn small" style={{ marginTop: '0.6rem', width: '100%' }}>
                {micError}
              </div>
            )}
          </div>

          {/* questions */}
          <div className="stack stack-sm">
            {part.questions.map((q, i) => {
              const active = i === questionIndex;
              const done = practised.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`speak-question${active ? ' active' : ''}`}
                  onClick={() => {
                    setQuestionIndex(i);
                    stopTimer();
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setQuestionIndex(i);
                      stopTimer();
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="row-between">
                    <div className="small muted strong">Question {i + 1}</div>
                    {done && <span className="badge badge-ok">Practised</span>}
                    {active && !done && <span className="badge badge-brand">Current</span>}
                  </div>
                  <div style={{ marginTop: '0.25rem', fontSize: '0.98rem' }}>{q.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="exam-side">
          <div className="card card-pad">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.55rem' }}>
              Progress
            </div>
            <div className="row-between small">
              <span>Questions practised</span>
              <b>
                {practised.size} / {totalQuestions}
              </b>
            </div>
            <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
              <div
                className="progress-fill"
                style={{ width: `${(practised.size / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="card card-pad stack stack-sm">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)' }}>
              Self-assessment
            </div>
            <p className="tiny muted" style={{ margin: 0 }}>
              Rate yourself after practising all three parts. Be honest — an
              inflated score tells you nothing.
            </p>
            {(
              [
                ['fluency', 'Fluency & coherence'],
                ['lexical', 'Lexical resource'],
                ['grammar', 'Grammar range'],
                ['pronunciation', 'Pronunciation'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="stack stack-sm">
                <span className="row-between small">
                  <span>{label}</span>
                  <b>{selfBands[key].toFixed(1)}</b>
                </span>
                <input
                  type="range"
                  min={3}
                  max={9}
                  step={0.5}
                  value={selfBands[key]}
                  onChange={(e) =>
                    setSelfBands((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                  }
                  aria-label={label}
                  style={{ accentColor: 'var(--brand)' }}
                />
              </label>
            ))}
            <div className="divider" style={{ margin: '0.3rem 0' }} />
            <div className="row-between">
              <span className="small muted">Estimated band</span>
              <span className="strong" style={{ fontSize: '1.35rem' }}>
                {computeBand().toFixed(1)}
              </span>
            </div>
            <button type="button" className="btn btn-block" onClick={submit} disabled={saved}>
              Save speaking result
            </button>
          </div>

          <div className="callout callout-info small">
            <b>Tip:</b> 1–2 minutes for Part 2. If you finish early, the examiner
            will prompt you — keep talking and add a detail or an example.
          </div>
        </aside>
      </div>
    </>
  );
}

function progressTone(pct: number): string {
  if (pct > 80) return 'danger';
  if (pct > 60) return 'warn';
  return '';
}
