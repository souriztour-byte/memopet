import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCollection, getCollections, getProducts } from "@/lib/commerce";

export const revalidate = 3600;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata(props: PageProps<"/collections/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const collection = await getCollection(handle);
  if (!collection) return {};
  return {
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description || undefined,
    alternates: { canonical: `/collections/${collection.handle}` },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[handle]">) {
  const { handle } = await props.params;
  const collection = await getCollection(handle);
  if (!collection) notFound();

  const products = await getProducts({ collection: collection.handle });

  return (
    <div className="wrap">
      <PageIntro eyebrow="Category" title={collection.title} lead={collection.description || undefined}>
        <p className="small" style={{ marginTop: 16 }}>
          <Link href="/collections" className="text-link">
            ← All categories
          </Link>
        </p>
      </PageIntro>
      <section className="block" aria-label={`${collection.title} products`}>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="note">
            <p>
              <strong>No products in this category yet.</strong>{" "}
              <Link href="/shop" className="text-link">
                Browse all products
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
