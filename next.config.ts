import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "178.104.54.84",
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;