export function TerrainForeground({ portrait }: { portrait: boolean }) {
  const tufts = portrait
    ? [[33, 78, 26], [64, 61, 26], [54, 75, 28], [75, 89, 32], [9, 86, 38], [92, 86, 38]]
    : [[38, 87, 24], [69, 77, 26], [47, 84, 28], [54, 95, 30], [5, 95, 40], [94, 95, 40]];
  return <div className="terrain-foreground" aria-hidden="true">
    {tufts.map(([x, y, size], index) => <div className="terrain-tuft-anchor" key={index} style={{ left: `${x}%`, top: `${y}%`, width: size }}>
      <svg className="terrain-tuft" viewBox="0 0 60 32">
        <path d="M4 31Q4 16 0 10Q13 15 16 30Q14 8 20 3Q24 16 25 29Q32 12 40 10Q35 20 34 29Q46 7 55 6Q48 22 43 30Q53 21 60 22L53 32Z" fill={index > 3 ? "#234838" : "#3c6447"} />
        <path d="M19 30L20 14M35 30L44 17" fill="none" stroke="#759063" strokeWidth="1.5" opacity=".55" />
      </svg>
    </div>)}
  </div>;
}
