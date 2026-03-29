import React from "react";
import Link from "next/link";
import styles from "./nabor.module.css";

const Nabor = () => {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Dorast ATU Košice</span>

          <h2 className={styles.title}>Informácie pre záujemcov</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ročník</span>
              <span className={styles.infoValue}>2009 – 2010</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Kontakt na trénera</span>
              <span className={styles.infoValue}>beziboss@67.sk</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/pridajsa" className={styles.primaryButton}>
              Získať viac informácií
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nabor;