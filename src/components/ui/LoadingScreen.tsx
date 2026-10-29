"use client";

import { MouseEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Flower2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
  visible: boolean;
}

type WelcomeStep =
  | "prelude-one"
  | "prelude-two"
  | "hello"
  | "made"
  | "birthday"
  | "admire"
  | "heart"
  | "thanks"
  | "life"
  | "prepared"
  | "not-planned"
  | "time"
  | "birthday-effort"
  | "flowers-inspired"
  | "garden"
  | "enter";

interface StepContent {
  kicker?: string;
  lines: string[];
}

interface FlowerCluster {
  side: "left" | "right";
  x: number;
  y: number;
  scale: number;
  compact?: boolean;
}

const flowerPalettes = [
  { base: "#ffd141", light: "#fff6a8", dark: "#e7a816" },
  { base: "#45d7db", light: "#b9fbff", dark: "#078b98" },
  { base: "#9d71ff", light: "#ddc8ff", dark: "#5c35bf" },
];

const stepOrder: WelcomeStep[] = [
  "prelude-one",
  "prelude-two",
  "hello",
  "made",
  "birthday",
  "admire",
  "heart",
  "thanks",
  "life",
  "prepared",
  "not-planned",
  "time",
  "birthday-effort",
  "flowers-inspired",
  "garden",
  "enter",
];

const stepContent: Record<WelcomeStep, StepContent> = {
  "prelude-one": {
    lines: ["Prepar\u00e9 algo para ti..."],
  },
  "prelude-two": {
    lines: ["Hay un peque\u00f1o detalle que quiero mostrarte...", "Pero antes..."],
  },
  hello: {
    kicker: "Bienvenida",
    lines: [
      "Hola, mi violetita!! \u2764\ufe0f",
      "Hoy no quer\u00eda darte solo un mensaje y como no soy bueno haciendo cartas...",
    ],
  },
  made: {
    lines: [
      "Quer\u00eda darte algo hecho con cari\u00f1o.",
      "Un peque\u00f1o detalle para que lo puedas ver cuando quieras.",
      "As\u00ed que...",
    ],
  },
  birthday: {
    lines: [
      "Feliz cumplea\u00f1os, mi amor \u{1f382}\u2764\ufe0f",
      "Eres una persona incre\u00edble y especial para m\u00ed, quiero que nunca lo olvides.",
    ],
  },
  admire: {
    lines: [
      "Eres alguien que aprecio y admiro mucho.",
      "Quiero que hoy recuerdes lo valiosa y maravillosa que eres.",
    ],
  },
  heart: {
    kicker: "Un detalle peque\u00f1o? jaja",
    lines: ["Continue jeje \u2764\ufe0f"],
  },
  thanks: {
    lines: ["Gracias por todo lo bonito."],
  },
  life: {
    lines: ["Estoy muy feliz de tenerte en mi vida."],
  },
  prepared: {
    lines: ["As\u00ed que hab\u00eda preparado algo un poco m\u00e1s trabajado."],
  },
  "not-planned": {
    lines: ["Pero no me sali\u00f3 como pensaba..."],
  },
  time: {
    lines: ["Por el tiempo..."],
  },
  "birthday-effort": {
    lines: ["Hice algo para expresarme hoy en tu cumplea\u00f1os."],
  },
  "flowers-inspired": {
    lines: ["Te gustan las flores, as\u00ed que me bas\u00e9 en eso jaja."],
  },
  garden: {
    lines: ["Ahora quiero mostrarte un peque\u00f1o detalle que prepar\u00e9 para ti..."],
  },
  enter: {
    kicker: "Un jard\u00ednn jajajj",
    lines: ["Bienvenida!! \u2764\ufe0f"],
  },
};

const sparkles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: 6 + ((index * 37) % 88),
  top: 7 + ((index * 53) % 80),
  size: 2 + ((index * 7) % 4),
  delay: ((index * 11) % 18) / 10,
  duration: 2.2 + ((index * 5) % 12) / 10,
}));

const fireflies = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  left: 12 + ((index * 19) % 76),
  top: 24 + ((index * 29) % 46),
  delay: ((index * 13) % 18) / 10,
  duration: 5.5 + ((index * 7) % 18) / 10,
  driftX: -26 + ((index * 23) % 52),
  driftY: -18 + ((index * 17) % 36),
}));

const magicDust = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: 8 + ((index * 41) % 84),
  bottom: 4 + ((index * 11) % 14),
  delay: ((index * 9) % 20) / 10,
  duration: 4.8 + ((index * 5) % 18) / 10,
  driftX: -18 + ((index * 17) % 36),
}));

const flowerClusters: FlowerCluster[] = [
  { side: "left", x: 1, y: 52, scale: 1.02 },
  { side: "left", x: 29, y: 76, scale: 0.66, compact: true },
  { side: "right", x: 67, y: 52, scale: 1.02 },
  { side: "right", x: 57, y: 77, scale: 0.66, compact: true },
  { side: "left", x: 3, y: 12, scale: 0.48, compact: true },
  { side: "right", x: 78, y: 13, scale: 0.48, compact: true },
];

const celebrationBits = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: 12 + ((index * 23) % 76),
  delay: ((index * 7) % 18) / 20,
  duration: 2.2 + ((index * 5) % 9) / 10,
  drift: -44 + ((index * 31) % 88),
  rotate: -90 + ((index * 29) % 180),
  isHeart: index % 3 === 0,
  color: ["#ffd25d", "#ff8a5b", "#fff2a6", "#e74058"][index % 4],
}));

function getNextStep(current: WelcomeStep): WelcomeStep {
  const index = stepOrder.indexOf(current);
  return stepOrder[Math.min(index + 1, stepOrder.length - 1)];
}

export function LoadingScreen({ onComplete, visible }: LoadingScreenProps) {
  const [step, setStep] = useState<WelcomeStep>("prelude-one");
  const lastStepAt = useRef(0);
  const content = stepContent[step];

  const handleScreenTap = () => {
    if (step === "heart" || step === "enter") return;
    const now = performance.now();
    if (now - lastStepAt.current < 720) return;
    lastStepAt.current = now;

    setStep(getNextStep(step));
  };

  const handleHeart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const now = performance.now();
    if (now - lastStepAt.current < 720) return;
    lastStepAt.current = now;
    setStep("thanks");
  };

  const handleEnter = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onComplete();
  };

  return (
    <div
      className="welcome-screen fixed inset-0 z-[100] overflow-hidden"
      role="button"
      tabIndex={0}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 700ms ease",
      }}
      onClick={handleScreenTap}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleScreenTap();
        }
      }}
    >
      <div className="welcome-vignette absolute inset-0" />
      <svg className="welcome-moon absolute" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="welcomeMoonGlow" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#fff8d7" />
            <stop offset="46%" stopColor="#ffe09b" />
            <stop offset="100%" stopColor="#dca24b" />
          </radialGradient>
        </defs>
        <path
          d="M78 12 C48 18 26 43 26 72 C26 98 47 114 76 111 C59 103 48 86 48 64 C48 42 59 24 78 12 Z"
          fill="url(#welcomeMoonGlow)"
        />
      </svg>
      <div className="welcome-foreground absolute inset-x-0 bottom-0" aria-hidden="true" />

      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            background: "#fff3b0",
            boxShadow: "0 0 14px rgba(255, 223, 112, 0.85)",
          }}
          animate={{ opacity: [0.12, 0.92, 0.12], y: [0, -10, 0] }}
          transition={{
            delay: sparkle.delay,
            duration: sparkle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {fireflies.map((firefly) => (
        <motion.span
          key={firefly.id}
          className="welcome-firefly absolute rounded-full"
          style={{
            left: `${firefly.left}%`,
            top: `${firefly.top}%`,
          }}
          animate={{
            opacity: [0.18, 0.95, 0.26, 0.72],
            x: [0, firefly.driftX, firefly.driftX * -0.35, 0],
            y: [0, firefly.driftY, firefly.driftY * 0.45, 0],
            scale: [0.82, 1.18, 0.9, 1],
          }}
          transition={{
            delay: firefly.delay,
            duration: firefly.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {magicDust.map((dust) => (
        <motion.span
          key={dust.id}
          className="welcome-magic-dust absolute rounded-full"
          style={{
            left: `${dust.left}%`,
            bottom: `${dust.bottom}%`,
          }}
          animate={{
            opacity: [0, 0.72, 0],
            x: [0, dust.driftX],
            y: [0, -92],
            scale: [0.58, 1, 0.48],
          }}
          transition={{
            delay: dust.delay,
            duration: dust.duration,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {step === "birthday" && <Celebration />}

      {flowerClusters.map((cluster, index) => (
        <DecorativeFlowers
          key={`${cluster.side}-${index}`}
          clusterIndex={index}
          {...cluster}
        />
      ))}

      <main className="relative z-10 flex h-full items-center justify-center px-6 py-8">
        <section className="welcome-copy relative flex w-full max-w-[760px] flex-col items-center text-center">
          <div className="welcome-text-halo absolute" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="welcome-copy-stage relative z-10 flex min-h-[210px] flex-col items-center justify-center"
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(8px)" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              {content.kicker && (
                <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#ffd25d]">
                  {content.kicker}
                </p>
              )}

              <div className="space-y-4">
                {content.lines.map((line) => (
                  <h1
                    key={line}
                    className="welcome-line text-balance text-[clamp(1.8rem,6vw,4.6rem)] font-black leading-[1.08] text-[#fff7d1]"
                  >
                    {line}
                  </h1>
                ))}
              </div>

              {step === "heart" && (
                <motion.button
                  aria-label={"Tocar coraz\u00f3n"}
                  className="welcome-heart mt-8 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 28%, #fff4bc 0 11%, #ffd25d 12% 26%, #ff835f 42%, #ca3c5c 72%)",
                    color: "#fff4d0",
                    boxShadow:
                      "0 0 34px rgba(255, 199, 87, 0.54), 0 22px 54px rgba(18, 8, 10, 0.45)",
                  }}
                  onClick={handleHeart}
                  animate={{ scale: [1, 1.08, 1], y: [0, -5, 0] }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span aria-hidden="true">&#x2764;&#xfe0f;</span>
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>

          {step !== "enter" && (
            <button
              type="button"
              className="welcome-skip relative z-10 mt-5 min-h-11 shrink-0"
              aria-label="Omitir bienvenida e ir al jardin"
              onClick={handleEnter}
            >
              <Flower2 size={20} aria-hidden="true" /><span>Omitir</span><ArrowRight size={18} aria-hidden="true" />
            </button>
          )}

          {step === "enter" && (
            <motion.button
              className="welcome-next mt-3 rounded-full px-8 py-3 text-sm font-black uppercase tracking-[0.18em]"
              style={{
                background: "linear-gradient(90deg, #ffd25d, #fff0a6)",
                color: "#2e2712",
                boxShadow:
                  "0 0 0 1px rgba(255, 255, 255, 0.16), 0 18px 44px rgba(0, 0, 0, 0.34)",
              }}
              onClick={handleEnter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.42 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              Entrar
            </motion.button>
          )}
        </section>
      </main>
    </div>
  );
}

function DecorativeFlowers({
  clusterIndex,
  side,
  x,
  y,
  scale,
  compact,
}: {
  clusterIndex: number;
  side: string;
  x: number;
  y: number;
  scale: number;
  compact?: boolean;
}) {
  return (
    <motion.svg
      aria-hidden="true"
      className={`welcome-flower-cluster welcome-flower-cluster-${clusterIndex} pointer-events-none absolute ${compact ? "welcome-flower-cluster-small" : ""}`}
      viewBox="0 0 320 230"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transformOrigin: side === "right" ? "100% 100%" : "0% 100%",
      }}
      initial={{ opacity: 0, scale: 0.3, y: 58 }}
      animate={{ opacity: 1, scale, y: [0, -5, 0] }}
      transition={{
        opacity: { duration: 0.6, ease: "easeOut" },
        scale: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        y: { delay: 0.75, duration: 4.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <g className="welcome-svg-grow">
        <path
          d="M54 202 C74 181 102 190 116 202 C138 180 172 183 188 202 C212 187 245 189 266 203 L266 219 L54 219 Z"
          fill="#5fb548"
          stroke="#2b7230"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <path d="M104 205 C109 176 116 142 111 103" className="welcome-svg-stem" />
        <path d="M158 205 C160 165 160 128 160 94" className="welcome-svg-stem" />
        <path d="M212 205 C207 173 217 143 230 114" className="welcome-svg-stem" />
        <path d="M92 183 C70 145 72 113 118 137 C121 160 111 176 92 183 Z" className="welcome-svg-leaf" />
        <path d="M139 193 C119 151 130 116 170 131 C173 160 161 181 139 193 Z" className="welcome-svg-leaf" />
        <path d="M182 193 C206 148 201 120 240 134 C242 161 219 185 182 193 Z" className="welcome-svg-leaf" />
        <path d="M216 197 C236 164 261 151 279 174 C262 192 240 199 216 197 Z" className="welcome-svg-leaf" />
        <DaisyFlower x={108} y={82} rotate={-12} scale={0.98} palette={flowerPalettes[0]} />
        <DaisyFlower x={160} y={70} rotate={4} scale={1.08} palette={flowerPalettes[1]} />
        <DaisyFlower x={230} y={95} rotate={14} scale={0.96} palette={flowerPalettes[2]} />
        {!compact && (
          <>
            <DaisyFlower x={34} y={148} rotate={-20} scale={0.58} palette={flowerPalettes[2]} />
            <DaisyFlower x={292} y={150} rotate={18} scale={0.58} palette={flowerPalettes[0]} />
          </>
        )}
      </g>
    </motion.svg>
  );
}

function DaisyFlower({
  x,
  y,
  rotate,
  scale,
  palette,
}: {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  palette: (typeof flowerPalettes)[number];
}) {
  const petals = Array.from({ length: 7 }, (_, index) => index * (360 / 7));

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} className="welcome-svg-flower">
      {petals.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-24"
          rx="13"
          ry="27"
          fill={palette.base}
          stroke={palette.dark}
          strokeWidth="5.5"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="14" fill="#ffc43d" stroke="#c98219" strokeWidth="5" />
      <circle cx="-4" cy="-5" r="4.5" fill="#fff2a6" opacity="0.86" />
      <path
        d="M-5 -18 C-10 -8 -10 8 -4 16"
        fill="none"
        stroke={palette.light}
        strokeOpacity="0.36"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function Celebration() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {celebrationBits.map((bit) => (
        <motion.span
          key={bit.id}
          className={bit.isHeart ? "welcome-heart-bit" : "welcome-confetti-bit"}
          style={{
            left: `${bit.left}%`,
            top: "-8%",
            color: bit.color,
            background: bit.isHeart ? undefined : bit.color,
          }}
          initial={{ opacity: 0, y: -30, rotate: 0, scale: 0.7 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: ["-8vh", "34vh", "72vh"],
            x: [0, bit.drift / 2, bit.drift],
            rotate: bit.rotate,
            scale: bit.isHeart ? [0.75, 1.12, 0.92] : [0.8, 1, 0.8],
          }}
          transition={{
            delay: bit.delay,
            duration: bit.duration,
            ease: "easeOut",
          }}
        >
          {bit.isHeart ? "\u2764\ufe0f" : ""}
        </motion.span>
      ))}
    </div>
  );
}
