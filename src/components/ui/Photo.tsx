"use client";

import { type ImageProps } from "next/image";
import { useState } from "react";
import { SoftImage } from "./SoftImage";

/**
 * Remote photo that removes itself if it fails to load, revealing whatever is
 * underneath (the prototype's illustration) — same as its `onerror` handler.
 */
export function Photo(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <SoftImage {...props} onError={() => setFailed(true)} />;
}
