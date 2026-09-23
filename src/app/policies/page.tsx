import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/content/PageIntro";
import { ArrowIcon } from "@/components/ui/icons";
import { localPolicies } from "@/content/policies";
import styles from "./policies.module.css";

export const metadata: Metadata = {
  title: "Policies",
  description: "MimoPets shipping, refund, privacy and terms of service policies.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <div className="wrap">
      <PageIntro eyebrow="Policies" title="Store policies" lead="The fine print, kept simple." />
      <section className="block" aria-label="Policies">
        <ul className={styles.cards}>
          {localPolicies.map((p) => (
            <li key={p.handle}>
              <Link href={`/policies/${p.handle}`} className={styles.card}>
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
