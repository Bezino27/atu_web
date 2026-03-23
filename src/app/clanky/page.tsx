import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { getImageUrl } from "@/app/lib/api";

export const metadata: Metadata = {
  title: "Články | ATU Košice",
  description: "Novinky, reporty, klubové informácie a všetky články florbalového klubu ATU Košice.",
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
  const posts: Post[] = await getHomepagePosts("atu-kosice");

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Klubový obsah</span>
            <h1>Všetky články</h1>
            <p>
              Prečítajte si novinky, zápasové reporty, klubové oznámenia a ďalší obsah
              z prostredia ATU Košice.
            </p>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.grid}>
            {posts.map((post) => (
              <Link key={post.id} href={`/clanky/${post.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={getImageUrl(post.featured_image)}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                    quality={85}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.meta}>
                    <span className={styles.badge}>{post.category?.name || "Novinka"}</span>
                    <span>{formatDate(post.published_at)}</span>
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