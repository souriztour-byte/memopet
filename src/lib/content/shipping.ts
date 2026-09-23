/**
 * Fulfilment facts shown on product pages, the FAQ and the Shipping Policy.
 *
 * Source: the supplier listing for the paw washer (CJ Dropshipping), with the
 * "Ship to: ES" / "CJPacket Ordinary" shipping method selected:
 *   • Shipping from: China
 *   • Estimated processing time: 1–3 days for 90% of orders
 *   • Estimated delivery time: 8–18 days
 *
 * These are the supplier's estimates for Spain only. If you sell to other
 * countries, add their estimates to `deliveryEstimates` once confirmed.
 * Customer-facing shipping rates are set in Shopify and shown at checkout.
 */
export const shipping = {
  shipsFrom: "China",
  processing: {
    days: "1–3 days",
    share: "around 90% of orders",
  },
  deliveryEstimates: [{ destination: "Spain", days: "8–18 days", method: "Standard shipping" }],
} as const;

export const primaryEstimate = shipping.deliveryEstimates[0];
