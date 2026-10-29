"use client";

import { ArrowDown } from "lucide-react";
import sky from "./sky-data.json";
import { SkyField, type SkyView } from "./SkyField";

type Props = { revealed: boolean; onToggle: () => void; onReturn: () => void; view: SkyView };

export function HistoricSky({ revealed, onToggle, onReturn, view }: Props) {
  return <section className="historic-sky" aria-label="Cielo del 6 de agosto de 2007 en Huehuetenango">
    <header className="historic-sky-heading">
      <p>Huehuetenango, Guatemala</p>
      <h1>El cielo un día muy especial...</h1>
      <time dateTime={sky.meta.local}>6 de agosto de 2007 · 20:00</time>
    </header>
    <button className="historic-sky-map" aria-label={revealed ? "Ocultar constelaciones" : "Mostrar constelaciones"} aria-pressed={revealed} onClick={onToggle}>
      <SkyField view={view} expanded revealed={revealed} />
    </button>
    <button className="historic-sky-return" onClick={onReturn} title="Volver al jardín" aria-label="Volver al jardín"><ArrowDown size={22} /></button>
  </section>;
}
