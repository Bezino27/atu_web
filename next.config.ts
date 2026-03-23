import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "178.104.54.84",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;