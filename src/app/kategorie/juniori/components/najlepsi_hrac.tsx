import Image from "next/image";
import styles from "../../styles/unified.module.css";

type PlayerStat = {
  label: string;
  value?: string | number | null;
};

type Player = {
  id: number;
  rank: 1 | 2 | 3;
  number?: string | null;
  name?: string | null;
  photoSrc?: string | null;
  stats: PlayerStat[];
};

const placeholderStats: PlayerStat[] = [
  { label: "Góly", value: null },
  { label: "Asistencie", value: null },
  { label: "Body", value: null },
  { label: "Zápasy", value: null },
];

const preparedPlayers: Player[] = [
  {
    id: 1,
    rank: 1,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
  {
    id: 2,
    rank: 2,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
  {
    id: 3,
    rank: 3,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
];

function getPlayerCardClassName(rank: Player["rank"]) {
  const sizeClass =
    rank === 1 ? styles.playerCardMain : styles.playerCardSide;

  const rankClass =
    rank === 1
      ? styles.playerCardRank1
      : rank === 2
        ? styles.playerCardRank2
        : styles.playerCardRank3;

  return `${styles.playerCard} ${sizeClass} ${rankClass}`;
}

function PlayerCard({ player }: { player: Player }) {
  const displayName = player.name?.trim() || "Hráč sezóny";
  const displayNumber = player.number?.trim() || "—";

  return (
    <article className={getPlayerCardClassName(player.rank)}>
      <div className={styles.playerCardTop}>
        <div className={styles.rankBadge}>{player.rank}.</div>
      </div>

      <div className={styles.playerCardBody}>
        <div className={styles.playerContent}>
          <div className={styles.playerHeading}>
            <div className={styles.playerNumber}>{displayNumber}</div>
            <h3 className={styles.playerName}>{displayName}</h3>
          </div>

          <div className={styles.statsGrid}>
            {player.stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value ?? "—"}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.playerPhotoWrap}>
          {player.photoSrc ? (
            <Image
              src={player.photoSrc}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              className={styles.playerPhoto}
            />
          ) : (
            <div className={styles.playerPhotoPlaceholder}>
              <span>FOTO</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SeasonLeadersSection() {
  const firstPlayer = preparedPlayers.find((player) => player.rank === 1);
  const secondPlayer = preparedPlayers.find((player) => player.rank === 2);
  const thirdPlayer = preparedPlayers.find((player) => player.rank === 3);

  if (!firstPlayer || !secondPlayer || !thirdPlayer) {
    return (
      <section className={styles.leadersSection}>
        <div className={styles.leadersEmptyState}>
          Štatistiky lídrov sezóny pripravujeme.
        </div>
      </section>
    );
  }

  return (
    <section className={styles.leadersSection}>
      <div className={styles.leadersContentGrid}>
        <div className={styles.topPlayersPodium}>
          <div className={styles.playerRank2Wrap}>
            <PlayerCard player={secondPlayer} />
          </div>

          <div className={styles.playerRank1Wrap}>
            <PlayerCard player={firstPlayer} />
          </div>

          <div className={styles.playerRank3Wrap}>
            <PlayerCard player={thirdPlayer} />
          </div>
        </div>
      </div>
    </section>
  );
}