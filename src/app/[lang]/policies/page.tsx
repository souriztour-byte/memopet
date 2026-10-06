import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/content/PageIntro";
import { ArrowIcon } from "@/components/ui/icons";
import { getLocalPolicies } from "@/content/policies";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt } from "@/i18n/format";
import { siteConfig } from "@/lib/config";
import styles from "./policies.module.css";

export async function generateMetadata(props: PageProps<"/[lang]/policies">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { policies } = getDictionary(lang);
  return {
    title: policies.metaTitle,
    description: fmt(policies.metaDescription, { name: siteConfig.name }),
    alternates: alternatesFor(lang, "/policies"),
  };
}

export default async function PoliciesPage(props: PageProps<"/[lang]/policies">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).policies;
  return (
    <div className="wrap">
      <PageIntro eyebrow={t.eyebrow} title={t.title} lead={t.lead} />
      <section className="block" aria-label={t.listLabel}>
        <ul className={styles.cards}>
          {getLocalPolicies(lang).map((p) => (
            <li key={p.handle}>
              <Link href={localizePath(lang, `/policies/${p.handle}`)} className={styles.card}>
                <span>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                </span>
                <span className={styles.arrow}>
                  <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
