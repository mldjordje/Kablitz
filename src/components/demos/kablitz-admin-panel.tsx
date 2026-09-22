"use client";

import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Factory,
  FileSpreadsheet,
  FolderKanban,
  Globe,
  History,
  LayoutDashboard,
  Newspaper,
  PackageSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Upload,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import type { LeadProfile } from "@/lib/lead-schema";
import { KablitzAdminNews } from "./kablitz-admin-news";

type StockItem = { article: string; onHand: number; min: number; unit: string; reorderQty?: number };
type Order = {
  supplier: string;
  project: string;
  ordered: string;
  expected: string;
  status: "unterwegs" | "verspätet" | "erhalten";
  daysLate?: number;
};
type SupplierScore = { supplier: string; onTimeRate: number; avgDelayDays: number; complaintRate: number };
type ReceivingCheck = { supplier: string; article: string; orderedQty: string; deliveredQty: string; ok: boolean };

const STOCK: StockItem[] = [
  { article: "Gussroste Typ R-415", onHand: 18, min: 40, unit: "Stk.", reorderQty: 60 },
  { article: "Feuerfestbeton FB-90", onHand: 6, min: 12, unit: "t", reorderQty: 15 },
  { article: "Edelstahlrohr DN150", onHand: 54, min: 30, unit: "m" },
  { article: "Schamottesteine", onHand: 9, min: 25, unit: "Palette", reorderQty: 30 },
  { article: "Dichtungssätze WT-Serie", onHand: 47, min: 20, unit: "Stk." },
];

const SUPPLIER_SCORES: SupplierScore[] = [
  { supplier: "Dichtungstechnik Weber", onTimeRate: 96, avgDelayDays: 0.4, complaintRate: 1 },
  { supplier: "Gießerei-Zulieferer Nord", onTimeRate: 88, avgDelayDays: 1.8, complaintRate: 3 },
  { supplier: "Stahlhandel Tauber GmbH", onTimeRate: 71, avgDelayDays: 5.2, complaintRate: 6 },
  { supplier: "Feuerfest Schmidt & Co.", onTimeRate: 64, avgDelayDays: 6.9, complaintRate: 9 },
];

const ORDERS: Order[] = [
  { supplier: "Stahlhandel Tauber GmbH", project: "Anlage Lkr. Ansbach", ordered: "2026-06-02", expected: "2026-06-20", status: "verspätet", daysLate: 8 },
  { supplier: "Feuerfest Schmidt & Co.", project: "Anlage Plzeň (CZ)", ordered: "2026-06-10", expected: "2026-06-25", status: "verspätet", daysLate: 3 },
  { supplier: "Gießerei-Zulieferer Nord", project: "Ersatzteillager", ordered: "2026-06-15", expected: "2026-07-05", status: "unterwegs" },
  { supplier: "Dichtungstechnik Weber", project: "Anlage Lkr. Ansbach", ordered: "2026-05-20", expected: "2026-06-10", status: "erhalten" },
];

const RECEIVING_CHECKS: ReceivingCheck[] = [
  { supplier: "Dichtungstechnik Weber", article: "Dichtungssätze WT-Serie", orderedQty: "50 Stk.", deliveredQty: "50 Stk.", ok: true },
  { supplier: "Gießerei-Zulieferer Nord", article: "Rohgussteile R-415", orderedQty: "60 Stk.", deliveredQty: "54 Stk.", ok: false },
];

type Phase = "Angebot" | "Auftrag" | "Fertigung" | "Montage" | "Inbetriebnahme" | "Service";
type Project = { name: string; customer: string; location: string; phase: Phase; deadline: string; budget: number; spent: number };
type Plant = { name: string; country: string; city: string; commissioned: number; capacity: string; nextService: string; overdue?: boolean };
type Cast = { part: string; project: string; qty: number; pour: string; status: "geplant" | "in Fertigung" | "gegossen" | "Qualitätsprüfung" };

const PHASES: Phase[] = ["Angebot", "Auftrag", "Fertigung", "Montage", "Inbetriebnahme", "Service"];

const PROJECTS: Project[] = [
  { name: "Biomasse-HKW Ansbach", customer: "Stadtwerke Ansbach", location: "Ansbach (DE)", phase: "Fertigung", deadline: "2026-09-15", budget: 1850000, spent: 690000 },
  { name: "Dampfkessel Plzeň", customer: "Plzeňská Teplárna", location: "Plzeň (CZ)", phase: "Montage", deadline: "2026-07-28", budget: 1240000, spent: 1120000 },
  { name: "Rostfeuerung Sägewerk Süd", customer: "Holzwerk Müller", location: "Kempten (DE)", phase: "Auftrag", deadline: "2026-11-30", budget: 760000, spent: 95000 },
  { name: "Wärmerückgewinnung Linz", customer: "Energie AG", location: "Linz (AT)", phase: "Angebot", deadline: "2027-02-10", budget: 540000, spent: 0 },
  { name: "Service-Retrofit Riga", customer: "Rīgas Siltums", location: "Riga (LV)", phase: "Inbetriebnahme", deadline: "2026-07-05", budget: 410000, spent: 388000 },
];

const PLANTS: Plant[] = [
  { name: "HKW Tauberfranken", country: "Deutschland", city: "Bad Mergentheim", commissioned: 2019, capacity: "12 MW", nextService: "2026-07-12", overdue: false },
  { name: "Biomasse-Kessel Uppsala", country: "Schweden", city: "Uppsala", commissioned: 2017, capacity: "8 MW", nextService: "2026-06-20", overdue: true },
  { name: "Rostfeuerung Busan", country: "Südkorea", city: "Busan", commissioned: 2021, capacity: "15 MW", nextService: "2026-09-01", overdue: false },
  { name: "Heißgaserzeuger Graz", country: "Österreich", city: "Graz", commissioned: 2015, capacity: "6 MW", nextService: "2026-06-10", overdue: true },
  { name: "Dampfanlage Lyon", country: "Frankreich", city: "Lyon", commissioned: 2020, capacity: "10 MW", nextService: "2026-10-15", overdue: false },
];

const CASTS: Cast[] = [
  { part: "Gussrost R-415", project: "Biomasse-HKW Ansbach", qty: 48, pour: "2026-07-02", status: "in Fertigung" },
  { part: "Rippenplatte RP-12", project: "Dampfkessel Plzeň", qty: 120, pour: "2026-06-28", status: "Qualitätsprüfung" },
  { part: "Roststab RS-90", project: "Service-Retrofit Riga", qty: 200, pour: "2026-07-08", status: "geplant" },
  { part: "Gussrost R-415", project: "Rostfeuerung Sägewerk Süd", qty: 36, pour: "2026-07-15", status: "geplant" },
  { part: "Lamellenplatte LP-7", project: "Ersatzteillager", qty: 80, pour: "2026-06-25", status: "gegossen" },
];

const FOUNDRY_CAPACITY = 82; // % Auslastung diese Woche

const isBelowMin = (item: StockItem) => item.onHand < item.min;
const lowStock = STOCK.filter(isBelowMin);
const lateOrders = ORDERS.filter((o) => o.status === "verspätet");
const avgOnTime = Math.round(SUPPLIER_SCORES.reduce((s, x) => s + x.onTimeRate, 0) / SUPPLIER_SCORES.length);
const overdueServices = PLANTS.filter((p) => p.overdue);
const eur = (n: number) => n.toLocaleString("de-DE");

type ViewKey =
  | "dashboard"
  | "news"
  | "projects"
  | "installed"
  | "foundry"
  | "stock"
  | "orders"
  | "receiving"
  | "suppliers"
  | "approvals"
  | "movements"
  | "reports"
  | "settings";

type NavItem = { key: ViewKey; label: string; icon: ReactNode; done: boolean };

const NAV: NavItem[] = [
  { key: "dashboard", label: "Übersicht", icon: <LayoutDashboard size={17} />, done: true },
  { key: "news", label: "News & Beiträge", icon: <Newspaper size={17} />, done: true },
  { key: "projects", label: "Projekte", icon: <FolderKanban size={17} />, done: true },
  { key: "installed", label: "Anlagen-Bestand", icon: <Globe size={17} />, done: true },
  { key: "foundry", label: "Gießerei", icon: <Factory size={17} />, done: true },
  { key: "stock", label: "Lagerbestand", icon: <PackageSearch size={17} />, done: true },
  { key: "orders", label: "Bestellungen", icon: <Truck size={17} />, done: true },
  { key: "receiving", label: "Wareneingang", icon: <ClipboardCheck size={17} />, done: true },
  { key: "suppliers", label: "Lieferanten", icon: <Star size={17} />, done: true },
  { key: "approvals", label: "Genehmigungen", icon: <ShieldCheck size={17} />, done: false },
  { key: "movements", label: "Lagerbewegungen", icon: <History size={17} />, done: false },
  { key: "reports", label: "Berichte", icon: <BarChart3 size={17} />, done: false },
  { key: "settings", label: "Einstellungen", icon: <Settings size={17} />, done: false },
];

const PLACEHOLDER_COPY: Record<string, string> = {
  approvals: "Mehrstufige Freigabe von Bestellungen ab einem definierten Betrag.",
  movements: "Lückenlose Historie jeder Bestandsbewegung — exportierbar für Audits.",
  reports: "Auswertungen zu Verbrauch, Liefertreue und Beständen.",
  settings: "Benutzer, Rollen, Mindestbestände und Benachrichtigungen verwalten.",
};

export function KablitzAdminPanel({ lead }: { lead: LeadProfile }) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const active = NAV.find((n) => n.key === view)!;

  return (
    <div className="kablitz-panel">
      <aside className="kablitz-panel-sidebar">
        <div className="kablitz-panel-brand">
          {lead.slug === "kablitz-gmbh-r4t9k2" ? (
            <Image src="/leads/kablitz-gmbh-r4t9k2/logo-kablitz.png" alt="Kablitz" width={120} height={17} unoptimized />
          ) : (
            <strong className="kablitz-panel-wordmark">{lead.businessName}</strong>
          )}
          <span>Betriebsplattform</span>
        </div>
        <nav className="kablitz-panel-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`kablitz-panel-navitem ${view === item.key ? "is-active" : ""} ${item.done ? "" : "is-wip"}`}
              onClick={() => setView(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
              {!item.done && <em className="kablitz-panel-dot" aria-label="In Entwicklung" />}
            </button>
          ))}
        </nav>
        <Link className="kablitz-panel-back" href="/projekt">
          <FolderKanban size={15} /> Projektübersicht
        </Link>
        <Link className="kablitz-panel-back" href="/">
          <ArrowLeft size={15} /> Zurück zur Demo
        </Link>
      </aside>

      <main className="kablitz-panel-main">
        <header className="kablitz-panel-topbar">
          <div>
            <h1>{active.label}</h1>
            <p>{lead.businessName} · Konzept-Vorschau</p>
          </div>
          <span className="kablitz-panel-demo-tag">{view === "news" ? "Vorschau · Speicherung nur in diesem Browser" : "Fiktive Daten · nichts wird gespeichert"}</span>
        </header>

        <div className="kablitz-panel-content">
          {view === "dashboard" && <DashboardView onJump={setView} />}
          {view === "news" && <KablitzAdminNews />}
          {view === "projects" && <ProjectsView />}
          {view === "installed" && <InstalledView />}
          {view === "foundry" && <FoundryView />}
          {view === "stock" && <StockView />}
          {view === "orders" && <OrdersView />}
          {view === "receiving" && <ReceivingView />}
          {view === "suppliers" && <SuppliersView />}
          {!active.done && <RedPlaceholder title={active.label} copy={PLACEHOLDER_COPY[active.key]} />}
        </div>
      </main>
    </div>
  );
}

/** Excel migration affordance — signals "we move your spreadsheets into the app". Demo only. */
function ExcelTools() {
  return (
    <div className="kablitz-excel-tools">
      <button type="button" className="kablitz-excel-btn is-import">
        <Upload size={14} /> Aus Excel importieren
      </button>
      <button type="button" className="kablitz-excel-btn">
        <Download size={14} /> Export
      </button>
    </div>
  );
}

function BlockHead({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="kablitz-block-head">
      <h2>{icon} {title}</h2>
      <ExcelTools />
    </div>
  );
}

function RedPlaceholder({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="kablitz-panel-wip">
      <span className="kablitz-panel-wip-badge">In Entwicklung</span>
      <h2>{title}</h2>
      <p>{copy}</p>
      <p className="kablitz-panel-wip-note">Dieses Modul ist Teil des geplanten Funktionsumfangs und noch nicht umgesetzt.</p>
    </div>
  );
}

function DashboardView({ onJump }: { onJump: (v: ViewKey) => void }) {
  const tiles: { label: string; value: string | number; tone: string; to: ViewKey }[] = [
    { label: "Laufende Projekte", value: PROJECTS.filter((p) => p.phase !== "Service").length, tone: "neutral", to: "projects" },
    { label: "Anlagen weltweit", value: PLANTS.length, tone: "ok", to: "installed" },
    { label: "Service überfällig", value: overdueServices.length, tone: "danger", to: "installed" },
    { label: "Gießerei-Auslastung", value: `${FOUNDRY_CAPACITY}%`, tone: "warn", to: "foundry" },
    { label: "Unter Mindestbestand", value: lowStock.length, tone: "warn", to: "stock" },
    { label: "Lieferungen verspätet", value: lateOrders.length, tone: "danger", to: "orders" },
  ];
  return (
    <>
      <div className="kablitz-admin-alerts">
        {overdueServices.length > 0 && (
          <article className="kablitz-admin-alert is-danger">
            <AlertTriangle size={18} />
            <span>{overdueServices.length} Anlagen mit überfälligem Service — Wartung einplanen.</span>
          </article>
        )}
        {lateOrders.length > 0 && (
          <article className="kablitz-admin-alert is-warning">
            <Clock size={18} />
            <span>{lateOrders.length} Bestellung(en) überfällig — Lieferant kontaktieren.</span>
          </article>
        )}
        {lowStock.length > 0 && (
          <article className="kablitz-admin-alert is-warning">
            <PackageSearch size={18} />
            <span>{lowStock.length} Artikel unter Mindestbestand — Nachbestellung erforderlich.</span>
          </article>
        )}
      </div>
      <div className="kablitz-panel-tiles kablitz-panel-tiles-6">
        {tiles.map((t) => (
          <button key={t.label} type="button" className={`kablitz-panel-tile tone-${t.tone}`} onClick={() => onJump(t.to)}>
            <strong>{t.value}</strong>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function ProjectsView() {
  return (
    <section className="kablitz-admin-block">
      <BlockHead icon={<FolderKanban size={18} />} title="Projekt-Pipeline" />
      <div className="kablitz-admin-table kablitz-proj-table">
        <div className="kablitz-admin-row kablitz-admin-row-head">
          <span>Projekt</span><span>Kunde</span><span>Phase</span><span>Termin</span><span>Budget</span>
        </div>
        {PROJECTS.map((p) => {
          const ratio = p.budget ? p.spent / p.budget : 0;
          const over = ratio > 1;
          return (
            <div className="kablitz-admin-row" key={p.name}>
              <span>
                <strong className="kablitz-proj-name">{p.name}</strong>
                <em className="kablitz-proj-loc">{p.location}</em>
              </span>
              <span>{p.customer}</span>
              <span><PhaseBadge phase={p.phase} /></span>
              <span>{p.deadline}</span>
              <span className="kablitz-proj-budget">
                <span className="kablitz-proj-bar"><i className={over ? "is-over" : ""} style={{ width: `${Math.min(100, ratio * 100)}%` }} /></span>
                <small>{eur(p.spent)} / {eur(p.budget)} €</small>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PhaseBadge({ phase }: { phase: Phase }) {
  const idx = PHASES.indexOf(phase);
  return (
    <span className="kablitz-phase" title={`Phase ${idx + 1}/${PHASES.length}`}>
      <span className="kablitz-phase-track">
        {PHASES.map((_, i) => (
          <i key={i} className={i <= idx ? "is-on" : ""} />
        ))}
      </span>
      {phase}
    </span>
  );
}

function InstalledView() {
  const countries = new Set(PLANTS.map((p) => p.country)).size;
  return (
    <section className="kablitz-admin-block">
      <BlockHead icon={<Globe size={18} />} title={`Anlagen-Bestand — ${PLANTS.length} Anlagen in ${countries} Ländern`} />
      <div className="kablitz-admin-table kablitz-inst-table">
        <div className="kablitz-admin-row kablitz-admin-row-head">
          <span>Anlage</span><span>Standort</span><span>Inbetriebnahme</span><span>Leistung</span><span>Nächster Service</span>
        </div>
        {PLANTS.map((p) => (
          <div className={`kablitz-admin-row ${p.overdue ? "is-late" : ""}`} key={p.name}>
            <span><strong className="kablitz-proj-name">{p.name}</strong></span>
            <span>{p.city}, {p.country}</span>
            <span>{p.commissioned}</span>
            <span>{p.capacity}</span>
            <span className="kablitz-admin-status">
              {p.overdue ? <><AlertTriangle size={14} /> {p.nextService} · überfällig</> : <><CheckCircle2 size={14} /> {p.nextService}</>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoundryView() {
  return (
    <>
      <section className="kablitz-admin-block">
        <BlockHead icon={<Factory size={18} />} title="Gießerei — Fertigungsplanung" />
        <div className="kablitz-foundry-cap">
          <div className="kablitz-foundry-cap-head">
            <span>Auslastung diese Woche</span>
            <strong>{FOUNDRY_CAPACITY}%</strong>
          </div>
          <div className="kablitz-foundry-cap-bar"><i style={{ width: `${FOUNDRY_CAPACITY}%` }} /></div>
        </div>
        <div className="kablitz-admin-table kablitz-foundry-table">
          <div className="kablitz-admin-row kablitz-admin-row-head">
            <span>Gussteil</span><span>Projekt</span><span>Menge</span><span>Abguss</span><span>Status</span>
          </div>
          {CASTS.map((c) => (
            <div className="kablitz-admin-row" key={c.part + c.project}>
              <span><strong className="kablitz-proj-name">{c.part}</strong></span>
              <span className="kablitz-admin-project">{c.project}</span>
              <span>{c.qty} Stk.</span>
              <span>{c.pour}</span>
              <span><CastStatus status={c.status} /></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function CastStatus({ status }: { status: Cast["status"] }) {
  const tone =
    status === "gegossen" ? "ok" : status === "Qualitätsprüfung" ? "check" : status === "in Fertigung" ? "active" : "plan";
  return <span className={`kablitz-cast-status tone-${tone}`}>{status}</span>;
}

function StockView() {
  return (
    <>
      <section className="kablitz-admin-block">
        <BlockHead icon={<PackageSearch size={18} />} title="Lagerbestand & Mindestbestand" />
        <div className="kablitz-admin-table">
          <div className="kablitz-admin-row kablitz-admin-row-head">
            <span>Artikel</span><span>Bestand</span><span>Mindestbestand</span><span>Status</span>
          </div>
          {STOCK.map((item) => (
            <div className={`kablitz-admin-row ${isBelowMin(item) ? "is-low" : ""}`} key={item.article}>
              <span>{item.article}</span>
              <span>{item.onHand} {item.unit}</span>
              <span>{item.min} {item.unit}</span>
              <span className="kablitz-admin-status">
                {isBelowMin(item) ? <><AlertTriangle size={14} /> Nachbestellen</> : <><CheckCircle2 size={14} /> Ausreichend</>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {lowStock.length > 0 && (
        <section className="kablitz-admin-block">
          <h2><Sparkles size={18} /> Automatische Bestellvorschläge</h2>
          <div className="kablitz-admin-suggestions">
            {lowStock.map((item) => (
              <article className="kablitz-admin-suggestion" key={item.article}>
                <div>
                  <h3>{item.article}</h3>
                  <p>Bestand {item.onHand} {item.unit} liegt unter Mindestbestand ({item.min} {item.unit}).</p>
                </div>
                <div className="kablitz-admin-suggestion-actions">
                  <span className="kablitz-admin-suggestion-qty">+{item.reorderQty ?? item.min} {item.unit}</span>
                  <button type="button" className="kablitz-admin-suggestion-btn">Bestellung bestätigen</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function OrdersView() {
  return (
    <section className="kablitz-admin-block">
      <BlockHead icon={<Truck size={18} />} title="Bestellungen bei Lieferanten" />
      <div className="kablitz-admin-table kablitz-admin-orders-5col">
        <div className="kablitz-admin-row kablitz-admin-row-head">
          <span>Lieferant</span><span>Projekt / Anlage</span><span>Bestellt am</span><span>Erwartet am</span><span>Status</span>
        </div>
        {ORDERS.map((order) => (
          <div className={`kablitz-admin-row ${order.status === "verspätet" ? "is-late" : ""}`} key={order.supplier}>
            <span>{order.supplier}</span>
            <span className="kablitz-admin-project">{order.project}</span>
            <span>{order.ordered}</span>
            <span>{order.expected}</span>
            <span className="kablitz-admin-status">
              {order.status === "verspätet" && <><Clock size={14} /> {order.daysLate} Tage verspätet</>}
              {order.status === "unterwegs" && <>Unterwegs</>}
              {order.status === "erhalten" && <><CheckCircle2 size={14} /> Erhalten</>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReceivingView() {
  return (
    <section className="kablitz-admin-block">
      <h2><ClipboardCheck size={18} /> Wareneingangsprüfung</h2>
      <div className="kablitz-admin-receiving">
        {RECEIVING_CHECKS.map((check) => (
          <article className={`kablitz-admin-receiving-card ${check.ok ? "" : "is-mismatch"}`} key={check.article}>
            <div>
              <h3>{check.article}</h3>
              <p>{check.supplier} · bestellt {check.orderedQty}, geliefert {check.deliveredQty}</p>
            </div>
            <span className="kablitz-admin-status">
              {check.ok ? <><CheckCircle2 size={14} /> Menge stimmt</> : <><AlertTriangle size={14} /> Abweichung — prüfen</>}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function SuppliersView() {
  return (
    <section className="kablitz-admin-block">
      <BlockHead icon={<Star size={18} />} title="Lieferantenbewertung" />
      <div className="kablitz-admin-scores">
        {SUPPLIER_SCORES.map((score) => (
          <article className="kablitz-admin-score-card" key={score.supplier}>
            <div className="kablitz-admin-score-head">
              <h3>{score.supplier}</h3>
              <span className={`kablitz-admin-score-value ${score.onTimeRate < 75 ? "is-low" : ""}`}>{score.onTimeRate}%</span>
            </div>
            <div className="kablitz-admin-score-bar">
              <span style={{ width: `${score.onTimeRate}%` }} />
            </div>
            <p>Liefertreue · Ø {score.avgDelayDays.toFixed(1)} Tage Verzug · {score.complaintRate}% Reklamationen</p>
          </article>
        ))}
      </div>
    </section>
  );
}
