import type { MetadataRoute } from "next";
import { localizePath, locales } from "@/i18n/config";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [...locales.map((l) => localizePath(l, "/cart")), "/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
