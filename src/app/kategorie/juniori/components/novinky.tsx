import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/unified.module.css";
import type { Post } from "@/app/lib/posts";
import { getImageUrl } from "@/app/lib/api";

type NovinkyProps = {
  posts: Post[];
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Novinky({ posts }: NovinkyProps) {
  const visiblePosts = posts.slice(0, 3);

  return (
    <section className={styles.novinkySection}>
      {visiblePosts.length > 0 ? (
        <div className={styles.novinkyGrid}>
          {visiblePosts.map((item) => (
            <Link
              key={item.id}
              href={`/clanky/${item.slug}`}
              className={styles.novinkyCard}
            >
              <div className={styles.novinkyImageWrapper}>
                <Image
                  src={getImageUrl(item.featured_image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 380px"
                  className={styles.novinkyImg}
                />
                <div className={styles.novinkyCardOverlay}>
                  <div className={styles.novinkyMetaRow}>
                    <span className={styles.novinkyBadge}>
                      {item.category?.name || "Novinka"}
                    </span>
                    <span className={styles.novinkyDate}>
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h3 className={styles.novinkyCardTitle}>{item.title}</h3>

                  <p className={styles.novinkyCardDescription}>
                    {item.excerpt || ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.novinkyEmptyState}>
          Zatiaľ nie sú dostupné žiadne články.
        </div>
      )}
    </section>
  );
}
