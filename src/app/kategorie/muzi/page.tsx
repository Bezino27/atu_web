'use client'; // Dôležité, ak používaš Next.js (kvôli useEffect a useState)

import React, { useState, useEffect } from 'react';
import styles from "../kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./nasledujuce_zapasy/page";
import Image from "next/image";
import Novinky from "./novinky/page";
import StandingsTable from './tabulka/page';
import TopPlayer from './najlepsi_hrac/page';
import RecentMatches from './posledne_zapasy/page';

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
  // 1. Nastavenie cieľového dátumu
  const targetDate = new Date("2026-03-25T18:30:00").getTime();

  // 2. React stavy
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isLive, setIsLive] = useState(false);

  // 3. Efekt pre odpočítavanie
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

  // Pomocná funkcia pre pekné formátovanie čísel (01, 02...)
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <main className={styles.content}>
        {/* HERO SEKCIA */}
        <section className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src="/images/kategorie/muzi_kader.jpg"
              alt="ATU Košice Muži"
              fill
              priority
              className={styles.heroImg}
            />
            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <span className={styles.heroSubtitle}>Slovenská Florbalová Extraliga</span>
                <h1 className={styles.bannerTitle}>Muži</h1>
              </div>
            </div>
          </div>

          {/* DYNAMICKÝ ODPOČET */}
          <div className={styles.countdownWrapper}>
            <div className={styles.countdownBar}>
              {/* Bodka, ktorá pri LIVE svieti inak */}
              <span 
                className={styles.liveDot} 
                style={isLive ? { backgroundColor: '#ff0000', boxShadow: '0 0 15px #ff0000' } : {}}
              />
              
              <span className={styles.timer}>
                {isLive ? (
                  <span style={{ color: '#d32f2f', fontWeight: '900' }}>
                    SLEDUJTE LIVE ⚡
                  </span>
                ) : (
                  <>
                    <span className={styles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS O: </span>
                    {timeLeft.days}d : {formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s
                  </>
                )}
              </span>
            </div>
          </div>
        </section>

       {/* ZÁPASY A NOVINKY */}
        <div className={styles.mainGridContainer}>
          <NasledujuceZapasy matches={matches} />
          <Novinky />
        </div>
         <div className={styles.statsGrid}>
           <StandingsTable />
          <div className={styles.rightColumn}>
           <RecentMatches />
           <TopPlayer />
         </div>
        </div> 
      </main>

      <Footer />
    </div>
  );
};

export default MuziPage;