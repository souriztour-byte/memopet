import { kindOf } from "@/lib/commerce/presentation";
import type { Illustration } from "@/lib/commerce/types";

/**
 * "One good day": the shop is told as a pet's day. Each product belongs to a
 * moment of it, and carries a number in the order the day meets them.
 */
export type Moment = "dawn" | "walk" | "clean" | "nap" | "night";
export type ProductMoment = "clean" | "nap" | "night";

export const DAY_TIMES: Record<Moment, string> = {
  dawn: "07:30",
  walk: "08:15",
  clean: "08:45",
  nap: "14:00",
  night: "22:30",
};

export type DayEntry<T> = {
  product: T;
  moment: ProductMoment;
  /** "01", "02"… in the order of the day. */
  number: string;
  time: string;
};

/**
 * Places products in the day: paw washers after the walk, beds at nap time,
 * and the sleeping bag (or, without one, the last bed) at night.
 */
export function dayLineup<T extends { illustration: Illustration }>(products: T[]): DayEntry<T>[] {
  const clean = products.filter((p) => kindOf(p.illustration) === "care");
  const comfort = products.filter((p) => kindOf(p.illustration) !== "care");
  let night = comfort.filter((p) => p.illustration === "sleeping-bag");
  if (!night.length && comfort.length > 1) night = comfort.slice(-1);
  const nap = comfort.filter((p) => !night.includes(p));
  const groups: [ProductMoment, T[]][] = [
    ["clean", clean],
    ["nap", nap],
    ["night", night],
  ];
  let n = 0;
  return groups.flatMap(([moment, items]) =>
    items.map((product) => ({
      product,
      moment,
      number: String(++n).padStart(2, "0"),
      time: DAY_TIMES[moment],
    })),
  );
}

/** The opening sentences of a description, short enough to sit beside a photo. */
export function opening(text: string, max = 210): string {
  const sentences = text.replace(/\s+/g, " ").trim().match(/[^.!?]+[.!?]+/g) ?? [];
  let out = "";
  for (const s of sentences) {
    if (out && (out + s).length > max) break;
    out += s;
    if (out.length > max * 0.55) break;
  }
  return out.trim() || text.slice(0, max).trim();
}
