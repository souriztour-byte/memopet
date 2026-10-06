import type { ReactNode } from "react";
import styles from "./PageIntro.module.css";

type Props = {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
};

/** Top of every standalone page: eyebrow, heading and optional lead. */
export function PageIntro({ eyebrow, title, lead, children }: Props) {
  return (
    <header className={styles.intro}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
      {children}
    </header>
  );
}
