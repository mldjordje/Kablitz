"use client";

import { Check, FileUp, Package, Plus, Send, Trash2, X } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Field } from "./kablitz-inquiry";

/**
 * Spare-part inquiry for existing plants (Lastenheft ANF-SRV-03) with an inquiry basket (ANF-SRV-04):
 * visitors collect several parts, then send them together with one set of contact details.
 * Demo only — files are checked but not uploaded; the inquiry stays in this browser's localStorage.
 */

const PARTS = ["Roststab", "Gussteil", "Rostelement", "Verschleißteil", "Weitere Komponente"];
const PLANT_TYPES = ["Vorschubrost (luftgekühlt)", "Vorschubrost (wassergekühlt)", "Treppenrost", "Wanderrost", "Kesselanlage", "Wärmetauscher", "Unbekannt"];
const ACCEPT = ".jpg,.jpeg,.png,.pdf,.dwg";
const MAX_BYTES = 20 * 1024 * 1024;
const STORAGE_KEY = "kablitz-inquiries";

type Part = { id: string; bauteil: string; anlagentyp: string; hersteller: string; baujahr: string; teilenummer: string; menge: string; beschreibung: string; files: { name: string; size: number }[] };
type Contact = { vorname: string; nachname: string; email: string; firma: string; telefon: string };

const EMPTY_PART: Omit<Part, "id"> = { bauteil: "", anlagentyp: "", hersteller: "Kablitz", baujahr: "", teilenummer: "", menge: "1", beschreibung: "", files: [] };
const EMPTY_CONTACT: Contact = { vorname: "", nachname: "", email: "", firma: "", telefon: "" };

const formatSize = (bytes: number) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export function KablitzSpareParts() {
  const [part, setPart] = useState(EMPTY_PART);
  const [basket, setBasket] = useState<Part[]>([]);
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [consent, setConsent] = useState(false);
  const [fileError, setFileError] = useState("");
  const [caseId, setCaseId] = useState<string | null>(null);

  const setP = (key: keyof Omit<Part, "id" | "files">) => (e: { target: { value: string } }) => setPart((p) => ({ ...p, [key]: e.target.value }));
  const setC = (key: keyof Contact) => (e: { target: { value: string } }) => setContact((c) => ({ ...c, [key]: e.target.value }));

  function addFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const ok = picked.filter((f) => /\.(jpe?g|png|pdf|dwg)$/i.test(f.name) && f.size <= MAX_BYTES);
    setFileError(ok.length < picked.length ? "Nur JPG, PNG, PDF oder DWG bis 20 MB pro Datei." : "");
    setPart((p) => ({ ...p, files: [...p.files, ...ok.map((f) => ({ name: f.name, size: f.size }))] }));
  }

  function addToBasket(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBasket((b) => [...b, { ...part, id: crypto.randomUUID() }]);
    setPart(EMPTY_PART);
    setFileError("");
  }

  function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = `ETA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      list.unshift({ id, date: new Date().toISOString(), type: "Ersatzteilanfrage", parts: basket, ...contact });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
    setCaseId(id);
  }

  function reset() {
    setBasket([]);
    setContact(EMPTY_CONTACT);
    setConsent(false);
    setCaseId(null);
  }

  return (
    <section className="kinq ksp" id="ersatzteile" aria-label="Ersatzteil anfragen">
      <div className="kinq-head">
        <p className="kablitz-eyebrow" data-fade="">Service & Ersatzteile</p>
        <h2 data-split="">Ersatzteil für Ihre Anlage anfragen.</h2>
        <p data-fade="0.2">
          Roststäbe, Gussteile und Verschleißteile, auch für Anlagen anderer Hersteller. Sammeln Sie mehrere Teile im
          Anfragekorb und senden Sie alles in einer Anfrage.
        </p>
        <ol className="kinq-steps" data-fade="0.3" aria-label="Fortschritt">
          <li data-active={basket.length === 0 && !caseId} data-done={basket.length > 0 || !!caseId}><span>01</span> Teile sammeln</li>
          <li data-active={basket.length > 0 && !caseId} data-done={!!caseId}><span>02</span> Anfrage senden</li>
        </ol>
      </div>

      {caseId ? (
        <div className="kinq-card kinq-done" role="status">
          <span className="kinq-done-icon"><Check size={26} /></span>
          <h3>Vielen Dank, {contact.vorname}.</h3>
          <p>Ihre Anfrage über {basket.length} {basket.length === 1 ? "Ersatzteil" : "Ersatzteile"} ist eingegangen. Unser Service meldet sich mit Verfügbarkeit und Lieferzeit.</p>
          <p className="kinq-case">Vorgangsnummer <strong>{caseId}</strong></p>
          <button type="button" className="kablitz-btn kablitz-btn-ghost kinq-ghost" onClick={reset}>Neue Anfrage</button>
          <small>Demo: Die Anfrage wird nur in diesem Browser gespeichert, Dateien werden nicht hochgeladen.</small>
        </div>
      ) : (
        <div className="ksp-body">
          <form className="kinq-card" onSubmit={addToBasket}>
            <div className="kinq-grid">
              <Field label="Bauteil" required>
                <select value={part.bauteil} onChange={setP("bauteil")} required>
                  <option value="" disabled>Bitte wählen</option>
                  {PARTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Anlagentyp" required>
                <select value={part.anlagentyp} onChange={setP("anlagentyp")} required>
                  <option value="" disabled>Bitte wählen</option>
                  {PLANT_TYPES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Hersteller" hint="der Anlage">
                <input type="text" value={part.hersteller} onChange={setP("hersteller")} />
              </Field>
              <Field label="Baujahr">
                <input type="number" min={1901} max={2100} inputMode="numeric" placeholder="z. B. 2008" value={part.baujahr} onChange={setP("baujahr")} />
              </Field>
              <Field label="Zeichnungs-/Teilenummer">
                <input type="text" placeholder="z. B. RS-4410-02" value={part.teilenummer} onChange={setP("teilenummer")} />
              </Field>
              <Field label="Menge" required>
                <input type="number" min={1} inputMode="numeric" value={part.menge} onChange={setP("menge")} required />
              </Field>
              <Field label="Beschreibung" wide>
                <textarea rows={3} placeholder="Was ist defekt? Einbauort, Maße, Besonderheiten …" value={part.beschreibung} onChange={setP("beschreibung")} />
              </Field>
              <Field label="Fotos / Zeichnungen" hint="JPG, PNG, PDF, DWG · bis 20 MB" wide group>
                <label className="ksp-drop">
                  <input type="file" multiple accept={ACCEPT} onChange={addFiles} />
                  <FileUp size={20} />
                  <span>Dateien auswählen</span>
                </label>
                {fileError && <p className="ksp-error" role="alert">{fileError}</p>}
                {part.files.length > 0 && (
                  <ul className="ksp-files">
                    {part.files.map((f, i) => (
                      <li key={f.name + i}>
                        <span>{f.name}</span> <small>{formatSize(f.size)}</small>
                        <button type="button" aria-label={`${f.name} entfernen`} onClick={() => setPart((p) => ({ ...p, files: p.files.filter((_, j) => j !== i) }))}><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </Field>
            </div>
            <div className="kinq-actions">
              <button type="submit" className="kablitz-btn kablitz-btn-ghost kinq-ghost"><Plus size={16} /> In den Anfragekorb</button>
            </div>
          </form>

          <form className="kinq-card ksp-basket" onSubmit={send}>
            <h3><Package size={18} /> Anfragekorb <span>{basket.length}</span></h3>
            {basket.length === 0 ? (
              <p className="ksp-empty">Noch keine Teile. Füllen Sie das Formular aus und legen Sie das Teil in den Korb.</p>
            ) : (
              <>
                <ul className="ksp-items">
                  {basket.map((p) => (
                    <li key={p.id}>
                      <div>
                        <strong>{p.menge} × {p.bauteil}</strong>
                        <small>{[p.anlagentyp, p.hersteller, p.baujahr, p.teilenummer].filter(Boolean).join(" · ")}</small>
                        {p.files.length > 0 && <small>{p.files.length} {p.files.length === 1 ? "Datei" : "Dateien"}</small>}
                      </div>
                      <button type="button" aria-label={`${p.bauteil} entfernen`} onClick={() => setBasket((b) => b.filter((x) => x.id !== p.id))}><Trash2 size={15} /></button>
                    </li>
                  ))}
                </ul>
                <div className="kinq-grid">
                  <Field label="Vorname" required>
                    <input type="text" autoComplete="given-name" value={contact.vorname} onChange={setC("vorname")} required />
                  </Field>
                  <Field label="Nachname" required>
                    <input type="text" autoComplete="family-name" value={contact.nachname} onChange={setC("nachname")} required />
                  </Field>
                  <Field label="E-Mail" required>
                    <input type="email" autoComplete="email" value={contact.email} onChange={setC("email")} required />
                  </Field>
                  <Field label="Firma" required>
                    <input type="text" autoComplete="organization" value={contact.firma} onChange={setC("firma")} required />
                  </Field>
                  <Field label="Telefon" wide>
                    <input type="tel" autoComplete="tel" value={contact.telefon} onChange={setC("telefon")} />
                  </Field>
                  <label className="kinq-consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                    <span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. *</span>
                  </label>
                </div>
                <div className="kinq-actions">
                  <button type="submit" className="kablitz-btn kablitz-btn-primary kinq-submit">
                    {basket.length === 1 ? "Ersatzteil" : `${basket.length} Ersatzteile`} anfragen <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </section>
  );
}
