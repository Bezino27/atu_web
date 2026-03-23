import React from "react";
import styles from "../../styles/Nasledujuce_zapasy.module.css";

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
  const hasMatches = matches && matches.length > 0;

  return (
    <section className={styles.matchesSection}>
      <div className={styles.sectionHeading}>
        <h2 className={styles.title}>Najbližšie zápasy</h2>
      </div>

      {!hasMatches ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3 className={styles.emptyTitle}>Momentálne nie sú naplánované žiadne zápasy</h3>
          <p className={styles.emptyText}>
            Sleduj túto sekciu neskôr, program doplníme hneď po zverejnení ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={styles.matchesGrid}>
          {matches.map((match, index) => (
            <article key={index} className={styles.matchCard}>
              <div className={styles.matchLeague}>{match.league}</div>

              <div className={styles.matchTeamsRow}>
                <div className={styles.teamInfo}>
                  <div className={styles.teamLogo}>
                    <img src="/logo/znak_atu_black.svg" alt="ATU Košice" />
                  </div>
                  <span className={styles.team}>{match.homeTeam}</span>
                </div>

                <div className={styles.vsDivider}>VS</div>

                <div className={styles.teamInfo}>
                  <div className={styles.teamLogo}>
                    <span className={styles.opponentPlaceholder}>?</span>
                  </div>
                  <span className={styles.team}>{match.awayTeam}</span>
                </div>
              </div>

              <div className={styles.matchFooter}>
                <div className={styles.matchDateTime}>
                  <strong>{match.date}</strong> • {match.time}
                </div>
                <div className={styles.matchPlace}>{match.location}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default NasledujuceZapasy;