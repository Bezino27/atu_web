import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Barlow, Geist_Mono, Manrope, Teko } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "./lib/seo";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin", "latin-ext"],
  weight: "600",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: `${SITE_NAME} | Florbalový klub Košice`,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  keywords: SITE_KEYWORDS,

  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Florbalový klub Košice`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },

  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Florbalový klub Košice`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`
        ${manrope.variable}
        ${geistMono.variable}
        ${anton.variable}
        ${barlow.variable}
        ${teko.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
