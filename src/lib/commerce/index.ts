import "server-only";

import { cookies } from "next/headers";
import * as demo from "@/lib/demo/provider";
import { MAX_QTY as MAX_LINE_QUANTITY } from "@/lib/limits";
import { isShopifyConfigured, ShopifyError } from "@/lib/shopify/client";
import * as shopify from "@/lib/shopify/provider";
import type {
  Cart,
  Collection,
  PolicyHandle,
  Product,
  ProductQuery,
  ProductSummary,
  ShopPolicy,
} from "./types";

/**
 * Single entry point for store data. Uses the Shopify Storefront API when
 * credentials are present, otherwise the local demo catalog.
 */

export const isDemoMode = () => !isShopifyConfigured();

export function getProducts(query?: ProductQuery): Promise<ProductSummary[]> {
  return isDemoMode() ? demo.getProducts(query) : shopify.getProducts(query);
}

export function getProduct(handle: string): Promise<Product | null> {
  return isDemoMode() ? demo.getProduct(handle) : shopify.getProduct(handle);
}

export function getProductHandles() {
  return isDemoMode() ? demo.getProductHandles() : shopify.getProductHandles();
}

export function getCollections(): Promise<Collection[]> {
  return isDemoMode() ? demo.getCollections() : shopify.getCollections();
}

export function getCollection(handle: string): Promise<Collection | null> {
  return isDemoMode() ? demo.getCollection(handle) : shopify.getCollection(handle);
}

export { MAX_LINE_QUANTITY };

/** Policies written in Shopify admin (Settings → Policies), if any. */
export async function getShopPolicies(): Promise<Partial<Record<PolicyHandle, ShopPolicy>>> {
  return isDemoMode() ? {} : shopify.getShopPolicies();
}

/* ─── Cart ───────────────────────────────────────────────────────────── */

/** An error whose message can be shown to the shopper as-is. */
export class CartError extends Error {
  name = "CartError";
}

export function isUserFacingError(error: unknown): error is Error {
  return error instanceof CartError || (error instanceof ShopifyError && error.userFacing);
}

const CART_COOKIE = "mimo_cart";
const DEMO_CART_COOKIE = "mimo_demo_cart";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 14,
};

async function readDemoLines(): Promise<demo.DemoLine[]> {
  const raw = (await cookies()).get(DEMO_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is demo.DemoLine =>
        typeof l?.merchandiseId === "string" &&
        Number.isInteger(l?.quantity) &&
        l.quantity > 0 &&
        l.quantity <= MAX_LINE_QUANTITY &&
        demo.findVariant(l.merchandiseId) !== null,
    );
  } catch {
    return [];
  }
}

async function writeDemoLines(lines: demo.DemoLine[]) {
  (await cookies()).set(DEMO_CART_COOKIE, JSON.stringify(lines), cookieOptions);
}

export async function getCart(): Promise<Cart | null> {
  if (isDemoMode()) return demo.buildCart(await readDemoLines());
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  return cartId ? shopify.getCart(cartId) : null;
}

export async function addToCart(merchandiseId: string, quantity: number): Promise<Cart> {
  if (isDemoMode()) {
    if (!demo.findVariant(merchandiseId)) throw new CartError("That product is no longer available.");
    const lines = await readDemoLines();
    const existing = lines.find((l) => l.merchandiseId === merchandiseId);
    if (existing) existing.quantity = Math.min(MAX_LINE_QUANTITY, existing.quantity + quantity);
    else lines.push({ merchandiseId, quantity });
    await writeDemoLines(lines);
    return demo.buildCart(lines);
  }

  const jar = await cookies();
  const cartId = jar.get(CART_COOKIE)?.value;
  const lines = [{ merchandiseId, quantity }];
  const existing = cartId ? await shopify.getCart(cartId) : null;
  if (existing?.id) return shopify.addCartLines(existing.id, lines);

  // No cart yet, or the old one expired — start a new one.
  const cart = await shopify.createCart(lines);
  if (cart.id) jar.set(CART_COOKIE, cart.id, cookieOptions);
  return cart;
}

/** Sets a line's quantity; 0 removes it. */
export async function updateCartLine(lineId: string, quantity: number): Promise<Cart> {
  if (isDemoMode()) {
    const lines = (await readDemoLines())
      .map((l) => (l.merchandiseId === lineId ? { ...l, quantity } : l))
      .filter((l) => l.quantity > 0);
    await writeDemoLines(lines);
    return demo.buildCart(lines);
  }

  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) throw new CartError("Your cart has expired. Please add the item again.");
  return quantity > 0
    ? shopify.updateCartLines(cartId, [{ id: lineId, quantity }])
    : shopify.removeCartLines(cartId, [lineId]);
}
