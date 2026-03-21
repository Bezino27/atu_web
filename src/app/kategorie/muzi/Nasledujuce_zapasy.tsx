import React from "react";
import styles from "./Nasledujuce_zapasy.module.css";

interface Match {
  league: string;
  team: string;
  date: string;
  time: string;
  location: string;
}

interface NasledujuceZapasyProps {
  matches: Match[];
}


const NasledujuceZapasy: React.FC<NasledujuceZapasyProps> = ({ matches }) => {
  return (
    <section className={styles.upcomingMatchesSection}>
      <h2 className={styles.title}>Najbližšie zápasy</h2>

      {matches.length > 0 ? (
        <ul className={styles.list}>
          {matches.map((match, idx) => (
            <li key={idx} className={styles.item}>
              <div className={styles.matchHeader}>
                <span className={styles.league}>{match.league}</span>
                <span className={styles.dateTime}>
                  {new Date(match.date).toLocaleDateString()} • {match.time}
                </span>
              </div>
              <div className={styles.matchBody}>
                <span className={styles.team}>{match.team}</span>
                <span className={styles.location}>{match.location}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.none}>Žiadne zápasy</p>
      )}
    </section>
  );
};


export default NasledujuceZapasy;