import React from "react";
import styles from "../styles/unified.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Novinky from "./components/novinky";
import { getHomepagePosts, type Post } from "@/app/lib/posts";
import KdeTrenujeme from "./components/treningy_dorast";
import Nabor from "./components/nabor";

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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {szfbLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "160px",
                  padding: "22px",
                  borderRadius: "24px",
                  textDecoration: "none",
                  color: "inherit",
                  background: "linear-gradient(180deg, #ffffff 0%, #fcfcfd 100%)",
                  border: "1px solid rgba(17, 24, 39, 0.07)",
                  boxShadow:
                    "0 14px 30px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "18px",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "28px",
                      padding: "0 12px",
                      borderRadius: "999px",
                      background: "rgba(211, 47, 47, 0.08)",
                      color: "#84101A",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    SZFB
                  </span>

                  <span
                    style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111" }}
                  >
                    ↗
                  </span>
                </div>

                <h3
                  style={{
                    margin: "0 0 20px",
                    fontSize: "1.18rem",
                    lineHeight: 1.2,
                    fontWeight: 850,
                    color: "#111",
                  }}
                >
                  {link.title}
                </h3>

                <span
                  style={{
                    marginTop: "auto",
                    color: "rgba(17, 17, 17, 0.55)",
                    fontSize: "0.92rem",
                    fontWeight: 600,
                  }}
                >
                  Otvoriť odkaz
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.sectionContainer}>
          <KdeTrenujeme />
        </section>

        <section className={styles.sectionContainer}>
        <div className={styles.resultsHeader}>
          <span className={styles.preTitle}>NÁBOR</span>
          <h2 className={styles.sectionTitle}>Chceš hrať za dorast?</h2>
        </div> 
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
