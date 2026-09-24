import type { WorldPlace } from "@/data/kablitz-world";

/**
 * Demo store for completed reference projects (Lastenheft chapter 6). The admin editor writes here;
 * the public /projekte page and the globe read from it. Lives in this browser's localStorage until
 * the CMS replaces it.
 */

export const REFERENCES_KEY = "kablitz-references-v2";
export const RELEASE = ["Öffentlich", "Anonymisiert", "Intern"] as const;
export type Release = (typeof RELEASE)[number];

export type Reference = {
  id: string; title: string; customer: string; country: string; city: string; lat: string; lng: string; year: string;
  fuel: string; technology: string; thermal: string; electrical: string; fuelAmount: string;
  challenge: string; solution: string; result: string; scope: string[]; image: string; release: Release;
};

/** Demo data: ten invented finished projects (customers marked "Beispiel") plus two stored examples. */
export const REFERENCE_SEED: Reference[] = [
  { id: "ref-quebec", title: "Holzheizkraftwerk Saguenay", customer: "Scierie Boréale (Beispiel)", country: "Kanada", city: "Saguenay", lat: "48.43", lng: "-71.07", year: "2021", fuel: "Holzhackschnitzel", technology: "Vorschubrost (luftgekühlt)", thermal: "24", electrical: "6", fuelAmount: "85000", challenge: "Ein Sägewerk wollte Rinde und Späne statt Heizöl für Trockenkammern und Strom nutzen.", solution: "Luftgekühlter Vorschubrost mit Dampfkessel und Kondensationsturbine, ausgelegt für gefrorenen Brennstoff im Winter.", result: "Heizöl vollständig ersetzt, Strom für den Eigenbedarf und Überschuss ins Netz.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Brennstoffzuführung", "Steuerung", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp", release: "Öffentlich" },
  { id: "ref-oregon", title: "Biomasse-KWK Eugene", customer: "Cascade Timber Energy (Beispiel)", country: "USA", city: "Eugene, Oregon", lat: "44.05", lng: "-123.09", year: "2019", fuel: "Altholz", technology: "Vorschubrost (wassergekühlt)", thermal: "32", electrical: "8,5", fuelAmount: "120000", challenge: "Große Mengen Waldrestholz aus Brandschutz-Durchforstungen blieben ungenutzt.", solution: "Wassergekühlter Vorschubrost für stark schwankende Heizwerte und hohen Aschegehalt.", result: "Stabiler Dauerbetrieb, Brandschutzmaterial wird regional verwertet.", scope: ["Feuerungsanlage", "Rost", "Entaschung", "Rauchgasreinigung", "Montage"], image: "/leads/kablitz-gmbh-r4t9k2/04-16effbe9d8afa5c2.webp", release: "Öffentlich" },
  { id: "ref-parana", title: "Zuckerrohr-Bagasse Ponta Grossa", customer: "Usina Campos Gerais (Beispiel)", country: "Brasilien", city: "Ponta Grossa", lat: "-25.09", lng: "-50.16", year: "2020", fuel: "Agrarreste", technology: "Treppenrost", thermal: "45", electrical: "12", fuelAmount: "210000", challenge: "Eine Zuckerfabrik wollte Bagasse auch außerhalb der Erntezeit verstromen.", solution: "Treppenrost mit Mischbrennstoff-Zuführung für Bagasse und Eukalyptus-Hackschnitzel.", result: "Ganzjähriger Betrieb, Strom für Fabrik und Netz.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Brennstoffzuführung", "Steuerung", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/08-be24f45f2de89987.webp", release: "Öffentlich" },
  { id: "ref-kapstadt", title: "Prozessdampf Paarl", customer: "Cape Fruit Processing (Beispiel)", country: "Südafrika", city: "Paarl", lat: "-33.73", lng: "18.96", year: "2023", fuel: "Agrarreste", technology: "Vorschubrost (luftgekühlt)", thermal: "8", electrical: "", fuelAmount: "22000", challenge: "Ein Obstverarbeiter brauchte Prozessdampf ohne Kohle.", solution: "Kompakte Rostfeuerung für Obsttrester und Weinreben-Schnittgut.", result: "Kohlekessel stillgelegt, rund 18.000 t CO₂ weniger pro Jahr.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/11-734d5f4c6ca7f81f.webp", release: "Öffentlich" },
  { id: "ref-hokkaido", title: "Fernwärme Tomakomai", customer: "Hokkaido Bio Heat (Beispiel)", country: "Japan", city: "Tomakomai", lat: "42.63", lng: "141.6", year: "2022", fuel: "Holzhackschnitzel", technology: "Vorschubrost (wassergekühlt)", thermal: "18", electrical: "4,2", fuelAmount: "60000", challenge: "Ein Stadtwerk wollte heimisches Durchforstungsholz für Fernwärme nutzen.", solution: "Wassergekühlter Rost mit erdbebensicherer Stahlkonstruktion.", result: "Fernwärme für rund 9.000 Haushalte aus regionalem Holz.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Steuerung", "Montage"], image: "/leads/kablitz-gmbh-r4t9k2/02-15a430557cea1328.webp", release: "Öffentlich" },
  { id: "ref-tasmanien", title: "Holztrocknung Launceston", customer: "Tasman Hardwoods (Beispiel)", country: "Australien", city: "Launceston", lat: "-41.44", lng: "147.14", year: "2018", fuel: "Holzhackschnitzel", technology: "Heißgaserzeuger", thermal: "10", electrical: "", fuelAmount: "30000", challenge: "Gasbefeuerte Holztrocknung wurde zu teuer.", solution: "Heißgaserzeuger mit Rostfeuerung, direkt an die Trockenkammern gekoppelt.", result: "Trocknungskosten deutlich gesenkt, eigene Reststoffe genutzt.", scope: ["Feuerungsanlage", "Rost", "Steuerung", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp", release: "Öffentlich" },
  { id: "ref-punjab", title: "Strohkraftwerk Patiala", customer: "Punjab Agro Power (Beispiel)", country: "Indien", city: "Patiala", lat: "30.34", lng: "76.39", year: "2024", fuel: "Agrarreste", technology: "Vorschubrost (wassergekühlt)", thermal: "40", electrical: "10", fuelAmount: "150000", challenge: "Reisstroh wurde auf den Feldern verbrannt und belastete die Luft.", solution: "Wassergekühlter Rost für schlackendes Stroh mit angepasster Luftführung.", result: "Stroh wird verstromt statt verbrannt, spürbar weniger Smog in der Region.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Brennstoffzuführung", "Entaschung", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/04-16effbe9d8afa5c2.webp", release: "Öffentlich" },
  { id: "ref-finnland", title: "Heizwerk Kuopio", customer: "Savon Lämpö (Beispiel)", country: "Finnland", city: "Kuopio", lat: "62.89", lng: "27.68", year: "2017", fuel: "Holzhackschnitzel", technology: "Treppenrost", thermal: "15", electrical: "", fuelAmount: "50000", challenge: "Torf sollte als Brennstoff schrittweise ersetzt werden.", solution: "Treppenrost für Holzhackschnitzel mit bis zu 55 % Feuchte.", result: "Torfanteil auf null gesenkt, Fernwärme aus Holz.", scope: ["Feuerungsanlage", "Rost", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/08-be24f45f2de89987.webp", release: "Öffentlich" },
  { id: "ref-tuerkei", title: "EBS-Kraftwerk Bursa", customer: "Anatolia Enerji (Beispiel)", country: "Türkei", city: "Bursa", lat: "40.19", lng: "29.06", year: "2021", fuel: "Ersatzbrennstoffe (RDF/SRF)", technology: "Vorschubrost (wassergekühlt)", thermal: "35", electrical: "9", fuelAmount: "140000", challenge: "Gewerbeabfälle landeten ungenutzt auf der Deponie.", solution: "Wassergekühlter Rost für RDF mit mehrstufiger Rauchgasreinigung.", result: "Deponiemengen reduziert, Strom und Dampf für einen Industriepark.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Rauchgasreinigung", "Steuerung", "Montage", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/11-734d5f4c6ca7f81f.webp", release: "Öffentlich" },
  { id: "ref-mexiko", title: "Agrarreste Culiacán", customer: "Agroenergía del Pacífico (Beispiel)", country: "Mexiko", city: "Culiacán", lat: "24.81", lng: "-107.39", year: "2025", fuel: "Agrarreste", technology: "Treppenrost", thermal: "12", electrical: "3", fuelAmount: "45000", challenge: "Maisspindeln und Tomatenreste fielen ungenutzt an.", solution: "Treppenrost für wechselnde Agrarreste mit automatischer Entaschung.", result: "Energie für Kühlhäuser und Gewächshäuser aus eigenen Reststoffen.", scope: ["Feuerungsanlage", "Rost", "Entaschung", "Steuerung", "Inbetriebnahme"], image: "/leads/kablitz-gmbh-r4t9k2/02-15a430557cea1328.webp", release: "Öffentlich" },
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

/** Globe markers for released projects with coordinates. Anonymised ones are rounded to a region. */
export function referencePlaces(): WorldPlace[] {
  return loadReferences()
    .filter((r) => isPublic(r) && Number.isFinite(num(r.lat)) && Number.isFinite(num(r.lng)) && r.lat !== "" && r.lng !== "")
    .map((r): WorldPlace => {
      const anon = r.release === "Anonymisiert";
      const lat = anon ? Math.round(num(r.lat)) : num(r.lat);
      const lng = anon ? Math.round(num(r.lng)) : num(r.lng);
      return {
        id: `cms-${r.id}`, label: anon ? r.title : r.city || r.title, country: r.country, lat, lng, year: r.year,
        detail: r.thermal ? `${r.thermal} MW` : undefined, fuel: r.fuel, kind: "project", info: r.result || r.solution, projectId: r.id,
      };
    });
}
