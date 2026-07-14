"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/TrainingTable.module.css";

export type PublicTrainingLocation = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type PublicCategoryTraining = {
  id: number;
  day: string;
  time: string;
  order: number;
  location: PublicTrainingLocation;
};

const TrainingMap = dynamic(() => import("./TrainingMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Načítavam mapu…</div>,
});

type Props = {
  trainings: PublicCategoryTraining[];
};

const KdeTrenujeme: React.FC<Props> = ({ trainings }) => {
  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const locations = useMemo(() => {
    const unique = new Map<number, PublicTrainingLocation>();

    trainings.forEach((training) => {
      if (training.location) unique.set(training.location.id, training.location);
    });

    return Object.fromEntries(unique.entries());
  }, [trainings]);

  if (trainings.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className="resultsHeader">
        <div>
          <span className="preTitle">TRÉNINGY</span>
          <h2 className="sectionTitle">Kde trénujeme</h2>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.tableWrapper}>
          <div className={styles.listHeader}>
            <span className={styles.headerLabel}>Čas a miesto</span>
          </div>

          <div className={styles.trainingList}>
            {trainings.map((training) => (
              <div
                key={training.id}
                className={`${styles.trainingRow} ${
                  activeLocation === training.location.id ? styles.rowActive : ""
                }`}
                onMouseEnter={() => setActiveLocation(training.location.id)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                <div className={styles.timeBlock}>
                  <div className={styles.dayBadge}>
                    {training.day.substring(0, 2).toUpperCase()}
                  </div>

                  <div className={styles.timeInfo}>
                    <span className={styles.dayName}>{training.day}</span>
                    <span className={styles.timeValue}>{training.time}</span>
                  </div>
                </div>

                <div className={styles.locationBlock}>
                  <div className={styles.locationBadge}>
                    <span className={styles.dot}></span>
                    {training.location.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(locations).length > 0 ? (
          <div className={styles.mapWrapper}>
            <TrainingMap locations={locations} activeLocation={activeLocation} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default KdeTrenujeme;
