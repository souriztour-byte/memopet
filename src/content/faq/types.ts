import type { ReactNode } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  /** Plain-text answer for FAQPage structured data. */
  text: string;
};

export type FaqGroup = {
  id: string;
  title: string;
  items: FaqItem[];
};
