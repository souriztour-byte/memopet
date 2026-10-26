import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/** Lets phones save the shop to the home screen with its name, colours and icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    start_url: "/",
    display: "standalone",
    background_color: "#0F0E0D",
    theme_color: "#0F0E0D",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
