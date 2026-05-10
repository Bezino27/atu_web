import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "./lib/posts";
import { getImageUrl } from "./lib/api";
import {
  getSzfbDashboard,
  type SzfbMatch,
  type SzfbStandingRow,
} from "./lib/szfb";
import { getClubSeason } from "./lib/season";
import { getClubPartners, getPartnerImageUrl } from "./lib/partners";
import PollSection from "./components/poll/PollSection";

export const metadata: Metadata = {
  title: "ATU Košice – Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy, hráč mesiaca a klubové články na jednom mieste.",
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

function getStandingsRowClass(
  position: number,
  teamName: string,
  ownTeamName: string
) {
  const classNames = [];

  if (position <= 8) classNames.push(styles.playoffRow);
  if (position === 10 || position === 11) classNames.push(styles.playoutRow);
  if (position === 12) classNames.push(styles.relegationRow);
  if (teamName === ownTeamName) classNames.push(styles.highlightRow);

  return classNames.join(" ");
}

function getRecentResultMeta(result?: string | null) {
  if (!result || !result.includes(":")) {
    return {
      scoreClass: styles.lossScore,
    };
  }

  const [leftScore, rightScore] = result.split(":").map(Number);

  if (Number.isNaN(leftScore) || Number.isNaN(rightScore)) {
    return {
      scoreClass: styles.lossScore,
    };
  }

  const isWin = leftScore > rightScore;

  return {
    scoreClass: isWin ? styles.winScore : styles.lossScore,
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

export default async function HomePage() {
  const [posts, szfbDashboard, clubSeason, partners] = await Promise.all([
    getHomepagePosts("atu-kosice"),
    getSzfbDashboard(1),
    getClubSeason("atu-kosice"),
    getClubPartners("atu-kosice"),
  ]);

  const currentSeason = clubSeason?.season ?? "2025 / 2026";
  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName = szfbDashboard?.watch?.competition_name || "SZFB súťaž";

  const heroArticle: Post | undefined = posts[0];
  const sideArticles: Post[] = posts.slice(1, 3);
  const latestPosts: Post[] = posts.slice(3, 7);

  const standings: SzfbStandingRow[] = szfbDashboard?.standings ?? [];
  const results: SzfbMatch[] = szfbDashboard?.results ?? [];
  const featuredMatch: SzfbMatch | null = szfbDashboard?.upcoming?.[0] ?? null;
  const partnersWithLogos = partners
    .map((partner) => ({
      partner,
      imageSrc: getPartnerImageUrl(partner),
    }))
    .filter(({ imageSrc }) => Boolean(imageSrc));

  const featuredMatchTeams = featuredMatch
    ? getMatchTeams(featuredMatch, ownTeamName)
    : null;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        {/* # TOP NEWS */}
        <section className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>Top obsah</span>
              <h1 className={styles.sectionTitle}>
                Najnovšie a najdôležitejšie články
              </h1>
            </div>

            <Link href="/clanky" className={styles.sectionLink}>
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

        {/* # OVERVIEW */}
        <section className={styles.overviewSection}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>Liga</span>
              <h2 className={styles.sectionTitle}>Výsledky</h2>
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
                      const resultMeta = getRecentResultMeta(result.result);
                      const resultTeams = getMatchTeams(result, ownTeamName);

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
                                  resultTeams.leftTeam === ownTeamName
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
                                  resultTeams.rightTeam === ownTeamName
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
            </div>
          </div>
        </section>

        {/* # CLUB CONTENT */}
        <section className={styles.sectionContainer}>
          <div className={`${styles.resultsHeader} ${styles.clubContentHeader}`}>
            <div>
              <span className={styles.preTitle}>Klubový obsah</span>
              <h2 className={styles.sectionTitle}>Ďalšie novinky a články</h2>
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
                    <span className={styles.panelEyebrow}>Program</span>
                    <h3 className={styles.panelTitle}>Najbližšie zápasy</h3>
                  </div>
                </div>

                {featuredMatch && featuredMatchTeams ? (
                  <div className={styles.simpleMatchCard}>
                    <div className={styles.simpleMatchHeaderRow}>
                      <span className={styles.simpleLeagueBadge}>
                        {competitionName}
                      </span>

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
                )}
              </div>
            </aside>
          </div>
        </section>

        <PollSection />

        {/* # PARTNERS */}
        <section className={`${styles.sectionContainer} ${styles.partnersSection}`}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>Partneri</span>
              <h2 className={styles.sectionTitle}>Podporujú náš klub</h2>
            </div>
          </div>

          <div className={styles.partnersCard}>
            {partnersWithLogos.length > 0 ? (
              <div className={styles.partnersGrid}>
                {partnersWithLogos.map(({ partner, imageSrc }) => {
                  const logo = (
                    <Image
                      src={imageSrc}
                      alt={partner.name}
                      width={260}
                      height={110}
                      className={styles.partnerLogo}
                      unoptimized
                    />
                  );

                  if (partner.website) {
                    return (
                      <a
                        key={partner.id}
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.partnerLogoCell}
                        aria-label={partner.name}
                      >
                        {logo}
                      </a>
                    );
                  }

                  return (
                    <div key={partner.id} className={styles.partnerLogoCell}>
                      {logo}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.compactEmptyState}>
                Partneri budú doplnení čoskoro.
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
