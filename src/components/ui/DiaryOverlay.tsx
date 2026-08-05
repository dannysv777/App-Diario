"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";

interface DiaryOverlayProps {
  onClose: () => void;
}

interface DiaryEntry {
  id: string;
  title: string;
  message: string;
  image?: string;
  createdAt: string;
}

const storageKey = "nuestro-jardin-diary";

const starterEntries: DiaryEntry[] = [
  {
    id: "starter-1",
    title: "Nuestro primer rinconcito",
    message:
      "Esta casita guarda las cosas bonitas que quiero recordar contigo. Aqui podremos poner fotos, mensajes y pequenas aventuras.",
    createdAt: "Hoy",
  },
];

export function DiaryOverlay({ onClose }: DiaryOverlayProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    if (typeof window === "undefined") return starterEntries;
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as DiaryEntry[]) : starterEntries;
    } catch {
      return starterEntries;
    }
  });
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? starterEntries[0].id);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | undefined>();

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.id === selectedId) ?? entries[0],
    [entries, selectedId],
  );

  const saveEntries = (nextEntries: DiaryEntry[]) => {
    setEntries(nextEntries);
    window.localStorage.setItem(storageKey, JSON.stringify(nextEntries));
  };

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() && !message.trim() && !image) return;

    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      title: title.trim() || "Un recuerdo bonito",
      message: message.trim() || "Una foto para guardar en nuestro jardin.",
      image,
      createdAt: new Date().toLocaleDateString("es-GT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };

    const nextEntries = [entry, ...entries];
    saveEntries(nextEntries);
    setSelectedId(entry.id);
    setTitle("");
    setMessage("");
    setImage(undefined);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <button
        aria-label="Cerrar diario"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255, 184, 84, 0.18), transparent 38%), linear-gradient(180deg, rgba(24, 18, 44, 0.48), rgba(20, 10, 5, 0.78))",
          backdropFilter: "blur(5px)",
        }}
        onClick={onClose}
      />

      <motion.section
        className="relative grid max-h-[92vh] w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[22px] shadow-2xl lg:grid-cols-[0.82fr_1.18fr]"
        style={{
          background: "#4a2317",
          border: "4px solid rgba(42, 20, 12, 0.72)",
          boxShadow: "0 34px 100px rgba(18, 8, 5, 0.56)",
        }}
        initial={{ y: 34, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 18, scale: 0.98 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute bottom-0 top-0 z-10 hidden w-5 lg:left-[calc(41%-10px)] lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(36, 16, 9, 0.45), rgba(255, 235, 172, 0.2), rgba(36, 16, 9, 0.45))",
          }}
        />

        <div
          className="relative overflow-y-auto p-5 sm:p-7"
          style={{
            background:
              "linear-gradient(135deg, #32170f 0%, #6d351f 45%, #a46032 100%)",
            color: "#ffe9b7",
          }}
        >
          <div
            className="pointer-events-none absolute inset-4 rounded-[18px]"
            style={{
              border: "1px solid rgba(255, 226, 154, 0.24)",
              boxShadow: "inset 0 0 0 7px rgba(58, 26, 16, 0.22)",
            }}
          />

          <button
            className="absolute right-5 top-5 z-10 rounded-full px-3 py-1 text-sm font-bold"
            style={{ background: "rgba(255, 233, 183, 0.16)", color: "#fff2c8" }}
            onClick={onClose}
          >
            cerrar
          </button>

          <div className="relative">
            <p className="mb-2 text-xs font-bold uppercase" style={{ letterSpacing: 3, color: "#ffd36b" }}>
              La casa
            </p>
            <h2 className="mb-3 max-w-sm text-4xl font-black leading-none">
              Nuestro album de aventuras
            </h2>
            <p className="mb-6 max-w-sm text-sm leading-6" style={{ color: "rgba(255, 242, 200, 0.84)" }}>
              Una pagina para cada recuerdo. Puedes dejar una foto, una frase o
              una nota pequena para que este jardin tambien tenga historia.
            </p>

            <form
              className="space-y-4 rounded-[18px] p-4"
              style={{
                background: "rgba(42, 20, 12, 0.34)",
                border: "1px solid rgba(255, 233, 183, 0.18)",
              }}
              onSubmit={handleSubmit}
            >
              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase" style={{ letterSpacing: 2 }}>
                  titulo
                </span>
                <input
                  className="w-full rounded-xl border-0 px-4 py-3 text-sm outline-none"
                  style={{ background: "#fff0c7", color: "#3d2114" }}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ej. Nuestro dia favorito"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-bold uppercase" style={{ letterSpacing: 2 }}>
                  mensaje
                </span>
                <textarea
                  className="min-h-28 w-full resize-none rounded-xl border-0 px-4 py-3 text-sm outline-none"
                  style={{ background: "#fff0c7", color: "#3d2114" }}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Escribe algo bonito para guardar..."
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label
                  className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed px-4 py-3 text-sm font-bold"
                  style={{ borderColor: "rgba(255, 233, 183, 0.45)", color: "#fff1c5" }}
                >
                  subir foto
                  <input className="hidden" type="file" accept="image/*" onChange={handleImage} />
                </label>
                <button
                  className="rounded-xl px-5 py-3 text-sm font-black uppercase"
                  style={{
                    background: "linear-gradient(90deg, #ffd36b, #ff9b54)",
                    color: "#4b2416",
                    letterSpacing: 1,
                  }}
                >
                  guardar
                </button>
              </div>

              {image && (
                <div
                  className="rotate-[-1.5deg] overflow-hidden rounded-md border-[10px]"
                  style={{ borderColor: "#fff8df", boxShadow: "0 12px 30px rgba(19, 8, 4, 0.28)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="Vista previa" className="max-h-44 w-full object-cover" />
                </div>
              )}
            </form>
          </div>
        </div>

        <div
          className="max-h-[92vh] overflow-y-auto p-5 sm:p-7"
          style={{
            background:
              "linear-gradient(90deg, #f1d296 0%, #fff1c6 10%, #ffeab2 100%)",
            color: "#3f2416",
          }}
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase" style={{ color: "#9b5a32", letterSpacing: 3 }}>
                pagina abierta
              </p>
              <h3 className="text-3xl font-black">Recuerdos</h3>
            </div>
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#d59c56" }}>
              {entries.length}
            </span>
          </div>

          {selectedEntry && (
            <article
              className="mb-6 grid gap-5 rounded-[18px] p-4 md:grid-cols-[0.82fr_1fr]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255, 250, 222, 0.9), rgba(255, 239, 188, 0.92))",
                border: "1px solid rgba(97, 54, 27, 0.16)",
                boxShadow: "0 16px 38px rgba(81, 43, 22, 0.14)",
              }}
            >
              <div
                className="min-h-48 rotate-[-1.2deg] overflow-hidden rounded-md border-[12px]"
                style={{ borderColor: "#fffaf0", background: "#e5b86d" }}
              >
                {selectedEntry.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedEntry.image} alt="" className="h-full min-h-48 w-full object-cover" />
                ) : (
                  <div
                    className="flex h-full min-h-48 items-center justify-center text-5xl font-black"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 36%, #ffd36b, #ff9b54 55%, #8c315b 100%)",
                      color: "#fff8d9",
                    }}
                  >
                    *
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-2 text-[11px] font-black uppercase" style={{ color: "#a16236", letterSpacing: 2 }}>
                  {selectedEntry.createdAt}
                </p>
                <h4 className="mb-3 text-2xl font-black">{selectedEntry.title}</h4>
                <p className="text-sm leading-7" style={{ color: "#68422d" }}>
                  {selectedEntry.message}
                </p>
              </div>
            </article>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry) => {
              const selected = entry.id === selectedEntry?.id;
              return (
                <button
                  key={entry.id}
                  className="rounded-xl p-3 text-left transition"
                  style={{
                    background: selected ? "#fff8dd" : "rgba(255, 248, 221, 0.58)",
                    border: selected
                      ? "2px solid rgba(140, 49, 91, 0.5)"
                      : "1px solid rgba(97, 54, 27, 0.14)",
                    boxShadow: selected ? "0 12px 28px rgba(81, 43, 22, 0.14)" : "none",
                  }}
                  onClick={() => setSelectedId(entry.id)}
                >
                  <div className="mb-3 h-24 overflow-hidden rounded-lg" style={{ background: "#e9bb73" }}>
                    {entry.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div
                        className="flex h-full items-center justify-center text-3xl font-black"
                        style={{ background: "linear-gradient(135deg, #ffd36b, #ff9fb8)", color: "#fff8dd" }}
                      >
                        *
                      </div>
                    )}
                  </div>
                  <p className="mb-1 text-[10px] font-black uppercase" style={{ color: "#a16236", letterSpacing: 2 }}>
                    {entry.createdAt}
                  </p>
                  <h5 className="line-clamp-2 text-sm font-black">{entry.title}</h5>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
