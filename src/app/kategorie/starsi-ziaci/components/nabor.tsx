import React from "react";
import Image from "next/image";
import Link from "next/link";
import GlitchText from "@/app/components/GlitchText";
import {
  PiArrowRightBold,
  PiCalendarBlank,
  PiEnvelopeSimple,
  PiUser,
} from "react-icons/pi";
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
      `${API_URL}/public/teams/atu-kosice/starsi-ziaci/`,
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
    : "2011 – 2012";

  const coachName = category?.coach_name || "Tréner";
  const coachEmail = category?.coach_email || "tomikbez@gmail.com";
  const coachPhone = category?.coach_phone?.trim();

  return (
    <section className={recruitmentStyles.naborSection}>
      <div
        className={recruitmentStyles.naborCard}
        style={
          {
            "--nabor-photo-position-desktop": "43% 42%",
            "--nabor-photo-position-tablet": "40% 39%",
            "--nabor-photo-position-mobile": "38% 30%",
          } as React.CSSProperties
        }
      >
        <div className={recruitmentStyles.naborPhotoWrap} aria-hidden="true">
          <Image
            src="/images/nabor/starsi_ziaci_nabor.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 65vw"
            className={recruitmentStyles.naborPhoto}
          />
        </div>

        <div
          className={recruitmentStyles.naborOverlay}
          aria-hidden="true"
        />

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
                <PiCalendarBlank aria-hidden="true" />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>
                  Ročník
                </div>

                <div className={recruitmentStyles.naborInfoValue}>
                  {birthYearsText}
                </div>
              </div>
            </div>

            <div className={recruitmentStyles.naborInfoItem}>
              <span className={recruitmentStyles.naborInfoIndex}>02</span>

              <span className={recruitmentStyles.naborInfoIcon}>
                <PiUser aria-hidden="true" />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>
                  Meno trénera
                </div>

                <div className={recruitmentStyles.naborInfoValue}>
                  {coachName}
                </div>
              </div>
            </div>

            <div className={recruitmentStyles.naborInfoItem}>
              <span className={recruitmentStyles.naborInfoIndex}>03</span>

              <span className={recruitmentStyles.naborInfoIcon}>
                <PiEnvelopeSimple aria-hidden="true" />
              </span>

              <div className={recruitmentStyles.naborInfoText}>
                <div className={recruitmentStyles.naborInfoLabel}>
                  Kontakt
                </div>

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

              <PiArrowRightBold
                className={recruitmentStyles.naborCtaIcon}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Nabor;
