"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Check, X } from "lucide-react";

const storageKey = "nuestro-jardin-house-sign";
const defaultLabel = () => "Para ti";
function readLabel() {
  try { return localStorage.getItem(storageKey)?.trim().slice(0, 28) || defaultLabel(); }
  catch { return defaultLabel(); }
}
function subscribeLabel(update: () => void) {
  window.addEventListener("storage", update);
  return () => window.removeEventListener("storage", update);
}

export function HouseSign() {
  const savedLabel = useSyncExternalStore(subscribeLabel, readLabel, defaultLabel);
  const [override, setLabel] = useState<string | null>(null);
  const label = override ?? savedLabel;
  const [draft, setDraft] = useState(label);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <button className="house-sign" title="Editar letrero de la casa" aria-label="Editar letrero de la casa" onClick={() => { setDraft(label); setError(""); dialog.current?.showModal(); }}>
      <svg viewBox="0 0 160 80" aria-hidden="true">
        <path d="M76 35L78 78H85L84 35" fill="#776047" stroke="#3c4d3e" strokeWidth="2" />
        <path d="M6 6L151 9L155 50L5 47Z" fill="#6e6147" stroke="#b29a6e" strokeWidth="2" />
        <path d="M11 14L140 17M18 40L148 43M24 31L53 32" stroke="#302f28" opacity=".22" strokeWidth="1.5" />
        <circle cx="13" cy="27" r="2" fill="#c4b78e" /><circle cx="146" cy="29" r="2" fill="#c4b78e" />
      </svg>
      <span>{label}</span>
    </button>
    <dialog ref={dialog} className="house-sign-dialog" aria-labelledby="house-sign-title">
      <form onSubmit={event => {
        event.preventDefault();
        const text = draft.trim();
        if (!text) { setError("Escribe algo para tu letrero."); return; }
        setLabel(text);
        try { localStorage.setItem(storageKey, text); } catch { setError("El texto cambió, pero este navegador no permite guardarlo al cerrar."); return; }
        dialog.current?.close();
      }}>
        <h2 id="house-sign-title">El letrero de nuestra casa</h2>
        <label htmlFor="house-sign-text">Texto del letrero</label>
        <input id="house-sign-text" maxLength={28} value={draft} onChange={event => setDraft(event.target.value)} autoFocus />
        {error && <p role="alert">{error}</p>}
        <div className="house-sign-actions">
          <button type="button" onClick={() => dialog.current?.close()}><X size={18} />Cancelar</button>
          <button type="submit"><Check size={18} />Guardar</button>
        </div>
      </form>
    </dialog>
  </>;
}
