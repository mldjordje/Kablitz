"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const SEEN_KEY = "kablitz-intro-seen";

/**
 * Opening curtain: logo and a 0–100 counter, then two panels lift away and the hero plays in.
 * Full sequence once per session; later loads just lift the curtain. Rendered on the server so
 * the hero never flashes before it; CSS hides it without scripting or if the timeline never runs.
 */
export function KablitzIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch { /* storage blocked */ }

    const count = root.querySelector<HTMLElement>(".kintro-count");
    const counter = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: "expo.inOut" } });

    if (!seen) {
      tl.from(".kintro-logo", { clipPath: "inset(0% 100% 0% 0%)", duration: 1.1 }, 0.1)
        .to(counter, { v: 100, duration: 1.5, ease: "power2.inOut", onUpdate: () => { if (count) count.textContent = String(Math.round(counter.v)).padStart(3, "0"); } }, 0)
        .from(".kintro-bar i", { scaleX: 0, duration: 1.5, ease: "power2.inOut" }, 0)
        .to(".kintro-content", { yPercent: -40, autoAlpha: 0, duration: 0.7, ease: "power3.in" }, 1.5);
    } else {
      tl.set(".kintro-content", { autoAlpha: 0 });
    }

    tl.to(".kintro-panel", { yPercent: -100, duration: seen ? 0.9 : 1.2, stagger: 0.09 }, seen ? 0 : 1.75)
      .call(() => document.documentElement.classList.add("kl-ready"), [], "<0.35")
      .from(".kablitz-hero-media", { scale: 1.3, duration: 2.2, ease: "expo.out" }, "<")
      .fromTo("[data-hero-fade]", { autoAlpha: 0, y: 40, filter: "blur(10px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out", stagger: 0.12, clearProps: "filter,transform" }, "<0.5")
      .set(root, { display: "none" });
  });

  return (
    <div className="kintro" ref={ref} aria-hidden="true">
      <div className="kintro-panel kintro-panel-back" />
      <div className="kintro-panel kintro-panel-front">
        <div className="kintro-content">
          <Image className="kintro-logo" src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="" width={260} height={80} priority unoptimized />
          <div className="kintro-meta">
            <span>Energie aus Biomasse · seit 1901</span>
            <span className="kintro-count">000</span>
          </div>
          <div className="kintro-bar"><i /></div>
        </div>
      </div>
    </div>
  );
}
