"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_ID = "EnQW7RSpgVQ";
const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

/**
 * Muted looping YouTube background. It mounts after hydration and fades in once
 * playback has had time to start, so the poster image underneath covers YouTube's loading chrome.
 * Playback pauses while the player is off screen or the tab is hidden, so an unseen video never
 * keeps decoding. `start` skips an intro: playback begins there and every loop jumps back to it
 * instead of to 0. Uses youtube-nocookie.com; production should self-host a trimmed MP4.
 */
export function KablitzHeroVideo({ start = 0 }: { start?: number }) {
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
    const command = (func: "playVideo" | "pauseVideo" | "seekTo", args: unknown[] = []) =>
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), PLAYER_ORIGIN);
    const sync = () => {
      const shouldPlay = visible && !document.hidden;
      if (shouldPlay === playing) return;
      playing = shouldPlay;
      command(shouldPlay ? "playVideo" : "pauseVideo");
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(iframe.parentElement ?? iframe);
    document.addEventListener("visibilitychange", sync);
    // Loop by hand from `start`: when the clip ends (or restarts on its own), seek back past the intro.
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PLAYER_ORIGIN || e.source !== iframe.contentWindow || typeof e.data !== "string") return;
      let data: { event?: string; info?: number | { playerState?: number; currentTime?: number } };
      try { data = JSON.parse(e.data); } catch { return; }
      const info = data.info;
      const ended = (data.event === "onStateChange" && info === 0) || (typeof info === "object" && info?.playerState === 0);
      const early = start > 0 && typeof info === "object" && typeof info?.currentTime === "number" && info.currentTime < start - 0.5;
      if (ended || early) {
        command("seekTo", [start, true]);
        if (playing) command("playVideo");
      }
    };
    window.addEventListener("message", onMessage);
    // The player ignores commands until it has loaded; re-apply the current state once it has,
    // and subscribe to its events.
    let settle = 0;
    const onLoad = () => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: VIDEO_ID }), PLAYER_ORIGIN);
      settle = window.setTimeout(() => { playing = true; sync(); }, 1200);
    };
    iframe.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(settle);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      iframe.removeEventListener("load", onLoad);
    };
  }, [mounted, start]);

  if (!mounted) return null;
  return (
    <div className="kablitz-hero-video" data-ready={ready} aria-hidden="true">
      <iframe
        ref={frameRef}
        src={`${PLAYER_ORIGIN}/embed/${VIDEO_ID}?autoplay=1&mute=1&start=${start}${start ? "" : `&loop=1&playlist=${VIDEO_ID}`}&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&enablejsapi=1`}
        title="Kablitz Anlage in Betrieb"
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => window.setTimeout(() => setReady(true), 1800)}
      />
    </div>
  );
}
