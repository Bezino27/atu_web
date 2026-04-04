import React from "react";
import Link from "next/link";
import styles from "./nabor.module.css";

const Nabor = () => {
  return (
    <div className={styles.section}>
      <div className={styles.card}>
        <div className={styles.main}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Dorast ATU Košice</span>
            <h2 className={styles.title}>Chceš hrať za dorast?</h2>

          </div>

          <div className={styles.side}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ročník</span>
                <span className={styles.infoValue}>2009 – 2010</span>
              </div>

              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Kontakt na trénera</span>
                <span className={styles.infoValue}>petobeziboss@6767.sk</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/pridaj_sa" className={styles.primaryButton}>
                Získať viac informácií
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nabor;