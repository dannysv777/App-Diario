"use client";

import { motion } from "framer-motion";

interface MessageOverlayProps {
  title: string;
  body: string;
  onClose: () => void;
}

export function MessageOverlay({ title, body, onClose }: MessageOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        aria-label="Cerrar mensaje"
        className="absolute inset-0"
        style={{ background: "rgba(18, 23, 18, 0.28)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      <motion.article
        className="relative w-full max-w-sm rounded-[20px] p-6 text-center shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, #fff7cc 0%, #ffe2a6 54%, #ffc58f 100%)",
          border: "2px solid rgba(126, 71, 39, 0.18)",
          boxShadow: "0 24px 70px rgba(47, 24, 13, 0.32)",
        }}
        initial={{ y: 20, scale: 0.88 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 12, scale: 0.95 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-3xl"
          style={{
            background: "#8c315b",
            color: "#fff4c4",
            boxShadow: "0 12px 30px rgba(140, 49, 91, 0.32)",
          }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          *
        </motion.div>
        <p className="mb-2 text-xs font-black uppercase" style={{ color: "#9b5a32", letterSpacing: 3 }}>
          flor del jard&iacute;n
        </p>
        <h3 className="mb-3 text-2xl font-black" style={{ color: "#482315" }}>
          {title}
        </h3>
        <p className="mb-6 text-sm leading-7" style={{ color: "#68422d" }}>
          {body}
        </p>
        <button
          className="rounded-full px-6 py-2.5 text-sm font-black"
          style={{ background: "#2f7f3e", color: "#fff7cc" }}
          onClick={onClose}
        >
          guardar en el coraz&oacute;n
        </button>
      </motion.article>
    </motion.div>
  );
}
