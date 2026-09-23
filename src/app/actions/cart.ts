"use server";

import { addToCart, isUserFacingError, MAX_LINE_QUANTITY, updateCartLine } from "@/lib/commerce";
import type { Cart } from "@/lib/commerce/types";

export type CartActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

const isId = (v: unknown): v is string => typeof v === "string" && v.length > 0 && v.length < 256;
const isQty = (v: unknown, min: number): v is number =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= MAX_LINE_QUANTITY;

function failure(error: unknown, fallback: string): CartActionResult {
  console.error("[cart]", error);
  return { ok: false, error: isUserFacingError(error) ? error.message : fallback };
}

export async function addItemAction(merchandiseId: unknown, quantity: unknown = 1): Promise<CartActionResult> {
  if (!isId(merchandiseId) || !isQty(quantity, 1)) {
    return { ok: false, error: "Please choose a product option and quantity." };
  }
  try {
    return { ok: true, cart: await addToCart(merchandiseId, quantity) };
  } catch (error) {
    return failure(error, "We couldn't add that to your cart. Please try again.");
  }
}

export async function updateItemAction(lineId: unknown, quantity: unknown): Promise<CartActionResult> {
  if (!isId(lineId) || !isQty(quantity, 0)) {
    return { ok: false, error: "That quantity isn't valid." };
  }
  try {
    return { ok: true, cart: await updateCartLine(lineId, quantity) };
  } catch (error) {
    return failure(error, "We couldn't update your cart. Please try again.");
  }
}
