import styles from "../../styles/posledne_zapasy.module.css";

type Result = "W" | "L" | "D";

type Match = {
  home: string;
  away: string;
  scoreHome: number;
  scoreAway: number;
  date: string;
  result: Result;
};

const OWN = "ATU Košice";

const matches: Match[] = [
  { home: "ATU Košice",     away: "MFK Ružomberok", scoreHome: 3, scoreAway: 1, date: "15.3.2026", result: "W" },
  { home: "Slovan BA",      away: "ATU Košice",     scoreHome: 2, scoreAway: 2, date: "8.3.2026",  result: "D" },
  { home: "ATU Košice",     away: "DAC D. Streda",  scoreHome: 1, scoreAway: 0, date: "1.3.2026",  result: "W" },
  { home: "Spartak Trnava", away: "ATU Košice",     scoreHome: 3, scoreAway: 0, date: "22.2.2026", result: "L" },
  { home: "ATU Košice",     away: "FK Senica",      scoreHome: 4, scoreAway: 1, date: "15.2.2026", result: "W" },
];

export default function RecentMatches() {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>
        <div className={styles.cardLabelBar} />
        <span className={styles.cardLabelText}>Posledné zápasy</span>
      </div>

      <div className={styles.list}>
        {matches.map((m, i) => (
          <div key={i} className={styles.row}>

            <div className={styles.matchup}>
              <span className={`${styles.teamName} ${m.home === OWN ? styles.teamNameOwn : ""}`}>
                {m.home}
              </span>
              <span className={styles.vs}>VS</span>
              <span className={`${styles.teamName} ${m.away === OWN ? styles.teamNameOwn : ""}`}>
                {m.away}
              </span>
            </div>

            <div className={styles.right}>
              <span className={styles.score}>{m.scoreHome} – {m.scoreAway}</span>
              <span className={styles.date}>{m.date}</span>
              <span className={`${styles.badge} ${styles[`badge${m.result}`]}`}>
                {m.result}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}