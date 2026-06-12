import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/app/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getCanonicalUrl("/sitemap.xml"),
  };
}
