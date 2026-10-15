import Link from "next/link";

import ArticleImage from "@/app/components/ArticleImage";
import type { Post } from "@/app/lib/posts";
import styles from "./page.module.css";

type ArticleCardProps = {
  post: Post;
  compact?: boolean;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticleCard({ post, compact = false }: ArticleCardProps) {
  const publishedAt = post.published_at || post.created_at || post.updated_at;

  return (
    <Link
      href={`/clanky/${post.slug}`}
      className={`${styles.card} ${compact ? styles.cardCompact : ""}`}
    >
      <div className={styles.imageWrap}>
        <ArticleImage
          post={post}
          alt={post.title}
          sizes="(max-width: 767px) calc(100vw - 16px), (max-width: 1200px) 50vw, 420px"
          className={styles.image}
        />
      </div>

      <div className={styles.cardContent}>
        <div className={styles.meta}>
          <span className={styles.badge}>
            {post.category?.name || "Novinka"}
          </span>

          {publishedAt ? (
            <time dateTime={publishedAt} className={styles.date}>
              {formatDate(publishedAt)}
            </time>
          ) : null}
        </div>

        <h2>{post.title}</h2>
        <p>{post.excerpt || "Prečítať článok"}</p>
      </div>
    </Link>
  );
}
