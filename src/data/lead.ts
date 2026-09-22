import media from "@/data/media.json";
import { leadProfileSchema, mediaAssetSchema, type LeadProfile } from "@/lib/lead-schema";

const assets = mediaAssetSchema.array().parse(media);
const [hero, ...gallery] = assets;

const rawLead: LeadProfile = {
  slug: "kablitz-gmbh-r4t9k2",
  family: "corporate",
  status: "research",
  businessName: "Richard Kablitz GmbH",
  businessType: "Biomasse- & Anlagenbau",
  city: "Lauda-Königshofen",
  tagline: "Biomass & Waste to Energy seit 1901.",
  shortDescription:
    "Dieser unverbindliche Entwurf zeigt Richard Kablitz – seit 1901 inhabergeführter Anlagenbauer für Biomasse-Heizkraftwerke, Kesselanlagen, Heißgaserzeuger und Wärmerückgewinnung, mit eigener Gießerei und über 70 Mitarbeitern weltweit.",
  primaryCta: "call",
  highlights: [
    "Über 120 Jahre Firmengeschichte",
    "Eigene Gießerei & Stahlfertigung",
    "ISO 9001:2015 zertifiziert",
    "70+ Mitarbeiter weltweit",
    "Kunden auf 5 Kontinenten",
    "Familiengeführt seit 1901",
  ],
  services: [
    { title: "Feuerungen", description: "Wasser- und luftgekühlte Rostsysteme für nahezu jede Biomasse." },
    { title: "Energiezentralen", description: "Dampfkessel, Thermoölanlagen und Heißwassersysteme." },
    { title: "Wärmetauscher", description: "Rückgewinnungstechnik für effiziente Prozesswärme." },
    { title: "Gießerei", description: "Eigene Gussroste und Lamellenplatten aus eigener Fertigung." },
    { title: "Brennstofflösungen", description: "Biomasse, Agrarreste, Ersatzbrennstoffe und Altholz." },
    { title: "Service & Wartung", description: "Betreuung der Anlagen über die gesamte Lebensdauer." },
  ],
  process: [
    { title: "Planung", description: "Auslegung kompletter Heizkraftwerke und Kesselanlagen." },
    { title: "Fertigung", description: "Eigene Gießerei für Roste und Verschleißteile." },
    { title: "Montage", description: "Inbetriebnahme weltweit beim Kunden vor Ort." },
    { title: "Service", description: "Ersatzteile und Wartung über den gesamten Betrieb." },
  ],
  certifications: [
    { title: "ISO 9001:2015", description: "Zertifiziertes Qualitätsmanagement, Erstzertifizierung 1996." },
    { title: "Gegründet 1901", description: "Ursprünglich in Riga, seit den 1950ern in Deutschland ansässig." },
    { title: "70+ Mitarbeiter", description: "Familiengeführt, Kunden in Europa, Asien, Amerika, Australien und Neuseeland." },
  ],
  contact: {
    phone: "+49 9343 79010",
    address: "Bahnhofstraße 72–78, 97922 Lauda-Königshofen",
    mapsUrl: "https://maps.app.goo.gl/UWMA2mEu4vbreYqVA",
    website: "https://www.kablitz.de/",
  },
  media: hero ? { hero, gallery } : undefined,
  sources: [
    "https://maps.app.goo.gl/UWMA2mEu4vbreYqVA",
    "https://www.kablitz.de/",
    "https://www.kablitz.de/kontakt/",
    "https://www.kablitz.de/wer-wir-sind/",
  ],
  notes:
    "Gegründet 1901 in Riga (Lettland) durch Richard Kablitz, Umzug der Familie und des Unternehmens nach Deutschland Anfang der 1950er. Inhabergeführtes Traditionsunternehmen, über 120 Jahre Firmengeschichte, eigene Gießerei und Stahlfertigung am Standort. Über 70 Mitarbeiter weltweit, Kunden vor allem aus Holzwerkstoff- und Sägeindustrie, daneben Energieversorger, Contractingunternehmen und Kommunen. ISO 9001:2015 zertifiziert (Erstzertifizierung 1996).",
};

export const lead = leadProfileSchema.parse(rawLead);
