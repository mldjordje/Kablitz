"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement motion layer for the demo sites.
 *
 * Renders nothing. On mount it wires up:
 *  - scroll reveal for every `[data-reveal]` element (adds `.is-visible`)
 *  - lightweight scroll parallax for `[data-parallax]` elements
 *  - a magnetic custom cursor on fine-pointer devices
 *
 * Everything is guarded for SSR/jsdom (no IntersectionObserver) and fully
 * disabled when the user prefers reduced motion, so the static markup keeps
 * working on its own.
 */
export function MotionLayer() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const cleanups: Array<() => void> = [];

    // --- Scroll reveal -----------------------------------------------------
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const showAll = () => revealTargets.forEach((el) => el.classList.add("is-visible"));

    if (reduceMotion || typeof IntersectionObserver === "undefined" || !revealTargets.length) {
      showAll();
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
      cleanups.push(() => revealObserver.disconnect());

      // Reveal anything already in the viewport right away so the hero never
      // waits on an observer callback.
      const viewportH = window.innerHeight;
      for (const el of revealTargets) {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportH * 0.92 && rect.bottom > 0) el.classList.add("is-visible");
      }

      // Failsafe: some embedded/headless renderers never fire IntersectionObserver.
      // If that happens, force everything visible so content can't get stuck hidden.
      const failsafe = window.setTimeout(showAll, 1800);
      cleanups.push(() => window.clearTimeout(failsafe));
    }

    // --- Header scroll state ----------------------------------------------
    const header = document.querySelector<HTMLElement>(".site-header");
    if (header) {
      let headerFrame = 0;
      const syncHeader = () => {
        headerFrame = 0;
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      };
      const onHeaderScroll = () => {
        if (!headerFrame) headerFrame = requestAnimationFrame(syncHeader);
      };
      syncHeader();
      window.addEventListener("scroll", onHeaderScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onHeaderScroll);
        if (headerFrame) cancelAnimationFrame(headerFrame);
      });
    }

    // --- Parallax ----------------------------------------------------------
    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!reduceMotion && parallaxTargets.length) {
      let frame = 0;
      const update = () => {
        frame = 0;
        const viewportH = window.innerHeight;
        for (const el of parallaxTargets) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > viewportH) continue;
          const speed = Number(el.dataset.parallax ?? "0.12");
          const offset = (rect.top + rect.height / 2 - viewportH / 2) * -speed;
          el.style.setProperty("--py", `${offset.toFixed(1)}px`);
        }
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame) cancelAnimationFrame(frame);
      });
    }

    // --- Magnetic custom cursor -------------------------------------------
    const finePointer = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
    if (!reduceMotion && finePointer) {
      const ring = document.createElement("div");
      ring.className = "motion-cursor";
      const dot = document.createElement("div");
      dot.className = "motion-cursor-dot";
      document.body.append(ring, dot);

      let ringX = window.innerWidth / 2;
      let ringY = window.innerHeight / 2;
      let mouseX = ringX;
      let mouseY = ringY;
      let raf = 0;

      const render = () => {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        raf = requestAnimationFrame(render);
      };
      const onMove = (event: MouseEvent) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        const interactive = (event.target as HTMLElement | null)?.closest(
          "a, button, summary, .service-card, [data-cursor]",
        );
        ring.classList.toggle("is-active", Boolean(interactive));
      };
      document.body.classList.add("has-motion-cursor");
      window.addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(render);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        ring.remove();
        dot.remove();
        document.body.classList.remove("has-motion-cursor");
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
