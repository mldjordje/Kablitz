import { KablitzKontaktPage } from "@/components/demos/kablitz-kontakt-page";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(`${lead.businessName} - Kontakt`, "Kontakt zur Richard Kablitz GmbH in Lauda-Königshofen.");

export default function KontaktRoute() {
  return <KablitzKontaktPage lead={lead} />;
}
