import { KablitzNewsArticle } from "@/components/demos/kablitz-news";
import { lead } from "@/data/lead";
import { buildDemoMetadata } from "@/lib/metadata";

export const metadata = buildDemoMetadata(`${lead.businessName} - News`, "Beitrag aus dem Kablitz-Newsroom.");

export default async function NewsArticleRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <KablitzNewsArticle slug={slug} />;
}
