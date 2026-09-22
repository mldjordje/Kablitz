"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { KablitzFire } from "./kablitz-fire";

const STAGES = [
  { label: "Brennstoff", title: "Am Anfang steht der Brennstoff.", description: "Holzhackschnitzel, Rinde oder Reststoffe aus der Holzverarbeitung: Kablitz entwickelt Feuerungslösungen für unterschiedliche Festbrennstoffe, auch in Kombination.", detail: "Biomasse · Agriwaste · RDF / SRF", source: "brennstoffe", x: 12, y: 50 },
  { label: "Feuerung", title: "Das Herzstück: der Kablitz-Rost.", description: "Luft- und wassergekühlte Rostsysteme bilden die Grundlage der Feuerung. Die Auswahl richtet sich nach dem Brennstoff und den Anforderungen der Anlage.", detail: "Rostsysteme aus eigener Fertigung", source: "wassergekuehlte-roste", x: 24, y: 66 },
  { label: "Energie", title: "Aus Wärme wird mehr.", description: "Der Kessel stellt Dampf für industrielle Prozesse bereit. Über eine Turbine lässt sich daraus Strom erzeugen. Kablitz kombiniert Feuerung und Kessel zu einem abgestimmten System.", detail: "Prozessdampf · Strom · Fernwärme", source: "dampfkessel", x: 38, y: 55 },
  { label: "Rauchgas", title: "Bis zum letzten Anlagenteil.", description: "Zur Gesamtanlage gehört auch die Rauchgasbehandlung. Die Referenz Wiesbaden verbindet beispielsweise SNCR mit Verdampfungskühlung und Trockensorption.", detail: "Auf den jeweiligen Einsatz abgestimmt", source: "dampfkessel", x: 73, y: 45 },
];

export function KablitzProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      progressRef.current = p;
      section.style.setProperty("--story-progress", String(p));
      setActive(Math.min(3, Math.floor(p * 4)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    window.scrollTo({ top: top + (section.offsetHeight - window.innerHeight) * ((index + .18) / 4), behavior: "smooth" });
  };

  return (
    <section className="kablitz-process kablitz-story" id="anlage" ref={sectionRef} aria-label="Im Inneren der Anlage" data-stage={active}>
      <div className="kablitz-process-sticky">
        <KablitzFire progressRef={progressRef} variant="process" />
        <div className="kablitz-story-top"><span>Im Inneren der Anlage</span><a href="#leistungen">Weiter zu den Leistungen <ArrowDown size={15} /></a></div>
        <div className="kablitz-story-layout">
          <div className="kablitz-story-copy">
            <span className="kablitz-story-count" aria-hidden="true">0{active + 1}<small> / 04</small></span>
            <div className="kablitz-story-captions">
              {STAGES.map((stage, i) => <article key={stage.label} className="kablitz-story-caption" data-active={i === active} aria-hidden={i !== active}>
                <p className="kablitz-process-kicker">0{i + 1} — {stage.label}</p>
                <h2>{stage.title}</h2><p>{stage.description}</p>
                <span className="kablitz-story-detail">{stage.detail}</span>
                <a href={`https://www.kablitz.de/${stage.source}/`} tabIndex={i === active ? 0 : -1} target="_blank" rel="noreferrer">Technologie entdecken <ArrowUpRight size={16} /></a>
              </article>)}
            </div>
          </div>
          <div className="kablitz-story-visual">
            <div className="kablitz-story-drawing">
              <Image src="/leads/kablitz-gmbh-r4t9k2/05-55dc09bf6c12d770.webp" alt="Kablitz-Anlagenschema mit Brennstoffzuführung, Feuerung, Kessel und Rauchgasbehandlung" fill sizes="(max-width: 800px) 100vw, 65vw" />
              <svg className="kablitz-story-flow" viewBox="0 0 1000 336" aria-hidden="true">
                <path className="kablitz-story-flow-track" d="M 35 165 H 120 L 240 220 L 380 185 H 550 L 730 150 H 920 V 45" />
                <path className="kablitz-story-flow-energy" pathLength="1" d="M 35 165 H 120 L 240 220 L 380 185 H 550 L 730 150 H 920 V 45" />
              </svg>
              {STAGES.map((stage, i) => <button key={stage.label} className="kablitz-story-pin" data-active={active === i} style={{ "--pin-x": `${stage.x}%`, "--pin-y": `${stage.y}%` } as CSSProperties} onClick={() => goTo(i)} aria-label={`${stage.label} im Anlagenschema anzeigen`} aria-pressed={active === i}>0{i + 1}</button>)}
            </div>
            <div className="kablitz-story-image-note"><span>Systemübersicht</span><span>Feuerung · Kessel · Rauchgasbehandlung</span></div>
          </div>
        </div>
        <nav className="kablitz-story-nav" aria-label="Phasen der Anlage">
          {STAGES.map((stage, i) => <button key={stage.label} onClick={() => goTo(i)} aria-current={active === i ? "step" : undefined}><span>0{i + 1}</span>{stage.label}<i aria-hidden="true" /></button>)}
        </nav>
        <div className="kablitz-story-progress" aria-hidden="true" />
      </div>
    </section>
  );
}
