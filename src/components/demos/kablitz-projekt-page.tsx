import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { KablitzMotion } from "./kablitz-motion";
import {
  CMS_FEATURES, GOALS, LEGAL, PAGES, PHASES, PREPARE, PROPOSALS, QUESTIONS, REQUIREMENTS, SEO_PRINCIPLES,
} from "./kablitz-projekt-data";
import "./kablitz-projekt.css";

const SECTIONS = [
  { id: "ziel", label: "Zielbild" },
  { id: "anforderungen", label: "Ihre Anforderungen" },
  { id: "struktur", label: "Seiten & SEO/AEO" },
  { id: "redaktion", label: "Redaktion & CMS" },
  { id: "recht", label: "Recht & Qualität" },
  { id: "vorschlaege", label: "Unsere Vorschläge" },
  { id: "ablauf", label: "Vorgehen" },
];

function Tag({ kind }: { kind: "wunsch" | "vorschlag" | "offen" }) {
  const text = { wunsch: "Kundenwunsch", vorschlag: "Unser Vorschlag · optional", offen: "Offene Entscheidung" }[kind];
  return <span className={`kp-tag kp-tag-${kind}`}>{text}</span>;
}

function Head({ index, eyebrow, title, intro, tag }: { index: string; eyebrow: string; title: string; intro?: string; tag?: "wunsch" | "vorschlag" | "offen" }) {
  return (
    <div className="kp-head">
      <p className="kp-eyebrow" data-fade=""><span>{index}</span>{eyebrow}{tag && <Tag kind={tag} />}</p>
      <h2 data-split="">{title}</h2>
      {intro && <p className="kp-intro" data-fade="0.2">{intro}</p>}
    </div>
  );
}

export function KablitzProjektPage() {
  return (
    <main className="kp-page">
      <KablitzMotion />
      <p className="kp-disclaimer">Interne Projektübersicht für die Geschäftsführung · nicht öffentlich indexiert</p>

      <header className="kp-header">
        <Link href="/" className="kp-logo"><Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Demo-Startseite" width={130} height={40} unoptimized /></Link>
        <nav className="kp-nav" aria-label="Abschnitte">
          {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
        </nav>
        <Link href="/" className="kp-header-cta">Zur Demo <ArrowUpRight size={15} /></Link>
      </header>

      <section className="kp-hero">
        <div className="kp-hero-bg" data-zoom=""><Image src="/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp" alt="" fill sizes="100vw" priority /></div>
        <div className="kp-hero-copy">
          <p className="kp-eyebrow" data-fade="">Projektübersicht · Stand September 2026</p>
          <h1 data-split="">Der nächste Schritt für Kablitz.</h1>
          <p className="kp-hero-lead" data-fade="0.3">Die neue Website soll die Kompetenz von Kablitz sichtbar machen, passende Kundenanfragen gewinnen und die tägliche Arbeit erleichtern. Hier sehen Sie die geplanten Inhalte, Funktionen und Erweiterungsmöglichkeiten.</p>
          <div className="kp-hero-actions" data-fade="0.45">
            <a className="kp-btn kp-btn-primary" href="#anforderungen">Geplante Website ansehen <ArrowDown size={16} /></a>
            <a className="kp-btn" href="#vorschlaege">Zusätzliche Möglichkeiten entdecken</a>
          </div>
          <div className="kp-legend" data-fade="0.6">
            <Tag kind="wunsch" /><span>aus Ihrer Präsentation und dem Briefing</span>
            <Tag kind="vorschlag" /><span>unsere Empfehlung, separat zu entscheiden</span>
          </div>
        </div>
      </section>

      <section className="kp-section" id="ziel">
        <Head index="01" eyebrow="Zielbild" title="Mehr passende Anfragen. Weniger manueller Aufwand." />
        <div className="kp-goals" data-stagger="">
          {GOALS.map((g, i) => (
            <article key={g.title} className="kp-goal"><span>0{i + 1}</span><h3>{g.title}</h3><p>{g.text}</p></article>
          ))}
        </div>
      </section>

      <section className="kp-section kp-dark" id="anforderungen">
        <Head index="02" eyebrow="Ihre Anforderungen" tag="wunsch" title="Alles, was Sie sich für die neue Website wünschen." intro="Vollständig übernommen aus „Kablitz Webseite.pptx“, dem Briefing-Gespräch und den Designreferenzen. Details lassen sich aufklappen." />
        <div className="kp-reqs" data-stagger="">
          {REQUIREMENTS.map((group, i) => (
            <details key={group.id} className="kp-req" open={i === 0}>
              <summary>
                <span className="kp-req-index">{String.fromCharCode(65 + i)}</span>
                <span className="kp-req-title"><strong>{group.title}</strong><small>{group.summary}</small></span>
                <ChevronDown className="kp-req-chevron" size={20} aria-hidden="true" />
              </summary>
              <ul>{group.items.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
            </details>
          ))}
        </div>
      </section>

      <section className="kp-section" id="struktur">
        <Head index="03" eyebrow="Seitenstruktur & Auffindbarkeit" title="Für jede Kundenfrage die passende Seite." intro="Eigene, SEO- und AEO-optimierte Seiten für jede Leistung, jeden Brennstoff und jede wichtige Kundenfrage – damit Kablitz bei Google und in KI-Antworten (ChatGPT, Gemini, Perplexity) gefunden wird." />
        <div className="kp-principles" data-stagger="">
          {SEO_PRINCIPLES.map((p) => <article key={p.title}><h3>{p.title}</h3><p>{p.text}</p></article>)}
        </div>
        <div className="kp-split">
          <div>
            <h3 className="kp-subhead" data-fade="">Geplante Seiten (Auszug)</h3>
            <div className="kp-table" role="table" aria-label="Geplante Seiten" data-fade="0.1">
              <div className="kp-tr kp-th" role="row"><span role="columnheader">Prio</span><span role="columnheader">Seite</span><span role="columnheader">Kundenanliegen</span><span role="columnheader">Nächster Schritt</span></div>
              {PAGES.map((p) => (
                <div className="kp-tr" role="row" key={p.path}>
                  <span role="cell"><b className={`kp-prio kp-prio-${p.prio}`}>{p.prio}</b></span>
                  <span role="cell"><code>{p.path}</code></span>
                  <span role="cell">{p.need}</span>
                  <span role="cell">{p.next}</span>
                </div>
              ))}
            </div>
            <p className="kp-note">P1 zuerst, P2 im Anschluss. Die endgültige URL-Struktur folgt nach Bestandsaufnahme der heutigen Website und Planung der Weiterleitungen.</p>
          </div>
          <div>
            <h3 className="kp-subhead" data-fade="">Kundenfragen, die wir beantworten</h3>
            <ol className="kp-questions" data-stagger="">
              {QUESTIONS.map((q) => <li key={q}>{q}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="kp-section kp-tint" id="redaktion">
        <Head index="04" eyebrow="Redaktion & CMS" tag="wunsch" title="Inhalte selbst veröffentlichen – mit Google-Anmeldung." intro="Ihr Team meldet sich mit dem Google-Konto an und veröffentlicht News, Referenzen und Seiteninhalte ohne Programmierung. Nur freigeschaltete Konten erhalten Zugriff." />
        <div className="kp-cms" data-stagger="">
          {CMS_FEATURES.map((f) => <article key={f.title}><h3>{f.title}</h3><p>{f.text}</p></article>)}
        </div>
        <div className="kp-try" data-fade="">
          <div>
            <strong>Jetzt schon ausprobieren</strong>
            <p>Der News-Editor ist in der Admin-Vorschau funktionsfähig: Beitrag anlegen, Bild wählen, veröffentlichen – und direkt auf der Website ansehen.</p>
          </div>
          <Link className="kp-btn kp-btn-primary" href="/admin">News-Editor öffnen <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="kp-section" id="recht">
        <Head index="05" eyebrow="Datenschutz & Qualität" title="Rechtssicher aufgestellt – von Anfang an." intro="Deutsche Vorgaben werden bei jeder Funktion mitgedacht. Die abschließende Prüfung der Texte erfolgt durch Ihre Verantwortlichen bzw. eine Rechtsberatung." />
        <div className="kp-legal" data-stagger="">
          {LEGAL.map((l) => <article key={l.title}><Check size={18} aria-hidden="true" /><div><h3>{l.title}</h3><p>{l.text}</p></div></article>)}
        </div>
      </section>

      <section className="kp-section kp-dark" id="vorschlaege">
        <Head index="06" eyebrow="Unsere Vorschläge" tag="vorschlag" title="Weitere Möglichkeiten für Vertrieb und Service." intro="Ergänzungen, die Zeit sparen und zusätzlichen Umsatz ermöglichen. Jede ist separat zu bewerten; Aufwand ist eine relative Einschätzung, keine Preis- oder Terminzusage." />
        <div className="kp-proposals" data-stagger="">
          {PROPOSALS.map((p) => (
            <article key={p.title} className={p.recommended ? "is-recommended" : ""}>
              {p.recommended && <span className="kp-start">Empfohlener Start</span>}
              <h3>{p.title}</h3>
              <p>{p.benefit}</p>
              <dl>
                <div><dt>Aufwand</dt><dd>{p.effort}</dd></div>
                <div><dt>Erfolg messen an</dt><dd>{p.measure}</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <p className="kp-note kp-note-dark" data-fade="">Wirtschaftlichkeit rechnen wir gemeinsam mit Ihren Ausgangsdaten: eingesparte Arbeitszeit und zusätzlicher Deckungsbeitrag abzüglich Betriebs- und Pflegekosten.</p>
      </section>

      <section className="kp-section" id="ablauf">
        <Head index="07" eyebrow="Vorgehen" title="So entsteht der neue Unternehmensauftritt." />
        <ol className="kp-phases" data-stagger="">
          {PHASES.map((p, i) => <li key={p.title}><span>{i + 1}</span><h3>{p.title}</h3><p>{p.result}</p></li>)}
        </ol>
        <div className="kp-prepare">
          <h3 className="kp-subhead" data-fade="">Was wir gemeinsam vorbereiten <Tag kind="offen" /></h3>
          <ul data-stagger="">{PREPARE.map((p) => <li key={p}><Check size={16} aria-hidden="true" />{p}</li>)}</ul>
        </div>
      </section>

      <footer className="kp-footer">
        <p data-split="">Bereit für den nächsten Schritt?</p>
        <div className="kp-footer-actions">
          <Link className="kp-btn kp-btn-light" href="/">Demo-Startseite ansehen <ArrowUpRight size={16} /></Link>
          <Link className="kp-btn kp-btn-ghost" href="/admin">Admin-Vorschau</Link>
        </div>
      </footer>
    </main>
  );
}
