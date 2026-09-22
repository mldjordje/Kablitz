import type { Metadata } from "next";

export function buildDemoMetadata(businessName: string, description: string): Metadata {
  return {
    title: `${businessName} — unverbindliches Designkonzept`,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  };
}
