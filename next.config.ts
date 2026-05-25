import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://178.104.54.84:8000/api";

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
      {
        protocol: "https",
        hostname: "atukosice.sk",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.atukosice.sk",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "api.ludimus.sk",
        pathname: "/media/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
