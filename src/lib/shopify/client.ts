import "server-only";

const DEFAULT_API_VERSION = "2026-07";

function env(name: string) {
  const v = process.env[name]?.trim();
  return v ? v : undefined;
}

function storeDomain() {
  const raw = env("SHOPIFY_STORE_DOMAIN");
  if (!raw) return undefined;
  return raw.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function isShopifyConfigured() {
  return Boolean(
    storeDomain() &&
      (env("SHOPIFY_STOREFRONT_ACCESS_TOKEN") || env("SHOPIFY_STOREFRONT_PRIVATE_TOKEN")),
  );
}

export class ShopifyError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    /** True for Shopify `userErrors`, which are safe to show to shoppers. */
    readonly userFacing = false,
  ) {
    super(message);
    this.name = "ShopifyError";
  }
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  /** Cache tags for on-demand revalidation (see /api/revalidate). */
  tags?: string[];
  /** Seconds to cache; `false` disables caching (carts, mutations). */
  revalidate?: number | false;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

export async function storefrontFetch<T>(
  query: string,
  { variables, tags, revalidate = 3600 }: FetchOptions = {},
): Promise<T> {
  const domain = storeDomain();
  const version = env("SHOPIFY_STOREFRONT_API_VERSION") ?? DEFAULT_API_VERSION;
  const privateToken = env("SHOPIFY_STOREFRONT_PRIVATE_TOKEN");
  const publicToken = env("SHOPIFY_STOREFRONT_ACCESS_TOKEN");

  if (!domain || !(privateToken || publicToken)) {
    throw new ShopifyError("Shopify is not configured. See .env.example.");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (privateToken) headers["Shopify-Storefront-Private-Token"] = privateToken;
  else headers["X-Shopify-Storefront-Access-Token"] = publicToken!;

  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Shopify Storefront API responded with ${res.status}`, res.status);
  }

  const json = (await res.json()) as GraphQLResponse<T>;
  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Shopify Storefront API returned no data");
  }
  return json.data;
}
