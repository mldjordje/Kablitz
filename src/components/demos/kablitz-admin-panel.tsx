"use client";

import {
  AlertTriangle,
  ArrowLeft,
  Award,
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
  Inbox,
  MoreHorizontal,
  X,
  LayoutDashboard,
  Newspaper,
  PackageSearch,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Upload,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { LeadProfile } from "@/lib/lead-schema";
import { KablitzAdminNews } from "./kablitz-admin-news";
import { AdminReferences } from "./kablitz-admin-references";
import { AdminProjectInquiries, AdminServiceInquiries } from "./kablitz-admin-inquiries";

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
  | "projectInquiries"
  | "serviceInquiries"
  | "projects"
  | "references"
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
  { key: "projectInquiries", label: "Projektanfragen", icon: <Inbox size={17} />, done: true },
  { key: "serviceInquiries", label: "Serviceanfragen", icon: <Wrench size={17} />, done: true },
  { key: "news", label: "News & Beiträge", icon: <Newspaper size={17} />, done: true },
  { key: "projects", label: "Projekte", icon: <FolderKanban size={17} />, done: true },
  { key: "references", label: "Referenzprojekte", icon: <Award size={17} />, done: true },
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

/** Primary modules in the phone tab bar; the rest sit in the "Mehr" sheet. */
const TAB_KEYS: ViewKey[] = ["dashboard", "projects", "installed", "stock"];
const TAB_LABELS: Partial<Record<ViewKey, string>> = { dashboard: "Übersicht", projects: "Projekte", installed: "Anlagen", stock: "Lager" };

const PLACEHOLDER_COPY: Record<string, string> = {
  approvals: "Mehrstufige Freigabe von Bestellungen ab einem definierten Betrag.",
  movements: "Lückenlose Historie jeder Bestandsbewegung — exportierbar für Audits.",
  reports: "Auswertungen zu Verbrauch, Liefertreue und Beständen.",
  settings: "Benutzer, Rollen, Mindestbestände und Benachrichtigungen verwalten.",
};

export function KablitzAdminPanel({ lead }: { lead: LeadProfile }) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [sheet, setSheet] = useState(false);
  const active = NAV.find((n) => n.key === view)!;
  const contentRef = useRef<HTMLDivElement>(null);
  const go = (key: ViewKey) => { setView(key); setSheet(false); window.scrollTo({ top: 0 }); };

  // Every module enters the same way: blocks rise in turn, counters run up, bars fill.
  useGSAP(() => {
    const root = contentRef.current;
    if (!root) return;
    gsap.fromTo(root.querySelectorAll(":scope > *, [data-rise]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, clearProps: "transform" });
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const counter = { v: 0 };
      gsap.to(counter, { v: Number(el.dataset.count), duration: 1.4, ease: "power3.out", delay: 0.15, onUpdate: () => { el.textContent = `${Math.round(counter.v)}${el.dataset.suffix ?? ""}`; } });
    });
    gsap.fromTo(root.querySelectorAll("[data-fill]"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "0 50%", duration: 1.3, ease: "expo.out", stagger: 0.06, delay: 0.2 });
  }, { dependencies: [view], scope: contentRef });

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
              onClick={() => go(item.key)}
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
            <p className="kablitz-panel-kicker"><span className="kablitz-panel-live" /> System online</p>
            <h1 key={view}>{view === "dashboard" ? "Guten Tag, Werkleitung." : active.label}</h1>
            <p>{lead.businessName} · Konzept-Vorschau</p>
          </div>
          <span className="kablitz-panel-demo-tag">{view === "news" || view.endsWith("Inquiries") || view === "references" ? "Vorschau · Speicherung nur in diesem Browser" : "Fiktive Daten · nichts wird gespeichert"}</span>
        </header>

        <div className="kablitz-panel-content" ref={contentRef}>
          {view === "dashboard" && <DashboardView onJump={go} />}
          {view === "news" && <KablitzAdminNews />}
          {view === "projectInquiries" && <AdminProjectInquiries />}
          {view === "serviceInquiries" && <AdminServiceInquiries />}
          {view === "projects" && <ProjectsView />}
          {view === "references" && <AdminReferences />}
          {view === "installed" && <InstalledView />}
          {view === "foundry" && <FoundryView />}
          {view === "stock" && <StockView />}
          {view === "orders" && <OrdersView />}
          {view === "receiving" && <ReceivingView />}
          {view === "suppliers" && <SuppliersView />}
          {!active.done && <RedPlaceholder title={active.label} copy={PLACEHOLDER_COPY[active.key]} />}
        </div>
      </main>

      {/* Phones: native-style tab bar plus a sheet for the remaining modules */}
      <nav className="kablitz-tabbar" aria-label="Module">
        {TAB_KEYS.map((key) => (
          <button key={key} type="button" aria-current={view === key ? "page" : undefined} onClick={() => go(key)}>
            {NAV.find((n) => n.key === key)!.icon}<span>{TAB_LABELS[key]}</span>
          </button>
        ))}
        <button type="button" aria-expanded={sheet} aria-current={!TAB_KEYS.includes(view) ? "page" : undefined} onClick={() => setSheet(true)}>
          <MoreHorizontal size={17} /><span>Mehr</span>
        </button>
      </nav>
      <div className="kablitz-sheet" data-open={sheet} onClick={() => setSheet(false)}>
        <div className="kablitz-sheet-panel" role="dialog" aria-label="Alle Module" onClick={(e) => e.stopPropagation()}>
          <div className="kablitz-sheet-head"><strong>Alle Module</strong><button type="button" aria-label="Schließen" onClick={() => setSheet(false)}><X size={18} /></button></div>
          <div className="kablitz-sheet-grid">
            {NAV.filter((n) => !TAB_KEYS.includes(n.key)).map((item) => (
              <button key={item.key} type="button" className={view === item.key ? "is-active" : ""} onClick={() => go(item.key)}>
                {item.icon}<span>{item.label}</span>{!item.done && <em>bald</em>}
              </button>
            ))}
          </div>
          <div className="kablitz-sheet-links"><Link href="/projekt">Projektübersicht</Link><Link href="/">Zurück zur Demo</Link></div>
        </div>
      </div>
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

const TREND: Record<string, number[]> = {
  projects: [3, 3, 4, 4, 5, 4, 5],
  plants: [3, 3, 4, 4, 4, 5, 5],
  service: [0, 1, 1, 0, 1, 2, 2],
  foundry: [64, 70, 68, 75, 79, 77, 82],
  stock: [1, 1, 2, 2, 1, 3, 3],
  late: [0, 1, 0, 1, 1, 2, 2],
};

const ACTIVITY = [
  { time: "08:12", text: "Abguss Rippenplatte RP-12 in Qualitätsprüfung", tone: "check" },
  { time: "07:45", text: "Lieferung Dichtungssätze WT-Serie vollständig eingegangen", tone: "ok" },
  { time: "Gestern", text: "Stahlhandel Tauber: Liefertermin um 8 Tage überschritten", tone: "danger" },
  { time: "Gestern", text: "Service-Retrofit Riga: Inbetriebnahme gestartet", tone: "active" },
  { time: "Mo.", text: "Angebot Wärmerückgewinnung Linz versendet", tone: "plan" },
];

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / Math.max(1, max - min)) * 24}`).join(" ");
  return (
    <svg className="kablitz-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,30 ${pts} 100,30`} className="kablitz-spark-area" />
      <polyline points={pts} className="kablitz-spark-line" pathLength={1} />
    </svg>
  );
}

function Gauge({ value, label }: { value: number; label: string }) {
  return (
    <div className="kablitz-gauge" style={{ "--v": value } as CSSProperties}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="50" className="kablitz-gauge-track" pathLength={100} />
        <circle cx="60" cy="60" r="50" className="kablitz-gauge-value" pathLength={100} />
      </svg>
      <div><strong data-count={value} data-suffix="%">{value}%</strong><span>{label}</span></div>
    </div>
  );
}

function DashboardView({ onJump }: { onJump: (v: ViewKey) => void }) {
  const tiles: { label: string; value: number; suffix?: string; tone: string; to: ViewKey; trend: number[] }[] = [
    { label: "Laufende Projekte", value: PROJECTS.filter((p) => p.phase !== "Service").length, tone: "neutral", to: "projects", trend: TREND.projects },
    { label: "Anlagen weltweit", value: PLANTS.length, tone: "ok", to: "installed", trend: TREND.plants },
    { label: "Service überfällig", value: overdueServices.length, tone: "danger", to: "installed", trend: TREND.service },
    { label: "Gießerei-Auslastung", value: FOUNDRY_CAPACITY, suffix: "%", tone: "warn", to: "foundry", trend: TREND.foundry },
    { label: "Unter Mindestbestand", value: lowStock.length, tone: "warn", to: "stock", trend: TREND.stock },
    { label: "Lieferungen verspätet", value: lateOrders.length, tone: "danger", to: "orders", trend: TREND.late },
  ];
  const perPhase = PHASES.map((phase) => ({ phase, count: PROJECTS.filter((p) => p.phase === phase).length }));
  const maxPhase = Math.max(...perPhase.map((p) => p.count), 1);
  const volume = PROJECTS.reduce((sum, p) => sum + p.budget, 0);
  return (
    <>
      <div className="kablitz-admin-alerts">
        {overdueServices.length > 0 && (
          <button type="button" className="kablitz-admin-alert is-danger" onClick={() => onJump("installed")}>
            <AlertTriangle size={18} />
            <span>{overdueServices.length} Anlagen mit überfälligem Service — Wartung einplanen.</span>
          </button>
        )}
        {lateOrders.length > 0 && (
          <button type="button" className="kablitz-admin-alert is-warning" onClick={() => onJump("orders")}>
            <Clock size={18} />
            <span>{lateOrders.length} Bestellung(en) überfällig — Lieferant kontaktieren.</span>
          </button>
        )}
        {lowStock.length > 0 && (
          <button type="button" className="kablitz-admin-alert is-warning" onClick={() => onJump("stock")}>
            <PackageSearch size={18} />
            <span>{lowStock.length} Artikel unter Mindestbestand — Nachbestellung erforderlich.</span>
          </button>
        )}
      </div>

      <div className="kablitz-panel-tiles kablitz-panel-tiles-6">
        {tiles.map((t) => (
          <button key={t.label} type="button" className={`kablitz-panel-tile tone-${t.tone}`} onClick={() => onJump(t.to)} data-rise="">
            <strong data-count={t.value} data-suffix={t.suffix ?? ""}>{t.value}{t.suffix}</strong>
            <span>{t.label}</span>
            <Sparkline values={t.trend} />
          </button>
        ))}
      </div>

      <div className="kablitz-dash-grid">
        <section className="kablitz-dash-card kablitz-dash-foundry" data-rise="">
          <header><h2><Factory size={17} /> Gießerei</h2><button type="button" onClick={() => onJump("foundry")}>Planung</button></header>
          <Gauge value={FOUNDRY_CAPACITY} label="Auslastung diese Woche" />
          <ul className="kablitz-dash-mini">
            {CASTS.slice(0, 3).map((c) => <li key={c.part + c.project}><span>{c.part}</span><CastStatus status={c.status} /></li>)}
          </ul>
        </section>

        <section className="kablitz-dash-card" data-rise="">
          <header><h2><FolderKanban size={17} /> Projekt-Pipeline</h2><button type="button" onClick={() => onJump("projects")}>Alle</button></header>
          <p className="kablitz-dash-big"><strong>{(volume / 1e6).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio. €</strong> Auftragsvolumen</p>
          <div className="kablitz-dash-phases">
            {perPhase.map(({ phase, count }) => (
              <div key={phase}>
                <span>{phase}</span>
                <span className="kablitz-dash-bar"><i data-fill="" style={{ width: `${(count / maxPhase) * 100}%` }} /></span>
                <b>{count}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="kablitz-dash-card" data-rise="">
          <header><h2><Star size={17} /> Liefertreue</h2><button type="button" onClick={() => onJump("suppliers")}>Details</button></header>
          <div className="kablitz-dash-phases">
            {SUPPLIER_SCORES.map((s) => (
              <div key={s.supplier}>
                <span>{s.supplier}</span>
                <span className="kablitz-dash-bar"><i data-fill="" className={s.onTimeRate < 75 ? "is-low" : ""} style={{ width: `${s.onTimeRate}%` }} /></span>
                <b className={s.onTimeRate < 75 ? "is-low" : ""}>{s.onTimeRate}%</b>
              </div>
            ))}
          </div>
          <p className="kablitz-dash-foot">Ø {avgOnTime}% pünktlich über alle Lieferanten</p>
        </section>

        <section className="kablitz-dash-card" data-rise="">
          <header><h2><History size={17} /> Aktivität</h2></header>
          <ol className="kablitz-dash-feed">
            {ACTIVITY.map((a) => <li key={a.text} className={`tone-${a.tone}`}><time>{a.time}</time><span>{a.text}</span></li>)}
          </ol>
        </section>
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
