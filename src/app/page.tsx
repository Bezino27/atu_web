import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { connection } from "next/server";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "./lib/posts";
import { getClubHomePage, getImageUrl, type PageSection } from "./lib/api";
import {
  getSzfbDashboard,
  getSzfbWatchIdForCategory,
  type SzfbMatch,
  type SzfbStandingRow,
} from "./lib/szfb";
import { getClubSeason } from "./lib/season";
import { getClubPartners, getPartnerImageUrl } from "./lib/partners";
import PollSection from "./components/poll/PollSection";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "./lib/seo";

const CLUB_SLUG = "atu-kosice";

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

function formatTime(timeString?: string | null) {
  if (!timeString) return "";
  return timeString.slice(0, 5);
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

function isOwnTeam(teamName: string, ownTeamName: string) {
  const normalizedTeamName = normalizeText(teamName);
  const normalizedOwnTeamName = normalizeText(ownTeamName);

  return (
    normalizedTeamName.includes(normalizedOwnTeamName) ||
    normalizedOwnTeamName.includes(normalizedTeamName) ||
    normalizedTeamName.includes("atu kosice")
  );
}

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

function getStandingsRowClass(
  position: number,
  teamName: string,
  ownTeamName: string
) {
  const classNames = [];

  if (position <= 8) classNames.push(styles.playoffRow);
  if (position === 10 || position === 11) classNames.push(styles.playoutRow);
  if (position === 12) classNames.push(styles.relegationRow);
  if (isOwnTeam(teamName, ownTeamName)) classNames.push(styles.highlightRow);

  return classNames.join(" ");
}

function getRecentResultMeta(match: SzfbMatch, ownTeamName: string) {
  if (!match.result || !match.result.includes(":")) {
    return {
      scoreClass: styles.lossScore,
    };
  }

  const [homeScore, awayScore] = match.result
    .replace(/\s+/g, "")
    .split(":")
    .map(Number);

  if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
    return {
      scoreClass: styles.lossScore,
    };
  }

  const { leftTeam } = getMatchTeams(match, ownTeamName);
  const ownTeamIsHome = isOwnTeam(leftTeam, ownTeamName);
  const ownTeamScore = ownTeamIsHome ? homeScore : awayScore;
  const opponentScore = ownTeamIsHome ? awayScore : homeScore;

  return {
    scoreClass: ownTeamScore >= opponentScore ? styles.winScore : styles.lossScore,
  };
}

function getMatchTeams(match: SzfbMatch, ownTeamName: string) {
  if (match.is_home === false) {
    return {
      leftTeam: match.opponent,
      rightTeam: ownTeamName,
    };
  }

  return {
    leftTeam: ownTeamName,
    rightTeam: match.opponent,
  };
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
    section_type: "posts",
    title: "Ďalšie novinky a články",
    pre_title: "Klubový obsah",
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
    section_type: "partners",
    title: "Podporujú náš klub",
    pre_title: "Partneri",
    order: 5,
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

  const [homePage, posts, clubSeason, partners, watchId] = await Promise.all([
    getClubHomePage(CLUB_SLUG),
    getHomepagePosts(CLUB_SLUG, 7),
    getClubSeason(CLUB_SLUG),
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

  const currentSeason = clubSeason?.season ?? "2025 / 2026";
  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName = szfbDashboard?.watch?.competition_name || "SZFB súťaž";

  const heroArticle: Post | undefined = posts[0];
  const sideArticles: Post[] = posts.slice(1, 3);
  const latestPosts: Post[] = posts.slice(3, 7);

  const standings: SzfbStandingRow[] = szfbDashboard?.standings ?? [];
  const results: SzfbMatch[] = szfbDashboard?.results ?? [];
  const featuredMatch: SzfbMatch | null = szfbDashboard?.upcoming?.[0] ?? null;

  const hasPostsSection = sections.some((section) => section.section_type === "posts");
  const nextMatchSection =
    sections.find((section) => section.section_type === "next_match") ??
    fallbackSections.find((section) => section.section_type === "next_match") ?? {
      id: -6,
      section_type: "next_match",
      title: "Najbližšie zápasy",
      pre_title: "Program",
      order: 6,
      is_active: true,
      hide_when_empty: false,
      config: {},
    };

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

  const featuredMatchTeams = featuredMatch
    ? getMatchTeams(featuredMatch, ownTeamName)
    : null;

  const renderUpcomingMatchesContent = () =>
    featuredMatch && featuredMatchTeams ? (
      <div className={styles.simpleMatchCard}>
        <div className={styles.simpleMatchHeaderRow}>
          <span className={styles.simpleLeagueBadge}>{competitionName}</span>

          <span className={styles.simpleMatchTimeTop}>
            {formatTime(featuredMatch.match_time)}
          </span>
        </div>

        <div className={styles.simpleMatchTeamsRow}>
          <span className={styles.simpleTeamName}>
            {featuredMatchTeams.leftTeam}
          </span>
          <span className={styles.simpleVs}>VS</span>
          <span className={styles.simpleTeamName}>
            {featuredMatchTeams.rightTeam}
          </span>
        </div>

        <div className={styles.simpleMatchMetaRow}>
          <div className={styles.simpleMatchMetaItem}>
            <span className={styles.simpleMatchMetaValue}>
              {formatDate(featuredMatch.match_date)}
            </span>
          </div>

          <div
            className={`${styles.simpleMatchMetaItem} ${styles.simpleMatchMetaItemRight}`}
          >
            <span className={styles.simpleMatchMetaValueRight}>
              {featuredMatch.venue || "Miesto zatiaľ nie je uvedené"}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.compactEmptyState}>
        Momentálne nie sú naplánované najbližšie zápasy.
      </div>
    );

  const renderTopPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && !heroArticle) return null;

    return (
      <section key={section.id} className="sectionContainer">
        <div className="resultsHeader hasAction">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Top obsah")}
            </span>
            <h1 className="sectionTitle">
              {getSectionTitle(section, "Najdôležitejšie novinky")}
            </h1>
          </div>

          <Link href="/clanky" className="sectionLink">
            Všetky články
          </Link>
        </div>

        {heroArticle ? (
          <div className={styles.topNewsGrid}>
            <Link
              href={`/clanky/${heroArticle.slug}`}
              className={styles.topNewsMain}
            >
              <div className={styles.topNewsMainImageWrap}>
                <Image
                  src={getImageUrl(heroArticle.featured_image)}
                  alt={heroArticle.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className={styles.cardImage}
                />
                <div className={styles.imageOverlay} />
              </div>

              <div className={styles.topNewsMainContent}>
                <div className={styles.metaRow}>
                  <span className={styles.badge}>
                    {heroArticle.category?.name || "Novinka"}
                  </span>
                </div>

                <h1>{heroArticle.title}</h1>
                {heroArticle.excerpt ? <p>{heroArticle.excerpt}</p> : null}
              </div>
            </Link>

            <div className={styles.topNewsSide}>
              {sideArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/clanky/${article.slug}`}
                  className={styles.topNewsSmall}
                >
                  <div className={styles.topNewsSmallImageWrap}>
                    <Image
                      src={getImageUrl(article.featured_image)}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={styles.cardImage}
                    />
                    <div className={styles.imageOverlay} />
                  </div>

                  <div className={styles.topNewsSmallContent}>
                    <div className={styles.metaRow}>
                      <span className={styles.badge}>
                        {article.category?.name || "Novinka"}
                      </span>
                    </div>

                    <h3>{article.title}</h3>
                  </div>
                </Link>
              ))}
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

        <div className={styles.overviewGrid}>
          <div className={styles.tableColumn}>
            <div className={styles.tablePanel}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>Tabuľka</span>
                  <h3 className={styles.panelTitle}>
                    Sezóna: {currentSeason}
                  </h3>
                </div>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tím</th>
                      <th>Z</th>
                      <th>B</th>
                    </tr>
                  </thead>

                  <tbody>
                    {standings.length > 0 ? (
                      standings.map((team) => (
                        <tr
                          key={team.position}
                          className={getStandingsRowClass(
                            team.position,
                            team.team_name,
                            ownTeamName
                          )}
                        >
                          <td>
                            <span className={styles.positionBadge}>
                              {team.position}
                            </span>
                          </td>
                          <td>
                            <div className={styles.teamCell}>
                              <span className={styles.tableTeamName}>
                                {team.team_name}
                              </span>
                            </div>
                          </td>
                          <td>{team.played}</td>
                          <td className={styles.pointsCell}>{team.points}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>Tabuľka zatiaľ nie je dostupná.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={styles.matchesColumn}>
            <div className={styles.recentMatchesCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>Zápasy</span>
                  <h3 className={styles.panelTitle}>Posledné zápasy</h3>
                </div>
              </div>

              <div className={styles.recentMatchesList}>
                {results.length > 0 ? (
                  results.slice(0, 4).map((result) => {
                    const resultTeams = getMatchTeams(result, ownTeamName);
                    const resultMeta = getRecentResultMeta(result, ownTeamName);

                    return (
                      <div key={result.id} className={styles.recentMatchCard}>
                        <div className={styles.recentMatchTop}>
                          <span className={styles.recentMatchDate}>
                            {formatDate(result.match_date)}
                          </span>
                        </div>

                        <div className={styles.recentTeams}>
                          <div className={styles.recentTeamRow}>
                            <span
                              className={`${styles.recentTeamName} ${
                                isOwnTeam(resultTeams.leftTeam, ownTeamName)
                                  ? styles.atuTeam
                                  : ""
                              }`}
                            >
                              {resultTeams.leftTeam}
                            </span>
                          </div>

                          <div className={styles.recentVsRow}>vs</div>

                          <div className={styles.recentTeamRow}>
                            <span
                              className={`${styles.recentTeamName} ${
                                isOwnTeam(resultTeams.rightTeam, ownTeamName)
                                  ? styles.atuTeam
                                  : ""
                              }`}
                            >
                              {resultTeams.rightTeam}
                            </span>
                          </div>
                        </div>

                        <div className={styles.recentScoreRow}>
                          <span
                            className={`${styles.recentScore} ${resultMeta.scoreClass}`}
                          >
                            {result.result || "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyPosts}>
                    Zatiaľ nie sú dostupné výsledky.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.mobileUpcomingMatches}>
              <div className={styles.upcomingMatchesCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>
                      {getSectionPreTitle(nextMatchSection, "Program")}
                    </span>
                    <h3 className={styles.panelTitle}>
                      {getSectionTitle(nextMatchSection, "Najbližšie zápasy")}
                    </h3>
                  </div>
                </div>

                {renderUpcomingMatchesContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderPostsSection = (section: PageSection) => {
    if (section.hide_when_empty && latestPosts.length === 0) return null;

    return (
      <section
        key={section.id}
        className={`sectionContainer ${styles.clubContentSection}`}
      >
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

        <div className={styles.clubContentGrid}>
          <div className={styles.clubPostsColumn}>
            {latestPosts.length > 0 ? (
              <div className={styles.clubPostsGrid}>
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/clanky/${post.slug}`}
                    className={styles.clubNewsCard}
                  >
                    <div className={styles.clubNewsImageWrap}>
                      <Image
                        src={getImageUrl(post.featured_image)}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.cardImage}
                      />
                      <div className={styles.imageOverlay} />
                    </div>

                    <div className={styles.clubNewsContent}>
                      <div className={styles.metaRow}>
                        <span className={styles.badge}>
                          {post.category?.name || "Novinka"}
                        </span>
                        <span className={styles.clubNewsDate}>
                          {formatDate(post.published_at)}
                        </span>
                      </div>

                      <h3>{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyPosts}>
                Zatiaľ nie sú k dispozícii ďalšie články.
              </div>
            )}
          </div>

          <aside className={styles.clubMatchesColumn}>
            <div className={styles.upcomingMatchesCard}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>
                    {getSectionPreTitle(nextMatchSection, "Program")}
                  </span>
                  <h3 className={styles.panelTitle}>
                    {getSectionTitle(nextMatchSection, "Najbližšie zápasy")}
                  </h3>
                </div>
              </div>

              {renderUpcomingMatchesContent()}
            </div>
          </aside>
        </div>
      </section>
    );
  };

  const renderNextMatchSection = (section: PageSection) => {
    if (hasPostsSection) return null;
    if (section.hide_when_empty && !featuredMatch) return null;

    return (
      <section key={section.id} className="sectionContainer">
        <div className="resultsHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Program")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Najbližšie zápasy")}
            </h2>
          </div>
        </div>

        <div className={styles.upcomingMatchesCard}>
          {renderUpcomingMatchesContent()}
        </div>
      </section>
    );
  };

  const renderPollSection = (section: PageSection) => {
    return (
      <PollSection
        key={section.id}
        preTitle={getSectionPreTitle(section, "Anketa")}
        title={getSectionTitle(section, "Hlasovanie fanúšikov")}
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
