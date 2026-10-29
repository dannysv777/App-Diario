"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ResourceLoadingScreen } from "@/components/ui/ResourceLoadingScreen";
import { ProposalGarden } from "./ProposalGarden";

export function MainGarden() {
  const [phase, setPhase] = useState<"loading" | "welcome" | "garden">("loading");
  const music = useRef<{ start: () => void }>(null);
  const reduced = useReducedMotion();
  const loaded = useCallback(() => setPhase("welcome"), []);
  const enter = useCallback(() => { music.current?.start(); setPhase("garden"); }, []);
  return <>
    <motion.div className="main-garden-reveal" initial={false} animate={{ opacity: phase === "garden" ? 1 : 0, scale: reduced || phase === "garden" ? 1 : 1.025 }} transition={{ duration: reduced ? .15 : 1.1, ease: "easeOut" }}>
      <ProposalGarden main blocked={phase !== "garden"} musicControl={music} />
    </motion.div>
    <AnimatePresence>
      {phase === "loading" && <ResourceLoadingScreen key="resources" onComplete={loaded} />}
      {phase === "welcome" && <motion.div key="welcome" className="main-welcome-transition" exit={{ opacity: 0, y: reduced ? 0 : -12 }} transition={{ duration: reduced ? .15 : .85, ease: "easeInOut" }}><LoadingScreen visible onComplete={enter} /></motion.div>}
    </AnimatePresence>
  </>;
}
