import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/seo";
import { getHomepagePosts } from "./lib/posts";

const staticRoutes = [
  "/",
  "/o-klube",
  "/kontakt",
  "/pridaj_sa",
  "/clanky",
  "/kategorie/muzi",
  "/kategorie/juniori",
  "/kategorie/dorast",
  "/kategorie/starsi-ziaci",
  "/kategorie/mladsi-ziaci",
  "/kategorie/pripravka",
];

function getLastModified(dateString: string | null | undefined, fallback: Date) {
  if (!dateString) return fallback;

  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? fallback : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(
    (route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.8,
    })
  );

  const posts = await getHomepagePosts("atu-kosice");
  const articleSitemapEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/clanky/${post.slug}`),
    lastModified: getLastModified(post.published_at, now),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticSitemapEntries, ...articleSitemapEntries];
}
