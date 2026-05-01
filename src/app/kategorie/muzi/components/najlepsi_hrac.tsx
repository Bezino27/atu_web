import styles from "../../styles/unified.module.css";

type PlayerStat = {
  label: string;
  value: string | number;
};

type Player = {
  id: number;
  rank: 1 | 2 | 3;
  number: string;
  name: string;
  stats: PlayerStat[];
};



const topPlayers: Player[] = [
  {
    id: 1,
    rank: 1,
    number: "91",
    name: "Martin Novák",
    stats: [
      { label: "Góly", value: 28 },
      { label: "Asistencie", value: 17 },
      { label: "Body", value: 45 },
      { label: "Zápasy", value: 22 },
    ],
  },
  {
    id: 2,
    rank: 2,
    number: "14",
    name: "Jakub Kováč",
    stats: [
      { label: "Góly", value: 19 },
      { label: "Asistencie", value: 20 },
      { label: "Body", value: 39 },
      { label: "Zápasy", value: 23 },
    ],
  },
  {
    id: 3,
    rank: 3,
    number: "7",
    name: "Samuel Hric",
    stats: [
      { label: "Góly", value: 16 },
      { label: "Asistencie", value: 14 },
      { label: "Body", value: 30 },
      { label: "Zápasy", value: 21 },
    ],
  },
];


function PlayerCard({ player }: { player: Player }) {
  const sizeClass =
    player.rank === 1 ? styles.playerCardMain : styles.playerCardSide;

  return (
    <article
      className={`${styles.playerCard} ${styles[`playerCardRank${player.rank}`]} ${sizeClass}`}
    >
      <div className={styles.playerCardTop}>
        <div className={styles.rankBadge}>{player.rank}.</div>
        <div className={styles.playerNumber}>{player.number}</div>
      </div>

      <div className={styles.playerContent}>
        <h3 className={styles.playerName}>{player.name}</h3>

        <div className={styles.statsGrid}>
          {player.stats.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}


export default function SeasonLeadersSection() {
  return (
    <section className={styles.leadersSection}>
      <div className={styles.leadersContentGrid}>
        <div className={styles.topPlayersPodium}>
          {topPlayers.map((player) => (
            <div
              key={player.id}
              className={styles[`playerRank${player.rank}Wrap`]}
            >
              <PlayerCard player={player} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
