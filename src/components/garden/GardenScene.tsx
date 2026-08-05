"use client";

import { useEffect, useRef, useState } from "react";
import {
  Application,
  Container,
  Graphics,
  Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
import { AnimatePresence } from "framer-motion";
import { DiaryOverlay } from "@/components/ui/DiaryOverlay";
import { LetterOverlay } from "@/components/ui/LetterOverlay";
import { MessageOverlay } from "@/components/ui/MessageOverlay";
import { Particles } from "@/components/garden/Particles";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

type GardenPhase = "loading" | "waiting" | "growing" | "bloomed" | "letter";

interface BloomParts {
  root: Container;
  seed: Container;
  leftShell: Graphics;
  rightShell: Graphics;
  stem: Graphics;
  leafLeft: Graphics;
  leafRight: Graphics;
  flower: Container;
  flowerCore: Graphics;
  glow: Graphics;
}

interface FlowerMessage {
  title: string;
  body: string;
}

interface Firefly {
  node: Container;
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
  range: number;
}

interface Butterfly {
  node: Container;
  leftWing: Graphics;
  rightWing: Graphics;
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
  range: number;
}

interface SkyBird {
  node: Container;
  baseX: number;
  baseY: number;
  speed: number;
  phase: number;
}

interface FallingLeaf {
  node: Graphics;
  baseX: number;
  baseY: number;
  speed: number;
  drift: number;
  phase: number;
}

interface PondFish {
  node: Container;
  baseX: number;
  baseY: number;
  width: number;
  speed: number;
  phase: number;
}

type GardenFlowerType = "daisy" | "tulip" | "sunflower" | "rose";

const flowerMessages: FlowerMessage[] = [
  {
    title: "Feliz 19",
    body: "Quer\u00eda ser de las primeras personas en desearte un feliz cumplea\u00f1os n\u00famero 19, lleno de salud, alegr\u00eda y momentos bonitos.",
  },
  {
    title: "Con el coraz\u00f3n",
    body: "Tal vez no encuentre las palabras perfectas, pero cada una de ellas es sincera y nace de todo lo bonito que siento por ti.",
  },
  {
    title: "Qu\u00e9 r\u00e1pido pasa",
    body: "Ya son 19 a\u00f1os. Me alegra poder celebrar otro cumplea\u00f1os contigo y guardar este momento en nuestro jard\u00edn.",
  },
  {
    title: "Una sonrisa",
    body: "Espero que cuando vuelvas a ver este detalle alg\u00fan d\u00eda, recuerdes este momento con una sonrisa.",
  },
  {
    title: "Nueva etapa",
    body: "Este es tu \u00faltimo a\u00f1o con el 1 al inicio de tu edad. Lo mejor de esta nueva etapa todav\u00eda est\u00e1 por llegar.",
  },
  {
    title: "Sin miedo",
    body: "Crecer puede dar miedo, pero no dejes que ese miedo sea m\u00e1s grande que tus sue\u00f1os.",
  },
  {
    title: "Lo mucho que vales",
    body: "Nunca olvides lo mucho que vales. Eres inteligente, fuerte y capaz de lograr aquello que te propongas.",
  },
  {
    title: "Podr\u00e1s con todo",
    body: "Todav\u00eda quedan retos por superar, pero estoy seguro de que podr\u00e1s con cada uno de ellos.",
  },
  {
    title: "Violeta que crece",
    body: "Admiro la persona en la que te est\u00e1s convirtiendo: alguien que lucha, aprende y nunca deja de crecer.",
  },
  {
    title: "No lo olvides",
    body: "No dejes que nadie te haga creer que no puedes. Tienes una luz y una fuerza muy tuyas.",
  },
  {
    title: "Tu sonrisa",
    body: "Si pudiera pedir un regalo, ser\u00eda que nunca dejaras de sonre\u00edr. Tu sonrisa alegra m\u00e1s de lo que imaginas.",
  },
  {
    title: "Siempre apoyo",
    body: "Quiero seguir apoy\u00e1ndote de cerca o de lejos, en tus alegr\u00edas, tus metas y tus d\u00edas dif\u00edciles.",
  },
  {
    title: "Yo creo en ti",
    body: "Cuando necesites que alguien crea en ti, recuerda esta flor: yo siempre creer\u00e9 en ti.",
  },
  {
    title: "M\u00e1s momentos",
    body: "Le pido a Dios que nos permita compartir muchos momentos juntos y celebrar muchos cumplea\u00f1os m\u00e1s.",
  },
  {
    title: "Recuerdos bonitos",
    body: "Ojal\u00e1 pueda seguir regal\u00e1ndote peque\u00f1os detalles, pero sobre todo muchos recuerdos bonitos.",
  },
  {
    title: "Verte feliz",
    body: "No s\u00e9 qu\u00e9 nos depare el futuro, pero s\u00ed deseo verte feliz y orgullosa de la gran mujer que eres.",
  },
  {
    title: "Nunca dudes",
    body: "Aunque alguna vez puedas dudarlo, nunca dudes del enorme cari\u00f1o y amor que siento por ti.",
  },
  {
    title: "Gracias",
    body: "Gracias por permitirme compartir un pedacito de tu vida y por hacer la m\u00eda m\u00e1s bonita desde que llegaste.",
  },
  {
    title: "Princesa hermosa",
    body: "Feliz cumplea\u00f1os, mi princesa hermosa. Que Dios bendiga tus pasos y los deseos m\u00e1s bonitos de tu coraz\u00f3n.",
  },
];

const colors = {
  skyTop: { r: 78, g: 66, b: 157 },
  skyMid: { r: 236, g: 93, b: 119 },
  skyGlow: { r: 255, g: 174, b: 75 },
  skyBottom: { r: 255, g: 221, b: 132 },
  farHill: 0x755fa5,
  nearHill: 0x3f8b57,
  grass: 0x2f7f3e,
  grassLight: 0x57a948,
  grassDark: 0x174f2e,
  path: 0xc58a48,
  pathLight: 0xe7b76b,
  houseWall: 0xf4c985,
  houseShade: 0xb87647,
  roof: 0x8c315b,
  roofLight: 0xc04a73,
  trunk: 0x5c321d,
  trunkLight: 0xa45725,
  leafDark: 0x123f21,
  leaf: 0x2f752e,
  leafLight: 0x74a832,
  flowerPink: 0xf25c83,
  flowerPurple: 0x7d48d8,
  flowerYellow: 0xffc43d,
  flowerWhite: 0xfff5db,
  lake: 0x2f95aa,
  lakeDeep: 0x1d677f,
  lakeLight: 0x92dddf,
  seed: 0x7b4b28,
  seedLight: 0xd58b3d,
};

export function GardenScene() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<GardenPhase>("loading");
  const tickerRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<GardenPhase>("loading");
  const [loadProgress, setLoadProgress] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState<FlowerMessage | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const host = canvasRef.current;
    if (!host) return;

    let destroyed = false;
    let growElapsed = 0;
    let idleElapsed = 0;
    let cleanupResize: (() => void) | undefined;
    const app = new Application();

    const init = async () => {
      await app.init({
        antialias: true,
        autoDensity: true,
        background: 0x4e429d,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        width: host.clientWidth,
        height: host.clientHeight,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      host.appendChild(app.canvas as HTMLCanvasElement);
      const stage = new Container();
      app.stage.addChild(stage);

      const buildScene = () => {
        if (tickerRef.current) app.ticker.remove(tickerRef.current);
        stage.removeChildren();

        const w = app.screen.width;
        const h = app.screen.height;
        const groundY = h * 0.58;
        const min = Math.min(w, h);

        drawStorybookLandscape(stage, w, h, groundY);
        const pondFish = drawLake(stage, w * 0.35, groundY + h * 0.18, min * 0.22);
        const fireflies = drawFireflies(stage, w, h, groundY);
        const butterflies = drawButterflies(stage, w, h, groundY);
        const birds = drawSkyBirds(stage, w, h);
        const leaves = drawFallingLeaves(stage, w, h);

        const houseHotspot = drawHouse(stage, w * 0.77, groundY - h * 0.01, min * 0.28);
        houseHotspot.on("pointertap", () => setDiaryOpen(true));

        drawInteractiveFlowers(stage, w, h, groundY, (message) => {
          if (phaseRef.current !== "loading") setActiveMessage(message);
        });

        const parts = drawSeedAndFlower(stage, w * 0.5, groundY + h * 0.02, min);
        const prompt = drawPrompt(stage, w / 2, h * 0.9, "toca la semilla");

        parts.seed.eventMode = "static";
        parts.seed.cursor = "pointer";
        parts.seed.hitArea = new Rectangle(-76, -98, 152, 132);
        parts.seed.on("pointertap", () => {
          if (phaseRef.current !== "waiting") return;
          growElapsed = 0;
          prompt.text = "";
          setPhase("growing");
          setShowParticles(true);
        });

        parts.flower.eventMode = "static";
        parts.flower.cursor = "pointer";
        parts.flower.hitArea = new Rectangle(-90, -96, 180, 180);
        parts.flower.on("pointertap", () => {
          if (phaseRef.current === "bloomed") setPhase("letter");
        });

        const update = () => {
          idleElapsed += app.ticker.deltaMS;
          const t = idleElapsed;

          swayByName(stage, "ambient", t, 0.001, 2.4);
          swayByName(stage, "tree-canopy", t, 0.0009, 1.2);
          animateFireflies(fireflies, t);
          animateButterflies(butterflies, t);
          animateSkyBirds(birds, t, w);
          animateFallingLeaves(leaves, t, h, groundY);
          animatePondFish(pondFish, t);
          parts.seed.y = Math.sin(t * 0.002) * 5;
          parts.glow.alpha = 0.34 + Math.sin(t * 0.003) * 0.16;
          prompt.alpha = 0.62 + Math.sin(t * 0.003) * 0.28;
          prompt.y = h * 0.9 + Math.sin(t * 0.002) * 3;

          if (phaseRef.current === "bloomed" || phaseRef.current === "letter") {
            parts.root.rotation = Math.sin(t * 0.0011) * 0.025;
            parts.flower.scale.set(1 + Math.sin(t * 0.002) * 0.018);
          }

          if (phaseRef.current !== "growing") return;

          growElapsed += app.ticker.deltaMS;
          animateBloom(parts, growElapsed);

          if (growElapsed >= 3600) {
            prompt.text = "toca la flor o explora la casa";
            setPhase("bloomed");
          }
        };

        tickerRef.current = update;
        app.ticker.add(update);
      };

      buildScene();

      const resize = () => {
        if (destroyed) return;
        app.renderer.resize(host.clientWidth, host.clientHeight);
        buildScene();
      };

      window.addEventListener("resize", resize);
      cleanupResize = () => window.removeEventListener("resize", resize);

      const loadingTimer = window.setInterval(() => {
        setLoadProgress((current) => {
          const next = Math.min(current + 16, 100);
          if (next >= 100) {
            window.clearInterval(loadingTimer);
            window.setTimeout(() => setPhase("waiting"), 250);
          }
          return next;
        });
      }, 75);

      cleanupResize = () => {
        window.removeEventListener("resize", resize);
        window.clearInterval(loadingTimer);
      };
    };

    void init();

    return () => {
      destroyed = true;
      cleanupResize?.();
      if (tickerRef.current) app.ticker.remove(tickerRef.current);
      try {
        app.ticker.stop();
        app.stage.removeChildren();
        const canvas = host.querySelector("canvas");
        if (canvas) host.removeChild(canvas);
        app.destroy(false);
      } catch {
        // Hot reload can dispose the canvas before Pixi finishes cleanup.
      }
    };
  }, []);

  return (
    <>
      {phase === "loading" && <LoadingScreen progress={loadProgress} visible />}
      <div ref={canvasRef} className="fixed inset-0 h-full w-full" />
      {showParticles && <Particles />}
      <AnimatePresence>
        {phase === "letter" && (
          <LetterOverlay onClose={() => setPhase("bloomed")} />
        )}
        {diaryOpen && <DiaryOverlay onClose={() => setDiaryOpen(false)} />}
        {activeMessage && (
          <MessageOverlay
            title={activeMessage.title}
            body={activeMessage.body}
            onClose={() => setActiveMessage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function drawStorybookLandscape(parent: Container, w: number, h: number, groundY: number) {
  const sky = new Graphics();
  multiGradientRect(sky, 0, 0, w, h, [
    colors.skyTop,
    colors.skyMid,
    colors.skyGlow,
    colors.skyBottom,
  ]);
  parent.addChild(sky);

  drawSunset(sky, w * 0.48, groundY - h * 0.13, Math.min(w, h) * 0.075);
  drawCloud(parent, w * 0.18, h * 0.18, Math.min(w, h) * 0.08, 0xffa766, 0.5);
  drawCloud(parent, w * 0.83, h * 0.14, Math.min(w, h) * 0.1, 0xffa76d, 0.68);
  drawDistantHills(parent, w, h, groundY);
  drawFence(parent, w, groundY + h * 0.035, Math.min(w, h));
  drawGround(parent, w, h, groundY);
  drawLargeTree(parent, w * 0.1, groundY + h * 0.03, Math.min(w, h));
  drawStonePath(parent, w, h, groundY);
  drawFlowerArch(parent, w * 0.55, groundY + h * 0.02, Math.min(w, h) * 0.16);
  drawBushes(parent, w, h, groundY);
}

function drawGround(parent: Container, w: number, h: number, groundY: number) {
  const ground = new Graphics();
  ground.rect(0, groundY, w, h - groundY).fill({ color: colors.grass });
  ground.rect(0, groundY, w, h * 0.08).fill({ color: colors.grassLight, alpha: 0.42 });
  ground.ellipse(w * 0.15, groundY + h * 0.22, w * 0.22, h * 0.08).fill({ color: colors.grassDark, alpha: 0.16 });
  ground.ellipse(w * 0.72, groundY + h * 0.27, w * 0.28, h * 0.09).fill({ color: 0x123f25, alpha: 0.16 });
  ground.ellipse(w * 0.5, groundY + h * 0.12, w * 0.16, h * 0.05).fill({ color: 0x82bd47, alpha: 0.12 });
  parent.addChild(ground);

  const ambient = new Container();
  ambient.label = "ambient";
  parent.addChild(ambient);

  for (let i = 0; i < 54; i++) {
    const blade = new Graphics();
    const x = w * ((i * 0.071 + 0.03) % 1);
    const y = groundY + h * (0.03 + ((i * 0.113) % 0.36));
    blade.moveTo(x, y);
    blade.quadraticCurveTo(x + ((i % 2) ? 7 : -7), y - 18, x + ((i % 2) ? 11 : -11), y - 28);
    blade.stroke({ color: i % 3 === 0 ? 0x80c85a : 0x3f9848, width: 2, alpha: 0.48 });
    ambient.addChild(blade);
  }

  for (let i = 0; i < 95; i++) {
    const speck = new Graphics();
    const x = w * ((i * 0.113 + 0.021) % 1);
    const y = groundY + h * (0.02 + ((i * 0.071) % 0.38));
    const color = [0x78c95a, 0x255f35, 0xffd25d, 0xf6e7a4][i % 4];
    speck.circle(x, y, 1.2 + (i % 3) * 0.55).fill({ color, alpha: i % 4 === 3 ? 0.28 : 0.36 });
    ambient.addChild(speck);
  }
}

function drawDistantHills(parent: Container, w: number, h: number, groundY: number) {
  const back = new Graphics();
  back.moveTo(0, groundY - h * 0.02);
  back.bezierCurveTo(w * 0.18, groundY - h * 0.24, w * 0.36, groundY - h * 0.02, w * 0.52, groundY - h * 0.18);
  back.bezierCurveTo(w * 0.72, groundY - h * 0.36, w * 0.9, groundY - h * 0.03, w, groundY - h * 0.16);
  back.lineTo(w, groundY + h * 0.08);
  back.lineTo(0, groundY + h * 0.08);
  back.closePath();
  back.fill({ color: colors.farHill, alpha: 0.5 });
  parent.addChild(back);

  const front = new Graphics();
  front.moveTo(0, groundY + h * 0.035);
  front.bezierCurveTo(w * 0.18, groundY - h * 0.13, w * 0.35, groundY + h * 0.06, w * 0.5, groundY - h * 0.08);
  front.bezierCurveTo(w * 0.68, groundY - h * 0.22, w * 0.85, groundY + h * 0.06, w, groundY - h * 0.06);
  front.lineTo(w, groundY + h * 0.12);
  front.lineTo(0, groundY + h * 0.12);
  front.closePath();
  front.fill({ color: colors.nearHill, alpha: 0.76 });
  parent.addChild(front);
}

function drawLake(parent: Container, x: number, y: number, s: number): PondFish[] {
  const pond = new Container();
  parent.addChild(pond);

  const shadow = new Graphics();
  shadow.ellipse(x, y + s * 0.12, s * 1.12, s * 0.34).fill({ color: 0x0d332f, alpha: 0.28 });
  pond.addChild(shadow);

  const water = new Graphics();
  water.ellipse(x, y, s, s * 0.34).fill({ color: colors.lakeDeep, alpha: 0.96 });
  water.ellipse(x - s * 0.04, y - s * 0.02, s * 0.92, s * 0.29).fill({ color: colors.lake, alpha: 0.9 });
  water.ellipse(x - s * 0.22, y - s * 0.08, s * 0.36, s * 0.055).fill({ color: colors.lakeLight, alpha: 0.58 });
  water.ellipse(x + s * 0.32, y + s * 0.02, s * 0.28, s * 0.04).fill({ color: 0xb8f2e7, alpha: 0.35 });
  water.stroke({ color: 0x164b52, width: Math.max(3, s * 0.035), alpha: 0.5 });
  pond.addChild(water);

  for (let i = 0; i < 12; i++) {
    const reed = new Graphics();
    const rx = x - s * 0.92 + ((i * 0.17) % 1.84) * s;
    const ry = y + s * (0.19 + (i % 3) * 0.03);
    reed.moveTo(rx, ry);
    reed.quadraticCurveTo(rx + (i % 2 ? 8 : -8), ry - s * 0.22, rx + (i % 2 ? 14 : -14), ry - s * 0.36);
    reed.stroke({ color: 0x2a7a35, width: 3, alpha: 0.8 });
    reed.ellipse(rx + (i % 2 ? 14 : -14), ry - s * 0.36, 4, 10).fill({ color: 0x996c31, alpha: 0.85 });
    pond.addChild(reed);
  }

  const fish: PondFish[] = [];
  const fishSpecs = [
    { dx: -0.42, dy: -0.03, c: 0xff9b54, speed: 0.00012 },
    { dx: 0.16, dy: 0.05, c: 0xffd36b, speed: 0.0001 },
    { dx: 0.42, dy: -0.07, c: 0xff7f86, speed: 0.00014 },
  ];

  fishSpecs.forEach((spec, index) => {
    const node = new Container();
    node.x = x + s * spec.dx;
    node.y = y + s * spec.dy;
    node.alpha = 0.78;
    const body = new Graphics();
    body.ellipse(0, 0, s * 0.075, s * 0.033).fill({ color: spec.c, alpha: 0.92 });
    body.moveTo(-s * 0.07, 0).lineTo(-s * 0.13, -s * 0.045).lineTo(-s * 0.13, s * 0.045).closePath();
    body.fill({ color: spec.c, alpha: 0.84 });
    body.circle(s * 0.045, -s * 0.008, 1.8).fill({ color: 0x2b1d31, alpha: 0.8 });
    node.addChild(body);
    pond.addChild(node);
    fish.push({
      node,
      baseX: node.x,
      baseY: node.y,
      width: s * 0.72,
      speed: spec.speed,
      phase: index * 1.6,
    });
  });

  return fish;
}

function drawBushes(parent: Container, w: number, h: number, groundY: number) {
  const specs = [
    { x: 0.05, y: 0.05, s: 0.18 },
    { x: 0.14, y: 0.1, s: 0.13 },
    { x: 0.64, y: 0.06, s: 0.15 },
    { x: 0.93, y: 0.13, s: 0.16 },
    { x: 0.72, y: 0.24, s: 0.11 },
  ];

  specs.forEach((spec, index) => {
    const x = w * spec.x;
    const y = groundY + h * spec.y;
    const s = Math.min(w, h) * spec.s;
    const bush = new Graphics();
    bush.ellipse(x, y + s * 0.34, s * 0.82, s * 0.18).fill({ color: 0x123f25, alpha: 0.28 });
    bush.circle(x - s * 0.38, y, s * 0.32).fill({ color: index % 2 ? 0x2d742d : 0x1e5e2c });
    bush.circle(x - s * 0.08, y - s * 0.12, s * 0.38).fill({ color: 0x3e8f35 });
    bush.circle(x + s * 0.28, y, s * 0.33).fill({ color: 0x2f752e });
    bush.circle(x + s * 0.05, y + s * 0.08, s * 0.36).fill({ color: 0x4c9a3b, alpha: 0.88 });
    for (let i = 0; i < 7; i++) {
      bush.circle(
        x - s * 0.38 + ((i * 0.19) % 0.82) * s,
        y - s * 0.14 + ((i * 0.11) % 0.34) * s,
        s * 0.025,
      ).fill({ color: [0xff9fb8, 0xffd36b, 0xfff5db][i % 3], alpha: 0.9 });
    }
    parent.addChild(bush);
  });
}

function drawLargeTree(parent: Container, x: number, y: number, min: number) {
  const tree = new Container();
  parent.addChild(tree);

  const s = min * 0.43;
  const trunk = new Graphics();
  trunk.moveTo(x - s * 0.23, y);
  trunk.bezierCurveTo(x - s * 0.12, y - s * 0.32, x - s * 0.18, y - s * 0.62, x + s * 0.02, y - s * 0.92);
  trunk.bezierCurveTo(x + s * 0.12, y - s * 0.72, x + s * 0.1, y - s * 0.26, x + s * 0.2, y);
  trunk.closePath();
  trunk.fill({ color: colors.trunk });
  trunk.stroke({ color: 0x2f180f, width: 4, alpha: 0.5 });

  for (let i = 0; i < 5; i++) {
    trunk.moveTo(x - s * 0.07, y - s * (0.42 + i * 0.08));
    trunk.quadraticCurveTo(x + s * (0.2 + i * 0.08), y - s * (0.56 + i * 0.05), x + s * (0.56 + i * 0.04), y - s * (0.64 + i * 0.08));
    trunk.stroke({ color: colors.trunkLight, width: Math.max(5, s * 0.035), alpha: 0.8 });
  }
  for (let i = 0; i < 10; i++) {
    const bx = x - s * 0.12 + ((i * 0.037) % 0.24) * s;
    trunk.moveTo(bx, y - s * (0.08 + i * 0.07));
    trunk.quadraticCurveTo(bx + (i % 2 ? 10 : -8), y - s * (0.14 + i * 0.07), bx + (i % 2 ? 4 : -6), y - s * (0.2 + i * 0.07));
    trunk.stroke({ color: 0x2a160e, width: 2, alpha: 0.28 });
  }
  tree.addChild(trunk);

  const canopy = new Container();
  canopy.label = "tree-canopy";
  tree.addChild(canopy);
  const blobs = [
    [-0.2, -0.98, 0.38, colors.leafDark],
    [0.08, -1.12, 0.46, colors.leaf],
    [0.42, -0.98, 0.38, colors.leafLight],
    [0.72, -0.77, 0.34, colors.leaf],
    [0.16, -0.74, 0.36, colors.leafDark],
    [0.48, -1.18, 0.28, colors.leafLight],
  ];
  for (const [dx, dy, r, color] of blobs) {
    const leaf = new Graphics();
    leaf.circle(x + s * dx, y + s * dy, s * r).fill({ color });
    canopy.addChild(leaf);
  }

  for (let i = 0; i < 9; i++) {
    const glow = new Graphics();
    glow.circle(x + s * (-0.22 + ((i * 0.19) % 0.95)), y - s * (0.52 + ((i * 0.13) % 0.55)), 3).fill({ color: 0xffdc64, alpha: 0.92 });
    glow.circle(glow.x, glow.y, 10).fill({ color: 0xffdc64, alpha: 0.12 });
    canopy.addChild(glow);
  }
}

function drawHouse(parent: Container, x: number, y: number, s: number) {
  const hotspot = new Container();
  hotspot.eventMode = "static";
  hotspot.cursor = "pointer";
  hotspot.hitArea = new Rectangle(-s * 0.62, -s * 0.95, s * 1.24, s);
  hotspot.x = x;
  hotspot.y = y;
  parent.addChild(hotspot);

  const shadow = new Graphics();
  shadow.ellipse(0, 0, s * 0.58, s * 0.12).fill({ color: 0x0d2f1e, alpha: 0.35 });
  hotspot.addChild(shadow);

  const house = new Graphics();
  house.roundRect(-s * 0.45, -s * 0.56, s * 0.9, s * 0.56, 10).fill({ color: colors.houseWall });
  house.roundRect(-s * 0.36, -s * 0.5, s * 0.72, s * 0.45, 8).fill({ color: 0xffdc9e, alpha: 0.55 });
  house.moveTo(-s * 0.56, -s * 0.56);
  house.lineTo(0, -s * 0.98);
  house.lineTo(s * 0.56, -s * 0.56);
  house.closePath();
  house.fill({ color: colors.roof });
  house.moveTo(-s * 0.46, -s * 0.58);
  house.lineTo(0, -s * 0.88);
  house.lineTo(s * 0.46, -s * 0.58);
  house.stroke({ color: colors.roofLight, width: 5, alpha: 0.75 });
  for (let i = 0; i < 5; i++) {
    const yy = -s * (0.56 + i * 0.07);
    house.moveTo(-s * (0.5 - i * 0.055), yy);
    house.lineTo(s * (0.5 - i * 0.055), yy);
    house.stroke({ color: 0x5f2244, width: 2, alpha: 0.32 });
  }
  for (let i = 0; i < 7; i++) {
    const xx = -s * 0.34 + i * s * 0.11;
    house.moveTo(xx, -s * 0.46);
    house.lineTo(xx + s * 0.025, -s * 0.1);
    house.stroke({ color: 0xc48a5a, width: 1.2, alpha: 0.25 });
  }
  house.roundRect(-s * 0.09, -s * 0.28, s * 0.18, s * 0.28, 9).fill({ color: 0x7b4329 });
  house.circle(0.04 * s, -s * 0.14, 3).fill({ color: 0xffd05c });
  house.roundRect(-s * 0.32, -s * 0.42, s * 0.17, s * 0.15, 5).fill({ color: 0xffdc70 });
  house.roundRect(s * 0.15, -s * 0.42, s * 0.17, s * 0.15, 5).fill({ color: 0xffdc70 });
  house.stroke({ color: colors.houseShade, width: 3, alpha: 0.55 });
  hotspot.addChild(house);

  drawTinyVines(hotspot, -s * 0.42, -s * 0.6, s);
  drawTinyVines(hotspot, s * 0.42, -s * 0.55, s);

  const label = new Text({
    text: "diario",
    style: new TextStyle({
      fill: 0xfff3c5,
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: Math.max(12, s * 0.07),
      fontWeight: "700",
    }),
  });
  label.anchor.set(0.5);
  label.y = s * 0.15;
  hotspot.addChild(label);

  return hotspot;
}

function drawTinyVines(parent: Container, x: number, y: number, s: number) {
  const vine = new Graphics();
  vine.moveTo(x, y);
  vine.bezierCurveTo(x - s * 0.08, y + s * 0.08, x + s * 0.08, y + s * 0.17, x, y + s * 0.29);
  vine.stroke({ color: 0x2f8b3b, width: 4, alpha: 0.8 });
  for (let i = 0; i < 5; i++) {
    vine.circle(x + s * (-0.08 + (i % 2) * 0.16), y + s * (0.06 + i * 0.055), s * 0.025).fill({ color: i % 2 ? colors.flowerPink : 0xffcf55 });
  }
  parent.addChild(vine);
}

function drawInteractiveFlowers(parent: Container, w: number, h: number, groundY: number, onMessage: (message: FlowerMessage) => void) {
  const positions = [
    { x: 0.08, y: 0.29, s: 1.08, color: colors.flowerPink, type: "rose" as GardenFlowerType },
    { x: 0.13, y: 0.34, s: 0.9, color: 0xff7a9b, type: "rose" as GardenFlowerType },
    { x: 0.19, y: 0.28, s: 0.82, color: colors.flowerPurple, type: "tulip" as GardenFlowerType },
    { x: 0.24, y: 0.36, s: 0.72, color: 0xff8f57, type: "tulip" as GardenFlowerType },
    { x: 0.29, y: 0.2, s: 1.05, color: colors.flowerYellow, type: "sunflower" as GardenFlowerType },
    { x: 0.35, y: 0.31, s: 0.74, color: colors.flowerWhite, type: "daisy" as GardenFlowerType },
    { x: 0.42, y: 0.26, s: 0.74, color: 0xff7a9b, type: "tulip" as GardenFlowerType },
    { x: 0.47, y: 0.36, s: 0.62, color: 0xffd36b, type: "daisy" as GardenFlowerType },
    { x: 0.55, y: 0.34, s: 0.7, color: 0xffb14a, type: "daisy" as GardenFlowerType },
    { x: 0.6, y: 0.24, s: 0.72, color: 0xf15f67, type: "rose" as GardenFlowerType },
    { x: 0.66, y: 0.35, s: 0.68, color: colors.flowerPurple, type: "tulip" as GardenFlowerType },
    { x: 0.71, y: 0.28, s: 0.76, color: colors.flowerYellow, type: "sunflower" as GardenFlowerType },
    { x: 0.76, y: 0.37, s: 0.66, color: 0xff8fa7, type: "rose" as GardenFlowerType },
    { x: 0.82, y: 0.28, s: 0.82, color: colors.flowerWhite, type: "daisy" as GardenFlowerType },
    { x: 0.87, y: 0.35, s: 0.7, color: 0xff5f78, type: "rose" as GardenFlowerType },
    { x: 0.92, y: 0.22, s: 0.8, color: colors.flowerYellow, type: "sunflower" as GardenFlowerType },
    { x: 0.16, y: 0.18, s: 0.62, color: 0xffc0d1, type: "daisy" as GardenFlowerType },
    { x: 0.68, y: 0.16, s: 0.58, color: 0xff7a9b, type: "tulip" as GardenFlowerType },
    { x: 0.94, y: 0.32, s: 0.58, color: 0xfff5db, type: "daisy" as GardenFlowerType },
  ];

  positions.forEach((item, index) => {
    const flower = drawGardenFlower(parent, w * item.x, groundY + h * item.y, Math.min(w, h) * 0.065 * item.s, item.color, item.type);
    flower.eventMode = "static";
    flower.cursor = "pointer";
    flower.hitArea = new Rectangle(-40, -88, 80, 100);
    let lastTap = 0;
    flower.on("pointertap", () => {
      const now = performance.now();
      if (now - lastTap < 430) onMessage(flowerMessages[index % flowerMessages.length]);
      lastTap = now;
    });
  });
}

function drawGardenFlower(parent: Container, x: number, y: number, s: number, petalColor: number, type: GardenFlowerType) {
  const flower = new Container();
  flower.x = x;
  flower.y = y;
  parent.addChild(flower);

  const stem = new Graphics();
  stem.moveTo(0, 0);
  stem.quadraticCurveTo(-s * 0.12, -s * 0.48, 0, -s * 0.95);
  stem.stroke({ color: 0x2e8b43, width: Math.max(3, s * 0.09) });
  stem.ellipse(-s * 0.22, -s * 0.36, s * 0.24, s * 0.1).fill({ color: 0x52a94f });
  stem.ellipse(s * 0.2, -s * 0.55, s * 0.24, s * 0.1).fill({ color: 0x6fc15b });
  flower.addChild(stem);

  const head = new Container();
  head.y = -s;
  flower.addChild(head);

  if (type === "sunflower") drawSunflowerHead(head, s, petalColor);
  if (type === "tulip") drawTulipHead(head, s, petalColor);
  if (type === "rose") drawRoseHead(head, s, petalColor);
  if (type === "daisy") drawDaisyHead(head, s, petalColor);

  return flower;
}

function drawDaisyHead(parent: Container, s: number, petalColor: number) {
  for (let i = 0; i < 9; i++) {
    const petal = new Graphics();
    petal.ellipse(0, -s * 0.32, s * 0.15, s * 0.34).fill({ color: petalColor });
    petal.rotation = (Math.PI * 2 * i) / 9;
    parent.addChild(petal);
  }
  const center = new Graphics();
  center.circle(0, 0, s * 0.2).fill({ color: 0xffb72f });
  center.circle(-s * 0.05, -s * 0.05, s * 0.06).fill({ color: 0xffe18f, alpha: 0.8 });
  parent.addChild(center);
}

function drawSunflowerHead(parent: Container, s: number, petalColor: number) {
  for (let i = 0; i < 14; i++) {
    const petal = new Graphics();
    petal.ellipse(0, -s * 0.32, s * 0.12, s * 0.32).fill({ color: petalColor });
    petal.rotation = (Math.PI * 2 * i) / 14;
    parent.addChild(petal);
  }
  const center = new Graphics();
  center.circle(0, 0, s * 0.25).fill({ color: 0x5b321d });
  for (let i = 0; i < 12; i++) {
    center.circle(Math.cos(i) * s * 0.1, Math.sin(i * 1.7) * s * 0.1, s * 0.025).fill({ color: 0x8c5b2e, alpha: 0.8 });
  }
  parent.addChild(center);
}

function drawTulipHead(parent: Container, s: number, petalColor: number) {
  const cup = new Graphics();
  cup.moveTo(-s * 0.34, -s * 0.1);
  cup.bezierCurveTo(-s * 0.36, -s * 0.48, -s * 0.12, -s * 0.62, 0, -s * 0.24);
  cup.bezierCurveTo(s * 0.12, -s * 0.62, s * 0.36, -s * 0.48, s * 0.34, -s * 0.1);
  cup.bezierCurveTo(s * 0.24, s * 0.22, -s * 0.24, s * 0.22, -s * 0.34, -s * 0.1);
  cup.fill({ color: petalColor });
  cup.stroke({ color: 0x7d2d4a, width: Math.max(1.5, s * 0.04), alpha: 0.35 });
  cup.ellipse(0, -s * 0.08, s * 0.16, s * 0.26).fill({ color: 0xffb1c5, alpha: 0.28 });
  parent.addChild(cup);
}

function drawRoseHead(parent: Container, s: number, petalColor: number) {
  const rose = new Graphics();
  rose.circle(0, 0, s * 0.34).fill({ color: 0x8f1f43, alpha: 0.9 });
  for (let i = 0; i < 7; i++) {
    rose.ellipse(
      Math.cos(i * 1.7) * s * 0.08,
      Math.sin(i * 1.7) * s * 0.08,
      s * (0.18 - i * 0.008),
      s * 0.1,
    ).fill({ color: i % 2 ? petalColor : 0xff8da8, alpha: 0.92 });
    rose.rotation += 0.08;
  }
  rose.circle(0, 0, s * 0.08).fill({ color: 0xffc1cc });
  parent.addChild(rose);
}

function drawSeedAndFlower(parent: Container, x: number, y: number, sizeBase: number): BloomParts {
  const scale = Math.max(0.72, Math.min(sizeBase / 760, 1.08));
  const root = new Container();
  root.x = x;
  root.y = y;
  root.scale.set(scale);
  parent.addChild(root);

  const glow = new Graphics();
  glow.circle(0, -38, 86).fill({ color: 0xffd764, alpha: 0.22 });
  glow.circle(0, -38, 48).fill({ color: 0xffffff, alpha: 0.14 });
  root.addChild(glow);

  const stem = new Graphics();
  stem.roundRect(-7, -190, 14, 184, 9).fill({ color: 0x2f9a4f });
  stem.scale.y = 0;
  root.addChild(stem);

  const leafLeft = new Graphics();
  leafLeft.ellipse(-38, -92, 36, 17).fill({ color: 0x65ba54 });
  leafLeft.rotation = -0.42;
  leafLeft.scale.set(0);
  root.addChild(leafLeft);

  const leafRight = new Graphics();
  leafRight.ellipse(38, -126, 38, 18).fill({ color: 0x78ca5f });
  leafRight.rotation = 0.42;
  leafRight.scale.set(0);
  root.addChild(leafRight);

  const flower = new Container();
  flower.y = -193;
  flower.alpha = 0;
  flower.scale.set(0);
  root.addChild(flower);

  for (let i = 0; i < 10; i++) {
    const petal = new Graphics();
    petal.ellipse(0, -44, 23, 48).fill({
      color: i % 2 === 0 ? 0xf25c83 : 0xff9fb1,
    });
    petal.rotation = (Math.PI * 2 * i) / 10;
    flower.addChild(petal);
  }

  const flowerCore = new Graphics();
  flowerCore.circle(0, 0, 27).fill({ color: 0xffc43d });
  flowerCore.circle(-7, -7, 7).fill({ color: 0xffe58a, alpha: 0.72 });
  flower.addChild(flowerCore);

  const seed = new Container();
  root.addChild(seed);

  const leftShell = new Graphics();
  drawSeedHalf(leftShell, -1);
  seed.addChild(leftShell);

  const rightShell = new Graphics();
  drawSeedHalf(rightShell, 1);
  seed.addChild(rightShell);

  const shine = new Graphics();
  shine.ellipse(-14, -50, 9, 20).fill({ color: colors.seedLight, alpha: 0.65 });
  shine.rotation = -0.35;
  seed.addChild(shine);

  return { root, seed, leftShell, rightShell, stem, leafLeft, leafRight, flower, flowerCore, glow };
}

function animateBloom(parts: BloomParts, elapsed: number) {
  const open = easeOutCubic(clamp(elapsed / 900));
  parts.leftShell.x = -open * 36;
  parts.leftShell.y = open * 11;
  parts.leftShell.rotation = -open * 0.6;
  parts.rightShell.x = open * 36;
  parts.rightShell.y = open * 11;
  parts.rightShell.rotation = open * 0.6;
  parts.seed.alpha = 1 - clamp((elapsed - 900) / 900) * 0.95;
  parts.seed.scale.set(1 - clamp((elapsed - 900) / 900) * 0.22);

  parts.stem.scale.y = easeOutCubic(clamp((elapsed - 550) / 1200));
  const leavesGrow = easeOutBack(clamp((elapsed - 1300) / 900));
  parts.leafLeft.scale.set(leavesGrow);
  parts.leafRight.scale.set(leavesGrow);
  parts.leafLeft.alpha = clamp((elapsed - 1150) / 500);
  parts.leafRight.alpha = clamp((elapsed - 1300) / 500);

  const flowerGrow = easeOutBack(clamp((elapsed - 2050) / 1050));
  parts.flower.alpha = clamp((elapsed - 1900) / 600);
  parts.flower.scale.set(flowerGrow);
  parts.flower.rotation = (1 - clamp((elapsed - 2050) / 1050)) * -0.2;
  parts.flowerCore.scale.set(1 + Math.sin(elapsed * 0.012) * 0.025);
}

function drawSeedHalf(g: Graphics, direction: -1 | 1) {
  g.moveTo(0, -90);
  g.bezierCurveTo(direction * 64, -74, direction * 63, -8, 0, 24);
  g.bezierCurveTo(direction * 14, -10, direction * 20, -50, 0, -90);
  g.fill({ color: colors.seed });
  g.stroke({ color: 0x3d2113, width: 3, alpha: 0.55 });
  g.ellipse(direction * 16, -38, 10, 28).fill({ color: colors.seedLight, alpha: 0.34 });
}

function drawSunset(parent: Graphics, x: number, y: number, r: number) {
  parent.circle(x, y, r * 3.2).fill({ color: 0xffb647, alpha: 0.18 });
  parent.circle(x, y, r * 1.65).fill({ color: 0xffa338, alpha: 0.2 });
  parent.circle(x, y, r).fill({ color: 0xfff0a4 });
}

function drawCloud(parent: Container, x: number, y: number, s: number, color: number, alpha: number) {
  const cloud = new Graphics();
  cloud.circle(x - s * 0.55, y + s * 0.12, s * 0.38).fill({ color, alpha });
  cloud.circle(x - s * 0.12, y, s * 0.5).fill({ color, alpha });
  cloud.circle(x + s * 0.36, y + s * 0.08, s * 0.42).fill({ color, alpha });
  cloud.roundRect(x - s * 0.82, y + s * 0.1, s * 1.58, s * 0.38, s * 0.18).fill({ color, alpha });
  parent.addChild(cloud);
}

function drawFence(parent: Container, w: number, y: number, min: number) {
  const fence = new Graphics();
  const postW = Math.max(8, min * 0.014);
  const gap = Math.max(32, min * 0.06);
  fence.rect(0, y - min * 0.055, w, postW * 0.55).fill({ color: 0x8c5b2e, alpha: 0.78 });
  fence.rect(0, y - min * 0.015, w, postW * 0.55).fill({ color: 0x6f4327, alpha: 0.78 });
  for (let x = 0; x < w; x += gap) {
    fence.roundRect(x, y - min * 0.095, postW, min * 0.12, 4).fill({ color: 0x9d6933 });
    fence.moveTo(x, y - min * 0.095);
    fence.lineTo(x + postW / 2, y - min * 0.13);
    fence.lineTo(x + postW, y - min * 0.095);
    fence.closePath();
    fence.fill({ color: 0xb57639 });
  }
  parent.addChild(fence);
}

function drawStonePath(parent: Container, w: number, h: number, groundY: number) {
  const path = new Graphics();
  path.moveTo(w * 0.48, h);
  path.bezierCurveTo(w * 0.48, h * 0.88, w * 0.55, h * 0.78, w * 0.64, groundY + h * 0.08);
  path.bezierCurveTo(w * 0.7, groundY + h * 0.02, w * 0.72, groundY + h * 0.02, w * 0.76, groundY - h * 0.01);
  path.bezierCurveTo(w * 0.68, groundY + h * 0.12, w * 0.63, h * 0.87, w * 0.59, h);
  path.closePath();
  path.fill({ color: 0x6b4b2e, alpha: 0.18 });
  parent.addChild(path);

  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const x = lerp(w * 0.56, w * 0.73, t) + Math.sin(t * Math.PI * 2) * w * 0.025;
    const y = lerp(h * 0.96, groundY + h * 0.04, t);
    const stone = new Graphics();
    stone.roundRect(x - w * 0.035, y - h * 0.015, w * 0.07, h * 0.03, 10).fill({ color: colors.pathLight });
    stone.stroke({ color: colors.path, width: 3, alpha: 0.7 });
    parent.addChild(stone);
  }
}

function drawFlowerArch(parent: Container, x: number, y: number, s: number) {
  const arch = new Graphics();
  arch.moveTo(x - s * 0.45, y);
  arch.bezierCurveTo(x - s * 0.42, y - s * 0.7, x + s * 0.42, y - s * 0.7, x + s * 0.45, y);
  arch.stroke({ color: 0x70472c, width: Math.max(5, s * 0.05), alpha: 0.75 });
  arch.roundRect(x - s * 0.25, y - s * 0.02, s * 0.5, s * 0.25, 5).fill({ color: 0x8f5b30 });
  parent.addChild(arch);

  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const angle = Math.PI * (1 - t);
    const px = x + Math.cos(angle) * s * 0.45;
    const py = y - Math.sin(angle) * s * 0.58;
    const blossom = new Graphics();
    blossom.circle(px, py, s * 0.035).fill({ color: i % 2 ? colors.flowerPink : 0xffd48a });
    blossom.circle(px + s * 0.018, py - s * 0.014, s * 0.018).fill({ color: 0xfff1a6, alpha: 0.9 });
    parent.addChild(blossom);
  }
}

function drawFireflies(parent: Container, w: number, h: number, groundY: number): Firefly[] {
  const fireflies = new Container();
  fireflies.label = "ambient";
  parent.addChild(fireflies);
  const items: Firefly[] = [];
  for (let i = 0; i < 18; i++) {
    const x = w * (0.06 + ((i * 0.173) % 0.88));
    const y = groundY - h * 0.12 + h * ((i * 0.061) % 0.24);
    const dot = new Container();
    dot.x = x;
    dot.y = y;
    const core = new Graphics();
    core.circle(0, 0, 2).fill({ color: 0xffe37a, alpha: 0.9 });
    core.circle(0, 0, 10).fill({ color: 0xffd45f, alpha: 0.12 });
    dot.addChild(core);
    fireflies.addChild(dot);
    items.push({
      node: dot,
      baseX: x,
      baseY: y,
      phase: i * 0.81,
      speed: 0.0012 + (i % 5) * 0.00018,
      range: 10 + (i % 4) * 4,
    });
  }
  return items;
}

function drawButterflies(parent: Container, w: number, h: number, groundY: number): Butterfly[] {
  const items: Butterfly[] = [];
  const specs = [
    { x: 0.43, y: -0.1, c1: 0xff9fd7, c2: 0x7d48d8, s: 1 },
    { x: 0.63, y: -0.18, c1: 0xffd36b, c2: 0xff6b7f, s: 0.82 },
    { x: 0.22, y: 0.02, c1: 0x9be7ff, c2: 0xff9fd7, s: 0.74 },
  ];

  specs.forEach((spec, index) => {
    const butterfly = new Container();
    butterfly.x = w * spec.x;
    butterfly.y = groundY + h * spec.y;
    butterfly.scale.set(spec.s);
    parent.addChild(butterfly);

    const leftWing = new Graphics();
    leftWing.ellipse(-9, -2, 12, 17).fill({ color: spec.c1, alpha: 0.92 });
    leftWing.ellipse(-10, 9, 9, 11).fill({ color: spec.c2, alpha: 0.78 });
    leftWing.circle(-10, -8, 2).fill({ color: 0xffffff, alpha: 0.8 });

    const rightWing = new Graphics();
    rightWing.ellipse(9, -2, 12, 17).fill({ color: spec.c1, alpha: 0.92 });
    rightWing.ellipse(10, 9, 9, 11).fill({ color: spec.c2, alpha: 0.78 });
    rightWing.circle(10, -8, 2).fill({ color: 0xffffff, alpha: 0.8 });

    const body = new Graphics();
    body.roundRect(-2, -12, 4, 27, 3).fill({ color: 0x2b1d31 });
    body.circle(0, -15, 3).fill({ color: 0x2b1d31 });
    body.moveTo(-1, -17).lineTo(-7, -23).stroke({ color: 0x2b1d31, width: 1.4 });
    body.moveTo(1, -17).lineTo(7, -23).stroke({ color: 0x2b1d31, width: 1.4 });

    butterfly.addChild(leftWing, rightWing, body);
    items.push({
      node: butterfly,
      leftWing,
      rightWing,
      baseX: butterfly.x,
      baseY: butterfly.y,
      phase: index * 1.7,
      speed: 0.00045 + index * 0.00012,
      range: w * (0.045 + index * 0.014),
    });
  });

  return items;
}

function drawSkyBirds(parent: Container, w: number, h: number): SkyBird[] {
  const birds: SkyBird[] = [];
  for (let i = 0; i < 4; i++) {
    const bird = new Container();
    bird.x = w * (0.12 + i * 0.18);
    bird.y = h * (0.17 + (i % 2) * 0.06);
    bird.scale.set(0.75 + i * 0.08);
    const wings = new Graphics();
    wings.moveTo(-12, 0).quadraticCurveTo(-4, -8, 0, 0).quadraticCurveTo(4, -8, 12, 0);
    wings.stroke({ color: 0x3b2c5f, width: 3, alpha: 0.56 });
    bird.addChild(wings);
    parent.addChild(bird);
    birds.push({
      node: bird,
      baseX: bird.x,
      baseY: bird.y,
      speed: 0.0001 + i * 0.000025,
      phase: i * 0.8,
    });
  }
  return birds;
}

function drawFallingLeaves(parent: Container, w: number, h: number): FallingLeaf[] {
  const leaves: FallingLeaf[] = [];
  for (let i = 0; i < 14; i++) {
    const leaf = new Graphics();
    const x = w * (0.06 + ((i * 0.073) % 0.35));
    const y = h * (0.04 + ((i * 0.121) % 0.45));
    leaf.ellipse(0, 0, 8 + (i % 3) * 2, 4 + (i % 2) * 2).fill({
      color: [0xffc95c, 0x8bc34a, 0xd69035][i % 3],
      alpha: 0.72,
    });
    leaf.rotation = i * 0.6;
    leaf.x = x;
    leaf.y = y;
    parent.addChild(leaf);
    leaves.push({
      node: leaf,
      baseX: x,
      baseY: y,
      speed: 0.00007 + (i % 5) * 0.000025,
      drift: 16 + (i % 4) * 9,
      phase: i * 1.13,
    });
  }
  return leaves;
}

function animateFireflies(items: Firefly[], t: number) {
  items.forEach((item) => {
    item.node.x = item.baseX + Math.sin(t * item.speed + item.phase) * item.range;
    item.node.y = item.baseY + Math.cos(t * item.speed * 1.4 + item.phase) * item.range * 0.55;
    item.node.alpha = 0.38 + Math.sin(t * 0.004 + item.phase) * 0.36;
    item.node.scale.set(0.85 + Math.sin(t * 0.003 + item.phase) * 0.18);
  });
}

function animateButterflies(items: Butterfly[], t: number) {
  items.forEach((item) => {
    item.node.x = item.baseX + Math.sin(t * item.speed + item.phase) * item.range;
    item.node.y = item.baseY + Math.cos(t * item.speed * 1.6 + item.phase) * item.range * 0.46;
    item.node.rotation = Math.sin(t * item.speed * 1.8 + item.phase) * 0.16;
    const flap = 0.35 + Math.abs(Math.sin(t * 0.012 + item.phase)) * 0.75;
    item.leftWing.scale.x = flap;
    item.rightWing.scale.x = flap;
  });
}

function animateSkyBirds(items: SkyBird[], t: number, w: number) {
  items.forEach((item, index) => {
    const travel = ((t * item.speed + item.phase) % 1) * (w + 160);
    item.node.x = travel - 80;
    item.node.y = item.baseY + Math.sin(t * 0.0015 + index) * 8;
  });
}

function animateFallingLeaves(items: FallingLeaf[], t: number, h: number, groundY: number) {
  items.forEach((item) => {
    const loop = ((t * item.speed + item.phase) % 1);
    item.node.x = item.baseX + Math.sin(t * 0.0016 + item.phase) * item.drift;
    item.node.y = item.baseY + loop * (groundY + h * 0.14);
    item.node.rotation = item.phase + t * 0.0012;
    item.node.alpha = item.node.y > groundY + h * 0.12 ? 0 : 0.76;
  });
}

function animatePondFish(items: PondFish[], t: number) {
  items.forEach((fish, index) => {
    const swim = Math.sin(t * fish.speed + fish.phase);
    fish.node.x = fish.baseX + swim * fish.width;
    fish.node.y = fish.baseY + Math.cos(t * fish.speed * 2.1 + fish.phase) * 5;
    fish.node.scale.x = swim < 0 ? -1 : 1;
    fish.node.rotation = Math.sin(t * fish.speed * 3 + index) * 0.08;
  });
}

function drawPrompt(parent: Container, x: number, y: number, label: string) {
  const text = new Text({
    text: label,
    style: new TextStyle({
      align: "center",
      fill: 0xfff4c6,
      fontFamily: "'Segoe UI', Arial, sans-serif",
      fontSize: 21,
      fontWeight: "700",
      letterSpacing: 0,
      dropShadow: { color: 0x3b2115, alpha: 0.55, blur: 5, distance: 0 },
    }),
  });
  text.anchor.set(0.5);
  text.x = x;
  text.y = y;
  parent.addChild(text);
  return text;
}

function swayByName(parent: Container, name: string, t: number, speed: number, amount: number) {
  const items = parent.children.filter((child) => child.label === name);
  items.forEach((child, index) => {
    child.y = Math.sin(t * speed + index) * amount;
  });
}

function multiGradientRect(g: Graphics, x: number, y: number, w: number, h: number, stops: { r: number; g: number; b: number }[]) {
  const step = Math.max(3, Math.ceil(h / 150));
  for (let yy = 0; yy < h; yy += step) {
    const t = yy / h;
    const segment = t * (stops.length - 1);
    const index = Math.min(Math.floor(segment), stops.length - 2);
    const color = lerpColor(stops[index], stops[index + 1], segment - index);
    g.rect(x, y + yy, w, step + 1).fill({ color: rgbToHex(color) });
  }
}

function lerpColor(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function rgbToHex(c: { r: number; g: number; b: number }) {
  return (c.r << 16) | (c.g << 8) | c.b;
}

function clamp(value: number) {
  return Math.max(0, Math.min(value, 1));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeOutBack(value: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
