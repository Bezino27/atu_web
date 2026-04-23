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

export const metadata: Metadata = {
  title: "ATU Košice – Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy, hráč mesiaca a klubové články na jednom mieste.",
};

const categories = [
  "A-tím",
  "Juniori",
  "Dorast",
  "Starší žiaci",
  "Mladší žiaci",
  "Prípravka",
];

const sponsors = [
  "General Partner",
  "Mesto Košice",
  "Technická univerzita",
  "Hlavný partner",
];

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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

function renderMatchTitle(match: SzfbMatch, ownTeamName: string) {
  if (match.is_home === false) {
    return `${match.opponent} vs ${ownTeamName}`;
  }

  return `${ownTeamName} vs ${match.opponent}`;
}

function getRecentResultMeta(result?: string | null) {
  if (!result || !result.includes(":")) {
    return {
      isWin: false,
      label: "Zápas",
      badgeClass: styles.lossBadge,
      scoreClass: styles.lossScore,
    };
  }

  const [leftScore, rightScore] = result.split(":").map(Number);

  if (Number.isNaN(leftScore) || Number.isNaN(rightScore)) {
    return {
      isWin: false,
      label: "Zápas",
      badgeClass: styles.lossBadge,
      scoreClass: styles.lossScore,
    };
  }

  const isWin = leftScore > rightScore;

  return {
    isWin,
    label: isWin ? "Výhra" : "Prehra",
    badgeClass: isWin ? styles.winBadge : styles.lossBadge,
    scoreClass: isWin ? styles.winScore : styles.lossScore,
  };
}

export default async function HomePage() {
  const posts: Post[] = await getHomepagePosts("atu-kosice");
  const szfbDashboard = await getSzfbDashboard(1);

  const heroArticle: Post | undefined = posts[0];
  const sideArticles: Post[] = posts.slice(1, 3);
  const latestPosts: Post[] = posts.slice(3);

  const standings: SzfbStandingRow[] = szfbDashboard?.standings ?? [];
  const nextMatches: SzfbMatch[] = szfbDashboard?.upcoming ?? [];
  const results: SzfbMatch[] = szfbDashboard?.results ?? [];

  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName =
    szfbDashboard?.watch?.competition_name || "SZFB súťaž";

  const nearestMatch = nextMatches[0];

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
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

          {heroArticle && (
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    className={styles.cardImage}
                    priority
                  />
                  <div className={styles.imageOverlay} />
                </div>

                <div className={styles.topNewsMainContent}>
                  <div className={styles.metaRow}>
                    <span className={styles.badge}>
                      {heroArticle.category?.name || "Novinka"}
                    </span>
                    <span>{formatDate(heroArticle.published_at)}</span>
                  </div>

                  <h2>{heroArticle.title}</h2>
                  <p>{heroArticle.excerpt || ""}</p>
                </div>
              </Link>

              {sideArticles.length > 0 && (
                <div className={styles.topNewsSide}>
                  {sideArticles.map((article: Post) => (
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
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={styles.cardImage}
                        />
                        <div className={styles.imageOverlay} />
                      </div>

                      <div className={styles.topNewsSmallContent}>
                        <div className={styles.metaRow}>
                          <span className={styles.badge}>
                            {article.category?.name || "Novinka"}
                          </span>
                          <span>{formatDate(article.published_at)}</span>
                        </div>

                        <h3>{article.title}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>Klub a liga</span>
              <h2 className={styles.sectionTitle}>Aktuálny prehľad</h2>
            </div>
          </div>

          <div className={styles.overviewGrid}>
            <div className={styles.tableColumn}>
              <div className={styles.tablePanel}>
                <div className={styles.panelHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Liga</span>
                    <h3 className={styles.panelTitle}>Aktuálna tabuľka</h3>
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

            <div className={styles.rightColumn}>
              <div className={`${styles.sharedBox} ${styles.infoCard}`}>
                <div className={styles.infoCardTop}>
                  <span className={styles.infoCardLabel}>Program</span>
                  <h3 className={styles.infoCardTitle}>Najbližší zápas</h3>
                </div>

                <div className={styles.infoCardBody}>
                  {nearestMatch ? (
                    <div className={styles.infoCardInnerBox}>
                      <div className={styles.matchLayout}>
                        <div className={styles.matchDateBlock}>
                          <span className={styles.matchDatePrimary}>
                            {formatDate(nearestMatch.match_date)}
                          </span>
                          <span className={styles.matchTimePrimary}>
                            {formatTime(nearestMatch.match_time)}
                          </span>
                        </div>

                        <div className={styles.matchInfoBlock}>
                          <div className={styles.matchMainText}>
                            {renderMatchTitle(nearestMatch, ownTeamName)}
                          </div>
                          <div className={styles.matchSecondaryText}>
                            {competitionName}
                          </div>
                          <div className={styles.matchMutedText}>
                            {nearestMatch.venue ||
                              "Miesto zatiaľ nie je uvedené"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.compactEmptyState}>
                      Momentálne nie je naplánovaný ďalší zápas.
                    </div>
                  )}
                </div>
              </div>

              <div className={`${styles.sharedBox} ${styles.infoCard}`}>
                <div className={styles.infoCardTop}>
                  <span className={styles.infoCardLabel}>Anketa</span>
                  <h3 className={styles.infoCardTitle}>Hráč mesiaca</h3>
                </div>

                <div className={styles.infoCardBody}>
                  <div className={styles.infoCardInnerBox}>
                    <div className={styles.pollLayout}>
                      <div className={styles.pollTop}>
                        <div className={styles.pollNumber}>19</div>

                        <div className={styles.pollInfo}>
                          <div className={styles.pollName}>Martin Novák</div>
                          <div className={styles.pollMeta}>
                            10 bodov • 6 gólov • 4 asistencie
                          </div>
                        </div>
                      </div>

                      <div className={styles.pollBar}>
                        <div
                          className={styles.pollBarFill}
                          style={{ width: "74%" }}
                        />
                      </div>

                      <div className={styles.pollFooter}>
                        <span>Výsledok ankety</span>
                        <strong>438 hlasov</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.preTitle}>Klubový obsah</span>
              <h2 className={styles.sectionTitle}>Ďalšie novinky a články</h2>
            </div>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              {latestPosts.length > 0 ? (
                <div className={styles.postsGrid}>
                  {latestPosts.map((post: Post) => (
                    <Link
                      key={post.id}
                      href={`/clanky/${post.slug}`}
                      className={styles.postCard}
                    >
                      <div className={styles.postImageWrap}>
                        <Image
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={styles.cardImage}
                        />
                      </div>

                      <div className={styles.postContent}>
                        <div className={styles.metaRow}>
                          <span className={styles.smallBadge}>
                            {post.category?.name || "Novinka"}
                          </span>
                          <span>{formatDate(post.published_at)}</span>
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

            <aside className={styles.rightColumn}>
              <div className={styles.recentMatchesCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Výsledky</span>
                    <h3 className={styles.panelTitle}>Posledné zápasy</h3>
                  </div>
                </div>

                <div className={styles.recentMatchesList}>
                  {results.length > 0 ? (
                    results.slice(0, 4).map((result) => {
                      const resultMeta = getRecentResultMeta(result.result);

                      return (
                        <div key={result.id} className={styles.recentMatchCard}>
                          <div className={styles.recentMatchTop}>
                            <span
                              className={`${styles.recentResultBadge} ${resultMeta.badgeClass}`}
                            >
                              {resultMeta.label}
                            </span>

                            <span className={styles.recentMatchDate}>
                              {formatDate(result.match_date)}
                            </span>
                          </div>

                          <div className={styles.recentTeams}>
                            <div className={styles.recentTeamRow}>
                              <span
                                className={`${styles.recentTeamName} ${
                                  result.is_home !== false ? styles.atuTeam : ""
                                }`}
                              >
                                {result.is_home === false
                                  ? result.opponent
                                  : ownTeamName}
                              </span>
                            </div>

                            <div className={styles.recentVsRow}>vs</div>

                            <div className={styles.recentTeamRow}>
                              <span
                                className={`${styles.recentTeamName} ${
                                  result.is_home === false ? styles.atuTeam : ""
                                }`}
                              >
                                {result.is_home === false
                                  ? ownTeamName
                                  : result.opponent}
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

              <div className={styles.sidePanel}>
                <div className={styles.panelHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Kategórie</span>
                    <h3 className={styles.panelTitle}>Naše tímy</h3>
                  </div>
                </div>

                <div className={styles.categoryList}>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href="/timy"
                      className={styles.categoryPill}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              <div className={styles.sidePanel}>
                <div className={styles.panelHeader}>
                  <div>
                    <span className={styles.panelEyebrow}>Partneri</span>
                    <h3 className={styles.panelTitle}>Podporujú nás</h3>
                  </div>
                </div>

                <div className={styles.partnerBoxes}>
                  <div className={styles.partnerBox} />
                  <div className={styles.partnerBox} />
                  <div className={styles.partnerBox} />
                  <div className={styles.partnerBox} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.bottomSection}>
          <div className={styles.sponsorsSection}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.preTitle}>Sponzori</span>
                <h2 className={styles.sectionTitle}>Podporujú náš klub</h2>
              </div>
            </div>

            <p className={styles.sponsorsIntro}>
              Ďakujeme partnerom a sponzorom, ktorí pomáhajú rozvíjať klub,
              mládež a naše športové aktivity.
            </p>

            <div className={styles.sponsorsLogoGrid}>
              {sponsors.map((sponsor) => (
                <div key={sponsor} className={styles.sponsorLogoCard}>
                  <div className={styles.sponsorLogoInner}>{sponsor}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}