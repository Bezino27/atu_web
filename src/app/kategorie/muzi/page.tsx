import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import styles from "../styles/unified.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from "./components/najlepsi_hrac";
import RecentMatches from "./components/posledne_zapasy";
import Tabulka from "./components/tabulka";
import NextMatchCountdown from "./components/NextMatchCountdown";
import { getSzfbDashboard } from "@/app/lib/szfb";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { getClubSeason } from "@/app/lib/season";
import {
  API_URL,
  getApiFetchOptions,
  normalizeMediaUrl,
  withDevMediaCacheBuster,
} from "@/app/lib/api";
import { warnUnsupportedSection } from "@/app/lib/pages";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Muži",
  description:
    "Mužská kategória florbalového klubu ATU Košice. Pozrite si novinky, zápasy, výsledky, tabuľku, lídrov sezóny a informácie o tíme mužov.",
  alternates: {
    canonical: absoluteUrl("/kategorie/muzi"),
  },
  openGraph: {
    title: `Muži | ${SITE_NAME}`,
    description:
      "Novinky, zápasy, výsledky, tabuľka a štatistiky mužského tímu ATU Košice.",
    url: absoluteUrl("/kategorie/muzi"),
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
  league_name?: string | null;
  hero_image_url?: string | null;
  birth_year_from: number;
  birth_year_to: number;
  order?: number;
  is_active?: boolean;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
};

type PageSection = {
  id: number;
  section_type: string;
  title: string;
  pre_title: string;
  order: number;
  is_active: boolean;
  hide_when_empty: boolean;
  config: Record<string, unknown>;
};

type ClubPage = {
  id: number;
  title: string;
  slug: string;
  menu_title: string;
  page_type: string;
  is_published: boolean;
  club_slug: string;
  sections: PageSection[];
};

const CLUB_SLUG = "atu-kosice";
const CATEGORY_SLUG = "muzi";
const CATEGORY_FALLBACK_NAME = "Muži";
const SZFB_WATCH_ID = 1;

const fallbackSections: PageSection[] = [
  {
    id: -1,
    section_type: "hero",
    title: "",
    pre_title: "",
    order: 1,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -2,
    section_type: "next_match",
    title: "",
    pre_title: "",
    order: 2,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -3,
    section_type: "posts",
    title: "Najdôležitejšie novinky",
    pre_title: "Aktuálne dianie",
    order: 3,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -4,
    section_type: "matches_overview",
    title: "Výsledky",
    pre_title: "Extraliga",
    order: 4,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -5,
    section_type: "leaders",
    title: "Lídri sezóny",
    pre_title: "Štatistiky tímu",
    order: 5,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
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
    categoryName === "muzi" ||
    categoryName === "a-tim"
  );
}

function isCurrentCategoryPost(post: Post) {
  const categoryName = normalizeText(post.category?.name);

  return (
    categoryName === "muzi" ||
    categoryName === "a-tim" ||
    categoryName === CATEGORY_SLUG
  );
}

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
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

async function getCategoryPage(): Promise<ClubPage | null> {
  try {
    const res = await fetch(
      `${API_URL}/public/pages/${CLUB_SLUG}/by-slug/${CATEGORY_SLUG}/`,
      getApiFetchOptions(60),
    );

    if (!res.ok) {
      console.error(
        `Nepodarilo sa načítať stránku kategórie Muži: ${res.status}`,
      );
      return null;
    }

    return (await res.json()) as ClubPage;
  } catch (error) {
    console.error("Chyba pri načítaní stránky kategórie Muži:", error);
    return null;
  }
}

export default async function MuziPage() {
  await connection();

  const [categoryPage, szfbDashboard, posts, clubSeason, categories] =
    await Promise.all([
      getCategoryPage(),
      getSzfbDashboard(SZFB_WATCH_ID),
      getHomepagePosts(CLUB_SLUG),
      getClubSeason(CLUB_SLUG),
      getCategories(),
    ]);

  const sections =
    categoryPage?.sections && categoryPage.sections.length > 0
      ? [...categoryPage.sections]
          .filter((section) => section.is_active)
          .sort((a, b) => a.order - b.order || a.id - b.id)
      : fallbackSections;

  const currentCategory = categories.find(isCurrentCategory);
  const categoryName = currentCategory?.name ?? CATEGORY_FALLBACK_NAME;

  const categoryLeague =
    currentCategory?.league_name || "Slovenská florbalová extraliga";

  const heroImage: string = withDevMediaCacheBuster(
    normalizeMediaUrl(
      currentCategory?.hero_image_url,
      "/images/kategorie/muzi_kader.jpg",
    ),
    Boolean(currentCategory?.hero_image_url),
  );

  const muziPosts = posts.filter(isCurrentCategoryPost);

  const standings = szfbDashboard?.standings ?? [];
  const upcomingMatches = szfbDashboard?.upcoming ?? [];
  const resultMatches = szfbDashboard?.results ?? [];
  const playerStats = szfbDashboard?.player_stats ?? [];

  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName = "Extraliga";

  const nextMatch = upcomingMatches[0] ?? null;

  const currentSeason =
    currentCategory?.season ?? clubSeason?.season ?? "2025 / 2026";

  const renderHeroSection = (section: PageSection) => {
    return (
      <section key={section.id} className={styles.heroSection}>
        <div className={styles.bannerContainer}>
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1300px"
            className={styles.heroImg}
          />

          <div className={styles.bannerOverlay}>
            <div className={styles.heroTextContent}>
              <span className={styles.heroSubtitle}>
                {getSectionPreTitle(section, categoryLeague)}
              </span>

              <h1 className={styles.bannerTitle}>
                {getSectionTitle(section, categoryName)}
              </h1>

              <div className={styles.heroQuickNav}>
                <a href="#novinky" className={styles.heroQuickLink}>
                  Novinky
                </a>

                <a href="#tabulka" className={styles.heroQuickLink}>
                  Tabuľka
                </a>

                <a href="#hraci" className={styles.heroQuickLink}>
                  Hráči
                </a>
              </div>
            </div>

            <div className={styles.heroMiniInfo}>
              <span className={styles.heroMiniLabel}>Sezóna</span>
              <span className={styles.heroMiniValue}>{currentSeason}</span>
            </div>
          </div>
        </div>

        <NextMatchCountdown
          matchDate={nextMatch?.match_date ?? null}
          matchTime={nextMatch?.match_time ?? null}
          opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
          ownTeamName={ownTeamName}
          isHome={nextMatch?.is_home ?? null}
        />
      </section>
    );
  };

  const renderMatchesSection = (section: PageSection) => {
    if (
      section.hide_when_empty &&
      upcomingMatches.length === 0 &&
      resultMatches.length === 0
    ) {
      return null;
    }

    return (
      <section key={section.id} id="zapasy" className={styles.sectionContainer}>
        <NasledujuceZapasy
          upcomingMatches={upcomingMatches}
          resultMatches={resultMatches}
          ownTeamName={ownTeamName}
          competitionName={competitionName}
        />
      </section>
    );
  };

  const renderPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && muziPosts.length === 0) {
      return null;
    }

    return (
      <section key={section.id} id="novinky" className={styles.sectionContainer}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "Aktuálne dianie")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Najdôležitejšie novinky")}
            </h2>
          </div>
        </div>

        <Novinky posts={muziPosts} />
      </section>
    );
  };

  const renderOverviewSection = (section: PageSection) => {
    if (
      section.hide_when_empty &&
      standings.length === 0 &&
      resultMatches.length === 0
    ) {
      return null;
    }

    return (
      <section key={section.id} id="tabulka" className={styles.overviewSection}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "Extraliga")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Výsledky")}
            </h2>
          </div>
        </div>

        <div className={styles.overviewGrid}>
          <div className={styles.tableColumn}>
            <Tabulka standings={standings} ownTeamName={ownTeamName} />
          </div>

          <div className={styles.matchesColumn}>
            <RecentMatches results={resultMatches} ownTeamName={ownTeamName} />
          </div>
        </div>
      </section>
    );
  };

  const renderLeadersSection = (section: PageSection) => {
    if (section.hide_when_empty && playerStats.length === 0) {
      return null;
    }

    return (
      <section key={section.id} id="hraci" className={styles.bottomSection}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "Štatistiky tímu")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Lídri sezóny")}
            </h2>
          </div>
        </div>

        <TopPlayer players={playerStats} />
      </section>
    );
  };

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "hero":
        return renderHeroSection(section);

      case "next_match":
      case "matches":
      case "category_matches":
        return renderMatchesSection(section);

      case "posts":
      case "category_posts":
        return renderPostsSection(section);

      case "matches_overview":
      case "standings":
      case "results":
        return renderOverviewSection(section);

      case "leaders":
      case "player_stats":
      case "top_players":
        return renderLeadersSection(section);

      default:
        warnUnsupportedSection("/kategorie/muzi", section.section_type);
        return null;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        {sections.map((section) => renderSection(section))}
      </main>

      <Footer />
    </div>
  );
}
