"use client";

import { useSyncExternalStore } from "react";

/**
 * Demo news store. Posts live in this browser's localStorage so the admin editor and the public
 * /news pages can be shown end to end without a backend. Production replaces this with the CMS.
 */

export const NEWS_CATEGORIES = ["Unternehmen", "Projekte", "Technologie", "Service & Ersatzteile", "Nachhaltigkeit", "Karriere", "Messen"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];
export type NewsStatus = "Entwurf" | "Veröffentlicht";

export type NewsPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: NewsCategory;
  image: string;
  imageAlt: string;
  author: string;
  date: string;
  status: NewsStatus;
  seoTitle: string;
  seoDescription: string;
};

export const NEWS_IMAGES = [
  { src: "/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp", label: "Energieanlage" },
  { src: "/leads/kablitz-gmbh-r4t9k2/02-15a430557cea1328.webp", label: "Team vor Ort" },
  { src: "/leads/kablitz-gmbh-r4t9k2/03-5fecf13209d91579.webp", label: "Stellenangebote" },
  { src: "/leads/kablitz-gmbh-r4t9k2/04-16effbe9d8afa5c2.webp", label: "Rostmontage" },
  { src: "/leads/kablitz-gmbh-r4t9k2/08-be24f45f2de89987.webp", label: "Gussteil" },
  { src: "/leads/kablitz-gmbh-r4t9k2/11-734d5f4c6ca7f81f.webp", label: "Rippenplatte" },
];

const SEED: NewsPost[] = [
  {
    id: "seed-karriere",
    slug: "wir-stellen-ein",
    title: "Wir stellen ein",
    summary: "Aktuelle Stellenangebote bei Kablitz in Lauda-Königshofen finden Sie auf unserer Karriereseite.",
    body: "Beispielbeitrag für die Konzept-Vorschau.\n\nKablitz sucht regelmäßig Verstärkung in Fertigung, Konstruktion und Service. Die aktuellen Stellenangebote stehen auf der offiziellen Website.\n\nIm Redaktionsbereich lassen sich solche Beiträge ohne Programmierkenntnisse anlegen, bebildern und veröffentlichen.",
    category: "Karriere",
    image: "/leads/kablitz-gmbh-r4t9k2/03-5fecf13209d91579.webp",
    imageAlt: "Grafik mit dem Text: Wir stellen ein",
    author: "Redaktion Kablitz",
    date: "2026-09-15",
    status: "Veröffentlicht",
    seoTitle: "Wir stellen ein – Karriere bei Kablitz",
    seoDescription: "Stellenangebote bei der Richard Kablitz GmbH in Lauda-Königshofen.",
  },
  {
    id: "seed-giesserei",
    slug: "gussteile-aus-eigener-fertigung",
    title: "Gussteile aus eigener Fertigung",
    summary: "Roststäbe, Rippenplatten und weitere Gusskomponenten entstehen in der eigenen Gießerei in Lauda.",
    body: "Beispielbeitrag für die Konzept-Vorschau.\n\nKablitz fertigt Gusskomponenten für Wärmetauscher und Feuerungsanlagen. Der eigene Modellbau ermöglicht die Herstellung kundenspezifischer Bauteile.",
    category: "Unternehmen",
    image: "/leads/kablitz-gmbh-r4t9k2/08-be24f45f2de89987.webp",
    imageAlt: "Gussteil aus der Kablitz-Gießerei",
    author: "Redaktion Kablitz",
    date: "2026-09-08",
    status: "Veröffentlicht",
    seoTitle: "Gussteile aus eigener Fertigung | Kablitz",
    seoDescription: "Gusskomponenten für Feuerungsanlagen und Wärmetauscher aus der Kablitz-Gießerei.",
  },
];

const KEY = "kablitz-demo-news-v1";
const listeners = new Set<() => void>();
let cache: NewsPost[] | null = null;

function read(): NewsPost[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as NewsPost[]) : SEED;
  } catch {
    cache = SEED;
  }
  return cache;
}

function write(posts: NewsPost[]) {
  cache = posts;
  try { window.localStorage.setItem(KEY, JSON.stringify(posts)); } catch { /* storage unavailable: keep in memory */ }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; listener(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

/** All posts, newest first. Returns the seed list during SSR. */
export function useNews(): NewsPost[] {
  return useSyncExternalStore(subscribe, read, () => SEED);
}

export const byDate = (a: NewsPost, b: NewsPost) => b.date.localeCompare(a.date);

export function savePost(post: NewsPost) {
  const posts = read();
  const exists = posts.some((p) => p.id === post.id);
  write(exists ? posts.map((p) => (p.id === post.id ? post : p)) : [post, ...posts]);
}

export function deletePost(id: string) {
  write(read().filter((p) => p.id !== id));
}

export function resetNews() {
  write(SEED);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, posts: NewsPost[], id: string) {
  const root = base || "beitrag";
  let slug = root, n = 2;
  while (posts.some((p) => p.slug === slug && p.id !== id)) slug = `${root}-${n++}`;
  return slug;
}
