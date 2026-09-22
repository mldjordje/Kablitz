/** Content of the /projekt overview for the Kablitz management. Source: docs/PROJEKTPLAN-DE.md. */

export const GOALS = [
  { title: "Kompetenz verständlich zeigen", text: "Besucher verstehen in wenigen Sekunden, was Kablitz baut, für wen und mit welchem Vorteil." },
  { title: "Vertrauen durch Referenzen", text: "Realisierte Anlagen werden als nachvollziehbare Fallstudien mit Herausforderung, Lösung und Ergebnis gezeigt." },
  { title: "Servicegeschäft stärken", text: "Ersatzteile, Wartung und Modernisierung erhalten einen eigenen Vertriebsbereich mit strukturierter Anfrage." },
  { title: "Inhalte selbst pflegen", text: "News, Referenzen und Seiteninhalte lassen sich ohne Programmierung über Google-Anmeldung bearbeiten." },
];

export type RequirementGroup = { id: string; title: string; summary: string; items: string[] };

export const REQUIREMENTS: RequirementGroup[] = [
  {
    id: "startseite", title: "Positionierung und Startseite",
    summary: "In wenigen Sekunden erklären: Was macht Kablitz, für wen, mit welchem Vorteil – und wie nimmt man Kontakt auf?",
    items: [
      "Kundenführung: Brennstoff bzw. Kundenproblem → Lösung → Technologie → Referenz → Ergebnis → Service → Kontakt.",
      "Großes authentisches Industrie-Foto oder Video: Anlagen, Kessel, Rost, Gießerei, Fertigung, Montage oder Mitarbeiter.",
      "Bevorzugte Headline: „Energie aus dem, was andere als Abfall sehen.“ Alternativen: „Energie gewinnen. Ressourcen nutzen.“, „Wenn aus Reststoffen Energie wird.“, „Aus Biomasse und Reststoffen. Für Energie und Zukunft.“, „Ressourcen nutzen. Energie erzeugen.“, „Energie aus Ressourcen. Seit 1901.“",
      "Hauptaktion „Projekt anfragen“, zweite Aktion „Mit unseren Ingenieuren sprechen“ oder „Unsere Lösungen“.",
      "Fakten direkt nach dem Einstieg: Erfahrung, gelieferte Systeme, internationale Präsenz, eigene Fertigung – alle Zahlen nach Freigabe.",
      "Lösungskarten: Biomasseenergie, Abfall-zu-Energie, industrielle Prozesswärme, Kraft-Wärme-Kopplung, Service und Modernisierung.",
      "„Warum Kablitz?“: Erfahrung, eigene Gießerei, Engineering und Fertigung aus einer Hand, weltweite Referenzen, Betreuung über den Lebenszyklus.",
      "Aktuelle Projekte mit Foto, Kurzbeschreibung, zwei bis vier Fakten und „Zum Projekt“.",
      "Internationale Präsenz „Von Lauda in die Welt“ mit interaktiver Karte und zugänglicher Textliste.",
      "News, Nachhaltigkeit und Karriere gemäß den Referenzentwürfen integrieren.",
    ],
  },
  {
    id: "navigation", title: "Navigation und Seiteninhalte",
    summary: "Klare Hauptnavigation, Suche und Sprachwechsel DE/EN – ohne bestehende Inhalte zu verlieren.",
    items: [
      "Hauptnavigation: Lösungen, Technologien, Projekte, Unternehmen, Service, Karriere, News & Insights; dazu Kontakt, Suche und DE/EN.",
      "Brennstoffe erhalten einen gut erreichbaren Einstieg im Lösungsbereich.",
      "Mobile Navigation, Tastatur und Touch werden gleichwertig berücksichtigt.",
      "Bestehende Inhalte bleiben erhalten: Wärmetauscher (Rippenplatten, Glasröhren), wasser-/luftgekühlte Roste, Staubfeuerungen, Heißgaserzeuger, Dampfkessel, Thermalöl- und Heißwasseranlagen.",
    ],
  },
  {
    id: "brennstoffe", title: "Brennstoffe als Einstieg",
    summary: "„Was möchten Sie verbrennen?“ – Kunden finden über ihren Brennstoff zur passenden Technik.",
    items: [
      "Kategorien: Altholz, RDF/SRF, Waldrestholz, Rinde, feuchte Biomasse, landwirtschaftliche Reststoffe, Stäube/Fasern, industrielle Reststoffe, ggf. Sonderbrennstoffe.",
      "Jede Brennstoffseite: Eigenschaften, Herausforderungen, Auswahl geeigneter Technik und Roste, belegbare Referenzen, nächster Beratungsschritt.",
      "Keine pauschale Eignungszusage ohne Kenntnis von Brennstoff und Betriebsbedingungen. Die endgültigen Kategorien bestätigt Kablitz fachlich.",
    ],
  },
  {
    id: "referenzen", title: "Referenzen als Fallstudien",
    summary: "Jede Referenz erzählt eine Geschichte: Ausgangslage, Herausforderung, Lösung, Ergebnis.",
    items: [
      "Großes Anlagenfoto, Projekttitel, Kurzbeschreibung und drei bis fünf Kernwerte.",
      "Ausgangssituation, technische Herausforderung, begründete Lösungswahl, Liefer- und Leistungsumfang, technische Daten, Ergebnisse.",
      "Lieferumfang z. B. Brennstoffzuführung, Feuerung, Rost, Kessel, Entaschung, Rauchgasreinigung, Steuerung, Montage, Inbetriebnahme.",
      "Nur belegbare Ergebnisse; Kundendaten bei Bedarf anonymisiert. Goch und das Sägewerk-Beispiel dienen als Vorlagen, bis Daten freigegeben sind.",
    ],
  },
  {
    id: "fertigung", title: "Eigene Fertigung und Gießerei",
    summary: "Die eigene Gießerei ist der zentrale Kundenvorteil – sichtbar gemacht, nicht nur erwähnt.",
    items: [
      "Engineering, Modellbau, Stahlbau, mechanische Bearbeitung, Montage und Qualitätskontrolle zeigen.",
      "Botschaften: „Eigene Gießerei. Eigene Fertigung. Volle Kontrolle.“ und „Vom Engineering bis zum fertigen Rost – aus einer Hand.“",
      "Englische Fassung vorgemerkt: „Built in-house. Built to last.“ und „From engineering to casting – critical components under our own control.“",
    ],
  },
  {
    id: "service", title: "Service und Ersatzteile",
    summary: "Eigener Bereich „Ihre Anlage am Laufen halten“ – mit strukturierter Ersatzteilanfrage.",
    items: [
      "Originalersatzteile, Roststäbe/Gussteile, Inspektion, Wartung, Modernisierung und Leistungsoptimierung.",
      "Ersatzteilanfrage: Bauteil, Anlagentyp, Hersteller, Baujahr, Zeichnungs-/Teilenummer, Menge, Beschreibung, optionale Fotos/Zeichnungen.",
      "Teile für Fremdanlagen und 24/7-Support nur im tatsächlich angebotenen Umfang.",
    ],
  },
  {
    id: "redaktion", title: "Redaktion, Medien und Bewegung",
    summary: "Inhalte ohne Programmierung pflegen; echte Kablitz-Bilder statt Stockfotos.",
    items: [
      "Nachrichtenkategorien: Unternehmen, Projekte, Technologie, Service/Ersatzteile, Nachhaltigkeit, Karriere, Messen.",
      "Authentische Fotos und Videos haben Vorrang, ggf. Fotoshooting. Bildrechte und Freigaben werden dokumentiert.",
      "Feuer im Hero, Scrollbewegungen und animierte Kennzahlen – gezielt eingesetzt, mit Pausenmöglichkeit, ohne Autoplay-Ton.",
    ],
  },
];

export const PAGES = [
  { prio: "P1", path: "/loesungen/biomasseenergie/", need: "Biomasse energetisch nutzen", next: "Projekt anfragen" },
  { prio: "P1", path: "/loesungen/abfall-zu-energie/", need: "Reststoffe und anspruchsvolle Brennstoffe verwerten", next: "Brennstoff besprechen" },
  { prio: "P1", path: "/loesungen/prozesswaerme/", need: "Prozesswärme für einen Industriebetrieb", next: "Wärmebedarf besprechen" },
  { prio: "P1", path: "/loesungen/kraft-waerme-kopplung/", need: "Strom und nutzbare Wärme kombinieren", next: "Einsatzfall prüfen lassen" },
  { prio: "P1", path: "/technologien/wassergekuehlte-roste/", need: "Rosttechnik für konkrete Bedingungen auswählen", next: "Fachberatung" },
  { prio: "P1", path: "/technologien/dampfkessel/", need: "Dampfversorgung planen", next: "Technische Anfrage" },
  { prio: "P1", path: "/service/ersatzteile/", need: "Ersatzteil identifizieren und anfragen", next: "Ersatzteilformular" },
  { prio: "P1", path: "/service/modernisierung/", need: "Verfügbarkeit oder Leistung verbessern", next: "Serviceanfrage" },
  { prio: "P1", path: "/unternehmen/giesserei/", need: "Fertigungstiefe und Qualität beurteilen", next: "Referenzen ansehen" },
  { prio: "P1", path: "/projekte/[projekt]/", need: "Vergleichbare Umsetzung beurteilen", next: "Ähnliches Projekt besprechen" },
  { prio: "P2", path: "/brennstoffe/[brennstoff]/", need: "Anforderungen eines Brennstoffs verstehen", next: "Geeignete Technik" },
  { prio: "P2", path: "/wissen/[frage]/", need: "Fachfrage beantworten, Entscheidung vorbereiten", next: "Verwandte Leistung" },
  { prio: "P2", path: "/news/[beitrag]/", need: "Aktuelle Entwicklungen und Projektfortschritt", next: "Verwandte Fachseite" },
  { prio: "P2", path: "/karriere/", need: "Aufgaben und Arbeitgeber kennenlernen", next: "Bewerbung" },
];

export const QUESTIONS = [
  "Welche Angaben benötigt Kablitz für die Planung einer Biomasseanlage?",
  "Wie beeinflusst die Brennstofffeuchte die Auswahl der Feuerung?",
  "Worin unterscheiden sich wassergekühlte und luftgekühlte Roste?",
  "Welche Herausforderungen entstehen bei Rinde und feuchten Holzreststoffen?",
  "Welche Anforderungen stellen RDF und SRF an die Feuerung?",
  "Wann eignet sich Kraft-Wärme-Kopplung für einen Industriebetrieb?",
  "Welche Faktoren bestimmen die Wirtschaftlichkeit einer Biomasseanlage?",
  "Wie lässt sich eine bestehende Anlage auf andere Brennstoffe anpassen?",
  "Welche Informationen werden für eine Ersatzteilanfrage benötigt?",
  "Sind Ersatzteile für Anlagen anderer Hersteller verfügbar?",
  "Wie werden Inspektion und Wartung einer Anlage geplant?",
  "Welche Vorteile bietet eine eigene Gießerei bei Ersatzteilen und Komponenten?",
];

export const SEO_PRINCIPLES = [
  { title: "Eine Seite pro echtem Anliegen", text: "Jede eigenständige Leistung und jedes eigenständige Kundenproblem erhält eine hilfreiche Seite. Verwandte Fragen werden auf derselben Seite beantwortet – keine massenhaft erzeugten Varianten." },
  { title: "Direkte Antworten für KI-Suche (AEO)", text: "Jede Seite beginnt mit einer klaren Antwort, erklärt Voraussetzungen und Grenzen und belegt Erfahrung mit Referenzen. So können Suchmaschinen und KI-Assistenten Kablitz als Quelle heranziehen." },
  { title: "Technisch sauber", text: "Stabile URLs, individuelle Titel und Beschreibungen, strukturierte Daten (Organization, Breadcrumb, Article), schnelle Ladezeiten, DE/EN mit korrekten Sprachverweisen." },
  { title: "Messbar statt versprochen", text: "Erfolg wird an qualifizierten Projekt- und Serviceanfragen gemessen. Rankings oder Nennungen in KI-Antworten lassen sich nicht garantieren – wir messen und bauen aus, was wirkt." },
];

export const CMS_FEATURES = [
  { title: "Anmeldung mit Google", text: "Nur ausdrücklich freigeschaltete Konten erhalten Zugriff. Rollen: Administrator, Redaktion, Freigabe." },
  { title: "News-Editor", text: "Titel, URL, Zusammenfassung, Text, Kategorie, Titelbild mit Alternativtext, Datum, Autor und SEO-Felder mit Suchergebnis-Vorschau." },
  { title: "Referenzen und Seiten", text: "Fallstudien mit Kennzahlen, Leistungs- und Brennstoffseiten, Startseiteninhalte und Projektkarte pflegen." },
  { title: "Medienbibliothek", text: "Bilder mit Beschreibung, Alternativtext, Bildnachweis und Freigabevermerk." },
  { title: "Freigabeablauf", text: "Entwurf → fachliche Prüfung → Vorschau → Freigabe → Veröffentlichung, mit Versionen und geplanter Veröffentlichung." },
  { title: "Automatisch aktuell", text: "Veröffentlichte Inhalte erscheinen sofort auf der Website und in der Sitemap; Entwürfe bleiben intern." },
];

export const LEGAL = [
  { title: "Impressum", text: "Vollständige Unternehmens-, Vertretungs-, Register- und Kontaktdaten, von jeder Seite erreichbar (§ 5 DDG)." },
  { title: "Datenschutzerklärung", text: "Passend zu Hosting, Formularen, Uploads, CMS und Admin-Anmeldung; Auftragsverarbeitung und Drittlandübermittlung geprüft." },
  { title: "Einwilligung nur wo nötig", text: "Schriften und Medien lokal ausliefern, Karten und Videos ohne unnötige Fremddienste. Falls nötig: Cookie-Banner mit gleichwertigem Ablehnen (§ 25 TDDDG)." },
  { title: "Sichere Formulare", text: "Nur notwendige Pflichtfelder, verschlüsselte Übertragung, Spamschutz, geprüfte Uploads, festgelegte Löschfristen." },
  { title: "Barrierearm", text: "Tastaturbedienung, Kontraste, Alternativtexte; Anwendbarkeit des BFSG wird anhand des Angebots geprüft." },
  { title: "Inhalte und Rechte", text: "Bildrechte, Mitarbeiter- und Kundenfreigaben sowie Leistungs- und Umweltaussagen werden vor Veröffentlichung geprüft." },
];

export type Proposal = { title: string; benefit: string; effort: string; measure: string; recommended?: boolean };

export const PROPOSALS: Proposal[] = [
  { title: "Strukturierte Projektanfrage mit interner Zuordnung", benefit: "Weniger Rückfragen, Anfrage landet direkt beim richtigen Ansprechpartner.", effort: "Mittel · Vertrieb definiert Angaben und Zuständigkeiten", measure: "Zeit bis zur qualifizierten Erstreaktion", recommended: true },
  { title: "Ersatzteilanfrage mit Foto/Zeichnung und Vorgangsnummer", benefit: "Teile schneller identifizieren, Servicekontakte besser nutzen.", effort: "Mittel · sicherer Upload und Bearbeitungsablauf", measure: "Rückfragen je Anfrage, Zeit bis Angebot", recommended: true },
  { title: "Zentrales Anfrageboard mit Erinnerungen", benefit: "Keine liegen gebliebenen Anfragen mehr.", effort: "Mittel · vorhandenes CRM zuerst prüfen", measure: "Anteil fristgerecht bearbeiteter Anfragen", recommended: true },
  { title: "CRM-Anbindung", benefit: "Keine doppelte Dateneingabe, nachvollziehbare Herkunft jeder Verkaufschance.", effort: "Mittel bis hoch · abhängig vom bestehenden CRM", measure: "Bearbeitungsaufwand, qualifizierte Chancen" },
  { title: "Wartungs- und Ersatzteilerinnerungen", benefit: "Wiederkehrendes Servicegeschäft aus der installierten Basis.", effort: "Mittel · verlässliche Anlagendaten nötig", measure: "Serviceaufträge, termingerechte Wartung" },
  { title: "Interne Wissenssuche für Vertrieb und Service", benefit: "Freigegebene Unterlagen in Sekunden statt Minuten finden.", effort: "Mittel bis hoch · Dokumentqualität und Rechte", measure: "Suchzeit, Nutzungsquote" },
  { title: "Kundenportal für Unterlagen und Status", benefit: "Weniger Statusnachfragen, bessere Zusammenarbeit.", effort: "Hoch · Rollen und Systemanbindung", measure: "Statusanfragen, Nutzung" },
  { title: "Redaktionsassistenz für News und Übersetzungen", benefit: "Erste Entwürfe und EN-Fassungen schneller erstellen – immer mit Freigabe.", effort: "Mittel", measure: "Zeit von Entwurf bis Veröffentlichung" },
  { title: "Anfrageassistent auf der Website", benefit: "Besucher rund um die Uhr zur passenden Leistung führen, Übergabe an Menschen.", effort: "Mittel bis hoch · gepflegte Inhalte nötig", measure: "Qualifizierte Kontakte, Abbruchquote" },
  { title: "Beschaffungs- und Lagerintegration", benefit: "Bestände und Teileverfügbarkeit im Service nutzen.", effort: "Hoch · ERP und Artikelstamm zuerst prüfen", measure: "Such- und Erfassungszeit" },
];

export const PHASES = [
  { title: "Inhalte und Umfang", result: "Seiteninventar, priorisierte Kundenfragen, bestätigter Kernumfang und optionale Erweiterungen." },
  { title: "Struktur und Vorlagen", result: "Navigation sowie Vorlagen für Leistung, Brennstoff, Referenz, Wissen und Nachricht." },
  { title: "CMS und Redaktion", result: "Google-Anmeldung, Rechte, Inhalte, Medien und Freigabeablauf." },
  { title: "Inhalte und Anfragen", result: "Fachlich freigegebene Seiten, Referenzen, Kontakt- und Ersatzteilanfragen." },
  { title: "Veröffentlichung", result: "Migration, Weiterleitungen, rechtliche Texte, Qualitätsprüfung und Übergabe." },
  { title: "Weiterentwicklung", result: "Messung, Ausbau wertvoller Themen und ausgewählte Automatisierungen." },
];

export const PREPARE = [
  "Ansprechpartner für Vertrieb, Service und Redaktion sowie die Google-Konten für den Redaktionszugang",
  "Freigegebene Referenzprojekte mit Fotos, Kennzahlen und Kundenfreigabe",
  "Bestätigte Unternehmensangaben: Mitarbeiterzahl, Firmenjahre, gelieferte Systeme, Länder",
  "Impressums- und Registerangaben sowie rechtliche Prüfung der Texte",
  "Bildmaterial und Videos mit Nutzungsrechten, ggf. Termin für ein Fotoshooting",
  "Informationen zu bestehendem CRM/ERP, Hosting und gewünschten Sprachen",
];
