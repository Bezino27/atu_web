"use client";

import { useMemo, useRef, useState } from "react";
import styles from "./BenefitsCarousel.module.css";

type WhyAtuItem = {
  id: number;
  title: string;
  text: string;
};

type WhyAtuCarouselProps = {
  eyebrow?: string;
  title: string;
  items: WhyAtuItem[];
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export default function WhyAtuCarousel({
  eyebrow,
  title,
  items,
}: WhyAtuCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(items.length / 2)
  );

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const mappedItems = useMemo(() => {
    return items.map((item, index) => {
      const total = items.length;
      let offset = index - activeIndex;

      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      return {
        ...item,
        index,
        offset,
        absOffset: Math.abs(offset),
        isActive: offset === 0,
      };
    });
  }, [items, activeIndex]);

  const goPrev = () => {
    setActiveIndex((prev) => mod(prev - 1, items.length));
  };

  const goNext = () => {
    setActiveIndex((prev) => mod(prev + 1, items.length));
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;

    if (touchStartX.current === null || touchEndX.current === null) return;

    const delta = touchStartX.current - touchEndX.current;

    if (Math.abs(delta) < 40) {
      touchStartX.current = null;
      touchEndX.current = null;
      return;
    }

    if (delta > 0) {
      goNext();
    } else {
      goPrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!items?.length) return null;

  return (
      <div className={styles.section}>
        <div className={styles.headerRow}>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.arrowButton}
              onClick={goPrev}
              aria-label="Predchádzajúca karta"
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              className={styles.arrowButton}
              onClick={goNext}
              aria-label="Ďalšia karta"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div
          className={styles.carousel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Carousel Prečo ATU"
        >
        <div className={styles.stage}>
          {mappedItems.map((item) => {
            const hidden = item.absOffset > 2;

            return (
              <article
                key={item.id}
                className={[
                  styles.card,
                  item.isActive ? styles.cardActive : "",
                  hidden ? styles.cardHidden : "",
                ].join(" ")}
                style={
                  {
                    ["--offset" as string]: item.offset,
                    ["--abs-offset" as string]: item.absOffset,
                    ["--z-index" as string]: 40 - item.absOffset,
                  } as React.CSSProperties
                }
                onClick={() => handleCardClick(item.index)}
                aria-hidden={hidden}
              >
                <div className={styles.cardInner}>
                <div
                  className={`${styles.cardAccent} ${item.isActive ? styles.cardAccentActive : ""}`}
                />                  
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardText}>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.dots} aria-label="Navigácia carouselu">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.dot} ${
                index === activeIndex ? styles.dotActive : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Prejsť na kartu ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}