import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { localPolicies, resolvePolicy } from "@/lib/content/policies";
import { policySettings } from "@/lib/content/policy-settings";
import styles from "../policies.module.css";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return localPolicies.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata(props: PageProps<"/policies/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const policy = await resolvePolicy(handle);
  if (!policy) return {};
  return {
    title: policy.source === "shopify" ? policy.shopify.title : policy.meta.title,
    description: policy.meta.description,
    alternates: { canonical: `/policies/${policy.meta.handle}` },
  };
}

export default async function PolicyPage(props: PageProps<"/policies/[handle]">) {
  const { handle } = await props.params;
  const policy = await resolvePolicy(handle);
  if (!policy) notFound();

  const title = policy.source === "shopify" ? policy.shopify.title : policy.meta.title;
  const Body = policy.meta.Body;

  return (
    <div className={`wrap ${styles.layout}`}>
      <nav aria-label="Policies" className={styles.side}>
        <p className="eyebrow">Policies</p>
        <ul>
          {localPolicies.map((p) => (
            <li key={p.handle}>
              <Link
                href={`/policies/${p.handle}`}
                aria-current={p.handle === policy.meta.handle ? "page" : undefined}
              >
                {p.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
        </ul>
      </nav>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1>{title}</h1>
          {policy.source === "local" ? (
            <p className="small">Last updated: {policySettings.lastUpdated}</p>
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
