"use client";

import { ArrowLeft, ArrowRight, Check, Send } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";

/**
 * Structured project inquiry (Lastenheft ANF-ANF-05): project data first, then contact details,
 * so sales and engineering need fewer follow-up questions. Demo only — submissions stay in this
 * browser's localStorage and are confirmed with a Vorgangsnummer; production posts to the inbox.
 */

const FUELS = ["Holzhackschnitzel", "Altholz", "Agrarreste (z. B. Stroh, Schalen)", "Ersatzbrennstoffe (RDF/SRF)", "Klärschlamm", "Sonstiges / noch offen"];
const ENERGY = ["Prozessdampf", "Heißwasser / Fernwärme", "Thermoöl", "Strom (KWK)", "Heißgas / Trocknung", "Noch offen"];
const TIMEFRAMES = ["So bald wie möglich", "In 6–12 Monaten", "In 1–2 Jahren", "Später / Machbarkeitsstudie"];

type Data = Record<
  "brennstoff" | "menge" | "feuchte" | "energieform" | "leistung" | "standort" | "zeitrahmen" | "vorname" | "nachname" | "email" | "firma" | "nachricht",
  string
>;

const EMPTY: Data = { brennstoff: "", menge: "", feuchte: "", energieform: "", leistung: "", standort: "", zeitrahmen: "", vorname: "", nachname: "", email: "", firma: "", nachricht: "" };
const STORAGE_KEY = "kablitz-inquiries";

export function KablitzInquiry() {
  const [step, setStep] = useState<0 | 1>(0);
  const [data, setData] = useState<Data>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [caseId, setCaseId] = useState<string | null>(null);

  const set = (key: keyof Data) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [key]: e.target.value }));

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 0) return setStep(1);
    const id = `ANF-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      list.unshift({ id, date: new Date().toISOString(), type: "Projektanfrage", ...data });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {}
    setCaseId(id);
  }

  function reset() {
    setData(EMPTY);
    setConsent(false);
    setStep(0);
    setCaseId(null);
  }

  return (
    <section className="kinq" id="anfrage" aria-label="Projekt anfragen">
      <div className="kinq-head">
        <p className="kablitz-eyebrow" data-fade="">Projekt anfragen</p>
        <h2 data-split="">Erzählen Sie uns von Ihrem Brennstoff.</h2>
        <p data-fade="0.2">
          Je genauer Ihre Angaben, desto schneller erhalten Sie eine belastbare Ersteinschätzung von unseren Ingenieuren.
          Felder ohne Sternchen können Sie offen lassen.
        </p>
        <ol className="kinq-steps" data-fade="0.3" aria-label="Fortschritt">
          <li data-active={step === 0 && !caseId} data-done={step > 0 || !!caseId}><span>01</span> Projekt</li>
          <li data-active={step === 1 && !caseId} data-done={!!caseId}><span>02</span> Kontakt</li>
        </ol>
      </div>

      {caseId ? (
        <div className="kinq-card kinq-done" role="status">
          <span className="kinq-done-icon"><Check size={26} /></span>
          <h3>Vielen Dank, {data.vorname}.</h3>
          <p>Ihre Anfrage ist eingegangen. Ein Ansprechpartner aus Vertrieb und Engineering meldet sich in Kürze bei Ihnen.</p>
          <p className="kinq-case">Vorgangsnummer <strong>{caseId}</strong></p>
          <button type="button" className="kablitz-btn kablitz-btn-ghost kinq-ghost" onClick={reset}>Neue Anfrage</button>
          <small>Demo: Die Anfrage wird nur in diesem Browser gespeichert und nicht versendet.</small>
        </div>
      ) : (
        <form className="kinq-card" onSubmit={next}>
          {step === 0 ? (
            <div className="kinq-grid" key="projekt">
              <Field label="Brennstoff" required>
                <select value={data.brennstoff} onChange={set("brennstoff")} required>
                  <option value="" disabled>Bitte wählen</option>
                  {FUELS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Brennstoffmenge" hint="Tonnen pro Jahr">
                <input type="number" min={0} inputMode="numeric" placeholder="z. B. 100000" value={data.menge} onChange={set("menge")} />
              </Field>
              <Field label="Feuchte" hint="% Wassergehalt">
                <input type="number" min={0} max={100} inputMode="numeric" placeholder="z. B. 45" value={data.feuchte} onChange={set("feuchte")} />
              </Field>
              <Field label="Gewünschte Energieform" required>
                <select value={data.energieform} onChange={set("energieform")} required>
                  <option value="" disabled>Bitte wählen</option>
                  {ENERGY.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label="Leistung" hint="MW thermisch / elektrisch">
                <input type="text" placeholder="z. B. 28 MWth" value={data.leistung} onChange={set("leistung")} />
              </Field>
              <Field label="Standort" hint="Land, Ort">
                <input type="text" placeholder="z. B. Goch, Deutschland" value={data.standort} onChange={set("standort")} />
              </Field>
              <Field label="Zeitrahmen" wide group>
                <div className="kinq-chips" role="radiogroup" aria-label="Zeitrahmen">
                  {TIMEFRAMES.map((t) => (
                    <label key={t} className="kinq-chip">
                      <input type="radio" name="zeitrahmen" value={t} checked={data.zeitrahmen === t} onChange={set("zeitrahmen")} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          ) : (
            <div className="kinq-grid" key="kontakt">
              <Field label="Vorname" required>
                <input type="text" autoComplete="given-name" value={data.vorname} onChange={set("vorname")} required autoFocus />
              </Field>
              <Field label="Nachname" required>
                <input type="text" autoComplete="family-name" value={data.nachname} onChange={set("nachname")} required />
              </Field>
              <Field label="E-Mail" required>
                <input type="email" autoComplete="email" value={data.email} onChange={set("email")} required />
              </Field>
              <Field label="Firma" required>
                <input type="text" autoComplete="organization" value={data.firma} onChange={set("firma")} required />
              </Field>
              <Field label="Nachricht" wide>
                <textarea rows={5} placeholder="Was sollen wir über Ihr Vorhaben wissen?" value={data.nachricht} onChange={set("nachricht")} />
              </Field>
              <label className="kinq-consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
                <span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. *</span>
              </label>
            </div>
          )}

          <div className="kinq-actions">
            {step === 1 && (
              <button type="button" className="kablitz-btn kablitz-btn-ghost kinq-ghost" onClick={() => setStep(0)}>
                <ArrowLeft size={16} /> Zurück
              </button>
            )}
            <button type="submit" className="kablitz-btn kablitz-btn-primary kinq-submit">
              {step === 0 ? <>Weiter zu Kontakt <ArrowRight size={16} /></> : <>Anfrage senden <Send size={16} /></>}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export function Field({ label, hint, required, wide, group, children }: { label: string; hint?: string; required?: boolean; wide?: boolean; group?: boolean; children: ReactNode }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="kinq-field" data-wide={wide || undefined}>
      <span className="kinq-label">
        {label}{required && " *"}
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </Tag>
  );
}
