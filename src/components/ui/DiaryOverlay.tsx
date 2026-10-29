"use client";

/* eslint-disable @next/next/no-img-element -- Album photos are local user images. */
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, Download, ImagePlus, LoaderCircle, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { DiaryEntry, DiaryRepository, diaryRepository, prepareDiaryPhoto } from "@/lib/diary-repository";

interface DiaryOverlayProps {
  onClose: () => void;
  repository?: DiaryRepository;
}

export function DiaryOverlay({ onClose, repository = diaryRepository }: DiaryOverlayProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string>();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const dialog = useRef<HTMLElement>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const photoRequest = useRef(0);
  const selectedIndex = Math.max(0, entries.findIndex(entry => entry.id === selectedId));
  const selectedEntry = entries[selectedIndex];
  const confirmDiscard = () => !editing || (!title.trim() && !message.trim() && !image) || window.confirm("Hay cambios sin guardar. ¿Quieres salir sin guardarlos?");
  const closeAlbum = () => { if (confirmDiscard()) onClose(); };
  const leaveEditor = () => { if (confirmDiscard()) setEditing(false); };

  useEffect(() => {
    let cancelled = false;
    const requests = photoRequest;
    repository.list().then(saved => {
      if (!cancelled) { setEntries(saved); setSelectedId(saved[0]?.id ?? ""); }
    }).catch(() => {
      if (!cancelled) { setLoadFailed(true); setError("No pudimos abrir el álbum. Tus recuerdos no se han borrado. Cierra y vuelve a intentarlo."); }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; requests.current++; };
  }, [repository]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    scroll.current?.scrollTo({ top: 0 });
  }, [selectedId, editing]);

  const beginEdit = (entry?: DiaryEntry) => {
    photoRequest.current++;
    setEditId(entry?.id);
    setTitle(entry?.title ?? "");
    setMessage(entry?.message ?? "");
    setImage(entry?.image);
    setError("");
    setDeletePending(false);
    setEditing(true);
  };

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const request = ++photoRequest.current;
    setPhotoBusy(true);
    setError("");
    try {
      const photo = await prepareDiaryPhoto(file);
      if (request === photoRequest.current) setImage(photo);
    } catch (reason) {
      if (request === photoRequest.current) setError(reason instanceof Error ? reason.message : "No pudimos abrir esa foto.");
    } finally { if (request === photoRequest.current) setPhotoBusy(false); }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || photoBusy || (!title.trim() && !message.trim() && !image)) return;
    const existing = entries.find(entry => entry.id === editId);
    const entry: DiaryEntry = {
      id: existing?.id ?? crypto.randomUUID(),
      title: title.trim() || "Un recuerdo bonito",
      message: message.trim() || "Una foto para guardar en nuestro jardín.",
      image,
      createdAt: existing?.createdAt ?? new Date().toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" }),
      sortOrder: existing?.sortOrder ?? Date.now(),
    };
    setBusy(true);
    setError("");
    try {
      await repository.save(entry);
      setEntries(current => existing ? current.map(item => item.id === entry.id ? entry : item) : [entry, ...current]);
      setSelectedId(entry.id);
      setEditing(false);
    } catch { setError("No se pudo guardar. Tu foto y tu texto siguen aquí; comprueba el espacio disponible y vuelve a intentarlo."); }
    finally { setBusy(false); }
  };

  const removeSelected = async () => {
    if (!selectedEntry || busy) return;
    setBusy(true);
    try {
      await repository.remove(selectedEntry.id);
      setEntries(current => current.filter(entry => entry.id !== selectedEntry.id));
      setSelectedId("");
      setDeletePending(false);
    } catch { setError("No se pudo eliminar el recuerdo. Inténtalo de nuevo."); }
    finally { setBusy(false); }
  };

  const exportAlbum = () => {
    const blob = new Blob([JSON.stringify({ version: 1, entries }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `album-de-recuerdos-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <motion.div className="album-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section ref={dialog} className="album-book" role="dialog" aria-modal="true" aria-labelledby="album-title" tabIndex={-1}
        initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 16, opacity: 0 }}
        onKeyDown={event => {
          if (event.key === "Escape" && !busy && !photoBusy) { event.stopPropagation(); if (editing) leaveEditor(); else closeAlbum(); }
          if (event.key !== "Tab") return;
          const controls = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []);
          const first = controls[0]; const last = controls.at(-1);
          if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }}>
        <header className="album-header">
          <div><span className="album-eyebrow">La casa</span><h2 id="album-title">Álbum de recuerdos</h2></div>
          <button className="album-icon" aria-label="Cerrar diario" title="cerrar" disabled={busy || photoBusy} onClick={closeAlbum}><X size={21} /></button>
        </header>
        <div className="album-toolbar">
          <button className={!editing ? "album-tool active" : "album-tool"} onClick={leaveEditor} disabled={busy || photoBusy}><BookOpen size={18} />Recuerdos</button>
          <button className={editing ? "album-tool active" : "album-tool"} onClick={() => { if (!editing) beginEdit(); }} disabled={loading || busy || photoBusy || loadFailed}><Plus size={18} />Una página</button>
          <button className="album-icon album-backup" title="Descargar copia del álbum" aria-label="Descargar copia del álbum" disabled={!entries.length || busy} onClick={exportAlbum}><Download size={18} /></button>
        </div>
        {error && <p className="album-error" role="alert">{error}</p>}
        <div className="album-scroll" ref={scroll}>
          {loading ? <div className="album-empty" role="status"><LoaderCircle className="album-spinner" /><span>Cargando recuerdos...</span></div> : editing ? (
            <form className="album-editor" onSubmit={handleSubmit}>
              <p className="album-intro">Una página para cada recuerdo. Puedes dejar una foto, una frase o una nota pequeña para que este jardín también tenga historia.</p>
              <label className="album-upload">
                {image ? <img src={image} alt="Vista previa" /> : <ImagePlus size={32} strokeWidth={1.3} />}
                <span>{photoBusy ? "Preparando foto..." : "subir foto"}</span>
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={handleImage} disabled={busy || photoBusy} />
              </label>
              {image && <button type="button" className="album-text-button" onClick={() => setImage(undefined)} disabled={busy || photoBusy}><X size={15} />Quitar foto</button>}
              <label className="album-field"><span>título</span><input autoFocus value={title} onChange={event => setTitle(event.target.value)} maxLength={160} placeholder="Ej. Nuestro día favorito" disabled={busy} /></label>
              <label className="album-field"><span>mensaje</span><textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={12000} placeholder="Escribe algo bonito para guardar..." rows={5} disabled={busy} /></label>
              <div className="album-editor-actions"><button type="button" className="album-tool" onClick={leaveEditor} disabled={busy || photoBusy}>Cancelar</button><button type="submit" className="album-save" disabled={busy || photoBusy || (!title.trim() && !message.trim() && !image)}>{busy ? <LoaderCircle className="album-spinner" size={18} /> : <Save size={18} />}guardar</button></div>
            </form>
          ) : selectedEntry ? (
            <article className="album-page" key={selectedEntry.id}>
              <div className="album-page-top"><span>página abierta</span><div><button className="album-icon" title="Editar recuerdo" aria-label="Editar recuerdo" onClick={() => beginEdit(selectedEntry)}><Pencil size={17} /></button><button className="album-icon" title="Eliminar recuerdo" aria-label="Eliminar recuerdo" onClick={() => setDeletePending(true)}><Trash2 size={17} /></button></div></div>
              {selectedEntry.image && <figure className="album-photo"><img src={selectedEntry.image} alt={selectedEntry.title} /></figure>}
              <div className="album-writing"><time>{selectedEntry.createdAt}</time><h3>{selectedEntry.title}</h3><p>{selectedEntry.message}</p></div>
              {deletePending && <div className="album-delete" role="alert"><p>¿Eliminar este recuerdo del álbum?</p><button className="album-tool" disabled={busy} onClick={() => setDeletePending(false)}>Cancelar</button><button className="album-tool" disabled={busy} onClick={removeSelected}><Check size={16} />Eliminar</button></div>}
            </article>
          ) : (
            <article className="album-empty"><BookOpen size={56} strokeWidth={1} /><span>sin páginas guardadas</span><h3>Tu primera página está esperando</h3><p>Escribe un recuerdo, sube una foto o deja una nota bonita. Esta hoja queda lista para empezar el álbum desde cero.</p><button className="album-save" onClick={() => beginEdit()} disabled={loadFailed}><Plus size={18} />Una página</button></article>
          )}
        </div>
        {!editing && entries.length > 0 && <footer className="album-pagination"><button className="album-icon" aria-label="Página anterior" title="Página anterior" disabled={selectedIndex === 0 || busy} onClick={() => { setSelectedId(entries[selectedIndex - 1].id); setDeletePending(false); }}><ArrowLeft size={20} /></button><span>{selectedIndex + 1} / {entries.length}</span><button className="album-icon" aria-label="Página siguiente" title="Página siguiente" disabled={selectedIndex >= entries.length - 1 || busy} onClick={() => { setSelectedId(entries[selectedIndex + 1].id); setDeletePending(false); }}><ArrowRight size={20} /></button></footer>}
      </motion.section>
    </motion.div>
  );
}
