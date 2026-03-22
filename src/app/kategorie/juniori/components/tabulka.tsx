import styles from "../../styles/tabulka.module.css";

type TeamRow = {
  rank: number;
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ("W" | "D" | "L")[];
  isOwn?: boolean;
};

const teams: TeamRow[] = [
  { rank: 1, name: "Slovan Bratislava",  played: 24, wins: 18, draws: 3, losses: 3,  goalsFor: 58, goalsAgainst: 22, points: 57, form: ["W","W","W","D","W"] },
  { rank: 2, name: "Spartak Trnava",     played: 24, wins: 15, draws: 4, losses: 5,  goalsFor: 44, goalsAgainst: 28, points: 49, form: ["W","L","W","W","D"] },
  { rank: 3, name: "FC Košice",          played: 24, wins: 14, draws: 3, losses: 7,  goalsFor: 41, goalsAgainst: 31, points: 45, form: ["W","W","L","W","W"], isOwn: true },
  { rank: 4, name: "DAC Dunajská Str.",  played: 24, wins: 12, draws: 5, losses: 7,  goalsFor: 39, goalsAgainst: 30, points: 41, form: ["D","W","W","L","W"] },
  { rank: 5, name: "AS Trenčín",         played: 24, wins: 11, draws: 4, losses: 9,  goalsFor: 35, goalsAgainst: 33, points: 37, form: ["L","W","D","W","L"] },
  { rank: 6, name: "MFK Ružomberok",     played: 24, wins: 9,  draws: 6, losses: 9,  goalsFor: 32, goalsAgainst: 35, points: 33, form: ["W","L","L","D","W"] },
  { rank: 7, name: "FK Senica",          played: 24, wins: 7,  draws: 5, losses: 12, goalsFor: 27, goalsAgainst: 40, points: 26, form: ["L","L","W","L","D"] },
  { rank: 8, name: "FK Pohronie",        played: 24, wins: 5,  draws: 4, losses: 15, goalsFor: 21, goalsAgainst: 48, points: 19, form: ["L","D","L","L","L"] },
];

function FormDots({ form }: { form: TeamRow["form"] }) {
  const dotClass: Record<string, string> = {
    W: styles.formDotW,
    D: styles.formDotD,
    L: styles.formDotL,
  };
  return (
    <span className={styles.formDots}>
      {form.map((r, i) => (
        <span key={i} className={`${styles.formDot} ${dotClass[r]}`} title={r} />
      ))}
    </span>
  );
}

export default function StandingsTable() {
  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>
        <div className={styles.cardLabelBar} />
        <span className={styles.cardLabelText}>Slovenská Extraliga</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Tím</th>
            <th>Z</th>
            <th>V</th>
            <th>R</th>
            <th>P</th>
            <th>Skóre</th>
            <th>Forma</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t) => (
            <tr key={t.rank} className={t.isOwn ? styles.highlighted : ""}>
              <td>
               <div className={styles.teamCell}>
                <span className={`${styles.rank} ${t.rank <= 2 ? styles.rankTop : ""}`}>
                {t.rank}
                </span>
                <span className={styles.teamName}>{t.name}</span>
                </div>
              </td>
              <td>{t.played}</td>
              <td>{t.wins}</td>
              <td>{t.draws}</td>
              <td>{t.losses}</td>
              <td>{t.goalsFor}:{t.goalsAgainst}</td>
              <td><FormDots form={t.form} /></td>
              <td className={styles.points}>{t.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ height: 16 }} />
    </div>
  );
}