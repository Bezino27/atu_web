import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import pageStyles from "../styles/CategoryPage.module.css";
import heroStyles from "../styles/CategoryHero.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import HeroScrollZoomImage from "@/app/components/HeroScrollZoomImage";
import Novinky from "./components/novinky";
import RecentMatches from "./components/posledne_zapasy";
import Tabulka from "./components/tabulka";
import NextMatchCountdown from "./components/NextMatchCountdown";
import SeasonLeadersSection from "./components/najlepsi_hrac";
import CategoryHeroContent from "../components/CategoryHeroContent";
import {
  getSzfbDashboard,
  getSzfbWatchIdForCategory,
} from "@/app/lib/szfb";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import { getClubSeason } from "../../lib/season";
import { API_URL } from "@/app/lib/api";
import {
  getActiveSortedSections,
  getClubPageBySlug,
  getSectionPreTitle,
  getSectionTitle,
  warnUnsupportedSection,
  type PageSection,
} from "@/app/lib/pages";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_URL,
  SITE_NAME,
} from "../../lib/seo";

export const metadata: Metadata = {
  title: "Juniori",
  description:
    "Juniorská kategória florbalového klubu ATU Košice. Sledujte novinky, zápasy, výsledky, tabuľku a informácie o junioroch.",
  alternates: {
    canonical: absoluteUrl("/kategorie/juniori"),
  },
  openGraph: {
    title: `Juniori | ${SITE_NAME}`,
    description:
      "Novinky, zápasy, výsledky a tabuľka juniorského tímu ATU Košice.",
    url: absoluteUrl("/kategorie/juniori"),
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

const CLUB_SLUG = "atu-kosice";
const CATEGORY_SLUG = "juniori";
const CATEGORY_FALLBACK_NAME = "Juniori";

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
    title: "Featured zápasy",
    pre_title: "Zápasy",
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

  return categorySlug === CATEGORY_SLUG || categoryName === CATEGORY_SLUG;
}

function isCurrentCategoryPost(post: Post) {
  const categoryName = normalizeText(post.category?.name);

  return categoryName === CATEGORY_SLUG || categoryName === "mladez";
}

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const res = await fetch(`${API_URL}/public/teams/${CLUB_SLUG}/`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function JunioriPage() {
  await connection();

  const [categoryPage, posts, clubSeason, categories, watchId] =
    await Promise.all([
      getClubPageBySlug(CLUB_SLUG, CATEGORY_SLUG),
      getHomepagePosts(CLUB_SLUG),
      getClubSeason(CLUB_SLUG),
      getCategories(),
      getSzfbWatchIdForCategory(CLUB_SLUG, CATEGORY_SLUG),
    ]);

  const szfbDashboard = watchId ? await getSzfbDashboard(watchId) : null;
  const currentCategory = categories.find(isCurrentCategory);
  const categoryName = currentCategory?.name ?? CATEGORY_FALLBACK_NAME;
  const categoryLeague =
    currentCategory?.league_name ||
    "Slovenská florbalová juniorská extraliga";


  const junioriPosts = posts.filter(isCurrentCategoryPost);
  const standings = szfbDashboard?.standings ?? [];
  const standingZones = szfbDashboard?.standing_zones ?? [];
  const upcomingMatches = szfbDashboard?.upcoming ?? [];
  const resultMatches = szfbDashboard?.results ?? [];
  const recentForm = szfbDashboard?.form ?? [];
  const playerStats = szfbDashboard?.player_stats ?? [];
  const activePlayerStats = playerStats.filter(
    (player) => player.is_active !== false,
  );

  const ownTeamName =
    szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const ownTeamBrand = szfbDashboard?.watch?.team_brand ?? null;
  const competitionName =
    szfbDashboard?.watch?.competition_name ||
    currentCategory?.league_name ||
    "Extraliga";

  const nextMatch = upcomingMatches[0] ?? null;
  const currentSeason =
    currentCategory?.season ?? clubSeason?.season ?? "2025 / 2026";

  const heroDescription = currentCategory?.description?.trim() || "";

  const sections = getActiveSortedSections(
    categoryPage?.sections,
    fallbackSections,
  );

  const renderHeroSection = (section: PageSection) => (
    <section
      key={section.id}
      className={`${heroStyles.heroSection} ${heroStyles.heroArtworkSection}`}
    >
      <div
        className={`${heroStyles.bannerContainer} ${heroStyles.heroArtworkBanner}`}
      >
        <HeroScrollZoomImage
          src="/jex_backg_big.png"
          mobileSrc="/jex_backg_phone.png"
          mobileBreakpoint={768}
          alt=""
          wrapperClassName={heroStyles.heroArtworkBannerMedia}
          imageClassName={heroStyles.heroArtworkBannerImage}
          priority
          sizes="100vw"
          scrollZoom={1.05}
          scrollDistance={0.2}
          smoothing={0.12}
        />

        <div className={heroStyles.heroInner}>
          <div className={heroStyles.heroMetaRow}>
            <span className={heroStyles.heroLeagueText}>{categoryLeague}</span>
          </div>

          <CategoryHeroContent
            title={getSectionTitle(section, categoryName)}
            description={heroDescription}
            actions={[
              { href: "#tabulka", label: "Tabuľka" },
              { href: "#novinky", label: "Novinky" },
              { href: "#lidri", label: "Lídri" },
            ]}
          />
        </div>

        <NextMatchCountdown
          matchDate={nextMatch?.match_date ?? null}
          matchTime={nextMatch?.match_time ?? null}
          opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
          ownTeamName={ownTeamName}
          isHome={nextMatch?.is_home ?? null}
        />
      </div>
    </section>
  );

  const renderMatchesSection = (section: PageSection) => {
    if (section.hide_when_empty && upcomingMatches.length === 0) {
      return null;
    }

    return (
      <section
        key={section.id}
        id="zapasy"
        className={pageStyles.sectionContainer}
      >
        <NasledujuceZapasy
          upcomingMatches={upcomingMatches}
          ownTeamName={ownTeamName}
          ownTeamBrand={ownTeamBrand}
          competitionName={competitionName}
          preTitle={getSectionPreTitle(section, "Zápasy")}
          title={getSectionTitle(section, "Featured zápasy")}
        />
      </section>
    );
  };

  const renderPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && junioriPosts.length === 0) {
      return null;
    }

    return (
      <section
        key={section.id}
        id="novinky"
        className={pageStyles.sectionContainer}
      >
        <div className={pageStyles.resultsHeader}>
          <div>
            <span className={pageStyles.preTitle}>
              {getSectionPreTitle(section, "Aktuálne dianie")}
            </span>

            <h2 className={pageStyles.sectionTitle}>
              {getSectionTitle(section, "Najdôležitejšie novinky")}
            </h2>
          </div>
        </div>

        <Novinky posts={junioriPosts} />
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
      <section
        key={section.id}
        id="tabulka"
        className={pageStyles.overviewSection}
      >
        <div className={pageStyles.resultsHeader}>
          <div>
            <span className={pageStyles.preTitle}>
              {getSectionPreTitle(section, "Extraliga")}
            </span>

            <h2 className={pageStyles.sectionTitle}>
              {getSectionTitle(section, "Výsledky")}
            </h2>
          </div>
        </div>

        <div className={pageStyles.overviewGrid}>
          <div className={pageStyles.tableColumn}>
            <Tabulka
              standings={standings}
              zones={standingZones}
              ownTeamName={ownTeamName}
              competitionName={competitionName}
            />
          </div>

          <div className={pageStyles.matchesColumn}>
            <RecentMatches
              results={resultMatches}
              form={recentForm}
              ownTeamName={ownTeamName}
              ownTeamBrand={ownTeamBrand}
              competitionName={competitionName}
            />
          </div>
        </div>
      </section>
    );
  };

  const renderLeadersSection = (section: PageSection) => {
    if (section.hide_when_empty && activePlayerStats.length === 0) {
      return null;
    }

    return (
      <section
        key={section.id}
        id="lidri"
        className={pageStyles.sectionContainer}
      >
        <div className={pageStyles.resultsHeader}>
          <div>
            <span className={pageStyles.preTitle}>
              {getSectionPreTitle(section, "Štatistiky tímu")}
            </span>

            <h2 className={pageStyles.sectionTitle}>
              {getSectionTitle(section, "Lídri sezóny")}
            </h2>
          </div>
        </div>

        <SeasonLeadersSection players={activePlayerStats} />
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
      case "recent_matches":
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
        warnUnsupportedSection(
          "/kategorie/juniori",
          section.section_type,
        );
        return null;
    }
  };

  return (
    <div className={pageStyles.pageContainer}>
      <Header />
      <main className={pageStyles.content}>
        {sections.map((section) => renderSection(section))}
      </main>
      <Footer />
    </div>
  );
}
