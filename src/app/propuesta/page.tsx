import { notFound } from "next/navigation";
import { ProposalGarden } from "@/components/proposal/ProposalGarden";
import "./proposal.css";
import "./companion.css";

export const metadata = {
  title: "Nuestro Jardin · Propuesta local",
  robots: { index: false, follow: false },
};

export default function ProposalPage() {
  // This experiment cannot replace or publish the current garden by accident.
  if (process.env.NODE_ENV !== "development") notFound();
  return <ProposalGarden />;
}
