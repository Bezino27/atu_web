import React from 'react';
import styles from "../styles/kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from './components/najlepsi_hrac';
import RecentMatches from './components/posledne_zapasy';
import Tabulka from "./components/tabulka";
import NextMatchCountdown from "./components/NextMatchCountdown";
import { getSzfbDashboard, getSzfbNextMatch } from "@/app/lib/szfb";

const matches = [
  {
    league: "EXTRALIGA MUŽOV",
    homeTeam: "ATU Košice",
    awayTeam: "FK Florko",
    date: "25.03.2026",
    time: "18:30",
    location: "Steel Arena, Košice",
  },
  {
    league: "EXTRALIGA MUŽOV",
    homeTeam: "ATU Košice",
    awayTeam: "Slovan Bratislava",
    date: "28.03.2026",
    time: "17:00",
    location: "Zimný štadión, Bratislava",
  },
];

export default async function MuziPage() {
const [szfbDashboard, nextMatchResponse] = await Promise.all([
  getSzfbDashboard(1),
  getSzfbNextMatch(1),
]);

const standings = szfbDashboard?.standings ?? [];
const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
const nextMatch = nextMatchResponse?.next_match ?? null;

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        <section className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src="/images/kategorie/muzi_kader.jpg"
              alt="ATU Košice Muži"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImg}
            />

            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <span className={styles.heroSubtitle}>Slovenská Florbalová Extraliga</span>
                <h1 className={styles.bannerTitle}>Muži</h1>
              </div>
            </div>
          </div>

            <NextMatchCountdown
              matchDate={nextMatch?.match_date ?? null}
              matchTime={nextMatch?.match_time ?? null}
              opponent={nextMatch?.opponent ?? "Súper bude doplnený"}
              venue={nextMatch?.venue ?? "Miesto zatiaľ nie je uvedené"}
              ownTeamName={ownTeamName}
              isHome={nextMatch?.is_home ?? null}
            />
        </section>

        <section>
          <div className={styles.mainGridContainer}>
            <NasledujuceZapasy matches={matches} />
            <Novinky />
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

        <div className={styles.bottomSection}>
          <TopPlayer />
        </div>
      </main>

      <Footer />
    </div>
  );
}