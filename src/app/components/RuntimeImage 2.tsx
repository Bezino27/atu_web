"use client";

import { useState, type ReactNode } from "react";

type RuntimeImageProps = {
  src: string;
  alt: string;
  fallback: ReactNode;
  loading?: "eager" | "lazy";
};

export default function RuntimeImage({
  src,
  alt,
  fallback,
  loading,
}: RuntimeImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (failedSource === src) {
    return fallback;
  }

  return (
    // Runtime SZFB URLs are intentionally not constrained by the Next image allowlist.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailedSource(src)}
    />
  );
}
