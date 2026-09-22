"use client";

import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ArrowDown, ArrowUpRight, Factory, Flame, Leaf, ShieldCheck, Thermometer, Wind, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { KablitzFire } from "./kablitz-fire";
import { scrollToY } from "./kablitz-smooth-scroll";

gsap.registerPlugin(SplitText, useGSAP);

/** Schematic image size; every overlay coordinate below is in these pixels. */
const W = 1800;
const H = 604;

type Zone = { x: number; y: number; w: number; h: number };
type Stage = {
  label: string; title: string; description: string; source: string;
  pin: [number, number]; zone: Zone;
  chips: Array<[LucideIcon, string]>;
  callouts: Array<[string, number, number, "left"?]>;
};

const STAGES: Stage[] = [
  { label: "Brennstoff", title: "Am Anfang steht der Brennstoff.", description: "Holzhackschnitzel, Rinde oder Reststoffe aus der Holzverarbeitung: Kablitz entwickelt Feuerungslösungen für unterschiedliche Festbrennstoffe, auch in Kombination.", source: "brennstoffe",
    pin: [285, 300], zone: { x: 0, y: 170, w: 360, h: 330 },
    chips: [[Leaf, "Biomasse"], [Leaf, "Agriwaste"], [Leaf, "RDF / SRF"]],
    callouts: [["Brennstofflager", 65, 205], ["Förderband", 200, 240], ["Aufgabe", 300, 310]] },
  { label: "Feuerung", title: "Das Herzstück: der Kablitz-Rost.", description: "Luft- und wassergekühlte Rostsysteme bilden die Grundlage der Feuerung. Die Auswahl richtet sich nach dem Brennstoff und den Anforderungen der Anlage.", source: "wassergekuehlte-roste",
    pin: [410, 455], zone: { x: 250, y: 300, w: 300, h: 290 },
    chips: [[Flame, "Luftgekühlt"], [Flame, "Wassergekühlt"]],
    callouts: [["Flamme", 395, 355], ["Rost", 455, 470], ["Luft", 485, 540]] },
  { label: "Energie", title: "Aus Wärme wird mehr.", description: "Der Kessel stellt Dampf für industrielle Prozesse bereit. Über eine Turbine lässt sich daraus Strom erzeugen. Kablitz kombiniert Feuerung und Kessel zu einem abgestimmten System.", source: "dampfkessel",
    pin: [440, 260], zone: { x: 320, y: 110, w: 540, h: 470 },
    chips: [[Zap, "Strom"], [Factory, "Prozessdampf"], [Thermometer, "Fernwärme"]],
    callouts: [["Dampftrommel", 372, 165], ["Kessel", 435, 300], ["Wärmetauscher", 665, 325]] },
  { label: "Rauchgas", title: "Bis zum letzten Anlagenteil.", description: "Zur Gesamtanlage gehört auch die Rauchgasbehandlung. Die Referenz Wiesbaden verbindet beispielsweise SNCR mit Verdampfungskühlung und Trockensorption.", source: "dampfkessel",
    pin: [1185, 300], zone: { x: 820, y: -130, w: 1060, h: 734 },
    chips: [[Wind, "SNCR"], [Wind, "Trockensorption"], [ShieldCheck, "Filter"]],
    callouts: [["Abscheider", 965, 245], ["Reaktor", 1185, 160], ["Filter", 1530, 250], ["Kamin", 1760, 40, "left"]] },
];

/** One segment of the process route per stage, drawn while that stage is on screen. */
const ROUTE = [
  "M 60 215 V 250 H 285 V 300 L 340 410",
  "M 340 410 L 410 445",
  "M 410 445 V 200 H 480 L 505 350 H 830",
  "M 830 378 H 965 V 195 H 1150 V 470 L 1215 440 V 190 H 1350 L 1400 240 H 1450 L 1530 290 V 330 H 1610 V 520 H 1745 L 1770 500 V 10",
];
const FUEL = "M 60 215 V 250 H 285 V 300 L 305 340 L 340 410 L 400 448";
const GAS_DIRTY = "M 830 378 H 965 V 195 H 1150";
const GAS_MID = "M 1150 195 V 470 L 1215 440 V 190 H 1350 L 1400 240 H 1450";
const GAS_CLEAN = "M 1450 240 L 1530 290 V 330 H 1610 V 520 H 1745 L 1770 500 V 10";
const EMBERS = [360, 380, 395, 410, 425, 440, 455, 470];

/** Camera transform that frames a zone inside the viewport, never showing past the drawing's edges. */
function frame(zone: Zone, vw: number, vh: number, base: number) {
  const k = base / W;
  const fit = Math.min(vw / (zone.w * k * 1.12), vh / (zone.h * k * 1.12));
  const scale = gsap.utils.clamp(1, 3, fit);
  const sw = W * k * scale;
  const sh = H * k * scale;
  // A zone may reach past the drawing (e.g. the plume above the stack); the camera may follow it there.
  const bleedR = Math.max(0, (zone.x + zone.w - W) * k * scale);
  const bleedT = Math.max(0, -zone.y * k * scale);
  const x = sw <= vw ? (vw - sw) / 2 : gsap.utils.clamp(vw - sw - bleedR, 0, vw / 2 - (zone.x + zone.w / 2) * k * scale);
  const y = sh <= vh ? (vh - sh) / 2 : gsap.utils.clamp(vh - sh, bleedT, vh / 2 - (zone.y + zone.h / 2) * k * scale);
  return { x, y, scale };
}

const pct = (x: number, y: number) => ({ "--at-x": `${(x / W) * 100}%`, "--at-y": `${(y / H) * 100}%` }) as CSSProperties;

export function KablitzProcessStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef<HTMLDivElement>(null);
  const captionsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frameId = 0;
    const update = () => {
      frameId = 0;
      const rect = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      progressRef.current = p;
      section.style.setProperty("--story-progress", String(p));
      STAGES.forEach((_, i) => section.style.setProperty(`--seg${i}`, String(gsap.utils.clamp(0, 1, (p * 4 - i) * 1.25))));
      setActive(Math.min(3, Math.floor(p * 4)));
    };
    const schedule = () => { if (!frameId) frameId = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive: true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  // Camera: glide to the active zone; re-frame instantly when the viewport changes size.
  useGSAP(() => {
    const view = windowRef.current;
    const drawing = drawingRef.current;
    if (!view || !drawing) return;
    const target = () => frame(STAGES[active].zone, view.clientWidth, view.clientHeight, drawing.offsetWidth);
    const syncZoom = () => drawing.style.setProperty("--cam-z", String(gsap.getProperty(drawing, "scale")));
    gsap.to(drawing, { ...target(), duration: 1.6, ease: "expo.inOut", overwrite: true, onUpdate: syncZoom });
    const onResize = () => { gsap.set(drawing, target()); syncZoom(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, { dependencies: [active], scope: sectionRef });

  // Headlines split once into masked words.
  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>(".kablitz-story-caption h2").forEach((h2) => SplitText.create(h2, { type: "words", mask: "words", wordsClass: "ksw" }));
  }, { scope: sectionRef });

  // Mini reveal each time a stage takes over: words rise, the rest follows.
  useGSAP(() => {
    const caption = captionsRef.current?.children[active];
    if (!caption) return;
    const tl = gsap.timeline();
    tl.fromTo(caption.querySelectorAll(".ksw"), { yPercent: 115 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.045 })
      .fromTo(caption.querySelectorAll(":scope > :not(h2)"), { autoAlpha: 0, y: 26, filter: "blur(6px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", stagger: 0.07, clearProps: "filter,transform" }, 0.15)
      .fromTo(".kablitz-story-chips > [data-active=true]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0.6);
  }, { dependencies: [active], scope: sectionRef });

  const goTo = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    scrollToY(top + (section.offsetHeight - window.innerHeight) * ((index + .18) / 4));
  };

  return (
    <section className="kablitz-process kablitz-story" id="anlage" ref={sectionRef} aria-label="Im Inneren der Anlage" data-stage={active}>
      <div className="kablitz-process-sticky">
        <KablitzFire progressRef={progressRef} variant="process" />
        <div className="kablitz-story-top"><span>Im Inneren der Anlage</span><a href="#leistungen">Weiter zu den Leistungen <ArrowDown size={15} /></a></div>
        <div className="kablitz-story-layout">
          <div className="kablitz-story-copy">
            <span className="kablitz-story-count" aria-hidden="true">0{active + 1}<small> / 04</small></span>
            <div className="kablitz-story-captions" ref={captionsRef}>
              {STAGES.map((stage, i) => <article key={stage.label} className="kablitz-story-caption" data-active={i === active} aria-hidden={i !== active}>
                <p className="kablitz-process-kicker">0{i + 1} — {stage.label}</p>
                <h2>{stage.title}</h2><p>{stage.description}</p>
                <a href={`https://www.kablitz.de/${stage.source}/`} tabIndex={i === active ? 0 : -1} target="_blank" rel="noreferrer">Technologie entdecken <ArrowUpRight size={16} /></a>
              </article>)}
            </div>
          </div>

          <div className="kablitz-story-visual">
            <div className="kablitz-story-window" ref={windowRef}>
              <div className="kablitz-story-drawing" ref={drawingRef}>
                <Image src="/leads/kablitz-gmbh-r4t9k2/05-55dc09bf6c12d770.webp" alt="Kablitz-Anlagenschema mit Brennstoffzuführung, Feuerung, Kessel und Rauchgasbehandlung" fill sizes="(max-width: 800px) 300vw, 150vw" />
                <ProcessScene />
                {STAGES.map((stage, i) => stage.callouts.map(([text, x, y, align], j) => (
                  <span key={text} className="kablitz-story-callout" data-for={i} data-align={align} style={{ ...pct(x, y), "--d": `${0.5 + j * 0.12}s` } as CSSProperties}>{text}</span>
                )))}
                {STAGES.map((stage, i) => <button key={stage.label} className="kablitz-story-pin" data-active={active === i} style={pct(...stage.pin)} onClick={() => goTo(i)} aria-label={`${stage.label} im Anlagenschema anzeigen`} aria-pressed={active === i}>0{i + 1}</button>)}
              </div>
              <div className="kablitz-story-chips">
                {STAGES.flatMap((stage, i) => stage.chips.map(([Icon, text]) => (
                  <span key={`${i}-${text}`} data-active={i === active}><Icon size={14} aria-hidden="true" />{text}</span>
                )))}
              </div>
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

/** Animated overlay in schematic coordinates: route, fuel, fire, steam and flue gas. */
function ProcessScene() {
  return (
    <svg className="kablitz-story-scene" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <defs>
        <radialGradient id="ks-flame" cx="50%" cy="80%" r="60%">
          <stop offset="0" stopColor="#fff2b0" /><stop offset=".35" stopColor="#ffab3d" /><stop offset=".7" stopColor="#ff4d12" stopOpacity=".7" /><stop offset="1" stopColor="#ff2a00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ks-heat" x1="0" x2="1">
          <stop offset="0" stopColor="#ff6a2a" stopOpacity="0" /><stop offset=".5" stopColor="#ff8a3a" stopOpacity=".75" /><stop offset="1" stopColor="#ff6a2a" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ks-hx"><rect x="500" y="340" width="330" height="190" /></clipPath>
        <filter id="ks-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* Route: faint track, then one coloured segment per stage drawn by scroll */}
      <path className="ks-track" d={ROUTE.join(" ")} />
      {ROUTE.map((d, i) => <path key={i} className={`ks-route ks-route-${i}`} d={d} pathLength={1} style={{ strokeDashoffset: `calc(1 - var(--seg${i}, 0))` }} />)}

      {/* 01 Fuel travels from the store along the belt into the feeder */}
      <g className="ks-layer" data-for="0">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} className="ks-chip" width="10" height="10" x="-5" y="-5" rx="2">
            <animateMotion dur="4.8s" begin={`${-i * 0.4}s`} repeatCount="indefinite" path={FUEL} rotate="auto" />
          </rect>
        ))}
      </g>

      {/* 02 Flame on the grate, rising embers, combustion air from below */}
      <g className="ks-layer" data-for="1">
        <ellipse className="ks-flame" cx="400" cy="400" rx="75" ry="95" fill="url(#ks-flame)" />
        <ellipse className="ks-flame ks-flame-b" cx="440" cy="420" rx="55" ry="70" fill="url(#ks-flame)" />
        {EMBERS.map((x, i) => (
          <circle key={x} className="ks-ember" r="3.5" filter="url(#ks-glow)">
            <animateMotion dur={`${2.2 + (i % 3) * 0.5}s`} begin={`${-i * 0.35}s`} repeatCount="indefinite" path={`M ${x} 450 C ${x + 20} 380 ${x - 25} 320 ${x + 10} 230`} />
            <animate attributeName="opacity" values="0;1;0" dur={`${2.2 + (i % 3) * 0.5}s`} begin={`${-i * 0.35}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {[363, 387, 413, 447, 478].map((x) => <path key={x} className="ks-air" d={`M ${x} 590 V 490`} />)}
      </g>

      {/* 03 Heat sweeps the exchanger, steam rises to the drum */}
      <g className="ks-layer" data-for="2">
        <g clipPath="url(#ks-hx)">
          <rect x="170" y="340" width="330" height="190" fill="url(#ks-heat)">
            <animateTransform attributeName="transform" type="translate" from="0 0" to="660 0" dur="2.6s" repeatCount="indefinite" />
          </rect>
        </g>
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} className="ks-steam" r={5 + (i % 3)} filter="url(#ks-glow)">
            <animateMotion dur="3.2s" begin={`${-i * 0.32}s`} repeatCount="indefinite" path={`M ${395 + (i % 5) * 22} 440 V 215 L 372 180`} />
            <animate attributeName="opacity" values="0;.9;.9;0" dur="3.2s" begin={`${-i * 0.32}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <circle className="ks-pulse" cx="372" cy="180" r="24" />
      </g>

      {/* 04 Flue gas changes from hot and dirty to clean on its way to the stack */}
      <g className="ks-layer" data-for="3">
        {([[GAS_DIRTY, "ks-gas-dirty", 3.2], [GAS_MID, "ks-gas-mid", 3.6], [GAS_CLEAN, "ks-gas-clean", 4]] as const).map(([path, cls, dur]) =>
          Array.from({ length: 9 }, (_, i) => (
            <circle key={cls + i} className={`ks-gas ${cls}`} r="6" filter="url(#ks-glow)">
              <animateMotion dur={`${dur}s`} begin={`${(-i * dur) / 9}s`} repeatCount="indefinite" path={path} />
            </circle>
          )),
        )}
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} className="ks-plume" cx="1770" cy="10">
            <animate attributeName="cy" values="10;-110" dur="3.5s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="8;42" dur="3.5s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values=".55;0" dur="3.5s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
    </svg>
  );
}
