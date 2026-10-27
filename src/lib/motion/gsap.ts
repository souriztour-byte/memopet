"use client";

import { useEffect, type RefObject } from "react";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/** Shared easing and timing for GSAP scenes (CSS uses the matching --ease-* tokens). */
export const EASE = { out: "expo.out", inOut: "power2.inOut" } as const;

let loading: Promise<{ gsap: Gsap; ScrollTrigger: ScrollTriggerType }> | null = null;

/** Loads GSAP and ScrollTrigger once, on first use, so pages without scroll scenes never download them. */
function loadGsap() {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Runs a GSAP scroll scene on an element, scoped so everything it creates is
 * undone when the component unmounts. Skipped entirely with reduced motion:
 * the page then shows its plain, static layout.
 */
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  // May return a cleanup function, run when the scene is undone.
  build: (tools: { gsap: Gsap; ScrollTrigger: ScrollTriggerType; root: HTMLElement }) => void | (() => void),
  deps: unknown[] = [],
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    let ctx: ReturnType<Gsap["context"]> | null = null;
    let cleanup: void | (() => void);
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        cleanup = build({ gsap, ScrollTrigger, root });
      }, root);
      // Images above may still be loading; measure again once they're in.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      cancelled = true;
      cleanup?.();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
