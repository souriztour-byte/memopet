import type { Locale } from "@/i18n/config";
import { faqGroups as en } from "./en";
import { faqGroups as es } from "./es";
import type { FaqGroup } from "./types";

export type { FaqGroup, FaqItem } from "./types";

const groups: Record<Locale, FaqGroup[]> = { en, es };

/** FAQ in the given language. Question ids (and page anchors) are shared. */
export const getFaqGroups = (lang: Locale): FaqGroup[] => groups[lang];
