import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product share images read the bundled demo photos from disk.
  outputFileTracingIncludes: {
    "/\\[lang\\]/products/\\[handle\\]/opengraph-image*": ["./public/photos/**/*"],
  },
  images: {
    // 90 for product and category photos (fine textures), 75 for everything else.
    qualities: [75, 90],
    remotePatterns: [
      // Product and collection media served by Shopify.
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Lifestyle photography carried over from the prototype.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
