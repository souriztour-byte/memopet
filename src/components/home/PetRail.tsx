"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useI18n } from "@/i18n/I18nProvider";
import { isFor, petsFor, type Pet } from "@/lib/commerce/pets";
import type { ProductSummary } from "@/lib/commerce/types";
import { useDragScroll } from "./useDragScroll";
import { useRailFocus } from "./useRailFocus";
import styles from "./PetRail.module.css";

/**
 * The collection as a row you can drag (mouse), swipe (touch) or step
 * through with the arrows, with an All / Dogs / Cats switch. Cards re-enter
 * one after another when the switch changes.
 */
export function PetRail({
  products,
  viewAllHref,
}: {
  products: ProductSummary[];
  viewAllHref: string;
}) {
  const { dict } = useI18n();
  const t = dict.home;
  const [pet, setPet] = useState<Pet>("all");
  const rail = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState({ start: 0, size: 1 });
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });
  useDragScroll(rail);
  useRailFocus(rail, "(max-width: 720px)", pet);

  const shown = products.filter((p) => isFor(p, pet));
  const pets = petsFor(products);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const size = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
      setProgress({
        start: max > 0 ? (el.scrollLeft / max) * (1 - size) : 0,
        size,
      });
      setEdges({ atStart: el.scrollLeft < 4, atEnd: el.scrollLeft > max - 4 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [pet]);

  const choose = (next: Pet) => {
    setPet(next);
    rail.current?.scrollTo({ left: 0 });
  };
  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        <div role="group" aria-label={t.petLabel} className={styles.switch}>
          {pets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={pet === p}
              onClick={() => choose(p)}
            >
              {p === "all" ? t.petAll : p === "dogs" ? t.petDogs : t.petCats}
            </button>
          ))}
        </div>
        <div className={styles.arrows} hidden={edges.atStart && edges.atEnd}>
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.atStart}
            aria-label={t.prev}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.atEnd}
            aria-label={t.next}
          >
            →
          </button>
        </div>
      </div>

      {/* The key replays the cards' entrance when the switch changes. */}
      <div key={pet} ref={rail} className={styles.rail}>
        {shown.map((p, i) => (
          <div
            key={p.id}
            className={styles.item}
            style={{ "--i": i } as React.CSSProperties}
          >
            <ProductCard product={p} preload={i < 2} />
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <span
          className={styles.track}
          aria-hidden="true"
          data-full={progress.size >= 0.999 || undefined}
        >
          <span
            style={{
              left: `${progress.start * 100}%`,
              width: `${progress.size * 100}%`,
            }}
          />
        </span>
        <Link href={viewAllHref} className={styles.viewAll}>
          {t.viewAll} →
        </Link>
      </div>
    </div>
  );
}
