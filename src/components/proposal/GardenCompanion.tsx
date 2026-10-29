"use client";

import { useEffect, useRef } from "react";

type Point = [number, number];
type Stop = { point: Point; action: "sniff" | "drink" | "rest"; facing: number };

export function GardenCompanion({ portrait, paused }: { portrait: boolean; paused: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  const traveler = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const root = layer.current!;
    const dog = traveler.current!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const hub: Point = portrait ? [56, 74] : [48, 83];
    // All journeys return through dry grass; no direct shortcut across the pond.
    const stops: Stop[] = portrait ? [
      { point: [42, 77], action: "sniff", facing: -1 },
      { point: [56, 62], action: "sniff", facing: 1 },
      { point: [46, 66], action: "drink", facing: -1 },
      { point: [57, 80], action: "rest", facing: -1 },
    ] : [
      { point: [42, 86], action: "sniff", facing: -1 },
      { point: [65, 76], action: "sniff", facing: 1 },
      { point: [40, 75], action: "drink", facing: -1 },
      { point: [64, 86], action: "rest", facing: -1 },
    ];
    let position: Point = [...hub];
    let origin: Point = [...hub];
    let destination: Point = [...hub];
    let elapsed = 0, duration = 2600, previous = 0, frame = 0;
    let walking = false, returning = false, visible = true;
    let stop = stops[3];
    let bag: number[] = [];
    let last = -1;
    let manual: "rest" | "sleep" | null = null;
    const place = () => { dog.style.transform = `translate(${position[0]}%, ${position[1]}%)`; };
    const action = (value: string) => { root.dataset.action = value; };
    const walkTo = (point: Point) => {
      origin = [...position]; destination = point; elapsed = 0; walking = true;
      duration = Math.max(3500, Math.hypot(point[0] - origin[0], point[1] - origin[1]) * 340);
      root.style.setProperty("--dog-facing", point[0] < origin[0] ? "-1" : "1");
      action("walk");
    };
    const touch = () => {
      if (manual) {
        manual = null;
        elapsed = 0;
        returning = true;
        walkTo(hub);
        return;
      }
      manual = "rest";
      walking = false;
      elapsed = 0;
      duration = 10000;
      action("rest");
    };
    const touchTarget = root.querySelector<HTMLButtonElement>(".companion-touch");
    touchTarget?.addEventListener("click", touch);
    const tick = (now: number) => {
      const active = visible && !document.hidden && !pausedRef.current && !reduced.matches;
      root.dataset.active = String(active);
      if (active) {
        elapsed += previous ? Math.min(50, now - previous) : 0;
        if (manual === "rest") {
          if (elapsed >= 10000) { manual = "sleep"; elapsed = 0; action("sleep"); }
        } else if (manual === "sleep") {
          // The dog stays asleep until touched again.
        } else if (walking) {
          const t = Math.min(1, elapsed / duration);
          position = [origin[0] + (destination[0] - origin[0]) * t, origin[1] + (destination[1] - origin[1]) * t];
          place();
          if (t === 1) {
            if (returning) { returning = false; walkTo(stop.point); }
            else { walking = false; elapsed = 0; duration = stop.action === "rest" ? 6500 : 4200; root.style.setProperty("--dog-facing", String(stop.facing)); action(stop.action); }
          }
        } else if (elapsed >= duration) {
          if (!bag.length) {
            bag = [0, 1, 2, 3];
            for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
            if (bag.at(-1) === last) [bag[0], bag[3]] = [bag[3], bag[0]];
          }
          last = bag.pop()!; stop = stops[last]; returning = true; walkTo(hub);
        }
      }
      previous = active ? now : 0;
      if (!document.hidden && visible && !reduced.matches) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame); previous = 0;
      root.dataset.reduced = String(reduced.matches);
      root.dataset.active = "false";
      if (reduced.matches) { manual = null; position = [...hub]; place(); action("rest"); walking = false; elapsed = 0; duration = 2600; }
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume(); });
    observer.observe(root);
    document.addEventListener("visibilitychange", resume);
    reduced.addEventListener("change", resume);
    place(); action("rest"); resume();
    return () => { cancelAnimationFrame(frame); touchTarget?.removeEventListener("click", touch); observer.disconnect(); document.removeEventListener("visibilitychange", resume); reduced.removeEventListener("change", resume); };
  }, [portrait]);

  return <div className="garden-companion" ref={layer}>
    {(portrait ? [[33, 77], [64, 60]] : [[38, 86], [69, 76]]).map(([x, y], index) => <svg key={index} aria-hidden="true" className="companion-flowers" style={{ left: `${x}%`, top: `${y}%` }} viewBox="0 0 60 50">
      <path d="M16 47Q20 30 14 18M30 48L33 11M43 47Q39 32 46 24" fill="none" stroke="#41664b" strokeWidth="2" />
      <path d="M27 45Q14 41 14 33Q26 33 27 45M35 40Q41 28 49 30Q45 41 35 40" fill="#69835a" />
      {[[14, 18], [33, 11], [46, 24]].map(([cx, cy], flower) => <g key={flower} transform={`translate(${cx} ${cy})`}>
        {[0, 72, 144, 216, 288].map(angle => <ellipse key={angle} cy="-4" rx="2.8" ry="4.5" transform={`rotate(${angle})`} fill={index ? "#b1a1c8" : "#e1c77e"} />)}
        <circle r="2.5" fill="#b78c4f" />
      </g>)}
    </svg>)}
    <div className="companion-position" ref={traveler}>
      <button type="button" className="companion-touch" aria-label="Tocar al perrito" title="Tocar al perrito"><span className="companion-dog">
        <svg viewBox="0 0 120 110" className="companion-art">
          <ellipse cx="55" cy="102" rx="35" ry="5" fill="#122c2a" opacity=".22" />
          <g className="dog-facing">
            <path className="dog-tail" d="M31 65Q9 59 14 42Q20 58 37 55" fill="#494557" stroke="#302d3d" strokeWidth="3" strokeLinejoin="round" />
            <g className="dog-leg dog-leg-back"><path d="M39 75L35 99H47L49 78" fill="#393645" stroke="#302d3d" strokeWidth="2" /><path d="M35 95H46V101H33Q31 97 35 95" fill="#b9907b" /></g>
            <g className="dog-leg dog-leg-front"><path d="M72 74L75 99H86L84 70" fill="#494557" stroke="#302d3d" strokeWidth="2" /><path d="M75 95H86L90 100H75Z" fill="#c6a08a" /></g>
            <path d="M28 63Q33 52 57 56L72 47Q89 51 88 69Q83 84 56 83L35 80Q26 77 28 63Z" fill="#494557" stroke="#302d3d" strokeWidth="2.5" />
            <path d="M39 60Q54 56 65 60" fill="none" stroke="#858097" strokeWidth="2" opacity=".5" />
            <path d="M71 62Q78 64 84 60L81 78Q75 81 72 77Z" fill="#b9907b" />
            <g className="dog-head">
              <path d="M65 37Q52 19 58 5Q73 11 78 29L87 27Q88 10 99 7Q105 24 98 40Q108 52 99 61Q86 70 73 60Q60 57 65 37Z" fill="#494557" stroke="#302d3d" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M62 13Q64 24 71 30L71 23ZM96 16L92 32L98 29Z" fill="#bd938b" />
              <path d="M87 49Q95 44 105 50L108 55Q103 64 89 60Q83 56 87 49Z" fill="#c4a08a" />
              <ellipse cx="105" cy="51" rx="4" ry="3" fill="#292733" />
              <ellipse cx="88" cy="41" rx="3.7" ry="4.3" fill="#211f29" /><circle cx="89" cy="39.5" r="1.2" fill="#f4eddb" />
              <path d="M83 34l5-1" stroke="#c4a08a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M67 60Q79 68 91 62" fill="none" stroke="#7b9a63" strokeWidth="5" /><circle cx="86" cy="67" r="2.5" fill="#d9bd77" />
              <path className="dog-tongue" d="M101 59v7" stroke="#d49c9b" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </span></button>
    </div>
  </div>;
}
