import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { PetQuiz } from "@/components/quiz/PetQuiz";
import { alternatesFor, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { getProducts } from "@/lib/commerce";
import { siteConfig } from "@/lib/config";

export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/[lang]/quiz">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { quiz } = getDictionary(lang);
  return {
    title: quiz.metaTitle,
    description: fmt(quiz.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/quiz"),
  };
}

export default async function QuizPage(props: PageProps<"/[lang]/quiz">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).quiz;
  const products = await getProducts(lang);
  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="block">
        <PetQuiz products={products} />
      </section>
    </div>
  );
}
