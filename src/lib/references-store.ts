import type { WorldPlace } from "@/data/kablitz-world";

/**
 * Demo store for completed reference projects (Lastenheft chapter 6). The admin editor writes here;
 * the public /projekte page and the globe read from it. Lives in this browser's localStorage until
 * the CMS replaces it.
 */

export const REFERENCES_KEY = "kablitz-references";
export const RELEASE = ["Öffentlich", "Anonymisiert", "Intern"] as const;
export type Release = (typeof RELEASE)[number];

export type Reference = {
  id: string; title: string; customer: string; country: string; city: string; lat: string; lng: string; year: string;
  fuel: string; technology: string; thermal: string; electrical: string; fuelAmount: string;
  challenge: string; solution: string; result: string; scope: string[]; image: string; release: Release;
};

export const REFERENCE_SEED: Reference[] = [
  { id: "ref-goch", title: "Biomasse-Kraftwerk Goch", customer: "Beispielkunde Energie GmbH", country: "Deutschland", city: "Goch", lat: "51.68", lng: "6.16", year: "2012", fuel: "Altholz", technology: "Vorschubrost (luftgekühlt)", thermal: "28", electrical: "7,2", fuelAmount: "100000", challenge: "Flexible Prozesswärme und Stromerzeugung aus stark schwankenden Altholzqualitäten.", solution: "Luftgekühlter Vorschubrost mit angepasster Luftstufung für wechselnde Heizwerte.", result: "Stabiler Betrieb über das gesamte Brennstoffband, Strom und Prozesswärme aus Reststoffen.", scope: ["Feuerungsanlage", "Rost", "Brennstoffzuführung", "Entaschung", "Steuerung", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp", release: "Öffentlich" },
  { id: "ref-saegewerk", title: "Sägewerk Skandinavien", customer: "Europäischer Sägewerksbetrieb", country: "Schweden", city: "Nordschweden", lat: "63.83", lng: "20.26", year: "2022", fuel: "Holzhackschnitzel", technology: "Treppenrost", thermal: "12", electrical: "", fuelAmount: "40000", challenge: "Große Mengen feuchter Holzreststoffe sollten energetisch verwertet werden.", solution: "Treppenrost für Brennstofffeuchten bis 55 %, Wärme direkt für die Trockenkammern.", result: "Energiegewinnung aus bisher ungenutzten Reststoffen, Gaskessel stillgelegt.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/04-16effbe9d8afa5c2.webp", release: "Anonymisiert" },
  { id: "ref-riga", title: "Fernwärme Riga – Retrofit", customer: "Rīgas Siltums (Beispiel)", country: "Lettland", city: "Riga", lat: "56.95", lng: "24.11", year: "2024", fuel: "Holzhackschnitzel", technology: "Vorschubrost (wassergekühlt)", thermal: "20", electrical: "", fuelAmount: "55000", challenge: "Bestehende Feuerung am Ende der Lebensdauer, Stillstand nur im Sommer möglich.", solution: "Austausch des Rostes gegen wassergekühltes System innerhalb von sechs Wochen.", result: "Höhere Verfügbarkeit, geringerer Verschleiß, Anlage termingerecht zurück im Netz.", scope: ["Rost", "Steuerung", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/08-be24f45f2de89987.webp", release: "Intern" },
];

export function loadReferences(): Reference[] {
  try {
    const raw = localStorage.getItem(REFERENCES_KEY);
    return raw ? JSON.parse(raw) : REFERENCE_SEED;
  } catch {
    return REFERENCE_SEED;
  }
}

export function saveReferences(list: Reference[]) {
  try { localStorage.setItem(REFERENCES_KEY, JSON.stringify(list)); } catch {}
}

/** Projects the public may see: anonymised ones keep only the country. */
export const isPublic = (r: Reference) => r.release !== "Intern";
export const placeLine = (r: Reference) => (r.release === "Anonymisiert" ? r.country : [r.city, r.country].filter(Boolean).join(", "));
export const displayCustomer = (r: Reference) => (r.release === "Anonymisiert" ? "" : r.customer);

const num = (s: string) => Number(String(s).replace(",", "."));

/**
 * Globe markers for released projects with coordinates. Anonymised ones are rounded to a region.
 * Projects already on the globe (within ~30 km of an existing place) are skipped.
 */
export function referencePlaces(existing: WorldPlace[]): WorldPlace[] {
  return loadReferences()
    .filter((r) => isPublic(r) && Number.isFinite(num(r.lat)) && Number.isFinite(num(r.lng)) && r.lat !== "" && r.lng !== "")
    .map((r): WorldPlace => {
      const anon = r.release === "Anonymisiert";
      const lat = anon ? Math.round(num(r.lat)) : num(r.lat);
      const lng = anon ? Math.round(num(r.lng)) : num(r.lng);
      return {
        id: `cms-${r.id}`, label: anon ? r.title : r.city || r.title, country: r.country, lat, lng, year: r.year,
        detail: r.thermal ? `${r.thermal} MW` : undefined, fuel: r.fuel, kind: "reference", info: r.result || r.solution, projectId: r.id,
      };
    })
    .filter((p) => !existing.some((e) => Math.abs(e.lat - p.lat) < 0.3 && Math.abs(e.lng - p.lng) < 0.3));
}
