import Link from "next/link";
import type { Metadata } from "next";
import { connection } from "next/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { getImageUrl } from "@/app/lib/api";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";

export const metadata: Metadata = {
  title: "Články",
  description:
    "Novinky, reporty, klubové informácie a všetky články florbalového klubu ATU Košice na jednom mieste.",
  alternates: {
    canonical: absoluteUrl("/clanky"),
  },
  openGraph: {
    title: `Články | ${SITE_NAME}`,
    description:
      "Novinky, reporty a klubové informácie florbalového klubu ATU Košice.",
    url: absoluteUrl("/clanky"),
    type: "website",
    images: [DEFAULT_OG_IMAGE_URL],
  },
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

export default async function ArticlesPage() {
  await connection();

  const posts: Post[] = await getHomepagePosts("atu-kosice");

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>Klubový obsah</span>
              <h1>Všetky články</h1>
              <p>
                Prečítajte si novinky, zápasové reporty, klubové oznámenia a ďalší obsah
                z prostredia ATU Košice.
              </p>

              <div className={styles.categoryLine} aria-hidden="true">
                <span>Novinky</span>
                <i>•</i>
                <span>Reporty</span>
                <i>•</i>
                <span>Oznámenia</span>
                <i>•</i>
                <span>Klub</span>
              </div>
            </div>

          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.grid}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/clanky/${post.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span className={styles.badge}>
                      {post.category?.name || "Novinka"}
                    </span>

                    <time
                      dateTime={
                        post.published_at ||
                        post.created_at ||
                        post.updated_at ||
                        undefined
                      }
                      className={styles.date}
                    >
                      {formatDate(
                        post.published_at ||
                          post.created_at ||
                          post.updated_at
                      )}
                    </time>
                  </div>

                  <h2>{post.title}</h2>
                  <p>{post.excerpt || "Prečítať článok"}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
