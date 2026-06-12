import type { MetadataRoute } from "next";
import { API_URL, CLUB_SLUG, getCanonicalUrl } from "@/app/lib/seo";

export const revalidate = 3600;

type ApiPost = {
  id?: number | string;
  slug?: string;
  title?: string;
  updated_at?: string;
  updatedAt?: string;
  created_at?: string;
  createdAt?: string;
  published_at?: string;
  publishedAt?: string;
};

function getPostArray(data: unknown): ApiPost[] {
  if (Array.isArray(data)) {
    return data as ApiPost[];
  }

  if (data && typeof data === "object") {
    const objectData = data as {
      results?: ApiPost[];
      posts?: ApiPost[];
      data?: ApiPost[];
    };

    if (Array.isArray(objectData.results)) return objectData.results;
    if (Array.isArray(objectData.posts)) return objectData.posts;
    if (Array.isArray(objectData.data)) return objectData.data;
  }

  return [];
}

function getPostLastModified(post: ApiPost) {
  const dateValue =
    post.updated_at ??
    post.updatedAt ??
    post.published_at ??
    post.publishedAt ??
    post.created_at ??
    post.createdAt;

  if (!dateValue) {
    return new Date();
  }

  const date = new Date(dateValue);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

async function getPostUrls(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(
      `${API_URL}/public/posts/${CLUB_SLUG}/`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const posts = getPostArray(data);

    return posts
      .filter((post) => Boolean(post.slug))
      .map((post) => ({
        url: getCanonicalUrl(`/clanky/${post.slug}`),
        lastModified: getPostLastModified(post),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: getCanonicalUrl("/o-klube"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/pridaj_sa"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/kontakt"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("/clanky"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("/kategorie/muzi"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("/kategorie/pripravka"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/kategorie/mladsi-ziaci"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/kategorie/starsi-ziaci"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/kategorie/dorast"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getCanonicalUrl("/kategorie/juniori"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const postRoutes = await getPostUrls();

  return [...staticRoutes, ...postRoutes];
}
