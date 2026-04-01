import Link from "next/link";
import Image from "next/image";
import categoryStyles from "../../styles/kategorie.module.css";
import styles from "../../styles/novinky.module.css";
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
      <div className={styles.sectionHeading}>

      </div>

      {visiblePosts.length > 0 ? (
        <div className={styles.grid}>
          {visiblePosts.map((item) => (
            <Link
              key={item.id}
              href={`/clanky/${item.slug}`}
              className={styles.card}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={getImageUrl(item.featured_image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 380px"
                  className={styles.img}
                />
                <div className={styles.cardOverlay}>
                  <div className={styles.metaRowSmall}>
                    <span className={styles.badgeSmall}>
                      {item.category?.name || "Novinka"}
                    </span>
                    <span className={styles.dateTextSmall}>
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h3 className={styles.cardTitle}>{item.title}</h3>

                  <p className={styles.cardDescription}>
                    {item.excerpt || ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          Zatiaľ nie sú dostupné žiadne články.
        </div>
      )}
    </section>
  );
}