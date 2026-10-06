import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/content/FaqList";
import { PageIntro } from "@/components/content/PageIntro";
import { getFaqGroups } from "@/content/faq";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { rich } from "@/i18n/rich";
import styles from "./faq.module.css";

export async function generateMetadata(props: PageProps<"/[lang]/faq">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { faq } = getDictionary(lang);
  return {
    title: faq.metaTitle,
    description: faq.metaDescription,
    alternates: alternatesFor(lang, "/faq"),
  };
}

export default async function FaqPage(props: PageProps<"/[lang]/faq">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).faq;
  const faqGroups = getFaqGroups(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: faqGroups.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.text },
      })),
    ),
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <nav aria-label={t.topics} className={styles.topics}>
        {faqGroups.map((g) => (
          <a key={g.id} href={`#${g.id}`} className="pill">
            {g.title}
          </a>
        ))}
      </nav>
      {faqGroups.map((group) => (
        <section key={group.id} id={group.id} className={styles.group} aria-labelledby={`${group.id}-title`}>
          <h2 id={`${group.id}-title`} className={styles.groupTitle}>
            {group.title}
          </h2>
          <FaqList items={group.items} />
        </section>
      ))}
      <section className="block">
        <div className="note">
          <p>
            <strong>{t.stillQuestion}</strong>{" "}
            {rich(t.getInTouch, {
              link: (
                <Link href={localizePath(lang, "/contact")} className="text-link">
                  {t.getInTouchLink}
                </Link>
              ),
            })}
          </p>
        </div>
      </section>
    </div>
  );
}
