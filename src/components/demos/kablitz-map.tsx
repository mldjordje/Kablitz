"use client";

import { MapPin, Navigation } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2587.925968967832!2d9.71262!3d49.56142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479874573d42ffc9%3A0x76220820686f7906!2sRichard%20Kablitz%20GmbH!5e0!3m2!1sde!2sde!4v1790092502939!5m2!1sde!2sde";
const CONSENT_KEY = "kablitz-maps-consent";

/**
 * Full-bleed factory map, tinted in the logo red. Two-click consent: Google Maps only loads after the
 * visitor agrees, because the embed transfers data to Google (TDDDG § 25, DSGVO).
 */
export function KablitzMap({ address, routeUrl }: { address: string; routeUrl?: string }) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    let stored = false;
    try { stored = window.localStorage.getItem(CONSENT_KEY) === "1"; } catch { /* storage blocked */ }
    if (stored) { const id = requestAnimationFrame(() => setConsent(true)); return () => cancelAnimationFrame(id); }
  }, []);

  const accept = () => {
    try { window.localStorage.setItem(CONSENT_KEY, "1"); } catch { /* storage blocked */ }
    setConsent(true);
  };

  return (
    <section className="kmap" aria-label="Standort Lauda-Königshofen">
      {consent ? (
        <div className="kmap-frame">
          <iframe src={EMBED} title="Karte: Richard Kablitz GmbH, Lauda-Königshofen" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <span className="kmap-tint" aria-hidden="true" />
        </div>
      ) : (
        <div className="kmap-placeholder">
          <svg className="kmap-grid" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0 62 C 20 58, 35 70, 55 60 S 85 40, 100 46" /><path d="M10 0 C 18 30, 30 45, 42 100" /><path d="M62 0 C 58 25, 70 55, 66 100" />
            <path d="M0 30 C 30 34, 60 22, 100 28" /><path d="M0 84 C 40 78, 70 90, 100 80" />
          </svg>
          <div className="kmap-consent">
            <MapPin size={22} aria-hidden="true" />
            <p><strong>Karte anzeigen?</strong>Beim Laden der Karte werden Daten, u. a. Ihre IP-Adresse, an Google übertragen. Weitere Informationen finden Sie in der Datenschutzerklärung.</p>
            <button type="button" onClick={accept}>Karte laden</button>
          </div>
        </div>
      )}

      <div className="kmap-card">
        <Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz" width={120} height={37} unoptimized />
        <p className="kmap-card-label">Werk & Verwaltung</p>
        <p className="kmap-card-address">{address}</p>
        {routeUrl && <a href={routeUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Route planen</a>}
      </div>
    </section>
  );
}
