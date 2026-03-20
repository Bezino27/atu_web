import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ATU Košice – Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Novinky, výsledky, tabuľky, najbližšie zápasy, hráč mesiaca a klubové články na jednom mieste.",
};

const topArticles = [
  {
    id: 1,
    title: "ATU Košice mieri do play-off. Klub žije florbalom a čaká nás veľký záver sezóny",
    excerpt:
      "A-tím zvládol dôležitú časť sezóny, mládež pokračuje vo výborných výkonoch a fanúšikov čakajú rozhodujúce zápasy. Pozri si, čo všetko sa aktuálne deje v klube a čo nás čaká v najbližších týždňoch.",
    image: "/images/news1.jpg",
    category: "Hlavná udalosť",
    date: "20. marec 2026",
    slug: "/clanky/atu-kosice-mieri-do-playoff",
  },
  {
    id: 2,
    title: "Pozvánka na najbližší domáci zápas proti FK Florko",
    excerpt:
      "Dôležitý duel pred domácimi fanúšikmi sa blíži. Príď podporiť ATU Košice v ďalšom ligovom stretnutí.",
    image: "/images/news1.jpg",
    category: "Pozvánka",
    date: "19. marec 2026",
    slug: "/clanky/pozvanka-na-domaci-zapas-florko",
  },
  {
    id: 3,
    title: "Mládežnícke tímy zbierajú cenné výhry a skúsenosti",
    excerpt:
      "Počas víkendu sa darilo aj našim mládežníckym kategóriám, ktoré pokračujú v kvalitných výkonoch.",
    image: "/images/news1.jpg",
    category: "Mládež",
    date: "18. marec 2026",
    slug: "/clanky/mladeznicke-timy-zbieraju-vyhry",
  },
  {
    id: 4,
    title: "ATU Košice zvládlo derby a berie dôležité 3 body",
    excerpt:
      "Napínavý zápas rozhodol tretí útok v závere tretej tretiny. Pozri si priebeh stretnutia, góly a reakcie hráčov.",
    image: "/images/news1.jpg",
    category: "A-tím",
    date: "18. marec 2026",
    slug: "/clanky/atu-kosice-zvladlo-derby",
  },
  {
    id: 5,
    title: "Rozhovor s trénerom: Čo chceme zlepšiť pred play-off",
    excerpt:
      "Tréner otvorene o aktuálnej forme tímu, disciplíne, nomináciách a cieľoch do ďalších týždňov.",
    image: "/images/news1.jpg",
    category: "Rozhovor",
    date: "14. marec 2026",
    slug: "/clanky/rozhovor-s-trenerom-playoff",
  },
];
const latestPosts = [
  {
    id: 4,
    title: "Fotogaléria z posledného domáceho zápasu",
    image: "/images/news1.jpg",
    date: "12. marec 2026",
    category: "Galéria",
    slug: "/clanky/fotogaleria-domaci-zapas",
  },
  {
    id: 5,
    title: "Juniori získali cenné body na palubovke súpera",
    image: "/images/news1.jpg",
    date: "10. marec 2026",
    category: "Juniori",
    slug: "/clanky/juniori-ziskali-cenne-body",
  },
  {
    id: 6,
    title: "Prípravka má za sebou ďalší úspešný turnaj",
    image: "/images/news1.jpg",
    date: "8. marec 2026",
    category: "Prípravka",
    slug: "/clanky/pripravka-uspesny-turnaj",
  },
  {
    id: 7,
    title: "Klub spúšťa nábor nových hráčov do mládeže",
    image: "/images/news1.jpg",
    date: "6. marec 2026",
    category: "Klub",
    slug: "/clanky/nabor-novych-hracov",
  },
  {
    id: 8,
    title: "Ako prebiehala zimná príprava nášho A-tímu",
    image: "/images/news1.jpg",
    date: "4. marec 2026",
    category: "A-tím",
    slug: "/clanky/zimna-priprava-a-timu",
  },
  {
    id: 9,
    title: "Pozvánka na víkendové domáce zápasy",
    image: "/images/news1.jpg",
    date: "2. marec 2026",
    category: "Pozvánka",
    slug: "/clanky/pozvanka-na-vikend",
  },
];

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

export default function HomePage() {
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

  <div className={styles.topNewsGrid}>
    <Link href={topArticles[0].slug} className={styles.topNewsMain}>
      <div className={styles.topNewsMainImageWrap}>
        <Image
          src={topArticles[0].image}
          alt={topArticles[0].title}
          fill
          className={styles.cardImage}
          priority
        />
        <div className={styles.imageOverlay} />
      </div>

      <div className={styles.topNewsMainContent}>
        <div className={styles.metaRow}>
          <span className={styles.badge}>{topArticles[0].category}</span>
          <span>{topArticles[0].date}</span>
        </div>
        <h1>{topArticles[0].title}</h1>
        <p>{topArticles[0].excerpt}</p>
      </div>
    </Link>

    <div className={styles.topNewsSide}>
      {topArticles.slice(1, 3).map((article) => (
        <Link key={article.id} href={article.slug} className={styles.topNewsSmall}>
          <div className={styles.topNewsSmallImageWrap}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              className={styles.cardImage}
            />
            <div className={styles.imageOverlay} />
          </div>

          <div className={styles.topNewsSmallContent}>
            <div className={styles.metaRow}>
              <span className={styles.badge}>{article.category}</span>
              <span>{article.date}</span>
            </div>
            <h3>{article.title}</h3>
          </div>
        </Link>
      ))}
    </div>

    <div className={styles.topNewsBottom}>
      {topArticles.slice(3, 5).map((article) => (
        <Link key={article.id} href={article.slug} className={styles.topNewsBottomCard}>
          <div className={styles.topNewsBottomImageWrap}>
            <Image
              src={article.image}
              alt={article.title}
              fill
              className={styles.cardImage}
            />
          </div>

          <div className={styles.topNewsBottomContent}>
            <div className={styles.metaRow}>
              <span className={styles.smallBadge}>{article.category}</span>
              <span>{article.date}</span>
            </div>
            <h3>{article.title}</h3>
            <p>{article.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
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

              <div className={styles.postsGrid}>
                {latestPosts.map((post) => (
                  <Link key={post.id} href={post.slug} className={styles.postCard}>
                    <div className={styles.postImageWrap}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className={styles.cardImage}
                      />
                    </div>
                    <div className={styles.postContent}>
                      <div className={styles.metaRow}>
                        <span className={styles.smallBadge}>{post.category}</span>
                        <span>{post.date}</span>
                      </div>
                      <h3>{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
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