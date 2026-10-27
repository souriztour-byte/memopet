"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that fades in from a soft blur once it has loaded, instead of
 * appearing all at once (styles: `.soft-img` in globals.css). Without
 * JavaScript, or with reduced motion, it simply shows.
 */
export function SoftImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={props.alt}
      className={className ? `soft-img ${className}` : "soft-img"}
      data-loaded={loaded || undefined}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
