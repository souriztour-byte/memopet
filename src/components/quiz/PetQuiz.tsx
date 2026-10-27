"use client";

import Link from "next/link";
import { useState } from "react";
import { Price } from "@/components/product/Price";
import { ProductMedia } from "@/components/product/ProductMedia";
import { localizePath } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import type { ProductSummary } from "@/lib/commerce/types";
import { offers } from "@/lib/content/offers";
import { suggest, type Need, type Pet, type Weight } from "@/lib/content/quiz";
import styles from "./PetQuiz.module.css";

type Answers = { pet?: Pet; need?: Need; weight?: Weight };

/** Three questions, one at a time, then product and size suggestions. */
export function PetQuiz({ products }: { products: ProductSummary[] }) {
  const { lang, dict } = useI18n();
  const t = dict.quiz;
  const [answers, setAnswers] = useState<Answers>({});
  const steps = [
    { key: "pet", question: t.petQuestion, options: [["cat", t.cat], ["dog", t.dog]] },
    { key: "need", question: t.needQuestion, options: [["paws", t.needPaws], ["bed", t.needBed], ["both", t.needBoth]] },
    {
      key: "weight",
      question: t.weightQuestion,
      options: [["small", t.weightSmall], ["medium", t.weightMedium], ["large", t.weightLarge]],
    },
  ] as const;
  const index = steps.findIndex((s) => !answers[s.key]);
  const step = index === -1 ? null : steps[index];

  if (step) {
    return (
      <div className={styles.card}>
        <p className={styles.progress}>{fmt(t.step, { n: index + 1, total: steps.length })}</p>
        <h2 className={styles.question}>{step.question}</h2>
        <div className={styles.options}>
          {step.options.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={styles.option}
              onClick={() => setAnswers({ ...answers, [step.key]: value })}
            >
              {label}
            </button>
          ))}
        </div>
        {index > 0 ? (
          <button
            type="button"
            className={styles.back}
            onClick={() => setAnswers({ ...answers, [steps[index - 1].key]: undefined })}
          >
            ← {t.back}
          </button>
        ) : null}
      </div>
    );
  }

  const { picks, noBed } = suggest(answers.pet!, answers.need!, answers.weight!);
  const found = picks.flatMap((pick) => {
    const product = products.find((p) => p.handle === pick.handle);
    return product ? [{ pick, product }] : [];
  });

  return (
    <div className={styles.results} aria-live="polite">
      <h2 className={styles.question}>{t.resultTitle}</h2>
      {noBed ? <p className={styles.note}>{t.noBedForBigDogs}</p> : null}
      <ul className={styles.picks}>
        {found.map(({ pick, product }) => (
          <li key={product.id} className={styles.pick}>
            <span className={`${styles.pic} ${product.tile}`}>
              <ProductMedia image={product.featuredImage} illustration={product.illustration} alt={product.title} sizes="(max-width: 760px) 40vw, 240px" />
            </span>
            <span className={styles.pickText}>
              <b>{product.title}</b>
              <Price className={styles.price} min={product.priceRange.minVariantPrice} max={product.priceRange.maxVariantPrice} />
              <span className={styles.size}>{fmt(t.suggestedSize, { size: pick.size })}</span>
              <span className={styles.reason}>{fmt(t[pick.reason], pick.vars)}</span>
              <Link href={localizePath(lang, `/products/${product.handle}`)} className="btn btn-gold btn-sm">
                {t.viewProduct}
              </Link>
            </span>
          </li>
        ))}
      </ul>
      {found.length > 1 ? <p className={styles.note}>{fmt(t.bundleNote, { percent: offers.bundle.percent })}</p> : null}
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAnswers({})}>
        {t.restart}
      </button>
    </div>
  );
}
