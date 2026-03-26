import styles from "../../styles/posledne_zapasy.module.css";
import categoriesStyles from "../../styles/kategorie.module.css";
type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
};

const matches: Match[] = [
  {
    id: 1,
    homeTeam: "FBC Grasshoppers AC UNIZA Žilina",
    awayTeam: "FaBK ATU Košice",
    homeScore: 6,
    awayScore: 4,
    date: "15. marca 2026",
  },
  {
    id: 2,
    homeTeam: "FBC Grasshoppers AC UNIZA Žilina",
    awayTeam: "FaBK ATU Košice",
    homeScore: 12,
    awayScore: 2,
    date: "14. marca 2026",
  },
  {
    id: 3,
    homeTeam: "FaBK ATU Košice",
    awayTeam: "FBC Grasshoppers AC UNIZA Žilina",
    homeScore: 5,
    awayScore: 8,
    date: "8. marca 2026",
  },
  {
    id: 4,
    homeTeam: "FaBK ATU Košice",
    awayTeam: "FBC Grasshoppers AC UNIZA Žilina",
    homeScore: 3,
    awayScore: 2,
    date: "7. marca 2026",
  },
  {
    id: 5,
    homeTeam: "Snipers Bratislava",
    awayTeam: "FaBK ATU Košice",
    homeScore: 6,
    awayScore: 7,
    date: "28. februára 2026",
  },
];

function isAtuTeam(team: string) {
  return team.toLowerCase().includes("atu košice");
}

function getMatchOutcome(match: Match) {
  const atuIsHome = isAtuTeam(match.homeTeam);
  const atuScore = atuIsHome ? match.homeScore : match.awayScore;
  const opponentScore = atuIsHome ? match.awayScore : match.homeScore;

  if (atuScore > opponentScore) {
    return {
      label: "Výhra",
      className: styles.winBadge,
      scoreClassName: styles.winScore,
    };
  }

  return {
    label: "Prehra",
    className: styles.lossBadge,
    scoreClassName: styles.lossScore,
  };
}

export default function RecentMatches() {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={categoriesStyles.preTitle}>VÝSLEDKY</span>
          <h2 className={styles.title}>Posledné zápasy</h2>
        </div>
      </div>

      <div className={styles.matchesList}>
        {matches.slice(0, 4).map((match) => {
          const outcome = getMatchOutcome(match);

          return (
            <article key={match.id} className={styles.matchCard}>
              <div className={styles.matchTop}>
                <span className={`${styles.resultBadge} ${outcome.className}`}>
                  {outcome.label}
                </span>
                <span className={styles.matchDate}>{match.date}</span>
              </div>

              <div className={styles.teams}>
                <div className={styles.teamRow}>
                  <span
                    className={`${styles.teamName} ${
                      isAtuTeam(match.homeTeam) ? styles.atuTeam : ""
                    }`}
                  >
                    {match.homeTeam}
                  </span>
                </div>

                <div className={styles.vsRow}>vs</div>

                <div className={styles.teamRow}>
                  <span
                    className={`${styles.teamName} ${
                      isAtuTeam(match.awayTeam) ? styles.atuTeam : ""
                    }`}
                  >
                    {match.awayTeam}
                  </span>
                </div>
              </div>

              <div className={styles.scoreRow}>
                <span className={`${styles.score} ${outcome.scoreClassName}`}>
                  {match.homeScore}:{match.awayScore}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}