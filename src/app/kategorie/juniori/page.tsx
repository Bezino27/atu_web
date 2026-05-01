import React from "react";
import styles from "../styles/unified.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from "./components/najlepsi_hrac";
import RecentMatches from "./components/posledne_zapasy";
import Tabulka from "./components/tabulka";
import NextMatchCountdown from "./components/NextMatchCountdown";
import { getSzfbDashboard, getSzfbNextMatch } from "@/app/lib/szfb";
import { getHomepagePosts } from "@/app/lib/posts";
import { getClubSeason } from "../../lib/season";

export default async function JunioriPage() {
  const [szfbDashboard, nextMatchResponse, posts, clubSeason] =
    await Promise.all([
      getSzfbDashboard(1),
      getSzfbNextMatch(1),
      getHomepagePosts("atu-kosice"),
      getClubSeason("atu-kosice"),
    ]);

  const junioriPosts = posts.filter((post) => {
    const categoryName = post.category?.name?.toLowerCase().trim();
    return ["juniori", "mládež", "mladez"].includes(categoryName || "");
  });

  const standings = szfbDashboard?.standings ?? [];
  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const nextMatch = nextMatchResponse?.next_match ?? null;
  const currentSeason = clubSeason?.season ?? "2025 / 2026";

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src="/images/kategorie/juniori_kader.jpg"
              alt="ATU Košice Juniori"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImg}
            />

            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <span className={styles.heroSubtitle}>
                  Slovenská Florbalová Juniorská Extraliga
                </span>
                <h1 className={styles.bannerTitle}>Juniori</h1>

                <div className={styles.heroQuickNav}>
                  <a href="#zapasy" className={styles.heroQuickLink}>
                    Zápasy
                  </a>
                  <a href="#tabulka" className={styles.heroQuickLink}>
                    Tabuľka
                  </a>
                  <a href="#hraci" className={styles.heroQuickLink}>
                    Hráči
                  </a>
                </div>
              </div>

              <div className={styles.heroMiniInfo}>
                <span className={styles.heroMiniLabel}>Sezóna</span>
                <span className={styles.heroMiniValue}>{currentSeason}</span>
              </div>
            </div>
          </div>

          <NextMatchCountdown
            matchDate={nextMatch?.match_date ?? null}
            matchTime={nextMatch?.match_time ?? null}
            opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
            ownTeamName={ownTeamName}
            isHome={nextMatch?.is_home ?? null}
          />
        </section>

        <section id="zapasy" className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <span className={styles.preTitle}>Zápasy</span>
            <h2 className={styles.sectionTitle}>Featured zápasy</h2>
          </div>

          <NasledujuceZapasy />
        </section>

        <section id="novinky" className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <span className={styles.preTitle}>AKTUÁLNE DIANIE</span>
            <h2 className={styles.sectionTitle}>
              Najnovšie a najdôležitejšie články
            </h2>
          </div>

          <Novinky posts={junioriPosts} />
        </section>

        <section id="tabulka" className={styles.overviewSection}>
          <div className={styles.resultsHeader}>
            <span className={styles.preTitle}>Liga</span>
            <h2 className={styles.sectionTitle}>Výsledky</h2>
          </div>

          <div className={styles.overviewGrid}>
            <div className={styles.tableColumn}>
              <Tabulka standings={standings} ownTeamName={ownTeamName} />
            </div>

            <div className={styles.matchesColumn}>
              <RecentMatches />
            </div>
          </div>
        </section>

        <section id="hraci" className={styles.bottomSection}>
          <div className={styles.resultsHeader}>
            <span className={styles.preTitle}>Štatistiky tímu</span>
            <h2 className={styles.sectionTitle}>Lídri sezóny</h2>
          </div>

          <TopPlayer />
        </section>
      </main>

      <Footer />
    </div>
  );
}