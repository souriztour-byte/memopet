import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/content/PageIntro";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { getCollections, getProducts } from "@/lib/commerce";
import { parseSort } from "@/lib/commerce/sort";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse every MimoPets product — our bestselling paw washer and cozy comfort beds.",
  alternates: { canonical: "/shop" },
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage(props: PageProps<"/shop">) {
  const sp = await props.searchParams;
  const query = (first(sp.q) ?? "").trim().slice(0, 100);
  const sort = parseSort(first(sp.sort));

  const collections = await getCollections();
  const categoryParam = first(sp.category);
  const category = collections.some((c) => c.handle === categoryParam) ? categoryParam! : null;

  const products = await getProducts({ query, sort, collection: category ?? undefined });
  const categoryTitle = collections.find((c) => c.handle === category)?.title;

  return (
    <div className="wrap">
      <PageIntro
        eyebrow="Shop"
        title={categoryTitle ?? "All products"}
        lead="A small, focused collection — starting with our bestselling paw washer."
      />
      <section className="block" aria-label="Products">
        <ShopToolbar
          query={query}
          sort={sort}
          category={category}
          categories={collections.map((c) => ({ handle: c.handle, title: c.title }))}
        />
        <p className="small" aria-live="polite" style={{ marginBottom: 18 }}>
          {products.length} {products.length === 1 ? "product" : "products"}
          {query ? <> for &ldquo;{query}&rdquo;</> : null}
        </p>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="note">
            <p>
              <strong>No products found.</strong> Try a different search, or{" "}
              <Link href="/shop" className="text-link">
                see all products
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
