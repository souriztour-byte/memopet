import type {
  Cart,
  Collection,
  Product,
  ProductQuery,
  ProductSummary,
} from "@/lib/commerce/types";
import type { Locale } from "@/i18n/config";
import { getDemoCatalog } from "./catalog";

const toSummary = ({
  id,
  handle,
  title,
  availableForSale,
  featuredImage,
  priceRange,
  badge,
  petType,
  illustration,
  tile,
  singleVariantId,
  updatedAt,
}: Product): ProductSummary => ({
  id,
  handle,
  title,
  availableForSale,
  featuredImage,
  priceRange,
  badge,
  petType,
  illustration,
  tile,
  singleVariantId,
  updatedAt,
});

const price = (p: ProductSummary) => Number(p.priceRange.minVariantPrice.amount);

export async function getProducts(
  lang: Locale,
  { query, sort = "featured", collection, limit = 100 }: ProductQuery = {},
): Promise<ProductSummary[]> {
  const q = query?.trim().toLowerCase();
  const list = getDemoCatalog(lang)
    .products.filter((p) => !collection || p.collections.includes(collection))
    .filter((p) => !q || `${p.title} ${p.petType ?? ""}`.toLowerCase().includes(q))
    .map(toSummary);
  if (sort === "price-asc") list.sort((a, b) => price(a) - price(b));
  if (sort === "price-desc") list.sort((a, b) => price(b) - price(a));
  return list.slice(0, limit);
}

export async function getProduct(lang: Locale, handle: string): Promise<Product | null> {
  const found = getDemoCatalog(lang).products.find((p) => p.handle === handle);
  if (!found) return null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { collections, ...product } = found;
  return product;
}

export async function getProductHandles() {
  // Handles are the same in every language.
  return getDemoCatalog("en").products.map((p) => ({ handle: p.handle, updatedAt: p.updatedAt }));
}

export async function getCollections(lang: Locale): Promise<Collection[]> {
  return getDemoCatalog(lang).collections;
}

export async function getCollection(lang: Locale, handle: string): Promise<Collection | null> {
  return getDemoCatalog(lang).collections.find((c) => c.handle === handle) ?? null;
}

/* ─── Cart (lines are kept in a cookie by lib/commerce) ──────────────── */

export type DemoLine = { merchandiseId: string; quantity: number };

export function findVariant(merchandiseId: string, lang: Locale = "en") {
  for (const product of getDemoCatalog(lang).products) {
    const variant = product.variants.find((v) => v.id === merchandiseId);
    if (variant) return { product, variant };
  }
  return null;
}

export function buildCart(lines: DemoLine[], lang: Locale): Cart {
  const cartLines: Cart["lines"] = [];
  let subtotal = 0;
  let totalQuantity = 0;
  let currencyCode = "USD";

  for (const line of lines) {
    const match = findVariant(line.merchandiseId, lang);
    if (!match) continue;
    const { product, variant } = match;
    const unit = Number(variant.price.amount);
    currencyCode = variant.price.currencyCode;
    subtotal += unit * line.quantity;
    totalQuantity += line.quantity;
    cartLines.push({
      id: variant.id,
      quantity: line.quantity,
      cost: {
        amountPerQuantity: variant.price,
        totalAmount: { amount: (unit * line.quantity).toFixed(2), currencyCode },
      },
      merchandise: {
        id: variant.id,
        title: variant.title,
        selectedOptions: variant.selectedOptions,
        image: variant.image ?? product.featuredImage,
        product: {
          handle: product.handle,
          title: product.title,
          illustration: product.illustration,
          tile: product.tile,
        },
      },
    });
  }

  const total = { amount: subtotal.toFixed(2), currencyCode };
  return {
    id: null,
    checkoutUrl: null,
    totalQuantity,
    cost: { subtotalAmount: total, totalAmount: total },
    lines: cartLines,
  };
}
