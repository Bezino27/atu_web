import type { MetadataRoute } from "next";
import { absoluteUrl } from "./lib/seo";
import { getClubPages } from "./lib/pages";
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

function getLastModified(dateString: string | null | undefined) {
  if (!dateString) return undefined;

  const date = new Date(dateString);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  function setEntry(entry: MetadataRoute.Sitemap[number]) {
    const normalizedUrl = entry.url.replace(/\/+$/, "") || entry.url;
    const existing = entries.get(normalizedUrl);

    if (!existing || (!existing.lastModified && entry.lastModified)) {
      entries.set(normalizedUrl, entry);
    }
  }

  const [posts, pages] = await Promise.all([
    getHomepagePosts("atu-kosice"),
    getClubPages("atu-kosice"),
  ]);

  for (const post of posts) {
    const lastModified = getLastModified(post.updated_at ?? post.published_at);

    setEntry({
      url: absoluteUrl(`/clanky/${post.slug}`),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const page of pages) {
    if (!page.public_path) continue;

    const lastModified = getLastModified(
      page.content_updated_at ?? page.updated_at,
    );

    setEntry({
      url: absoluteUrl(page.public_path),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: page.public_path === "/" ? "daily" : "weekly",
      priority: page.public_path === "/" ? 1 : 0.8,
    });
  }

  for (const route of staticRoutes) {
    setEntry({
      url: absoluteUrl(route),
      changeFrequency: route === "/" ? "daily" : "weekly",
      priority: route === "/" ? 1 : 0.8,
    });
  }

  return Array.from(entries.values());
}
