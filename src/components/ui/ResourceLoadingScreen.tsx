"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { loadSprites } from "@/lib/sprites";

interface ResourceLoadingScreenProps {
  onComplete: () => void;
}

export function ResourceLoadingScreen({ onComplete }: ResourceLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const startedAt = performance.now();

      await loadSprites((loaded, total) => {
        if (!cancelled) setProgress(Math.round((loaded / total) * 100));
      });

      const remaining = Math.max(0, 1200 - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (!cancelled) onComplete();
      }, remaining);
    };

    void load();

    return () => {
      cancelled = true;
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
      <div className="resource-loader-moon absolute" aria-hidden="true" />

      <div className="resource-loader-flowers absolute inset-x-0 bottom-0" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
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
