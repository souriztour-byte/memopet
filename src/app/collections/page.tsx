import type { Metadata } from "next";
import { CategoryGrid, PhotoCredit } from "@/components/collection/CategoryGrid";
import { PageIntro } from "@/components/content/PageIntro";
import { getCollections } from "@/lib/commerce";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Categories",
  description: "Shop MimoPets by category: grooming & care, and comfort & beds.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  return (
    <div className="wrap">
      <PageIntro eyebrow="Categories" title="Shop by category" />
      <section className="block" aria-label="Categories">
        <CategoryGrid collections={collections} />
        <PhotoCredit />
      </section>
    </div>
  );
}
