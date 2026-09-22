"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

const VIDEO_ID = "EnQW7RSpgVQ";
const VIDEO_START_SECONDS = 10;

/** Shared YouTube lightbox: loads the iframe only while open, locks scroll, Esc/backdrop/X to close. */
export function KablitzVideoLightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="kablitz-lightbox" role="dialog" aria-modal="true" aria-label="Anlagen-Video" onClick={onClose}>
      <button type="button" className="kablitz-lightbox-close" aria-label="Schließen" onClick={onClose}>
        <X size={22} />
      </button>
      <div className="kablitz-lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&start=${VIDEO_START_SECONDS}&rel=0&modestbranding=1`}
          title="Kablitz Dampfkessel mit Rauchgasreinigung"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
