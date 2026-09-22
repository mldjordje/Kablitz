"use client";

import { PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KablitzVideoLightbox } from "./kablitz-video-lightbox";

const VIDEO_ID = "EnQW7RSpgVQ";

/**
 * Cinematic YouTube background band. The iframe is muted + autoplay + loop with
 * controls hidden and oversized to crop any residual YT chrome; a transparent
 * guard sits on top so no clicks reach it (no play/stop button bleed). Loads
 * only once near the viewport. "Mit Ton ansehen" opens the shared lightbox.
 */
export function KablitzVideoBand() {
  const ref = useRef<HTMLElement>(null);
  const [load, setLoad] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    if (reduce) return; // keep static poster only
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="kablitz-videoband" ref={ref}>
      <div className="kablitz-videoband-bg" aria-hidden="true">
        {load && (
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`}
            title="Kablitz Anlage in Betrieb"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
          />
        )}
        <div className="kablitz-videoband-guard" />
      </div>
      <div className="kablitz-videoband-scrim" aria-hidden="true" />
      <div className="kablitz-videoband-copy">
        <p className="kablitz-eyebrow">Referenzanlage</p>
        <h2>Eine Anlage in Betrieb.</h2>
        <button type="button" className="kablitz-videoband-btn" onClick={() => setLightbox(true)}>
          <PlayCircle size={18} /> Mit Ton ansehen
        </button>
      </div>
      {lightbox && <KablitzVideoLightbox onClose={() => setLightbox(false)} />}
    </section>
  );
}
