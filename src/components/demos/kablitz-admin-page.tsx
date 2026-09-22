import type { LeadProfile } from "@/lib/lead-schema";
import { KablitzAdminPanel } from "./kablitz-admin-panel";
import "./kablitz-admin-page.css";

export function KablitzAdminPage({ lead }: { lead: LeadProfile }) {
  return (
    <main className="kablitz-admin">
      <p className="kablitz-admin-disclaimer">
        Konzept-Vorschau · Fiktive Beispieldaten · Es werden keine echten Daten übermittelt oder gespeichert
      </p>
      <KablitzAdminPanel lead={lead} />
    </main>
  );
}
