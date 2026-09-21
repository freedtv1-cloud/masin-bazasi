import type { MetadataRoute } from "next";
import { getCascadeCatalog, getAllListings } from "@/lib/queries";

// Elanlar tez-tez dəyişdiyi üçün sitemap build zamanı deyil, hər sorğuda
// yenidən yaradılır (layihədəki digər səhifələr kimi force-dynamic).
export const dynamic = "force-dynamic";

const SITE_URL = "https://masin-bazasi-canli.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [profiles, listings] = await Promise.all([getCascadeCatalog(), getAllListings()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/modeller`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/elanlar`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/muqayise`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/elan-yarat`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const profileRoutes: MetadataRoute.Sitemap = profiles.map((p) => ({
    url: `${SITE_URL}/modeller/${p.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const listingRoutes: MetadataRoute.Sitemap = listings
    .filter((l) => l.status === "aktiv")
    .map((l) => ({
      url: `${SITE_URL}/elanlar/${l.id}`,
      changeFrequency: "daily",
      priority: 0.6,
    }));

  return [...staticRoutes, ...profileRoutes, ...listingRoutes];
}
