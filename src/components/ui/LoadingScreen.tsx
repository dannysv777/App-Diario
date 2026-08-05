"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
  progress: number;
  visible: boolean;
}

const stars = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: 1 + (((i * 7 + 3) % 11) / 11) * 3,
  left: (i * 31 + 17) % 100,
  top: (i * 53 + 7) % 100,
  delay: ((i * 41 + 11) % 20) / 10,
  duration: 1.5 + ((i * 13 + 5) % 20) / 10,
}));

export function LoadingScreen({ progress, visible }: LoadingScreenProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #4e429d 0%, #ec5d77 48%, #ffae4b 76%, #ffdd84 100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 700ms ease",
      }}
    >
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            backgroundColor: "#fff8dc",
            left: `${star.left}%`,
            top: `${star.top}%`,
            boxShadow: "0 0 10px rgba(255, 248, 220, 0.75)",
          }}
          animate={{ opacity: [0.2, 0.85, 0.2] }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      <motion.div
        className="relative mb-9 flex h-20 w-20 items-center justify-center rounded-full"
        style={{
          background: "rgba(255, 230, 155, 0.24)",
          boxShadow: "0 18px 48px rgba(63, 31, 22, 0.22)",
        }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 122, 0.48) 0%, transparent 72%)",
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="relative text-5xl" style={{ color: "#fff3bd" }}>
          *
        </span>
      </motion.div>

      <motion.h1
        className="mb-7 select-none text-2xl font-black"
        style={{
          color: "#fff3bd",
          fontFamily: "Georgia, serif",
          letterSpacing: 1,
          textShadow: "0 3px 14px rgba(52, 24, 18, 0.35)",
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        Nuestro Jardin
      </motion.h1>

      <div className="w-52">
        <div
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: "rgba(255, 243, 189, 0.24)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #ffd36b, #ff8f57, #8c315b)",
              width: `${progress}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
        <motion.p
          className="mt-3 text-center text-xs font-bold uppercase"
          style={{ color: "rgba(255, 243, 189, 0.74)", letterSpacing: 2 }}
          animate={{ opacity: [0.45, 0.9, 0.45] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          preparando tu jardin...
        </motion.p>
      </div>
    </div>
  );
}
