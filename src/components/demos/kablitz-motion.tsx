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
    // Only rendered elements get a ScrollTrigger: triggers on display:none nodes (e.g. mobile-only
    // cards on desktop) measure as 0 and break ScrollTrigger's refresh. Those are simply shown.
    const all = (selector: string) => gsap.utils.toArray<HTMLElement>(selector).filter((el) => {
      if (el.getClientRects().length) return true;
      gsap.set(el.matches("[data-stagger]") ? [el, ...el.children] : el, { autoAlpha: 1 });
      return false;
    });
    const once = (trigger: Element, start = "top 86%") => ({ trigger, start, once: true });
    const cleanups: Array<() => void> = [];
    const listen = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn);
      cleanups.push(() => el.removeEventListener(type, fn));
    };

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

    // Page progress hairline under the header.
    const progress = document.querySelector(".kablitz-progress");
    if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    // Hero leaves as a card: it rounds and insets while its copy lifts away.
    const hero = document.querySelector<HTMLElement>(".kablitz-hero");
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { start: 0, end: () => hero.offsetTop + hero.offsetHeight, scrub: true, invalidateOnRefresh: true } });
      tl.fromTo(hero, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, { clipPath: "inset(0% 3% 7% 3% round 32px)" }, 0)
        .to(".kablitz-hero-copy", { yPercent: -28, autoAlpha: 0 }, 0)
        .to(".kablitz-hero-media", { yPercent: 14 }, 0);
    }

    // Type bands loop forever; scroll velocity speeds them up, sets their direction and skews them.
    const bands = gsap.utils.toArray<HTMLElement>("[data-marquee]").map((row) => {
      const dir = Number(row.dataset.marquee) || 1;
      const tween = gsap.fromTo(row.children, { xPercent: dir > 0 ? 0 : -100 }, { xPercent: dir > 0 ? -100 : 0, duration: 38, ease: "none", repeat: -1, paused: true });
      tween.totalTime(tween.duration() * 1000); // headroom so scrolling up can run it backwards
      return { row, dir, tween };
    });
    if (bands.length) {
      const skew = gsap.quickTo(bands.map((b) => b.row), "skewX", { duration: 0.5, ease: "power3" });
      let direction = 1;
      ScrollTrigger.create({
        trigger: ".kmarquee", start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (self.direction !== direction) direction = self.direction;
          const boost = 1 + Math.min(Math.abs(v) / 180, 7);
          bands.forEach(({ tween }) => gsap.to(tween, { timeScale: boost * direction, duration: 0.2, overwrite: true }));
          skew(gsap.utils.clamp(-12, 12, v / -160));
        },
        onToggle: (self) => bands.forEach(({ tween }) => (self.isActive ? tween.play() : tween.pause())),
      });
      // Ease back to cruising speed once scrolling stops.
      const settle = () => {
        bands.forEach(({ tween }) => gsap.to(tween, { timeScale: direction, duration: 1.2, ease: "power2.out", overwrite: true }));
        skew(0);
      };
      ScrollTrigger.addEventListener("scrollEnd", settle);
      cleanups.push(() => ScrollTrigger.removeEventListener("scrollEnd", settle));
    }

    // Footer content settles up from underneath as the page runs out.
    const footerInner = document.querySelector(".kablitz-footer-inner");
    if (footerInner) gsap.fromTo(footerInner, { yPercent: -45, autoAlpha: 0.2 }, { yPercent: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: ".kablitz-footer", start: "top bottom", end: "bottom bottom", scrub: true } });

    // Magnetic buttons and tilting cards (fine pointers only).
    if (window.matchMedia("(pointer: fine)").matches) {
      gsap.utils.toArray<HTMLElement>(".kablitz-btn, .kablitz-videoband-btn, .kmap-card a, .kx-more").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        listen(el, "mousemove", (e) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.35);
          y((e.clientY - r.top - r.height / 2) * 0.35);
        });
        listen(el, "mouseleave", () => { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true }); });
      });
      gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, "rotateX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(el, "rotateY", { duration: 0.6, ease: "power3" });
        listen(el, "mousemove", (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
          el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
          ry(((e.clientX - r.left) / r.width - 0.5) * 14);
          rx(((e.clientY - r.top) / r.height - 0.5) * -14);
        });
        listen(el, "mouseleave", () => { rx(0); ry(0); });
      });
    }

    // Services explorer pins on wide screens (narrow screens get stacked cards below).
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      // Pins are created in page order (services before gallery) so their spacing is measured correctly.
      const services = document.querySelector<HTMLElement>(".kx");
      if (services) {
        const steps = Number(services.dataset.steps) || 1;
        let current = -1;
        ScrollTrigger.create({
          id: "kx", trigger: services, start: "top top", end: () => `+=${window.innerHeight * 3.2}`, pin: true,
          onUpdate: (self) => {
            const index = Math.min(steps - 1, Math.floor(self.progress * steps));
            if (index !== current) { current = index; services.dispatchEvent(new CustomEvent("kx-step", { detail: index })); }
          },
        });
      }
    });

    // Gallery: vertical scroll drives a horizontal rail at every width.
    const gallery = document.querySelector<HTMLElement>(".kablitz-gallery");
    const galleryTrack = gallery?.querySelector<HTMLElement>(".kablitz-gallery-track");
    if (gallery && galleryTrack) {
      const bar = gallery.querySelector<HTMLElement>(".kablitz-gallery-progress i");
      const distance = () => Math.max(0, galleryTrack.scrollWidth - gallery.clientWidth);
      const tl = gsap.timeline({ scrollTrigger: { trigger: gallery, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      tl.to(galleryTrack, { x: () => -distance(), ease: "none" }, 0);
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      galleryTrack.querySelectorAll(".kablitz-gallery-media").forEach((media) => tl.fromTo(media, { xPercent: -7 }, { xPercent: 7, ease: "none" }, 0));
    }

    // Narrow screens: cards pile up — each sticks, the one beneath shrinks and dims as the next lands.
    mm.add("(max-width: 899px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-stack]").forEach((stack) => {
        const cards = Array.from(stack.children) as HTMLElement[];
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          gsap.fromTo(card, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 92%", once: true } });
          if (next) gsap.fromTo(card, { scale: 1, filter: "brightness(1)" }, { scale: 0.9, filter: "brightness(0.55)", ease: "none", immediateRender: false, scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true } });
        });
      });
    });
    mm.add("(min-width: 900px)", () => {
      const grid = document.querySelector("[data-stack].kablitz-cert-grid");
      if (grid) gsap.from(grid.children, { autoAlpha: 0, y: 70, rotateX: -14, transformPerspective: 900, transformOrigin: "50% 0%", duration: 1.15, ease: "expo.out", stagger: 0.11, clearProps: "transform", scrollTrigger: once(grid, "top 84%") });
    });

    // Images and fonts change layout after mount; re-measure once they settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener("load", refresh);
      cleanups.forEach((fn) => fn());
    };
  });

  return null;
}
