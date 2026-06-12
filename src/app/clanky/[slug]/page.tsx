import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getImageUrl, normalizeHtmlMediaUrls } from "@/app/lib/api";
import { getPostDetail, type Post } from "@/app/lib/posts";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_URL,
  SITE_NAME,
} from "@/app/lib/seo";

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

function getSeoTitle(post?: Post | null) {
  return post?.meta_title || post?.title || "Článok";
}

function getSeoDescription(post?: Post | null) {
  return (
    post?.meta_description ||
    post?.excerpt ||
    "Detail článku florbalového klubu ATU Košice."
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalUrl = absoluteUrl(`/clanky/${slug}`);

  try {
    const post = await getPostDetail("atu-kosice", slug);
    const title = getSeoTitle(post);
    const description = getSeoDescription(post);
    const imageUrl = post.featured_image
      ? getImageUrl(post.featured_image)
      : DEFAULT_OG_IMAGE_URL;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${title} | ${SITE_NAME}`,
        description,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.published_at || undefined,
        authors: post.author_username ? [post.author_username] : undefined,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Článok",
      description: "Detail článku florbalového klubu ATU Košice.",
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `Článok | ${SITE_NAME}`,
        description: "Detail článku florbalového klubu ATU Košice.",
        url: canonicalUrl,
        type: "article",
        images: [DEFAULT_OG_IMAGE_URL],
      },
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
              dangerouslySetInnerHTML={{
                __html: normalizeHtmlMediaUrls(post.content),
              }}
            />
          </article>
        </section>
      </main>

      <Footer />
    </>
  );
}
