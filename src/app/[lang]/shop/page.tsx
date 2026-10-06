import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ShopToolbar } from "@/components/shop/ShopToolbar";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt, plural } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getCollections, getProducts } from "@/lib/commerce";
import { parseSort } from "@/lib/commerce/sort";
import { siteConfig } from "@/lib/config";

export async function generateMetadata(props: PageProps<"/[lang]/shop">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { shop } = getDictionary(lang);
  return {
    title: shop.metaTitle,
    description: fmt(shop.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/shop"),
  };
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage(props: PageProps<"/[lang]/shop">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).shop;

  const sp = await props.searchParams;
  const query = (first(sp.q) ?? "").trim().slice(0, 100);
  const sort = parseSort(first(sp.sort));

  const collections = await getCollections(lang);
  const categoryParam = first(sp.category);
  const category = collections.some((c) => c.handle === categoryParam) ? categoryParam! : null;

  const products = await getProducts(lang, { query, sort, collection: category ?? undefined });
  const categoryTitle = collections.find((c) => c.handle === category)?.title;

  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={categoryTitle ?? t.title} lead={t.lead} />
      <section className="block" aria-label={t.productsLabel}>
        <ShopToolbar
          query={query}
          sort={sort}
          category={category}
          categories={collections.map((c) => ({ handle: c.handle, title: c.title }))}
        />
        <p className="small" aria-live="polite" style={{ marginBottom: 18 }}>
          {plural(lang, products.length, t.count)}
          {query ? <> {fmt(t.forQuery, { query })}</> : null}
        </p>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="note">
            <p>
              <strong>{t.noResults}</strong>{" "}
              {rich(t.noResultsHint, {
                link: (
                  <Link href={localizePath(lang, "/shop")} className="text-link">
                    {t.seeAll}
                  </Link>
                ),
              })}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
