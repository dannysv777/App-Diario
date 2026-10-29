import type { CSSProperties } from "react";

export function Atmosphere() {
  return <div className="proposal-atmosphere" aria-hidden="true">
    <div className="proposal-smoke">{[0, 1, 2, 3].map(i => <i key={i} style={{ animationDelay: `${i * -2.3}s` }} />)}</div>
    <i className="proposal-window proposal-window-upper" />
    <i className="proposal-window proposal-window-lower" />
    {Array.from({ length: 18 }, (_, i) => <i key={i} className="proposal-firefly" style={{
      left: `${8 + (i * 37 % 85)}%`, top: `${40 + (i * 17 % 47)}%`,
      "--drift-x": `${(i % 2 ? -1 : 1) * (12 + i % 19)}px`,
      "--drift-y": `${-14 - i % 23}px`,
      animationDuration: `${9 + i % 7}s`, animationDelay: `${-i * 1.73}s`,
    } as CSSProperties} />)}
    <svg className="proposal-reeds" viewBox="0 0 240 160" fill="none">
      <g stroke="#416f64" strokeWidth="3" strokeLinecap="round">
        <path d="M20 160Q18 110 2 90M25 160Q48 114 42 65M50 160Q40 125 26 113M190 160Q180 112 196 82M207 160Q221 130 235 118" />
      </g>
      <g fill="#72906b"><path d="M25 140Q3 124 7 112Q26 120 25 140M43 124Q61 96 66 102Q64 123 43 124M194 132Q176 113 176 102Q195 114 194 132" /></g>
      {[{ x: 42, y: 65 }, { x: 196, y: 82 }].map(({ x, y }) => <g key={x} transform={`translate(${x} ${y})`}>
        {[0, 60, 120, 180, 240, 300].map(angle => <ellipse key={angle} cy="-5" rx="2.5" ry="5" fill="#c7aa6a" transform={`rotate(${angle})`} />)}
        <circle r="3" fill="#886c3d" />
      </g>)}
    </svg>
  </div>;
}
