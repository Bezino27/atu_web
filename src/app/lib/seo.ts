export const SITE_URL = "https://atukosice.sk";

export const SITE_NAME = "ATU Košice";

export const SITE_DESCRIPTION =
  "Oficiálna stránka florbalového klubu ATU Košice – novinky, zápasy, výsledky, kategórie, tabuľky a nábor hráčov.";

export const DEFAULT_OG_IMAGE_PATH = "/images/news_hero.jpg";

export const DEFAULT_OG_IMAGE_URL = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

export const SITE_KEYWORDS = [
  "ATU Košice",
  "florbal Košice",
  "florbalový klub Košice",
  "ATU",
  "florbal",
  "Košice",
  "športový klub",
  "tréningy florbal",
  "zápasy florbal",
  "nábor hráčov",
];

export function absoluteUrl(path = "/") {
  if (!path.startsWith("/")) {
    return `${SITE_URL}/${path}`;
  }

  return `${SITE_URL}${path}`;
}
