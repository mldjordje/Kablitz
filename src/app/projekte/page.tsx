import { KablitzMotion } from "@/components/demos/kablitz-motion";
import { KablitzFooter, KablitzHeader } from "@/components/demos/kablitz-page";
import { KablitzProjekte } from "@/components/demos/kablitz-projekte";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";
import "@/components/demos/kablitz-page.css";

export const metadata = buildDemoMetadata(`${lead.businessName} - Unsere Projekte`, "Referenzprojekte der Richard Kablitz GmbH als Fallstudien.");

export default function ProjekteRoute() {
  return (
    <main className="kablitz-page" id="top">
      <KablitzMotion />
      <p className="kablitz-disclaimer">Unverbindliches Designkonzept — nicht die offizielle Website des Unternehmens</p>
      <KablitzHeader lead={lead} />
      <KablitzProjekte />
      <KablitzFooter lead={lead} />
    </main>
  );
}
