"use server";

import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { saveDiscountCode, subscribeEmail } from "@/lib/commerce";
import type { Cart } from "@/lib/commerce/types";
import { offers } from "@/lib/content/offers";

export type WelcomeActionResult =
  | { ok: true; code: string; cart: Cart | null }
  | { ok: false; error: string };

// Deliberately loose: Shopify does the real validation.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Server Actions can't read the [lang] segment, so the client sends it.
const toLocale = (v: unknown): Locale => (typeof v === "string" && hasLocale(v) ? v : defaultLocale);

/** Saves the email for marketing and puts the welcome code on the shopper's cart. */
export async function subscribeAction(language: unknown, email: unknown): Promise<WelcomeActionResult> {
  const lang = toLocale(language);
  const { welcome: text } = getDictionary(lang);
  const address = typeof email === "string" ? email.trim() : "";
  if (address.length > 254 || !EMAIL.test(address)) return { ok: false, error: text.errorEmail };

  try {
    await subscribeEmail(address);
  } catch (error) {
    console.error("[welcome]", error);
    return { ok: false, error: text.errorGeneric };
  }

  const { code } = offers.welcome;
  try {
    return { ok: true, code, cart: await saveDiscountCode(lang, code) };
  } catch (error) {
    // Signed up all the same; the code can still be typed in at checkout.
    console.error("[welcome] could not add the code to the cart", error);
    return { ok: true, code, cart: null };
  }
}
