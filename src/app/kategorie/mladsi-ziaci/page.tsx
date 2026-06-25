import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import styles from "../styles/unified.module.css";
import szfbStyle from "../styles/szfb_cards.module.css";
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

  const szfbLinks = [
    {
      title: "Detail tímu",
      href: "https://www.szfb.sk/sk/stats/teams/1178/liga-mladsich-ziakov-vychod/team/669483/fabk-atu-kosice",
    },
    {
      title: "Tabuľka",
      href: "https://www.szfb.sk/sk/stats/standings/1178/liga-mladsich-ziakov-vychod",
    },
    {
      title: "Výsledky a program",
      href: "https://www.szfb.sk/sk/stats/results-date/1178",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        {sections.map((section) => {
          switch (section.section_type) {
            case "hero":
              return (
        <section key={section.id} className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src={heroImage}
              alt={`ATU Košice ${categoryName}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImg}
            />

            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <h1 className={styles.bannerTitleziaci}>
                  {getSectionTitle(section, categoryName)}
                </h1>

                <div className={styles.heroQuickNav}>
                  <a href="#odkazy" className={styles.heroQuickLink}>
                    Odkazy
                  </a>
                  <a href="#treningy" className={styles.heroQuickLink}>
                    Tréningy
                  </a>
                  <a href="#novinky" className={styles.heroQuickLink}>
                    Novinky
                  </a>
                </div>
              </div>

              <div className={styles.heroMiniInfo}>
                <span className={styles.heroMiniLabel}>Sezóna</span>
                <span className={styles.heroMiniValue}>{currentSeason}</span>
              </div>
            </div>
          </div>
        </section>
              );
            case "links":
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
              {szfbLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={szfbStyle.szfbCard}
                >
                  <div className={szfbStyle.szfbCardTop}>
                    <span className={szfbStyle.szfbBadge}>SZFB</span>
                    <span className={szfbStyle.szfbArrow}>↗</span>
                  </div>

                  <h3 className={szfbStyle.szfbCardTitle}>{link.title}</h3>

                  <span className={szfbStyle.szfbCardLink}>
                    Otvoriť odkaz
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
              );
            case "trainings":
              return (
        <section key={section.id} id="treningy" className="sectionContainer">
          <KdeTrenujeme />
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
