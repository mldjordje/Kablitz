"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PLACES } from "@/data/kablitz-world";
import type { GlobeEngine } from "./kablitz-globe-engine";
import { CHAPTERS, FINALE, REFERENCE_ORDER } from "./kablitz-world-story";
import "./kablitz-world.css";

gsap.registerPlugin(ScrollTrigger);

const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
const NARROW = "(max-width: 900px)";

/**
 * "Von Riga in die Welt": a tall section whose sticky stage holds the globe. Scroll progress
 * is handed to the engine, which films the company's journey city by city; at the end the
 * globe slides to the centre, the text leaves and the visitor can spin it freely.
 */
export function KablitzWorld() {
  const sectionRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const engineRef = useRef<GlobeEngine | null>(null);
  const progressRef = useRef(0);
  const [state, setState] = useState<{ chapter: number; focus?: string; free: boolean }>({ chapter: 0, free: false });

  // Scroll → progress. The engine may not exist yet; it picks up the latest value when it starts.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      progressRef.current = 1;
      return;
    }
    const st = ScrollTrigger.create({
      trigger: section, start: "top top", end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current = self.progress;
        engineRef.current?.setProgress(self.progress);
        if (railRef.current) railRef.current.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  // Build the globe (three.js is fetched here, only when the section comes near).
  useEffect(() => {
    const host = hostRef.current;
    const labelHost = labelsRef.current;
    if (!host || !labelHost) return;
    let disposed = false;
    const mq = window.matchMedia(NARROW);
    const onLayout = () => engineRef.current?.setLayout(mq.matches);
    mq.addEventListener("change", onLayout);

    // `?instant` starts at once and drops the extra camera inertia (automated screenshots, throttled frames).
    const instant = new URLSearchParams(window.location.search).has("instant");
    const start = async () => {
      const { createGlobeEngine } = await import("./kablitz-globe-engine");
      if (disposed) return;
      const engine = await createGlobeEngine(host, labelHost, {
        onState: (s) => setState(s),
        onFrame: (s) => { if (counterRef.current && s.counter !== undefined) counterRef.current.textContent = s.counter.toLocaleString("de-DE"); },
      }, {
        narrow: mq.matches, progress: progressRef.current, instant,
        // `?look=hex` shows the stylised hexagon globe instead of the photographic Earth.
        look: new URLSearchParams(window.location.search).get("look") === "hex" ? "hex" : "real",
      });
      if (disposed) engine.dispose();
      else engineRef.current = engine;
    };
    const near = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      near.disconnect();
      start();
    }, { rootMargin: "120% 0px" });
    if (instant) start();
    else near.observe(host);

    return () => {
      disposed = true;
      near.disconnect();
      mq.removeEventListener("change", onLayout);
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  const { chapter, focus, free } = state;
  const ref = focus && REFERENCE_ORDER.includes(focus) ? PLACE[focus] : undefined;

  return (
    <section className="kworld" id="unternehmen" ref={sectionRef} aria-label="Von Riga in die Welt – Unternehmensgeschichte" data-free={free} data-finale={chapter === FINALE}>
      <div className="kworld-stage">
        <div className="kworld-globe" ref={hostRef} aria-hidden="true" />
        <div className="kworld-labels" ref={labelsRef} aria-hidden="true" />
        <div className="kworld-vignette" aria-hidden="true" />

        <div className="kworld-copy">
          <p className="kablitz-eyebrow kworld-eyebrow">Unternehmen · Seit 1901</p>
          <ol className="kworld-chapters">
            {CHAPTERS.map((c, i) => (
              <li key={c.kicker} className="kworld-chapter" data-state={i === chapter ? "active" : i < chapter ? "past" : "next"} aria-current={i === chapter ? "step" : undefined}>
                <span className="kworld-kicker">{c.kicker}</span>
                <h2>{c.title}</h2>
                <p>{c.text}</p>
                {i === 7 && (
                  <p className="kworld-detail" aria-live="polite">
                    {ref ? <><b>{ref.label}</b> · {ref.country} · {ref.detail} · {ref.year}</> : " "}
                  </p>
                )}
                {i === 9 && (
                  <p className="kworld-counter"><span ref={counterRef}>0</span><em>+</em><small>Kablitz-Anlagen weltweit</small></p>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="kworld-rail" aria-hidden="true">
          <span className="kworld-rail-fill" ref={railRef} />
          {CHAPTERS.map((c, i) => <i key={c.kicker} data-on={i <= chapter || chapter === FINALE} />)}
        </div>

        <div className="kworld-finale" aria-hidden={!free}>
          <p className="kworld-finale-title">Über 6.500 Anlagen. Fünf Kontinente.</p>
          <p className="kworld-hint"><Hand size={15} /> Ziehen, um den Globus zu drehen</p>
        </div>

        <p className="kworld-source">Quelle: kablitz.de · Referenzen laut Kablitz-Broschüre, Freigabe ausstehend</p>
      </div>
    </section>
  );
}
