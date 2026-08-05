"use client";

import { motion } from "framer-motion";

interface LetterOverlayProps {
  onClose: () => void;
}

const sparkles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 3 + ((i * 7) % 5),
  left: 8 + ((i * 23) % 84),
  top: 10 + ((i * 31) % 78),
  delay: ((i * 11) % 20) / 10,
  color: ["#ffd77a", "#ff9fb8", "#fff6cf", "#a8e6ff"][i % 4],
}));

export function LetterOverlay({ onClose }: LetterOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <button
        aria-label="Cerrar carta"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 28, 54, 0.2), rgba(31, 22, 18, 0.62))",
          backdropFilter: "blur(5px)",
        }}
        onClick={onClose}
      />

      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            background: sparkle.color,
            boxShadow: `0 0 12px ${sparkle.color}`,
          }}
          animate={{ opacity: [0.15, 0.85, 0.15], y: [0, -14, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: sparkle.delay }}
        />
      ))}

      <motion.article
        className="relative w-full max-w-md overflow-hidden rounded-[20px] px-7 py-8 shadow-2xl sm:px-9"
        style={{
          background:
            "linear-gradient(180deg, #fff3d2 0%, #ffe0ad 48%, #ffc99a 100%)",
          border: "2px solid rgba(111, 63, 31, 0.2)",
          boxShadow: "0 28px 80px rgba(33, 19, 14, 0.35)",
        }}
        initial={{ y: 38, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 22, scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute left-0 top-0 h-2 w-full"
          style={{ background: "linear-gradient(90deg, #8c315b, #ff8f57, #ffd76b)" }}
        />

        <header className="mb-6 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "#fff7ca",
              color: "#8c315b",
              boxShadow: "0 10px 24px rgba(140, 49, 91, 0.22)",
            }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl">*</span>
          </motion.div>
          <p className="text-xs font-semibold uppercase" style={{ color: "#8c4b36", letterSpacing: 3 }}>
            Para ti
          </p>
        </header>

        <div
          className="space-y-4"
          style={{
            color: "#40251c",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 15,
            lineHeight: 1.82,
          }}
        >
          <p>Feliz cumplea&ntilde;os, mi amor.</p>
          <p>
            Queria regalarte algo que no se gaste, que no se rompa y que no se
            pierda. Algo que pueda crecer con nosotros.
          </p>
          <p>
            Este jardin es nuestro peque&ntilde;o mundo. La semilla que tocaste
            es el inicio de todo lo bonito que quiero plantar contigo: recuerdos,
            sue&ntilde;os, risas, abrazos y momentos que quiero guardar para siempre.
          </p>
          <p>
            Gracias por ser mi persona favorita. Gracias por hacer que incluso
            los dias simples se sientan especiales solo porque estas tu.
          </p>
          <p>Este jardin va a crecer tanto como lo que siento por ti.</p>
          <p className="pt-2 text-right italic" style={{ color: "#7a4536" }}>
            Con todo mi amor, mi violetita.
            <br />
            Atte: Dany
          </p>
        </div>

        <div className="mt-7 flex justify-center">
          <motion.button
            className="rounded-full px-7 py-2.5 text-sm font-semibold"
            style={{
              background: "#8c315b",
              color: "#fff7d6",
              boxShadow: "0 10px 24px rgba(140, 49, 91, 0.28)",
            }}
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            volver al jardin
          </motion.button>
        </div>
      </motion.article>
    </motion.div>
  );
}
