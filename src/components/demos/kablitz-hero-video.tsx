"use client";

import { useEffect, useState } from "react";

const VIDEO_ID = "EnQW7RSpgVQ";

/**
 * Muted looping YouTube background for the hero. It mounts after hydration and fades in once
 * playback has had time to start, so the poster image underneath covers YouTube's loading chrome.
 * Uses youtube-nocookie.com; production should self-host the MP4 (no third-party request).
 */
export function KablitzHeroVideo() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  if (!mounted) return null;
  return (
    <div className="kablitz-hero-video" data-ready={ready} aria-hidden="true">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`}
        title="Kablitz Anlage in Betrieb"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => window.setTimeout(() => setReady(true), 1800)}
      />
    </div>
  );
}
