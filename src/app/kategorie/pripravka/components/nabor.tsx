import React from "react";
import Link from "next/link";
import recruitmentStyles from "@/app/kategorie/styles/CategoryRecruitment.module.css";
import { API_URL, getApiFetchOptions } from "@/app/lib/api";

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
      `${API_URL}/public/teams/atu-kosice/pripravka/`,
      getApiFetchOptions(600)
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
    : "2015 – 2021";

  return (
    <section className={recruitmentStyles.naborSection}>
      <div className={recruitmentStyles.naborCard}>
        <div className={recruitmentStyles.naborContent}>
          <div className={recruitmentStyles.naborTopRow}>
            <div className={recruitmentStyles.naborTextWrap}>
              <p className={recruitmentStyles.naborDescription}>
                Pridaj sa k ATU Košice.
              </p>
            </div>

            <Link href="/pridaj_sa" className={recruitmentStyles.naborPrimaryButton}>
              Získať viac informácií
            </Link>
          </div>

          <div className={recruitmentStyles.naborInfoGrid}>
            <div className={recruitmentStyles.naborInfoItem}>
              <div className={recruitmentStyles.naborInfoLabel}>Ročník</div>
              <div className={recruitmentStyles.naborInfoValue}>{birthYearsText}</div>
            </div>

            <div className={recruitmentStyles.naborInfoItem}>
              <div className={recruitmentStyles.naborInfoLabel}>Kontakt na trénera</div>
              <div className={recruitmentStyles.naborInfoValue}>
                {category?.coach_name || "Tréner"}
                <br />
                {category?.coach_email || "martin38.gulas@gmail.com"}
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
