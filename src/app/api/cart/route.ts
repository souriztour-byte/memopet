import { getCart } from "@/lib/commerce";

/** Current visitor's cart (read from the cart cookie). Never cached. */
export async function GET() {
  try {
    const cart = await getCart();
    return Response.json({ cart }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[cart]", error);
    return Response.json({ cart: null, error: "Cart unavailable" }, { status: 502 });
  }
}
