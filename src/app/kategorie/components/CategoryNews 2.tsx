import Link from "next/link";
import { PiArrowRight } from "react-icons/pi";

import ArticleImage from "@/app/components/ArticleImage";
import type { Post } from "@/app/lib/posts";
import newsStyles from "../styles/CategoryNews.module.css";

type CategoryNewsProps = {
  posts: Post[];
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

export default function CategoryNews({ posts }: CategoryNewsProps) {
  const visiblePosts = posts.slice(0, 3);

  return (
    <section className={newsStyles.novinkySection}>
      {visiblePosts.length > 0 ? (
        <div className={newsStyles.novinkyGrid}>
          {visiblePosts.map((post) => {
            const publishedAt =
              post.published_at || post.created_at || post.updated_at;

            return (
              <Link
                key={post.id}
                href={`/clanky/${post.slug}`}
                className={newsStyles.novinkyCard}
              >
                <div className={newsStyles.novinkyImageWrapper}>
                  <ArticleImage
                    post={post}
                    alt={post.title}
                    sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1100px) 46vw, 400px"
                    className={newsStyles.novinkyImg}
                  />
                  <div className={newsStyles.novinkyCardOverlay} />
                </div>

                <div className={newsStyles.novinkyCardContent}>
                  <div className={newsStyles.novinkyMetaRow}>
                    <span className={newsStyles.novinkyBadge}>
                      {post.category?.name || "Novinka"}
                    </span>
                    {publishedAt ? (
                      <time
                        dateTime={publishedAt}
                        className={newsStyles.novinkyDate}
                      >
                        {formatDate(publishedAt)}
                      </time>
                    ) : null}
                  </div>

                  <h3 className={newsStyles.novinkyCardTitle}>{post.title}</h3>

                  <span className={newsStyles.novinkyArrow} aria-hidden="true">
                    <PiArrowRight />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={newsStyles.novinkyEmptyState}>
          Zatiaľ nie sú dostupné žiadne články.
        </div>
      )}
    </section>
  );
}
