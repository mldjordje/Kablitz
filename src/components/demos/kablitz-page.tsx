import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Globe2,
  LayoutDashboard,
  MapPin,
  Phone,
  Send,
  Wrench,
} from "lucide-react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LeadProfile, MediaAsset } from "@/lib/lead-schema";
import { telephoneHref } from "@/lib/lead-schema";
import { MotionLayer } from "@/components/motion-layer";
import { KablitzProcessStory } from "./kablitz-process-story";
import { KablitzFire } from "./kablitz-fire";
import { KablitzStats } from "./kablitz-stats";
import { KablitzFoundryBand } from "./kablitz-foundry-band";
import { KablitzMotion } from "./kablitz-motion";
import { KablitzNewsTeaser } from "./kablitz-news";
import { KablitzServices } from "./kablitz-services";
import { KablitzMap } from "./kablitz-map";
import { KablitzIntro } from "./kablitz-intro";
import { KablitzSmoothScroll } from "./kablitz-smooth-scroll";
import { KablitzReveal } from "./kablitz-reveal";
import { KablitzMarquee } from "./kablitz-marquee";
import { KablitzMenu } from "./kablitz-menu";
import { KablitzWorld } from "./kablitz-world";
import { KablitzInquiry } from "./kablitz-inquiry";
import { KablitzSpareParts } from "./kablitz-spare-parts";
import "./kablitz-page.css";

const NAV_ITEMS = [
  { label: "Leistungen", href: "/#leistungen" },
  { label: "Unternehmen", href: "/#unternehmen" },
  { label: "News", href: "/news" },
  { label: "Anfrage", href: "/#anfrage" },
  { label: "Ersatzteile", href: "/#ersatzteile" },
  { label: "Kontakt", href: "/kontakt" },
];


export function KablitzPage({ lead }: { lead: LeadProfile }) {
  const gallery = lead.media?.gallery ? [lead.media.hero, ...lead.media.gallery].filter(Boolean) as MediaAsset[] : [];
  const ordered = [...gallery].sort((a, b) => a.src.localeCompare(b.src));
  const at = (i: number) => ordered[i];
  const heroImage = at(0);
  const phoneHref = telephoneHref(lead.contact.phone);

  return (
    <main className="kablitz-page" id="top">
      <KablitzIntro />
      <KablitzSmoothScroll />
      <MotionLayer />
      <KablitzMotion />
      <p className="kablitz-disclaimer">Unverbindliches Designkonzept — nicht die offizielle Website des Unternehmens</p>

      <KablitzHeader lead={lead} />

      <div className="kablitz-hero-stage">
        <Hero heroImage={heroImage} />
      </div>

      <KablitzStats />

      <KablitzReveal />

      <KablitzWorld />

      <KablitzProcessStory />

      <KablitzMarquee />

      <KablitzServices />

      <KablitzFoundryBand />

      <Gallery assets={ordered.slice(7, 14)} />

      <Certifications lead={lead} />

      <AdminCta />

      <KablitzNewsTeaser />

      <KablitzInquiry />

      <KablitzSpareParts />

      <ContactBand lead={lead} phoneHref={phoneHref} />

      <KablitzMap address={lead.contact.address ?? lead.city} routeUrl={lead.contact.mapsUrl} />

      <KablitzFooter lead={lead} />
    </main>
  );
}

export function KablitzHeader({ lead }: { lead: LeadProfile }) {
  return (
    <header className="kablitz-header">
      <Link className="kablitz-wordmark" href="/#top" aria-label={`${lead.businessName} Startseite`}>
        <Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Logo" width={150} height={46} priority unoptimized />
      </Link>
      <nav className="kablitz-nav" aria-label="Hauptnavigation">
        {NAV_ITEMS.map((item) => (
          <Link key={item.label} href={item.href}>{item.label}</Link>
        ))}
        <Link className="kablitz-nav-projekt" href="/projekt">Projektübersicht</Link>
        <Link className="kablitz-nav-admin" href="/admin"><LayoutDashboard size={14} /> Admin</Link>
      </nav>
      <div className="kablitz-header-actions">
        {lead.contact.mapsUrl && (
          <a className="kablitz-btn kablitz-btn-ghost" href={lead.contact.mapsUrl} target="_blank" rel="noreferrer">
            <MapPin size={15} /> Standort
          </a>
        )}
        <Link className="kablitz-btn kablitz-btn-primary" href="/kontakt">Kontakt</Link>
        <KablitzMenu items={[...NAV_ITEMS, { label: "Projekt", href: "/projekt" }]} phone={lead.contact.phone} phoneHref={telephoneHref(lead.contact.phone)} />
      </div>
      <span className="kablitz-progress" aria-hidden="true" />
    </header>
  );
}

const HERO_TITLE = ["Energie", "aus", "dem,", "was", "andere", "als", "Abfall", "sehen"];

function Hero({ heroImage }: { heroImage?: MediaAsset }) {
  return (
    <section className="kablitz-hero">
      {heroImage && (
        <div className="kablitz-hero-media" data-parallax="0.06">
          <Image src={heroImage.src} alt={heroImage.alt} fill sizes="100vw" unoptimized priority />
          <div className="kablitz-hero-scrim" />
        </div>
      )}
      <KablitzFire />
      <div className="kablitz-hero-copy">
        <p className="kablitz-eyebrow" data-hero-fade="">Seit 1901 · Lauda-Königshofen</p>
        <h1 className="kablitz-hero-title">
          {HERO_TITLE.map((word, i) => (
            <span className="kablitz-hero-mask" key={word + i}>
              <span className="kablitz-hero-word" style={{ "--w": i } as CSSProperties}>{word}</span>
            </span>
          ))}
        </h1>
        <p className="kablitz-hero-desc" data-hero-fade="">
          Kablitz plant und liefert Biomasse-Heizkraftwerke, Kesselanlagen und
          Heißgaserzeuger. Mit eigener Gießerei und Stahlfertigung.
        </p>
        <div className="kablitz-hero-actions" data-hero-fade="">
          <a className="kablitz-btn kablitz-btn-primary" href="#anfrage">
            <Send size={16} /> Projekt anfragen
          </a>
          <a className="kablitz-btn kablitz-btn-ghost" href="#ersatzteile">
            <Wrench size={16} /> Ersatzteile anfragen
          </a>
          {/* Placeholder until reference projects exist; intentionally links nowhere. */}
          <button type="button" className="kablitz-btn kablitz-btn-ghost">
            <Globe2 size={16} /> Unsere Projekte
          </button>
        </div>
        <a className="kablitz-scroll-cue" href="#anlage" data-hero-fade="">
          <ArrowDown size={15} /> Die Anlage entdecken
        </a>
      </div>
      {heroImage && (
        <a className="kablitz-source-tag" href={heroImage.sourceUrl} target="_blank" rel="noreferrer">
          Offizielle Website · Freigabe ausstehend
        </a>
      )}
    </section>
  );
}

function Gallery({ assets }: { assets: MediaAsset[] }) {
  if (!assets.length) return null;
  return (
    <section className="kablitz-gallery" aria-label="Gussteile aus eigener Fertigung">
      <div className="kablitz-gallery-head">
        <p className="kablitz-eyebrow" data-fade="">Gießerei Lauda</p>
        <h2 data-split="">Gussteile aus eigener Fertigung.</h2>
        <p data-fade="0.2">Roststäbe, Rippenplatten und weitere Gusskomponenten für Feuerungsanlagen und Wärmetauscher.</p>
        <div className="kablitz-gallery-progress" aria-hidden="true"><i /></div>
      </div>
      <div className="kablitz-gallery-track" role="list">
        {assets.map((asset, index) => (
          <figure className="kablitz-gallery-item" role="listitem" key={asset.src} data-clip={String(index * 0.08)}>
            <div className="kablitz-gallery-media">
              <Image src={asset.src} alt="Gussteil aus der Kablitz-Gießerei" fill sizes="(max-width: 900px) 78vw, 40vw" unoptimized />
            </div>
            <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Certifications({ lead }: { lead: LeadProfile }) {
  if (!lead.certifications?.length) return null;
  return (
    <section className="kablitz-certifications" id="zertifikate">
      <div className="kablitz-section-head">
        <p className="kablitz-eyebrow" data-fade="">Qualität</p>
        <h2 data-split="">Worauf Sie sich verlassen können</h2>
      </div>
      <div className="kablitz-cert-grid" data-stack="">
        {lead.certifications.map((cert, index) => (
          <article className="kablitz-cert-card" key={cert.title} data-tilt="">
            <span className="kablitz-card-number">{String(index + 1).padStart(2, "0")}</span>
            <h3>{cert.title}</h3>
            {cert.description && <p>{cert.description}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminCta() {
  return (
    <section className="kablitz-admin-cta" data-expand="">
      <span className="kablitz-admin-cta-glow" aria-hidden="true" />
      <div className="kablitz-admin-cta-copy">
        <p className="kablitz-eyebrow" data-fade="">Service & Modernisierung</p>
        <h2 data-split="">Auch nach der Inbetriebnahme an Ihrer Seite.</h2>
        <p data-fade="0.25">Inspektionen, Wartung und Umbauten für bestehende Anlagen. Kablitz unterstützt auch bei einem Brennstoffwechsel oder veränderten Leistungsanforderungen.</p>
      </div>
      <a className="kablitz-btn kablitz-btn-primary kablitz-admin-btn" data-fade="0.4" href="https://www.kablitz.de/service/" target="_blank" rel="noreferrer">Service entdecken <ArrowUpRight size={16} /></a>
    </section>
  );
}

export function ContactBand({ lead, phoneHref }: { lead: LeadProfile; phoneHref?: string }) {
  return (
    <section className="kablitz-contact" id="kontakt">
      <div className="kablitz-contact-copy">
        <p className="kablitz-eyebrow" data-fade="">Kontakt</p>
        <h2 data-split="">{lead.businessName}</h2>
        <p data-fade="0.2">Ihr Ansprechpartner für Anlagenbau, Service und Ersatzteile.</p>
        <p className="kablitz-contact-address" data-fade="0.3">{lead.contact.address ?? lead.city}</p>
      </div>
      <div className="kablitz-contact-actions" data-stagger="">
        {phoneHref && (
          <a href={phoneHref}>
            <Phone /> <span><small>Telefon</small>{lead.contact.phone}</span> <ArrowUpRight className="kablitz-contact-arrow" size={18} />
          </a>
        )}
        {lead.contact.mapsUrl && (
          <a href={lead.contact.mapsUrl} target="_blank" rel="noreferrer">
            <MapPin /> <span><small>Standort</small>Route öffnen</span> <ArrowUpRight className="kablitz-contact-arrow" size={18} />
          </a>
        )}
        <Link href="/admin">
          <LayoutDashboard /> <span><small>Konzept</small>Admin-Vorschau</span> <ArrowUpRight className="kablitz-contact-arrow" size={18} />
        </Link>
      </div>
    </section>
  );
}

export function KablitzFooter({ lead }: { lead: LeadProfile }) {
  return (
    <footer className="kablitz-footer">
      <div className="kablitz-footer-inner">
        <div className="kablitz-footer-top">
          <Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz Logo" width={110} height={34} unoptimized />
          <a className="kablitz-back-to-top" href="#top">Nach oben <ArrowRight size={14} /></a>
        </div>
        <p className="kablitz-footer-wordmark" aria-hidden="true" data-chars="">KABLITZ</p>
        <div className="kablitz-footer-bottom">
          <span>© 2026 {lead.businessName}</span>
          <span className="kablitz-footer-links">
            <Link href="/projekt">Projektübersicht</Link>
            <Link href="/admin">Admin-Vorschau</Link>
            <span>Unverbindliches Designkonzept · Kein offizieller Unternehmensauftritt</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
