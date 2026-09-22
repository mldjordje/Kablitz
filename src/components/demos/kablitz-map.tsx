import { Navigation } from "lucide-react";
import Image from "next/image";

// `!5e1` selects the satellite layer; `!1d` is the visible span in metres.
const EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1400!2d9.71262!3d49.56142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479874573d42ffc9%3A0x76220820686f7906!2sRichard%20Kablitz%20GmbH!5e1!3m2!1sde!2sde!4v1790092502939!5m2!1sde!2sde";

/** Full-bleed satellite map of the works, loaded with the page. Opens from a card to full bleed on scroll. */
export function KablitzMap({ address, routeUrl }: { address: string; routeUrl?: string }) {
  return (
    <section className="kmap" aria-label="Standort Lauda-Königshofen" data-expand="">
      <div className="kmap-frame">
        <iframe src={EMBED} title="Karte: Richard Kablitz GmbH, Lauda-Königshofen" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>

      <div className="kmap-card" data-fade="0.2">
        <Image src="/leads/kablitz-gmbh-r4t9k2/logo-transparent.png" alt="Kablitz" width={120} height={37} unoptimized />
        <p className="kmap-card-label">Werk & Verwaltung</p>
        <p className="kmap-card-address">{address}</p>
        {routeUrl && <a href={routeUrl} target="_blank" rel="noreferrer"><Navigation size={16} /> Route planen</a>}
      </div>
    </section>
  );
}
