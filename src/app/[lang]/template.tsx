import { ViewTransition } from "react";

/**
 * A template remounts on every navigation (a layout doesn't), so pages fade
 * out and the new one rises in. Styles: "Page transitions" in globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
