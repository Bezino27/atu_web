import styles from "../../styles/unified.module.css";

type PlayerStat = {
  label: string;
  value: string | number;
};

type Player = {
  id: number;
  rank?: 1 | 2 | 3;
  number: string;
  name: string;
  stats: PlayerStat[];
};

type PenalizedPlayer = {
  id: number;
  number: string;
  name: string;
  penaltyMinutes: number;
  matches: number;
  stats?: PlayerStat[];
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

const mostPenalizedPlayer: PenalizedPlayer = {
  id: 4,
  number: "27",
  name: "Tomáš Varga",
  penaltyMinutes: 34,
  matches: 18,
  stats: [
    { label: "Trestné min.", value: 34 },
    { label: "Zápasy", value: 18 },
    { label: "Priemer", value: "1.9 / zápas" },
  ],
};

function PlayerCard({ player }: { player: Player }) {
  const isMain = player.rank === 1;

  return (
    <article
      className={`${styles.playerCard} ${
        isMain ? styles.playerCardMain : styles.playerCardSmall
      }`}
    >
      <div className={styles.playerCardTop}>
        <div className={styles.rankBadge}>#{player.rank}</div>
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

function PenalizedCard({ player }: { player: PenalizedPlayer }) {
  return (
    <article className={styles.penaltyCard}>
      <div className={styles.penaltyHeader}>
        <div>
          <span className={styles.penaltyEyebrow}>Najvylučovanejší hráč</span>
          <h3 className={styles.penaltyName}>
            #{player.number} {player.name}
          </h3>
        </div>

        <div className={styles.penaltyHighlight}>
          <span className={styles.penaltyHighlightValue}>{player.penaltyMinutes}</span>
          <span className={styles.penaltyHighlightLabel}>trestných minút</span>
        </div>
      </div>

      <div className={styles.penaltyStats}>
        {(player.stats ?? []).map((stat) => (
          <div key={stat.label} className={styles.penaltyStatItem}>
            <span className={styles.penaltyStatValue}>{stat.value}</span>
            <span className={styles.penaltyStatLabel}>{stat.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function SeasonLeadersSection() {
  const [firstPlayer, secondPlayer, thirdPlayer] = topPlayers;

  return (
    <section className={styles.leadersSection}>
      <div className={styles.leadersContentGrid}>
        <div className={styles.topPlayersLayout}>
          <div className={styles.mainPlayerWrap}>
            <PlayerCard player={firstPlayer} />
          </div>

          <div className={styles.sidePlayersWrap}>
            <PlayerCard player={secondPlayer} />
            <PlayerCard player={thirdPlayer} />
          </div>
        </div>

        <PenalizedCard player={mostPenalizedPlayer} />
      </div>
    </section>
  );
}
