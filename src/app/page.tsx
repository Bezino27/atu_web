import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ATU Košice | Florbalový klub",
  description:
    "Oficiálna stránka florbalového klubu ATU Košice. Výsledky, zápasy, tabuľka, novinky, galéria a partneri klubu.",
};

const standings = [
  { pos: 1, team: "ATU Košice", played: 18, wins: 14, losses: 4, goals: "109:61", points: 42 },
  { pos: 2, team: "Florko Košice", played: 18, wins: 13, losses: 5, goals: "101:67", points: 39 },
  { pos: 3, team: "Tsunami ZB", played: 18, wins: 11, losses: 7, goals: "94:70", points: 35 },
  { pos: 4, team: "Grasshoppers", played: 18, wins: 10, losses: 8, goals: "86:79", points: 31 },
  { pos: 5, team: "ŠK Lido", played: 18, wins: 8, losses: 10, goals: "80:83", points: 27 },
  { pos: 6, team: "Capitals", played: 18, wins: 6, losses: 12, goals: "74:90", points: 21 },
];

const matches = [
  {
    date: "23. 3. 2026",
    time: "18:30",
    competition: "Extraliga mužov",
    home: "ATU Košice",
    away: "Tsunami Záhorská Bystrica",
    venue: "Mestská športová hala, Košice",
  },
  {
    date: "30. 3. 2026",
    time: "17:00",
    competition: "Extraliga mužov",
    home: "ATU Košice",
    away: "Grasshoppers AC UNIZA",
    venue: "Mestská športová hala, Košice",
  },
  {
    date: "6. 4. 2026",
    time: "11:00",
    competition: "Juniori U19",
    home: "ATU Košice U19",
    away: "Florko Košice U19",
    venue: "Športová hala, Košice",
  },
];

const articles = [
  {
    title: "ATU Košice víťazí v derby a upevňuje si prvé miesto",
    excerpt:
      "Domáci tím predviedol výborný výkon, oprel sa o kvalitnú defenzívu a efektivitu v zakončení.",
    date: "19. 3. 2026",
    category: "Zápas",
    image: "/images/news/news1.jpg",
    href: "/novinky/atu-vitazi-v-derby",
  },
  {
    title: "Mládežnícke tímy pokračujú v príprave na záver sezóny",
    excerpt:
      "Tréningový proces napreduje a hráči zbierajú cenné skúsenosti v zápasoch aj na turnajoch.",
    date: "17. 3. 2026",
    category: "Mládež",
    image: "/images/news/news2.jpg",
    href: "/novinky/mladez-priprava",
  },
  {
    title: "Pozvánka na víkendový domáci zápas v Košiciach",
    excerpt:
      "Príďte podporiť ATU Košice priamo do haly a vytvoriť skvelú atmosféru pre celý tím.",
    date: "15. 3. 2026",
    category: "Klub",
    image: "/images/news/news3.jpg",
    href: "/novinky/pozvanka-na-zapas",
  },
  {
    title: "Rozhovor s trénerom po dôležitom víťazstve",
    excerpt:
      "Po zápase sme sa rozprávali o výkone mužstva, energii v tíme a cieľoch do ďalších týždňov.",
    date: "12. 3. 2026",
    category: "Rozhovor",
    image: "/images/news/news4.jpg",
    href: "/novinky/rozhovor-s-trenerom",
  },
];

const gallery = [
  "/images/gallery/gallery1.jpg",
  "/images/gallery/gallery2.jpg",
  "/images/gallery/gallery3.jpg",
  "/images/gallery/gallery4.jpg",
];

const partners = [
  "/images/partners/partner1.png",
  "/images/partners/partner2.png",
  "/images/partners/partner3.png",
  "/images/partners/partner4.png",
  "/images/partners/partner5.png",
  "/images/partners/partner6.png",
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <span className={styles.eyebrow}>Florbalový klub ATU Košice</span>
              <h1>Výsledky, zápasy, novinky a život klubu na jednom mieste</h1>
              <p>
                Sleduj aktuálne dianie v klube, najbližšie zápasy, postavenie v tabuľke,
                články, fotografie a partnerov ATU Košice.
              </p>

              <div className={styles.heroButtons}>
                <Link href="/novinky" className={styles.primaryButton}>
                  Novinky
                </Link>
                <Link href="/zapas" className={styles.secondaryButton}>
                  Program zápasov
                </Link>
              </div>
            </div>

            <div className={styles.heroScoreCard}>
              <div className={styles.heroScoreTop}>
                <span className={styles.liveBadge}>Posledný zápas</span>
                <span className={styles.heroCompetition}>Extraliga mužov</span>
              </div>

              <div className={styles.heroScoreMiddle}>
                <div className={styles.heroTeam}>ATU Košice</div>
                <div className={styles.heroScore}>7 : 4</div>
                <div className={styles.heroTeam}>Florko Košice</div>
              </div>

              <div className={styles.heroScoreBottom}>
                <span>Košice • Mestská športová hala</span>
                <Link href="/zapas/posledny" className={styles.heroScoreLink}>
                  Detail zápasu
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.quickStats}>
          <div className={styles.container}>
            <div className={styles.statCard}>
              <strong>1. miesto</strong>
              <span>aktuálne v tabuľke</span>
            </div>
            <div className={styles.statCard}>
              <strong>18</strong>
              <span>odohraných zápasov</span>
            </div>
            <div className={styles.statCard}>
              <strong>109</strong>
              <span>strelených gólov</span>
            </div>
            <div className={styles.statCard}>
              <strong>42</strong>
              <span>získaných bodov</span>
            </div>
          </div>
        </section>

        <section className={styles.mainSection}>
          <div className={styles.container}>
            <div className={styles.contentGrid}>
              <div className={styles.leftColumn}>
                <div className={styles.block}>
                  <div className={styles.blockHeader}>
                    <div>
                      <span className={styles.sectionEyebrow}>Tabuľka</span>
                      <h2>Aktuálne poradie ligy</h2>
                    </div>
                    <Link href="/tabulka" className={styles.linkButton}>
                      Celá tabuľka
                    </Link>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Tím</th>
                          <th>Z</th>
                          <th>V</th>
                          <th>P</th>
                          <th>Skóre</th>
                          <th>Body</th>
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
                            <td>{team.played}</td>
                            <td>{team.wins}</td>
                            <td>{team.losses}</td>
                            <td>{team.goals}</td>
                            <td>{team.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={styles.block}>
                  <div className={styles.blockHeader}>
                    <div>
                      <span className={styles.sectionEyebrow}>Zápasy</span>
                      <h2>Najbližší program</h2>
                    </div>
                    <Link href="/zapas" className={styles.linkButton}>
                      Všetky zápasy
                    </Link>
                  </div>

                  <div className={styles.matchList}>
                    {matches.map((match) => (
                      <article key={`${match.date}-${match.home}-${match.away}`} className={styles.matchRow}>
                        <div className={styles.matchDate}>
                          <strong>{match.date}</strong>
                          <span>{match.time}</span>
                        </div>

                        <div className={styles.matchInfo}>
                          <span className={styles.matchCompetition}>{match.competition}</span>
                          <h3>
                            {match.home} <span className={styles.vs}>vs</span> {match.away}
                          </h3>
                          <p>{match.venue}</p>
                        </div>

                        <div className={styles.matchAction}>
                          <Link href="/zapas" className={styles.smallButton}>
                            Detail
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <aside className={styles.rightColumn}>
                <div className={styles.sidebarBlock}>
                  <div className={styles.blockHeaderSmall}>
                    <div>
                      <span className={styles.sectionEyebrow}>Novinky</span>
                      <h2>Najnovšie články</h2>
                    </div>
                  </div>

                  <div className={styles.articleList}>
                    {articles.map((article) => (
                      <article key={article.title} className={styles.articleItem}>
                        <Link href={article.href} className={styles.articleImageWrap}>
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={140}
                            height={100}
                            className={styles.articleImage}
                          />
                        </Link>

                        <div className={styles.articleContent}>
                          <div className={styles.articleMeta}>
                            <span>{article.category}</span>
                            <span>{article.date}</span>
                          </div>
                          <h3>
                            <Link href={article.href}>{article.title}</Link>
                          </h3>
                          <p>{article.excerpt}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className={styles.gallerySection}>
          <div className={styles.container}>
            <div className={styles.blockHeader}>
              <div>
                <span className={styles.sectionEyebrow}>Galéria</span>
                <h2>Fotografie z klubu</h2>
              </div>
              <Link href="/galeria" className={styles.linkButton}>
                Otvoriť galériu
              </Link>
            </div>

            <div className={styles.galleryGrid}>
              {gallery.map((image) => (
                <div key={image} className={styles.galleryCard}>
                  <Image
                    src={image}
                    alt="Fotografia ATU Košice"
                    width={500}
                    height={350}
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.partnersSection}>
          <div className={styles.container}>
            <div className={styles.partnersHeader}>
              <span className={styles.sectionEyebrow}>Partneri a sponzori</span>
              <h2>Ďakujeme partnerom za podporu</h2>
            </div>

            <div className={styles.partnersGrid}>
              {partners.map((partner, index) => (
                <div key={index} className={styles.partnerCard}>
                  <Image
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    width={180}
                    height={90}
                    className={styles.partnerLogo}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}