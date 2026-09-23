import "server-only";

import { findLocalPolicy, localPolicies, type LocalPolicy } from "@/content/policies";
import { getShopPolicies } from "@/lib/commerce";
import type { ShopPolicy } from "@/lib/commerce/types";

export type ResolvedPolicy =
  | { source: "shopify"; meta: LocalPolicy; shopify: ShopPolicy }
  | { source: "local"; meta: LocalPolicy };

/**
 * A policy written in Shopify admin wins; otherwise the local draft is used.
 * If Shopify can't be reached, the draft is shown rather than an error page.
 */
export async function resolvePolicy(handle: string): Promise<ResolvedPolicy | null> {
  const meta = findLocalPolicy(handle);
  if (!meta) return null;
  let fromShopify: ShopPolicy | undefined;
  try {
    fromShopify = (await getShopPolicies())[meta.handle];
  } catch (error) {
    console.error("[policies]", error);
  }
  return fromShopify ? { source: "shopify", meta, shopify: fromShopify } : { source: "local", meta };
}

export { localPolicies };
