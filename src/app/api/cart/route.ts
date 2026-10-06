import type { NextRequest } from "next/server";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getCart } from "@/lib/commerce";

/** Current visitor's cart (read from the cart cookie), in `?lang=`. Never cached. */
export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("lang");
  const lang = hasLocale(param) ? param : defaultLocale;
  try {
    const cart = await getCart(lang);
    return Response.json({ cart }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[cart]", error);
    return Response.json({ cart: null, error: "Cart unavailable" }, { status: 502 });
  }
}
