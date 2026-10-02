import type { Metadata } from "next";
import { connection } from "next/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";
import ArticleCard from "./ArticleCard";

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
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
