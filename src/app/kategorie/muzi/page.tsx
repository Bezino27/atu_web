"use client";

import { useState } from "react";
import styles from "../kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// --- MOCK DÁTA ---
const MOCK_MATCHES = [
  { id: 1, homeTeam: "ATU Košice", awayTeam: "FK Florko", score: "7:4", date: "17. 3. 2026", type: "past" },
  { id: 2, homeTeam: "ATU Košice", awayTeam: "Capitals Bratislava", score: "6:6", date: "1. 3. 2026", type: "past" },
  { id: 3, homeTeam: "ATU Košice", awayTeam: "Grasshoppers Žilina", date: "30. 3. 2026 | 17:00", type: "upcoming" },
  { id: 4, homeTeam: "ATU Košice", awayTeam: "Capitals Bratislava", date: "5. 4. 2026 | 14:00", type: "upcoming" },
];

const MOCK_NEWS = [
  { id: 1, tag: "A-tím", title: "ATU Košice zvládlo derby a berie dôležité 3 body", date: "18. marec 2026" },
  { id: 2, tag: "Rozhovor", title: "Rozhovor s trénerom: Čo chceme zlepšiť pred play-off", date: "14. marec 2026" },
  { id: 3, tag: "Pozvánka", title: "Pozvánka na víkendové domáce zápasy", date: "2. marec 2026" },
];

const MOCK_ROSTER = [
  { id: 1, name: "Martin Novák", number: 19, position: "Útočník" },
  { id: 2, name: "Peter Kováč", number: 8, position: "Obranca" },
  { id: 3, name: "Tomáš Horváth", number: 33, position: "Brankár" },
  { id: 4, name: "Lukáš Varga", number: 10, position: "Útočník" },
];

const MOCK_STATS = [
  { id: 1, label: "Najlepší strelec", name: "M. Novák", value: "24 gólov" },
  { id: 2, label: "Najviac asistencií", name: "L. Varga", value: "18 asistencií" },
  { id: 3, label: "Líder bodovania", name: "M. Novák", value: "42 bodov" },
];
// 1. DEFINÍCIA TYPOV (TypeScript Interfacy)
interface Match {
  homeTeam: string;
  awayTeam: string;
  score?: string;
  date: string;
}

interface Player {
  number: number;
  name: string;
  position: string;
}
interface News {
  tag: string;
  date: string;
  title: string;
}
// --- KOMPONENTY ---
const Hero = () => (
  <section className={styles.hero}>
    <div className={styles.heroOverlay}></div>
    <div className={styles.heroContent}>
      <h1>Muži (A-tím)</h1>
      <p>Reprezentujú náš klub v najvyššej súťaži. Sme pripravení na play-off!</p>
      <button className={styles.primaryBtn}>Pozrieť zápasy</button>
    </div>
  </section>
);

const MatchCard = ({ match }: { match: Match }) => (
  <div className={styles.resultCard}>
    <div>
      <span className={styles.smallBadge}>{match.score ? 'Výsledok' : 'Zápas'}</span>
      <span>{match.date}</span>
    </div>
    <div className={styles.resultScore}>{match.score || "vs"}</div>
    <p><strong>{match.homeTeam}</strong> vs <strong>{match.awayTeam}</strong></p>
  </div>
);

const PlayerCard = ({ player }: { player: Player }) => (
  <div className={styles.postCard}>
    <div className={styles.postImageWrap} style={{ background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', color: '#ccc' }}>
      {player.number}
    </div>
    <div className={styles.postContent}>
      <span className={styles.smallBadge}>{player.position}</span>
      <h3>{player.name}</h3>
    </div>
  </div>
);

 const NewsCard = ({ news }: { news: News }) => (
  <div className={styles.postCard}> {/* Používame postCard z tvojho CSS pre jednotný dizajn */}
    <div className={styles.postImageWrap} style={{ background: '#ddd' }}>
       {/* Sem neskôr pôjde Image */}
    </div>
    <div className={styles.postContent}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <span className={styles.smallBadge}>{news.tag}</span>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>{news.date}</span>
      </div>
      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{news.title}</h3>
    </div>
  </div>
);



// --- HLAVNÁ STRÁNKA ---
export default function MuziPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const filteredMatches = MOCK_MATCHES.filter((m) => m.type === activeTab);

  return (
    <>
      <Header />

      <main className={styles.page}>
        <Hero />

        {/* QUICK INFO */}
        <section className={styles.quickInfo}>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Liga</span>
            <strong>Extraliga mužov</strong>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Aktuálna pozícia</span>
            <strong>1. miesto</strong>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Posledný zápas</span>
            <strong>Výhra 7:4</strong>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Ďalší súper</span>
            <strong>Grasshoppers (30.3.)</strong>
          </div>
        </section>

        {/* LATEST NEWS */}
        <section className={styles.section}>
          <h2>Novinky z A-tímu</h2>
          <div className={styles.newsGrid}>
            {MOCK_NEWS.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        {/* MATCHES WITH TABS */}
        <section className={styles.section}>
          <h2>Zápasy</h2>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === "past" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("past")}
            >
              Posledné zápasy
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === "upcoming" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Nadchádzajúce zápasy
            </button>
          </div>
          <div className={styles.matchesGrid}>
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* TEAM ROSTER */}
        <section className={styles.section}>
          <h2>Súpiska tímu</h2>
          <div className={styles.rosterGrid}>
            {MOCK_ROSTER.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </section>

        {/* BASIC STATS */}
        <section className={styles.section}>
          <h2>Lídri tímu</h2>
          <div className={styles.statsGrid}>
            {MOCK_STATS.map((stat) => (
              <div key={stat.id} className={styles.statCard}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statName}>{stat.name}</div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}