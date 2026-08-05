"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadSprites } from "@/lib/sprites";

interface ResourceLoadingScreenProps {
  onComplete: () => void;
}

const loaderDaisies = [
  { x: 10, y: 18, size: 42, color: "#ffd25d", delay: 0 },
  { x: 77, y: 16, size: 36, color: "#69dde1", delay: 0.1 },
  { x: 18, y: 70, size: 58, color: "#f06b8e", delay: 0.16 },
  { x: 82, y: 68, size: 54, color: "#ffd25d", delay: 0.22 },
  { x: 28, y: 36, size: 30, color: "#9d71ff", delay: 0.28 },
  { x: 66, y: 39, size: 34, color: "#f06b8e", delay: 0.34 },
  { x: 47, y: 76, size: 32, color: "#69dde1", delay: 0.4 },
  { x: 88, y: 30, size: 24, color: "#fff0a6", delay: 0.46 },
  { x: 8, y: 45, size: 26, color: "#fff0a6", delay: 0.52 },
];

export function ResourceLoadingScreen({ onComplete }: ResourceLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let progressFrame = 0;

    const load = async () => {
      const startedAt = performance.now();
      const duration = 1800;

      const animateProgress = () => {
        const elapsed = performance.now() - startedAt;
        const nextProgress = Math.min(96, Math.round((elapsed / duration) * 96));
        if (!cancelled) setProgress(nextProgress);
        if (!cancelled && nextProgress < 96) {
          progressFrame = window.requestAnimationFrame(animateProgress);
        }
      };

      progressFrame = window.requestAnimationFrame(animateProgress);
      await Promise.race([
        loadSprites(),
        new Promise((resolve) => window.setTimeout(resolve, duration)),
      ]);

      if (!cancelled) setProgress(100);
      const remaining = Math.max(0, duration + 260 - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (!cancelled) onComplete();
      }, remaining);
    };

    void load();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(progressFrame);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="resource-loader fixed inset-0 z-[120] flex items-center justify-center overflow-hidden px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="resource-loader-vignette absolute inset-0" />
      <svg className="resource-loader-moon absolute" viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="resourceMoonGlow" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#fff8d7" />
            <stop offset="46%" stopColor="#ffe09b" />
            <stop offset="100%" stopColor="#dca24b" />
          </radialGradient>
        </defs>
        <path
          d="M78 12 C48 18 26 43 26 72 C26 98 47 114 76 111 C59 103 48 86 48 64 C48 42 59 24 78 12 Z"
          fill="url(#resourceMoonGlow)"
        />
      </svg>

      <div className="resource-loader-daisies absolute inset-0" aria-hidden="true">
        {loaderDaisies.map((daisy, index) => (
          <LoadingDaisy key={index} {...daisy} />
        ))}
      </div>

      <motion.section
        className="relative z-10 flex w-full max-w-[420px] flex-col items-center text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-4 text-xs font-black uppercase tracking-[0.34em] text-[#ffd25d]">
          Preparando
        </p>
        <h1 className="resource-loader-title text-balance text-[clamp(2rem,8vw,4rem)] font-black leading-tight text-[#fff7d1]">
          Un jardincito para ti
        </h1>
        <div className="resource-loader-bar mt-8 h-3 w-full overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
        <p className="mt-4 text-sm font-bold text-[#ffeaa6]">{progress}%</p>
      </motion.section>
    </motion.div>
  );
}

function LoadingDaisy({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) {
  const petals = Array.from({ length: 7 }, (_, index) => index * (360 / 7));

  return (
    <motion.svg
      className="resource-loader-daisy absolute"
      viewBox="-45 -45 90 90"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `clamp(${size * 0.72}px, ${size / 10}vw, ${size}px)`,
      }}
      initial={{ opacity: 0, scale: 0.2, rotate: -18 }}
      animate={{ opacity: 1, scale: [1, 1.07, 1], rotate: [0, 4, 0] }}
      transition={{
        opacity: { delay, duration: 0.45 },
        scale: { delay, duration: 3.8, repeat: Infinity, ease: "easeInOut" },
        rotate: { delay, duration: 4.4, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      {petals.map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-23"
          rx="11"
          ry="23"
          fill={color}
          stroke="#16382d"
          strokeWidth="4"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="13" fill="#ffc43d" stroke="#c98219" strokeWidth="4" />
      <circle cx="-4" cy="-5" r="4" fill="#fff2a6" opacity="0.88" />
    </motion.svg>
  );
}
