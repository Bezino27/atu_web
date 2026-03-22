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
          <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Deň</th>
              <th className={styles.th}>Čas</th>
              <th className={`${styles.th} ${styles.thRight}`}>Lokalita</th>
            </tr>
          </thead>
            <tbody>
              {dorastTrainings.map((t, idx) => (
                <tr
                  key={idx}
                  className={`${styles.tr} ${activeLocation === t.locationId ? styles.trActive : ''}`}
                  onMouseEnter={() => setActiveLocation(t.locationId)}
                  onMouseLeave={() => setActiveLocation(null)}
                >
                  <td className={`${styles.td} ${styles.dayCol}`}>{t.day}</td>
                  <td className={`${styles.td} ${styles.timeCol}`}>{t.time}</td>
                  <td className={`${styles.td} ${styles.placeCol}`}>{locations[t.locationId]?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mapWrapper}>
          <TrainingMap locations={locations} activeLocation={activeLocation} />
        </div>

      </div>
    </section>
  );
};

export default KdeTrenujeme;