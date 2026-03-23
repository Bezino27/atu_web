import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getImageUrl } from "@/app/lib/api";
import { getPostDetail, type Post } from "@/app/lib/posts";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostDetail("atu-kosice", slug);

    return {
      title: post.meta_title || post.title || "Článok | ATU Košice",
      description:
        post.meta_description ||
        post.excerpt ||
        "Detail článku florbalového klubu ATU Košice.",
      openGraph: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || "",
        images: post.featured_image ? [getImageUrl(post.featured_image)] : [],
      },
    };
  } catch {
    return {
      title: "Článok | ATU Košice",
      description: "Detail článku florbalového klubu ATU Košice.",
    };
  }
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post: Post;

  try {
    post = await getPostDetail("atu-kosice", slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.breadcrumbs}>
              <Link href="/">Domov</Link>
              <span>/</span>
              <Link href="/clanky">Články</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>

            <div className={styles.meta}>
              <span className={styles.badge}>{post.category?.name || "Novinka"}</span>
              <span>{formatDate(post.published_at)}</span>
              {post.author_username && <span>Autor: {post.author_username}</span>}
            </div>

            <h1>{post.title}</h1>

            {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          </div>
        </section>

        <section className={styles.articleSection}>
          <article className={styles.articleCard}>
            {post.featured_image && (
              <div className={styles.heroImageWrap}>
                <Image
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                  quality={90}
                  className={styles.heroImage}
                />
              </div>
            )}

            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}