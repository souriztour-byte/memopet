import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/** Lets phones save the shop to the home screen with its name, colours and icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#6C4AB6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
