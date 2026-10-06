/**
 * Store-wide settings. Anything that is a business fact (contact details,
 * legal entity) comes from environment variables so nothing is invented in
 * code — when a value is missing the UI says "Coming soon" instead, exactly
 * like the prototype did. Interface text lives in `src/i18n/dictionaries`.
 */

const clean = (value: string | undefined) => {
  const v = value?.trim();
  return v ? v : null;
};

const instagramHandle = clean(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE)?.replace(/^@/, "") ?? null;

export const siteConfig = {
  name: "MimiPets",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  /** Handle of the hero product (the paw washer) — match it to the Shopify product handle. */
  featuredProductHandle:
    clean(process.env.NEXT_PUBLIC_FEATURED_PRODUCT_HANDLE) ?? "silicone-paw-washer",

  contact: {
    email: clean(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
    instagram: instagramHandle
      ? { handle: `@${instagramHandle}`, url: `https://www.instagram.com/${instagramHandle}/` }
      : null,
  },

  legal: {
    businessName: clean(process.env.NEXT_PUBLIC_LEGAL_BUSINESS_NAME),
    businessAddress: clean(process.env.NEXT_PUBLIC_LEGAL_BUSINESS_ADDRESS),
  },
} as const;

/** Header navigation; labels come from `dict.nav`. */
export const navLinks = [
  { href: "/shop", key: "shop" },
  { href: "/collections", key: "collections" },
  { href: "/how-to-order", key: "howToOrder" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
] as const;
