"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { KablitzHeroVideo } from "./kablitz-hero-video";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WORD = "KABLITZ";
/** The camera flies into this letter; a straight stem fills the screen soonest. */
const TARGET_CHAR = WORD.indexOf("I");

/**
 * Pinned fly-through: the plant footage shows only through the letters of KABLITZ, then scroll
 * pushes the camera through the "I" until the footage fills the screen and the caption lands.
 * The section is tall and its stage is CSS-sticky; one scrubbed timeline spans the whole height.
 */
export function KablitzReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVideo(true); obs.disconnect(); }
    }, { rootMargin: "50% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const word = section?.querySelector<SVGTextElement>(".kreveal-word");
    const probe = section?.querySelector<SVGTextElement>(".kreveal-probe");
    if (!section || !word || !probe) return;

    // Centre of the target letter, measured on a visible twin (text inside <mask> is not laid out).
    const origin = () => {
      const box = probe.getExtentOfChar(TARGET_CHAR);
      return `${box.x + box.width / 2} ${box.y + box.height * 0.55}`;
    };

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true },
    });
    tl.to(".kreveal-intro", { autoAlpha: 0, y: -60, duration: 0.12 }, 0.02)
      .fromTo(word, { scale: 1 }, { scale: 70, svgOrigin: origin, duration: 0.6, ease: "power3.in" }, 0.08)
      .fromTo(".kreveal-media", { scale: 1.35 }, { scale: 1, duration: 0.7, ease: "power2.out" }, 0)
      .to(".kreveal-cover", { autoAlpha: 0, duration: 0.06 }, 0.62)
      .fromTo(".kreveal-shade", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 }, 0.7)
      .fromTo(".kreveal-caption > *", { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.04, ease: "power2.out" }, 0.74)
      .to({}, { duration: 0.08 });
  }, { scope: sectionRef });

  return (
    <section className="kreveal" ref={sectionRef} aria-label="Kablitz in Betrieb">
      <div className="kreveal-stage">
        <div className="kreveal-media" aria-hidden="true">
          <Image src="/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp" alt="" fill sizes="100vw" />
          {video && <KablitzHeroVideo start={10} />}
        </div>
        <div className="kreveal-shade" aria-hidden="true" />

        <svg className="kreveal-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <mask id="kreveal-cut" maskUnits="userSpaceOnUse" x="-8000" y="-8000" width="17600" height="16900">
              <rect x="-8000" y="-8000" width="17600" height="16900" fill="#fff" />
              <text className="kreveal-word" x="800" y="560" textAnchor="middle" fill="#000">{WORD}</text>
            </mask>
          </defs>
          <rect className="kreveal-cover" x="-8000" y="-8000" width="17600" height="16900" mask="url(#kreveal-cut)" />
          <text className="kreveal-word kreveal-probe" x="800" y="560" textAnchor="middle">{WORD}</text>
        </svg>

        <div className="kreveal-intro">
          <p className="kablitz-eyebrow">Seit 1901 · Lauda-Königshofen</p>
          <p>Scrollen Sie in die Anlage</p>
        </div>

        <div className="kreveal-caption">
          <p className="kablitz-eyebrow">Referenzanlage in Betrieb</p>
          <h2>Aus Reststoffen wird Energie.</h2>
          <p>Feuerung, Kessel und Rauchgasbehandlung aus einer Hand — geplant, gefertigt und in Betrieb genommen von Kablitz.</p>
        </div>
      </div>
    </section>
  );
}
