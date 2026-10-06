/**
 * Values used in the drafted policies. Review them — and the policy text in
 * src/content/<lang>/policies — before launch; policies written in Shopify
 * admin (Settings → Policies) automatically replace the drafts.
 */
export const policySettings = {
  /** ISO date, shown in each language's date format. */
  lastUpdated: "2026-10-06",
  /** Cancellation/withdrawal period for online orders (14 days is the EU/UK minimum). */
  returnWindowDays: 14,
} as const;
