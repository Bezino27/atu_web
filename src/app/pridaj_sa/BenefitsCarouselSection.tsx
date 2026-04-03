"use client";

import { useState } from "react";
import BenefitsCarousel from "./BenefitsCarousel";
import styles from "./BenefitsCarouselSection.module.css";
import pridaj_styles from "./pridaj_sa.module.css";

type BenefitItem = {
  title: string;
  text: string;
};

type BenefitsCarouselSectionProps = {
  title: string;
  benefits: BenefitItem[];
};

export default function BenefitsCarouselSection({
  title,
  benefits,
}: BenefitsCarouselSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % benefits.length);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.sectionHeader}>
        <h2 className={pridaj_styles.sectionTitle}>{title}</h2>

        <div className={styles.sectionControls}>
          <button
            type="button"
            className={styles.carouselButton}
            onClick={goPrev}
            aria-label="Predchádzajúca karta"
          >
            ←
          </button>

          <button
            type="button"
            className={styles.carouselButton}
            onClick={goNext}
            aria-label="Ďalšia karta"
          >
            →
          </button>
        </div>
      </div>

      <BenefitsCarousel benefits={benefits} activeIndex={activeIndex} />
    </div>
  );
}