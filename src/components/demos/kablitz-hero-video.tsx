"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "EnQW7RSpgVQ";
const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

/**
 * Muted looping YouTube background for the hero. It mounts after hydration and fades in once
 * playback has had time to start, so the poster image underneath covers YouTube's loading chrome.
 * Playback pauses while the player is off screen or the tab is hidden, so an unseen video never
 * keeps decoding. Uses youtube-nocookie.com; production should self-host the MP4.
 */
export function KablitzHeroVideo() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!mounted || !iframe) return;
    let visible = true;
    let playing = true;
    const command = (func: "playVideo" | "pauseVideo") =>
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), PLAYER_ORIGIN);
    const sync = () => {
      const shouldPlay = visible && !document.hidden;
      if (shouldPlay === playing) return;
      playing = shouldPlay;
      command(shouldPlay ? "playVideo" : "pauseVideo");
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(iframe.parentElement ?? iframe);
    document.addEventListener("visibilitychange", sync);
    // The player ignores commands until it has loaded; re-apply the current state once it has.
    let settle = 0;
    const onLoad = () => { settle = window.setTimeout(() => { playing = true; sync(); }, 1200); };
    iframe.addEventListener("load", onLoad);
    return () => {
      window.clearTimeout(settle);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      iframe.removeEventListener("load", onLoad);
    };
  }, [mounted]);

  if (!mounted) return null;
  return (
    <div className="kablitz-hero-video" data-ready={ready} aria-hidden="true">
      <iframe
        ref={frameRef}
        src={`${PLAYER_ORIGIN}/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
        title="Kablitz Anlage in Betrieb"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => window.setTimeout(() => setReady(true), 1800)}
      />
    </div>
  );
}
