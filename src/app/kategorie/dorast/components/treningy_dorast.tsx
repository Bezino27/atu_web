'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './TrainingTable.module.css';
import { dorastTrainings, locations } from '@/data/treningy_dorast';

const TrainingMap = dynamic(() => import('./TrainingMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Načítavam mapu…</div>,
});

const KdeTrenujeme: React.FC = () => {
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Kde trénujeme</h2>
      <div className={styles.layout}>
        
        <div className={styles.tableWrapper}>
          <div className={styles.trainingList}>
            {/* Hlavička pre vizuálnu orientáciu */}
            <div className={styles.listHeader}>
              <span className={styles.headerLabel}>Čas a Miesto</span>
            </div>

            {dorastTrainings.map((t, idx) => (
              <div
                key={idx}
                className={`${styles.trainingRow} ${activeLocation === t.locationId ? styles.rowActive : ''}`}
                onMouseEnter={() => setActiveLocation(t.locationId)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                {/* Ľavá strana: Deň a Čas */}
                <div className={styles.timeBlock}>
                  <div className={styles.dayBadge}>
                    {t.day.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={styles.timeInfo}>
                    <span className={styles.dayName}>{t.day}</span>
                    <span className={styles.timeValue}>{t.time}</span>
                  </div>
                </div>

                {/* Pravá strana: Lokalita s ikonkou/badgom */}
                <div className={styles.locationBlock}>
                  <div className={styles.locationBadge}>
                    <span className={styles.dot}></span>
                    {locations[t.locationId]?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mapWrapper}>
          <TrainingMap locations={locations} activeLocation={activeLocation} />
        </div>

      </div>
    </section>
  );
};

export default KdeTrenujeme;