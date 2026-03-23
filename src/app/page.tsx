import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { getHomepagePosts, type Post } from "./lib/posts";
import { getImageUrl } from "./lib/api";

export const metadata: Metadata = {
  title: "ATU Košice – Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy, hráč mesiaca a klubové články na jednom mieste.",
};

const standings = [
  { pos: 1, team: "ATU Košice", matches: 18, points: 42, score: "98:51" },
  { pos: 2, team: "FK Florko", matches: 18, points: 39, score: "93:57" },
  { pos: 3, team: "Grasshoppers Žilina", matches: 18, points: 34, score: "87:63" },
  { pos: 4, team: "Capitals Bratislava", matches: 18, points: 29, score: "75:68" },
  { pos: 5, team: "Tsunami Záhorská", matches: 18, points: 25, score: "69:72" },
  { pos: 6, team: "Lido Bratislava", matches: 18, points: 20, score: "61:80" },
];

const nextMatches = [
  {
    date: "24. 3. 2026",
    time: "18:30",
    opponent: "FK Florko",
    venue: "Mestská športová hala Košice",
    competition: "Extraliga mužov",
  },
  {
    date: "30. 3. 2026",
    time: "17:00",
    opponent: "Grasshoppers Žilina",
    venue: "Domáca hala ATU",
    competition: "Extraliga mužov",
  },
  {
    date: "5. 4. 2026",
    time: "14:00",
    opponent: "Capitals Bratislava",
    venue: "ŠH Bratislava",
    competition: "Extraliga mužov",
  },
];

const results = [
  {
    home: "ATU Košice",
    away: "Lido Bratislava",
    score: "7:4",
    date: "17. 3. 2026",
  },
  {
    home: "Tsunami Záhorská",
    away: "ATU Košice",
    score: "3:5",
    date: "9. 3. 2026",
  },
  {
    home: "ATU Košice",
    away: "Capitals Bratislava",
    score: "6:6",
    date: "1. 3. 2026",
  },
];

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

function formatDate(dateString?: string) {
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

export default async function HomePage() {
  const posts: Post[] = await getHomepagePosts("atu-kosice");

  const heroArticle: Post | undefined = posts[0];
  const sideArticles: Post[] = posts.slice(1, 3);
  const latestPosts: Post[] = posts.slice(3);

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
              <Link href={`/clanky/${heroArticle.slug}`} className={styles.topNewsMain}>
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
                <span className={styles.sectionEyebrow}>Liga</span>
                <h3>Aktuálna tabuľka</h3>
              </div>

              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tím</th>
                      <th>Z</th>
                      <th>Skóre</th>
                      <th>B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team) => (
                      <tr
                        key={team.pos}
                        className={team.team === "ATU Košice" ? styles.highlightRow : ""}
                      >
                        <td>{team.pos}</td>
                        <td>{team.team}</td>
                        <td>{team.matches}</td>
                        <td>{team.score}</td>
                        <td>{team.points}</td>
                      </tr>
                    ))}
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
                  {nextMatches.map((match, index) => (
                    <div key={index} className={styles.matchCard}>
                      <div className={styles.matchDate}>
                        <strong>{match.date}</strong>
                        <span>{match.time}</span>
                      </div>
                      <div className={styles.matchInfo}>
                        <h4>ATU Košice vs {match.opponent}</h4>
                        <p>{match.competition}</p>
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${styles.panel} ${styles.playerPanel}`}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Klubová anketa</span>
                  <h3>Hráč mesiaca</h3>
                </div>

                <div className={styles.playerOfMonth}>
                  <div className={styles.playerAvatar}>19</div>
                  <div>
                    <h4>Martin Novák</h4>
                    <p>Útočník • A-tím</p>
                    <span>6 gólov • 4 asistencie • líder tímu v marci</span>
                  </div>
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
                    <Link key={post.id} href={`/clanky/${post.slug}`} className={styles.postCard}>
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
                  {results.map((result, index) => (
                    <div key={index} className={styles.resultCard}>
                      <div>
                        <strong>{result.home}</strong>
                        <span>vs</span>
                        <strong>{result.away}</strong>
                      </div>
                      <div className={styles.resultScore}>{result.score}</div>
                      <small>{result.date}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <span className={styles.sectionEyebrow}>Kategórie</span>
                  <h3>Naše tímy</h3>
                </div>

                <div className={styles.categoryList}>
                  {categories.map((category) => (
                    <Link key={category} href="/timy" className={styles.categoryPill}>
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