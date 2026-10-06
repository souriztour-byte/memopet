import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalPolicies, policyHandles } from "@/content/policies";
import { alternatesFor, hasLocale, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fmt, formatDate } from "@/i18n/format";
import { resolvePolicy } from "@/lib/content/policies";
import { policySettings } from "@/lib/content/policy-settings";
import styles from "../policies.module.css";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return policyHandles.map((handle) => ({ handle }));
}

export async function generateMetadata(props: PageProps<"/[lang]/policies/[handle]">): Promise<Metadata> {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) return {};
  const policy = await resolvePolicy(lang, handle);
  if (!policy) return {};
  return {
    title: policy.source === "shopify" ? policy.shopify.title : policy.meta.title,
    description: policy.meta.description,
    alternates: alternatesFor(lang, `/policies/${policy.meta.handle}`),
  };
}

export default async function PolicyPage(props: PageProps<"/[lang]/policies/[handle]">) {
  const { lang, handle } = await props.params;
  if (!hasLocale(lang)) notFound();
  const policy = await resolvePolicy(lang, handle);
  if (!policy) notFound();
  const dict = getDictionary(lang);

  const title = policy.source === "shopify" ? policy.shopify.title : policy.meta.title;
  const Body = policy.meta.Body;

  return (
    <div className={`wrap ${styles.layout}`}>
      <nav aria-label={dict.policies.listLabel} className={styles.side}>
        <p className="eyebrow">{dict.policies.eyebrow}</p>
        <ul>
          {getLocalPolicies(lang).map((p) => (
            <li key={p.handle}>
              <Link
                href={localizePath(lang, `/policies/${p.handle}`)}
                aria-current={p.handle === policy.meta.handle ? "page" : undefined}
              >
                {p.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href={localizePath(lang, "/faq")}>{dict.common.faq}</Link>
          </li>
        </ul>
      </nav>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{title}</h1>
          {policy.source === "local" ? (
            <p className="small">
              {fmt(dict.policies.lastUpdated, { date: formatDate(lang, policySettings.lastUpdated) })}
            </p>
          ) : null}
        </header>
        {policy.source === "shopify" ? (
          <div className="prose" dangerouslySetInnerHTML={{ __html: policy.shopify.body }} />
        ) : (
          <div className="prose">
            <Body />
          </div>
        )}
      </article>
    </div>
  );
}
