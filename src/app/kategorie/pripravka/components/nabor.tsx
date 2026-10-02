import React from "react";
import Image from "next/image";
import Link from "next/link";
import GlitchText from "@/app/components/GlitchText";
import recruitmentStyles from "@/app/kategorie/styles/CategoryRecruitment.module.css";
import { API_URL, getApiFetchOptions } from "@/app/lib/api";

const RECRUITMENT_PHRASES = [
  "PRIDAJ SA K ATU",
  "PRÍĎ NA TRÉNING",
  "ZAČNI HRAŤ ZA ATU",
] as const;

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

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21v-1a7 7 0 0 1 14 0v1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 6h16v12H4V6Zm0 1 8 6 8-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M14 7l5 5-5 5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Nabor = async () => {
  const category = await getCategoryBirthYears();

  const birthYearsText = category
    ? `${Math.min(category.birth_year_from, category.birth_year_to)} – ${Math.max(
        category.birth_year_from,
        category.birth_year_to
      )}`
    : "2015 – 2021";

  const coachName = category?.coach_name || "Tréner";
  const coachEmail = category?.coach_email || "martin38.gulas@gmail.com";
  const coachPhone = category?.coach_phone?.trim();

  return (
    <section className={recruitmentStyles.naborSection}>
      <div
        className={recruitmentStyles.naborCard}
        style={
          {
            "--nabor-photo-position-desktop": "62% 46%",
            "--nabor-photo-position-tablet": "59% 43%",
            "--nabor-photo-position-mobile": "56% 30%",
          } as React.CSSProperties
        }
      >
        <div className={recruitmentStyles.naborPhotoWrap} aria-hidden="true">
          <Image
            src="/images/nabor/pripravka_nabor.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 65vw"
            className={recruitmentStyles.naborPhoto}
          />
        </div>

        <div className={recruitmentStyles.naborOverlay} aria-hidden="true" />

        <div className={recruitmentStyles.naborJoinWrap}>
          <p className={recruitmentStyles.naborJoinText}>
            <GlitchText phrases={RECRUITMENT_PHRASES} />
          </p>
        </div>

        <div className={recruitmentStyles.naborContent}>
          <div className={recruitmentStyles.naborInfoGrid}>
            <div className={recruitmentStyles.naborInfoItem}>
              <span className={recruitmentStyles.naborInfoIndex}>01</span>

              <span className={recruitmentStyles.naborInfoIcon}>
                <CalendarIcon />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>Ročník</div>

                <div className={recruitmentStyles.naborInfoValue}>
                  {birthYearsText}
                </div>
              </div>
            </div>

            <div className={recruitmentStyles.naborInfoItem}>
              <span className={recruitmentStyles.naborInfoIndex}>02</span>

              <span className={recruitmentStyles.naborInfoIcon}>
                <PersonIcon />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>Tréner</div>

                <div className={recruitmentStyles.naborInfoValue}>
                  {coachName}
                </div>
              </div>
            </div>

            <div className={recruitmentStyles.naborInfoItem}>
              <span className={recruitmentStyles.naborInfoIndex}>03</span>

              <span className={recruitmentStyles.naborInfoIcon}>
                <MailIcon />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>Kontakt</div>

                <div className={recruitmentStyles.naborInfoValue}>
                  {coachEmail}

                  {coachPhone ? (
                    <span className={recruitmentStyles.naborInfoSubValue}>
                      {coachPhone}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div aria-hidden="true" />

          <div className={recruitmentStyles.naborAction}>
            <Link
              href="/pridaj_sa"
              className={recruitmentStyles.naborPrimaryButton}
            >
              <span>Získať viac informácií</span>

              <span className={recruitmentStyles.naborCtaIcon}>
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nabor;
