"use client";

import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from "react";
import Link from "next/link";
import { Application, Assets, BlurFilter, Container, Graphics, Sprite, Texture } from "pixi.js";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, Flower2, LoaderCircle, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { LetterOverlay } from "@/components/ui/LetterOverlay";
import { MessageOverlay } from "@/components/ui/MessageOverlay";
import { DiaryOverlay } from "@/components/ui/DiaryOverlay";
import { previewRepository } from "./preview-repository";
import { messages } from "./messages";
import { Atmosphere } from "./Atmosphere";
import { HistoricSky } from "./HistoricSky";
import { GardenSky, SkyField, useSkyView } from "./SkyField";
import { TreeBreeze } from "./TreeBreeze";
import { HouseFinish } from "./HouseFinish";
import { HouseSign } from "./HouseSign";
import { GardenCompanion } from "./GardenCompanion";
import { TerrainForeground } from "./TerrainForeground";

type Overlay = "letter" | "diary" | "message" | null;
const assetPaths = ["/proposal/garden-portrait.webp", "/proposal/garden-landscape.webp", "/proposal/tulip.webp"];

export function ProposalGarden({ main = false, blocked = false, musicControl }: { main?: boolean; blocked?: boolean; musicControl?: Ref<{ start: () => void }> }) {
  const host = useRef<HTMLDivElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const skyView = useSkyView(scroll);
  const atGarden = useRef(true);
  const [constellations, setConstellations] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const fadeFrame = useRef(0);
  const parallax = useRef({ x: 0, y: 0 });
  const musicPending = useRef(false);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [message, setMessage] = useState("");
  const [sound, setSound] = useState(false);
  const paused = useRef(false);
  const deck = useRef<number[]>([]);
  const lastMessage = useRef(-1);
  const lastTap = useRef({ index: -1, time: -Infinity });

  useEffect(() => { paused.current = overlay !== null || blocked; }, [overlay, blocked]);

  useLayoutEffect(() => {
    const element = scroll.current;
    if (!element) return;
    const alignGarden = () => {
      if (atGarden.current) element.scrollTop = element.scrollHeight - element.clientHeight;
    };
    alignGarden();
    const observer = new ResizeObserver(alignGarden);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const moveView = (garden: boolean) => {
    const element = scroll.current;
    if (!element) return;
    atGarden.current = garden;
    element.scrollTo({ top: garden ? element.scrollHeight : 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let initialized = false;
    let observer: ResizeObserver | undefined;
    let resizeFrame = 0;
    let animate: ((time: number) => void) | undefined;
    let elapsed = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const app = new Application();

    const initialize = async () => {
      try {
        const textures = await Promise.all(assetPaths.map(path => Assets.load<Texture>(path)));
        if (disposed) return;
        await app.init({ width: element.clientWidth, height: element.clientHeight, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true, antialias: true, background: 0x12314f });
        initialized = true;
        if (disposed) { app.destroy(true, { children: true }); return; }
        app.canvas.setAttribute("aria-hidden", "true");
        element.appendChild(app.canvas);
        app.ticker.maxFPS = 45;
        const rebuild = () => {
          if (disposed) return;
          app.renderer.resize(element.clientWidth, element.clientHeight);
          app.stage.removeChildren().forEach(child => child.destroy({ children: true }));
          animate = buildIllustratedScene(app, textures, parallax.current);
        };
        rebuild();
        app.ticker.add(ticker => {
          if (document.hidden || paused.current || reducedMotion.matches) return;
          elapsed += Math.min(50, ticker.deltaMS);
          animate?.(elapsed);
        });
        observer = new ResizeObserver(() => {
          cancelAnimationFrame(resizeFrame);
          resizeFrame = requestAnimationFrame(rebuild);
        });
        observer.observe(element);
        setStatus("ready");
      } catch (error) {
        console.error("Proposal scene could not load", error);
        if (!disposed) setStatus("error");
      }
    };
    void initialize();
    return () => {
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame(resizeFrame);
      if (initialized) app.destroy(true, { children: true });
    };
  }, []);

  useEffect(() => () => cancelAnimationFrame(fadeFrame.current), []);

  const startSound = useCallback(async () => {
    const player = audio.current;
    if (!player || !player.paused || musicPending.current) return;
    musicPending.current = true;
    cancelAnimationFrame(fadeFrame.current);
    player.volume = 0;
    try {
      await player.play();
      setSound(true);
      const start = performance.now();
      const fade = () => {
        const fraction = Math.min(1, (performance.now() - start) / 2500);
        player.volume = fraction * .26;
        if (fraction < 1) fadeFrame.current = requestAnimationFrame(fade);
      };
      fadeFrame.current = requestAnimationFrame(fade);
    } catch { setSound(false); }
    finally { musicPending.current = false; }
  }, []);
  useImperativeHandle(musicControl, () => ({ start: () => { void startSound(); } }), [startSound]);
  const toggleSound = () => {
    if (sound) { cancelAnimationFrame(fadeFrame.current); audio.current?.pause(); setSound(false); }
    else void startSound();
  };

  const showMessage = () => {
    if (!deck.current.length) {
      const shuffled = messages.map((_, index) => index);
      for (let i = shuffled.length - 1; i > 0; i--) {
        const random = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
        const j = Math.floor(random * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      if (shuffled.at(-1) === lastMessage.current) [shuffled[0], shuffled[shuffled.length - 1]] = [shuffled[shuffled.length - 1], shuffled[0]];
      deck.current = shuffled;
    }
    const index = deck.current.pop()!;
    lastMessage.current = index;
    setMessage(messages[index]);
    setOverlay("message");
  };

  return (
    <main className="proposal-garden" aria-label="Nuestro jardín">
      <audio ref={audio} src="/music/until-i-found-you.mp3" loop preload="auto" />
      <div className="proposal-scroll" ref={scroll} inert={overlay !== null || blocked} onScroll={event => {
        const element = event.currentTarget;
        atGarden.current = element.scrollHeight - element.clientHeight - element.scrollTop < 8;
      }}>
      <HistoricSky view={skyView} revealed={constellations} onToggle={() => setConstellations(value => !value)} onReturn={() => moveView(true)} />
      <div className="proposal-world" inert={overlay !== null || blocked} onPointerMove={event => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const box = event.currentTarget.getBoundingClientRect();
        parallax.current.x = ((event.clientX - box.left) / box.width - .5) * 6;
        parallax.current.y = ((event.clientY - box.top) / box.height - .5) * 3;
        event.currentTarget.style.setProperty("--parallax-x", `${((event.clientX - box.left) / box.width - .5) * 4}px`);
        event.currentTarget.style.setProperty("--parallax-y", `${((event.clientY - box.top) / box.height - .5) * 3}px`);
      }} onPointerLeave={event => {
        parallax.current.x = 0; parallax.current.y = 0;
        event.currentTarget.style.setProperty("--parallax-x", "0px");
        event.currentTarget.style.setProperty("--parallax-y", "0px");
      }}>
        <div ref={host} className="proposal-canvas" />
        {status === "ready" && <>
          <GardenSky view={skyView} revealed={constellations} />
          <TreeBreeze host={host} portrait={skyView.height >= skyView.width} paused={overlay !== null || blocked} />
          <HouseFinish portrait={skyView.height >= skyView.width} />
          <Atmosphere />
          <GardenCompanion portrait={skyView.height >= skyView.width} paused={overlay !== null || blocked} />
          <TerrainForeground portrait={skyView.height >= skyView.width} />
          <SkyField view={skyView} revealed={constellations} labelsOnly />
          <button className="proposal-sky-toggle" aria-label={constellations ? "Ocultar constelaciones del jardín" : "Mostrar constelaciones del jardín"} aria-pressed={constellations} onClick={() => setConstellations(value => !value)} />
          <button className="proposal-hotspot proposal-house" aria-label="Abrir diario" title="diario" onClick={() => setOverlay("diary")} />
          <button className="proposal-hotspot proposal-tulip" aria-label="Abrir carta del tulipán" title="Abrir carta" onPointerDown={event => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            event.currentTarget.firstElementChild?.animate([{ opacity: 0, transform: "scale(.8)" }, { opacity: .85, offset: .25 }, { opacity: 0, transform: "scale(1.3)" }], { duration: 600 });
          }} onClick={() => setOverlay("letter")}><span className="tulip-touch-glint" aria-hidden="true" /></button>
          {[0, 1, 2, 3].map(index => <button key={index} className={`proposal-hotspot proposal-flowers proposal-flowers-${index}`} aria-label={`Una flor para ti ${index + 1}`} title="Una flor para ti" onClick={event => {
            const now = performance.now();
            if (event.detail === 0 || (lastTap.current.index === index && now - lastTap.current.time < 650)) {
              showMessage();
              lastTap.current = { index: -1, time: -Infinity };
            } else lastTap.current = { index, time: now };
          }} />)}
          <p className="proposal-prompt">Para ti</p>
          <HouseSign />
          <nav className="proposal-tools" aria-label="Controles del jardín">
            <Link href={main ? "/anterior" : "/"} className="proposal-control" aria-label={main ? "Ver jardín anterior" : "Volver al jardín actual"} title={main ? "Ver jardín anterior" : "Volver al jardín actual"}><ArrowLeft size={20} /></Link>
            <div className="proposal-shortcuts">
              <button className="proposal-control" title="Abrir carta" aria-label="Abrir carta" onClick={() => setOverlay("letter")}><Flower2 size={20} /></button>
              <button className="proposal-control proposal-notebook" title="Abrir álbum" aria-label="Abrir álbum" onClick={() => setOverlay("diary")}><BookOpen size={23} /></button>
              <button className="proposal-control" title={sound ? "Silenciar música" : "Activar música"} aria-label={sound ? "Silenciar música" : "Activar música"} aria-pressed={sound} onClick={toggleSound}>{sound ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
            </div>
          </nav>
        </>}
      </div>
      </div>
      {status !== "ready" && <div className="proposal-loading" role="status">
        {status === "loading" ? <><LoaderCircle className="proposal-spinner" size={25} /><p>Un jardincito para ti</p></> : <><p>No se pudo cargar el jardín.</p><button className="proposal-retry" onClick={() => window.location.reload()}><RefreshCw size={18} />Reintentar</button><Link href="/">Volver al jardín actual</Link></>}
      </div>}
      <AnimatePresence>
        {overlay === "letter" && <LetterOverlay onClose={() => setOverlay(null)} />}
        {overlay === "diary" && <DiaryOverlay repository={main ? undefined : previewRepository} onClose={() => setOverlay(null)} />}
        {overlay === "message" && <MessageOverlay title="Una flor para ti" body={message} onClose={() => setOverlay(null)} />}
      </AnimatePresence>
    </main>
  );
}

function buildIllustratedScene(app: Application, textures: Texture[], parallax: { x: number; y: number }) {
  const w = app.screen.width;
  const h = app.screen.height;
  const portrait = h >= w;
  const scene = new Container();
  app.stage.addChild(scene);
  const background = new Sprite(textures[portrait ? 0 : 1]);
  background.width = w;
  background.height = h;
  scene.addChild(background);

  // Four shallow terraces follow the lawn, leaving the pond and path open.
  const levels = portrait ? [.53, .62, .76, .91] : [.58, .70, .84, .96];
  const greens = [0x617b49, 0x456c45, 0x345d44, 0x214b3e];
  const terrain = levels.map((level, index) => {
    const band = new Container();
    band.zIndex = index;
    const ranges = index === 0 ? [[0, .37], [.72, 1]] : index === 1 ? [[.64, 1]] : index === 2 ? [[.05, .43], [.83, 1]] : [[0, .38], [.79, 1]];
    for (const [left, right] of ranges) {
      const x = w * left, end = w * right, y = h * level;
      const drop = h * (.003 + index * .001);
      const slope = h * (.008 + index * .002);
      const edge = new Graphics();
      edge.moveTo(x, y).bezierCurveTo(x + (end-x)*.35, y + slope, x + (end-x)*.7, y - slope, end, y).bezierCurveTo(x + (end-x)*.7, y - slope + drop * 3, x + (end-x)*.35, y + slope + drop * 3, x, y).closePath().fill({ color: 0x152e27, alpha: .16 });
      edge.moveTo(x, y).bezierCurveTo(x + (end-x)*.35, y + slope, x + (end-x)*.7, y - slope, end, y).bezierCurveTo(x + (end-x)*.7, y - slope + drop, x + (end-x)*.35, y + slope + drop, x, y).closePath().fill({ color: 0x79684b, alpha: .32 });
      edge.moveTo(x, y).bezierCurveTo(x + (end-x)*.35, y + slope - drop * 7, x + (end-x)*.7, y - slope - drop * 7, end, y).bezierCurveTo(x + (end-x)*.7, y - slope, x + (end-x)*.35, y + slope, x, y).closePath().fill({ color: greens[index], alpha: .32 });
      band.addChild(edge);
    }
    scene.addChild(band);
    return band;
  });

  const tulip = new Sprite(textures[2]);
  tulip.anchor.set(.5, .96);
  tulip.height = h * (portrait ? .26 : .34);
  tulip.width = tulip.height * textures[2].width / textures[2].height;
  tulip.position.set(w * (portrait ? .75 : .54), h * (portrait ? .89 : .95));
  const tulipScale = tulip.scale.x;
  const shadow = new Graphics();
  shadow.ellipse(tulip.x, tulip.y, tulip.width * .30, tulip.height * .024).fill(0x102c27);
  shadow.alpha = .3;
  shadow.filters = [new BlurFilter({ strength: 3, quality: 2 })];
  scene.addChild(shadow);
  const halo = new Graphics();
  halo.ellipse(tulip.x, tulip.y - tulip.height * .73, tulip.width * .30, tulip.height * .22).fill({ color: 0xc49aee, alpha: .14 });
  halo.filters = [new BlurFilter({ strength: 14, quality: 2 })];
  scene.addChild(halo);
  scene.addChild(tulip);
  const grass = new Graphics();
  const unit = tulip.height * .075;
  for (let i = 0; i < 9; i++) {
    const x = tulip.x + (i - 4) * unit * .22;
    const y = tulip.y + unit * .13;
    const lean = (i % 3 - 1) * unit * .45;
    const height = unit * (.55 + (i % 4) * .16);
    grass.moveTo(x - unit * .1, y).quadraticCurveTo(x + lean * .3, y - height * .5, x + lean, y - height).quadraticCurveTo(x + unit * .2, y - height * .4, x + unit * .1, y).closePath().fill(i % 2 ? 0x618852 : 0x365a40);
  }
  scene.addChild(grass);

  const pond = { x: w * (portrait ? .24 : .225), y: h * (portrait ? .62 : .74) };
  const fish = [0, 1].map(index => {
    const node = new Container();
    const size = Math.min(w, h) * (portrait ? .03 : .024);
    const shape = new Graphics();
    shape.ellipse(0, 0, size, size * .4).fill(index ? 0xf58a52 : 0xffb454);
    shape.moveTo(-size * .7, 0).lineTo(-size * 1.5, -size * .45).lineTo(-size * 1.4, size * .4).closePath().fill(0xf18450);
    shape.ellipse(-size * .15, -size * .14, size * .45, size * .13).fill({ color: 0xffe5a5, alpha: .7 });
    shape.circle(size * .55, -size * .08, Math.max(1, size * .1)).fill(0x3e5254);
    node.addChild(shape);
    node.alpha = .82;
    scene.addChild(node);
    return node;
  });
  const ripples = [0, 1, 2].map(index => {
    const ripple = new Graphics();
    ripple.ellipse(0, 0, w * .06, h * .009).stroke({ width: 1, color: 0xbcebe0, alpha: .35 });
    ripple.position.set(pond.x + (index - 1) * w * .05, pond.y + (index - 1) * h * .016);
    scene.addChild(ripple);
    return ripple;
  });

  const update = (time: number) => {
    terrain.forEach((band, index) => {
      const factor = [.15, .4, .8, 1.3][index];
      band.x += (parallax.x * factor - band.x) * .06;
      band.y += (parallax.y * factor - band.y) * .06;
    });
    grass.skew.x = Math.sin(time * Math.PI * 2 / 7000) * .012;
    tulip.rotation = Math.sin(time * .0007) * .012;
    tulip.scale.set(tulipScale * (1 + Math.sin(time * .0012) * .004));
    fish.forEach((node, index) => {
      const t = time * .0003 + index * Math.PI;
      node.position.set(pond.x + Math.sin(t) * w * .045, pond.y + Math.cos(t * 1.25) * h * .014);
      node.scale.x = Math.cos(t) >= 0 ? 1 : -1;
      node.rotation = Math.sin(t * 3) * .08;
      node.alpha = Math.max(0, Math.sin(time * .00016 + index * 2) - .25) * .7;
    });
    ripples.forEach((node, index) => {
      const cycle = (time * .0002 + index / 3) % 1;
      node.scale.set(.55 + cycle * .7);
      node.alpha = Math.sin(cycle * Math.PI) * .5;
    });
  };
  update(0);
  return update;
}
