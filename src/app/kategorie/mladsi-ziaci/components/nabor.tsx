import React from "react";
import Link from "next/link";
import styles from "@/app/kategorie/styles/unified.module.css";
import { API_URL } from "@/app/lib/api";

type CategoryBirthYears = {
  id: number;
  name: string;
  slug: string;
  season: string;
  birth_year_from: number;
  birth_year_to: number;
  coach_name?: string;
  coach_email?: string;
  coach_phone?: string;
};

async function getCategoryBirthYears(): Promise<CategoryBirthYears | null> {
  try {
    const res = await fetch(
      `${API_URL}/public/teams/atu-kosice/mladsi-ziaci/`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

const Nabor = async () => {
  const category = await getCategoryBirthYears();

  const birthYearsText = category
    ? `${Math.min(category.birth_year_from, category.birth_year_to)} – ${Math.max(
        category.birth_year_from,
        category.birth_year_to
      )}`
    : "2013 – 2014";

  return (
    <section className={styles.naborSection}>
      <div className={styles.naborCard}>
        <div className={styles.naborContent}>
          <div className={styles.naborTopRow}>
            <div className={styles.naborTextWrap}>
              <p className={styles.naborDescription}>
                Pridaj sa k ATU Košice.
              </p>
            </div>

            <Link href="/pridaj_sa" className={styles.naborPrimaryButton}>
              Získať viac informácií
            </Link>
          </div>

          <div className={styles.naborInfoGrid}>
            <div className={styles.naborInfoItem}>
              <div className={styles.naborInfoLabel}>Ročník</div>
              <div className={styles.naborInfoValue}>{birthYearsText}</div>
            </div>

            <div className={styles.naborInfoItem}>
              <div className={styles.naborInfoLabel}>Kontakt na trénera</div>
              <div className={styles.naborInfoValue}>
                {category?.coach_name || "Tréner"}
                <br />
                {category?.coach_email || "petobeziboss@6767.sk"}
                {category?.coach_phone ? (
                  <>
                    <br />
                    {category.coach_phone}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nabor;