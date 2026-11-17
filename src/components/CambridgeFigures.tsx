import type { FigureBox } from '../content/cambridge/figures';

/**
 * Line drawing of "Proposed traffic changes in Granford" — a simplified
 * redrawing of the map printed in the book, showing only the roads, buildings
 * and the nine lettered positions (A–I) the questions refer to.
 */
interface GranfordSpec {
  /** Printed title of the map, carried with the test content. */
  title: string;
  /** Accessible description, also carried with the content. */
  alt: string;
  viewBox: string;
  letters: { letter: string; x: number; y: number }[];
  boxes: FigureBox[];
  streetLabels: { text: string; x: number; y: number; rotate: number }[];
}

export function GranfordMap({ spec }: { spec: GranfordSpec }) {
  const { title, alt, viewBox, letters, boxes, streetLabels } = spec;

  return (
    <div className="cfigure">
      <div className="cfigure-title">{title}</div>
      <svg viewBox={viewBox} className="cfigure-svg" role="img" aria-label={alt}>
        {/* frame */}
        <rect x="28" y="20" width="304" height="252" fill="#fff" stroke="#0f172a" strokeWidth="1.6" />

        {/* compass */}
        <g stroke="#0f172a" strokeWidth="1.2" fill="none">
          <line x1="52" y1="46" x2="52" y2="78" />
          <line x1="36" y1="62" x2="68" y2="62" />
          <polygon points="52,40 48,50 56,50" fill="#0f172a" stroke="none" />
        </g>
        <text x="52" y="36" fontSize="9" textAnchor="middle" fill="#0f172a">N</text>
        <text x="32" y="65" fontSize="9" textAnchor="middle" fill="#0f172a">W</text>
        <text x="72" y="65" fontSize="9" textAnchor="middle" fill="#0f172a">E</text>
        <text x="52" y="92" fontSize="9" textAnchor="middle" fill="#0f172a">S</text>

        {/* roads */}
        <g stroke="#0f172a" strokeWidth="2.2" fill="none" strokeLinecap="round">
          {/* Station Road, down the left */}
          <path d="M60 26 C54 90, 58 160, 70 268" />
          {/* High Street, left to right */}
          <path d="M62 200 C110 186, 180 182, 292 176" />
          {/* School Road, curving up the right */}
          <path d="M280 272 C262 226, 250 176, 258 130 C266 88, 274 58, 278 30" />
        </g>

        {/* street name labels */}
        {streetLabels.map((s) => (
          <text
            key={s.text}
            x={s.x}
            y={s.y}
            fontSize="9"
            fill="#0f172a"
            transform={`rotate(${s.rotate} ${s.x} ${s.y})`}
            style={{ fontStyle: 'italic' }}
          >
            {s.text}
          </text>
        ))}

        {/* buildings */}
        {boxes.map((b) => (
          <g key={b.label + b.x + b.y}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="#fff" stroke="#0f172a" strokeWidth="1.1" />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3.5} fontSize="8.5" textAnchor="middle" fill="#0f172a">
              {b.label}
            </text>
          </g>
        ))}

        {/* lettered positions */}
        {letters.map((l) => (
          <g key={l.letter}>
            <circle cx={l.x} cy={l.y} r="10" fill="#fff" stroke="#0d4ea6" strokeWidth="1.4" />
            <text x={l.x} y={l.y + 3.6} fontSize="10" fontWeight="700" textAnchor="middle" fill="#0d4ea6">
              {l.letter}
            </text>
          </g>
        ))}
      </svg>
      <div className="cfigure-note">
        Simplified redrawing of the map in the book — the lettered positions A–I are in the same
        places, but the drawing is not a reproduction of the original artwork.
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface Panel {
  year: string;
  caption: string;
  busStops: { x: number; y: number }[];
  roundabouts: { x: number; y: number }[];
  hospital: { x: number; y: number; w: number; h: number };
  carPark: { x: number; y: number; w: number; h: number; label: string };
  busStation: { x: number; y: number; w: number; h: number } | null;
}

function HospitalPanel({ panel }: { panel: Panel }) {
  return (
    <div className="cmap-panel">
      <div className="cmap-year">{panel.year}</div>
      <svg viewBox="0 0 190 230" className="cfigure-svg" role="img" aria-label={`Road access to the city hospital in ${panel.year}`}>
        <rect x="6" y="6" width="178" height="196" fill="#fff" stroke="#0f172a" strokeWidth="1.4" />
        <text x="95" y="20" fontSize="8" textAnchor="middle" fill="#5b6b82" style={{ fontStyle: 'italic' }}>
          Ring Road
        </text>

        {/* Hospital Road — vertical through the middle */}
        <line x1="96" y1="18" x2="96" y2="196" stroke="#0f172a" strokeWidth="2" />
        <text x="102" y="204" fontSize="8" fill="#0f172a" style={{ fontStyle: 'italic' }}>
          Hospital Road
        </text>

        {/* City Road along the bottom */}
        <line x1="6" y1="176" x2="184" y2="176" stroke="#0f172a" strokeWidth="2" />
        <text x="12" y="188" fontSize="8" fill="#0f172a" style={{ fontStyle: 'italic' }}>
          City Road
        </text>

        {/* hospital block */}
        <rect
          x={panel.hospital.x}
          y={panel.hospital.y}
          width={panel.hospital.w}
          height={panel.hospital.h}
          fill="#e8f0fc"
          stroke="#0d4ea6"
          strokeWidth="1.2"
        />
        <text
          x={panel.hospital.x + panel.hospital.w / 2}
          y={panel.hospital.y + panel.hospital.h / 2 + 3}
          fontSize="7.5"
          textAnchor="middle"
          fill="#0d4ea6"
          fontWeight="700"
        >
          CITY
        </text>
        <text
          x={panel.hospital.x + panel.hospital.w / 2}
          y={panel.hospital.y + panel.hospital.h / 2 + 12}
          fontSize="7.5"
          textAnchor="middle"
          fill="#0d4ea6"
          fontWeight="700"
        >
          HOSPITAL
        </text>

        {/* car park */}
        <rect
          x={panel.carPark.x}
          y={panel.carPark.y}
          width={panel.carPark.w}
          height={panel.carPark.h}
          fill="#f1f4f9"
          stroke="#5b6b82"
          strokeWidth="1"
        />
        {panel.carPark.label.split('\n').map((line, i) => (
          <text
            key={line}
            x={panel.carPark.x + panel.carPark.w / 2}
            y={panel.carPark.y + 10 + i * 8}
            fontSize="6"
            textAnchor="middle"
            fill="#5b6b82"
          >
            {line}
          </text>
        ))}

        {/* bus stops (2007 only) */}
        {panel.busStops.map((b, i) => (
          <rect key={i} x={b.x - 3} y={b.y - 3} width="6" height="6" fill="#0e7490" />
        ))}

        {/* roundabouts (2010 only) */}
        {panel.roundabouts.map((r, i) => (
          <circle key={i} cx={r.x} cy={r.y} r="6" fill="none" stroke="#0f172a" strokeWidth="1.6" />
        ))}

        {/* bus station (2010 only) */}
        {panel.busStation && (
          <g>
            <rect
              x={panel.busStation.x}
              y={panel.busStation.y}
              width={panel.busStation.w}
              height={panel.busStation.h}
              fill="#e0f5f9"
              stroke="#0e7490"
              strokeWidth="1.1"
            />
            <text
              x={panel.busStation.x + panel.busStation.w / 2}
              y={panel.busStation.y + panel.busStation.h / 2 + 3}
              fontSize="7"
              textAnchor="middle"
              fill="#0e7490"
            >
              bus station
            </text>
          </g>
        )}
      </svg>
      <div className="cfigure-note">{panel.caption}</div>
    </div>
  );
}

/** Writing Task 1 — the two hospital road-access maps, 2007 and 2010. */
export function HospitalMaps({ panels }: { panels: Panel[] }) {
  return (
    <div className="cfigure">
      <div className="cfigure-title">Road access to a city hospital — 2007 and 2010</div>
      <div className="cmap-row">
        {panels.map((p) => (
          <HospitalPanel key={p.year} panel={p} />
        ))}
      </div>
      <div className="cfigure-note">
        Simplified redrawing of the two maps in the book. Only the features the task asks you to
        describe are shown; distances and exact proportions are approximate.
      </div>
    </div>
  );
}
