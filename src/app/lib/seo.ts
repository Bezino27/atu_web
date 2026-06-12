import type { Metadata } from "next";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atukosice.sk"
).replace(/\/$/, "");

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://atukosice.sk/api"
).replace(/\/$/, "");

export const CLUB_SLUG = "atu-kosice";

export const SITE_NAME = "ATU Košice";
export const DEFAULT_TITLE = "ATU Košice | Florbalový klub";
export const DEFAULT_DESCRIPTION =
  "Oficiálna stránka florbalového klubu ATU Košice. Novinky, zápasy, kategórie, výsledky, nábor a informácie o klube.";

export const DEFAULT_KEYWORDS = [
  "ATU Košice",
  "florbal Košice",
  "florbalový klub",
  "ATU",
  "florbal",
  "šport Košice",
  "muži",
  "juniori",
  "dorast",
  "žiaci",
  "prípravka",
];

export const DEFAULT_OG_IMAGE = "/images/news_hero.jpg";

export function getCanonicalUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${SITE_URL}${normalizedPath}`;
}

export function stripHtml(value?: string | null) {
  return value?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() ?? "";
}

export function truncateSeoText(value: string, maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength - 1).trimEnd();
  const lastSpace = truncated.lastIndexOf(" ");

  return `${lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated}…`;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = getCanonicalUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "sk_SK",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
