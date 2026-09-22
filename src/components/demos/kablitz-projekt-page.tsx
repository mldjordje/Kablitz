import Image from "next/image";
import Link from "next/link";
import {
  AEO_QUESTIONS, AEO_STEPS, CMS, GOALS, LEGAL, PAGE_GROUPS, PHASES, PREPARE, PROPOSALS_LATER, PROPOSALS_NOW, REQUIREMENTS,
  type Item,
} from "./kablitz-projekt-data";
import "./kablitz-projekt.css";

const TOC = [
  { id: "ziel", label: "Ziel der neuen Website" },
  { id: "anforderungen", label: "Ihre Anforderungen" },
  { id: "seiten", label: "Aufbau der Seiten" },
  { id: "redaktion", label: "Redaktion mit Google-Anmeldung" },
  { id: "recht", label: "Datenschutz und Recht" },
  { id: "empfehlungen", label: "Empfohlene Erweiterungen" },
  { id: "spaeter", label: "Für später" },
  { id: "ablauf", label: "Ablauf" },
  { id: "vorbereitung", label: "Was wir von Ihnen brauchen" },
];

function Label({ kind }: { kind: "wunsch" | "empfehlung" | "spaeter" }) {
  const text = { wunsch: "Ihr Wunsch", empfehlung: "Unsere Empfehlung", spaeter: "Später" }[kind];
  return <span className={`kd-label kd-label-${kind}`}>{text}</span>;
}

function Items({ items }: { items: Item[] }) {
  return (
    <dl className="kd-items">
      {items.map((item) => (
        <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>
      ))}
    </dl>
  );
}

export function KablitzProjektPage() {
  return (
    <div className="kd">
      <header className="kd-top">
        <Link href="/"><Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Demo-Startseite" width={110} height={34} unoptimized /></Link>
        <Link href="/" className="kd-top-link">Zur Demo-Website →</Link>
      </header>

      <div className="kd-layout">
        <nav className="kd-toc" aria-label="Inhalt">
          <p>Inhalt</p>
          <ol>{TOC.map((t, i) => <li key={t.id}><a href={`#${t.id}`}><span>{i + 1}</span>{t.label}</a></li>)}</ol>
        </nav>

        <main className="kd-doc">
          <p className="kd-meta">Projektübersicht · Stand September 2026</p>
          <h1>Die neue Website für Kablitz</h1>
          <p className="kd-lead">Dieses Dokument beschreibt, was die neue Website enthalten wird, was jede Funktion tut und welche Erweiterungen wir zusätzlich empfehlen. Die überarbeitete Startseite können Sie bereits auf der <Link href="/">Demo-Website</Link> ansehen.</p>

          <aside className="kd-legend" aria-label="Kennzeichnungen">
            <p><Label kind="wunsch" /> stammt aus Ihrer Präsentation und dem Briefing.</p>
            <p><Label kind="empfehlung" /> schlagen wir zusätzlich vor; Sie entscheiden separat.</p>
            <p><Label kind="spaeter" /> erfordert eine Anbindung an Ihre Systeme und folgt in einer späteren Phase.</p>
          </aside>

          <section id="ziel">
            <h2><span>1</span>Ziel der neuen Website</h2>
            <p>Die Website soll Kablitz als erfahrenen Hersteller für Energie aus Biomasse und Reststoffen zeigen, mehr passende Anfragen bringen und die tägliche Arbeit Ihres Teams erleichtern.</p>
            <Items items={GOALS} />
          </section>

          <section id="anforderungen">
            <h2><span>2</span>Ihre Anforderungen <Label kind="wunsch" /></h2>
            <p>Alle Punkte aus Ihrer Präsentation „Kablitz Webseite“ und dem Briefing, jeweils mit einer kurzen Erklärung, was sie auf der Website bewirken.</p>
            {REQUIREMENTS.map((group, i) => (
              <div key={group.id} className="kd-group">
                <h3>2.{i + 1} {group.title}</h3>
                <p>{group.intro}</p>
                <Items items={group.items} />
              </div>
            ))}
          </section>

          <section id="seiten">
            <h2><span>3</span>Aufbau der Seiten <Label kind="wunsch" /></h2>
            <p>Jede Leistung, jeder Brennstoff und jede wichtige Kundenfrage erhält eine eigene Seite. So landet jeder Besucher – ob über Google, über eine KI-Suche oder über das Menü – direkt auf der Seite, die sein Anliegen beantwortet. Jede Seite endet mit einem passenden Kontaktweg.</p>
            <Items items={PAGE_GROUPS} />
            <p className="kd-note">Die genauen Seitenadressen legen wir nach der Bestandsaufnahme der heutigen Website fest. Bestehende Adressen werden weitergeleitet, damit keine Google-Platzierung verloren geht.</p>
          </section>

          <section id="redaktion">
            <h2><span>4</span>Redaktion mit Google-Anmeldung <Label kind="wunsch" /></h2>
            <p>Ihr Team pflegt die Website selbst, ohne Programmierkenntnisse. Der News-Editor ist in der <Link href="/admin">Admin-Vorschau</Link> bereits ausprobierbar.</p>
            <Items items={CMS} />
          </section>

          <section id="recht">
            <h2><span>5</span>Datenschutz und Recht</h2>
            <p>Deutsche Vorgaben werden bei jeder Funktion von Anfang an berücksichtigt, um Abmahnungen zu vermeiden. Die abschließende Prüfung der Rechtstexte erfolgt durch Ihre Verantwortlichen oder eine Rechtsberatung.</p>
            <Items items={LEGAL} />
          </section>

          <section id="empfehlungen">
            <h2><span>6</span>Empfohlene Erweiterungen <Label kind="empfehlung" /></h2>
            <p>Diese Erweiterungen sparen Zeit und bringen zusätzliche Anfragen. Sie funktionieren ohne Anbindung an Ihre internen Systeme und können mit der neuen Website starten.</p>

            <div className="kd-feature">
              <p className="kd-feature-kicker">Wichtigste Empfehlung</p>
              <h3>KI-Sichtbarkeit (AEO): Kablitz wird in ChatGPT & Co. genannt</h3>
              <p>Immer mehr Einkäufer und Ingenieure suchen nicht mehr bei Google, sondern fragen ChatGPT, Gemini oder Perplexity. Diese Systeme geben eine fertige Antwort und nennen darin wenige Hersteller – oft mit Link. Wer dort nicht genannt wird, kommt in die engere Auswahl gar nicht erst hinein.</p>
              <p><strong>AEO (Answer Engine Optimization)</strong> ist die Weiterentwicklung der klassischen Suchmaschinenoptimierung: Die Website wird so aufgebaut, dass KI-Systeme Kablitz als passende, glaubwürdige Antwort erkennen und nennen. Gleichzeitig verbessert sie die Platzierung bei Google.</p>

              <h4>Das Ziel</h4>
              <p>Wenn ein potenzieller Kunde eine KI fragt:</p>
              <ul className="kd-questions">{AEO_QUESTIONS.map((q) => <li key={q}>„{q}“</li>)}</ul>
              <p>… dann erscheint Kablitz in der Antwort – mit Namen, passender Leistung und Link zur Website.</p>

              <h4>So erreichen wir das</h4>
              <Items items={AEO_STEPS} />

              <p className="kd-note">KI-Antworten kann niemand direkt steuern, und sie schwanken von Frage zu Frage. Wir schaffen die Voraussetzungen, unter denen Kablitz genannt wird, und machen den Fortschritt mit der monatlichen Messung sichtbar.</p>
            </div>

            <h3 className="kd-sub">Weitere Empfehlungen</h3>
            <div className="kd-proposals">
              {PROPOSALS_NOW.map((p) => (
                <article key={p.title}>
                  <h4>{p.title}</h4>
                  <p><strong>Was es tut:</strong> {p.does}</p>
                  <p><strong>Ihr Nutzen:</strong> {p.benefit}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="spaeter">
            <h2><span>7</span>Für später <Label kind="spaeter" /></h2>
            <p>Diese Ideen bringen zusätzlichen Nutzen, erfordern aber eine Anbindung an Ihre bestehenden Systeme oder einen größeren Aufwand. Wir empfehlen, sie nach dem Start der neuen Website und nach einer gemeinsamen Prüfung anzugehen.</p>
            <div className="kd-proposals kd-proposals-later">
              {PROPOSALS_LATER.map((p) => (
                <article key={p.title}>
                  <h4>{p.title}</h4>
                  <p><strong>Was es tut:</strong> {p.does}</p>
                  <p><strong>Voraussetzung:</strong> {p.benefit}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="ablauf">
            <h2><span>8</span>Ablauf</h2>
            <p>Die Umsetzung erfolgt in sechs Schritten. Jeder Schritt endet mit einer gemeinsamen Abstimmung.</p>
            <ol className="kd-phases">{PHASES.map((p) => <li key={p.title}><strong>{p.title}</strong><span>{p.text}</span></li>)}</ol>
          </section>

          <section id="vorbereitung">
            <h2><span>9</span>Was wir von Ihnen brauchen</h2>
            <ul className="kd-checklist">{PREPARE.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>

          <footer className="kd-end">
            <p>Fragen zu diesem Dokument besprechen wir gern persönlich.</p>
            <div><Link href="/">Demo-Website ansehen</Link><Link href="/admin">Admin-Vorschau öffnen</Link></div>
          </footer>
        </main>
      </div>
    </div>
  );
}
