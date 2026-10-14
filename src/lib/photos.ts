/**
 * Bundled product photos (public/photos). Browsers and the image optimizer
 * cache photos by URL, so bump PHOTO_VERSION whenever a photo there changes:
 * every URL changes with it and visitors get the new version straight away.
 * next.config.ts only allows this exact query string.
 */
export const PHOTO_VERSION = "3";

export const photoUrl = (path: string) => `/photos/${path}?v=${PHOTO_VERSION}`;
