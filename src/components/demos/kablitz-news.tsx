"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { byDate, useNews, type NewsPost } from "@/lib/news-store";
import "./kablitz-news.css";

const published = (posts: NewsPost[]) => posts.filter((p) => p.status === "Veröffentlicht").sort(byDate);
const formatDate = (date: string) => new Date(date).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

function NewsShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="kablitz-news-page">
      <p className="kablitz-news-disclaimer">Unverbindliches Designkonzept — nicht die offizielle Website des Unternehmens</p>
      <header className="kablitz-news-header">
        <Link href="/"><Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Startseite" width={130} height={40} unoptimized /></Link>
        <nav aria-label="Hauptnavigation"><Link href="/">Startseite</Link><Link href="/news" aria-current="page">News</Link><Link href="/#kontakt">Kontakt</Link></nav>
      </header>
      {children}
    </main>
  );
}

function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link className="kablitz-news-card" href={`/news/${post.slug}`}>
      <div className="kablitz-news-card-media"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 800px) 100vw, 33vw" unoptimized /></div>
      <div className="kablitz-news-card-body">
        <span className="kablitz-news-card-meta">{post.category} · {formatDate(post.date)}</span>
        <h3>{post.title}</h3>
        <p>{post.summary}</p>
        <span className="kablitz-news-card-more">Weiterlesen <ArrowUpRight size={15} /></span>
      </div>
    </Link>
  );
}

export function KablitzNewsIndex() {
  const posts = published(useNews());
  return (
    <NewsShell>
      <section className="kablitz-news-hero">
        <p className="kablitz-news-eyebrow">News & Insights</p>
        <h1>Neuigkeiten aus Lauda.</h1>
        <p>Projekte, Technik, Service und Karriere bei Kablitz.</p>
      </section>
      <section className="kablitz-news-grid-public">
        {posts.length ? posts.map((post) => <NewsCard key={post.id} post={post} />) : <p>Derzeit sind keine Beiträge veröffentlicht.</p>}
      </section>
    </NewsShell>
  );
}

export function KablitzNewsArticle({ slug }: { slug: string }) {
  const posts = published(useNews());
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return (
      <NewsShell>
        <section className="kablitz-news-hero">
          <h1>Beitrag nicht gefunden.</h1>
          <p>Der Beitrag existiert nicht oder ist noch nicht veröffentlicht.</p>
          <Link className="kablitz-news-back" href="/news"><ArrowLeft size={15} /> Alle Beiträge</Link>
        </section>
      </NewsShell>
    );
  }
  const more = posts.filter((p) => p.id !== post.id).slice(0, 3);
  return (
    <NewsShell>
      <article className="kablitz-news-article">
        <Link className="kablitz-news-back" href="/news"><ArrowLeft size={15} /> Alle Beiträge</Link>
        <p className="kablitz-news-eyebrow">{post.category} · <time dateTime={post.date}>{formatDate(post.date)}</time></p>
        <h1>{post.title}</h1>
        <p className="kablitz-news-lead">{post.summary}</p>
        <div className="kablitz-news-article-media"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 900px) 100vw, 900px" unoptimized priority /></div>
        <div className="kablitz-news-body">
          {post.body.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <p className="kablitz-news-author">{post.author}</p>
      </article>
      {more.length > 0 && (
        <section className="kablitz-news-more">
          <h2>Weitere Beiträge</h2>
          <div className="kablitz-news-grid-public">{more.map((p) => <NewsCard key={p.id} post={p} />)}</div>
        </section>
      )}
    </NewsShell>
  );
}

/** Latest three published posts for the landing page. */
export function KablitzNewsTeaser() {
  const posts = published(useNews()).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section className="kablitz-news-teaser" id="news">
      <div className="kablitz-news-teaser-head">
        <div>
          <p className="kablitz-eyebrow" data-fade="">News & Insights</p>
          <h2 data-split="">Neuigkeiten aus Lauda.</h2>
        </div>
        <Link className="kablitz-news-teaser-all" href="/news" data-fade="0.2">Alle Beiträge <ArrowUpRight size={16} /></Link>
      </div>
      {/* Animate the container, not the cards: cards re-render once localStorage is read. */}
      <div className="kablitz-news-grid-public" data-fade="0.15">
        {posts.map((post) => <NewsCard key={post.id} post={post} />)}
      </div>
    </section>
  );
}
