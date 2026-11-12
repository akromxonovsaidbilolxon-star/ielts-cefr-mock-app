import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ML_SPEAKING_STAGES } from '../content/multilevel/speaking';
import type { MlSpeakingStage } from '../content/multilevel/types';
import { combineSpeakingScores, SPEAKING_WEIGHTS } from '../lib/multilevel';
import { newMlAttempt, saveMlAttempt } from '../lib/mlStorage';
import { formatClock } from '../hooks/useCountdown';
import { ContextPicture, PicturePair } from '../components/MlIllustrations';
import { CheckIcon, ClockIcon, MicIcon, PlayIcon, StopIcon } from '../components/Icons';

type Phase = 'idle' | 'prep' | 'record' | 'done';

export default function MlSpeaking() {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(0);
  const [recorded, setRecorded] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);

  const [recording, setRecording] = useState(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stage: MlSpeakingStage = ML_SPEAKING_STAGES[stageIndex];
  const question = stage.questions[questionIndex];

  const totalWindows = useMemo(
    () => ML_SPEAKING_STAGES.reduce((n, s) => n + s.questions.length, 0),
    [],
  );

  /* ---------------- countdown ---------------- */
  useEffect(() => {
    if (phase !== 'prep' && phase !== 'record') return;
    const id = window.setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (seconds !== 0) return;
    if (phase === 'prep') {
      setPhase('record');
      setSeconds(question.seconds);
    } else if (phase === 'record') {
      setPhase('done');
      setRecorded((prev) => new Set(prev).add(question.id));
    }
  }, [seconds, phase, question]);

  const startStage = useCallback(() => {
    setPhase(stage.prepSeconds > 0 ? 'prep' : 'record');
    setSeconds(stage.prepSeconds > 0 ? stage.prepSeconds : stage.questions[0].seconds);
  }, [stage]);

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
      setMicError('Recording is not supported in this browser. Practise with the timers instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        setLastUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setMicError(
        'Microphone access was blocked. Allow it in your browser settings, or practise with the timers only.',
      );
    }
  }, [recording, stopRecording]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      if (lastUrl) URL.revokeObjectURL(lastUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- progress ---------------- */
  const nextQuestion = () => {
    stopTimer();
    if (questionIndex + 1 < stage.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else if (stageIndex + 1 < ML_SPEAKING_STAGES.length) {
      setStageIndex(stageIndex + 1);
      setQuestionIndex(0);
    }
  };

  const submit = () => {
    if (saved) return;
    setSaved(true);
    const stageScores: Record<string, number> = {};
    for (const s of ML_SPEAKING_STAGES) {
      // Each stage is self-rated 0-75 for simplicity of the practice estimate.
      stageScores[s.id] = ratings[s.id] ?? 0;
    }
    const sectionScore = combineSpeakingScores(
      stageScores as Partial<Record<keyof typeof SPEAKING_WEIGHTS, number>>,
    );
    saveMlAttempt(
      newMlAttempt({ speaking: { score: sectionScore, level: null } }),
    );
    navigate('/multilevel/results?section=speaking');
  };

  const timerMax =
    phase === 'prep' ? stage.prepSeconds : question?.seconds ?? 0;
  const pct = timerMax ? ((timerMax - seconds) / timerMax) * 100 : 0;
  const tone = phase === 'record' && seconds <= 10 ? 'danger' : '';

  return (
    <>
      <div className="part-hero">
        <div>
          <h2>Multilevel Speaking</h2>
          <p>
            4 stages · 8 recording windows · about 15 minutes. You record each
            answer separately, then rate yourself against the criteria.
          </p>
        </div>
        <span className="badge badge-brand">Self-assessed</span>
      </div>

      <div className="exam">
        <div>
          {/* stage tabs */}
          <div className="row wrap" style={{ marginBottom: '0.9rem' }}>
            {ML_SPEAKING_STAGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`btn btn-sm ${i === stageIndex ? '' : 'btn-ghost'}`}
                onClick={() => {
                  stopTimer();
                  setStageIndex(i);
                  setQuestionIndex(0);
                }}
              >
                Part {s.stage}
                <span className="tiny" style={{ opacity: 0.75 }}>
                  {s.level}
                </span>
              </button>
            ))}
          </div>

          <div className="callout callout-info" style={{ marginBottom: '1rem' }}>
            <b>{stage.title}</b>
            <div style={{ marginTop: '0.2rem' }}>{stage.description}</div>
          </div>

          {/* visuals */}
          {stage.visual === 'pictures' && <PicturePair />}
          {stage.visual === 'context' && <ContextPicture />}

          {/* statement for stage 3 */}
          {stage.statement && (
            <div className="cue-card" style={{ marginBottom: '1rem' }}>
              <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--faint)', marginBottom: '0.35rem' }}>
                Statement
              </div>
              <div className="cue-topic" style={{ marginBottom: 0 }}>{stage.statement}</div>
            </div>
          )}

          {/* sub-questions for part 2 */}
          {stage.subQuestions && (
            <div className="card card-pad" style={{ marginBottom: '1rem' }}>
              <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)', marginBottom: '0.5rem' }}>
                Cover all three questions in your response
              </div>
              <ol className="cue-list" style={{ marginBottom: 0 }}>
                {stage.subQuestions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {/* question / timer */}
          <div className="big-timer-wrap" style={{ marginBottom: '1rem' }}>
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--faint)' }}>
              {phase === 'prep'
                ? 'Preparation time'
                : phase === 'record'
                  ? `Recording — ${question?.label}`
                  : phase === 'done'
                    ? 'This window is finished'
                    : `${question?.label} · ${question?.seconds}s window`}
            </div>
            <div className={`big-timer ${tone}`}>
              {formatClock(
                phase === 'idle' ? question?.seconds ?? 0 : seconds,
              )}
            </div>
            <div className="progress-bar" style={{ width: '100%', maxWidth: 420 }}>
              <div className="progress-fill" style={{ width: `${phase === 'idle' ? 0 : pct}%` }} />
            </div>

            <div className="row wrap" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {phase === 'idle' && (
                <button type="button" className="btn btn-lg" onClick={startStage}>
                  <ClockIcon className="" />
                  {stage.prepSeconds > 0 ? `Start ${stage.prepSeconds}s prep` : 'Start answering'}
                </button>
              )}
              {(phase === 'prep' || phase === 'record') && (
                <button type="button" className="btn btn-ghost" onClick={stopTimer}>
                  <StopIcon className="" />
                  Stop
                </button>
              )}
              {phase === 'done' && (
                <button type="button" className="btn btn-ghost" onClick={startStage}>
                  <PlayIcon className="" />
                  Repeat
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

            {lastUrl && (
              <div style={{ width: '100%', maxWidth: 460, marginTop: '0.6rem' }}>
                <div className="tiny faint" style={{ marginBottom: '0.3rem' }}>
                  Listen back to this window
                </div>
                <audio controls src={lastUrl} style={{ width: '100%' }} />
              </div>
            )}
            {micError && (
              <div className="callout callout-warn small" style={{ marginTop: '0.6rem', width: '100%' }}>
                {micError}
              </div>
            )}
          </div>

          {/* the question itself */}
          <div className="speak-question active" style={{ marginBottom: '1rem' }}>
            <div className="row-between">
              <div className="tiny strong" style={{ color: 'var(--brand)' }}>
                {question?.label}
              </div>
              <span className="badge">{question?.seconds}s</span>
            </div>
            <div style={{ marginTop: '0.3rem', fontSize: '1rem' }}>{question?.text}</div>
          </div>

          <div className="row wrap">
            {recorded.has(question?.id ?? '') && (
              <span className="badge badge-ok">
                <CheckIcon className="" /> practised
              </span>
            )}
            <button type="button" className="btn btn-ghost btn-sm" onClick={nextQuestion}>
              Next window →
            </button>
            <span className="tiny faint">
              {recorded.size} of {totalWindows} windows completed
            </span>
          </div>
        </div>

        {/* side panel: self rating */}
        <aside className="exam-side">
          <div className="card card-pad stack stack-sm">
            <div className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)' }}>
              Score each stage (0–75)
            </div>
            <p className="tiny muted" style={{ margin: 0 }}>
              A real examiner scores each stage; here you estimate yourself.
              Be honest — an inflated score tells you nothing.
            </p>
            {ML_SPEAKING_STAGES.map((s) => (
              <label key={s.id} className="stack stack-sm">
                <span className="row-between small">
                  <span>
                    Part {s.stage} <span className="faint">({s.level})</span>
                  </span>
                  <b>{ratings[s.id] ?? 0}</b>
                </span>
                <input
                  type="range"
                  min={0}
                  max={75}
                  step={1}
                  value={ratings[s.id] ?? 0}
                  onChange={(e) =>
                    setRatings((prev) => ({ ...prev, [s.id]: Number(e.target.value) }))
                  }
                  aria-label={`Score for Part ${s.stage}`}
                  style={{ accentColor: 'var(--brand)' }}
                />
                <span className="tiny faint">weight {Math.round(s.weight * 100)}%</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-block btn-lg"
            onClick={submit}
            disabled={saved}
          >
            <CheckIcon className="" />
            Save speaking result
          </button>

          <div className="callout callout-info small">
            <b>Part 2 and 3</b> give you a 60-second preparation countdown, then a
            single two-minute recording window. Parts 1.1 and 1.2 have no
            preparation time.
          </div>
        </aside>
      </div>
    </>
  );
}
