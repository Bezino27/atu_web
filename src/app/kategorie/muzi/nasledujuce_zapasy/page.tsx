import React from "react";
import styles from "./Nasledujuce_zapasy.module.css"; // Cesta k tvojmu CSS

// Definujeme nový "Match" typ, aby TypeScript neprotestoval
export interface Match {
  league: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location: string;
}

interface NasledujuceZapasyProps {
  matches: Match[];
}

const NasledujuceZapasy: React.FC<NasledujuceZapasyProps> = ({ matches }) => {
  return (
    <section className={styles.matchesSection}>
      <h2 className={styles.title}>Najbližšie zápasy</h2>
      <div className={styles.matchesGrid}>
        {matches.map((match, index) => (
          <div key={index} className={styles.matchCard}>
            <div className={styles.matchLeague}>{match.league}</div>
            
            <div className={styles.matchTeamsRow}>
              <div className={styles.teamInfo}>
                <div className={styles.teamLogo}><img src="/logo/znak_atu_black.svg"alt="ATU Košice" /></div>
                <span className={styles.team}>{match.homeTeam}</span>
              </div>
              
              <div className={styles.vsDivider}>VS</div>
              
              <div className={styles.teamInfo}>
                <div className={styles.teamLogo}>?</div>
                <span className={styles.team}>{match.awayTeam}</span>
              </div>
            </div>

            <div className={styles.matchFooter}>
              <div className={styles.matchDateTime}>
                <strong>{match.date}</strong> • {match.time}
              </div>
              <div className={styles.matchPlace}>{match.location}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NasledujuceZapasy;