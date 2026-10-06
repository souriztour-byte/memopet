"use server";

import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  addToCart,
  CartError,
  isShopifyUserError,
  MAX_LINE_QUANTITY,
  updateCartLine,
} from "@/lib/commerce";
import type { Cart } from "@/lib/commerce/types";

export type CartActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length < 256;
const isQty = (v: unknown, min: number): v is number =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= MAX_LINE_QUANTITY;
// Server Actions can't read the [lang] segment, so the client sends it.
const toLocale = (v: unknown): Locale => (typeof v === "string" && hasLocale(v) ? v : defaultLocale);

function failure(lang: Locale, error: unknown, fallback: string): CartActionResult {
  console.error("[cart]", error);
  const { cart } = getDictionary(lang);
  if (error instanceof CartError) {
    return { ok: false, error: error.code === "expired" ? cart.errorExpired : cart.errorUnavailable };
  }
  return { ok: false, error: isShopifyUserError(error) ? error.message : fallback };
}

export async function addItemAction(
  language: unknown,
  merchandiseId: unknown,
  quantity: unknown = 1,
): Promise<CartActionResult> {
  const lang = toLocale(language);
  const { cart: text } = getDictionary(lang);
  if (!isId(merchandiseId) || !isQty(quantity, 1)) {
    return { ok: false, error: text.errorChooseOption };
  }
  try {
    return { ok: true, cart: await addToCart(lang, merchandiseId, quantity) };
  } catch (error) {
    return failure(lang, error, text.errorAdd);
  }
}

export async function updateItemAction(
  language: unknown,
  lineId: unknown,
  quantity: unknown,
): Promise<CartActionResult> {
  const lang = toLocale(language);
  const { cart: text } = getDictionary(lang);
  if (!isId(lineId) || !isQty(quantity, 0)) {
    return { ok: false, error: text.errorQuantity };
  }
  try {
    return { ok: true, cart: await updateCartLine(lang, lineId, quantity) };
  } catch (error) {
    return failure(lang, error, text.errorUpdate);
  }
}
