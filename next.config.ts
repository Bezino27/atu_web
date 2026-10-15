
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const developmentHttpOrigins =
  " http://127.0.0.1:8000 http://localhost:8000";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  (isDev ? "http://127.0.0.1:8000/api" : "https://atukosice.sk/api");

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https:${
    isDev ? developmentHttpOrigins : ""
  }`,
  "font-src 'self' data:",
  `connect-src 'self' https://atukosice.sk https://www.atukosice.sk${
    isDev ? `${developmentHttpOrigins} ws: wss:` : ""
  }`,
  `media-src 'self' blob: https:${
    isDev ? developmentHttpOrigins : ""
  }`,
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Povolenie lokálneho prístupu k Next.js dev serveru
  allowedDevOrigins: isDev ? ["192.168.100.191"] : [],

  experimental: {
    serverComponentsHmrCache: false,
  },

  skipTrailingSlashRedirect: true,

  images: {
    dangerouslyAllowLocalIP: isDev,
    qualities: [75, 85, 90],
    remotePatterns: [
      ...(isDev
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "8000",
              pathname: "/media/**",
            },
            {
              protocol: "http" as const,
              hostname: "127.0.0.1",
              port: "8000",
              pathname: "/media/**",
            },
          ]
        : []),
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
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          ...(!isDev
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains",
                },
              ]
            : []),
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/backend-api/:path*/",
        destination: `${apiUrl}/:path*/`,
      },
      {
        source: "/backend-api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
