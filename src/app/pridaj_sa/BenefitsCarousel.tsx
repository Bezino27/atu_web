"use client";

import { useMemo } from "react";
import styles from "./BenefitsCarousel.module.css";

type BenefitItem = {
  title: string;
  text: string;
};

type BenefitsCarouselProps = {
  benefits: BenefitItem[];
  activeIndex: number;
};

export default function BenefitsCarousel({
  benefits,
  activeIndex,
}: BenefitsCarouselProps) {
  const orderedBenefits = useMemo(() => {
    return benefits.map((item, index) => {
      const rawOffset =
        (index - activeIndex + benefits.length) % benefits.length;

      let offset = rawOffset;
      if (offset > benefits.length / 2) {
        offset = offset - benefits.length;
      }

      return {
        ...item,
        index,
        offset,
      };
    });
  }, [benefits, activeIndex]);

  const getCardStyle = (offset: number): React.CSSProperties => {
    const absOffset = Math.abs(offset);

    const translateX = offset * 185;
    const translateY = absOffset * 2;
    const translateZ = 0;
    const rotateY = offset * -6;
    const scale = 1 - absOffset * 0.07;
    const opacity = Math.max(0.55, 1 - absOffset * 0.14);
    const zIndex = 30 - absOffset;

    return {
      transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktopCarousel}>
        <div className={styles.ringScene}>
          <div className={styles.ringTrack}>
            {orderedBenefits.map((item) => (
              <article
                key={item.title}
                className={styles.ringCard}
                style={getCardStyle(item.offset)}
              >
                <div className={styles.ringCardInner}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.mobileCarousel}>
        <div className={styles.mobileTrack}>
          {benefits.map((item) => (
            <article key={item.title} className={styles.mobileCard}>
              <div className={styles.mobileCardInner}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}