"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  shape: "circle" | "star" | "heart";
  travelX: number;
  travelY: number;
  rotate: number;
}

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 10000;
  return value - Math.floor(value);
}

export function Particles() {
  const particles = useMemo(() => {
    const colors = [
      "#ff6b8a", "#ffaa55", "#ffee55", "#55ddff",
      "#aa88ff", "#ff88cc", "#88ffaa", "#ffcc44",
    ];
    const shapes: Particle["shape"][] = ["circle", "star", "heart"];
    return Array.from({ length: 40 }, (_, i): Particle => ({
      id: i,
      x: 42 + seededUnit(i, 1) * 16,
      y: 50 + seededUnit(i, 2) * 18,
      size: seededUnit(i, 3) * 10 + 4,
      delay: seededUnit(i, 4) * 2,
      duration: seededUnit(i, 5) * 2.5 + 1.5,
      color: colors[Math.floor(seededUnit(i, 6) * colors.length)],
      shape: shapes[Math.floor(seededUnit(i, 7) * shapes.length)],
      travelX: (seededUnit(i, 8) - 0.5) * 140,
      travelY: -(100 + seededUnit(i, 9) * 150),
      rotate: seededUnit(i, 10) * 360,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.8, 1.2, 0],
            y: [0, p.travelY],
            x: [p.travelX],
            rotate: [0, p.rotate],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        >
          {p.shape === "circle" && (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size}px ${p.color}`,
              }}
            />
          )}
          {p.shape === "star" && (
            <svg viewBox="0 0 24 24" fill={p.color} width="100%" height="100%">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
            </svg>
          )}
          {p.shape === "heart" && (
            <svg viewBox="0 0 24 24" fill={p.color} width="100%" height="100%">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
