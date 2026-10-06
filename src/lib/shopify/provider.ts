import "server-only";

import { shopifyLanguage, type Locale } from "@/i18n/config";
import { illustrationFor, readLocalizedTag, tileFor } from "@/lib/commerce/presentation";
import type {
  Cart,
  Collection,
  Image,
  Money,
  PolicyHandle,
  Product,
  ProductQuery,
  ProductSummary,
  ShopPolicy,
} from "@/lib/commerce/types";
import { ShopifyError, storefrontFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  COLLECTION_PRODUCTS_QUERY,
  COLLECTION_QUERY,
  COLLECTIONS_QUERY,
  POLICIES_QUERY,
  PRODUCT_HANDLES_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
} from "./queries";

export const TAGS = {
  products: "products",
  collections: "collections",
  policies: "policies",
} as const;

/* ─── Raw Storefront API shapes ──────────────────────────────────────── */

type Nodes<T> = { nodes: T[] };

type RawProductCard = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  updatedAt: string;
  featuredImage: Image | null;
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: Nodes<{ id: string; availableForSale: boolean }>;
};

type RawProduct = RawProductCard & {
  vendor: string;
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  options: { name: string; optionValues: { name: string }[] }[];
  images: Nodes<Image>;
  allVariants: Nodes<Product["variants"][number]>;
};

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: Cart["cost"];
  lines: Nodes<{
    id: string;
    quantity: number;
    cost: Cart["lines"][number]["cost"];
    merchandise: {
      id: string;
      title: string;
      selectedOptions: { name: string; value: string }[];
      image: Image | null;
      product: {
        handle: string;
        title: string;
        productType: string;
        tags: string[];
        featuredImage: Image | null;
      };
    };
  }>;
};

type UserErrors = { userErrors: { message: string }[] };

/* ─── Reshaping ──────────────────────────────────────────────────────── */

function reshapeSummary(p: RawProductCard, lang: Locale): ProductSummary {
  const illustration = illustrationFor(p.tags, p.productType, p.title);
  const variants = p.variants.nodes;
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    availableForSale: p.availableForSale,
    featuredImage: p.featuredImage,
    priceRange: p.priceRange,
    badge: readLocalizedTag(p.tags, "badge", lang),
    petType: readLocalizedTag(p.tags, "pet", lang),
    illustration,
    tile: tileFor(illustration),
    singleVariantId: variants.length === 1 && variants[0].availableForSale ? variants[0].id : null,
    updatedAt: p.updatedAt,
  };
}

function reshapeProduct(p: RawProduct, lang: Locale): Product {
  // Shopify always returns a "Title" option for products without variants.
  const options = p.options
    .map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) }))
    .filter((o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title"));
  return {
    ...reshapeSummary(p, lang),
    vendor: p.vendor || null,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    seo: p.seo,
    options,
    images: p.images.nodes,
    variants: p.allVariants.nodes,
  };
}

function reshapeCart(c: RawCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    cost: c.cost,
    lines: c.lines.nodes.map((line) => {
      const { product } = line.merchandise;
      const illustration = illustrationFor(product.tags, product.productType, product.title);
      return {
        id: line.id,
        quantity: line.quantity,
        cost: line.cost,
        merchandise: {
          id: line.merchandise.id,
          title: line.merchandise.title,
          selectedOptions: line.merchandise.selectedOptions.filter(
            (o) => !(o.name === "Title" && o.value === "Default Title"),
          ),
          image: line.merchandise.image ?? product.featuredImage,
          product: {
            handle: product.handle,
            title: product.title,
            illustration,
            tile: tileFor(illustration),
          },
        },
      };
    }),
  };
}

/* ─── Catalog ────────────────────────────────────────────────────────── */

const PRODUCT_SORT: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "BEST_SELLING", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED_AT", reverse: true },
};

const COLLECTION_SORT: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "COLLECTION_DEFAULT", reverse: false },
  "best-selling": { sortKey: "BEST_SELLING", reverse: false },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  newest: { sortKey: "CREATED", reverse: true },
};

export async function getProducts(
  lang: Locale,
  { query, sort = "featured", collection, limit = 100 }: ProductQuery = {},
): Promise<ProductSummary[]> {
  const language = shopifyLanguage[lang];
  if (collection) {
    const { sortKey, reverse } = COLLECTION_SORT[sort] ?? COLLECTION_SORT.featured;
    const data = await storefrontFetch<{
      collection: { products: Nodes<RawProductCard> } | null;
    }>(COLLECTION_PRODUCTS_QUERY, {
      variables: { handle: collection, first: limit, sortKey, reverse, language },
      tags: [TAGS.collections, TAGS.products],
    });
    const products = (data.collection?.products.nodes ?? []).map((p) => reshapeSummary(p, lang));
    // Collection product lists have no text search argument; filter here.
    const q = query?.trim().toLowerCase();
    return q ? products.filter((p) => p.title.toLowerCase().includes(q)) : products;
  }

  const { sortKey, reverse } = PRODUCT_SORT[sort] ?? PRODUCT_SORT.featured;
  const q = query?.trim();
  const data = await storefrontFetch<{ products: Nodes<RawProductCard> }>(PRODUCTS_QUERY, {
    variables: {
      first: limit,
      query: q || null,
      sortKey: q && sort === "featured" ? "RELEVANCE" : sortKey,
      reverse,
      language,
    },
    tags: [TAGS.products],
  });
  return data.products.nodes.map((p) => reshapeSummary(p, lang));
}

export async function getProduct(lang: Locale, handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: RawProduct | null }>(PRODUCT_QUERY, {
    variables: { handle, language: shopifyLanguage[lang] },
    tags: [TAGS.products],
  });
  return data.product ? reshapeProduct(data.product, lang) : null;
}

export async function getProductHandles(): Promise<{ handle: string; updatedAt: string | null }[]> {
  const data = await storefrontFetch<{ products: Nodes<{ handle: string; updatedAt: string }> }>(
    PRODUCT_HANDLES_QUERY,
    { variables: { first: 250 }, tags: [TAGS.products] },
  );
  return data.products.nodes;
}

export async function getCollections(lang: Locale): Promise<Collection[]> {
  const data = await storefrontFetch<{ collections: Nodes<Collection> }>(COLLECTIONS_QUERY, {
    variables: { first: 50, language: shopifyLanguage[lang] },
    tags: [TAGS.collections],
  });
  // Convention: prefix a handle with "hidden-" to keep it off the storefront.
  return data.collections.nodes.filter(
    (c) => !c.handle.startsWith("hidden-") && c.handle !== "frontpage",
  );
}

export async function getCollection(lang: Locale, handle: string): Promise<Collection | null> {
  const data = await storefrontFetch<{ collection: Collection | null }>(COLLECTION_QUERY, {
    variables: { handle, language: shopifyLanguage[lang] },
    tags: [TAGS.collections],
  });
  return data.collection;
}

/* ─── Policies ───────────────────────────────────────────────────────── */

type RawPolicy = { title: string; body: string } | null;

export async function getShopPolicies(
  lang: Locale,
): Promise<Partial<Record<PolicyHandle, ShopPolicy>>> {
  const { shop } = await storefrontFetch<{
    shop: {
      privacyPolicy: RawPolicy;
      refundPolicy: RawPolicy;
      shippingPolicy: RawPolicy;
      termsOfService: RawPolicy;
    };
  }>(POLICIES_QUERY, { variables: { language: shopifyLanguage[lang] }, tags: [TAGS.policies] });

  const out: Partial<Record<PolicyHandle, ShopPolicy>> = {};
  const add = (handle: PolicyHandle, p: RawPolicy) => {
    if (p?.body?.trim()) out[handle] = { handle, title: p.title, body: p.body };
  };
  add("privacy-policy", shop.privacyPolicy);
  add("refund-policy", shop.refundPolicy);
  add("shipping-policy", shop.shippingPolicy);
  add("terms-of-service", shop.termsOfService);
  return out;
}

/* ─── Cart ───────────────────────────────────────────────────────────── */

function assertNoUserErrors(result: UserErrors) {
  if (result.userErrors.length) {
    throw new ShopifyError(result.userErrors.map((e) => e.message).join("; "), undefined, true);
  }
}

export async function getCart(lang: Locale, cartId: string): Promise<Cart | null> {
  const data = await storefrontFetch<{ cart: RawCart | null }>(CART_QUERY, {
    variables: { cartId, language: shopifyLanguage[lang] },
    revalidate: false,
  });
  return data.cart ? reshapeCart(data.cart) : null;
}

/** Creates the cart in the shopper's language, so Shopify checkout opens in it too. */
export async function createCart(
  lang: Locale,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefrontFetch<{ cartCreate: UserErrors & { cart: RawCart } }>(
    CART_CREATE_MUTATION,
    { variables: { lines, language: shopifyLanguage[lang] }, revalidate: false },
  );
  assertNoUserErrors(data.cartCreate);
  return reshapeCart(data.cartCreate.cart);
}

export async function addCartLines(
  lang: Locale,
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesAdd: UserErrors & { cart: RawCart } }>(
    CART_LINES_ADD_MUTATION,
    { variables: { cartId, lines, language: shopifyLanguage[lang] }, revalidate: false },
  );
  assertNoUserErrors(data.cartLinesAdd);
  return reshapeCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  lang: Locale,
  cartId: string,
  lines: { id: string; quantity: number }[],
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesUpdate: UserErrors & { cart: RawCart } }>(
    CART_LINES_UPDATE_MUTATION,
    { variables: { cartId, lines, language: shopifyLanguage[lang] }, revalidate: false },
  );
  assertNoUserErrors(data.cartLinesUpdate);
  return reshapeCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(
  lang: Locale,
  cartId: string,
  lineIds: string[],
): Promise<Cart> {
  const data = await storefrontFetch<{ cartLinesRemove: UserErrors & { cart: RawCart } }>(
    CART_LINES_REMOVE_MUTATION,
    { variables: { cartId, lineIds, language: shopifyLanguage[lang] }, revalidate: false },
  );
  assertNoUserErrors(data.cartLinesRemove);
  return reshapeCart(data.cartLinesRemove.cart);
}
