"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

type Canopy = { url: string; inverse: string; rim: string; portrait: boolean };

// Only green foliage inside the tree's bounds is lifted from the illustration.
// The inverse mask leaves the original trunk and branches on the main canvas.
function separateCanopy(image: HTMLImageElement, portrait: boolean): Canopy {
  const width = image.naturalWidth, height = image.naturalHeight;
  const source = document.createElement("canvas");
  source.width = width; source.height = height;
  const ctx = source.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, width, height);
  const inverse = ctx.createImageData(width, height);
  inverse.data.fill(255);
  const crop = document.createElement("canvas");
  crop.width = Math.ceil(width * (portrait ? .46 : .28));
  crop.height = Math.ceil(height * (portrait ? .40 : .46));
  const cropCtx = crop.getContext("2d")!;
  const leaves = cropCtx.createImageData(crop.width, crop.height);
  for (let y = 0; y < crop.height; y++) {
    for (let x = 0; x < crop.width; x++) {
      const i = (y * width + x) * 4;
      const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
      if (g > 25 && g > r * 1.06 && g > b * 1.08) {
        const j = (y * crop.width + x) * 4;
        leaves.data[j] = r; leaves.data[j + 1] = g; leaves.data[j + 2] = b; leaves.data[j + 3] = 255;
        inverse.data[i + 3] = 0;
      }
    }
  }
  cropCtx.putImageData(leaves, 0, 0);
  const rim = document.createElement("canvas");
  rim.width = crop.width; rim.height = crop.height;
  const rimCtx = rim.getContext("2d")!;
  const edge = rimCtx.createImageData(crop.width, crop.height);
  // A static, inward edge on the sky-facing side, calculated once per asset.
  // Keep the light off the trunk and avoid outlining the entire canopy.
  for (let y = 0; y < crop.height; y++) {
    for (let x = 0; x < crop.width; x++) {
      const i = (y * crop.width + x) * 4;
      const right = x + 6 >= crop.width || leaves.data[(y * crop.width + x + 6) * 4 + 3] === 0;
      const above = y < 3 || leaves.data[((y - 3) * crop.width + x) * 4 + 3] === 0;
      if (leaves.data[i + 3] && (right || above)) {
        edge.data[i] = edge.data[i + 1] = edge.data[i + 2] = 255;
        edge.data[i + 3] = 255;
      }
    }
  }
  rimCtx.putImageData(edge, 0, 0);
  ctx.putImageData(inverse, 0, 0);
  return { url: crop.toDataURL(), inverse: source.toDataURL(), rim: rim.toDataURL(), portrait };
}

export function TreeBreeze({ host, portrait, paused }: { host: RefObject<HTMLDivElement | null>; portrait: boolean; paused: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [canopy, setCanopy] = useState<Canopy | null>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [burst, setBurst] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (burstTimer.current) clearTimeout(burstTimer.current); }, []);
  useEffect(() => {
    if (!canopy) return;
    const frame = requestAnimationFrame(() => {
      const epoch = document.timeline.currentTime;
      if (epoch === null) return;
      host.current?.parentElement?.querySelectorAll(".tree-canopy, .proposal-reeds, .tree-shadow, .terrain-tuft").forEach(element => {
        element.getAnimations().forEach(animation => { animation.startTime = epoch; });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [canopy, host]);
  useEffect(() => {
    const element = root.current;
    const world = host.current?.parentElement;
    if (!element || !world) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const update = () => {
      const animate = !paused && !preference.matches && !document.hidden && visible;
      setActive(animate);
      setReduced(preference.matches);
      world.style.setProperty("--wind-play-state", animate ? "running" : "paused");
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); });
    observer.observe(element);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, [canopy, host, paused]);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    const element = host.current;
    image.onload = () => {
      if (cancelled || !element) return;
      const layer = separateCanopy(image, portrait);
      element.style.maskImage = `url(${layer.inverse})`;
      element.style.maskSize = "100% 100%";
      setCanopy(layer);
    };
    image.src = portrait ? "/proposal/garden-portrait.webp" : "/proposal/garden-landscape.webp";
    return () => {
      cancelled = true;
      if (element) { element.style.removeProperty("mask-image"); element.style.removeProperty("mask-size"); }
    };
  }, [host, portrait]);
  if (!canopy || canopy.portrait !== portrait) return null;
  return <div ref={root} className="tree-breeze" data-active={active} data-reduced={reduced} data-burst={burst}>
    <div className="tree-shadow" aria-hidden="true" />
    <div className="tree-canopy" aria-hidden="true">
      <svg className="tree-canopy-image" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs><filter id="tree-leaf-breeze" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".045 .075" numOctaves="1" seed="7" result="breeze" />
          <feDisplacementMap in="SourceGraphic" in2="breeze" scale=".2" xChannelSelector="R" yChannelSelector="G">
            {active && <animate attributeName="scale" values=".15;.35;.15" dur="7s" repeatCount="indefinite" calcMode="spline" keyTimes="0;.5;1" keySplines=".42 0 .58 1;.42 0 .58 1" />}
          </feDisplacementMap>
        </filter></defs>
        <image href={canopy.url} width="100" height="100" preserveAspectRatio="none" filter={reduced ? undefined : "url(#tree-leaf-breeze)"} />
      </svg>
      <span className="tree-canopy-rim" style={{ maskImage: `url(${canopy.rim})`, WebkitMaskImage: `url(${canopy.rim})` }} />
    </div>
    <div className="tree-particles" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => <i key={`firefly-${index}`} className="tree-firefly" style={{
        left: `${9 + index * 17 % 82}%`, top: `${10 + index * 23 % 77}%`,
        "--fly-x": `${index % 2 ? -12 - index : 12 + index}px`,
        "--fly-y": `${-9 - index * 2}px`,
        animationDuration: `${10 + index % 5}s`, animationDelay: `${-index * 1.83}s`,
      } as CSSProperties} />)}
      {Array.from({ length: 7 }, (_, index) => <i key={index} className="tree-falling-leaf" style={{
        left: `${12 + index * 13 % 75}%`, top: `${14 + index * 19 % 58}%`,
        width: `${5 + index % 4}px`, height: `${8 + index % 5}px`,
        "--leaf-drift": `${index % 2 ? -22 - index * 3 : 18 + index * 4}px`,
        "--leaf-color": ["#8f9f64", "#a0a570", "#6f936a"][index % 3],
        animationDuration: `${12 + index * 1.2}s`, animationDelay: `${-index * 2.9}s`,
      } as CSSProperties} />)}
      {burst && <div className="tree-leaf-burst">
        {Array.from({ length: 10 }, (_, index) => <i key={index} className="tree-falling-leaf" style={{
          left: `${12 + index * 11 % 77}%`, top: `${18 + index * 17 % 55}%`,
          width: `${5 + index % 4}px`, height: `${8 + index % 5}px`,
          "--leaf-drift": `${index % 2 ? -25 : 35}px`, "--fall-distance": "140px",
          animationDelay: `${index * .025}s`,
        } as CSSProperties} />)}
      </div>}
    </div>
    <button className="tree-touch" aria-label="Acariciar el árbol" title="Acariciar el árbol" onClick={() => {
      if (burst || paused || (!active && !reduced)) return;
      setBurst(true);
      burstTimer.current = setTimeout(() => { setBurst(false); burstTimer.current = null; }, 2000);
    }} />
  </div>;
}
