import Link from "next/link";
import Image from "next/image";
import newsStyles from "../../styles/CategoryNews.module.css";
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
    <section className={newsStyles.novinkySection}>
      {visiblePosts.length > 0 ? (
        <div className={newsStyles.novinkyGrid}>
          {visiblePosts.map((item) => (
            <Link
              key={item.id}
              href={`/clanky/${item.slug}`}
              className={newsStyles.novinkyCard}
            >
              <div className={newsStyles.novinkyImageWrapper}>
                <Image
                  src={getImageUrl(item.featured_image)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 92vw, 380px"
                  className={newsStyles.novinkyImg}
                />
                <div className={newsStyles.novinkyCardOverlay}>
                  <div className={newsStyles.novinkyMetaRow}>
                    <span className={newsStyles.novinkyBadge}>
                      {item.category?.name || "Novinka"}
                    </span>
                    <span className={newsStyles.novinkyDate}>
                      {formatDate(item.published_at)}
                    </span>
                  </div>

                  <h3 className={newsStyles.novinkyCardTitle}>{item.title}</h3>

                  <p className={newsStyles.novinkyCardDescription}>
                    {item.excerpt || ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={newsStyles.novinkyEmptyState}>
          Zatiaľ nie sú dostupné žiadne články.
        </div>
      )}
    </section>
  );
}