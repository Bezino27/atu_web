import React from "react";
import styles from "../styles/kategorie.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Novinky from "./components/novinky";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import KdeTrenujeme from "./components/treningy_dorast";
import Nabor from "./components/nabor";
import szfbStyle from "../styles/szfb_cards.module.css";

const DorastPage = async () => {
  const posts: Post[] = await getHomepagePosts("atu-kosice");

  const mladezPosts = posts.filter((post) => {
    const categoryName = post.category?.name?.toLowerCase().trim();

    return (
      categoryName === "dorast" ||
      categoryName === "mládež" ||
      categoryName === "mladez"
    );
  });

  const szfbLinks = [
    {
      title: "Detail tímu",
      href: "https://www.szfb.sk/sk/stats/teams/1171/1-liga-dorastencov-divizia-vychod/team/669890/fabk-atu-kosice",
    },
    {
      title: "Tabuľka",
      href: "https://www.szfb.sk/sk/stats/standings/1171/1-liga-dorastencov-divizia-vychod",
    },
    {
      title: "Výsledky a program",
      href: "https://www.szfb.sk/sk/stats/results-date/1171/1-liga-dorastencov-divizia-vychod",
    },
  ];

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
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImg}
            />

            <div className={styles.bannerOverlay}>
              <div className={styles.heroTextContent}>
                <h1 className={styles.bannerTitle}>Dorast</h1>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <div className={styles.resultsHeader}>
            <span className={styles.preTitle}>SZFB</span>
            <h2 className={styles.sectionTitle}>Odkazy</h2>
          </div>

          <div className={szfbStyle.szfbSection}>
            <div className={szfbStyle.szfbGrid}>
              {szfbLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={szfbStyle.szfbCard}
                >
                  <div className={szfbStyle.szfbCardTop}>
                    <span className={szfbStyle.szfbBadge}>SZFB</span>
                    <span className={szfbStyle.szfbArrow}>↗</span>
                  </div>

                  <h3 className={szfbStyle.szfbCardTitle}>{link.title}</h3>

                  <span className={szfbStyle.szfbCardLink}>Otvoriť odkaz</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <KdeTrenujeme />
        </section>

        <section className={styles.sectionContainer}>
          <Nabor />
        </section>

        <section className={styles.sectionContainer}>
          <Novinky posts={mladezPosts} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DorastPage;