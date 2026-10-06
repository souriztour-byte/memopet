/**
 * Store-agnostic data shapes. Both the Shopify provider and the local demo
 * catalog return these, so pages never talk to Shopify types directly.
 */

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

/** Built-in SVG art from the prototype, used when a product has no photo. */
export type Illustration = "care" | "beds" | "toys" | "collars";

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
};

export type ProductSummary = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  /** Small label on the card, e.g. "Best seller" (Shopify tag `badge:…`). */
  badge: string | null;
  /** Who the product is for, e.g. "Cat & dog" (Shopify tag `pet:…`). */
  petType: string | null;
  illustration: Illustration;
  tile: "t1" | "t2" | "t3";
  /** Set when the product can be added straight from a card. */
  singleVariantId: string | null;
  updatedAt: string | null;
};

export type Product = ProductSummary & {
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  variants: ProductVariant[];
  images: Image[];
  seo: { title: string | null; description: string | null };
  vendor: string | null;
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image | null;
  seo: { title: string | null; description: string | null };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money; amountPerQuantity: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    image: Image | null;
    product: {
      handle: string;
      title: string;
      illustration: Illustration;
      tile: "t1" | "t2" | "t3";
    };
  };
};

export type Cart = {
  id: string | null;
  /** Shopify-hosted checkout. `null` in demo mode. */
  checkoutUrl: string | null;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};

export type ProductSort = "featured" | "best-selling" | "price-asc" | "price-desc" | "newest";

export type ProductQuery = {
  query?: string;
  sort?: ProductSort;
  collection?: string;
  limit?: number;
};

export type PolicyHandle =
  | "shipping-policy"
  | "refund-policy"
  | "privacy-policy"
  | "terms-of-service";

export type ShopPolicy = {
  handle: PolicyHandle;
  title: string;
  /** HTML body as written in Shopify admin → Settings → Policies. */
  body: string;
};
