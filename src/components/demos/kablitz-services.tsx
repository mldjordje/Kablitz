"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

const BASE = "https://www.kablitz.de";
const IMG = "/leads/kablitz-gmbh-r4t9k2/services";

/** Service areas, captions and sub-pages as published on kablitz.de. */
const SERVICES = [
  { title: "Wärmetauscher", text: "Senken Sie Ihre Energiekosten durch Wärmerückgewinnung aus Abgasen.", image: "waermetauscher", alt: "Rippenplatten eines Kablitz-Wärmetauschers", href: "/waermetauscher/", subs: [["Rippenplatten WAT", "/rippenplatten-wat/"], ["Glasröhren WAT", "/glasroehren-wat/"]] },
  { title: "Feuerungen", text: "Wir bauen luft- und wassergekühlte Roste zur Verbrennung von Biomasse und Abfällen.", image: "feuerungen", alt: "Montage eines Kablitz-Rostes", href: "/feuerungen/", subs: [["Wassergekühlte Roste", "/wassergekuehlte-roste/"], ["Luftgekühlte Roste", "/luftgekuehlte-roste/"], ["Staubfeuerungen", "/staubfeuerungen/"]] },
  { title: "Energiezentralen", text: "Egal ob Dampfkessel, Thermalölanlage, Fernwärme, Stromerzeugung oder eine Kombination daraus, wir sind Ihr flexibler Partner.", image: "energiezentralen", alt: "Energiezentrale im Bau", href: "/energiezentralen/", subs: [["Heißgaserzeuger", "/heissgaserzeuger/"], ["Dampfkessel", "/dampfkessel/"], ["Thermalöl-Anlagen", "/thermaloel-anlagen/"], ["Heißwasser", "/heisswasser/"]] },
  { title: "Brennstoffe", text: "Wir haben die Lösung für die Verbrennung fast jeden nur denkbaren Festbrennstoff, Ihrer ist bestimmt auch dabei.", image: "brennstoffe", alt: "Holzhackschnitzel als Brennstoff", href: "/brennstoffe/", subs: [["Biomasse", "/biomasse/"], ["Agriwaste", "/agriwaste/"], ["RDF / SRF / Altholz", "/rdf-srf/"]] },
  { title: "Gießerei", text: "Wir gießen unsere Roststäbe und Rippenplatten selbst und liefern auch Gießereiprodukte für Fremdfabrikate.", image: "giesserei", alt: "Guss in der Kablitz-Gießerei", href: "/wir-giessen-selbst/", subs: [] },
  { title: "Service", text: "Wir kümmern uns um Ihre Anlage mit Tat und Rat. Testen Sie uns.", image: "service", alt: "Kablitz-Servicefahrzeug", href: "/service/", subs: [] },
] as const;

/**
 * Service explorer. Wide screens: the section pins and scrolling steps through the six areas.
 * Narrow screens: stacked cards. Names are buttons, so hover, click and keyboard also switch.
 */
export function KablitzServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onStep = (e: Event) => setActive((e as CustomEvent<number>).detail);
    section.addEventListener("kx-step", onStep);
    return () => section.removeEventListener("kx-step", onStep);
  }, []);

  /** Scroll to the middle of an area's step when the pin is active; otherwise just switch. */
  const select = (i: number) => {
    const st = ScrollTrigger.getById("kx");
    if (!st) return setActive(i);
    window.scrollTo({ top: st.start + (st.end - st.start) * ((i + 0.5) / SERVICES.length), behavior: "smooth" });
  };

  const current = SERVICES[active];

  return (
    <section className="kx" id="leistungen" ref={sectionRef} aria-label="Unsere Leistungen" data-steps={SERVICES.length}>
      <div className="kx-inner">
        <div className="kx-left">
          <p className="kablitz-eyebrow kx-eyebrow" data-fade="">Unsere Leistungen</p>
          <ol className="kx-list">
            {SERVICES.map((s, i) => (
              <li key={s.title}>
                <button type="button" className="kx-name" aria-current={active === i ? "true" : undefined} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => select(i)}>
                  <span className="kx-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="kx-title">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="kx-right" aria-live="polite">
          <div className="kx-frame">
            {SERVICES.map((s, i) => (
              <div key={s.image} className="kx-shot" data-active={active === i}>
                <Image src={`${IMG}/${s.image}.jpg`} alt={s.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
            ))}
            <span className="kx-frame-count">{String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}</span>
          </div>
          <div className="kx-detail" key={current.title}>
            <h3>{current.title}</h3>
            <p>{current.text}</p>
            {current.subs.length > 0 && (
              <ul className="kx-subs">
                {current.subs.map(([label, href]) => <li key={href}><a href={`${BASE}${href}`} target="_blank" rel="noreferrer">{label}</a></li>)}
              </ul>
            )}
            <a className="kx-more" href={`${BASE}${current.href}`} target="_blank" rel="noreferrer">Mehr dazu <ArrowUpRight size={16} /></a>
          </div>
        </div>
      </div>
      <div className="kx-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(active + 1) / SERVICES.length})` }} /></div>

      {/* Narrow screens: every area as its own card. */}
      <div className="kx-cards">
        {SERVICES.map((s, i) => (
          <article key={s.title} className="kx-card">
            <div className="kx-card-media" data-clip={String(i * 0.05)}><Image src={`${IMG}/${s.image}.jpg`} alt={s.alt} fill sizes="100vw" /></div>
            <span className="kx-num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            {s.subs.length > 0 && <ul className="kx-subs">{s.subs.map(([label, href]) => <li key={href}><a href={`${BASE}${href}`} target="_blank" rel="noreferrer">{label}</a></li>)}</ul>}
            <a className="kx-more" href={`${BASE}${s.href}`} target="_blank" rel="noreferrer">Mehr dazu <ArrowUpRight size={16} /></a>
          </article>
        ))}
      </div>
    </section>
  );
}
