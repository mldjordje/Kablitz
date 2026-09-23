import { KablitzWorld } from "@/components/demos/kablitz-world";
import { buildDemoMetadata } from "@/lib/metadata";
import "@/components/demos/kablitz-page.css";

export const metadata = buildDemoMetadata("Globus-Prototyp", "Die Sektion „Von Riga in die Welt“ isoliert zum Testen.");

/** The globe section on its own, with some runway before and after it. */
export default function GlobeLabRoute() {
  return (
    <main className="kablitz-page">
      <div style={{ height: "70vh", display: "grid", placeItems: "center", background: "#0a1016", color: "rgba(255,255,255,.5)" }}>Scrollen ↓</div>
      <KablitzWorld />
      <div style={{ height: "80vh", background: "#0a1016" }} />
    </main>
  );
}
