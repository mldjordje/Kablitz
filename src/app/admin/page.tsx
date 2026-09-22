import { KablitzAdminPage } from "@/components/demos/kablitz-admin-page";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(
  `${lead.businessName} - Admin-Vorschau`,
  "Unverbindliche Konzept-Vorschau fuer Beschaffung und Lager.",
);

export default function AdminRoute() {
  return <KablitzAdminPage lead={lead} />;
}
