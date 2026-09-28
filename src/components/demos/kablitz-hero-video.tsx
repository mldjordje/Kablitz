"use client";

import { useEffect, useRef, useState } from "react";

const SRC_WIDE = "/video/kablitz-anlage-720.mp4";
const SRC_NARROW = "/video/kablitz-anlage-480.mp4";

/**
 * Muted looping background clip, self-hosted (52 s aerial fly-over trimmed from the plant animation,
 * no audio track). It fades in once the first frame is decoded, so the poster image underneath
 * covers loading. Playback pauses while the clip is off screen or the tab is hidden, so an unseen
 * video never keeps decoding. Narrow screens get the lighter 480p file.
 */
export function KablitzHeroVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSrc(window.matchMedia("(max-width: 820px)").matches ? SRC_NARROW : SRC_WIDE));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!src || !video) return;
    let visible = false;
    const sync = () => {
      if (visible && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(video.parentElement ?? video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
      // Drop the media buffers right away instead of waiting for GC.
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  if (!src) return null;
  return (
    <div className="kablitz-hero-video" data-ready={ready} aria-hidden="true">
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        tabIndex={-1}
        onLoadedData={() => setReady(true)}
      />
    </div>
  );
}
