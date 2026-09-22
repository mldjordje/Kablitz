# Kablitz: Projektplan und Spezifikation der Seite „Projekt“

Stand: 22. September 2026. Arbeitsgrundlage für die Geschäftsführung und die spätere Umsetzung.

## 1. Zweck und verbindliche Abgrenzung

Die Seite „Projekt“ auf dem Demo-Auftritt erklärt der Geschäftsführung, welche Inhalte und Funktionen für den neuen Unternehmensauftritt vorgesehen sind, welchen Nutzen sie bieten und welche Erweiterungen wir empfehlen. Sie ist eine Projektpräsentation, keine öffentlich zu positionierende SEO-Landingpage. Die überarbeitete Startseite ist direkt unter https://kablitz.vercel.app/ erlebbar und wird auf „Projekt“ nicht noch einmal als bevorstehendes Demo-Upgrade verkauft.

Die Projektseite und ihre gesamte Benutzeroberfläche sind deutschsprachig. Für die spätere Unternehmenswebsite bleibt die im Kundenbrief gewünschte Unterstützung für Deutsch und Englisch erhalten. Weitere bereits vorhandene Sprachen werden bei der Migration separat berücksichtigt.

Dieses Dokument bewahrt die Wünsche aus „Kablitz Webseite.pptx“, dem geteilten GPT-Gespräch und den Designreferenzen. Vorschläge des geteilten Gesprächs, alternative Formulierungen und Beispieldaten werden nicht automatisch zu bestätigten Leistungsversprechen. Die nachträglichen direkten Vorgaben des Auftraggebers haben Vorrang.

Status: Planung. Die hier beschriebenen Funktionen sind noch nicht als umgesetzt oder beauftragt zu kennzeichnen. Die bestehende Route `/admin` ist laut Repository eine Konzeptvorschau für Beschaffung und Lager; sie ist kein produktives CMS.

## 2. Inhalt und Aufbau der Seite „Projekt“

Vorgeschlagene Route: `/projekt`. Die Projektübersicht bleibt sprachlich und technisch von den öffentlichen Kundenreferenzen unter `/projekte/` getrennt.

### Einstieg

**H1: Der nächste Schritt für Kablitz**

**Einleitung:** „Die neue Website soll die Kompetenz von Kablitz sichtbar machen, passende Kundenanfragen gewinnen und die tägliche Arbeit erleichtern. Hier sehen Sie die geplanten Inhalte, Funktionen und Erweiterungsmöglichkeiten.“

Schaltflächen: „Geplante Website ansehen“ als Sprung zu den Anforderungen und „Zusätzliche Möglichkeiten entdecken“ als Sprung zu den Vorschlägen. Ein dezenter Link „Zur Demo-Startseite“ führt zur vorhandenen Demo. Keine erfundenen Fertigstellungsgrade, Termine, Preisangaben oder Zustimmungsschaltflächen ohne echten Ablauf.

### Abschnittsfolge und sichtbare Texte

| Bereich | Überschrift | Inhalt und Darstellung |
| --- | --- | --- |
| Zielbild | Mehr passende Anfragen. Weniger manueller Aufwand. | Geschäftliche Ziele erklären: Kompetenz verständlich zeigen, Vertrauen durch Referenzen aufbauen, Servicegeschäft stärken und Inhalte selbst pflegen. Ergebnisse als Ziele formulieren. |
| Kundenanforderungen | Ihre Anforderungen an die neue Website | Vollständige Themenübersicht aus Präsentation und Gespräch; nach Lösungen, Referenzen, Fertigung, Service, Internationalität und Kontakt gruppieren. Details bei Bedarf aufklappbar. |
| Seitenstruktur | Für jede relevante Aufgabe der passende Einstieg | Geplante Inhaltsbereiche und Beispiele für Unterseiten. Zeigen, wie Kunden von einem Brennstoff oder Problem zur Lösung und Anfrage gelangen. |
| Auffindbarkeit | Bei Suchmaschinen und KI-Antworten auffindbar werden | SEO/AEO in verständlicher Sprache, mit konkreten Seitenbeispielen und ohne Ranking- oder Zitiergarantie erklären. |
| Redaktion | Inhalte selbst veröffentlichen und aktualisieren | Google-Anmeldung, Nachrichteneditor, Medien, Referenzen, Seiteninhalte, Vorschau und Freigabe erläutern. |
| Recht und Qualität | Datenschutz und Qualität von Anfang an | Technische Maßnahmen und vor Veröffentlichung erforderliche Unternehmensangaben/Freigaben erklären. Keine pauschale Zusicherung „100 % rechtssicher“. |
| Erweiterungen | Weitere Möglichkeiten für Vertrieb und Service | Unsere Vorschläge mit Nutzen, Aufwand, Voraussetzungen und Messgröße darstellen. Deutlich als optional kennzeichnen. |
| Vorgehen | So entsteht der neue Unternehmensauftritt | Phasen des eigentlichen Website-Ausbaus nach der Demo erläutern. |
| Mitarbeit | Was wir gemeinsam vorbereiten | Benötigte Fotos, Referenzfreigaben, Fachinformationen, Ansprechpartner und Systeminformationen nennen. |

### Gestaltung und Bedienung

Das Erscheinungsbild folgt dem Demo: Kablitz-Rot, dunkles Blau/Anthrazit, Weiß, klare Typografie und zurückhaltende industrielle Akzente. Die Projektseite ist eine verständliche Präsentation für Entscheider. Lange technische Details erscheinen unter „Details anzeigen“. Kernumfang, optionale Erweiterungen und offene Entscheidungen erhalten lesbare Textkennzeichnungen; Farben allein reichen nicht.

Eine kompakte Abschnittsnavigation, mobil zugängliche Menüs, gut erkennbare Fokuszustände und vollständig per Tastatur bedienbare Akkordeons sind erforderlich. Animationen unterstützen die Orientierung und respektieren reduzierte Bewegung. Wesentliche Informationen bleiben ohne Animation lesbar. Ein Export/PDF ist eine optionale spätere Ergänzung, kein notwendiger Bestandteil der ersten Version.

Die Seite enthält keine SEO-Verkaufsinhalte für Anlagenkunden und wird nicht in die öffentliche Sitemap aufgenommen. `noindex` ist eine Indexierungsanweisung, kein Zugriffsschutz. Enthält die Seite vertrauliche Projektinformationen, ist ein echter Zugriffsschutz erforderlich. Interne Planung bleibt von der späteren öffentlichen Website getrennt.

## 3. Vollständiger Anforderungskatalog der Unternehmenswebsite

### A. Positionierung und Startseite

- Innerhalb weniger Sekunden erklären: Was macht Kablitz, für wen, mit welchem Vorteil und wie nimmt man Kontakt auf?
- Kundenführung: Brennstoff/Kundenproblem → Lösung → Technologie → Referenz → Ergebnis → Service → Kontakt.
- Großes authentisches Industrie-Foto oder Video: Anlagen, Kessel, Rost, Gießerei, Fertigung, Montage oder Mitarbeiter.
- Bevorzugte Headline aus dem Brief: „Energie aus dem, was andere als Abfall sehen.“ Alternativen bleiben dokumentiert: „Energie gewinnen. Ressourcen nutzen.“, „Wenn aus Reststoffen Energie wird.“, „Aus Biomasse und Reststoffen. Für Energie und Zukunft.“, „Ressourcen nutzen. Energie erzeugen.“ und „Energie aus Ressourcen. Seit 1901.“
- Kurze technische Einordnung unter der Headline. Hauptaktion „Projekt anfragen“; zweite Aktion „Mit unseren Ingenieuren sprechen“ oder „Unsere Lösungen“. Ein kleiner Kontakt-/Chatbereich ist eine alternative Idee, keine bereits beschlossene Chatbot-Integration.
- Fakten unmittelbar nach dem Einstieg: Erfahrung, gelieferte Systeme, internationale Präsenz, eigene Fertigung und gegebenenfalls Support. Alle Zahlen und Leistungszusagen brauchen Freigabe.
- Lösungskarten: Biomasseenergie, Abfall-zu-Energie, industrielle Prozesswärme, Kraft-Wärme-Kopplung sowie Service und Modernisierung; mit passenden Detailseiten.
- Eigene Fertigung und Gießerei als Kundenvorteil herausstellen: Engineering, Modellbau, Stahlbau, mechanische Bearbeitung, Montage und Qualitätskontrolle.
- Kommunikationsvarianten: „Eigene Gießerei. Eigene Fertigung. Volle Kontrolle.“ und „Vom Engineering bis zum fertigen Rost – aus einer Hand.“ Die englischen Briefvarianten „Built in-house. Built to last.“ und „From engineering to casting – critical components under our own control.“ sind für eine spätere englische Fassung vorgemerkt.
- „Warum Kablitz?“: bestätigte Erfahrung, eigene Gießerei, Engineering und Fertigung aus einer Hand, weltweite Referenzen und Betreuung über den Anlagenlebenszyklus.
- Aktuelle Projekte mit Foto, Kurzbeschreibung, zwei bis vier Fakten und „Zum Projekt“. Monatlicher Wechsel als redaktionelle Option, nicht als verpflichtender automatischer Slider.
- Internationale Präsenz „Von Lauda in die Welt“ mit auswählbaren Projekten, Ländern und Partnern. Zusätzlich eine zugängliche Textliste; Projektstandorte und tatsächliche Niederlassungen eindeutig unterscheiden.
- News, Nachhaltigkeit und Karriere gemäß den Referenzentwürfen integrieren. PV-Anlage, Fertigungserweiterung, neue Mitarbeiter oder neue Projekte nur mit freigegebenen Angaben veröffentlichen.

### B. Navigation und Seiteninhalte

Hauptnavigation: Lösungen, Technologien, Projekte, Unternehmen, Service, Karriere, News & Insights. Zusätzlich Kontakt, Suche und Sprachwechsel DE/EN. Brennstoffe erhalten einen deutlich erreichbaren Einstieg im Lösungsbereich; eine zusätzliche Hauptnavigation ist bei der Menügestaltung abzuwägen.

Die Präsentation nennt alternativ „Was wir tun“ und „Über Kablitz“, Untermenüs/Mega-Menüs oder Sprungmarken. Empfehlung: Sprungmarken für die Demo und echte Detailseiten für die Unternehmenswebsite. Mobile Navigation, Tastatur und Touch werden gleichwertig berücksichtigt.

Die vorhandene Website enthält bereits Wärmetauscher einschließlich Rippenplatten- und Glasröhren-Ausführungen, Feuerungen mit wasser-/luftgekühlten Rosten und Staubfeuerungen, Energiezentralen mit Heißgaserzeugern, Dampfkesseln, Thermalöl- und Heißwasseranlagen sowie Brennstoffbereiche. Diese Inhalte gehen beim Relaunch nicht verloren. Quelle: [bestehende Website](https://www.kablitz.de/).

### C. Brennstoffe als Einstieg

„Was möchten Sie verbrennen?“ führt zu Altholz, RDF/SRF, Waldrestholz, Rinde, feuchter Biomasse, landwirtschaftlichen Reststoffen, Stäuben/Fasern, industriellen Reststoffen und gegebenenfalls Sonderbrennstoffen. Die endgültigen Kategorien bestätigt Kablitz fachlich.

Jede relevante Brennstoffseite behandelt Eigenschaften, Herausforderungen, Auswahlkriterien geeigneter Technologien/Roste, belegbare Referenzen und den nächsten Beratungsschritt. Keine pauschale Eignungszusage ohne Kenntnis der Brennstoffe und Betriebsbedingungen.

### D. Referenzen als Fallstudien

Jede freigegebene Fallstudie erhält: großes Anlagenfoto, Projekttitel, Kurzbeschreibung, drei bis fünf Kernwerte, Ausgangssituation, technische Herausforderung, begründete Lösungswahl, Liefer-/Leistungsumfang, technische Daten, Ergebnisse und Kontakt.

Der Lieferumfang kann Brennstoffzuführung, Feuerung, Rost, Kessel, Entaschung, Rauchgasreinigung, Steuerung, Montage und Inbetriebnahme umfassen. Diagramme müssen zum realen Projekt passen und den eigenen Lieferanteil korrekt abgrenzen. Kennzahlen erhalten Einheiten und nachvollziehbaren Kontext.

Ergebnisse können Brennstoffflexibilität, stabilen Betrieb, Energiegewinnung, Verfügbarkeit, Effizienz, Emissionen oder Modernisierungserfolge betreffen. Es werden nur belegbare Resultate verwendet. Kundenprobleme werden bei Bedarf anonymisiert; die tatsächliche Freigabe und Vertraulichkeit bleiben maßgeblich.

Bildbedarf: Gesamtanlage, Feuerung/Rost, Kessel, Brennstoff, Fertigung/Montage, gegebenenfalls Mitarbeiter sowie freigegebene Prozessgrafik. Goch und das Sägewerk-Beispiel aus dem Brief dienen als Inhaltsvorlagen, bis Daten und Veröffentlichungsrechte bestätigt sind.

### E. Service und Ersatzteile

Eigener Vertriebsbereich „Ihre Anlage am Laufen halten“ mit Originalersatzteilen, Roststäben/Gussteilen, Inspektion, Wartung, Modernisierung und Leistungsoptimierung. Teile für Fremdanlagen und 24/7-Support erscheinen nur im tatsächlich angebotenen Umfang.

Ersatzteilanfrage: Bauteil, Anlagentyp, Hersteller, Baujahr soweit bekannt, Zeichnungs-/Teilenummer, Menge, Beschreibung, optionale Fotos/Zeichnungen und notwendige Kontaktdaten. Pflichtfelder auf das für eine Bearbeitung erforderliche Maß beschränken. Anfragebestätigung und interne Zuständigkeit vorsehen; das Formular ersetzt keinen verbindlichen Preis oder technischen Eignungsnachweis.

### F. Redaktion, Medien und Interaktion

Nachrichtenkategorien: Unternehmen, Projekte, Technologie, Service/Ersatzteile, Nachhaltigkeit, Karriere sowie Messen. Inhalte sollen ohne Programmierung pflegbar sein.

Authentische Kablitz-Fotos und -Videos haben Vorrang; gegebenenfalls Fotoshooting. Generierte Konzeptbilder sind kein Nachweis realer Anlagen oder Mitarbeiter. Bildrechte, Einwilligungen und Kundenfreigaben dokumentieren.

Wünsche zu Feuer im Hero, dauerhaftem Feuer am Bildrand, Gießübergängen, Scrollbewegungen und animierten Kennzahlen bleiben erfasst. Empfehlung: gezielte, dezente Bewegung statt Feuer bei jedem Seitenwechsel. Bewegte Inhalte brauchen passende Pausenmöglichkeiten und eine ruhige Darstellung bei reduzierter Bewegung. Keine Scrollsperren, keine verzögerte Lesbarkeit und kein Autoplay-Ton.

## 4. SEO-/AEO-Plan für die öffentliche Unternehmenswebsite

Dieser Abschnitt beschreibt den späteren Unternehmensauftritt. Die Projektpräsentation selbst wird nicht für Suchmaschinen vermarktet.

### Grundprinzip und Themenauswahl

Für jede eigenständige Leistung und jedes ausreichend eigenständige Kundenproblem entsteht eine hilfreiche Seite. Eng verwandte Fragen werden innerhalb derselben Seite beantwortet. Eine neue URL setzt voraus: eigene Suchabsicht, fachlichen Mehrwert, geeignete Belege und einen klaren nächsten Schritt. Keine automatisch erzeugten Fragevarianten, Stadtseiten oder künstlichen Wortzahlvorgaben.

Die folgende Themenliste ist ein redaktioneller Vorschlag, keine abgeschlossene Keyword-Recherche. Prioritäten werden mit tatsächlichen Kundenfragen, Vertriebswissen, vorhandenen Suchdaten und geschäftlichem Wert überprüft. Google beschreibt ähnliche Einstiegsseiten und massenhaft für Rankings erzeugte Inhalte als mögliche Spam-Muster: [Spamrichtlinien](https://developers.google.com/search/docs/essentials/spam-policies).

### Vorgeschlagene Seitenstruktur und Priorität

| Priorität | Seitengruppe / Beispielpfad | Anliegen | Nächster Schritt |
| --- | --- | --- | --- |
| P1 | `/loesungen/biomasseenergie/` | Biomasse energetisch nutzen | Projekt anfragen |
| P1 | `/loesungen/abfall-zu-energie/` | Reststoffe und anspruchsvolle Brennstoffe verwerten | Brennstoff besprechen |
| P1 | `/loesungen/prozesswaerme/` | Prozesswärme für einen industriellen Betrieb | Wärmebedarf besprechen |
| P1 | `/loesungen/kraft-waerme-kopplung/` | Strom und nutzbare Wärme kombinieren | Einsatzfall prüfen lassen |
| P1 | `/technologien/feuerungssysteme/` | Passende Feuerung verstehen | Technologie und Referenz vergleichen |
| P1 | `/technologien/wassergekuehlte-roste/` und `/technologien/luftgekuehlte-roste/` | Rosttechnik für konkrete Bedingungen auswählen | Fachberatung |
| P1 | `/technologien/dampfkessel/` und `/technologien/waermetauscher/` | Dampfversorgung oder Wärmerückgewinnung | Technische Anfrage |
| P1 | `/service/ersatzteile/` | Ersatzteil identifizieren und anfragen | Ersatzteilformular |
| P1 | `/service/roststaebe-gussteile/` | Originalteile und mögliche Fremdanwendungen | Zeichnung/Teilenummer übermitteln |
| P1 | `/service/wartung/`, `/service/modernisierung/`, `/service/leistungsoptimierung/` | Verfügbarkeit oder Anlagenleistung verbessern | Serviceanfrage |
| P1 | `/unternehmen/fertigung/` und `/unternehmen/giesserei/` | Fertigungstiefe und Qualität beurteilen | Leistungen/Referenzen ansehen |
| P1 | `/projekte/` und `/projekte/[projekt]/` | Vergleichbare Umsetzung beurteilen | Ähnliches Projekt besprechen |
| P1 | `/kontakt/` | Zuständigen Ansprechpartner erreichen | Anfrage senden |
| P2 | `/brennstoffe/[brennstoff]/` | Anforderungen eines konkreten Brennstoffs verstehen | Geeignete Technik und Referenzen |
| P2 | Weitere reale Technologie-Unterseiten | Staubfeuerung, Heißgas, Thermalöl, Heißwasser, Wärmetauscher-Ausführungen | Fachanfrage |
| P2 | `/wissen/[frage-oder-thema]/` | Fachfrage beantworten und Entscheidung vorbereiten | Verwandte Leistung |
| P2 | `/news/[beitrag]/` | Aktuelle Entwicklung oder Projektfortschritt | Verwandte Fachseite |
| P2 | `/karriere/` und Stellenangebote | Aufgaben und Arbeitgeber kennenlernen | Bewerbung |

P1/P2 steuern die Bearbeitungsreihenfolge. Eine bereits wichtige bestehende URL darf nicht allein wegen dieser Einteilung entfallen. Die endgültige URL-Struktur folgt erst nach der Bestandsaufnahme und Redirect-Zuordnung.

### Fragenkatalog für Wissen und AEO

1. Welche Angaben benötigt Kablitz für die Planung einer Biomasseanlage?
2. Wie beeinflusst die Brennstofffeuchte die Auswahl der Feuerung?
3. Worin unterscheiden sich wassergekühlte und luftgekühlte Roste?
4. Welche Herausforderungen entstehen bei Rinde und feuchten Holzreststoffen?
5. Welche Anforderungen stellen RDF und SRF an die Feuerung?
6. Wann eignet sich Kraft-Wärme-Kopplung für einen Industriebetrieb?
7. Welche Faktoren bestimmen die Wirtschaftlichkeit einer Biomasseanlage?
8. Wie lässt sich eine bestehende Anlage auf andere Brennstoffe anpassen?
9. Welche Informationen werden für eine Ersatzteilanfrage benötigt?
10. Sind Ersatzteile für Anlagen anderer Hersteller verfügbar?
11. Wie werden Inspektion und Wartung einer Anlage geplant?
12. Welche Vorteile bietet eine eigene Gießerei bei Ersatzteilen und Komponenten?

Jede Frage wird zunächst einer vorhandenen Leistungs-/Brennstoffseite zugeordnet. Nur ausreichend umfangreiche, eigenständige Themen erhalten eine Wissensseite. Aussagen zu Wirtschaftlichkeit, Grenzwerten oder Eignung benötigen konkrete Annahmen und fachliche Prüfung.

### Inhaltsschablone pro öffentlicher Seite

- Eindeutiger Titel, verständliche H1 und direkte Antwort beziehungsweise kurze Leistungsbeschreibung am Anfang.
- Anwendungsfall, Voraussetzungen, technische Auswahlkriterien und Grenzen erläutern.
- Eigene Erfahrung durch freigegebene Referenzen, Bilder und nachvollziehbare Daten belegen.
- Fachlich verantwortliche Redaktion, tatsächlichen Prüfstand und relevante Quellen kenntlich machen.
- Passende Kundenfragen präzise beantworten; Definitionen und Einheiten erklären.
- Sinnvolle Links zu Technologie, Brennstoff, Referenz und Service setzen; keine verwaisten Seiten.
- Einen zum Anliegen passenden Kontaktweg anbieten.

Beispiel für eine geplante Wissensseite: H1 „Welche Angaben benötigen wir für Ihre Biomasseanlage?“; Abschnitte zu Brennstoff, Wärme-/Dampfbedarf, Betriebsstunden, Standort und vorhandener Technik; abschließend eine strukturierte Projektanfrage. Die konkrete technische Antwort erstellt oder prüft Kablitz.

### Technische und redaktionelle Voraussetzungen

Öffentliche Inhalte erhalten stabile URLs, individuelle Seitentitel und Beschreibungen, korrekte Canonicals, logische Überschriften, beschreibende interne Links und eine Sitemap ausschließlich mit freigegebenen kanonischen URLs. Hauptinhalte werden serverseitig beziehungsweise statisch als HTML bereitgestellt. Medien bekommen passende Maße, Alternativtexte und effiziente Formate. Technisches Projektziel: gute Core Web Vitals; Messung vor Launch im Labor, nach Launch mit verfügbaren Felddaten.

Strukturierte Daten passend zum Inhalt: Organization, BreadcrumbList sowie Article/BlogPosting; JobPosting nur für echte aktuelle Stellen. Service/Product nur bei semantisch passenden Inhalten, ohne erfundene Preise oder Bewertungen. Sichtbare Inhalte und Markup müssen übereinstimmen.

AEO bedeutet hier, fachlich belastbare Antworten leicht auffindbar und verständlich bereitzustellen. Eine Aufnahme in KI-Antworten ist nicht garantierbar. Google verlangt dafür keine spezielle AEO-Datei und kein besonderes Schema. `llms.txt` ist kein zugesicherter Rankinghebel. Quelle: [Google-Leitfaden zu generativen Suchfunktionen](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).

FAQ-Inhalte bleiben für Leser sinnvoll. Google zeigt nach seiner aktuellen Dokumentation seit 7. Mai 2026 keine FAQ-Rich-Results mehr; dieser Effekt darf nicht als Leistung verkauft werden. Quelle: [Google-Dokumentationsänderungen](https://developers.google.com/search/updates).

### Migration, Sprachen und Erfolgsmessung

Vor Veröffentlichung: bestehende URLs, Inhalte, Downloads, Sprachversionen und verfügbare Suchleistungsdaten inventarisieren. Für ersetzte URLs relevante dauerhafte Weiterleitungen festlegen. Die bestehende Website bietet neben Deutsch und Englisch weitere Sprachen; deren Erhalt oder Ablösung ist eine offene geschäftliche Entscheidung. Keine pauschale Weiterleitung aller alten Seiten auf die Startseite.

DE/EN erhalten vollständig gepflegte Sprachfassungen und wechselseitige Sprachverweise. Keine leeren englischen Seiten. Der aktuelle Demo-Indexierungsschutz wird nur für die freigegebene öffentliche Produktion passend geändert; Admin, Entwürfe und Projektpräsentation bleiben ausgeschlossen beziehungsweise geschützt.

Erfolg messen an qualifizierten Projekt-/Serviceanfragen, Anfragequalität, Bearbeitungszeit und später zugeordnetem Geschäft. Ergänzend: organische Klicks/Impressionen, relevante Themenabdeckung und Anfragekonversion. KI-Nennungen können ergänzend mit einem festen Fragenkatalog beobachtet werden; Ergebnisse schwanken und sind keine vollständige Attribution. Ausgangswerte erst erheben, danach Zielwerte gemeinsam festlegen.

## 5. Admin-Bereich und CMS mit Google-Anmeldung

### Gewünschter Funktionsumfang

Die Redaktion meldet sich über Google an und kann Nachrichten erstellen, Bilder verwalten, Inhalte bearbeiten, Referenzen pflegen und Veröffentlichungen vorbereiten. Google-Anmeldung bestätigt die Identität; sie erteilt nicht automatisch Bearbeitungsrechte. Nur ausdrücklich freigeschaltete Benutzer erhalten Zugriff. Rollen und Rechte werden serverseitig bei jedem geschützten Zugriff geprüft.

Empfohlene Rollen: Administrator für Benutzer und Einstellungen; Redaktion für Entwürfe; Freigabeverantwortliche für Veröffentlichung. Eine Person kann mehrere Aufgaben übernehmen. Benutzerentzug, Sitzungsende und Änderungsprotokoll gehören zum Betrieb.

### Inhalte und Felder

| Inhaltstyp | Wesentliche Felder |
| --- | --- |
| Nachricht | Titel, URL, Zusammenfassung, Text, Kategorie, Titelbild, Alternativtext, Autor, Datum, Sprache, Status und SEO-Felder |
| Referenzprojekt | Herausforderung, Lösung, Technologie, Lieferumfang, Ergebnisse, Kennzahlen mit Einheiten, Land, Bilder, Freigabe/Anonymisierung |
| Leistungs-/Technologieseite | Kurzantwort, Beschreibung, Einsatzfälle, Voraussetzungen, Fachfragen, Referenzen, Kontaktaktion |
| Brennstoff-/Wissensseite | Fragestellung, fachliche Antwort, technische Grenzen, Quellen/Prüfung und verknüpfte Inhalte |
| Medien | Datei, Beschreibung, Alternativtext, Rechte-/Freigabevermerk und Bildnachweis |
| Internationales Projekt | Referenzverknüpfung, Land, freigegebene Position; keine automatische Darstellung als Niederlassung |
| Startseiteninhalte | Ausgewählte Referenzen, Nachrichten, freigegebene Kennzahlen und Kontaktinformationen |

Redaktionsablauf: Entwurf → fachliche Prüfung → Vorschau → Freigabe → Veröffentlichung. Hinzu kommen Versionierung/Wiederherstellung, Archivierung, geplante Veröffentlichung und Überprüfung auf fehlende Pflichtinformationen. Automatische Suchmaschinen- und Sitemap-Aktualisierung nur für veröffentlichte Inhalte.

### Technische Empfehlung und Betrieb

Ein etabliertes CMS mit geeigneter Google-/OIDC-Anmeldung prüfen, bevor ein eigener Editor entwickelt wird. Die konkrete Auswahl erfolgt anhand von Bedienbarkeit, Rollen, Sprachverwaltung, Hosting/Datenschutz, Exportmöglichkeiten und laufenden Kosten. Die bestehende Next.js-Demo ist eine mögliche Präsentationsbasis; die CMS-Auswahl ist noch offen.

Google-OAuth ausschließlich im Admin-Kontext laden und minimale Identitätsdaten verwenden. Keine Gmail-/Drive-Berechtigungen für eine reine Anmeldung anfordern. Kontowhitelist, sichere serverseitige Sitzung, Schutz vor unberechtigten Veröffentlichungen, Protokollierung sowie wiederherstellbare Backups vorsehen. Unternehmenszugänge, Daten und Exporte müssen an Kablitz übergebbar sein.

## 6. Datenschutz, rechtliche Prüfung und Qualität

Die Umsetzung berücksichtigt den tatsächlichen Datenfluss. Vor der öffentlichen Veröffentlichung prüfen die zuständigen Verantwortlichen beziehungsweise qualifizierte Rechtsberatung die zutreffenden Pflichten und Texte. Eine technische Checkliste ersetzt keine abschließende rechtliche Prüfung.

- Impressum mit bestätigten Unternehmens-, Vertretungs-, Register- und Kontaktdaten gemäß den anwendbaren Informationspflichten; dauerhaft leicht erreichbar. [§ 5 DDG](https://www.gesetze-im-internet.de/ddg/__5.html).
- Datenschutzhinweise passend zu Hosting, Formularen, Uploads, CMS, Admin-Anmeldung und eingesetzten Dienstleistern. Zweck, Rechtsgrundlage, Empfänger, Aufbewahrung und Betroffenenrechte klären; erforderliche Auftragsverarbeitungsverträge und mögliche Drittlandübermittlungen prüfen.
- Datenschutzfreundlicher Ausgangspunkt: lokal bereitgestellte Fonts/Medien, eigene Projektkarte ohne unnötige Fremdeinbindung und externe Links statt automatisch ladender Social-/Video-Widgets.
- Nicht erforderliche Speicherung/Zugriffe auf Endgeräte erst nach wirksamer Einwilligung. Ein Banner ist nicht allein deshalb nötig, weil eine Website existiert; maßgeblich sind die eingesetzten Funktionen. Falls erforderlich: verständliches Ablehnen, getrennte Zwecke und leicht erreichbarer Widerruf. [§ 25 TDDDG](https://www.gesetze-im-internet.de/ttdsg/__25.html).
- Formulare sparsam gestalten; Transport absichern, Spam abwehren, private Uploads mit Typ-/Größenprüfung und kontrolliertem Zugriff verarbeiten. Löschfristen und Zuständigkeiten festlegen. Marketing-Einwilligung von einer Sachanfrage trennen.
- BFSG-Anwendbarkeit anhand des tatsächlichen Angebots und der Zielgruppe prüfen. Eine B2B-Unternehmensseite fällt nicht allein durch ihre Existenz pauschal unter alle BFSG-Pflichten. Barrierearme Bedienung bleibt ein Qualitätsziel. [§ 1 BFSG](https://www.gesetze-im-internet.de/bfsg/__1.html).
- Bildrechte, Mitarbeiter-/Kundenfreigaben, Projektdaten und Umwelt-/Leistungsbehauptungen vor Veröffentlichung prüfen. Rechtliche Bestandsinhalte einschließlich des vorhandenen Hinweisgeberlinks in der Migrationsinventur berücksichtigen.

## 7. Unsere zusätzlichen Vorschläge für das Geschäft

Diese Erweiterungen ergänzen die Kundenanforderungen. Sie sind separat zu bewerten und zu beauftragen. Die Angaben zum Aufwand sind relative Einschätzungen, keine Preis- oder Terminzusagen.

| Vorschlag | Möglicher Nutzen | Aufwand / Abhängigkeit | Erfolgskriterium |
| --- | --- | --- | --- |
| Strukturierte Projektanfrage mit interner Zuordnung | Weniger Rückfragen; schneller beim richtigen Ansprechpartner | Mittel; Vertrieb definiert notwendige Angaben und Zuständigkeiten | Zeit bis qualifizierter Erstreaktion, Vollständigkeit |
| Ersatzteilanfrage mit Foto/Zeichnung und Vorgangsnummer | Schnellere Identifikation, besser nutzbare Servicekontakte | Mittel; sicherer Upload und Bearbeitungsprozess | Rückfragen je Anfrage, Zeit bis Angebot |
| Zentrales Anfrageboard mit Erinnerungen | Weniger liegen gebliebene Anfragen | Mittel; zuerst vorhandenes CRM prüfen | Anteil fristgerecht bearbeiteter Anfragen |
| CRM-Anbindung | Weniger doppelte Dateneingabe, nachvollziehbare Vertriebsquelle | Mittel bis hoch; abhängig von bestehendem CRM/API | Bearbeitungsaufwand und qualifizierte Verkaufschancen |
| Wartungs- und Ersatzteilerinnerungen | Wiederkehrendes Servicegeschäft unterstützen | Mittel; verlässliche Anlagendaten und zulässige Kontaktbasis | Serviceaufträge und termingerechte Wartung |
| Interne Wissenssuche für Vertrieb und Service | Freigegebene Unterlagen schneller finden | Mittel bis hoch; Qualität und Zugriffsrechte der Dokumente | Suchzeit und Nutzungsquote |
| Kundenportal für Unterlagen und Vorgangsstatus | Weniger Statusnachfragen und bessere Zusammenarbeit | Hoch; Rollen, kundenspezifische Rechte und Systemanbindung | Statusanfragen, Nutzung und Bearbeitungszeit |
| Redaktionsassistenz für Nachrichten und Übersetzungen | Schnellere Erstellung erster Entwürfe | Mittel; immer fachliche und sprachliche Freigabe | Zeit von Entwurf bis Veröffentlichung |
| Anfrageassistent auf der Website | Besucher zur passenden Leistung führen | Mittel bis hoch; gepflegte Inhalte und Übergabe an Menschen | Qualifizierte Kontakte, Abbruchquote, Fehlantworten |
| Beschaffungs-/Lagerintegration | Bestände und Teileverfügbarkeit im Service besser nutzen | Hoch; ERP, Artikelstamm und reale Prozesse zuerst prüfen | Such-/Erfassungszeit und Bestandsqualität |

Empfohlener Start: gute Anfrageformulare, klare Zuständigkeiten und ein mit vorhandenen Werkzeugen abgestimmtes Anfrageboard. Ein umfangreiches Kundenportal, öffentliche KI-Beratung oder eine neue Lagerlösung folgen erst bei nachgewiesenem Bedarf. Die bestehende Lagerdemo ist eine Gesprächsgrundlage für diese Prüfung.

Wirtschaftlichkeit wird mit Kablitz berechnet: tatsächlich eingesparte Arbeitszeit und zusätzlicher Deckungsbeitrag abzüglich Betriebs-, Integrations- und Pflegekosten. Es werden keine Umsatzsteigerungen oder Einsparbeträge ohne Ausgangsdaten versprochen.

## 8. Umsetzung in nachvollziehbaren Phasen

Die vereinbarte Arbeitsreihenfolge bleibt: Demo-Landing aufwerten → Projektseite präsentieren → Unternehmenswebsite und vereinbarte Erweiterungen umsetzen. Auf der Projektseite selbst wird das bereits sichtbare Demo nicht als offener Lieferumfang dargestellt.

| Phase des Unternehmensprojekts | Ergebnis | Voraussetzung / Abnahme |
| --- | --- | --- |
| 1. Inhalte und Umfang | Seiteninventar, priorisierte Kundenfragen, bestätigter Kernumfang und optionale Erweiterungen | Präsentation und Brief vollständig zugeordnet; offene Daten benannt |
| 2. Struktur und Vorlagen | Navigation sowie Vorlagen für Leistung, Brennstoff, Referenz, Wissen und Nachricht | Verständliche Kundenwege und Beispielinhalte geprüft |
| 3. CMS und Redaktion | Google-Anmeldung, Rechte, Inhalte, Medien und Freigabeablauf | Berechtigte Redaktion kann einen Beitrag sicher veröffentlichen |
| 4. Inhalte und Anfragen | Fachlich freigegebene Seiten, Referenzen, Kontakt- und Ersatzteilanfragen | Sprache, Aussagen, Bilder und interner Empfang geprüft |
| 5. Veröffentlichung | Migration, Weiterleitungen, Indexierungsregeln, rechtliche Texte, Qualitätsprüfung und Betriebsübergabe | Freigabe durch zuständige Personen und getestete Kernabläufe |
| 6. Weiterentwicklung | Messung, Ausbau wertvoller Themen und ausgewählte Automatisierungen | Priorisierung nach echten Anfragen, Daten und Nutzen |

## 9. Abnahmekriterien für die Seite „Projekt“

1. Alle sichtbaren Texte sind auf Deutsch und für die Geschäftsführung verständlich.
2. Kundenanforderungen, optionale Varianten und eigene Empfehlungen sind erkennbar getrennt.
3. Alle Themen aus Abschnitt 3 sind auf der Seite oder in ihren zugänglichen Detailbereichen wiederzufinden.
4. Die SEO-/AEO-Erklärung betrifft ausdrücklich die künftige öffentliche Website.
5. CMS, Google-Anmeldung und eigenständiges Erstellen von Nachrichten werden konkret erläutert.
6. Zusatzvorschläge erklären Nutzen, Voraussetzungen und Erfolgsmessung ohne unbelegte Versprechen.
7. Der Demo-Link funktioniert; die Projektseite verwechselt `/projekt` nicht mit Kundenreferenzen.
8. Desktop und Mobilansicht sind lesbar, Navigation/Akkordeons funktionieren mit Tastatur und reduzierter Bewegung.
9. Planung erscheint nicht als bereits umgesetzt; keine fiktiven Termine, Budgets oder Abnahmen.
10. Projektinterna werden nicht versehentlich indexiert; erforderlicher Zugriffsschutz wird vor Bereitstellung entschieden.

## 10. Offene Angaben und Nachweise

Kablitz bestätigt Ansprechpartner, Unternehmens-/Registerangaben, Rechtsprüfung, Bildrechte, echte Referenzen und technische Leistungsgrenzen. Abzugleichen sind insbesondere die widersprüchlichen Mitarbeiterzahlen 70+/80+/90+, 120+/125 Jahre, 6.000+ Systeme, 24/7-Support, Länder-/Projektzahlen sowie Goch-Kennzahlen wie 28 MW, 5–7,2 MW und 100.000 t/Jahr. Beispielnachrichten, Umweltbehauptungen und Fremdanlagen-Kompatibilität brauchen ebenfalls Bestätigung.

Weitere Entscheidungen: betreuende Redaktion und Google-Konten, bestehendes CRM/ERP, Hosting/CMS-Budget, gewünschte öffentliche Sprachen, Upload-/Bewerbungsprozess, tatsächlicher Analysebedarf und Kontaktbearbeitung. Diese offenen Punkte verhindern nicht die Erstellung der Projektpräsentation; sie begrenzen spätere Produktionszusagen.

## 11. Quellen und Nachverfolgbarkeit

- Nutzerangaben dieser Unterhaltung: Priorität deutscher Rechtsanforderungen; später Demo vor Projektseite; Projektseite als Übersicht für den Geschäftsführer; CMS mit Google-Anmeldung und Nachrichteneditor; SEO/AEO für öffentliche Leistungs- und Frageseiten; zusätzliche Vorschläge für Zeitersparnis und Umsatz. Kommunikation im Chat auf Serbisch, Projektinhalte auf Deutsch.
- `C:/Users/PC/Desktop/Kablitz Webseite.pptx`: Folien 2–5 Positionierung/Startseite/Navigation/Bewegung; 6–9 Projekte/Fallstudien; 10 Fertigung; 11 Weltkarte; 12 Nachrichten; 13 Service/Ersatzteile. Folie 8 enthält keinen extrahierten Text; bildliche Vorlagen werden als Gestaltungsvorlagen behandelt.
- [Geteiltes GPT-Gespräch](https://chatgpt.com/share/6ab25f83-c65c-83eb-9840-c1a6083f2a46): gelesene Projektspezifikation mit 28 Abschnitten; ergänzt insbesondere Brennstoffe, Detailseiten, Ersatzteilformular, CMS/DE-EN, Suche, SEO und Belegpflichten.
- Gelieferte Designreferenzen: `ChatGPT Image Sep 15, 2026, 11_15_41 AM.png`, `89ff1a11-5848-451e-a980-2e8a51ccd21c.png`, `web seite bsp.png` und Clipboard-Kopie. Sie zeigen alternative Navigationen und Layouts; Zahlen und abgebildete Anlagen sind dadurch nicht verifiziert.
- [Bestehender Unternehmensauftritt](https://www.kablitz.de/): Startseite und verlinkte Navigationsstruktur am 22.09.2026 gelesen. Dies ist keine vollständige Inhalts-, Rechts- oder technische Prüfung aller Unterseiten.
- [Demo](https://kablitz.vercel.app/): Zieladresse vom Auftraggeber. Der Web-Abruf war in dieser Planung nicht erfolgreich; keine Live-Funktionsprüfung behauptet. Der lokale Repository-Stand weist Landingpage und Admin-Konzept aus.
- Offizielle SEO- und Rechtsquellen sind in den betreffenden Abschnitten verlinkt. Vor Produktionsstart und Veröffentlichung erneut auf Aktualität prüfen.
