import { KablitzPage } from "@/components/demos/kablitz-page";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(lead.businessName, lead.shortDescription);

export default function Home() {
  return <KablitzPage lead={lead} />;
}
