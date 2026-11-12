import type { ChartSpec } from '../types';

const COLORS = ['#0d4ea6', '#0e7490', '#c2410c', '#6d28d9'];

/**
 * A grouped bar chart drawn with plain SVG so it stays crisp, prints well,
 * and needs no charting dependency.
 */
export default function BarChart({ spec }: { spec: ChartSpec }) {
  const width = 620;
  const height = 320;
  const pad = { top: 16, right: 14, bottom: 46, left: 56 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const groups = spec.categories.length;
  const series = spec.series.length;
  const groupW = plotW / groups;
  const barGap = 5;
  const barW = Math.max(6, (groupW * 0.72 - barGap * (series - 1)) / series);

  const ticks = 5;
  const tickValues = Array.from({ length: ticks + 1 }, (_, i) =>
    Math.round((spec.yMax / ticks) * i),
  );

  return (
    <div className="chart-card">
      <div className="chart-title">{spec.title}</div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        role="img"
        aria-label={spec.title}
        style={{ minWidth: 420 }}
      >
        {/* gridlines + y labels */}
        {tickValues.map((value) => {
          const y = pad.top + plotH - (value / spec.yMax) * plotH;
          return (
            <g key={value}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#e3e9f2"
                strokeWidth={1}
              />
              <text
                x={pad.left - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={11}
                fill="#7b8797"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* axis */}
        <line
          x1={pad.left}
          x2={pad.left}
          y1={pad.top}
          y2={pad.top + plotH}
          stroke="#b9c4d4"
          strokeWidth={1.5}
        />
        <line
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + plotH}
          y2={pad.top + plotH}
          stroke="#b9c4d4"
          strokeWidth={1.5}
        />

        {/* y-axis title */}
        <text
          x={12}
          y={pad.top + plotH / 2}
          fontSize={11}
          fill="#5b6b82"
          textAnchor="middle"
          transform={`rotate(-90 12 ${pad.top + plotH / 2})`}
        >
          {spec.yLabel}
        </text>

        {/* bars */}
        {spec.categories.map((category, ci) => {
          const groupX = pad.left + ci * groupW;
          const totalBarsW = barW * series + barGap * (series - 1);
          const startX = groupX + (groupW - totalBarsW) / 2;
          return (
            <g key={category}>
              {spec.series.map((s, si) => {
                const value = s.values[ci] ?? 0;
                const h = Math.max(1, (value / spec.yMax) * plotH);
                const x = startX + si * (barW + barGap);
                const y = pad.top + plotH - h;
                return (
                  <g key={s.name}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      fill={COLORS[si % COLORS.length]}
                      rx={2.5}
                    />
                    <text
                      x={x + barW / 2}
                      y={y - 4}
                      textAnchor="middle"
                      fontSize={9.5}
                      fill="#5b6b82"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}
              <text
                x={groupX + groupW / 2}
                y={pad.top + plotH + 20}
                textAnchor="middle"
                fontSize={11}
                fill="#41506a"
                fontWeight={600}
              >
                {category}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="chart-legend">
        {spec.series.map((s, i) => (
          <span key={s.name} className="chart-legend-item">
            <span className="chart-swatch" style={{ background: COLORS[i % COLORS.length] }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
