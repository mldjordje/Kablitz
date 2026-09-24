"use client";

import { Building2, FileText, Inbox, Mail, MapPin, Paperclip, Phone, Wrench } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Inquiry inbox (Lastenheft chapter 12): project and spare-part inquiries from the website land here
 * with their Vorgangsnummer. Demo: seeded examples plus anything sent from the landing page forms in
 * this browser (localStorage "kablitz-inquiries"); status changes are kept in this browser too.
 */

const STORAGE_KEY = "kablitz-inquiries";
const STATUS_KEY = "kablitz-inquiry-status";
const STATUSES = ["Neu", "In Bearbeitung", "Angebot versendet", "Erledigt"] as const;
type Status = (typeof STATUSES)[number];

type Contact = { vorname: string; nachname: string; email: string; firma: string; telefon?: string; nachricht?: string };
type ProjectInquiry = Contact & { id: string; date: string; type: "Projektanfrage"; brennstoff: string; menge: string; feuchte: string; energieform: string; leistung: string; standort: string; zeitrahmen: string; status?: Status; demo?: boolean };
type SparePart = { bauteil: string; anlagentyp: string; hersteller: string; baujahr: string; teilenummer: string; menge: string; beschreibung: string; files: { name: string; size: number }[] };
type ServiceInquiry = Contact & { id: string; date: string; type: "Ersatzteilanfrage"; parts: SparePart[]; status?: Status; demo?: boolean };
type Inquiry = ProjectInquiry | ServiceInquiry;

const daysAgo = (d: number, h = 9) => { const t = new Date(); t.setDate(t.getDate() - d); t.setHours(h, 12, 0, 0); return t.toISOString(); };

const SEED_PROJECTS: ProjectInquiry[] = [
  { id: "ANF-2026-48213", date: daysAgo(0, 8), type: "Projektanfrage", status: "Neu", vorname: "Jonas", nachname: "Berger", email: "j.berger@stadtwerke-hameln.example", firma: "Stadtwerke Hameln (Beispiel)", brennstoff: "Holzhackschnitzel", menge: "60000", feuchte: "45", energieform: "Heißwasser / Fernwärme", leistung: "18 MWth", standort: "Hameln, Deutschland", zeitrahmen: "In 1–2 Jahren", nachricht: "Wir planen den Ersatz eines Gaskessels im Fernwärmenetz und suchen eine Biomasselösung inkl. Brennstofflager." },
  { id: "ANF-2026-47790", date: daysAgo(1, 14), type: "Projektanfrage", status: "Neu", vorname: "Marta", nachname: "Kowalska", email: "m.kowalska@papier-lodz.example", firma: "Papierfabrik Łódź (Beispiel)", brennstoff: "Ersatzbrennstoffe (RDF/SRF)", menge: "85000", feuchte: "20", energieform: "Prozessdampf", leistung: "25 MWth", standort: "Łódź, Polen", zeitrahmen: "In 6–12 Monaten", nachricht: "Prozessdampf 40 bar für die Papiermaschine, Reststoffe aus eigener Produktion sollen mitverbrannt werden." },
  { id: "ANF-2026-46102", date: daysAgo(3, 10), type: "Projektanfrage", status: "In Bearbeitung", vorname: "Henrik", nachname: "Lindqvist", email: "henrik@savverk.example", firma: "Norrland Sågverk (Beispiel)", brennstoff: "Altholz", menge: "40000", feuchte: "35", energieform: "Heißgas / Trocknung", leistung: "12 MWth", standort: "Umeå, Schweden", zeitrahmen: "So bald wie möglich", nachricht: "Heißgas für Holztrocknungskammern. Bestehende Anlage (Fremdfabrikat) ist am Ende der Lebensdauer." },
  { id: "ANF-2026-44871", date: daysAgo(6, 11), type: "Projektanfrage", status: "Angebot versendet", vorname: "Luca", nachname: "Moretti", email: "l.moretti@agrienergia.example", firma: "AgriEnergia Veneto (Beispiel)", brennstoff: "Agrarreste (z. B. Stroh, Schalen)", menge: "30000", feuchte: "15", energieform: "Strom (KWK)", leistung: "5 MWel", standort: "Padua, Italien", zeitrahmen: "In 1–2 Jahren", nachricht: "KWK-Anlage für Reisschalen und Maisspindeln, Wärme für Gewächshäuser." },
  { id: "ANF-2026-43015", date: daysAgo(12, 9), type: "Projektanfrage", status: "Erledigt", vorname: "Sabine", nachname: "Hoffmann", email: "s.hoffmann@molkerei.example", firma: "Molkerei Allgäu (Beispiel)", brennstoff: "Holzhackschnitzel", menge: "15000", feuchte: "40", energieform: "Prozessdampf", leistung: "6 MWth", standort: "Kempten, Deutschland", zeitrahmen: "Später / Machbarkeitsstudie", nachricht: "Machbarkeitsstudie für die Umstellung der Dampferzeugung von Erdgas auf Biomasse." },
];

const SEED_SERVICE: ServiceInquiry[] = [
  { id: "ETA-2026-51877", date: daysAgo(0, 10), type: "Ersatzteilanfrage", status: "Neu", vorname: "Peter", nachname: "Schneider", email: "p.schneider@hkw-nord.example", firma: "HKW Nord (Beispiel)", telefon: "+49 40 000000", parts: [
    { bauteil: "Roststab", anlagentyp: "Vorschubrost (luftgekühlt)", hersteller: "Kablitz", baujahr: "2008", teilenummer: "RS-4410-02", menge: "120", beschreibung: "Verschleiß an der Stirnseite, Austausch bei Revision im November.", files: [{ name: "roststab_foto.jpg", size: 2_400_000 }, { name: "zeichnung_RS-4410.pdf", size: 830_000 }] },
    { bauteil: "Verschleißteil", anlagentyp: "Vorschubrost (luftgekühlt)", hersteller: "Kablitz", baujahr: "2008", teilenummer: "SK-210", menge: "8", beschreibung: "Seitenkühlkästen", files: [] },
  ] },
  { id: "ETA-2026-51240", date: daysAgo(1, 16), type: "Ersatzteilanfrage", status: "In Bearbeitung", vorname: "Andris", nachname: "Ozols", email: "a.ozols@rigas-siltums.example", firma: "Rīgas Siltums (Beispiel)", parts: [
    { bauteil: "Rostelement", anlagentyp: "Treppenrost", hersteller: "Kablitz", baujahr: "1998", teilenummer: "", menge: "24", beschreibung: "Teilenummer unbekannt, Maße siehe Skizze.", files: [{ name: "skizze_rostelement.dwg", size: 5_100_000 }] },
  ] },
  { id: "ETA-2026-50388", date: daysAgo(4, 8), type: "Ersatzteilanfrage", status: "Angebot versendet", vorname: "Thomas", nachname: "Gruber", email: "t.gruber@biowaerme.example", firma: "Biowärme Tirol (Beispiel)", telefon: "+43 512 000000", parts: [
    { bauteil: "Gussteil", anlagentyp: "Wanderrost", hersteller: "Fremdfabrikat", baujahr: "2011", teilenummer: "WR-88-17", menge: "40", beschreibung: "Nachbau für Fremdanlage gewünscht.", files: [{ name: "altes_teil.png", size: 1_200_000 }] },
  ] },
  { id: "ETA-2026-49012", date: daysAgo(9, 13), type: "Ersatzteilanfrage", status: "Erledigt", vorname: "Claire", nachname: "Dubois", email: "c.dubois@energie-alsace.example", firma: "Énergie Alsace (Beispiel)", parts: [
    { bauteil: "Roststab", anlagentyp: "Vorschubrost (wassergekühlt)", hersteller: "Kablitz", baujahr: "2015", teilenummer: "RS-5020-01", menge: "300", beschreibung: "Jahresbedarf, Lieferung in zwei Tranchen.", files: [] },
  ] },
];

function readStored(): Inquiry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function readStatus(): Record<string, Status> {
  try { return JSON.parse(localStorage.getItem(STATUS_KEY) ?? "{}"); } catch { return {}; }
}

const fmtDate = (iso: string) => new Date(iso).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);
const tone = (s: Status) => (s === "Neu" ? "new" : s === "In Bearbeitung" ? "active" : s === "Angebot versendet" ? "check" : "ok");

function useInquiries<T extends Inquiry>(type: T["type"], seed: T[]) {
  const [stored, setStored] = useState<T[]>([]);
  const [status, setStatus] = useState<Record<string, Status>>({});
  useEffect(() => {
    // Browser-only storage: read once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStored(readStored().filter((i): i is T => i.type === type));
    setStatus(readStatus());
  }, [type]);
  const items = useMemo(
    () => [...stored, ...seed.map((s) => ({ ...s, demo: true }))]
      .map((i) => ({ ...i, status: status[i.id] ?? i.status ?? "Neu" }) as T & { status: Status })
      .sort((a, b) => b.date.localeCompare(a.date)),
    [stored, seed, status],
  );
  const update = (id: string, s: Status) => {
    const next = { ...status, [id]: s };
    setStatus(next);
    try { localStorage.setItem(STATUS_KEY, JSON.stringify(next)); } catch {}
  };
  return { items, update };
}

function InquiryInbox<T extends Inquiry>({ type, seed, icon, title, summary, detail }: {
  type: T["type"]; seed: T[]; icon: ReactNode; title: string;
  summary: (i: T) => string; detail: (i: T) => ReactNode;
}) {
  const { items, update } = useInquiries<T>(type, seed);
  const [filter, setFilter] = useState<Status | "Alle">("Alle");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const shown = filter === "Alle" ? items : items.filter((i) => i.status === filter);
  const selected = items.find((i) => i.id === selectedId) ?? shown[0];

  return (
    <>
      <div className="kinbox-kpis">
        {STATUSES.map((s) => (
          <div key={s} className={`kinbox-kpi tone-${tone(s)}`}>
            <strong>{items.filter((i) => i.status === s).length}</strong>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <section className="kablitz-admin-block kinbox">
        <div className="kablitz-block-head">
          <h2>{icon} {title}</h2>
          <div className="kinbox-filters" role="tablist" aria-label="Status filtern">
            {(["Alle", ...STATUSES] as const).map((s) => (
              <button key={s} type="button" role="tab" aria-selected={filter === s} onClick={() => setFilter(s)}>
                {s} <em>{s === "Alle" ? items.length : items.filter((i) => i.status === s).length}</em>
              </button>
            ))}
          </div>
        </div>

        <div className="kinbox-split">
          <ul className="kinbox-list">
            {shown.length === 0 && <li className="kinbox-empty">Keine Anfragen mit diesem Status.</li>}
            {shown.map((i) => (
              <li key={i.id}>
                <button type="button" className={selected?.id === i.id ? "is-active" : ""} onClick={() => setSelectedId(i.id)}>
                  <span className="kinbox-row-top">
                    <strong>{i.firma}</strong>
                    <span className={`kablitz-cast-status tone-${tone(i.status)}`}>{i.status}</span>
                  </span>
                  <span className="kinbox-row-sub">{summary(i)}</span>
                  <span className="kinbox-row-meta">{i.id} · {fmtDate(i.date)}{!i.demo && <b>Website</b>}</span>
                </button>
              </li>
            ))}
          </ul>

          {selected && (
            <article className="kinbox-detail" key={selected.id}>
              <header>
                <div>
                  <p className="kinbox-id">{selected.id} · {fmtDate(selected.date)}</p>
                  <h3>{selected.vorname} {selected.nachname}</h3>
                  <p className="kinbox-contact">
                    <span><Building2 size={14} /> {selected.firma}</span>
                    <a href={`mailto:${selected.email}`}><Mail size={14} /> {selected.email}</a>
                    {selected.telefon && <span><Phone size={14} /> {selected.telefon}</span>}
                  </p>
                </div>
                <label className="kinbox-status">
                  Status
                  <select value={selected.status} onChange={(e) => update(selected.id, e.target.value as Status)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </header>
              {detail(selected)}
              {selected.nachricht && (
                <div className="kinbox-message"><small>Nachricht</small><p>{selected.nachricht}</p></div>
              )}
              <div className="kinbox-actions">
                <a className="kablitz-news-btn is-primary" href={`mailto:${selected.email}?subject=${encodeURIComponent(`Ihre Anfrage ${selected.id}`)}`}><Mail size={15} /> Antworten</a>
                {!selected.demo && <span className="kinbox-note">Über das Formular auf der Website eingegangen</span>}
              </div>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

export function AdminProjectInquiries() {
  return (
    <InquiryInbox<ProjectInquiry>
      type="Projektanfrage"
      seed={SEED_PROJECTS}
      icon={<Inbox size={18} />}
      title="Projektanfragen"
      summary={(i) => [i.brennstoff, i.leistung, i.standort].filter(Boolean).join(" · ")}
      detail={(i) => (
        <dl className="kinbox-facts">
          <div><dt>Brennstoff</dt><dd>{i.brennstoff || "–"}</dd></div>
          <div><dt>Menge</dt><dd>{i.menge ? `${Number(i.menge).toLocaleString("de-DE")} t/a` : "–"}</dd></div>
          <div><dt>Feuchte</dt><dd>{i.feuchte ? `${i.feuchte} %` : "–"}</dd></div>
          <div><dt>Energieform</dt><dd>{i.energieform || "–"}</dd></div>
          <div><dt>Leistung</dt><dd>{i.leistung || "–"}</dd></div>
          <div><dt>Zeitrahmen</dt><dd>{i.zeitrahmen || "–"}</dd></div>
          <div className="is-wide"><dt>Standort</dt><dd><MapPin size={14} /> {i.standort || "–"}</dd></div>
        </dl>
      )}
    />
  );
}

export function AdminServiceInquiries() {
  return (
    <InquiryInbox<ServiceInquiry>
      type="Ersatzteilanfrage"
      seed={SEED_SERVICE}
      icon={<Wrench size={18} />}
      title="Ersatzteilanfragen"
      summary={(i) => `${i.parts.length} ${i.parts.length === 1 ? "Position" : "Positionen"} · ${i.parts.map((p) => p.bauteil).join(", ")}`}
      detail={(i) => (
        <ol className="kinbox-parts">
          {i.parts.map((p, n) => (
            <li key={n}>
              <div className="kinbox-part-head">
                <strong>{p.menge} × {p.bauteil}</strong>
                {p.teilenummer && <code>{p.teilenummer}</code>}
              </div>
              <p className="kinbox-part-meta">{[p.anlagentyp, p.hersteller, p.baujahr && `Baujahr ${p.baujahr}`].filter(Boolean).join(" · ")}</p>
              {p.beschreibung && <p>{p.beschreibung}</p>}
              {p.files.length > 0 && (
                <ul className="kinbox-files">
                  {p.files.map((f) => (
                    <li key={f.name}>{/\.(pdf|dwg)$/i.test(f.name) ? <FileText size={14} /> : <Paperclip size={14} />} {f.name} <small>{fmtSize(f.size)}</small></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    />
  );
}
