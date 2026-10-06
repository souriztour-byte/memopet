import { Fragment, type ReactNode } from "react";

/**
 * Fills `{name}` placeholders with elements, so a translated sentence keeps
 * its own word order around links: rich("See our {link}.", { link: <Link … /> }).
 */
export function rich(template: string, parts: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/).map((chunk, i) => {
    const key = /^\{(\w+)\}$/.exec(chunk)?.[1];
    return key && key in parts ? <Fragment key={i}>{parts[key]}</Fragment> : chunk;
  });
}
