import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryGrid, PhotoCredit } from "@/components/collection/CategoryGrid";
import { PageIntro } from "@/components/content/PageIntro";
import { alternatesFor, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getCollections } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/[lang]/collections">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { collections } = getDictionary(lang);
  return {
    title: collections.metaTitle,
    description: fmt(collections.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/collections"),
  };
}

export default async function CollectionsPage(props: PageProps<"/[lang]/collections">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).collections;
  const collections = await getCollections(lang);
  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} />
      <section className="block" aria-label={t.listLabel}>
        <CategoryGrid collections={collections} />
        <PhotoCredit />
      </section>
    </div>
  );
}
