import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function KablitzFoundryBand() {
  return <section className="kablitz-videoband">
    <div className="kablitz-videoband-bg" data-zoom="">
      <Image src="/leads/kablitz-gmbh-r4t9k2/01-ec57535860fcda44.webp" alt="Kablitz-Energieanlage" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 40%" }} />
    </div>
    <div className="kablitz-videoband-scrim" aria-hidden="true" />
    <div className="kablitz-videoband-copy">
      <p className="kablitz-eyebrow" data-fade="">Fertigung in Lauda</p>
      <h2 data-split="">Eigene Gießerei.<br />Eigener Modellbau.</h2>
      <p className="kablitz-foundry-description" data-fade="0.3">Kablitz fertigt Gusskomponenten für Wärmetauscher und Feuerungsanlagen. Der eigene Modellbau ermöglicht die Herstellung kundenspezifischer Bauteile.</p>
      <a className="kablitz-videoband-btn" data-fade="0.45" href="https://www.kablitz.de/wir-giessen-selbst/" target="_blank" rel="noreferrer">Fertigung kennenlernen <ArrowUpRight size={18} /></a>
    </div>
  </section>;
}
