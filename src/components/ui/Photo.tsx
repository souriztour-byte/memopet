"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * Remote photo that removes itself if it fails to load, revealing whatever is
 * underneath (the prototype's illustration) — same as its `onerror` handler.
 */
export function Photo(props: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  // eslint-disable-next-line jsx-a11y/alt-text -- alt is passed through props
  return <Image {...props} onError={() => setFailed(true)} />;
}
