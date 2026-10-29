"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import sky from "./sky-data.json";

export type SkyView = { width: number; height: number; extension: number };
type Point = { alt: number; az: number };
const radians = Math.PI / 180;

// Rectilinear camera facing south, elevated 48 degrees. A single pixel scale
// serves both axes and both views; scrolling reveals the same projected field.
export function projectGardenStar(point: Point, view: SkyView) {
  const a = point.alt * radians;
  const d = (point.az - 180) * radians;
  const elevation = 48 * radians;
  const depth = Math.sin(a) * Math.sin(elevation) + Math.cos(a) * Math.cos(d) * Math.cos(elevation);
  if (depth <= .08 || point.alt <= 0) return null;
  const scale = view.width * (view.height >= view.width ? .8 : .6);
  return {
    x: Number((view.width * .57 + scale * Math.cos(a) * Math.sin(d) / depth).toFixed(3)),
    y: Number((view.height * .12 - scale * (Math.sin(a) * Math.cos(elevation) - Math.cos(a) * Math.cos(d) * Math.sin(elevation)) / depth).toFixed(3)),
  };
}

export function useSkyView(ref: RefObject<HTMLDivElement | null>): SkyView {
  const [view, setView] = useState<SkyView>({ width: 390, height: 844, extension: 718 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setView({ width: element.clientWidth, height: element.clientHeight, extension: element.firstElementChild?.clientHeight ?? 718 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    update();
    return () => observer.disconnect();
  }, [ref]);
  return view;
}

export function SkyField({ view, expanded = false, revealed, labelsOnly = false, hideLabels = false }: { view: SkyView; expanded?: boolean; revealed: boolean; labelsOnly?: boolean; hideLabels?: boolean }) {
  const content = useMemo(() => {
    const stars = sky.stars.map(star => ({ ...star, point: projectGardenStar(star, view) })).filter(star => star.point);
    const figures = sky.constellations.map(item => {
      const segments = item.segments.map(([a, b]) => [projectGardenStar(a, view), projectGardenStar(b, view)]).filter(pair => pair[0] && pair[1]);
      const points = segments.flat().filter(point => point !== null);
      return { ...item, segments, label: points.length ? { x: points.reduce((sum, point) => sum + point.x, 0) / points.length, y: points.reduce((sum, point) => sum + point.y, 0) / points.length - 10 } : null };
    });
    return { stars, figures };
  }, [view]);
  // Move only captions, never astronomical coordinates. Reserve the toolbar,
  // tree and heading areas, then lay out the most relevant captions first.
  const labels: { name: string; x: number; y: number; width: number }[] = [];
  const portrait = view.height >= view.width;
  const offset = expanded ? view.extension : 0;
  const left = expanded ? 16 : view.width * (portrait ? .46 : .30);
  const top = expanded ? 140 : 88;
  const bottom = expanded ? view.extension - 60 : view.height * .235;
  const candidates = [
    ...sky.planets.map(item => ({ name: item.name, point: projectGardenStar(item, view) })),
    ...[...content.figures].sort((a, b) => {
      const priority = (id: string) => id === "Sco" ? 0 : id === "Sgr" ? 1 : 2;
      return priority(a.id) - priority(b.id);
    }).map(item => ({ name: item.name, point: item.label })),
  ];
  for (const item of candidates) {
    if (!item.point || item.point.x < 0 || item.point.x > view.width || item.point.y + offset < 0 || item.point.y + offset > (expanded ? view.extension : view.height * .3)) continue;
    const width = item.name.length * 9 + 12;
    const x = Math.max(left + width / 2, Math.min(view.width - 16 - width / 2, item.point.x));
    for (let y = Math.max(top, Math.min(bottom, item.point.y + offset + 20)); y <= bottom; y += 26) {
      if (x + width / 2 > view.width - 12 || labels.some(label => Math.abs(label.y - y) < 25 && Math.abs(label.x - x) < (label.width + width) / 2 + 8)) continue;
      labels.push({ name: item.name, x, y, width });
      break;
    }
  }
  return <svg className={`continuous-sky-field${labelsOnly ? " sky-label-layer" : ""}`} viewBox={`0 0 ${view.width} ${expanded ? view.extension : view.height}`} aria-hidden="true">
    {!labelsOnly && <>
    <g transform={`translate(0 ${expanded ? view.extension : 0})`}>
      <g className="historic-stars">{content.stars.map(star => <circle data-star-id={star.id} key={star.id} cx={star.point!.x} cy={star.point!.y} r={Math.max(.55, 2.1 - star.mag * .28)} fill={star.warm ? "#f9dfb2" : "#d9e9ff"} opacity={Math.max(.35, 1 - star.mag * .11)} className={star.mag < 1.5 ? "historic-star-bright" : undefined} style={{ animationDelay: `${-(star.id % 9)}s` }} />)}</g>
      <g className="historic-constellations" data-visible={revealed}>{content.figures.map(item => <g key={item.id}>
        {item.segments.map(([a, b], index) => <line key={index} x1={a!.x} y1={a!.y} x2={b!.x} y2={b!.y} />)}
      </g>)}</g>
      {sky.planets.map(planet => {
        const point = projectGardenStar(planet, view);
        return point && <g key={planet.id} data-planet={planet.id}>
          <circle cx={point.x} cy={point.y} r="5" fill="#fff2c5" opacity=".1" />
          <circle cx={point.x} cy={point.y} r="2.4" fill="#fff2c5" />
        </g>;
      })}
    </g></>}
    {!hideLabels && <g className="historic-sky-labels" data-visible={revealed}>{labels.map(label => <text key={label.name} x={label.x} y={label.y}>{label.name}</text>)}</g>}
  </svg>;
}

// Key only blue distant scenery. Never key bright pixels: the chimney's
// sunlit stone shares those values with the old decorative moon and stars.
function skyMask(image: HTMLImageElement, portrait: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  const mask = context.createImageData(canvas.width, canvas.height);
  const horizon = canvas.height * (portrait ? .35 : .40);
  for (let x = 0; x < canvas.width; x++) {
    const u = x / canvas.width;
    for (let y = 0; y < horizon; y++) {
      const i = (y * canvas.width + x) * 4;
      const r = pixels.data[i], g = pixels.data[i + 1], blue = pixels.data[i + 2];
      const isBlue = blue > r * 1.45 && blue > g * 1.17;
      const v = y / canvas.height;
      const oldMoon = portrait ? u > .25 && u < .35 && v > .032 && v < .093 : u > .32 && u < .385 && v > .09 && v < .19;
      const edgeFade = Math.min(1, (horizon - y) / (canvas.height * .065));
      mask.data[i + 3] = isBlue || oldMoon ? Math.round(255 * edgeFade) : 0;
      mask.data[i] = mask.data[i + 1] = mask.data[i + 2] = 255;
    }
  }
  context.putImageData(mask, 0, 0);
  const paintedStars = portrait
    ? [[.446, .035], [.713, .067], [.553, .101], [.241, .104], [.436, .124], [.789, .126]]
    : [[.459, .095], [.686, .13], [.826, .065], [.932, .122], [.794, .183], [.538, .177], [.431, .236], [.308, .22]];
  context.fillStyle = "white";
  for (const [x, y] of paintedStars) {
    context.beginPath();
    context.arc(x * canvas.width, y * canvas.height, 9, 0, Math.PI * 2);
    context.fill();
  }
  return canvas.toDataURL();
}

export function GardenSky({ view, revealed }: { view: SkyView; revealed: boolean }) {
  const portrait = view.height >= view.width;
  const [mask, setMask] = useState<{ portrait: boolean; url: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.onload = () => { if (!cancelled) setMask({ portrait, url: skyMask(image, portrait) }); };
    image.src = portrait ? "/proposal/garden-portrait.webp" : "/proposal/garden-landscape.webp";
    return () => { cancelled = true; };
  }, [portrait]);
  if (!mask || mask.portrait !== portrait) return null;
  return <div className="proposal-garden-sky" style={{ maskImage: `url(${mask.url})`, WebkitMaskImage: `url(${mask.url})` }}>
    <SkyField view={view} revealed={revealed} hideLabels />
    <svg className="proposal-mountain-ridge" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#24485b" d="M0 286 Q57 251 112 249 Q147 245 178 257 L215 262 L253 239 Q271 235 292 243 L328 259 L372 247 Q402 239 434 248 L477 247 L520 268 Q555 258 583 244 L617 231 L646 235 L684 254 L724 230 Q741 222 760 237 L793 248 Q831 252 867 268 L918 280 Q961 289 1000 308 V1000 H0Z" />
      <path fill="#1c3d50" opacity=".6" d="M0 286 Q57 251 112 249 Q147 245 178 257 L215 262 L253 239 Q271 235 292 243 L328 259 L372 247 Q402 239 434 248 L477 247 L520 268 L480 283 L435 279 L390 293 L340 288 L291 310 L250 299 L210 317 L150 308 L70 331 H0Z" />
      <path fill="#315365" opacity=".3" d="M617 231 L646 235 L684 254 L724 230 Q741 222 760 237 L793 248 Q831 252 867 268 L825 263 L785 260 L743 246 L716 256 L688 268 L655 253Z" />
      <path fill="#193c50" d="M0 345 Q90 319 158 327 L206 315 L247 329 L294 309 L337 319 L380 304 L418 321 L466 302 L504 315 L548 299 L589 318 L633 307 L674 323 L711 315 L758 330 L805 327 L848 343 Q930 327 1000 350 V1000 H0Z" />
    </svg>
  </div>;
}
