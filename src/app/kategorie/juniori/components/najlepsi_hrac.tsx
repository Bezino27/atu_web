import Image from "next/image";
import leadersStyles from "../../styles/CategoryLeaders.module.css";
import type { SzfbPlayerStat } from "@/app/lib/szfb";

type PlayerStat = {
  label: string;
  value?: string | number | null;
};

type Player = {
  id: number;
  rank: 1 | 2 | 3;
  displayRank?: number | null;
  number?: string | null;
  name?: string | null;
  photoSrc?: string | null;
  stats: PlayerStat[];
};

type SeasonLeadersSectionProps = {
  players?: SzfbPlayerStat[];
};

const placeholderStats: PlayerStat[] = [
  { label: "Góly", value: null },
  { label: "Asist.", value: null },
  { label: "Body", value: null },
  { label: "Zápasy", value: null },
];

const placeholderPlayers: Player[] = [
  {
    id: 1,
    rank: 1,
    displayRank: 1,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
  {
    id: 2,
    rank: 2,
    displayRank: 2,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
  {
    id: 3,
    rank: 3,
    displayRank: 3,
    number: null,
    name: null,
    photoSrc: null,
    stats: placeholderStats,
  },
];

function getPlayerCardClassName(rank: Player["rank"]) {
  const sizeClass = rank === 1 ? leadersStyles.playerCardMain : leadersStyles.playerCardSide;

  const rankClass =
    rank === 1
      ? leadersStyles.playerCardRank1
      : rank === 2
        ? leadersStyles.playerCardRank2
        : leadersStyles.playerCardRank3;

  return `${leadersStyles.playerCard} ${sizeClass} ${rankClass}`;
}

function formatStatValue(value?: number | null) {
  return typeof value === "number" ? value : null;
}

function getPlayerNumber(player: SzfbPlayerStat) {
  if (typeof player.jersey_number !== "number") {
    return null;
  }

  return String(player.jersey_number);
}

function getPlayerPhotoSrc(player: SzfbPlayerStat) {
  return player.photo_url || player.photo || null;
}

function mapBackendPlayers(players: SzfbPlayerStat[] = []): Player[] {
  const activePlayers = players.filter((player) => player.is_active !== false);
  const topPlayers = activePlayers.slice(0, 3);

  if (topPlayers.length === 0) {
    return placeholderPlayers;
  }

  const mappedPlayers = topPlayers.map((player, index) => ({
    id: player.id,
    rank: (index + 1) as 1 | 2 | 3,
    displayRank: player.rank,
    number: getPlayerNumber(player),
    name: player.player_name || null,
    photoSrc: getPlayerPhotoSrc(player),
    stats: [
      { label: "Góly", value: formatStatValue(player.goals) },
      { label: "Asist.", value: formatStatValue(player.assists) },
      { label: "Body", value: formatStatValue(player.points) },
      { label: "Zápasy", value: formatStatValue(player.games) },
    ],
  }));

  if (mappedPlayers.length === 3) {
    return mappedPlayers;
  }

  return [
    ...mappedPlayers,
    ...placeholderPlayers.slice(mappedPlayers.length),
  ];
}

function PlayerCard({ player }: { player: Player }) {
  const displayName = player.name?.trim() || "Najproduktívnejší hráč";
  const displayNumber = player.number?.trim() || "—";

  return (
    <article className={getPlayerCardClassName(player.rank)}>
      <div className={leadersStyles.playerCardTop}>
        <div className={leadersStyles.rankBadge}>
          {player.displayRank ?? player.rank}.
        </div>

        <div className={leadersStyles.playerNumber}>{displayNumber}</div>
      </div>

      <div className={leadersStyles.playerCardBody}>
        <div className={leadersStyles.playerContent}>
          <div className={leadersStyles.playerHeading}>
            <h3 className={leadersStyles.playerName}>{displayName}</h3>
          </div>

          <div className={leadersStyles.statsGrid}>
            {player.stats.map((stat) => (
              <div key={stat.label} className={leadersStyles.statItem}>
                <span className={leadersStyles.statValue}>{stat.value ?? "—"}</span>
                <span className={leadersStyles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={leadersStyles.playerPhotoWrap}>
          {player.photoSrc ? (
            <Image
              src={player.photoSrc}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 100vw, 260px"
              className={leadersStyles.playerPhoto}
            />
          ) : (
            <div className={leadersStyles.playerPhotoPlaceholder}>
              <Image
                src="/logo/znak_atu_nove.svg"
                alt=""
                width={118}
                height={118}
                className={leadersStyles.playerPhotoLogo}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function SeasonLeadersSection({
  players = [],
}: SeasonLeadersSectionProps) {
  const preparedPlayers = mapBackendPlayers(players);

  const firstPlayer = preparedPlayers.find((player) => player.rank === 1);
  const secondPlayer = preparedPlayers.find((player) => player.rank === 2);
  const thirdPlayer = preparedPlayers.find((player) => player.rank === 3);

  if (!firstPlayer || !secondPlayer || !thirdPlayer) {
    return (
      <section className={leadersStyles.leadersSection}>
        <div className={leadersStyles.leadersEmptyState}>
          Štatistiky lídrov sezóny pripravujeme.
        </div>
      </section>
    );
  }

  return (
    <section className={leadersStyles.leadersSection}>
      <div className={leadersStyles.leadersContentGrid}>
        <div className={leadersStyles.topPlayersPodium}>
          <div className={leadersStyles.playerRank2Wrap}>
            <PlayerCard player={secondPlayer} />
          </div>

          <div className={leadersStyles.playerRank1Wrap}>
            <PlayerCard player={firstPlayer} />
          </div>

          <div className={leadersStyles.playerRank3Wrap}>
            <PlayerCard player={thirdPlayer} />
          </div>
        </div>
      </div>
    </section>
  );
}
