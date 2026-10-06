import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/shopify/provider";

/**
 * Shopify webhook endpoint. Point product and collection webhooks
 * (create / update / delete) at https://<your-site>/api/revalidate and set
 * SHOPIFY_WEBHOOK_SECRET to the signing secret Shopify shows for them.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "Webhook secret not configured" }, { status: 501 });

  const body = await request.text();
  const signature = request.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const received = Buffer.from(signature, "base64");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";
  const tags = topic.startsWith("products/")
    ? [TAGS.products]
    : topic.startsWith("collections/")
      ? [TAGS.collections, TAGS.products]
      : [];

  for (const tag of tags) revalidateTag(tag, "max");
  return Response.json({ revalidated: tags, topic });
}
