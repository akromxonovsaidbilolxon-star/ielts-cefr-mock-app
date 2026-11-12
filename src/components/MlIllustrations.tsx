/**
 * Inline SVG illustrations for Multilevel Speaking.
 *
 * Drawn rather than photographed so the app stays tiny, works offline, needs
 * no image licensing, and scales perfectly on every phone.
 */

/** Two contrasting pictures on the same topic (outdoors / indoors). */
export function PicturePair() {
  return (
    <div className="ml-pictures">
      <figure className="ml-picture">
        <svg viewBox="0 0 200 140" role="img" aria-label="Two people walking in a park">
          <rect width="200" height="140" fill="#e0f2fe" />
          <circle cx="160" cy="30" r="16" fill="#fde68a" />
          <rect y="96" width="200" height="44" fill="#bbf7d0" />
          <path d="M0 100 Q50 84 100 100 T200 96 L200 140 L0 140Z" fill="#86efac" />
          {/* trees */}
          <rect x="24" y="66" width="6" height="32" fill="#a16207" />
          <circle cx="27" cy="62" r="18" fill="#16a34a" />
          <rect x="168" y="70" width="6" height="28" fill="#a16207" />
          <circle cx="171" cy="66" r="15" fill="#15803d" />
          {/* two figures */}
          <g>
            <circle cx="76" cy="74" r="7" fill="#f59e0b" />
            <rect x="70" y="81" width="12" height="22" rx="4" fill="#f59e0b" />
            <rect x="72" y="101" width="4" height="14" fill="#78350f" />
            <rect x="78" y="101" width="4" height="14" fill="#78350f" />
          </g>
          <g>
            <circle cx="100" cy="76" r="7" fill="#3b82f6" />
            <rect x="94" y="83" width="12" height="21" rx="4" fill="#3b82f6" />
            <rect x="96" y="102" width="4" height="13" fill="#78350f" />
            <rect x="102" y="102" width="4" height="13" fill="#78350f" />
          </g>
          <rect x="112" y="86" width="26" height="4" rx="2" fill="#334155" />
        </svg>
        <figcaption>Picture 1</figcaption>
      </figure>

      <figure className="ml-picture">
        <svg viewBox="0 0 200 140" role="img" aria-label="Two people sitting indoors looking at phones">
          <rect width="200" height="140" fill="#f1f5f9" />
          <rect y="104" width="200" height="36" fill="#cbd5e1" />
          {/* window */}
          <rect x="132" y="18" width="52" height="44" rx="3" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="3" />
          <line x1="158" y1="18" x2="158" y2="62" stroke="#94a3b8" strokeWidth="3" />
          {/* sofa */}
          <rect x="16" y="86" width="112" height="26" rx="6" fill="#6366f1" />
          <rect x="16" y="74" width="14" height="30" rx="4" fill="#4f46e5" />
          <rect x="114" y="74" width="14" height="30" rx="4" fill="#4f46e5" />
          {/* two seated figures */}
          <g>
            <circle cx="48" cy="62" r="8" fill="#f59e0b" />
            <rect x="40" y="70" width="16" height="18" rx="4" fill="#f59e0b" />
            <rect x="52" y="76" width="12" height="8" rx="2" fill="#1e293b" />
          </g>
          <g>
            <circle cx="92" cy="62" r="8" fill="#ec4899" />
            <rect x="84" y="70" width="16" height="18" rx="4" fill="#ec4899" />
            <rect x="74" y="76" width="12" height="8" rx="2" fill="#1e293b" />
          </g>
        </svg>
        <figcaption>Picture 2</figcaption>
      </figure>
    </div>
  );
}

/** Context image for the Part 2 abstract topic (working together). */
export function ContextPicture() {
  return (
    <figure className="ml-picture ml-picture-wide">
      <svg viewBox="0 0 320 150" role="img" aria-label="A group of four people working together at a table">
        <rect width="320" height="150" fill="#eff6ff" />
        <rect y="112" width="320" height="38" fill="#dbeafe" />
        {/* table */}
        <ellipse cx="160" cy="112" rx="96" ry="20" fill="#fbbf24" />
        <ellipse cx="160" cy="108" rx="96" ry="18" fill="#fcd34d" />
        {/* laptop and papers */}
        <rect x="138" y="88" width="44" height="24" rx="3" fill="#334155" />
        <rect x="142" y="92" width="36" height="16" rx="2" fill="#93c5fd" />
        <rect x="86" y="96" width="26" height="16" rx="2" fill="#fff" stroke="#cbd5e1" />
        <rect x="210" y="96" width="26" height="16" rx="2" fill="#fff" stroke="#cbd5e1" />
        {/* four figures around the table */}
        {[
          { x: 70, c: '#f59e0b' },
          { x: 124, c: '#ec4899' },
          { x: 196, c: '#10b981' },
          { x: 250, c: '#6366f1' },
        ].map((f) => (
          <g key={f.x}>
            <circle cx={f.x} cy={58} r={11} fill={f.c} />
            <rect x={f.x - 12} y={70} width={24} height={28} rx={6} fill={f.c} />
          </g>
        ))}
        {/* speech bubbles */}
        <rect x="100" y="20" width="34" height="20" rx="7" fill="#fff" stroke="#93c5fd" />
        <rect x="186" y="16" width="34" height="20" rx="7" fill="#fff" stroke="#93c5fd" />
      </svg>
      <figcaption>Working together</figcaption>
    </figure>
  );
}
