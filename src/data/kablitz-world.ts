/**
 * Places for the "1901 → Welt" globe. Sources: kablitz.de/geschichte and the Kablitz reference
 * brochure (biomasse-heizkraftwerk.pdf, 2017). MW/year pairs from the brochure still need a
 * final check against the PDF layout before going live.
 */
export type WorldPlace = {
  id: string;
  label: string;
  country?: string;
  lat: number;
  lng: number;
  year?: string;
  detail?: string;
  /** Fuel burnt at a reference plant (brochure). */
  fuel?: string;
  /** Text for the info panel in explore mode. */
  info: string;
  kind: "origin" | "hub" | "history" | "reference" | "region" | "port";
  /** Reference project from the CMS/admin this marker belongs to. */
  projectId?: string;
};

export const HQ = { lat: 49.565, lng: 9.707 };

const REF = "Biomasse-Heizkraftwerk mit Kablitz-Vorschubrostfeuerung.";

export const PLACES: WorldPlace[] = [
  { id: "riga", label: "Riga", country: "Lettland", lat: 56.95, lng: 24.11, year: "1901", detail: "Gründung", kind: "origin",
    info: "Hier wird Richard Kablitz 1868 geboren. 1899 erfindet er berippte gusseiserne Wärmetauscherplatten, 1901 gründet er in Riga die nach ihm benannte Firma. 1920 folgt das Patent für den Universalrost." },
  { id: "moskau", label: "Moskau", country: "Russland", lat: 55.76, lng: 37.62, detail: "Ingenieurbüro", kind: "history",
    info: "Ein Ingenieurbüro in Moskau erhält eine Herstellungs- und Vertriebsgenehmigung." },
  { id: "wartheland", label: "Wartheland", lat: 52.41, lng: 16.93, year: "1939–1945", kind: "history",
    info: "Infolge der deutsch-sowjetischen Verträge wird das Unternehmen 1939–1941 nach Deutschland überführt und im Wartheland angesiedelt. 1945 kommt die Familie nach Marbach bei Lauda." },
  { id: "lauda", label: "Lauda", country: "Deutschland", lat: HQ.lat, lng: HQ.lng, year: "1951", detail: "Stammsitz mit Gießerei", kind: "hub",
    info: "Seit 1951 der Stammsitz mit eigener Schlosserei und Gießerei. Seit 1990 baut Kablitz von hier aus komplette Anlagen. 2019 wird eine erweiterte Fertigungshalle eingeweiht, 2021 feiert das Unternehmen 120 Jahre." },

  { id: "menznau", label: "Menznau", country: "Schweiz", lat: 47.083, lng: 8.04, year: "2009", detail: "40 MW", fuel: "Produktionsrestholz", kind: "reference", info: REF },
  { id: "sanem", label: "Sanem", country: "Luxemburg", lat: 49.548, lng: 5.929, year: "2010", detail: "15 MW", fuel: "Rinde, Restholz", kind: "reference", info: REF },
  { id: "goch", label: "Goch", country: "Deutschland", lat: 51.68, lng: 6.16, year: "2012", detail: "28 MW", fuel: "Waldrestholz, Landschaftspflegematerial", kind: "reference",
    info: "Biomasse-Heizkraftwerk mit Entnahme-Kondensationsturbine: liefert Prozessdampf an einen benachbarten Kartoffelveredelungsbetrieb und Strom ins Netz." },
  { id: "rosieres", label: "Rosières-en-Santerre", country: "Frankreich", lat: 49.81, lng: 2.7, year: "2012", detail: "19,9 MW", fuel: "Holzhackschnitzel", kind: "reference", info: REF },
  { id: "mergentheim", label: "Bad Mergentheim", country: "Deutschland", lat: 49.49, lng: 9.77, year: "2012", detail: "6,4 MW", fuel: "Holzhackschnitzel", kind: "reference", info: REF },
  { id: "wiesbaden", label: "Wiesbaden", country: "Deutschland", lat: 50.08, lng: 8.24, year: "2013", detail: "38,4 MW", fuel: "Altholz A I – A IV", kind: "reference",
    info: "Altholz-Heizkraftwerk mit Rauchgasbehandlung aus SNCR, Verdampfungskühlung und Trockensorption." },
  { id: "brasov", label: "Brașov", country: "Rumänien", lat: 45.66, lng: 25.61, year: "2015", detail: "60 MW", fuel: "Rinde, Waldrestholz", kind: "reference", info: REF },
  { id: "pemuco", label: "Pemuco", country: "Chile", lat: -36.97, lng: -72.09, year: "2015", detail: "62 MW", fuel: "Holzschreddergut", kind: "reference", info: REF },
  { id: "burgos", label: "Burgos", country: "Spanien", lat: 42.34, lng: -3.7, year: "2016", detail: "35 MW", fuel: "Altholz A I – A II", kind: "reference", info: REF },
  { id: "tiszapuspoki", label: "Tiszapüspöki", country: "Ungarn", lat: 47.21, lng: 20.32, year: "2018", detail: "2 × 15,3 MW", fuel: "Stroh, Miscanthus", kind: "reference", info: REF },

  // Ends of the tanker lanes in the Onassis chapter: typical oil trades of the era, drawn as illustration.
  { id: "nordsee", label: "Nordsee", lat: 54.6, lng: 4.6, detail: "Onassis · 24 Großtanker", kind: "port",
    info: "24 Großtanker von Onassis werden mit Kablitz-Fabrikaten ausgerüstet. Die Routen zeigen typische Tankerverbindungen der Zeit." },
  { id: "golf", label: "Persischer Golf", lat: 26.9, lng: 50.9, kind: "port", info: "Illustrative Tankerroute durch den Suezkanal." },
  { id: "ostkueste", label: "US-Ostküste", lat: 40.4, lng: -73.4, kind: "port", info: "Illustrative Tankerroute über den Nordatlantik." },

  // Regions named on kablitz.de without specific plants: shown as zones, never as cities.
  { id: "nordamerika", label: "Nordamerika", lat: 44, lng: -96, kind: "region", info: "Kablitz-Anlagen sind auch in Nordamerika im Einsatz." },
  { id: "asien", label: "Asien", lat: 32, lng: 102, kind: "region", info: "Kablitz-Anlagen sind auch in Asien im Einsatz." },
  { id: "australien", label: "Australien", lat: -26, lng: 134, kind: "region", info: "Kablitz-Anlagen sind auch in Australien im Einsatz." },
  { id: "neuseeland", label: "Neuseeland", lat: -41.5, lng: 173, kind: "region", info: "Kablitz-Anlagen sind auch in Neuseeland im Einsatz." },
];

/**
 * Tanker lanes for the Onassis chapter. Both leave the North Sea; waypoints keep every leg on open
 * water (Channel, Gibraltar, Suez, Bab-el-Mandeb, Hormuz). `to` is the place the lane arrives at.
 */
export const SEA_LANES: Array<{ id: string; to: string; points: Array<{ lat: number; lng: number }> }> = [
  {
    id: "sea-suez", to: "golf",
    points: [
      { lat: 54.6, lng: 4.6 }, { lat: 51.3, lng: 1.9 }, { lat: 49.9, lng: -2.8 }, { lat: 48.7, lng: -6.3 }, { lat: 44, lng: -10.3 },
      { lat: 36.9, lng: -9.3 }, { lat: 35.95, lng: -5.8 }, { lat: 37.1, lng: 1 }, { lat: 37.6, lng: 10.8 }, { lat: 34.8, lng: 18.5 },
      { lat: 33.1, lng: 27.5 }, { lat: 31.6, lng: 32.3 }, { lat: 29.9, lng: 32.55 }, { lat: 27.3, lng: 34.1 }, { lat: 20.2, lng: 38.4 },
      { lat: 13.1, lng: 43.2 }, { lat: 12.1, lng: 45.8 }, { lat: 13.6, lng: 51.5 }, { lat: 18.3, lng: 57.6 }, { lat: 22.7, lng: 60.1 },
      { lat: 26.3, lng: 56.6 }, { lat: 26.5, lng: 53.4 }, { lat: 26.9, lng: 50.9 },
    ],
  },
  {
    id: "sea-atlantik", to: "ostkueste",
    points: [
      { lat: 54.6, lng: 4.6 }, { lat: 51.3, lng: 1.9 }, { lat: 49.9, lng: -2.8 }, { lat: 48.7, lng: -6.3 }, { lat: 46.5, lng: -24 },
      { lat: 42.5, lng: -48 }, { lat: 40.6, lng: -67 }, { lat: 40.4, lng: -73.4 },
    ],
  },
];
