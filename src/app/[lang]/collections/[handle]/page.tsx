import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { ProductGrid } from "@/components/product/ProductGrid";
import { alternatesFor, hasLocale, localizePath, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";

export const revalidate = 3600;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const lang: Locale = hasLocale(params.lang) ? params.lang : "en";
  const collections = await getCollections(lang);
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata(
  props: PageProps<"/[lang]/collections/[handle]">,
): Promise<Metadata> {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) return {};
  const collection = await getCollection(lang, handle);
  if (!collection) return {};
  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description || undefined,
    alternates: alternatesFor(lang, `/collections/${collection.handle}`),
  };
}

export default async function CollectionPage(props: PageProps<"/[lang]/collections/[handle]">) {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) notFound();
  const collection = await getCollection(lang, handle);
  if (!collection) notFound();
  const t = getDictionary(lang).collections;

  const products = await getProducts(lang, { collection: collection.handle });

  return (
    <div className="wrap">
      <PageIntro
        eyebrow={t.categoryEyebrow}
        title={collection.title}
        lead={collection.description || undefined}
      >
        <p className="small" style={{ marginTop: 16 }}>
          <Link href={localizePath(lang, "/collections")} className="text-link">
            {t.backToAll}
          </Link>
        </p>
      </PageIntro>
      <section className="block" aria-label={fmt(t.productsLabel, { title: collection.title })}>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="note">
            <p>
              <strong>{t.empty}</strong>{" "}
              <Link href={localizePath(lang, "/shop")} className="text-link">
                {t.browseAll}
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
