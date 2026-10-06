import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product and collection media served by Shopify.
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Lifestyle photography carried over from the prototype.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
