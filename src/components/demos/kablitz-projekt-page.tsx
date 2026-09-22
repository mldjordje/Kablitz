import {
  ArrowDown, ArrowRight, Award, Check, Clock, Compass, Factory, Inbox, Layers, Lightbulb, PenLine, Plug, ShieldCheck, Sparkles, Wrench,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AEO_QUESTIONS, AEO_STEPS, CMS, GOALS, LEGAL, PAGE_GROUPS, PHASES, PREPARE, PROPOSALS_LATER, PROPOSALS_NOW, REQUIREMENTS,
  SUMMARY_CORE, SUMMARY_LATER, SUMMARY_RECOMMENDED, TAKEAWAYS, type Item, type SummaryItem,
} from "./kablitz-projekt-data";
import { KablitzProjektReader } from "./kablitz-projekt-reader";
import "./kablitz-projekt.css";

const ICONS: Record<string, LucideIcon> = {
  compass: Compass, layers: Layers, award: Award, factory: Factory, wrench: Wrench, pen: PenLine, shield: ShieldCheck,
  sparkles: Sparkles, inbox: Inbox, plug: Plug,
};

const TOC = [
  { id: "ueberblick", label: "Auf einen Blick" },
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

type Kind = "wunsch" | "empfehlung" | "spaeter";

function Label({ kind }: { kind: Kind }) {
  const text = { wunsch: "Ihr Wunsch", empfehlung: "Unsere Empfehlung", spaeter: "Später" }[kind];
  return <span className={`kd-label kd-label-${kind}`}>{text}</span>;
}

function Chapter({ id, n, title, kind, children }: { id: string; n: number; title: string; kind?: Kind; children: React.ReactNode }) {
  return (
    <section id={id} className="kd-chapter">
      <div className="kd-chapter-head kd-reveal">
        <span className="kd-chapter-num">{String(n).padStart(2, "0")}</span>
        <div>
          <h2>{title}</h2>
          {kind && <Label kind={kind} />}
        </div>
      </div>
      {TAKEAWAYS[id] && <p className="kd-takeaway kd-reveal"><Lightbulb size={18} aria-hidden="true" /><span><strong>Kurz gesagt:</strong> {TAKEAWAYS[id]}</span></p>}
      {children}
    </section>
  );
}

function Cards({ items, columns = 2 }: { items: Item[]; columns?: 2 | 3 }) {
  return (
    <div className={`kd-cards kd-cards-${columns}`}>
      {items.map((item) => (
        <article key={item.title} className="kd-card kd-reveal">
          <h4><Check size={16} aria-hidden="true" />{item.title}</h4>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function SummaryCard({ item, kind }: { item: SummaryItem; kind: Kind }) {
  const Icon = ICONS[item.icon] ?? Check;
  return (
    <a href={`#${item.anchor}`} className={`kd-sum kd-sum-${kind} kd-reveal`}>
      <span className="kd-sum-icon"><Icon size={22} aria-hidden="true" /></span>
      <h3>{item.title}</h3>
      <p className="kd-sum-what">{item.what}</p>
      <p className="kd-sum-value"><span>Ihr Nutzen</span>{item.value}</p>
    </a>
  );
}

export function KablitzProjektPage() {
  return (
    <div className="kd">
      <KablitzProjektReader />
      <header className="kd-top">
        <Link href="/"><Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Demo-Startseite" width={110} height={34} unoptimized /></Link>
        <Link href="/" className="kd-top-link">Zur Demo-Website <ArrowRight size={15} /></Link>
        <span className="kd-progress" aria-hidden="true" />
      </header>

      <div className="kd-cover">
        <div className="kd-cover-inner">
          <p className="kd-meta">Projektübersicht · Stand September 2026</p>
          <h1>Die neue Website für Kablitz</h1>
          <p className="kd-lead">Was die neue Website enthält, was jede Funktion bewirkt und was wir zusätzlich empfehlen.</p>
          <div className="kd-cover-facts">
            <span><Clock size={16} aria-hidden="true" /> Überblick in 3 Minuten, Details in ca. 15 Minuten</span>
            <span><Check size={16} aria-hidden="true" /> Alle Punkte aus Ihrer Präsentation enthalten</span>
          </div>
        </div>
      </div>

      <div className="kd-layout">
        <nav className="kd-toc" aria-label="Inhalt">
          <p>Inhalt</p>
          <ol>{TOC.map((t, i) => <li key={t.id}><a href={`#${t.id}`}><span>{String(i).padStart(2, "0")}</span>{t.label}</a></li>)}</ol>
          <div className="kd-toc-legend">
            <Label kind="wunsch" /><Label kind="empfehlung" /><Label kind="spaeter" />
          </div>
        </nav>

        <main className="kd-doc">
          <section id="ueberblick" className="kd-overview">
            <p className="kd-kicker">Auf einen Blick</p>
            <h2>Das Projekt in Kürze – und was es Ihnen bringt</h2>
            <p className="kd-overview-intro">Die gesamte Spezifikation, verdichtet auf das Wesentliche. Jede Karte zeigt, was umgesetzt wird und welchen Nutzen es für Kablitz hat. Ein Klick führt zur ausführlichen Erklärung.</p>

            <div className="kd-overview-group">
              <h3><Label kind="wunsch" /> Kernumfang der neuen Website</h3>
              <div className="kd-sums">{SUMMARY_CORE.map((s) => <SummaryCard key={s.title} item={s} kind="wunsch" />)}</div>
            </div>
            <div className="kd-overview-group">
              <h3><Label kind="empfehlung" /> Unsere Empfehlung zusätzlich</h3>
              <div className="kd-sums">{SUMMARY_RECOMMENDED.map((s) => <SummaryCard key={s.title} item={s} kind="empfehlung" />)}</div>
            </div>
            <div className="kd-overview-group">
              <h3><Label kind="spaeter" /> Für eine spätere Phase</h3>
              <div className="kd-sums">{SUMMARY_LATER.map((s) => <SummaryCard key={s.title} item={s} kind="spaeter" />)}</div>
            </div>

            <a href="#ziel" className="kd-continue">
              <ArrowDown size={18} aria-hidden="true" />
              <span><strong>Im Folgenden wird jeder Punkt ausführlich erklärt.</strong> Lesen Sie der Reihe nach oder springen Sie über das Inhaltsverzeichnis direkt zu einem Thema.</span>
            </a>
          </section>

          <Chapter id="ziel" n={1} title="Ziel der neuen Website">
            <p>Die Website soll Kablitz als erfahrenen Hersteller für Energie aus Biomasse und Reststoffen zeigen, mehr passende Anfragen bringen und die tägliche Arbeit Ihres Teams erleichtern.</p>
            <Cards items={GOALS} />
          </Chapter>

          <Chapter id="anforderungen" n={2} title="Ihre Anforderungen" kind="wunsch">
            <p>Alle Punkte aus Ihrer Präsentation „Kablitz Webseite“ und dem Briefing, jeweils mit einer kurzen Erklärung, was sie auf der Website bewirken.</p>
            {REQUIREMENTS.map((group, i) => (
              <div key={group.id} className="kd-group">
                <h3 className="kd-reveal"><span>2.{i + 1}</span>{group.title}</h3>
                <p className="kd-group-intro kd-reveal">{group.intro}</p>
                <Cards items={group.items} />
              </div>
            ))}
          </Chapter>

          <Chapter id="seiten" n={3} title="Aufbau der Seiten" kind="wunsch">
            <p>Jede Leistung, jeder Brennstoff und jede wichtige Kundenfrage erhält eine eigene Seite. So landet jeder Besucher – ob über Google, über eine KI-Suche oder über das Menü – direkt auf der Seite, die sein Anliegen beantwortet. Jede Seite endet mit einem passenden Kontaktweg.</p>
            <Cards items={PAGE_GROUPS} />
            <p className="kd-note kd-reveal">Die genauen Seitenadressen legen wir nach der Bestandsaufnahme der heutigen Website fest. Bestehende Adressen werden weitergeleitet, damit keine Google-Platzierung verloren geht.</p>
          </Chapter>

          <Chapter id="redaktion" n={4} title="Redaktion mit Google-Anmeldung" kind="wunsch">
            <p>Ihr Team pflegt die Website selbst, ohne Programmierkenntnisse. Der News-Editor ist in der <Link href="/admin">Admin-Vorschau</Link> bereits ausprobierbar.</p>
            <Cards items={CMS} />
          </Chapter>

          <Chapter id="recht" n={5} title="Datenschutz und Recht">
            <p>Deutsche Vorgaben werden bei jeder Funktion von Anfang an berücksichtigt, um Abmahnungen zu vermeiden. Die abschließende Prüfung der Rechtstexte erfolgt durch Ihre Verantwortlichen oder eine Rechtsberatung.</p>
            <Cards items={LEGAL} />
          </Chapter>

          <Chapter id="empfehlungen" n={6} title="Empfohlene Erweiterungen" kind="empfehlung">
            <p>Diese Erweiterungen sparen Zeit und bringen zusätzliche Anfragen. Sie funktionieren ohne Anbindung an Ihre internen Systeme und können mit der neuen Website starten.</p>

            <div className="kd-feature kd-reveal">
              <p className="kd-feature-kicker"><Sparkles size={16} aria-hidden="true" /> Wichtigste Empfehlung</p>
              <h3>KI-Sichtbarkeit (AEO): Kablitz wird in ChatGPT & Co. genannt</h3>
              <p>Immer mehr Einkäufer und Ingenieure suchen nicht mehr bei Google, sondern fragen ChatGPT, Gemini oder Perplexity. Diese Systeme geben eine fertige Antwort und nennen darin wenige Hersteller – oft mit Link. Wer dort nicht genannt wird, kommt in die engere Auswahl gar nicht erst hinein.</p>
              <p><strong>AEO (Answer Engine Optimization)</strong> ist die Weiterentwicklung der klassischen Suchmaschinenoptimierung: Die Website wird so aufgebaut, dass KI-Systeme Kablitz als passende, glaubwürdige Antwort erkennen und nennen. Gleichzeitig verbessert sie die Platzierung bei Google.</p>

              <div className="kd-chat" aria-label="Beispiel einer KI-Anfrage">
                <p className="kd-chat-q">{AEO_QUESTIONS[0]}</p>
                <p className="kd-chat-a"><Sparkles size={15} aria-hidden="true" /><span>… Ein erfahrener Hersteller ist die <strong>Richard Kablitz GmbH</strong> aus Lauda-Königshofen, die wassergekühlte Rostfeuerungen für Altholz und andere Festbrennstoffe baut … <u>kablitz.de</u></span></p>
                <p className="kd-chat-caption">So soll eine KI-Antwort künftig aussehen (Beispiel).</p>
              </div>

              <h4>Weitere Fragen, bei denen Kablitz genannt werden soll</h4>
              <ul className="kd-questions">{AEO_QUESTIONS.slice(1).map((q) => <li key={q}>„{q}“</li>)}</ul>

              <h4>So erreichen wir das</h4>
              <ol className="kd-steps">{AEO_STEPS.map((s) => <li key={s.title}><strong>{s.title}</strong><span>{s.text}</span></li>)}</ol>

              <p className="kd-note">KI-Antworten kann niemand direkt steuern, und sie schwanken von Frage zu Frage. Wir schaffen die Voraussetzungen, unter denen Kablitz genannt wird, und machen den Fortschritt mit der monatlichen Messung sichtbar.</p>
            </div>

            <h3 className="kd-sub kd-reveal">Weitere Empfehlungen</h3>
            <div className="kd-cards kd-cards-2">
              {PROPOSALS_NOW.map((p) => (
                <article key={p.title} className="kd-card kd-card-proposal kd-reveal">
                  <h4>{p.title}</h4>
                  <p><span className="kd-mini">Was es tut</span>{p.does}</p>
                  <p className="kd-benefit"><span className="kd-mini">Ihr Nutzen</span>{p.benefit}</p>
                </article>
              ))}
            </div>
          </Chapter>

          <Chapter id="spaeter" n={7} title="Für später" kind="spaeter">
            <p>Diese Ideen bringen zusätzlichen Nutzen, erfordern aber eine Anbindung an Ihre bestehenden Systeme oder einen größeren Aufwand. Wir empfehlen, sie nach dem Start der neuen Website und nach einer gemeinsamen Prüfung anzugehen.</p>
            <div className="kd-cards kd-cards-2">
              {PROPOSALS_LATER.map((p) => (
                <article key={p.title} className="kd-card kd-card-later kd-reveal">
                  <h4>{p.title}</h4>
                  <p><span className="kd-mini">Was es tut</span>{p.does}</p>
                  <p><span className="kd-mini">Voraussetzung</span>{p.benefit}</p>
                </article>
              ))}
            </div>
          </Chapter>

          <Chapter id="ablauf" n={8} title="Ablauf">
            <ol className="kd-timeline">{PHASES.map((p, i) => <li key={p.title} className="kd-reveal"><span>{i + 1}</span><div><strong>{p.title}</strong><p>{p.text}</p></div></li>)}</ol>
          </Chapter>

          <Chapter id="vorbereitung" n={9} title="Was wir von Ihnen brauchen">
            <ul className="kd-checklist">{PREPARE.map((p) => <li key={p} className="kd-reveal"><Check size={18} aria-hidden="true" />{p}</li>)}</ul>
          </Chapter>

          <footer className="kd-end kd-reveal">
            <p>Fragen zu diesem Dokument besprechen wir gern persönlich.</p>
            <div><Link href="/" className="kd-btn">Demo-Website ansehen <ArrowRight size={16} /></Link><Link href="/admin" className="kd-btn kd-btn-ghost">Admin-Vorschau öffnen</Link></div>
          </footer>
        </main>
      </div>
    </div>
  );
}
