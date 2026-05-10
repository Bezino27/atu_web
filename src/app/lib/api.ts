const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_URL =
  rawApiUrl?.replace(/\/$/, "") ?? "http://178.104.54.84:8000/api";

export const BACKEND_URL = API_URL.endsWith("/api")
  ? API_URL.slice(0, -4)
  : API_URL;

export function getImageUrl(image?: string | null): string {
  if (!image) return "/images/news1.jpg";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const normalizedImage = image.startsWith("/") ? image : `/${image}`;

  return `${BACKEND_URL}${normalizedImage}`;
}
