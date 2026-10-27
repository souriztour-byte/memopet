"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorRing.module.css";

/**
 * Computers only: a thin gold ring that follows the mouse, grows over links
 * and buttons, and shows a word over elements marked `data-cursor` ("Drag",
 * "View"). The normal pointer stays visible. Off for touch screens and for
 * people who prefer reduced motion.
 */
export function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [state, setState] = useState<"off" | "idle" | "link">("off");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let frame = 0;
    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      frame = Math.abs(x - cx) + Math.abs(y - cy) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
      const el = e.target as Element;
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      setLabel(tagged?.dataset.cursor || null);
      setState(el.closest("a, button, [role=button], label, select, summary") ? "link" : "idle");
    };
    const leave = () => setState("off");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ring} className={styles.ring} data-state={state} data-label={label ? "" : undefined} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
