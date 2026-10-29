"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { ResourceLoadingScreen } from "@/components/ui/ResourceLoadingScreen";
import { ProposalGarden } from "./ProposalGarden";

export function MainGarden() {
  const [phase, setPhase] = useState<"loading" | "welcome" | "garden">("loading");
  const loaded = useCallback(() => setPhase("welcome"), []);
  const enter = useCallback(() => setPhase("garden"), []);
  return <>
    <ProposalGarden main blocked={phase !== "garden"} />
    <AnimatePresence>
      {phase === "loading" && <ResourceLoadingScreen key="resources" onComplete={loaded} />}
      {phase === "welcome" && <LoadingScreen key="welcome" visible onComplete={enter} />}
    </AnimatePresence>
  </>;
}
