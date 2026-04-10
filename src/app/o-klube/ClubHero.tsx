"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./o-klube.module.css";
import { heroInfoCards, heroLocations } from "./o-klube-hero-data";

const ClubVenueMap = dynamic(() => import("./ClubVenueMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Načítavam mapu…</div>,
});

export default function ClubHero() {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  
  return (
    <div className={styles.heroCard}>
      <div className={styles.heroLeft}>
        <div className={styles.heroStatsGrid}>
          {heroInfoCards.map((card) => {
            const isLinkedLocation = card.id === "ostrovskeho";

            return (
              <article
                key={card.id}
                className={`${styles.infoCard} ${
                  isLinkedLocation ? styles.infoCardHighlight : ""
                }`}
                onMouseEnter={() => {
                  if (isLinkedLocation) setActiveLocation(card.id);
                }}
                onMouseLeave={() => {
                  if (isLinkedLocation) setActiveLocation(null);
                }}
              >
                <span className={styles.infoCardLabel}>{card.label}</span>
                <strong className={styles.infoCardValue}>{card.value}</strong>
                <p className={styles.infoCardText}>{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.venueMapWrap}>
          <ClubVenueMap
            locations={heroLocations}
            activeLocation={activeLocation}
          />
        </div>
      </div>
    </div>
  );
}