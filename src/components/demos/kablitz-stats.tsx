"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { value: number; suffix?: string; label: string; isYear?: boolean };

const STATS: Stat[] = [
  { value: 1901, label: "Gegründet", isYear: true },
  { value: 70, suffix: "+", label: "Mitarbeiter" },
  { value: 5, label: "Kontinente" },
  { value: 9001, label: "ISO zertifiziert", isYear: true },
];

function CountUp({ stat, play }: { stat: Stat; play: boolean }) {
  const [value, setValue] = useState(stat.isYear ? stat.value : 0);
  useEffect(() => {
    if (!play || stat.isYear) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduce) {
      setValue(stat.value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(stat.value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, stat.isYear, stat.value]);

  const display = stat.isYear ? (stat.label.startsWith("ISO") ? "ISO 9001" : String(stat.value)) : `${value}${stat.suffix ?? ""}`;
  return (
    <div className="kablitz-stat">
      <strong>{display}</strong>
      <span>{stat.label.startsWith("ISO") ? "Qualitätsmanagement" : stat.label}</span>
    </div>
  );
}

export function KablitzStats() {
  const ref = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setPlay(true);
      return;
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPlay(true);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="kablitz-stats" ref={ref}>
      {STATS.map((stat) => (
        <CountUp key={stat.label} stat={stat} play={play} />
      ))}
    </section>
  );
}
