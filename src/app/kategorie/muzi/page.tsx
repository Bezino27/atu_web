import React from "react";
import styles from "../kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import NasledujuceZapasy from "./nasledujuce_zapasy/page";
import Image from "next/image";
import Novinky from "./novinky/page";

const matches = [
  {
    league: "Extraliga mužov",
    team: "ATU Košice vs FK Florko",
    date: "2026-03-25",
    time: "18:30",
    location: "Košice, Steel Arena",
  },
  {
    league: "Extraliga mužov",
    team: "ATU Košice vs Slovan Bratislava",
    date: "2026-03-28",
    time: "17:00",
    location: "Bratislava, Zimný štadión",
  },
];

const MuziPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>
        <div className={styles.bannerContainer}>
        <div className={styles.imageWrapper}>
        <div className={styles.bannerOverlay}>
        <h1 className={styles.bannerTitle}>Muži</h1>
        </div>
          <Image
            src="/images/kategorie/muzi_kader.jpg" // obrázok pre mužov
            alt="ATU Košice Muži"
            fill
            style={{ objectFit: "cover" }}
            priority
            />

        </div>
        </div>

        <NasledujuceZapasy matches={matches} />
        <Novinky/>
      </main>

      <Footer />
    </div>
  );
};

export default MuziPage;