"use client";

import { useEffect } from "react";

/**
 * Reading aids for /projekt: progress bar, active chapter in the table of contents and a gentle
 * fade-in for blocks as they enter the viewport. Content stays readable without JavaScript.
 */
export function KablitzProjektReader() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".kd-progress");
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar?.style.setProperty("transform", `scaleX(${max > 0 ? window.scrollY / max : 0})`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const links = new Map<string, HTMLElement>();
    document.querySelectorAll<HTMLElement>(".kd-toc a").forEach((a) => links.set(a.getAttribute("href")!.slice(1), a));
    const chapters = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a) => a.removeAttribute("aria-current"));
        links.get(entry.target.id)?.setAttribute("aria-current", "true");
      }
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".kd-doc section[id]").forEach((s) => chapters.observe(s));

    const blocks = document.querySelectorAll<HTMLElement>(".kd-reveal");
    document.documentElement.classList.add("kd-js");
    const reveal = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); reveal.unobserve(entry.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    blocks.forEach((b) => reveal.observe(b));

    return () => {
      window.removeEventListener("scroll", onScroll);
      chapters.disconnect();
      reveal.disconnect();
      document.documentElement.classList.remove("kd-js");
    };
  }, []);
  return null;
}
