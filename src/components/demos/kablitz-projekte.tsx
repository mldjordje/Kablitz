"use client";

import { ArrowRight, Globe2, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { REFERENCE_SEED, displayCustomer, isPublic, loadReferences, placeLine, type Reference } from "@/lib/references-store";

/**
 * Public list of reference projects as short case studies (Problem → Lösung → Lieferumfang → Ergebnis).
 * Reads what the admin "Referenzprojekte" editor saved; internal projects never show here.
 */
export function KablitzProjekte() {
  const [list, setList] = useState<Reference[]>(REFERENCE_SEED);
  // Browser-only storage: read once on mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setList(loadReferences()), []);
  const shown = list.filter(isPublic);

  // Deep links from the globe (#ref-id) scroll once the stored projects are in.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) document.getElementById(id)?.scrollIntoView({ block: "start" });
  }, [list]);

  return (
    <div className="kprj">
      <section className="kkontakt-hero kprj-hero">
        <p className="kablitz-eyebrow">Referenzen</p>
        <h1>Unsere Projekte.</h1>
        <p>Anlagen, die wir geplant, gefertigt und in Betrieb genommen haben. Jede Referenz zeigt Ausgangslage, Lösung und Ergebnis.</p>
        <Link className="kablitz-btn kablitz-btn-ghost kprj-globe" href="/#unternehmen"><Globe2 size={16} /> Auf dem Globus ansehen</Link>
      </section>

      <div className="kprj-list">
        {shown.length === 0 && <p className="kprj-empty">Noch keine veröffentlichten Projekte.</p>}
        {shown.map((r, i) => {
          const customer = displayCustomer(r);
          return (
            <article className="kprj-case" id={r.id} key={r.id} data-flip={i % 2 === 1 || undefined}>
              <div className="kprj-media">
                <Image src={r.image} alt={r.title} fill sizes="(max-width: 900px) 100vw, 50vw" unoptimized />
                <span className="kprj-year">{r.year}</span>
              </div>
              <div className="kprj-body">
                <p className="kprj-meta"><MapPin size={14} /> {placeLine(r)}{customer && ` · ${customer}`}</p>
                <h2>{r.title}</h2>
                <div className="kprj-kpis">
                  {r.thermal && <div><strong>{r.thermal}</strong><span>MW thermisch</span></div>}
                  {r.electrical && <div><strong>{r.electrical}</strong><span>MW elektrisch</span></div>}
                  {r.fuelAmount && <div><strong>{Number(r.fuelAmount).toLocaleString("de-DE")}</strong><span>t Brennstoff / Jahr</span></div>}
                </div>
                <dl className="kprj-story">
                  <div><dt>Ausgangslage</dt><dd>{r.challenge}</dd></div>
                  <div><dt>Lösung</dt><dd>{r.solution}</dd></div>
                  <div><dt>Ergebnis</dt><dd>{r.result}</dd></div>
                </dl>
                <p className="kprj-tech">{r.fuel} · {r.technology}</p>
                {r.scope.length > 0 && (
                  <ul className="kprj-scope" aria-label="Lieferumfang">
                    {r.scope.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                )}
                <Link className="kablitz-btn kablitz-btn-primary kprj-cta" href="/#anfrage">Ähnliches Projekt besprechen <ArrowRight size={16} /></Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
