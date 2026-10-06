import type { MetadataRoute } from "next";
import { policyHandles } from "@/content/policies";
import { defaultLocale, localizePath, locales } from "@/i18n/config";
import { getCollections, getProductHandles } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  // Handles are the same in every language.
  const [products, collections] = await Promise.all([
    getProductHandles(),
    getCollections(defaultLocale),
  ]);

  const pages: { path: string; lastModified?: string }[] = [
    ...["/", "/shop", "/collections", "/how-to-order", "/faq", "/contact", "/policies"].map(
      (path) => ({ path }),
    ),
    ...collections.map((c) => ({ path: `/collections/${c.handle}` })),
    ...products.map((p) => ({
      path: `/products/${p.handle}`,
      ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
    })),
    ...policyHandles.map((handle) => ({ path: `/policies/${handle}` })),
  ];

  // One entry per language, each listing every language version (hreflang).
  return pages.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(
      locales.map((l) => [l, `${base}${localizePath(l, path)}`]),
    );
    return locales.map((lang) => ({
      url: `${base}${localizePath(lang, path)}`,
      ...(lastModified ? { lastModified } : {}),
      alternates: { languages },
    }));
  });
}
