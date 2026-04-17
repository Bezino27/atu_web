import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "./lib/posts";
import { getImageUrl } from "./lib/api";
import { getSzfbDashboard, type SzfbMatch, type SzfbStandingRow } from "./lib/szfb";


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

function getPlacementLabel(position: number) {
  if (position <= 8) return "Playoff";
  if (position === 10 || position === 11) return "Baráž";
  if (position === 12) return "Zostup";
  return null;
}

function renderMatchTitle(match: SzfbMatch, ownTeamName: string) {
  if (match.is_home === false) {
    return `${match.opponent} vs ${ownTeamName}`;
  }

  return `${ownTeamName} vs ${match.opponent}`;
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
  const competitionName = szfbDashboard?.watch?.competition_name || "SZFB súťaž";

  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.topNewsSection}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Top obsah</span>
              <h2>Najnovšie a najdôležitejšie články</h2>
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
                  <h1>{heroArticle.title}</h1>
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

        <section className={styles.dashboardSection}>
          <div className={styles.dashboardGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Liga</span>
                  <h3>Aktuálna tabuľka</h3>
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
                      standings.map((team) => {
                        const label = getPlacementLabel(team.position);

                        return (
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
                                <span className={styles.teamName}>
                                  {team.team_name}
                                </span>
                              </div>
                            </td>
                            <td>{team.played}</td>
                            <td className={styles.pointsCell}>{team.points}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4}>Tabuľka zatiaľ nie je dostupná.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.sideStack}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Program</span>
                  <h3>Najbližšie zápasy</h3>
                </div>

                <div className={styles.matchList}>
                  {nextMatches.length > 0 ? (
                    nextMatches.slice(0, 3).map((match) => (
                      <div key={match.id} className={styles.matchCard}>
                        <div className={styles.matchDate}>
                          <strong>{formatDate(match.match_date)}</strong>
                          <span>{formatTime(match.match_time)}</span>
                        </div>

                        <div className={styles.matchInfo}>
                          <h4>{renderMatchTitle(match, ownTeamName)}</h4>
                          <p>{competitionName}</p>
                          <span>
                            {match.venue || "Miesto zatiaľ nie je uvedené"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noUpcomingCard}>
                      <div className={styles.noUpcomingIcon}>🏑</div>
                      <h4>Momentálne nie sú naplánované ďalšie zápasy</h4>
                      <p>
                        Sleduj klubové novinky a výsledky. Ďalší program
                        doplníme hneď, ako bude oficiálne zverejnený.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            <div className={`${styles.panel} ${styles.playerPanel}`}>
              <div className={styles.playerPanelTop}>
                <div className={styles.playerNumberBadge}>
                  <span className={styles.playerNumberValue}>19</span>
                </div>

                <div className={styles.playerMainInfo}>
                  <span className={styles.playerPanelLabel}>Klubová anketa</span>
                  <h3 className={styles.playerMainName}>Martin Novák</h3>
                </div>
              </div>

              <div className={styles.playerStatsGrid}>
                <div className={styles.playerStatCard}>
                  <strong>10</strong>
                  <span>Body</span>
                </div>

                <div className={styles.playerStatCard}>
                  <strong>6</strong>
                  <span>Góly</span>
                </div>

                <div className={styles.playerStatCard}>
                  <strong>4</strong>
                  <span>Asistencie</span>
                </div>
              </div>

              <div className={styles.playerVoteBar}>
                <span className={styles.playerVoteLabel}>Výsledok ankety</span>
                <div className={styles.playerVoteTrack}>
                  <div className={styles.playerVoteFill} style={{ width: "74%" }} />
                </div>
                <span className={styles.playerVoteValue}>438 hlasov</span>
              </div>
            </div>
           </div>
          </div>
        </section>

        <section className={styles.contentSection}>
          <div className={styles.contentGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.sectionHeader}>
                <div>
                  <span className={styles.sectionEyebrow}>Klubový blog</span>
                  <h2>Ďalšie novinky a články</h2>
                </div>
              </div>

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
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Výsledky</span>
                  <h3>Posledné zápasy</h3>
                </div>

                <div className={styles.resultsList}>
                  {results.length > 0 ? (
                    results.slice(0, 5).map((result) => (
                      <div key={result.id} className={styles.resultCard}>
                        <div className={styles.resultTeams}>
                          <strong>
                            {result.is_home === false
                              ? result.opponent
                              : ownTeamName}
                          </strong>
                          <span>vs</span>
                          <strong>
                            {result.is_home === false
                              ? ownTeamName
                              : result.opponent}
                          </strong>
                        </div>
                        <div className={styles.resultScore}>
                          {result.result}
                        </div>
                        <small>{formatDate(result.match_date)}</small>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyPosts}>
                      Zatiaľ nie sú dostupné výsledky.
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Kategórie</span>
                  <h3>Naše tímy</h3>
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

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Partneri</span>
                  <h3>Podporujú nás</h3>
                </div>

                <div className={styles.sponsorsGrid}>
                  {sponsors.map((sponsor) => (
                    <div key={sponsor} className={styles.sponsorCard}>
                      {sponsor}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}