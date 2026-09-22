import { KablitzProjektPage } from "@/components/demos/kablitz-projekt-page";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(`${lead.businessName} - Projektübersicht`, "Geplante Inhalte, Funktionen und Erweiterungen der neuen Kablitz-Website.");

export default function ProjektRoute() {
  return <KablitzProjektPage />;
}
