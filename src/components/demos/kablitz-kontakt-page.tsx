import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import type { LeadProfile } from "@/lib/lead-schema";
import { telephoneHref } from "@/lib/lead-schema";
import { KablitzMotion } from "./kablitz-motion";
import { KablitzMap } from "./kablitz-map";
import { ContactBand, KablitzFooter, KablitzHeader } from "./kablitz-page";
import "./kablitz-page.css";

/** Standalone contact page: the hero's secondary action lands here. */
export function KablitzKontaktPage({ lead }: { lead: LeadProfile }) {
  return (
    <main className="kablitz-page kablitz-kontakt-page" id="top">
      <KablitzMotion />
      <p className="kablitz-disclaimer">Unverbindliches Designkonzept — nicht die offizielle Website des Unternehmens</p>
      <KablitzHeader lead={lead} />

      <section className="kkontakt-hero">
        <p className="kablitz-eyebrow" data-fade="">Kontakt</p>
        <h1 data-split="">Mit unseren Ingenieuren sprechen.</h1>
        <p data-fade="0.2">Anlagenbau, Service oder Ersatzteile: Rufen Sie uns an oder schildern Sie Ihr Vorhaben direkt in der Projektanfrage.</p>
        <Link className="kablitz-btn kablitz-btn-primary" href="/#anfrage" data-fade="0.3">
          <Send size={16} /> Projekt anfragen <ArrowRight size={16} />
        </Link>
      </section>

      <ContactBand lead={lead} phoneHref={telephoneHref(lead.contact.phone)} />
      <KablitzMap address={lead.contact.address ?? lead.city} routeUrl={lead.contact.mapsUrl} />
      <KablitzFooter lead={lead} />
    </main>
  );
}
