/**
 * Store-wide settings. Anything that is a business fact (contact details,
 * legal entity) comes from environment variables so nothing is invented in
 * code — when a value is missing the UI says "Coming soon" instead, exactly
 * like the prototype did.
 */

const clean = (value: string | undefined) => {
  const v = value?.trim();
  return v ? v : null;
};

const instagramHandle = clean(process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE)?.replace(/^@/, "") ?? null;

export const siteConfig = {
  name: "MimoPets",
  tagline: "Little things. Happier pets.",
  description:
    "Explore MimoPets: our bestselling paw washer, plus cozy comfort beds for cats and dogs.",
  url: clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000",
  announcement: "Our bestselling Paw Washer is here",
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

export const navLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/collections", label: "Categories" },
  { href: "/how-to-order", label: "How to order" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;
