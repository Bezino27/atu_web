const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

const SERVER_API_URL =
  rawApiUrl?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

const CLIENT_API_URL = "/backend-api";

const PUBLIC_MEDIA_ORIGIN =
  process.env.NEXT_PUBLIC_MEDIA_ORIGIN?.replace(/\/$/, "") ??
  "https://atukosice.sk";

const IS_DEV = process.env.NODE_ENV !== "production";

type NextFetchOptions = RequestInit & {
  cache?: "no-store";
  next?: {
    revalidate?: number;
  };
};

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

export function getApiFetchOptions(revalidateSeconds: number): NextFetchOptions {
  if (IS_DEV) {
    return { cache: "no-store" };
  }

  return { next: { revalidate: revalidateSeconds } };
}

function getErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;

  const { code } = error as { code?: unknown };

  return typeof code === "string" ? code : undefined;
}

function collectNestedErrors(error: unknown): unknown[] {
  if (!error || typeof error !== "object") return [];

  const nestedErrors: unknown[] = [];
  const { cause } = error as { cause?: unknown };
  const { errors } = error as { errors?: unknown };

  if (cause) {
    nestedErrors.push(cause);
  }

  if (Array.isArray(errors)) {
    nestedErrors.push(...errors);
  }

  return nestedErrors;
}

export function isBackendConnectionError(error: unknown): boolean {
  const stack = [error];
  const checked = new Set<unknown>();

  while (stack.length > 0) {
    const currentError = stack.pop();

    if (!currentError || checked.has(currentError)) continue;
    checked.add(currentError);

    const code = getErrorCode(currentError);

    if (
      code === "ECONNREFUSED" ||
      code === "ECONNRESET" ||
      code === "ENOTFOUND" ||
      code === "ETIMEDOUT"
    ) {
      return true;
    }

    stack.push(...collectNestedErrors(currentError));
  }

  return false;
}

export function shouldSilenceDevBackendError(error: unknown): boolean {
  return IS_DEV && isBackendConnectionError(error);
}

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

export function withDevMediaCacheBuster(
  imageUrl: string,
  shouldBustCache: boolean,
) {
  if (!IS_DEV || !shouldBustCache) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";

  return `${imageUrl}${separator}v=${Date.now()}`;
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
