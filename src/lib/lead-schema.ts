import { z } from "zod";

export const templateFamilySchema = z.enum([
  "beauty",
  "barber",
  "restaurant",
  "corporate",
  "construction",
]);

export const leadStatusSchema = z.enum([
  "research",
  "ready",
  "visited",
  "decision-maker-away",
  "interested",
  "follow-up-approved",
  "meeting",
  "proposal",
  "declined",
]);

const contentItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  meta: z.string().optional(),
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  quote: z.string().min(1),
  sourceUrl: z.string().url(),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const mediaAssetSchema = z.object({
  src: z.string().regex(/^\/leads\//),
  alt: z.string().min(1),
  sourceUrl: z.string().url(),
  rightsStatus: z.literal("pending-client-approval"),
});

export const leadProfileSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)+-[a-z0-9]{6}$/),
  family: templateFamilySchema,
  status: leadStatusSchema,
  businessName: z.string().min(1),
  businessType: z.string().min(1),
  city: z.string().min(1),
  tagline: z.string().min(1),
  shortDescription: z.string().min(1),
  primaryCta: z.enum(["call", "directions", "booking-demo"]),
  services: z.array(contentItemSchema).optional(),
  highlights: z.array(z.string().min(1)).optional(),
  openingHours: z.array(z.string().min(1)).optional(),
  process: z.array(contentItemSchema).optional(),
  projects: z.array(contentItemSchema).optional(),
  equipment: z.array(contentItemSchema).optional(),
  certifications: z.array(contentItemSchema).optional(),
  reviews: z.array(reviewSchema).optional(),
  faq: z.array(faqSchema).optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    mapsUrl: z.string().url().optional(),
    website: z.string().url().optional(),
    instagramUrl: z.string().url().optional(),
  }),
  media: z
    .object({
      logo: mediaAssetSchema.optional(),
      hero: mediaAssetSchema.optional(),
      gallery: z.array(mediaAssetSchema).optional(),
      projects: z.array(mediaAssetSchema).optional(),
      team: z.array(mediaAssetSchema).optional(),
    })
    .optional(),
  sources: z.array(z.string().url()).min(1),
  notes: z.string().optional(),
});

export type TemplateFamily = z.infer<typeof templateFamilySchema>;
export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadProfile = z.infer<typeof leadProfileSchema>;
export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type ContentItem = NonNullable<LeadProfile["services"]>[number];

export function sectionHasContent(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

export function telephoneHref(phone?: string): string | undefined {
  if (!phone) return undefined;
  const normalized = phone.trim().replace(/(?!^\+)\D/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}
