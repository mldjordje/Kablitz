import { KablitzProjektPage } from "@/components/demos/kablitz-projekt-page";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(`${lead.businessName} - Leistungsangebot von ADSPIRE`, "Leistungsumfang der mehrsprachigen Kablitz-Website: interaktive Präsentation, CMS, Anfragen, SEO/AEO und Betreuung.");

export default function ProjektRoute() {
  return <KablitzProjektPage />;
}
