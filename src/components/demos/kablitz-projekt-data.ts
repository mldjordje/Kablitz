/** Content of the /projekt document for the Kablitz management. Source: docs/PROJEKTPLAN-DE.md. */

export type Item = { title: string; text: string };
export type Group = { id: string; title: string; intro: string; items: Item[] };

export const GOALS: Item[] = [
  { title: "Kompetenz in Sekunden verständlich machen", text: "Ein Besucher erkennt sofort, was Kablitz baut, für welche Brennstoffe und Branchen – und wie er Kontakt aufnimmt." },
  { title: "Mehr passende Anfragen gewinnen", text: "Jede Seite führt zu einem klaren nächsten Schritt: Projekt anfragen, Brennstoff besprechen oder Ersatzteil anfragen." },
  { title: "Vertrauen durch echte Referenzen", text: "Realisierte Anlagen werden als nachvollziehbare Fallstudien gezeigt – mit Ausgangslage, Lösung und Ergebnis." },
  { title: "Inhalte selbst pflegen", text: "News, Referenzen und Seiteninhalte werden ohne Programmierung über eine Google-Anmeldung aktualisiert." },
];

export const REQUIREMENTS: Group[] = [
  {
    id: "startseite", title: "Startseite und Positionierung",
    intro: "Die Startseite erklärt in wenigen Sekunden, was Kablitz macht, für wen, mit welchem Vorteil – und wie man Kontakt aufnimmt.",
    items: [
      { title: "Kundenführung", text: "Die Seite folgt dem Weg eines Interessenten: Brennstoff oder Problem → passende Lösung → Technologie → Referenz → Ergebnis → Service → Kontakt. So findet jeder Besucher vom eigenen Anliegen zur Anfrage." },
      { title: "Großes Industriebild oder Video", text: "Oben auf der Seite zeigt ein echtes Foto oder Video Anlagen, Kessel, Roste, Gießerei oder Montage. Es vermittelt sofort Größe und Kompetenz." },
      { title: "Hauptaussage", text: "Bevorzugt: „Energie aus dem, was andere als Abfall sehen.“ Alternativen sind dokumentiert, z. B. „Energie aus Ressourcen. Seit 1901.“ Die endgültige Wahl trifft Kablitz." },
      { title: "Zwei klare Aktionen", text: "Hauptknopf „Projekt anfragen“ und ein zweiter Knopf „Mit unseren Ingenieuren sprechen“. Beide sind auf jeder Bildschirmgröße sofort sichtbar." },
      { title: "Kennzahlen", text: "Direkt unter dem Einstieg: Erfahrung, gelieferte Anlagen, Länder, eigene Fertigung. Zahlen erscheinen erst nach Ihrer Bestätigung." },
      { title: "Lösungskarten", text: "Biomasseenergie, Abfall-zu-Energie, Prozesswärme, Kraft-Wärme-Kopplung sowie Service und Modernisierung – jede Karte führt zu einer eigenen Detailseite." },
      { title: "„Warum Kablitz?“", text: "Erfahrung seit 1901, eigene Gießerei, Engineering und Fertigung aus einer Hand, weltweite Referenzen und Betreuung über die gesamte Lebensdauer der Anlage." },
      { title: "Aktuelle Projekte", text: "Ausgewählte Projekte mit Foto, Kurzbeschreibung, zwei bis vier Fakten und Link „Zum Projekt“. Die Auswahl ändert die Redaktion selbst." },
      { title: "Weltkarte „Von Lauda in die Welt“", text: "Eine interaktive Karte zeigt Projektstandorte. Zusätzlich gibt es eine Textliste, damit die Informationen auch ohne Karte lesbar sind." },
    ],
  },
  {
    id: "navigation", title: "Navigation und bestehende Inhalte",
    intro: "Besucher finden jede Information mit höchstens zwei Klicks – auf dem Computer wie auf dem Smartphone.",
    items: [
      { title: "Hauptmenü", text: "Lösungen, Technologien, Projekte, Unternehmen, Service, Karriere, News. Dazu Kontakt, Suche und Sprachwechsel Deutsch/Englisch." },
      { title: "Suche", text: "Eine Suchfunktion durchsucht Leistungen, Brennstoffe, Referenzen und News – nützlich für Kunden, die einen bestimmten Begriff suchen." },
      { title: "Deutsch und Englisch", text: "Alle Seiten gibt es vollständig in beiden Sprachen. Keine leeren oder automatisch übersetzten englischen Seiten." },
      { title: "Nichts geht verloren", text: "Alle heutigen Inhalte werden übernommen: Wärmetauscher (Rippenplatten, Glasröhren), wasser- und luftgekühlte Roste, Staubfeuerungen, Heißgaserzeuger, Dampfkessel, Thermalöl- und Heißwasseranlagen." },
      { title: "Weiterleitungen", text: "Alte Adressen leiten automatisch auf die neuen Seiten weiter. So bleiben Google-Platzierungen und Links von anderen Websites erhalten." },
    ],
  },
  {
    id: "brennstoffe", title: "Brennstoffe als Einstieg",
    intro: "Viele Kunden denken zuerst an ihren Brennstoff. Deshalb gibt es einen eigenen Einstieg: „Was möchten Sie verbrennen?“",
    items: [
      { title: "Brennstoffübersicht", text: "Altholz, RDF/SRF, Waldrestholz, Rinde, feuchte Biomasse, landwirtschaftliche Reststoffe, Stäube und Fasern, industrielle Reststoffe. Die endgültige Liste bestätigt Kablitz fachlich." },
      { title: "Eine Seite pro Brennstoff", text: "Jede Seite erklärt Eigenschaften und Herausforderungen des Brennstoffs, welche Feuerung und welcher Rost passen, zeigt passende Referenzen und endet mit „Brennstoff besprechen“." },
    ],
  },
  {
    id: "referenzen", title: "Referenzen als Fallstudien",
    intro: "Referenzen sind der stärkste Vertrauensbeweis. Jede wird als kurze Geschichte erzählt statt als Bild mit Überschrift.",
    items: [
      { title: "Aufbau jeder Fallstudie", text: "Großes Anlagenfoto, Titel, drei bis fünf Kennzahlen, Ausgangssituation, technische Herausforderung, gewählte Lösung, Lieferumfang, technische Daten und Ergebnis." },
      { title: "Lieferumfang sichtbar", text: "Eine Grafik zeigt, welche Teile Kablitz geliefert hat – z. B. Brennstoffzuführung, Feuerung, Rost, Kessel, Entaschung, Rauchgasreinigung, Montage." },
      { title: "Nur freigegebene Daten", text: "Kennzahlen und Kundennamen erscheinen nur mit Freigabe; auf Wunsch anonymisiert. Goch und das Sägewerk-Beispiel dienen als erste Vorlagen." },
    ],
  },
  {
    id: "fertigung", title: "Eigene Fertigung und Gießerei",
    intro: "Die eigene Gießerei unterscheidet Kablitz von vielen Wettbewerbern. Die Website zeigt sie als klaren Kundenvorteil.",
    items: [
      { title: "Fertigungsseite", text: "Engineering, Modellbau, Gießerei, Stahlbau, Bearbeitung, Montage und Qualitätskontrolle – mit echten Fotos aus Lauda." },
      { title: "Kernbotschaft", text: "„Eigene Gießerei. Eigene Fertigung. Volle Kontrolle.“ Für Kunden bedeutet das: kurze Wege, gleichbleibende Qualität und Ersatzteile aus erster Hand." },
    ],
  },
  {
    id: "service", title: "Service und Ersatzteile",
    intro: "Ein eigener Bereich „Ihre Anlage am Laufen halten“ stärkt das wiederkehrende Servicegeschäft.",
    items: [
      { title: "Serviceleistungen", text: "Originalersatzteile, Roststäbe und Gussteile, Inspektion, Wartung, Modernisierung und Leistungsoptimierung – jeweils mit kurzer Erklärung und Ansprechpartner." },
      { title: "Ersatzteilformular", text: "Der Kunde gibt Bauteil, Anlagentyp, Hersteller, Baujahr, Teilenummer und Menge an und kann ein Foto oder eine Zeichnung anhängen. Der Service erhält eine vollständige Anfrage statt einer vagen E-Mail." },
    ],
  },
  {
    id: "news", title: "News, Medien und Gestaltung",
    intro: "Die Website bleibt lebendig, weil Ihr Team selbst veröffentlicht – mit echten Bildern statt Stockfotos.",
    items: [
      { title: "News-Kategorien", text: "Unternehmen, Projekte, Technologie, Service, Nachhaltigkeit, Karriere, Messen. Jede News hat eine eigene Seite und erscheint automatisch auf der Startseite." },
      { title: "Echte Bilder", text: "Fotos und Videos von Kablitz haben Vorrang; bei Bedarf organisieren wir ein Fotoshooting. Bildrechte werden dokumentiert." },
      { title: "Bewegung mit Maß", text: "Feuer im Einstieg, Scroll-Effekte und animierte Kennzahlen – gezielt eingesetzt, ohne die Lesbarkeit zu stören und ohne automatischen Ton." },
    ],
  },
];

export const PAGE_GROUPS: Item[] = [
  { title: "Lösungsseiten", text: "Biomasseenergie, Abfall-zu-Energie, Prozesswärme, Kraft-Wärme-Kopplung. Für Kunden, die ein Ziel haben, aber die Technik noch nicht kennen." },
  { title: "Technologieseiten", text: "Wasser- und luftgekühlte Roste, Staubfeuerungen, Dampfkessel, Heißgaserzeuger, Thermalöl, Heißwasser, Wärmetauscher. Für Ingenieure, die Technik vergleichen." },
  { title: "Brennstoffseiten", text: "Eine Seite pro Brennstoff. Für Kunden, die wissen, was sie verbrennen wollen." },
  { title: "Serviceseiten", text: "Ersatzteile, Roststäbe und Gussteile, Wartung, Modernisierung. Für Betreiber bestehender Anlagen." },
  { title: "Referenzen", text: "Übersicht und eine Seite pro Projekt. Für Kunden, die vergleichbare Anlagen sehen wollen." },
  { title: "Wissensseiten", text: "Antworten auf konkrete Kundenfragen, z. B. „Worin unterscheiden sich wasser- und luftgekühlte Roste?“ Diese Seiten sind die Grundlage für die KI-Sichtbarkeit (siehe Abschnitt 6)." },
  { title: "Unternehmen, Karriere, News, Kontakt", text: "Geschichte, Fertigung, Stellenangebote, aktuelle Meldungen und alle Kontaktwege." },
];

export const CMS: Item[] = [
  { title: "Anmeldung mit Google", text: "Ihr Team meldet sich mit dem vorhandenen Google-Konto an – kein zusätzliches Passwort. Nur Konten, die Sie freischalten, erhalten Zugriff." },
  { title: "Rollen", text: "Administrator verwaltet Benutzer und Einstellungen, Redaktion schreibt Entwürfe, Freigabe veröffentlicht. Eine Person kann mehrere Rollen haben." },
  { title: "News-Editor", text: "Titel, Text, Kategorie, Titelbild, Datum und Autor eingeben, speichern, veröffentlichen. Die Adresse der Seite entsteht automatisch aus dem Titel." },
  { title: "Suchmaschinen-Felder", text: "Zu jedem Beitrag lassen sich Titel und Beschreibung für Google festlegen. Eine Vorschau zeigt, wie der Eintrag in den Suchergebnissen aussieht." },
  { title: "Referenzen und Seiten bearbeiten", text: "Fallstudien, Kennzahlen, Leistungs- und Brennstoffseiten sowie Startseiteninhalte werden über Formulare gepflegt." },
  { title: "Medienbibliothek", text: "Alle Bilder an einem Ort, mit Beschreibung, Alternativtext für Barrierefreiheit und Vermerk zu Bildrechten." },
  { title: "Entwurf, Freigabe, Veröffentlichung", text: "Beiträge können als Entwurf gespeichert, geprüft und zu einem festen Zeitpunkt veröffentlicht werden. Frühere Versionen lassen sich wiederherstellen." },
];

export const LEGAL: Item[] = [
  { title: "Impressum", text: "Vollständige Unternehmens-, Register- und Kontaktangaben, von jeder Seite mit einem Klick erreichbar (§ 5 DDG)." },
  { title: "Datenschutzerklärung", text: "Beschreibt genau die tatsächlich eingesetzten Dienste: Hosting, Formulare, Uploads, Admin-Anmeldung. Wird vor dem Start rechtlich geprüft." },
  { title: "Einwilligung nur wo nötig", text: "Schriften und Bilder werden vom eigenen Server geladen. Google Maps und Videos laden erst nach Klick des Besuchers – so wie bereits auf der Demo zu sehen (§ 25 TDDDG)." },
  { title: "Sichere Formulare", text: "Nur notwendige Pflichtfelder, verschlüsselte Übertragung, Spamschutz, geprüfte Datei-Uploads und festgelegte Löschfristen." },
  { title: "Barrierearm", text: "Bedienbar mit Tastatur, ausreichende Kontraste, Alternativtexte für Bilder. Ob das Barrierefreiheitsstärkungsgesetz greift, wird anhand des Angebots geprüft." },
  { title: "Bild- und Aussagenrechte", text: "Fotos, Mitarbeiter- und Kundenfreigaben sowie Leistungs- und Umweltaussagen werden vor Veröffentlichung geprüft." },
];

export const AEO_STEPS: Item[] = [
  { title: "Antwortseiten zu echten Kundenfragen", text: "Für jede häufige Frage entsteht eine Seite, die sie im ersten Absatz klar beantwortet und dann vertieft. KI-Systeme übernehmen bevorzugt solche direkten, belegten Antworten." },
  { title: "Eindeutige Fakten über Kablitz", text: "Gründungsjahr, Standort, Leistungen, Brennstoffe und Referenzen stehen überall gleich und maschinenlesbar im Seitencode (strukturierte Daten). So ordnet die KI Kablitz korrekt als Hersteller für diese Themen ein." },
  { title: "Belege statt Werbesprache", text: "Referenzen mit Zahlen, technische Erklärungen und Fachautoren. KI-Systeme nennen Quellen, die fachlich glaubwürdig wirken – nicht die lautesten." },
  { title: "Präsenz außerhalb der eigenen Website", text: "Einträge in Branchenverzeichnissen, Fachportalen und Verbandslisten mit einheitlichen Angaben. Je öfter Kablitz an vertrauenswürdigen Stellen im gleichen Zusammenhang erscheint, desto eher wird Kablitz genannt." },
  { title: "Monatliche Messung", text: "Wir stellen ChatGPT, Gemini, Perplexity und Google-KI jeden Monat dieselben 20–30 Kundenfragen und dokumentieren, ob und wie Kablitz genannt wird. So wird der Fortschritt sichtbar." },
];

export const AEO_QUESTIONS = [
  "Welcher Hersteller baut wassergekühlte Roste für Altholz?",
  "Wer liefert Biomasse-Heizkraftwerke in Deutschland?",
  "Welche Feuerung eignet sich für RDF und SRF?",
  "Wo bekomme ich Ersatz-Roststäbe für meine Biomasseanlage?",
  "Worin unterscheiden sich wassergekühlte und luftgekühlte Roste?",
];

export type Proposal = { title: string; does: string; benefit: string };

export const PROPOSALS_NOW: Proposal[] = [
  { title: "Strukturierte Projektanfrage", does: "Statt eines leeren Kontaktformulars fragt die Anfrage gezielt nach Brennstoff, Menge, Wärme- oder Dampfbedarf, Betriebsstunden und Standort. Die Anfrage geht automatisch an den zuständigen Ansprechpartner.", benefit: "Weniger Rückfragen, schnellere Angebote, bessere Einschätzung der Anfrage schon beim ersten Lesen." },
  { title: "Ersatzteilanfrage mit Foto und Vorgangsnummer", does: "Der Kunde lädt ein Foto oder eine Zeichnung hoch und erhält sofort eine Vorgangsnummer per E-Mail.", benefit: "Teile werden schneller identifiziert; Kunde und Service sprechen über denselben Vorgang." },
  { title: "Anfrage-Übersicht mit Erinnerungen", does: "Alle Website-Anfragen erscheinen in einer einfachen Liste im Admin-Bereich mit Status (neu, in Bearbeitung, erledigt). Bleibt eine Anfrage zwei Tage unbearbeitet, erinnert das System per E-Mail.", benefit: "Keine Anfrage geht im Postfach verloren." },
  { title: "KI-Unterstützung für die Redaktion", does: "Aus Stichpunkten entsteht ein erster News-Entwurf; die englische Fassung wird vorgeschlagen. Ihr Team prüft und gibt frei.", benefit: "News und englische Seiten entstehen in Minuten statt Stunden." },
];

export const PROPOSALS_LATER: Proposal[] = [
  { title: "CRM-Anbindung", does: "Website-Anfragen landen direkt als Kontakt und Verkaufschance in Ihrem CRM.", benefit: "Setzt voraus, dass wir Ihr CRM und dessen Schnittstelle kennen." },
  { title: "Anbindung an ERP und Lager", does: "Verfügbarkeit von Ersatzteilen und Beständen wird im Service sichtbar.", benefit: "Setzt eine Prüfung von ERP, Artikelstamm und Abläufen voraus." },
  { title: "Kundenportal", does: "Kunden sehen Unterlagen, Zeichnungen und den Status ihrer Aufträge in einem geschützten Bereich.", benefit: "Setzt Rollen, Rechte pro Kunde und Anbindung an Ihre Systeme voraus." },
  { title: "Wartungs- und Ersatzteilerinnerungen", does: "Betreiber werden automatisch an fällige Wartungen und Verschleißteile erinnert.", benefit: "Setzt eine gepflegte Datenbank der installierten Anlagen voraus." },
  { title: "Interne Wissenssuche", does: "Vertrieb und Service durchsuchen freigegebene Dokumente, Zeichnungen und Angebote in Sekunden.", benefit: "Setzt geordnete Dokumente und Zugriffsrechte voraus." },
  { title: "Chat-Assistent auf der Website", does: "Beantwortet Besucherfragen rund um die Uhr und übergibt an einen Mitarbeiter.", benefit: "Sinnvoll, sobald genügend gepflegte Fachinhalte vorhanden sind." },
];

export const PHASES: Item[] = [
  { title: "Inhalte und Umfang festlegen", text: "Wir erfassen alle heutigen Seiten, klären den Kernumfang und entscheiden gemeinsam über die Erweiterungen." },
  { title: "Struktur und Vorlagen", text: "Menü und Seitenvorlagen für Leistung, Brennstoff, Referenz, Wissen und News werden gestaltet und abgestimmt." },
  { title: "Redaktionssystem", text: "Google-Anmeldung, Rollen, Editor und Medienbibliothek werden eingerichtet; Ihr Team erhält eine Einweisung." },
  { title: "Inhalte und Formulare", text: "Texte, Referenzen und Bilder werden eingepflegt und fachlich freigegeben; Anfrageformulare werden getestet." },
  { title: "Veröffentlichung", text: "Weiterleitungen, Rechtstexte, Geschwindigkeits- und Qualitätsprüfung, dann Livegang." },
  { title: "Weiterentwicklung", text: "Monatliche Auswertung von Anfragen, Google- und KI-Sichtbarkeit; neue Wissensseiten dort, wo sie Wirkung zeigen." },
];

export const PREPARE = [
  "Ansprechpartner für Vertrieb, Service und Redaktion sowie die Google-Konten für den Redaktionszugang",
  "Freigegebene Referenzprojekte mit Fotos und Kennzahlen",
  "Bestätigte Unternehmensangaben: Mitarbeiterzahl, Firmenjahre, gelieferte Anlagen, Länder",
  "Impressums- und Registerangaben",
  "Fotos und Videos in Originalqualität, ggf. Termin für ein Fotoshooting",
  "Häufige Kundenfragen aus Vertrieb und Service – die Grundlage für die KI-Sichtbarkeit",
];
