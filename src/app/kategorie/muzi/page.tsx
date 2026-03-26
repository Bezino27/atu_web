'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from "../styles/kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./components/nasledujuce_zapasy";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from './components/najlepsi_hrac';
import RecentMatches from './components/posledne_zapasy';
import Tabulka from "./components/tabulka";
import { type SzfbStandingRow } from "@/app/lib/szfb";

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

const MuziPage = () => {
  const targetDate = useMemo(() => new Date("2026-03-25T18:30:00").getTime(), []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLive, setIsLive] = useState(false);

  const [standings, setStandings] = useState<SzfbStandingRow[]>([]);

 useEffect(() => {
  const loadStandings = async () => {
    try {
      const response = await fetch("/api/szfb/watch/1/dashboard");

      if (!response.ok) {
        console.error("Failed to load standings:", response.status);
        setStandings([]);
        return;
      }

      const data = await response.json();
      setStandings(data?.standings ?? []);
    } catch (error) {
      console.error("Failed to fetch standings:", error);
      setStandings([]);
    }
  };

  loadStandings();
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

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

          <div className={styles.countdownWrapper}>
            <div className={styles.countdownBar}>
              <span
                className={styles.liveDot}
                style={isLive ? { backgroundColor: "#ff0000", boxShadow: "0 0 15px #ff0000" } : {}}
              />
              <span className={styles.timer}>
                {isLive ? (
                  <span style={{ color: "#d32f2f", fontWeight: "900" }}>
                    SLEDUJTE LIVE ⚡
                  </span>
                ) : (
                  <>
                    <span className={styles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS O:</span>{" "}
                    {timeLeft.days}d : {formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s
                  </>
                )}
              </span>
            </div>
          </div>
        </section>

        <section>
          <div className={styles.mainGridContainer}>
            <NasledujuceZapasy matches={matches} />
            <Novinky />
          </div>

          <div className={styles.overviewGrid}>
            <div className={styles.tableColumn}>
              <Tabulka standings={standings} ownTeamName="FaBK ATU Košice" />
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
};

export default MuziPage;