import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { PageIntro } from "@/components/content/PageIntro";
import { alternatesFor, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata(props: PageProps<"/[lang]/cart">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  return {
    title: getDictionary(lang).cart.metaTitle,
    robots: { index: false },
    alternates: alternatesFor(lang, "/cart"),
  };
}

export default async function CartPage(props: PageProps<"/[lang]/cart">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).cart;
  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} />
      <section className="block" aria-label={t.contentsLabel}>
        <CartPageContent />
      </section>
    </div>
  );
}
