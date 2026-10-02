import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { connection } from "next/server";
import { PiArrowRight } from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { AllArticlesLink, ArticlePreviewCard } from "./clanky/[slug]/ArticleSidebar";
import { getHomepagePosts, type Post } from "./lib/posts";
import { getClubHomePage, getImageUrl, type PageSection } from "./lib/api";
import {
  getSzfbDashboard,
  getSzfbWatchIdForCategory,
  type SzfbMatch,
  type SzfbStandingRow,
} from "./lib/szfb";
import { getClubPartners, getPartnerImageUrl } from "./lib/partners";
import PollSection from "./components/poll/PollSection";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "./lib/seo";
import Tabulka from "./kategorie/muzi/components/tabulka";
import RecentMatches from "./kategorie/muzi/components/posledne_zapasy";
import categoryPageStyles from "./kategorie/styles/CategoryPage.module.css";
import NasledujuceZapasy from "./kategorie/muzi/components/nasledujuce_zapasy";
import ArticleCard from "./clanky/ArticleCard";

const CLUB_SLUG = "atu-kosice";
const MEN_COMPETITION_LOGO = "/logo/muzi_extraliga_logo.png";

export const metadata: Metadata = {
  title: "ATU Košice – Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy, hráč mesiaca a klubové články na jednom mieste.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${SITE_NAME} – Florbalový klub`,
    description:
      "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy a klubové články.",
    url: absoluteUrl("/"),
    type: "website",
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function isGrantBannerPartner(partnerName: string, imageSrc: string) {
  const normalizedPartnerName = normalizeText(partnerName);
  const normalizedImageSrc = normalizeText(imageSrc);

  return (
    normalizedPartnerName.includes("dotacia") ||
    normalizedImageSrc.includes("screenshot_2026-05-25_at_13.55.15")
  );
}

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

const fallbackSections: PageSection[] = [
  {
    id: -1,
    section_type: "top_posts",
    title: "Najdôležitejšie novinky",
    pre_title: "Top obsah",
    order: 1,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -2,
    section_type: "matches_overview",
    title: "Výsledky",
    pre_title: "Liga",
    order: 2,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -3,
    section_type: "next_match",
    title: "Najbližšie zápasy",
    pre_title: "Program",
    order: 3,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -4,
    section_type: "poll",
    title: "Hlasovanie fanúšikov",
    pre_title: "Anketa",
    order: 4,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -5,
    section_type: "posts",
    title: "Ďalšie novinky a články",
    pre_title: "Klubový obsah",
    order: 5,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -6,
    section_type: "partners",
    title: "Podporujú náš klub",
    pre_title: "Partneri",
    order: 6,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
];

type PartnerGroupKey = "general" | "main" | "partner" | "media";

const PARTNER_GROUP_ORDER: PartnerGroupKey[] = [
  "general",
  "main",
  "partner",
  "media",
];

const PARTNER_GROUP_LABELS: Record<PartnerGroupKey, string> = {
  general: "Generálni partneri",
  main: "Hlavní partneri",
  partner: "Partneri",
  media: "Mediálni partneri",
};

function normalizePartnerTier(tier?: string | null): PartnerGroupKey {
  if (
    tier === "general" ||
    tier === "main" ||
    tier === "partner" ||
    tier === "media"
  ) {
    return tier;
  }

  return "partner";
}

export default async function HomePage() {
  await connection();

  const [homePage, posts, partners, watchId] = await Promise.all([
    getClubHomePage(CLUB_SLUG),
    getHomepagePosts(CLUB_SLUG, 7),
    getClubPartners(CLUB_SLUG),
    getSzfbWatchIdForCategory(CLUB_SLUG, "muzi"),
  ]);

  const szfbDashboard = watchId ? await getSzfbDashboard(watchId) : null;

  const sections =
    homePage?.sections && homePage.sections.length > 0
      ? [...homePage.sections]
          .filter((section) => section.is_active)
          .sort((a, b) => a.order - b.order || a.id - b.id)
      : fallbackSections;

  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName = szfbDashboard?.watch?.competition_name || "SZFB súťaž";

  const heroArticle: Post | undefined = posts[0];
  const sideArticles: Post[] = posts.slice(1, 3);
  const latestPosts: Post[] = posts.slice(3, 7);

  const standings: SzfbStandingRow[] = szfbDashboard?.standings ?? [];
  const results: SzfbMatch[] = szfbDashboard?.results ?? [];
  const upcomingMatches: SzfbMatch[] = szfbDashboard?.upcoming ?? [];
  const partnersWithLogos = partners
    .map((partner) => ({
      partner,
      imageSrc: getPartnerImageUrl(partner),
      tier: normalizePartnerTier(partner.tier),
    }))
    .filter(({ imageSrc }) => Boolean(imageSrc))
    .sort((a, b) => {
      const tierCompare =
        PARTNER_GROUP_ORDER.indexOf(a.tier) -
        PARTNER_GROUP_ORDER.indexOf(b.tier);

      if (tierCompare !== 0) return tierCompare;

      const orderCompare = (a.partner.order ?? 0) - (b.partner.order ?? 0);
      if (orderCompare !== 0) return orderCompare;

      return a.partner.name.localeCompare(b.partner.name, "sk");
    });

  const partnerGroups = PARTNER_GROUP_ORDER.map((tier) => ({
    tier,
    label: PARTNER_GROUP_LABELS[tier],
    items: partnersWithLogos.filter((item) => item.tier === tier),
  })).filter((group) => group.items.length > 0);

  const renderTopPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && !heroArticle) return null;
    const heroDate = heroArticle?.published_at || heroArticle?.updated_at;
    return (
      <section key={section.id} className="sectionContainer">
        <div className={`resultsHeader hasAction ${styles.topNewsHeader}`}>
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Top obsah")}
            </span>
            <h1 className="sectionTitle">
              {getSectionTitle(section, "Najdôležitejšie novinky")}
            </h1>
          </div>
          <Link href="/clanky" className={styles.topNewsAllLink}>
            <span>Všetky články</span>
            <span className={styles.topNewsAllLinkArrow} aria-hidden="true">
              <PiArrowRight />
            </span>
          </Link>
        </div>
        {heroArticle ? (
          <div className={styles.topNewsGrid}>
            <Link
              href={`/clanky/${heroArticle.slug}`}
              className={styles.topNewsMain}
            >
              <div className={styles.topNewsMainImageWrap}>
                {/* Preserve the source image's full natural aspect ratio. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(heroArticle.featured_image)}
                  alt={heroArticle.title}
                  className={styles.cardImage}
                  loading="eager"
                  fetchPriority="high"
                />
                <div className={styles.imageOverlay} />
              </div>
              <div className={styles.topNewsMainContent}>
                <div className={styles.metaRow}>
                  <span className={styles.badge}>
                    {heroArticle.category?.name || "Novinka"}
                  </span>
                  {heroDate ? (
                    <time dateTime={heroDate} className={styles.topNewsDate}>
                      {formatDate(heroDate)}
                    </time>
                  ) : null}
                </div>
                <h1>{heroArticle.title}</h1>
                <span className={styles.topNewsMainArrow} aria-hidden="true">
                  <PiArrowRight />
                </span>
              </div>
            </Link>
            <div
              className={`${styles.topNewsSide} ${
                sideArticles.length === 1 ? styles.topNewsSideSingle : ""
              }`}
            >
              {sideArticles.map((article) => {
                const articleDate = article.published_at || article.updated_at;
                return (
                  <Link
                    key={article.id}
                    href={`/clanky/${article.slug}`}
                    className={styles.topNewsSmall}
                  >
                    <div className={styles.topNewsSmallImageWrap}>
                      {/* Keep the complete source image visible in the compact preview. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(article.featured_image)}
                        alt={article.title}
                        className={styles.cardImage}
                        loading="lazy"
                      />
                      <div className={styles.imageOverlay} />
                    </div>
                    <div className={styles.topNewsSmallContent}>
                      <div className={styles.metaRow}>
                        <span className={styles.badge}>
                          {article.category?.name || "Novinka"}
                        </span>
                        {articleDate ? (
                          <time dateTime={articleDate} className={styles.topNewsDate}>
                            {formatDate(articleDate)}
                          </time>
                        ) : null}
                      </div>
                      <h3>{article.title}</h3>
                      <span className={styles.topNewsSmallArrow} aria-hidden="true">
                        <PiArrowRight />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className={styles.topNewsMobileList}>
              {sideArticles.map((article) => (
                <ArticlePreviewCard key={article.id} post={article} />
              ))}
              <AllArticlesLink />
            </div>
          </div>
        ) : (
          <div className={styles.emptyPosts}>
            Zatiaľ nie sú dostupné články.
          </div>
        )}
      </section>
    );
  };
  const renderMatchesOverviewSection = (section: PageSection) => {
    if (section.hide_when_empty && standings.length === 0 && results.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="overviewSection">
        <div className="resultsHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Liga")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Výsledky")}
            </h2>
          </div>
        </div>

        <div className={categoryPageStyles.overviewGrid}>
          <div className={categoryPageStyles.tableColumn}>
            <Tabulka
              standings={standings}
              zones={szfbDashboard?.standing_zones ?? []}
              ownTeamName={ownTeamName}
              competitionName={competitionName}
              competitionLogoSrc={MEN_COMPETITION_LOGO}
            />
          </div>

          <div className={categoryPageStyles.matchesColumn}>
            <RecentMatches
              results={results}
              form={szfbDashboard?.form ?? []}
              ownTeamName={ownTeamName}
              ownTeamBrand={szfbDashboard?.watch?.team_brand ?? null}
              competitionName={competitionName}
              competitionLogoSrc={MEN_COMPETITION_LOGO}
            />
          </div>
        </div>
      </section>
    );
  };

  const renderPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && latestPosts.length === 0) return null;

    return (
      <section key={section.id} className="sectionContainer">
        <div className={`resultsHeader ${styles.clubContentHeader}`}>
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Klubový obsah")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Ďalšie novinky a články")}
            </h2>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className={styles.homeArticleGrid}>
            {latestPosts.map((post) => (
              <ArticleCard key={post.id} post={post} compact />
            ))}
          </div>
        ) : (
          <div className={styles.emptyPosts}>Zatiaľ nie sú dostupné články.</div>
        )}
      </section>
    );
  };

  const renderNextMatchSection = (section: PageSection) => {
    if (section.hide_when_empty && upcomingMatches.length === 0) return null;

    return (
      <section key={section.id} className="sectionContainer">
        <NasledujuceZapasy
          upcomingMatches={upcomingMatches}
          ownTeamName={ownTeamName}
          ownTeamBrand={szfbDashboard?.watch?.team_brand ?? null}
          competitionName={competitionName}
          preTitle={getSectionPreTitle(section, "Program")}
          title={getSectionTitle(section, "Najbližšie zápasy")}
        />
      </section>
    );
  };

  const renderPollSection = (section: PageSection) => {
    return (
      <PollSection
        key={section.id}
        preTitle={getSectionPreTitle(section, "Anketa")}
        title={getSectionTitle(section, "Hlasovanie fanúšikov")}
        hideWhenEmpty={section.hide_when_empty}
      />
    );
  };

  const renderPartnerLogo = (
    partner: (typeof partnersWithLogos)[number]["partner"],
    imageSrc: string,
    tier: PartnerGroupKey
  ) => {
    const isGrantBanner = isGrantBannerPartner(partner.name, imageSrc);
    const imageWidth =
      tier === "general" ? 620 : tier === "main" ? 460 : tier === "media" ? 360 : 260;
    const imageHeight =
      tier === "general" ? 220 : tier === "main" ? 170 : tier === "media" ? 135 : 100;

    const logoClassName = [
      styles.partnerLogo,
      tier === "general" ? styles.partnerLogoGeneral : "",
      tier === "main" ? styles.partnerLogoMain : "",
      tier === "media" ? styles.partnerLogoMedia : "",
      isGrantBanner ? styles.partnerGrantBanner : "",
    ]
      .filter(Boolean)
      .join(" ");

    const cellClassName = [
      styles.partnerLogoCell,
      tier === "general" ? styles.partnerLogoCellGeneral : "",
      tier === "main" ? styles.partnerLogoCellMain : "",
      tier === "media" ? styles.partnerLogoCellMedia : "",
      isGrantBanner ? styles.partnerGrantBannerCell : "",
    ]
      .filter(Boolean)
      .join(" ");

    const logo = (
      <Image
        src={imageSrc}
        alt={partner.name}
        width={imageWidth}
        height={imageHeight}
        className={logoClassName}
      />
    );

    if (partner.website) {
      return (
        <a
          key={partner.id}
          href={partner.website}
          target="_blank"
          rel="noopener noreferrer"
          className={cellClassName}
          aria-label={partner.name}
        >
          {logo}
        </a>
      );
    }

    return (
      <div key={partner.id} className={cellClassName}>
        {logo}
      </div>
    );
  };

  const renderPartnersSection = (section: PageSection) => {
    if (section.hide_when_empty && partnersWithLogos.length === 0) return null;

    return (
      <section
        key={section.id}
        className={`sectionContainer ${styles.partnersSection}`}
      >
        <div className="resultsHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Partneri")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Podporujú náš klub")}
            </h2>
          </div>
        </div>

        {partnersWithLogos.length > 0 ? (
          <div className={styles.partnerGroups}>
            {partnerGroups.map((group) => {
              const displayTier = group.tier;

              const gridClassName = [
                styles.partnerGroupGrid,
                displayTier === "general" ? styles.partnerGridGeneral : "",
                displayTier === "main" ? styles.partnerGridMain : "",
                displayTier === "partner" ? styles.partnerGridStandard : "",
                displayTier === "media" ? styles.partnerGridMedia : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div
                  key={group.tier}
                  className={styles.partnerGroup}
                >
                  <h3 className={styles.partnerGroupTitle}>{group.label}</h3>

                  <div className={gridClassName}>
                    {group.items.map(({ partner, imageSrc }) =>
                      renderPartnerLogo(partner, imageSrc, displayTier)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.compactEmptyState}>
            Partneri budú doplnení čoskoro.
          </div>
        )}
      </section>
    );
  };

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "top_posts":
        return renderTopPostsSection(section);
      case "matches_overview":
        return renderMatchesOverviewSection(section);
      case "posts":
        return renderPostsSection(section);
      case "next_match":
        return renderNextMatchSection(section);
      case "poll":
        return renderPollSection(section);
      case "partners":
        return renderPartnersSection(section);
      default:
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
