import React from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import NasledujuceZapasy from "../juniori/components/nasledujuce_zapasy";
import Novinky from "../juniori/components/novinky";
import TopPlayer from "../juniori/components/najlepsi_hrac";
import RecentMatches from "../juniori/components/posledne_zapasy";
import Tabulka from "../juniori/components/tabulka";
import NextMatchCountdown from "../juniori/components/NextMatchCountdown";

import {
  API_URL,
  getApiFetchOptions,
  normalizeHtmlMediaUrls,
  normalizeMediaUrl,
  withDevMediaCacheBuster,
} from "@/app/lib/api";
import { getClub, type ClubLink } from "@/app/lib/club";
import { getActiveClubLinks } from "@/app/lib/clubLinks";
import {
  getActiveSortedSections,
  getClubPageBySlug,
  getSectionPreTitle,
  getSectionTitle,
  warnUnsupportedSection,
  type PageSection,
  type PageSectionItem,
} from "@/app/lib/pages";
import { getHomepagePosts, getPostsByCategory, type Post } from "@/app/lib/posts";
import { getClubSeason } from "@/app/lib/season";
import { getSzfbDashboard, getSzfbNextMatch } from "@/app/lib/szfb";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "@/app/lib/seo";
import PripravkaTrainings from "../pripravka/components/treningy_pripravka";
import DorastTrainings from "../dorast/components/treningy_dorast";
import StarsiZiaciTrainings from "../starsi-ziaci/components/treningy_starsi_ziaci";
import MladsiZiaciTrainings from "../mladsi-ziaci/components/treningy_mladsi_ziaci";
import PripravkaRecruitment from "../pripravka/components/nabor";
import DorastRecruitment from "../dorast/components/nabor";
import StarsiZiaciRecruitment from "../starsi-ziaci/components/nabor";
import MladsiZiaciRecruitment from "../mladsi-ziaci/components/nabor";

import styles from "../styles/unified.module.css";
import szfbStyle from "../styles/szfb_cards.module.css";

type SzfbDashboardData = Awaited<ReturnType<typeof getSzfbDashboard>>;
type SzfbNextMatchData = Awaited<ReturnType<typeof getSzfbNextMatch>>;

type SectionLink = {
  id: string | number;
  title: string;
  url: string;
  badge?: string;
};

type BackendCategory = {
  id: number;
  name: string;
  slug?: string | null;
  season?: string | null;
  description?: string | null;
  category_subname?: string | null;
  league_name?: string | null;
  hero_image_url?: string | null;
  birth_year_from?: number | null;
  birth_year_to?: number | null;
  order?: number | null;
  is_active?: boolean | null;
  coach_name?: string | null;
  coach_email?: string | null;
  coach_phone?: string | null;

  szfb_watch_id?: number | null;
  szfb_team_watch_id?: number | null;
  watch_id?: number | null;
};

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const CLUB_SLUG = "atu-kosice";

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
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategorySlug(category: BackendCategory) {
  return category.slug || createSlugFromName(category.name);
}

function getCategoryWatchId(category: BackendCategory | null) {
  if (!category) {
    return null;
  }

  return (
    category.szfb_team_watch_id ??
    category.szfb_watch_id ??
    category.watch_id ??
    null
  );
}

function isCategoryPost(
  post: Post,
  dataCategorySlug: string,
  categoryName?: string | null,
) {
  const postCategorySlug = normalizeText(post.category?.slug);
  const postCategoryName = normalizeText(post.category?.name);
  const normalizedDataCategorySlug = normalizeText(dataCategorySlug);
  const normalizedCategoryName = normalizeText(categoryName);

  return (
    postCategorySlug === normalizedDataCategorySlug ||
    postCategoryName === normalizedDataCategorySlug ||
    (!!normalizedCategoryName && postCategoryName === normalizedCategoryName) ||
    postCategoryName === "mladez"
  );
}

function getConfiguredIds(config: Record<string, unknown>, key: string) {
  const value = config[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function filterByConfiguredIds<T extends { id: number }>(
  items: T[],
  ids: number[],
) {
  if (ids.length === 0) {
    return items;
  }

  const allowedIds = new Set(ids);
  return items.filter((item) => allowedIds.has(item.id));
}

function getManualLinks(config: Record<string, unknown>) {
  const value = config.links;

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title.trim() : "";
      const url = typeof record.url === "string" ? record.url.trim() : "";

      if (!title || !url) {
        return null;
      }

      return {
        id: `manual-${index}-${title}`,
        title,
        url,
        badge: "ODKAZ",
      };
    })
    .filter(Boolean) as SectionLink[];
}

function mapSectionItemsToLinks(items?: PageSectionItem[]) {
  return [...(items ?? [])]
    .filter((item) => item.is_active !== false && item.url)
    .sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title, "sk"),
    )
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url || "",
      badge: "ODKAZ",
    }));
}

function mapClubLinksToSectionLinks(links: ClubLink[]) {
  return links.map((link) => ({
    id: link.id,
    title: link.title,
    url: link.url,
    badge: link.icon_type?.toUpperCase() || "ODKAZ",
  }));
}

function getDefaultSzfbLinks(dataCategorySlug: string): SectionLink[] {
  const linksBySlug: Record<string, Array<{ title: string; url: string }>> = {
    pripravka: [
      {
        title: "Detail tímu",
        url: "https://www.szfb.sk/sk/stats/teams/1177/liga-starsej-pripravky-vychod/team/669796/fabk-atu-kosice",
      },
      {
        title: "Výsledky a program",
        url: "https://www.szfb.sk/sk/stats/results/1177/liga-starsej-pripravky-vychod",
      },
    ],
    "mladsi-ziaci": [
      {
        title: "Detail tímu",
        url: "https://www.szfb.sk/sk/stats/teams/1178/liga-mladsich-ziakov-vychod/team/669483/fabk-atu-kosice",
      },
      {
        title: "Tabuľka",
        url: "https://www.szfb.sk/sk/stats/standings/1178/liga-mladsich-ziakov-vychod",
      },
      {
        title: "Výsledky a program",
        url: "https://www.szfb.sk/sk/stats/results-date/1178",
      },
    ],
    "starsi-ziaci": [
      {
        title: "Detail tímu",
        url: "https://www.szfb.sk/sk/stats/teams/1179/liga-starsich-ziakov-vychod/team/669500/fabk-atu-kosice",
      },
      {
        title: "Tabuľka",
        url: "https://www.szfb.sk/sk/stats/standings/1179/liga-starsich-ziakov-vychod?StatsType=overall&TournamentPartID=4528",
      },
      {
        title: "Výsledky a program",
        url: "https://www.szfb.sk/sk/stats/results-date/1179/1-liga-starsich-ziakov-vychod",
      },
    ],
    dorast: [
      {
        title: "Detail tímu",
        url: "https://www.szfb.sk/sk/stats/teams/1171/1-liga-dorastencov-divizia-vychod/team/669890/fabk-atu-kosice",
      },
      {
        title: "Tabuľka",
        url: "https://www.szfb.sk/sk/stats/standings/1171/1-liga-dorastencov-divizia-vychod",
      },
      {
        title: "Výsledky a program",
        url: "https://www.szfb.sk/sk/stats/results-date/1171/1-liga-dorastencov-divizia-vychod",
      },
    ],
  };

  return (linksBySlug[dataCategorySlug] ?? []).map((link, index) => ({
    id: `${dataCategorySlug}-szfb-${index}`,
    title: link.title,
    url: link.url,
    badge: "SZFB",
  }));
}

function getTrainingComponent(dataCategorySlug: string) {
  if (dataCategorySlug === "pripravka") {
    return PripravkaTrainings;
  }

  if (dataCategorySlug === "dorast") {
    return DorastTrainings;
  }

  if (dataCategorySlug === "starsi-ziaci") {
    return StarsiZiaciTrainings;
  }

  if (dataCategorySlug === "mladsi-ziaci") {
    return MladsiZiaciTrainings;
  }

  return null;
}

function getRecruitmentComponent(dataCategorySlug: string) {
  if (dataCategorySlug === "pripravka") {
    return PripravkaRecruitment;
  }

  if (dataCategorySlug === "dorast") {
    return DorastRecruitment;
  }

  if (dataCategorySlug === "starsi-ziaci") {
    return StarsiZiaciRecruitment;
  }

  if (dataCategorySlug === "mladsi-ziaci") {
    return MladsiZiaciRecruitment;
  }

  return null;
}

function usesYouthHeroTitle(dataCategorySlug: string) {
  return ["pripravka", "mladsi-ziaci", "starsi-ziaci"].includes(
    dataCategorySlug,
  );
}

async function getCategories(): Promise<BackendCategory[]> {
  try {
    const response = await fetch(
      `${API_URL}/public/teams/${CLUB_SLUG}/`,
      getApiFetchOptions(60),
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getDashboardSafe(
  watchId: number | null,
): Promise<SzfbDashboardData | null> {
  if (!watchId) {
    return null;
  }

  try {
    return await getSzfbDashboard(watchId);
  } catch {
    return null;
  }
}

async function getNextMatchSafe(
  watchId: number | null,
): Promise<SzfbNextMatchData | null> {
  if (!watchId) {
    return null;
  }

  try {
    return await getSzfbNextMatch(watchId);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getClubPageBySlug(CLUB_SLUG, slug);

  if (!page || page.page_type !== "category") {
    return {};
  }

  const title = page.meta_title || page.title;
  const description =
    page.meta_description ||
    `Kategória ${page.title} florbalového klubu ATU Košice.`;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/kategorie/${slug}`),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/kategorie/${slug}`),
      type: "website",
      images: [DEFAULT_OG_IMAGE_URL],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connection();

  const { slug: pageSlug } = await params;

  const page = await getClubPageBySlug(CLUB_SLUG, pageSlug);

  if (!page || page.page_type !== "category") {
    notFound();
  }

  const linkedCategory = page.team_category as BackendCategory | null;
  const dataCategorySlug = linkedCategory?.slug || null;

  if (!linkedCategory || !dataCategorySlug) {
    return (
      <div className={styles.pageContainer}>
        <Header />

        <main className={styles.content}>
          <section className={styles.sectionContainer}>
            <div className={styles.resultsHeader}>
              <div>
                <span className={styles.preTitle}>KATEGÓRIA</span>
                <h1 className={styles.sectionTitle}>{page.title}</h1>
              </div>
            </div>

            <p>
              Táto stránka ešte nemá napojenú tímovú kategóriu. Skontroluj
              nastavenie stránky v administrácii.
            </p>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const categoryDataSlug = dataCategorySlug;

  const [allPosts, postsByCategory, clubSeason, categories, club] = await Promise.all([
    getHomepagePosts(CLUB_SLUG),
    getPostsByCategory(CLUB_SLUG, categoryDataSlug),
    getClubSeason(CLUB_SLUG),
    getCategories(),
    getClub(CLUB_SLUG),
  ]);

  const backendCategory = categories.find(
    (category) =>
      normalizeText(getCategorySlug(category)) === normalizeText(categoryDataSlug),
  );

  const category: BackendCategory = backendCategory ?? linkedCategory;

  const categoryName = page.title || category.name;
  const categoryLeague =
    category.league_name || linkedCategory.league_name || "Liga";

  const watchId = getCategoryWatchId(category);

  const [szfbDashboard, nextMatchResponse] = await Promise.all([
    getDashboardSafe(watchId),
    getNextMatchSafe(watchId),
  ]);

  const categoryPosts =
    postsByCategory.length > 0
      ? postsByCategory
      : allPosts.filter((post) =>
          isCategoryPost(post, categoryDataSlug, category.name),
        );
  const activeClubLinks = getActiveClubLinks(club?.links);

  const standings = szfbDashboard?.standings ?? [];
  const upcomingMatches = szfbDashboard?.upcoming ?? [];
  const resultMatches = szfbDashboard?.results ?? [];
  const playerStats = szfbDashboard?.player_stats ?? [];

  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName = categoryLeague || "Liga";
  const nextMatch = nextMatchResponse?.next_match ?? upcomingMatches[0] ?? null;
  const currentSeason = category.season ?? clubSeason?.season ?? "2025 / 2026";
  const hasSzfbDashboard = Boolean(watchId);
  const hasYouthHeroTitle = usesYouthHeroTitle(categoryDataSlug);

  const sections = getActiveSortedSections(page.sections, fallbackSections);

  const heroImage = withDevMediaCacheBuster(
    normalizeMediaUrl(category.hero_image_url, "/images/kategorie/pripravka.jpg"),
    Boolean(category.hero_image_url),
  );

  const renderHeroSection = (section: PageSection) => {
    const heroTitle = getSectionTitle(section, categoryName);

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
            {hasSzfbDashboard ? (
              <span className={styles.heroSubtitle}>
                {getSectionPreTitle(
                  section,
                  category.category_subname ||
                    linkedCategory.category_subname ||
                    categoryLeague,
                )}
              </span>
            ) : null}

            <h1
              className={
                hasYouthHeroTitle
                  ? `${styles.bannerTitleziaci} ${
                      heroTitle.replace(/\s+/g, "").length > 8
                        ? styles.bannerTitleziaciLong
                        : ""
                    }`
                  : styles.bannerTitle
              }
            >
              {heroTitle}
            </h1>

            <div className={styles.heroQuickNav}>
              {hasSzfbDashboard ? (
                <>
                  <a href="#zapasy" className={styles.heroQuickLink}>
                    Zápasy
                  </a>
                  <a href="#tabulka" className={styles.heroQuickLink}>
                    Tabuľka
                  </a>
                  <a href="#hraci" className={styles.heroQuickLink}>
                    Hráči
                  </a>
                </>
              ) : (
                <>
                  <a href="#odkazy" className={styles.heroQuickLink}>
                    Odkazy
                  </a>
                  <a href="#treningy" className={styles.heroQuickLink}>
                    Tréningy
                  </a>
                  <a href="#novinky" className={styles.heroQuickLink}>
                    Novinky
                  </a>
                </>
              )}
            </div>
          </div>

          <div className={styles.heroMiniInfo}>
            <span className={styles.heroMiniLabel}>Sezóna</span>
            <span className={styles.heroMiniValue}>{currentSeason}</span>
          </div>
        </div>
      </div>

      {hasSzfbDashboard ? (
        <NextMatchCountdown
          matchDate={nextMatch?.match_date ?? null}
          matchTime={nextMatch?.match_time ?? null}
          opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
          ownTeamName={ownTeamName}
          isHome={nextMatch?.is_home ?? null}
        />
      ) : null}
    </section>
    );
  };

  const renderCustomTextSection = (section: PageSection) => {
    if (section.hide_when_empty && !section.content) {
      return null;
    }

    const contentHtml = normalizeHtmlMediaUrls(section.content);

    return (
      <section key={section.id} className={styles.sectionContainer}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "KATEGÓRIA")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Informácie o kategórii")}
            </h2>
          </div>
        </div>

        {contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        ) : (
          <p>{category.description || category.league_name || category.name}</p>
        )}
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
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "Zápasy")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Featured zápasy")}
            </h2>
          </div>
        </div>

        <NasledujuceZapasy
          upcomingMatches={upcomingMatches}
          resultMatches={resultMatches}
          ownTeamName={ownTeamName}
          competitionName={competitionName}
        />
      </section>
    );
  };

  const renderTrainingsSection = (section: PageSection) => {
    const TrainingComponent = getTrainingComponent(categoryDataSlug);

    if (section.hide_when_empty && !TrainingComponent && !section.content) {
      return null;
    }

    const contentHtml = normalizeHtmlMediaUrls(section.content);

    if (TrainingComponent) {
      return (
        <section key={section.id} id="treningy" className="sectionContainer">
          <TrainingComponent />
        </section>
      );
    }

    return (
      <section key={section.id} id="treningy" className="sectionContainer">
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "Tréningy")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Kde trénujeme")}
            </h2>
          </div>
        </div>

        {contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        ) : null}

        {!contentHtml ? <p>Tréningy budú doplnené.</p> : null}
      </section>
    );
  };

  const renderRecruitmentSection = (section: PageSection) => {
    const RecruitmentComponent = getRecruitmentComponent(categoryDataSlug);
    const contentHtml = normalizeHtmlMediaUrls(section.content);

    if (section.hide_when_empty && !RecruitmentComponent && !contentHtml) {
      return null;
    }

    if (RecruitmentComponent) {
      return (
        <section key={section.id} id="nabor" className="sectionContainer">
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>
                {getSectionPreTitle(section, "Nábor")}
              </span>
              <h2 className={styles.sectionTitle}>
                {getSectionTitle(
                  section,
                  `Chceš hrať za kategóriu ${category.name.toLowerCase()}?`,
                )}
              </h2>
            </div>
          </div>

          <RecruitmentComponent />
        </section>
      );
    }

    return (
      <section key={section.id} id="nabor" className="sectionContainer">
        <div className={styles.naborSection}>
          <div className={styles.naborCard}>
            <div className={styles.naborContent}>
              <div className={styles.naborTopRow}>
                <div className={styles.naborTextWrap}>
                  <span className={styles.preTitle}>
                    {getSectionPreTitle(section, "Nábor")}
                  </span>
                  <h2 className={styles.sectionTitle}>
                    {getSectionTitle(section, "Pridaj sa k nám")}
                  </h2>
                  <div className={styles.naborDescription}>
                    {contentHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                    ) : (
                      <p>
                        Máš záujem o tréning v kategórii {category.name}? Vyplň
                        náborový formulár alebo nás kontaktuj.
                      </p>
                    )}
                  </div>
                </div>

                <Link href="/pridaj_sa" className={styles.naborPrimaryButton}>
                  Získať viac informácií
                </Link>
              </div>

              <div className={styles.naborInfoGrid}>
                <div className={styles.naborInfoItem}>
                  <div className={styles.naborInfoLabel}>Ročník</div>
                  <div className={styles.naborInfoValue}>
                    {category.birth_year_from && category.birth_year_to
                      ? `${Math.min(category.birth_year_from, category.birth_year_to)} – ${Math.max(
                          category.birth_year_from,
                          category.birth_year_to,
                        )}`
                      : "Bude doplnené"}
                  </div>
                </div>

                <div className={styles.naborInfoItem}>
                  <div className={styles.naborInfoLabel}>Kontakt na trénera</div>
                  <div className={styles.naborInfoValue}>
                    {category.coach_name || "Tréner"}
                    {category.coach_email ? (
                      <>
                        <br />
                        {category.coach_email}
                      </>
                    ) : null}
                    {category.coach_phone ? (
                      <>
                        <br />
                        {category.coach_phone}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
    );
  };

  const renderPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && categoryPosts.length === 0) {
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

        <Novinky posts={categoryPosts} />
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

  const renderLinksSection = (section: PageSection) => {
    const selectedLinkIds = getConfiguredIds(section.config, "link_ids");
    const itemLinks = mapSectionItemsToLinks(section.items);
    const manualLinks = getManualLinks(section.config);
    const configuredClubLinks =
      selectedLinkIds.length > 0
        ? filterByConfiguredIds(activeClubLinks, selectedLinkIds)
        : [];
    const links =
      itemLinks.length > 0
        ? itemLinks
        : manualLinks.length > 0
          ? manualLinks
          : configuredClubLinks.length > 0
            ? mapClubLinksToSectionLinks(configuredClubLinks)
            : section.section_type === "links"
              ? getDefaultSzfbLinks(categoryDataSlug)
              : [];

    if (links.length === 0 && section.hide_when_empty) {
      return null;
    }

    return (
      <section key={section.id} id="odkazy" className={styles.sectionContainer}>
        <div className={styles.resultsHeader}>
          <div>
            <span className={styles.preTitle}>
              {getSectionPreTitle(section, "ODKAZY")}
            </span>
            <h2 className={styles.sectionTitle}>
              {getSectionTitle(section, "Odkazy")}
            </h2>
          </div>
        </div>

        {links.length > 0 ? (
          <div className={szfbStyle.szfbSection}>
            <div className={szfbStyle.szfbGrid}>
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={szfbStyle.szfbCard}
                >
                  <div className={szfbStyle.szfbCardTop}>
                    <span className={szfbStyle.szfbBadge}>
                      {link.badge || "ODKAZ"}
                    </span>
                    <span className={szfbStyle.szfbArrow}>↗</span>
                  </div>

                  <h3 className={szfbStyle.szfbCardTitle}>{link.title}</h3>
                  <span className={szfbStyle.szfbCardLink}>Otvoriť odkaz</span>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p>Odkazy zatiaľ nie sú dostupné.</p>
        )}
      </section>
    );
  };

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "hero":
        return renderHeroSection(section);

      case "custom_text":
        return renderCustomTextSection(section);

      case "next_match":
      case "recent_matches":
        return renderMatchesSection(section);

      case "posts":
        return renderPostsSection(section);

      case "matches_overview":
      case "standings":
        return renderOverviewSection(section);

      case "leaders":
        return renderLeadersSection(section);

      case "links":
      case "custom_links":
        return renderLinksSection(section);

      case "trainings":
        return renderTrainingsSection(section);

      case "recruitment":
        return renderRecruitmentSection(section);

      default:
        warnUnsupportedSection(`/kategorie/${pageSlug}`, section.section_type);
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
