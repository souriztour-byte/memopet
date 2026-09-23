import type { MetadataRoute } from "next";
import { localPolicies } from "@/content/policies";
import { getCollections, getProductHandles } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const [products, collections] = await Promise.all([getProductHandles(), getCollections()]);
  const staticPaths = ["", "/shop", "/collections", "/how-to-order", "/faq", "/contact", "/policies"];
  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}` })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.handle}` })),
    ...products.map((p) => ({
      url: `${base}/products/${p.handle}`,
      ...(p.updatedAt ? { lastModified: p.updatedAt } : {}),
    })),
    ...localPolicies.map((p) => ({ url: `${base}/policies/${p.handle}` })),
  ];
}
