import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import pageStyles from "../styles/CategoryPage.module.css";
import heroStyles from "../styles/CategoryHero.module.css";
import szfbStyle from "../styles/SzfbCards.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Novinky from "./components/novinky";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import KdeTrenujeme from "./components/treningy_mladsi_ziaci";
import Nabor from "./components/nabor";
import { getClubSeason } from "../../lib/season";
import {
  API_URL,
  normalizeMediaUrl,
  withDevMediaCacheBuster,
} from "@/app/lib/api";
import {
  getActiveSortedSections,
  getClubPageBySlug,
  getSectionPreTitle,
  getSectionTitle,
  warnUnsupportedSection,
  type PageSection,
} from "@/app/lib/pages";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Mladší žiaci",
  description:
    "Kategória mladší žiaci ATU Košice. Nájdite informácie o tíme, tréningoch, nábore, súťažných odkazoch a novinkách kategórie.",
  alternates: {
    canonical: absoluteUrl("/kategorie/mladsi-ziaci"),
  },
  openGraph: {
    title: `Mladší žiaci | ${SITE_NAME}`,
    description:
      "Mladší žiaci ATU Košice, tréningy, nábor, súťažné odkazy a klubové novinky.",
    url: absoluteUrl("/kategorie/mladsi-ziaci"),
    type: "website",
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

type CategoryLink = {
  id: number;
  title: string;
  description: string;
  cta: string;
  href: string;
  order: number;
};

type CategoryTraining = {
  id: number;
  day: string;
  time: string;
  order: number;
  location: {
    id: number;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
};

type BackendCategory = {
  id: number;
  name: string;
  slug?: string | null;
  season?: string | null;
  description?: string | null;
  hero_image_url?: string | null;
  birth_year_from: number;
  birth_year_to: number;
  order?: number;
  is_active?: boolean;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
  trainings?: CategoryTraining[];
  links?: CategoryLink[];
};

const CLUB_SLUG = "atu-kosice";
const CATEGORY_SLUG = "mladsi-ziaci";
const CATEGORY_FALLBACK_NAME = "Mladší žiaci";

const fallbackSections: PageSection[] = [
  { id: -1, section_type: "hero", title: "", pre_title: "", order: 1, is_active: true, hide_when_empty: false, config: {} },
  { id: -2, section_type: "links", title: "Odkazy", pre_title: "SZFB", order: 2, is_active: true, hide_when_empty: false, config: {} },
  { id: -3, section_type: "trainings", title: "Kde trénujeme", pre_title: "TRÉNINGY", order: 3, is_active: true, hide_when_empty: false, config: {} },
  { id: -4, section_type: "recruitment", title: "", pre_title: "NÁBOR", order: 4, is_active: true, hide_when_empty: false, config: {} },
  { id: -5, section_type: "posts", title: "Najdôležitejšie novinky", pre_title: "AKTUÁLNE DIANIE", order: 5, is_active: true, hide_when_empty: false, config: {} },
];

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function createSlugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function getCategorySlug(category: BackendCategory) {
  return category.slug || createSlugFromName(category.name);
}

function isCurrentCategory(category: BackendCategory) {
  const categorySlug = normalizeText(getCategorySlug(category));
  const categoryName = normalizeText(category.name);

  return (
    categorySlug === CATEGORY_SLUG ||
    categoryName === CATEGORY_SLUG ||
    categoryName === "mladsi ziaci"
  );
}

function isYouthPost(post: Post) {
  const categoryName = normalizeText(post.category?.name);

  return (
    categoryName === "mladez" ||
    categoryName === CATEGORY_SLUG ||
    categoryName === "mladsi ziaci"
  );
}

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(`${API_URL}/public/teams/${CLUB_SLUG}/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  } catch {
    return [];
  }
}

const MladsiZiaciPage = async () => {
  await connection();

  const [categoryPage, posts, clubSeason, categories] = await Promise.all([
    getClubPageBySlug(CLUB_SLUG, CATEGORY_SLUG),
    getHomepagePosts(CLUB_SLUG),
    getClubSeason(CLUB_SLUG),
    getCategories(),
  ]);

  const currentCategory = categories.find(isCurrentCategory);

  const categoryName = currentCategory?.name ?? CATEGORY_FALLBACK_NAME;
  const heroImage = withDevMediaCacheBuster(
    normalizeMediaUrl(
      currentCategory?.hero_image_url,
      "/images/kategorie/mladsi_ziaci.jpg",
    ),
    Boolean(currentCategory?.hero_image_url),
  );

  const mladezPosts = posts.filter(isYouthPost);
  const sections = getActiveSortedSections(categoryPage?.sections, fallbackSections);

  const currentSeason =
    currentCategory?.season ?? clubSeason?.season ?? "2025 / 2026";

  const categoryTrainings = currentCategory?.trainings ?? [];
  const categoryLinks = [...(currentCategory?.links ?? [])].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className={pageStyles.pageContainer}>
      <Header />

      <main className={pageStyles.content}>
        {sections.map((section) => {
          switch (section.section_type) {
            case "hero": {
              const heroTitle = getSectionTitle(section, categoryName);

              return (
        <section key={section.id} className={heroStyles.heroSection}>
          <div className={heroStyles.bannerContainer}>
            <Image
              src={heroImage}
              alt={`ATU Košice ${categoryName}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={heroStyles.heroImg}
            />

            <div className={heroStyles.bannerOverlay}>
              <div className={heroStyles.heroTextContent}>
                <h1
                  className={`${heroStyles.bannerTitleziaci} ${
                    heroTitle.replace(/\s+/g, "").length > 8
                      ? heroStyles.bannerTitleziaciLong
                      : ""
                  }`}
                >
                  {heroTitle}
                </h1>

                <div className={heroStyles.heroQuickNav}>
                  {categoryLinks.length > 0 ? (
                    <a href="#odkazy" className={heroStyles.heroQuickLink}>
                      Odkazy
                    </a>
                  ) : null}
                  {categoryTrainings.length > 0 ? (
                    <a href="#treningy" className={heroStyles.heroQuickLink}>
                      Tréningy
                    </a>
                  ) : null}
                  <a href="#novinky" className={heroStyles.heroQuickLink}>
                    Novinky
                  </a>
                </div>
              </div>

              <div className={heroStyles.heroMiniInfo}>
                <span className={heroStyles.heroMiniLabel}>Sezóna</span>
                <span className={heroStyles.heroMiniValue}>{currentSeason}</span>
              </div>
            </div>
          </div>
        </section>
              );
            }
            case "links":
              if (categoryLinks.length === 0) {
                return null;
              }

              return (
        <section key={section.id} id="odkazy" className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">{getSectionPreTitle(section, "SZFB")}</span>
              <h2 className="sectionTitle">{getSectionTitle(section, "Odkazy")}</h2>
            </div>
          </div>

          <div className={szfbStyle.szfbSection}>
            <div className={szfbStyle.szfbGrid}>
              {categoryLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={szfbStyle.szfbCard}
                >
                  <div className={szfbStyle.szfbWatermark} aria-hidden="true" />

                  <div className={szfbStyle.szfbCardTop}>
                    <span className={szfbStyle.szfbBadge}>SZFB</span>
                  </div>

                  <div className={szfbStyle.szfbCardContent}>
                    <h3 className={szfbStyle.szfbCardTitle}>{link.title}</h3>
                    <p className={szfbStyle.szfbCardDescription}>
                      {link.description}
                    </p>
                  </div>

                  <span className={szfbStyle.szfbCardLink}>
                    <span className={szfbStyle.szfbCardLinkText}>
                      {link.cta}
                    </span>

                    <svg
                      className={szfbStyle.szfbArrow}
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12H19M14 7L19 12L14 17"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
              );
            case "trainings":
              if (categoryTrainings.length === 0) {
                return null;
              }

              return (
        <section key={section.id} id="treningy" className="sectionContainer">
          <KdeTrenujeme trainings={categoryTrainings} />
        </section>
              );
            case "recruitment":
              return (
        <section key={section.id} id="nabor" className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">{getSectionPreTitle(section, "NÁBOR")}</span>
              <h2 className="sectionTitle">
              {getSectionTitle(section, `Chceš hrať za kategóriu ${categoryName.toLowerCase()}?`)}
            </h2>
            </div>
          </div>

          <Nabor />
        </section>
              );
            case "posts":
              if (section.hide_when_empty && mladezPosts.length === 0) {
                return null;
              }

              return (
        <section key={section.id} id="novinky" className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">
                {getSectionPreTitle(section, "AKTUÁLNE DIANIE")}
              </span>
              <h2 className="sectionTitle">
              {getSectionTitle(section, "Najdôležitejšie novinky")}
            </h2>
            </div>
          </div>

          <Novinky posts={mladezPosts} />
        </section>
              );
            default:
              warnUnsupportedSection("/kategorie/mladsi-ziaci", section.section_type);
              return null;
          }
        })}
      </main>

      <Footer />
    </div>
  );
};

export default MladsiZiaciPage;