const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

const SERVER_API_URL =
  rawApiUrl?.replace(/\/$/, "") ?? "http://178.104.54.84:8000/api";

const CLIENT_API_URL =
  process.env.NEXT_PUBLIC_CLIENT_API_URL?.replace(/\/$/, "") ?? "/backend-api";

export const API_URL =
  typeof window === "undefined" ? SERVER_API_URL : CLIENT_API_URL;

export const BACKEND_URL = SERVER_API_URL.endsWith("/api")
  ? SERVER_API_URL.slice(0, -4)
  : SERVER_API_URL;

export function getImageUrl(image?: string | null): string {
  if (!image) return "/images/news1.jpg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const normalizedImage = image.startsWith("/") ? image : `/${image}`;

  return `${BACKEND_URL}${normalizedImage}`;
}
