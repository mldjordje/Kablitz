"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

type Item = { label: string; href: string };

/** Narrow-screen navigation: a full-screen red sheet whose links rise in one after another. */
export function KablitzMenu({ items, phoneHref, phone }: { items: Item[]; phoneHref?: string; phone?: string }) {
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .set(sheetRef.current, { visibility: "visible" })
      .fromTo(sheetRef.current, { clipPath: "circle(0% at calc(100% - 40px) 40px)" }, { clipPath: "circle(150% at calc(100% - 40px) 40px)", duration: 0.9, ease: "expo.inOut" })
      .fromTo(".kmenu-link", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.35)
      .fromTo(".kmenu-foot > *", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, 0.6);
  }, { scope: sheetRef });

  useEffect(() => {
    if (open) tl.current?.timeScale(1).play();
    else tl.current?.timeScale(1.6).reverse();
    document.documentElement.classList.toggle("kmenu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className="kmenu-toggle" data-open={open} aria-expanded={open} aria-controls="kmenu" aria-label={open ? "Menü schließen" : "Menü öffnen"} onClick={() => setOpen((o) => !o)}>
        <i /><i />
      </button>
      <div className="kmenu" id="kmenu" ref={sheetRef} aria-hidden={!open}>
        <nav aria-label="Mobile Navigation">
          {items.map((item, i) => (
            <span className="kmenu-mask" key={item.href}>
              <Link className="kmenu-link" href={item.href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                <small>0{i + 1}</small>{item.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="kmenu-foot">
          {phoneHref && <a href={phoneHref} tabIndex={open ? 0 : -1}><Phone size={16} /> {phone}</a>}
          <Link href="/admin" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>Admin-Vorschau <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </>
  );
}
