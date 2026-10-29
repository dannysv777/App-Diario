import { ProposalGarden } from "@/components/proposal/ProposalGarden";
import "./proposal.css";
import "./companion.css";

export const metadata = {
  title: "Nuestro Jardín · Propuesta",
  robots: { index: false, follow: false },
};

export default function ProposalPage() {
  return <ProposalGarden />;
}