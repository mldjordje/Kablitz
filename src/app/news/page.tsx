import { KablitzNewsIndex } from "@/components/demos/kablitz-news";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(`${lead.businessName} - News`, "Neuigkeiten aus Projekten, Technik, Service und Karriere.");

export default function NewsRoute() {
  return <KablitzNewsIndex />;
}
