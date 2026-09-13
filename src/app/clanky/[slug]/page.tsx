import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getImageUrl, normalizeHtmlMediaUrls } from "@/app/lib/api";
import {
  getHomepagePosts,
  getPostDetail,
  type Post,
} from "@/app/lib/posts";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_URL,
  SITE_NAME,
} from "@/app/lib/seo";
import richTextStyles from "@/app/styles/rich-text.module.css";

import ArticleSidebar from "./ArticleSidebar";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/* ######################################################### */
/* # HELPERS                                               # */
/* ######################################################### */

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

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

function getAuthorName(post?: Post | null) {
  const authorName = [
    post?.author_last_name,
    post?.author_first_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    authorName ||
    post?.author_name ||
    "ATU Košice"
  );
}

/* ######################################################### */
/* # ICONS                                                 # */
/* ######################################################### */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3.5 10.5 12 3l8.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 9.5V20h13V9.5M9.5 20v-6h5v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="9"
        cy="10"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m5 18 5-5 3 3 2-2 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ######################################################### */
/* # SEO                                                   # */
/* ######################################################### */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const canonicalUrl =
    absoluteUrl(`/clanky/${slug}`);

  try {
    const post =
      await getPostDetail(
        "atu-kosice",
        slug
      );

    const title =
      getSeoTitle(post);

    const description =
      getSeoDescription(post);

    const imageUrl =
      post.featured_image
        ? getImageUrl(
            post.featured_image
          )
        : DEFAULT_OG_IMAGE_URL;

    return {
      title,
      description,

      alternates: {
        canonical:
          canonicalUrl,
      },

      openGraph: {
        title:
          `${title} | ${SITE_NAME}`,

        description,

        url:
          canonicalUrl,

        type:
          "article",

        publishedTime:
          post.published_at ||
          post.created_at ||
          undefined,

        authors: [
          getAuthorName(post),
        ],

        images: [
          imageUrl,
        ],
      },
    };
  } catch {
    return {
      title:
        "Článok",

      description:
        "Detail článku florbalového klubu ATU Košice.",

      alternates: {
        canonical:
          canonicalUrl,
      },

      openGraph: {
        title:
          `Článok | ${SITE_NAME}`,

        description:
          "Detail článku florbalového klubu ATU Košice.",

        url:
          canonicalUrl,

        type:
          "article",

        images: [
          DEFAULT_OG_IMAGE_URL,
        ],
      },
    };
  }
}

/* ######################################################### */
/* # PAGE                                                  # */
/* ######################################################### */

export default async function ArticleDetailPage({
  params,
}: PageProps) {
  const { slug } =
    await params;

  let post: Post;

  try {
    post =
      await getPostDetail(
        "atu-kosice",
        slug
      );
  } catch {
    notFound();
  }

  const articleDate =
    post.published_at ||
    post.created_at ||
    null;

  const authorName =
    getAuthorName(post);

  const authorInitial =
    Array.from(
      authorName.trim()
    )[0]?.toLocaleUpperCase(
      "sk-SK"
    ) || "A";

  const imageUrl =
    post.featured_image
      ? getImageUrl(
          post.featured_image
        )
      : null;

  const relatedPosts =
    (
      await getHomepagePosts(
        "atu-kosice",
        10
      )
    )
      .filter(
        (relatedPost) =>
          relatedPost.slug !==
          post.slug
      )
      .slice(0, 3);

  const articleUrl =
    absoluteUrl(
      `/clanky/${slug}`
    );

  return (
    <>
      <Header />

      <main
        className={
          styles.page
        }
      >
        {/* ################################################### */}
        {/* # HERO                                             # */}
        {/* ################################################### */}

        <section
          className={
            styles.hero
          }
          aria-labelledby="article-title"
        >
          <div
            className={
              styles.heroBackground
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.heroOverlay
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.heroContainer
            }
          >
            {/* ################################################# */}
            {/* # BREADCRUMBS                                    # */}
            {/* ################################################# */}

            <nav
              className={
                styles.breadcrumbs
              }
              aria-label="Navigácia článku"
            >
              <Link
                href="/"
                className={
                  styles.breadcrumbHome
                }
                aria-label="Domov"
              >
                <HomeIcon />

                <span>
                  Domov
                </span>
              </Link>

              <span
                className={
                  styles.breadcrumbArrow
                }
                aria-hidden="true"
              >
                <ChevronRightIcon />
              </span>

              <Link href="/clanky">
                Aktuality
              </Link>

              <span
                className={
                  styles.breadcrumbArrow
                }
                aria-hidden="true"
              >
                <ChevronRightIcon />
              </span>

              <span
                className={
                  styles.breadcrumbCurrent
                }
                aria-current="page"
              >
                {post.title}
              </span>
            </nav>

            {/* ################################################# */}
            {/* # HERO GRID                                      # */}
            {/* ################################################# */}

            <div
              className={
                styles.heroGrid
              }
            >
              {/* ############################################### */}
              {/* # LEFT CONTENT                                 # */}
              {/* ############################################### */}

              <div
                className={
                  styles.heroContent
                }
              >
                <div
                  className={
                    styles.heroMetaRow
                  }
                >
                  <span
                    className={
                      styles.badge
                    }
                  >
                    {post.category?.name ||
                      "Novinka"}
                  </span>

                  {articleDate ? (
                    <>
                      <span
                        className={
                          styles.metaDivider
                        }
                        aria-hidden="true"
                      />

                      <div
                        className={
                          styles.heroMetaItem
                        }
                      >
                        <span
                          className={
                            styles.heroMetaIcon
                          }
                          aria-hidden="true"
                        >
                          <CalendarIcon />
                        </span>

                        <time
                          dateTime={
                            articleDate
                          }
                        >
                          {formatDate(
                            articleDate
                          )}
                        </time>
                      </div>
                    </>
                  ) : null}

                  <span
                    className={
                      styles.metaDivider
                    }
                    aria-hidden="true"
                  />

                  <div
                    className={
                      styles.authorMeta
                    }
                  >
                    <span
                      className={
                        styles.authorMetaAvatar
                      }
                      aria-hidden="true"
                    >
                      {
                        authorInitial
                      }
                    </span>

                    <span
                      className={
                        styles.authorMetaText
                      }
                    >
                      <strong>
                        {
                          authorName
                        }
                      </strong>

                      <span>
                        Redakcia ATU
                      </span>
                    </span>
                  </div>
                </div>

                <header
                  className={
                    styles.articleHeader
                  }
                >
                  <h1
                    id="article-title"
                    className={
                      styles.title
                    }
                  >
                    {
                      post.title
                    }
                  </h1>

                  {post.excerpt ? (
                    <p
                      className={
                        styles.excerpt
                      }
                    >
                      {
                        post.excerpt
                      }
                    </p>
                  ) : null}
                </header>
              </div>

              {/* ############################################### */}
              {/* # FEATURED IMAGE                               # */}
              {/* ############################################### */}

              {imageUrl ? (
                <figure
                  className={
                    styles.figure
                  }
                >
                  <div
                    className={
                      styles.figureMedia
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        imageUrl
                      }
                      alt={
                        post.title
                      }
                      className={
                        styles.figureImage
                      }
                      fetchPriority="high"
                    />
                  </div>

                  <figcaption
                    className={
                      styles.figureCaption
                    }
                  >
                    <span
                      className={
                        styles.figureCaptionIcon
                      }
                      aria-hidden="true"
                    >
                      <ImageIcon />
                    </span>

                    <span>
                      Foto: ATU
                      Košice
                    </span>
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </div>
        </section>

        {/* ################################################### */}
        {/* # ARTICLE BODY                                     # */}
        {/* ################################################### */}

        <section
          className={
            styles.articleSection
          }
        >
          <div
            className={
              styles.articleContainer
            }
          >
            <div
              className={
                styles.articleLayout
              }
            >
              {/* ############################################### */}
              {/* # ARTICLE                                     # */}
              {/* ############################################### */}

              <article
                className={
                  styles.articleCard
                }
              >
                <div
                  className={`${styles.articleContent} ${richTextStyles.richTextContent}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      normalizeHtmlMediaUrls(
                        post.content
                      ),
                  }}
                />
              </article>

              {/* ############################################### */}
              {/* # SIDEBAR                                     # */}
              {/* ############################################### */}

              <ArticleSidebar
                articleUrl={
                  articleUrl
                }
                articleTitle={
                  post.title
                }
                relatedPosts={
                  relatedPosts
                }
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
