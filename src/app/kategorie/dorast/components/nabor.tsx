import React from "react";
import Link from "next/link";
import styles from "./nabor.module.css";

const Nabor = () => {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.topRow}>
            <div className={styles.textWrap}>
              <p className={styles.description}>
                Pridaj sa k dorastu ATU Košice.
              </p>
            </div>

            <Link href="/pridaj_sa" className={styles.primaryButton}>
              Získať viac informácií
            </Link>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Ročník</div>
              <div className={styles.infoValue}>2009 – 2010</div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Kontakt na trénera</div>
              <div className={styles.infoValue}>petobeziboss@6767.sk</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nabor;