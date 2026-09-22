"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/**
 * Scroll-triggered motion for the Kablitz landing page. Markup opts in with data attributes;
 * every entrance plays once, when its element enters the viewport.
 *
 *  data-split        heading lines rise out of a mask
 *  data-fade="0.2"   fade/blur up, optional delay in seconds
 *  data-stagger      direct children enter one after another
 *  data-clip         image wipes open, inner <img> settles from a zoom
 *  data-line         rule draws from the left
 *  data-scrub-words  words light up while scrolling through
 *  data-chars        large wordmark, characters rise one by one
 */
export function KablitzMotion() {
  useGSAP(() => {
    const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);
    const once = (trigger: Element, start = "top 86%") => ({ trigger, start, once: true });

    all("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(self.lines, { yPercent: 115, rotate: 2.5, transformOrigin: "0 0", duration: 1.15, ease: "expo.out", stagger: 0.1, delay: Number(el.dataset.split) || 0, scrollTrigger: once(el) });
        },
      });
    });

    all("[data-chars]").forEach((el) => {
      SplitText.create(el, {
        type: "chars", mask: "chars", autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(self.chars, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.045, scrollTrigger: once(el, "top 95%") });
        },
      });
    });

    all("[data-fade]").forEach((el) => {
      gsap.from(el, { autoAlpha: 0, y: 42, filter: "blur(10px)", duration: 1.1, ease: "power3.out", delay: Number(el.dataset.fade) || 0, clearProps: "filter,transform", scrollTrigger: once(el, "top 92%") });
    });

    all("[data-stagger]").forEach((el) => {
      gsap.from(el.children, { autoAlpha: 0, y: 70, rotateX: -14, transformPerspective: 900, transformOrigin: "50% 0%", duration: 1.15, ease: "expo.out", stagger: 0.11, clearProps: "transform", scrollTrigger: once(el, "top 84%") });
    });

    all("[data-clip]").forEach((el) => {
      const img = el.querySelector("img");
      gsap.set(el, { autoAlpha: 1 });
      const tl = gsap.timeline({ delay: Number(el.dataset.clip) || 0, scrollTrigger: once(el, "top 92%") });
      tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" });
      if (img) tl.from(img, { scale: 1.4, duration: 1.8, ease: "expo.out", clearProps: "transform" }, "<0.15");
    });

    all("[data-line]").forEach((el) => {
      gsap.from(el, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.5, ease: "expo.inOut", scrollTrigger: once(el, "top 90%") });
    });

    all("[data-scrub-words]").forEach((el) => {
      SplitText.create(el, {
        type: "words", autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(self.words, { opacity: 0.14 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true } });
        },
      });
    });

    // Foundry band: photo pushes in and drifts while the band crosses the viewport.
    all("[data-zoom]").forEach((el) => {
      gsap.fromTo(el, { scale: 1.3, yPercent: -6 }, { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Large decorative numerals drift against the scroll direction.
    all("[data-drift]").forEach((el) => {
      gsap.fromTo(el, { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // Service band opens from a rounded card to full bleed.
    all("[data-expand]").forEach((el) => {
      gsap.fromTo(el, { clipPath: "inset(0% 7% 0% 7% round 32px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 30%", scrub: true } });
    });

    // Gallery: vertical scroll drives a horizontal rail on wide screens.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      const section = document.querySelector<HTMLElement>(".kablitz-gallery");
      const track = section?.querySelector<HTMLElement>(".kablitz-gallery-track");
      const bar = section?.querySelector<HTMLElement>(".kablitz-gallery-progress i");
      if (!section || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      tl.to(track, { x: () => -distance(), ease: "none" }, 0);
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      track.querySelectorAll(".kablitz-gallery-media").forEach((media) => tl.fromTo(media, { xPercent: -7 }, { xPercent: 7, ease: "none" }, 0));
    });

    // Images and fonts change layout after mount; re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  });

  return null;
}
