const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

const SERVER_API_URL =
  rawApiUrl?.replace(/\/$/, "") ?? "http://host.docker.internal:8000/api";

const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_CLIENT_API_URL?.replace(/\/$/, "") ?? "/backend-api";

const PUBLIC_MEDIA_ORIGIN =
  process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ??
  "https://atukosice.sk";

const LEGACY_MEDIA_HOSTS = new Set([
  "178.104.54.84",
  "localhost",
  "127.0.0.1",
  "atukosice.sk",
  "www.atukosice.sk",
]);

export const API_URL =
  typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;

export const BACKEND_URL = SERVER_API_URL.endsWith("/api")
  ? SERVER_API_URL.slice(0, -4)
  : SERVER_API_URL;

function isMediaPath(pathname: string) {
  return pathname === "/media" || pathname.startsWith("/media/");
}

function normalizeMediaPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (isMediaPath(normalizedPath)) {
    return normalizedPath;
  }

  if (normalizedPath.startsWith("/images/") || normalizedPath.startsWith("/logo/")) {
    return normalizedPath;
  }

  return `/media${normalizedPath}`;
}

export function normalizeMediaUrl(
  image?: string | null,
  fallback = "/images/news1.jpg",
): string {
  if (!image) return fallback;

  const trimmedImage = image.trim();

  if (!trimmedImage) return fallback;

  if (
    trimmedImage.startsWith("data:") ||
    trimmedImage.startsWith("blob:") ||
    trimmedImage.startsWith("/_next/")
  ) {
    return trimmedImage;
  }

  if (trimmedImage.startsWith("http://") || trimmedImage.startsWith("https://")) {
    try {
      const url = new URL(trimmedImage);

      if (LEGACY_MEDIA_HOSTS.has(url.hostname) && isMediaPath(url.pathname)) {
        return `${PUBLIC_MEDIA_ORIGIN}${url.pathname}${url.search}${url.hash}`;
      }

      if (url.hostname === "atukosice.sk" || url.hostname === "www.atukosice.sk") {
        url.protocol = "https:";
        return url.toString();
      }

      return trimmedImage;
    } catch {
      return fallback;
    }
  }

  const mediaPath = normalizeMediaPath(trimmedImage);

  if (mediaPath.startsWith("/images/") || mediaPath.startsWith("/logo/")) {
    return mediaPath;
  }

  return `${PUBLIC_MEDIA_ORIGIN}${mediaPath}`;
}

export function getImageUrl(image?: string | null): string {
  return normalizeMediaUrl(image);
}

export function normalizeHtmlMediaUrls(html?: string | null) {
  if (!html) return "";

  return html.replace(
    /\b(src|href)=("|')([^"']+)\2/g,
    (_match, attribute: string, quote: string, value: string) => {
      const normalizedUrl = normalizeMediaUrl(value, value);

      return `${attribute}=${quote}${normalizedUrl}${quote}`;
    },
  );
}
