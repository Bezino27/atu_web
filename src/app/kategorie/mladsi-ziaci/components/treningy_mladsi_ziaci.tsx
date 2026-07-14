"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../../styles/TrainingTable.module.css";

export type TrainingLocation = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

export type CategoryTraining = {
  id: number;
  day: string;
  time: string;
  order: number;
  location: TrainingLocation;
};

type KdeTrenujemeProps = {
  trainings: CategoryTraining[];
};

const TrainingMap = dynamic(() => import("./TrainingMap"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Načítavam mapu…</div>,
});

const KdeTrenujeme: React.FC<KdeTrenujemeProps> = ({ trainings }) => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  const sortedTrainings = useMemo(
    () => [...trainings].sort((a, b) => a.order - b.order),
    [trainings],
  );

  const locations = useMemo(() => {
    return sortedTrainings.reduce<
      Record<
        string,
        {
          name: string;
          address: string;
          lat: number;
          lng: number;
        }
      >
    >((result, training) => {
      if (!training.location) return result;

      const key = String(training.location.id);

      result[key] = {
        name: training.location.name,
        address: training.location.address,
        lat: training.location.lat,
        lng: training.location.lng,
      };

      return result;
    }, {});
  }, [sortedTrainings]);

  if (sortedTrainings.length === 0) {
    return null;
  }

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
            {sortedTrainings.map((training) => {
              const locationId = String(training.location.id);

              return (
                <div
                  key={training.id}
                  className={`${styles.trainingRow} ${
                    activeLocation === locationId ? styles.rowActive : ""
                  }`}
                  onMouseEnter={() => setActiveLocation(locationId)}
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
              );
            })}
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