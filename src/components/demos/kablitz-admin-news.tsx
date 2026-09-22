"use client";

import { ExternalLink, Eye, FilePlus2, Pencil, RotateCcw, Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  NEWS_CATEGORIES, NEWS_IMAGES, byDate, deletePost, resetNews, savePost, slugify, uniqueSlug, useNews,
  type NewsCategory, type NewsPost, type NewsStatus,
} from "@/lib/news-store";

const today = () => new Date().toISOString().slice(0, 10);

const blankPost = (): NewsPost => ({
  id: `post-${Date.now()}`, slug: "", title: "", summary: "", body: "", category: "Unternehmen",
  image: NEWS_IMAGES[0].src, imageAlt: "", author: "Redaktion Kablitz", date: today(), status: "Entwurf",
  seoTitle: "", seoDescription: "",
});

/** Newsroom: list, create, edit, publish and delete posts. Demo storage is this browser only. */
export function KablitzAdminNews() {
  const posts = useNews();
  const [draft, setDraft] = useState<NewsPost | null>(null);
  const sorted = [...posts].sort(byDate);

  if (draft) return <NewsEditor key={draft.id} initial={draft} posts={posts} onClose={() => setDraft(null)} />;

  return (
    <>
      <div className="kablitz-news-intro">
        <div>
          <strong>Redaktion</strong>
          <p>Beiträge anlegen, bebildern und veröffentlichen. Veröffentlichte Beiträge erscheinen sofort unter „News“ auf der Website und auf der Startseite.</p>
          <p className="kablitz-news-note">Produktion: Anmeldung mit Google, nur freigeschaltete Konten, Freigabe vor Veröffentlichung. In dieser Vorschau werden Beiträge nur in diesem Browser gespeichert.</p>
        </div>
        <div className="kablitz-news-intro-actions">
          <button type="button" className="kablitz-news-btn is-primary" onClick={() => setDraft(blankPost())}><FilePlus2 size={16} /> Neuer Beitrag</button>
          <a className="kablitz-news-btn" href="/news" target="_blank" rel="noreferrer"><ExternalLink size={15} /> News-Seite öffnen</a>
        </div>
      </div>

      <div className="kablitz-news-list">
        {sorted.length === 0 && <p className="kablitz-news-empty">Noch keine Beiträge. Legen Sie den ersten Beitrag an.</p>}
        {sorted.map((post) => (
          <article key={post.id} className="kablitz-news-row">
            <div className="kablitz-news-thumb"><Image src={post.image} alt="" fill sizes="96px" unoptimized /></div>
            <div className="kablitz-news-row-body">
              <div className="kablitz-news-meta">
                <span className={`kablitz-news-status ${post.status === "Veröffentlicht" ? "is-live" : ""}`}>{post.status}</span>
                <span>{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("de-DE")}</span>
              </div>
              <h3>{post.title || "Ohne Titel"}</h3>
              <p>{post.summary}</p>
            </div>
            <div className="kablitz-news-row-actions">
              <button type="button" onClick={() => setDraft(post)} aria-label={`${post.title} bearbeiten`}><Pencil size={15} /> Bearbeiten</button>
              {post.status === "Veröffentlicht" && <a href={`/news/${post.slug}`} target="_blank" rel="noreferrer"><Eye size={15} /> Ansehen</a>}
              <button type="button" className="is-danger" onClick={() => { if (window.confirm(`„${post.title}“ löschen?`)) deletePost(post.id); }}><Trash2 size={15} /> Löschen</button>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="kablitz-news-reset" onClick={() => { if (window.confirm("Alle Beiträge auf die Beispieldaten zurücksetzen?")) resetNews(); }}><RotateCcw size={14} /> Beispieldaten wiederherstellen</button>
    </>
  );
}

function NewsEditor({ initial, posts, onClose }: { initial: NewsPost; posts: NewsPost[]; onClose: () => void }) {
  const [post, setPost] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [error, setError] = useState("");
  const set = <K extends keyof NewsPost>(key: K, value: NewsPost[K]) => setPost((p) => ({ ...p, [key]: value }));

  const onTitle = (title: string) => setPost((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));

  const save = (status: NewsStatus) => {
    if (!post.title.trim()) return setError("Bitte einen Titel eingeben.");
    if (!post.summary.trim()) return setError("Bitte eine kurze Zusammenfassung eingeben.");
    if (!post.imageAlt.trim()) return setError("Bitte einen Alternativtext für das Titelbild eingeben.");
    const slug = uniqueSlug(slugify(post.slug || post.title), posts, post.id);
    savePost({ ...post, slug, status });
    onClose();
  };

  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.seoDescription || post.summary;

  return (
    <div className="kablitz-news-editor">
      <div className="kablitz-news-editor-head">
        <h2>{initial.title ? "Beitrag bearbeiten" : "Neuer Beitrag"}</h2>
        <button type="button" className="kablitz-news-btn" onClick={onClose}><X size={15} /> Abbrechen</button>
      </div>

      <div className="kablitz-news-grid">
        <div className="kablitz-news-fields">
          <label>Titel<input value={post.title} onChange={(e) => onTitle(e.target.value)} placeholder="z. B. Neue Anlage in Betrieb genommen" /></label>
          <label>URL<span className="kablitz-news-slug"><em>/news/</em><input value={post.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></span></label>
          <label>Zusammenfassung<textarea rows={2} value={post.summary} onChange={(e) => set("summary", e.target.value)} placeholder="Ein bis zwei Sätze für Übersicht und Vorschau" /></label>
          <label>Text<textarea rows={10} value={post.body} onChange={(e) => set("body", e.target.value)} placeholder="Absätze mit einer Leerzeile trennen" /></label>
          <div className="kablitz-news-row2">
            <label>Kategorie<select value={post.category} onChange={(e) => set("category", e.target.value as NewsCategory)}>{NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>Datum<input type="date" value={post.date} onChange={(e) => set("date", e.target.value)} /></label>
            <label>Autor<input value={post.author} onChange={(e) => set("author", e.target.value)} /></label>
          </div>
        </div>

        <aside className="kablitz-news-side">
          <fieldset>
            <legend>Titelbild</legend>
            <div className="kablitz-news-images">
              {NEWS_IMAGES.map((img) => (
                <button key={img.src} type="button" aria-pressed={post.image === img.src} onClick={() => set("image", img.src)} title={img.label}>
                  <Image src={img.src} alt={img.label} fill sizes="90px" unoptimized />
                </button>
              ))}
            </div>
            <label>Alternativtext<input value={post.imageAlt} onChange={(e) => set("imageAlt", e.target.value)} placeholder="Was ist auf dem Bild zu sehen?" /></label>
          </fieldset>

          <fieldset>
            <legend>Suchmaschinen</legend>
            <label>SEO-Titel <small>{seoTitle.length}/60</small><input value={post.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={post.title} /></label>
            <label>Meta-Beschreibung <small>{seoDescription.length}/155</small><textarea rows={3} value={post.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={post.summary} /></label>
            <div className="kablitz-news-serp" aria-label="Suchergebnis-Vorschau">
              <span>kablitz.de › news › {post.slug || "…"}</span>
              <strong>{seoTitle || "Seitentitel"}</strong>
              <p>{seoDescription || "Beschreibung des Beitrags"}</p>
            </div>
          </fieldset>
        </aside>
      </div>

      {error && <p className="kablitz-news-error" role="alert">{error}</p>}
      <div className="kablitz-news-editor-actions">
        <button type="button" className="kablitz-news-btn" onClick={() => save("Entwurf")}><Save size={15} /> Als Entwurf speichern</button>
        <button type="button" className="kablitz-news-btn is-primary" onClick={() => save("Veröffentlicht")}>Veröffentlichen</button>
      </div>
    </div>
  );
}
