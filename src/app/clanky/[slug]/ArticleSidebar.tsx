"use client";

import Link from "next/link";
import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import { getImageUrl } from "@/app/lib/api";
import type { Post } from "@/app/lib/posts";

import "./sidebar.css";

type ArticleSidebarProps = {
  articleUrl: string;
  articleTitle: string;
  relatedPosts: Post[];
};

type ArticlePreviewCardProps = {
  post: Post;
};

const PRODUCTION_ORIGIN = "https://atukosice.sk";

const styles = {
  sidebar: "articleSidebar_sidebar",

  card: "articleSidebar_card",

  shareCard: "articleSidebar_shareCard",
  shareDecoration: "articleSidebar_shareDecoration",
  headingIcon: "articleSidebar_headingIcon",
  shareHeader: "articleSidebar_shareHeader",
  shareTitle: "articleSidebar_shareTitle",
  shareSubtitle: "articleSidebar_shareSubtitle",

  shareGrid: "articleSidebar_shareGrid",
  shareButton: "articleSidebar_shareButton",
  shareButtonIcon: "articleSidebar_shareButtonIcon",
  shareButtonText: "articleSidebar_shareButtonText",
  shareButtonSuccess: "articleSidebar_shareButtonSuccess",

  facebookIcon: "articleSidebar_facebookIcon",
  instagramIcon: "articleSidebar_instagramIcon",
  copyIcon: "articleSidebar_copyIcon",

  relatedCard: "articleSidebar_relatedCard",
  relatedHeader: "articleSidebar_relatedHeader",
  relatedHeading: "articleSidebar_relatedHeading",
  relatedTitle: "articleSidebar_relatedTitle",
  relatedSubtitle: "articleSidebar_relatedSubtitle",

  headerLink: "articleSidebar_headerLink",
  headerLogo: "articleSidebar_headerLogo",

  relatedList: "articleSidebar_relatedList",
  relatedItem: "articleSidebar_relatedItem",
  relatedThumb: "articleSidebar_relatedThumb",
  relatedContent: "articleSidebar_relatedContent",

  categoryBadge: "articleSidebar_categoryBadge",

  relatedItemTitle: "articleSidebar_relatedItemTitle",
  relatedDate: "articleSidebar_relatedDate",
  relatedArrow: "articleSidebar_relatedArrow",

  bottomCta: "articleSidebar_bottomCta",
} as const;

/* ######################################################### */
/* # HELPERS                                               # */
/* ######################################################### */

function formatDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticlePreviewCard({ post }: ArticlePreviewCardProps) {
  const image = post.featured_image
    ? getImageUrl(post.featured_image)
    : null;
  const date = post.published_at || post.updated_at;

  return (
    <Link href={`/clanky/${post.slug}`} className={styles.relatedItem}>
      <div className={styles.relatedThumb}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span>ATU</span>
        )}
      </div>

      <div className={styles.relatedContent}>
        {post.category?.name ? (
          <span className={styles.categoryBadge}>{post.category.name}</span>
        ) : null}
        <strong className={styles.relatedItemTitle}>{post.title}</strong>
        {date ? (
          <time dateTime={date} className={styles.relatedDate}>
            {formatDate(date)}
          </time>
        ) : null}
      </div>

      <span className={styles.relatedArrow} aria-hidden="true">
        <ArrowRightIcon />
      </span>
    </Link>
  );
}

export function AllArticlesLink() {
  return (
    <Link href="/clanky" className={styles.bottomCta}>
      <span>Všetky články</span>
      <span aria-hidden="true"><ArrowRightIcon /></span>
    </Link>
  );
}

function getProductionArticleUrl(value: string) {
  try {
    const parsed = new URL(value);

    return `${PRODUCTION_ORIGIN}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    try {
      return new URL(
        value,
        PRODUCTION_ORIGIN
      ).toString();
    } catch {
      return PRODUCTION_ORIGIN;
    }
  }
}

/* ######################################################### */
/* # ICONS                                                 # */
/* ######################################################### */

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="5"
        r="2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="6"
        cy="12"
        r="2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="18"
        cy="19"
        r="2.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="m8 11 7.8-4.6M8 13l7.8 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArticleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M6 3.5h9l3 3V20.5H6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M15 3.5v3h3M9 11h6M9 14.5h6M9 18h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M9.5 14.5 14.5 9.5M7.2 17.8l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16.8 6.2l1-1a3.5 3.5 0 1 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4 4L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ######################################################### */
/* # COMPONENT                                             # */
/* ######################################################### */

export default function ArticleSidebar({
  articleUrl,
  articleTitle,
  relatedPosts,
}: ArticleSidebarProps) {
  const [copied, setCopied] = useState(false);

  const resetTimer =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const productionArticleUrl =
    useMemo(
      () =>
        getProductionArticleUrl(
          articleUrl
        ),
      [articleUrl]
    );

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(
          resetTimer.current
        );
      }
    };
  }, []);

  function showCopiedState() {
    setCopied(true);

    if (resetTimer.current) {
      clearTimeout(
        resetTimer.current
      );
    }

    resetTimer.current =
      setTimeout(() => {
        setCopied(false);
      }, 2000);
  }

  /* ####################################################### */
  /* # COPY LINK                                           # */
  /* ####################################################### */

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        productionArticleUrl
      );

      showCopiedState();
    } catch {
      setCopied(false);
    }
  }

  /* ####################################################### */
  /* # INSTAGRAM                                           # */
  /* ####################################################### */

  async function shareToInstagram() {
    const isMobile =
      window.matchMedia(
        "(max-width: 720px)"
      ).matches;

    if (
      isMobile &&
      typeof navigator.share ===
        "function"
    ) {
      try {
        await navigator.share({
          title: articleTitle,
          text: articleTitle,
          url: productionArticleUrl,
        });

        return;
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(
        productionArticleUrl
      );

      showCopiedState();
    } catch {
      setCopied(false);
    }

    window.open(
      "https://www.instagram.com/",
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <aside
      className={styles.sidebar}
      aria-label="Bočný panel článku"
    >
      {/* ##################################################### */}
      {/* # SHARE                                              # */}
      {/* ##################################################### */}

      <section
        className={`${styles.card} ${styles.shareCard}`}
        aria-labelledby="article-share-title"
      >
        <div
          className={
            styles.shareDecoration
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.shareHeader
          }
        >
          <span
            className={
              styles.headingIcon
            }
            aria-hidden="true"
          >
            <ShareIcon />
          </span>

          <div>
            <h2
              id="article-share-title"
              className={
                styles.shareTitle
              }
            >
              Zdieľať článok
            </h2>

            <p
              className={
                styles.shareSubtitle
              }
            >
              Podpor ATU Košice,
              zdieľaj ďalej
            </p>
          </div>
        </div>

        <div
          className={
            styles.shareGrid
          }
        >
          {/* ################################################# */}
          {/* # FACEBOOK                                      # */}
          {/* ################################################# */}

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              productionArticleUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className={
              styles.shareButton
            }
            aria-label={`Zdieľať článok ${articleTitle} na Facebooku`}
          >
            <span
              className={`${styles.shareButtonIcon} ${styles.facebookIcon}`}
              aria-hidden="true"
            >
              <FaFacebookF />
            </span>

            <span
              className={
                styles.shareButtonText
              }
            >
              Facebook
            </span>
          </a>

          {/* ################################################# */}
          {/* # INSTAGRAM                                     # */}
          {/* ################################################# */}

          <button
            type="button"
            className={
              styles.shareButton
            }
            onClick={
              shareToInstagram
            }
            aria-label="Zdieľať článok cez Instagram"
          >
            <span
              className={`${styles.shareButtonIcon} ${styles.instagramIcon}`}
              aria-hidden="true"
            >
              <FaInstagram />
            </span>

            <span
              className={
                styles.shareButtonText
              }
            >
              Instagram
            </span>
          </button>

          {/* ################################################# */}
          {/* # COPY                                         # */}
          {/* ################################################# */}

          <button
            type="button"
            className={`${styles.shareButton} ${
              copied
                ? styles.shareButtonSuccess
                : ""
            }`}
            onClick={
              copyLink
            }
            aria-live="polite"
            aria-label="Kopírovať odkaz na článok"
          >
            <span
              className={`${styles.shareButtonIcon} ${styles.copyIcon}`}
              aria-hidden="true"
            >
              {copied ? (
                <CheckIcon />
              ) : (
                <LinkIcon />
              )}
            </span>

            <span
              className={
                styles.shareButtonText
              }
            >
              {copied
                ? "Skopírované"
                : "Kopírovať odkaz"}
            </span>
          </button>
        </div>
      </section>

      {/* ##################################################### */}
      {/* # RELATED                                            # */}
      {/* ##################################################### */}

      {relatedPosts.length > 0 ? (
        <section
          className={`${styles.card} ${styles.relatedCard}`}
          aria-labelledby="article-related-title"
        >
          <div
            className={
              styles.relatedHeader
            }
          >
            <div
              className={
                styles.relatedHeading
              }
            >
              <span
                className={
                  styles.headingIcon
                }
                aria-hidden="true"
              >
                <ArticleIcon />
              </span>

              <div>
                <h2
                  id="article-related-title"
                  className={
                    styles.relatedTitle
                  }
                >
                  Súvisiace články
                </h2>

                <p
                  className={
                    styles.relatedSubtitle
                  }
                >
                  Ďalšie správy z
                  ATU Košice
                </p>
              </div>
            </div>

            <Link
              href="/clanky"
              className={
                styles.headerLink
              }
              aria-label="Všetky články"
            >
              <Image
                src="/logo/znak_atu_nove.svg"
                alt=""
                width={48}
                height={48}
                className={
                  styles.headerLogo
                }
              />
            </Link>
          </div>

          <div
            className={
              styles.relatedList
            }
          >
            {relatedPosts.map(
              (relatedPost) => {
                return <ArticlePreviewCard key={relatedPost.id} post={relatedPost} />;
              }
            )}
          </div>

          <AllArticlesLink />
        </section>
      ) : null}
    </aside>
  );
}
