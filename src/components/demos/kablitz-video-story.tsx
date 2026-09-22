"use client";

import { PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KablitzVideoLightbox } from "./kablitz-video-lightbox";
import { KablitzCombustionCanvas } from "./kablitz-combustion-canvas";

const STAGES = [
  { kicker: "01 — Brennstoff", title: "Biomasse kommt rein", description: "Holzreste und Festbrennstoffe gelangen auf den Kablitz-Rost." },
  { kicker: "02 — Feuerung", title: "Der Rost zündet", description: "Auf dem gekühlten Rost entzündet sich der Brennstoff gleichmäßig." },
  { kicker: "03 — Dampf", title: "Hitze wird Energie", description: "Die Verbrennungswärme erzeugt im Kessel Hochdruckdampf." },
  { kicker: "04 — Reinigung", title: "Sauber aus dem Kamin", description: "Das Rauchgas wird mehrstufig gereinigt — sauberes Abgas." },
];

function stageFromProgress(p: number) {
  return Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
}

export function KablitzProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduce) {
      progressRef.current = 1;
      setActive(STAGES.length - 1);
      setScrollPct(100);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progressRef.current = p;
      setActive(stageFromProgress(p));
      setScrollPct(Math.round(p * 100));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const stage = STAGES[active];

  return (
    <section className="kablitz-process" id="anlage" ref={sectionRef}>
      <div className="kablitz-process-sticky">
        <KablitzCombustionCanvas progressRef={progressRef} />
        <div className="kablitz-process-veil" aria-hidden="true" />

        {/* Top scroll progress bar */}
        <div className="kablitz-process-bar" aria-hidden="true">
          <span style={{ width: `${scrollPct}%` }} />
        </div>

        {/* Stage rail (nodes fill as you pass) */}
        <ol className="kablitz-process-rail" aria-hidden="true">
          {STAGES.map((s, i) => (
            <li key={s.title} className={i <= active ? "is-passed" : ""} data-current={i === active}>
              <span className="kablitz-process-rail-dot" />
              <span className="kablitz-process-rail-label">{s.title}</span>
            </li>
          ))}
        </ol>

        {/* Foreground stage caption — crossfades per stage */}
        <div className="kablitz-process-stage">
          <p className="kablitz-process-eyebrow">Im Inneren der Anlage</p>
          <div className="kablitz-process-caption" key={active}>
            <span className="kablitz-process-kicker">{stage.kicker}</span>
            <h2>{stage.title}</h2>
            <p>{stage.description}</p>
          </div>
          <button type="button" className="kablitz-process-videolink" onClick={() => setLightbox(true)}>
            <PlayCircle size={18} /> Video mit Ton ansehen
          </button>
        </div>
      </div>

      {lightbox && <KablitzVideoLightbox onClose={() => setLightbox(false)} />}
    </section>
  );
}
