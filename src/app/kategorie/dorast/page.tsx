'use client';

import React from 'react';
import styles from "../styles/kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Novinky from "./components/novinky";
import TopPlayer from './components/najlepsi_hrac';
import KdeTrenujeme from "./components/treningy_dorast";

const DorastPage = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.content}>

        <section className={styles.heroSection}>
          <div className={styles.bannerContainer}>
            <Image
              src="/images/kategorie/dorast_kader.jpg"
              alt="ATU Košice Dorast"
              fill
              priority
              className={styles.heroImg}
            />
            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <h1 className={styles.bannerTitle}>Dorast</h1>
              </div>
            </div>
          </div>
        </section>

        <KdeTrenujeme/>

        <div className={styles.mainGridContainer}>
          <Novinky />
        </div>

        <TopPlayer />
      </main>
      <Footer />
    </div>
  );
};

export default DorastPage;