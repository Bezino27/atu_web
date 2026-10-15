import Image, { type ImageProps } from "next/image";

import { getImageUrl } from "@/app/lib/api";
import type { Post } from "@/app/lib/posts";
import styles from "./ArticleImage.module.css";

type ArticleImageProps = {
  post: Pick<Post, "featured_image" | "image_width" | "image_height">;
  alt: string;
  sizes: string;
  className?: string;
  loading?: ImageProps["loading"];
  fetchPriority?: ImageProps["fetchPriority"];
};

type ArticleImageFallbackProps = {
  alt?: string;
  className?: string;
};

export function ArticleImageFallback({
  alt = "",
  className,
}: ArticleImageFallbackProps) {
  return (
    <div
      className={`${styles.fallback} ${className ?? ""}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : "true"}
    >
      <Image
        src="/logo/znak_atu_white.svg"
        alt=""
        width={1024}
        height={1024}
        className={styles.fallbackLogo}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "clamp(54px, 22%, 150px)",
          height: "auto",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}

function hasValidDimensions(
  post: ArticleImageProps["post"],
): post is ArticleImageProps["post"] & {
  image_width: number;
  image_height: number;
} {
  return (
    Boolean(post.featured_image) &&
    Number.isInteger(post.image_width) &&
    Number.isInteger(post.image_height) &&
    Number(post.image_width) > 0 &&
    Number(post.image_height) > 0
  );
}

export default function ArticleImage({
  post,
  alt,
  sizes,
  className,
  loading,
  fetchPriority,
}: ArticleImageProps) {
  if (!post.featured_image?.trim()) {
    return <ArticleImageFallback alt={alt} className={className} />;
  }

  const src = getImageUrl(post.featured_image);

  if (hasValidDimensions(post)) {
    return (
      <Image
        src={src}
        alt={alt}
        width={post.image_width}
        height={post.image_height}
        sizes={sizes}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }

  return (
    // Metadata-free legacy records retain the previous browser behavior.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading ?? "lazy"}
      fetchPriority={fetchPriority}
    />
  );
}
