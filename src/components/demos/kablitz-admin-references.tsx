"use client";

import { FilePlus2, MapPin, Pencil, RotateCcw, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { NEWS_IMAGES } from "@/lib/news-store";

/**
 * Completed reference projects as case studies (Lastenheft chapter 6): Problem → Lösung → Technologie →
 * Lieferumfang → Ergebnis, release status per project (ANF-REF-04) and coordinates for map/globe
 * (ANF-REF-05). Demo storage is this browser only; production writes to the CMS.
 */

const STORAGE_KEY = "kablitz-references";
const RELEASE = ["Öffentlich", "Anonymisiert", "Intern"] as const;
type Release = (typeof RELEASE)[number];
const FUELS = ["Holzhackschnitzel", "Altholz", "Agrarreste", "Ersatzbrennstoffe (RDF/SRF)", "Klärschlamm", "Mischbrennstoffe"];
const TECH = ["Vorschubrost (luftgekühlt)", "Vorschubrost (wassergekühlt)", "Treppenrost", "Wanderrost", "Heißgaserzeuger", "Kesselanlage"];
const SCOPE = ["Feuerungsanlage", "Rost", "Kessel", "Brennstoffzuführung", "Entaschung", "Rauchgasreinigung", "Steuerung", "Montage", "Inbetriebnahme"];

type Reference = {
  id: string; title: string; customer: string; country: string; city: string; lat: string; lng: string; year: string;
  fuel: string; technology: string; thermal: string; electrical: string; fuelAmount: string;
  challenge: string; solution: string; result: string; scope: string[]; image: string; release: Release;
};

const SEED: Reference[] = [
  { id: "ref-goch", title: "Biomasse-Kraftwerk Goch", customer: "Beispielkunde Energie GmbH", country: "Deutschland", city: "Goch", lat: "51.68", lng: "6.16", year: "2019", fuel: "Altholz", technology: "Vorschubrost (luftgekühlt)", thermal: "28", electrical: "7,2", fuelAmount: "100000", challenge: "Flexible Prozesswärme und Stromerzeugung aus stark schwankenden Altholzqualitäten.", solution: "Luftgekühlter Vorschubrost mit angepasster Luftstufung für wechselnde Heizwerte.", result: "Stabiler Betrieb über das gesamte Brennstoffband, Strom und Prozesswärme aus Reststoffen.", scope: ["Feuerungsanlage", "Rost", "Brennstoffzuführung", "Entaschung", "Steuerung", "Montage", "Inbetriebnahme"], image: NEWS_IMAGES[0].src, release: "Öffentlich" },
  { id: "ref-saegewerk", title: "Sägewerk Skandinavien", customer: "Europäischer Sägewerksbetrieb", country: "Schweden", city: "Nordschweden", lat: "63.83", lng: "20.26", year: "2022", fuel: "Holzhackschnitzel", technology: "Treppenrost", thermal: "12", electrical: "", fuelAmount: "40000", challenge: "Große Mengen feuchter Holzreststoffe sollten energetisch verwertet werden.", solution: "Treppenrost für Brennstofffeuchten bis 55 %, Wärme direkt für die Trockenkammern.", result: "Energiegewinnung aus bisher ungenutzten Reststoffen, Gaskessel stillgelegt.", scope: ["Feuerungsanlage", "Rost", "Kessel", "Montage", "Inbetriebnahme"], image: NEWS_IMAGES[3].src, release: "Anonymisiert" },
  { id: "ref-riga", title: "Fernwärme Riga – Retrofit", customer: "Rīgas Siltums (Beispiel)", country: "Lettland", city: "Riga", lat: "56.95", lng: "24.11", year: "2024", fuel: "Holzhackschnitzel", technology: "Vorschubrost (wassergekühlt)", thermal: "20", electrical: "", fuelAmount: "55000", challenge: "Bestehende Feuerung am Ende der Lebensdauer, Stillstand nur im Sommer möglich.", solution: "Austausch des Rostes gegen wassergekühltes System innerhalb von sechs Wochen.", result: "Höhere Verfügbarkeit, geringerer Verschleiß, Anlage termingerecht zurück im Netz.", scope: ["Rost", "Steuerung", "Montage", "Inbetriebnahme"], image: NEWS_IMAGES[4].src, release: "Intern" },
];

const blank = (): Reference => ({ id: `ref-${Date.now()}`, title: "", customer: "", country: "", city: "", lat: "", lng: "", year: String(new Date().getFullYear()), fuel: FUELS[0], technology: TECH[0], thermal: "", electrical: "", fuelAmount: "", challenge: "", solution: "", result: "", scope: [], image: NEWS_IMAGES[0].src, release: "Öffentlich" });

function load(): Reference[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : SEED; } catch { return SEED; }
}
function persist(list: Reference[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

export function AdminReferences() {
  const [list, setList] = useState<Reference[]>(SEED);
  const [draft, setDraft] = useState<Reference | null>(null);
  // Browser-only storage: read once on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setList(load()), []);
  const commit = (next: Reference[]) => { setList(next); persist(next); };

  if (draft) {
    return (
      <ReferenceEditor
        key={draft.id}
        initial={draft}
        isNew={!list.some((r) => r.id === draft.id)}
        onClose={() => setDraft(null)}
        onSave={(ref) => { commit(list.some((r) => r.id === ref.id) ? list.map((r) => (r.id === ref.id ? ref : r)) : [ref, ...list]); setDraft(null); }}
      />
    );
  }

  return (
    <>
      <div className="kablitz-news-intro">
        <div>
          <strong>Referenzprojekte</strong>
          <p>Abgeschlossene Anlagen als Fallstudie erfassen: Ausgangslage, Lösung, Lieferumfang, Ergebnis und Kennzahlen. Öffentliche Projekte erscheinen in der Projektübersicht und auf dem Globus.</p>
          <p className="kablitz-news-note">Anonymisierte Projekte zeigen weder Kundennamen noch den genauen Standort. In dieser Vorschau werden Projekte nur in diesem Browser gespeichert.</p>
        </div>
        <div className="kablitz-news-intro-actions">
          <button type="button" className="kablitz-news-btn is-primary" onClick={() => setDraft(blank())}><FilePlus2 size={16} /> Neues Projekt</button>
        </div>
      </div>

      <div className="kref-grid">
        {list.map((r) => (
          <article key={r.id} className="kref-card">
            <div className="kref-media">
              <Image src={r.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" unoptimized />
              <span className={`kref-release is-${r.release.toLowerCase()}`}>{r.release}</span>
            </div>
            <div className="kref-body">
              <p className="kref-meta"><MapPin size={13} /> {r.release === "Anonymisiert" ? r.country : `${r.city}, ${r.country}`} · {r.year}</p>
              <h3>{r.title || "Ohne Titel"}</h3>
              <div className="kref-kpis">
                {r.thermal && <span><strong>{r.thermal}</strong> MWth</span>}
                {r.electrical && <span><strong>{r.electrical}</strong> MWel</span>}
                {r.fuelAmount && <span><strong>{Number(r.fuelAmount).toLocaleString("de-DE")}</strong> t/a</span>}
              </div>
              <p className="kref-tags">{r.fuel} · {r.technology}</p>
              <div className="kablitz-news-row-actions">
                <button type="button" onClick={() => setDraft(r)}><Pencil size={15} /> Bearbeiten</button>
                <button type="button" className="is-danger" onClick={() => { if (window.confirm(`„${r.title}“ löschen?`)) commit(list.filter((x) => x.id !== r.id)); }}><Trash2 size={15} /> Löschen</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="kablitz-news-reset" onClick={() => { if (window.confirm("Alle Projekte auf die Beispieldaten zurücksetzen?")) commit(SEED); }}><RotateCcw size={14} /> Beispieldaten wiederherstellen</button>
    </>
  );
}

function ReferenceEditor({ initial, isNew, onClose, onSave }: { initial: Reference; isNew: boolean; onClose: () => void; onSave: (r: Reference) => void }) {
  const [ref, setRef] = useState(initial);
  const [error, setError] = useState("");
  const set = <K extends keyof Reference>(key: K, value: Reference[K]) => setRef((r) => ({ ...r, [key]: value }));
  const toggleScope = (item: string) => set("scope", ref.scope.includes(item) ? ref.scope.filter((s) => s !== item) : [...ref.scope, item]);

  const save = () => {
    if (!ref.title.trim()) return setError("Bitte einen Projekttitel eingeben.");
    if (!ref.country.trim()) return setError("Bitte das Land angeben.");
    if (!ref.challenge.trim() || !ref.solution.trim() || !ref.result.trim()) return setError("Bitte Ausgangssituation, Lösung und Ergebnis ausfüllen.");
    onSave(ref);
  };

  return (
    <div className="kablitz-news-editor">
      <div className="kablitz-news-editor-head">
        <h2>{isNew ? "Neues Referenzprojekt" : "Referenzprojekt bearbeiten"}</h2>
        <button type="button" className="kablitz-news-btn" onClick={onClose}><X size={15} /> Abbrechen</button>
      </div>

      <div className="kablitz-news-grid">
        <div className="kablitz-news-fields">
          <label>Projekttitel<input value={ref.title} onChange={(e) => set("title", e.target.value)} placeholder="z. B. Biomasse-Kraftwerk Goch" /></label>
          <div className="kablitz-news-row2 kref-cols">
            <label>Kunde<input value={ref.customer} onChange={(e) => set("customer", e.target.value)} placeholder="Wird bei „Anonymisiert“ ausgeblendet" /></label>
            <label>Inbetriebnahme<input type="number" min={1901} max={2100} value={ref.year} onChange={(e) => set("year", e.target.value)} /></label>
          </div>
          <div className="kablitz-news-row2 kref-cols">
            <label>Brennstoff<select value={ref.fuel} onChange={(e) => set("fuel", e.target.value)}>{FUELS.map((f) => <option key={f}>{f}</option>)}</select></label>
            <label>Technologie<select value={ref.technology} onChange={(e) => set("technology", e.target.value)}>{TECH.map((f) => <option key={f}>{f}</option>)}</select></label>
          </div>

          <fieldset className="kref-fieldset">
            <legend>Kennzahlen</legend>
            <div className="kablitz-news-row2 kref-cols">
              <label>Leistung thermisch <small>MW</small><input inputMode="decimal" value={ref.thermal} onChange={(e) => set("thermal", e.target.value)} placeholder="28" /></label>
              <label>Leistung elektrisch <small>MW</small><input inputMode="decimal" value={ref.electrical} onChange={(e) => set("electrical", e.target.value)} placeholder="optional" /></label>
              <label>Brennstoff <small>t/Jahr</small><input inputMode="numeric" value={ref.fuelAmount} onChange={(e) => set("fuelAmount", e.target.value)} placeholder="100000" /></label>
            </div>
          </fieldset>

          <label>Ausgangssituation<textarea rows={3} value={ref.challenge} onChange={(e) => set("challenge", e.target.value)} placeholder="Vor welcher Herausforderung stand der Kunde?" /></label>
          <label>Kablitz-Lösung<textarea rows={3} value={ref.solution} onChange={(e) => set("solution", e.target.value)} placeholder="Welche Technologie und warum?" /></label>
          <label>Ergebnis<textarea rows={3} value={ref.result} onChange={(e) => set("result", e.target.value)} placeholder="Nutzen für den Betreiber" /></label>

          <fieldset className="kref-fieldset">
            <legend>Liefer- und Leistungsumfang</legend>
            <div className="kref-scope">
              {SCOPE.map((s) => (
                <button key={s} type="button" aria-pressed={ref.scope.includes(s)} onClick={() => toggleScope(s)}>{s}</button>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="kablitz-news-side">
          <fieldset>
            <legend>Freigabe</legend>
            <div className="kref-release-pick">
              {RELEASE.map((r) => (
                <button key={r} type="button" aria-pressed={ref.release === r} onClick={() => set("release", r)}>{r}</button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Standort</legend>
            <label>Land<input value={ref.country} onChange={(e) => set("country", e.target.value)} placeholder="Deutschland" /></label>
            <label>Ort<input value={ref.city} onChange={(e) => set("city", e.target.value)} placeholder="Goch" /></label>
            <div className="kablitz-news-row2 kref-cols">
              <label>Breitengrad<input inputMode="decimal" value={ref.lat} onChange={(e) => set("lat", e.target.value)} placeholder="51.68" /></label>
              <label>Längengrad<input inputMode="decimal" value={ref.lng} onChange={(e) => set("lng", e.target.value)} placeholder="6.16" /></label>
            </div>
            <p className="kref-hint">Mit Koordinaten erscheint das Projekt automatisch auf Karte und Globus.</p>
          </fieldset>

          <fieldset>
            <legend>Titelbild</legend>
            <div className="kablitz-news-images">
              {NEWS_IMAGES.map((img) => (
                <button key={img.src} type="button" aria-pressed={ref.image === img.src} onClick={() => set("image", img.src)} title={img.label}>
                  <Image src={img.src} alt={img.label} fill sizes="90px" unoptimized />
                </button>
              ))}
            </div>
          </fieldset>
        </aside>
      </div>

      {error && <p className="kablitz-news-error" role="alert">{error}</p>}
      <div className="kablitz-news-editor-actions">
        <button type="button" className="kablitz-news-btn is-primary" onClick={save}><Save size={15} /> Projekt speichern</button>
      </div>
    </div>
  );
}
