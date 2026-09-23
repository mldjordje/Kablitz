"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ChevronLeft, ChevronRight, Compass, Hand, Minus, Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLACES } from "@/data/kablitz-world";
import type { GlobeEngine } from "./kablitz-globe-engine";
import { CHAPTERS, FINALE, REFERENCE_ORDER } from "./kablitz-world-story";
import { lockScroll } from "./kablitz-smooth-scroll";
import "./kablitz-world.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
const NARROW = "(max-width: 900px)";
const KIND: Record<string, string> = { origin: "Gründung", hub: "Stammsitz", history: "Geschichte", reference: "Referenzanlage", region: "Region", port: "Tankerroute" };

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
  const [explore, setExplore] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // Explore mode freezes the page, so the wheel and pinch can zoom the globe without scrolling the story away.
  const toggleExplore = useCallback((on: boolean) => {
    setExplore(on);
    engineRef.current?.setExplore(on);
    lockScroll(on);
    if (!on) setSelected(null);
  }, []);
  const toggleRef = useRef(toggleExplore);
  useEffect(() => { toggleRef.current = toggleExplore; });

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selected) engineRef.current?.select(null);
      else toggleExplore(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore, selected, toggleExplore]);
  useEffect(() => () => lockScroll(false), []);

  // Chapter titles arrive with the camera: words rise out of masks, the kicker wipes in from the left.
  const splits = useRef<Map<Element, Element[]>>(new Map());
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const map = splits.current;
    const made = [...section.querySelectorAll(".kworld-chapter h2")].map((h) => {
      const split = SplitText.create(h, { type: "words", mask: "words" });
      map.set(h, split.words);
      return split;
    });
    return () => { made.forEach((m) => m.revert()); map.clear(); };
  }, []);
  useEffect(() => {
    const li = sectionRef.current?.querySelectorAll(".kworld-chapter")[state.chapter];
    if (!li) return;
    const words = splits.current.get(li.querySelector("h2")!) ?? [];
    const tl = gsap.timeline({ delay: 0.12 });
    tl.fromTo(li.querySelector(".kworld-kicker"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "expo.out" }, 0)
      .fromTo(words, { yPercent: 110, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.05, ease: "expo.out" }, 0.08)
      .fromTo(li.querySelectorAll("p"), { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, ease: "power2.out" }, 0.3);
    return () => { tl.kill(); };
  }, [state.chapter]);

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
        // Picking a place opens its card and switches to explore mode.
        onSelect: (id) => { setSelected(id); if (id) toggleRef.current(true); },
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
  const info = selected ? PLACE[selected] : undefined;
  const step = (dir: number) => {
    const i = PLACES.findIndex((p) => p.id === selected);
    engineRef.current?.select(PLACES[(i + dir + PLACES.length) % PLACES.length].id);
  };

  return (
    <section className="kworld" id="unternehmen" ref={sectionRef} aria-label="Von Riga in die Welt – Unternehmensgeschichte" data-free={free} data-finale={chapter === FINALE} data-explore={explore}>
      <div className="kworld-stage">
        <div className="kworld-globe" ref={hostRef} aria-hidden="true" />
        <div className="kworld-labels" ref={labelsRef} aria-hidden="true" />
        <div className="kworld-vignette" aria-hidden="true" />
        <div className="kworld-grain" aria-hidden="true" />

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

        <div className="kworld-finale" aria-hidden={!free || explore}>
          <p className="kworld-finale-title">Über 6.500 Anlagen. Fünf Kontinente.</p>
          <p className="kworld-hint"><Hand size={15} /> Ziehen zum Drehen · Orte antippen für Details</p>
          <button type="button" className="kworld-explore-btn" tabIndex={free && !explore ? 0 : -1} onClick={() => toggleExplore(true)}>
            <Compass size={16} /> Globus erkunden
          </button>
        </div>

        {/* Explore mode: zoom, reset, leave. */}
        <div className="kworld-controls" aria-hidden={!explore}>
          <p className="kworld-controls-hint">Ziehen · Mausrad oder Pinch zum Zoomen · Orte antippen</p>
          <div className="kworld-controls-row" role="group" aria-label="Globus steuern">
            <button type="button" tabIndex={explore ? 0 : -1} aria-label="Hineinzoomen" onClick={() => engineRef.current?.zoomBy(0.75)}><Plus size={17} /></button>
            <button type="button" tabIndex={explore ? 0 : -1} aria-label="Herauszoomen" onClick={() => engineRef.current?.zoomBy(1.33)}><Minus size={17} /></button>
            <button type="button" tabIndex={explore ? 0 : -1} aria-label="Ansicht zurücksetzen" onClick={() => engineRef.current?.resetView()}><RotateCcw size={16} /></button>
            <button type="button" tabIndex={explore ? 0 : -1} className="kworld-controls-close" onClick={() => toggleExplore(false)}><X size={16} /> Weiterscrollen</button>
          </div>
        </div>

        {/* Info card for the picked place. */}
        <aside className="kworld-info" data-open={!!info} aria-hidden={!info} aria-live="polite">
          {info && (
            <>
              <div className="kworld-info-head" data-kind={info.kind}>
                <span className="kworld-info-tag">{KIND[info.kind]}{info.year ? ` · ${info.year}` : ""}</span>
                <button type="button" className="kworld-info-close" aria-label="Schließen" onClick={() => engineRef.current?.select(null)}><X size={16} /></button>
              </div>
              <h3>{info.label}</h3>
              {info.country && <p className="kworld-info-country">{info.country}</p>}
              <dl>
                {info.kind === "reference" && info.detail && <><dt>Feuerungswärmeleistung</dt><dd>{info.detail}</dd></>}
                {info.fuel && <><dt>Brennstoff</dt><dd>{info.fuel}</dd></>}
                {info.kind === "reference" && info.year && <><dt>Inbetriebnahme</dt><dd>{info.year}</dd></>}
                {info.kind !== "reference" && info.detail && <><dt>Rolle</dt><dd>{info.detail}</dd></>}
              </dl>
              <p className="kworld-info-text">{info.info}</p>
              {info.kind === "reference" && <p className="kworld-info-note">Angaben laut Kablitz-Referenzbroschüre · Freigabe ausstehend</p>}
              <div className="kworld-info-nav">
                <button type="button" onClick={() => step(-1)} aria-label="Vorheriger Ort"><ChevronLeft size={16} /></button>
                <span>{PLACES.findIndex((p) => p.id === info.id) + 1} / {PLACES.length}</span>
                <button type="button" onClick={() => step(1)} aria-label="Nächster Ort"><ChevronRight size={16} /></button>
              </div>
            </>
          )}
        </aside>

        <p className="kworld-source">Quelle: kablitz.de · Referenzen laut Kablitz-Broschüre, Freigabe ausstehend · Erdtexturen: <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Solar System Scope</a> (CC BY 4.0)</p>
      </div>
    </section>
  );
}
