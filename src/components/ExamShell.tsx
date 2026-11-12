import type { ReactNode } from 'react';
import { formatLongClock, timerToneClass } from '../hooks/useCountdown';
import { ClockIcon } from './Icons';

interface TimerCardProps {
  remaining: number;
  total: number;
  running: boolean;
  label?: string;
  onToggle?: () => void;
  hidden?: boolean;
}

export function TimerCard({
  remaining,
  total,
  running,
  label = 'Time remaining',
  onToggle,
  hidden = false,
}: TimerCardProps) {
  if (hidden) return null;
  const tone = timerToneClass(remaining, total);
  return (
    <div className={`timer ${tone} ${running ? '' : 'paused'}`}>
      <div className="row-between" style={{ marginBottom: '0.15rem' }}>
        <div className="timer-label">{label}</div>
        <ClockIcon className="" />
      </div>
      <div className="row-between">
        <div className="timer-value">{formatLongClock(remaining)}</div>
        {onToggle && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onToggle}>
            {running ? 'Pause' : 'Resume'}
          </button>
        )}
      </div>
      {!running && <div className="tiny faint" style={{ marginTop: '0.2rem' }}>Timer paused</div>}
    </div>
  );
}

interface ProgressCardProps {
  answered: number;
  total: number;
  label?: string;
  children?: ReactNode;
}

export function ProgressCard({ answered, total, label = 'Answered', children }: ProgressCardProps) {
  const pct = total ? Math.round((answered / total) * 100) : 0;
  return (
    <div className="progress-block">
      <div className="row-between">
        <span className="tiny strong" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--faint)' }}>
          {label}
        </span>
        <span className="tiny strong nowrap">
          {answered} / {total}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      {children}
    </div>
  );
}

interface AnswerGridProps {
  total: number;
  answered: Set<number>;
  current?: number;
  flagged?: Set<number>;
  onJump: (n: number) => void;
}

export function AnswerGrid({ total, answered, current, flagged, onJump }: AnswerGridProps) {
  return (
    <div className="answer-grid">
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const classes = [
          'answer-chip',
          answered.has(n) ? 'answered' : '',
          current === n ? 'current' : '',
          flagged?.has(n) ? 'flagged' : '',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <button
            key={n}
            type="button"
            className={classes}
            onClick={() => onJump(n)}
            aria-label={`Go to question ${n}${answered.has(n) ? ', answered' : ''}`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

export function ExamHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <div className="part-hero">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {badge && <span className="badge badge-brand">{badge}</span>}
    </div>
  );
}
