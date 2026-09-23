/**
 * Values used in the drafted policies. Review them — and the policy text in
 * src/content/policies — before launch; policies written in Shopify admin
 * (Settings → Policies) automatically replace the drafts.
 */
export const policySettings = {
  lastUpdated: "23 September 2026",
  /** Cancellation/withdrawal period for online orders (14 days is the EU/UK minimum). */
  returnWindowDays: 14,
} as const;
