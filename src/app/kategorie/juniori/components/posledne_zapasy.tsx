import styles from "../../styles/unified.module.css";
import type { SzfbMatch } from "@/app/lib/szfb";

type RecentMatchesProps = {
  results: SzfbMatch[];
  ownTeamName: string;
};

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isOwnTeam(team: string, ownTeamName: string) {
  const normalizedTeam = normalizeText(team);
  const normalizedOwnTeam = normalizeText(ownTeamName);

  return (
    normalizedTeam.includes(normalizedOwnTeam) ||
    normalizedOwnTeam.includes(normalizedTeam) ||
    normalizedTeam.includes("atu kosice")
  );
}

function getTeams(match: SzfbMatch, ownTeamName: string) {
  const homeTeam = match.is_home === false ? match.opponent : ownTeamName;
  const awayTeam = match.is_home === false ? ownTeamName : match.opponent;

  return { homeTeam, awayTeam };
}

function getScore(match: SzfbMatch) {
  if (!match.result) {
    return { homeScore: 0, awayScore: 0 };
  }

  const normalized = match.result.replace(/\s+/g, "");
  const parts = normalized.split(":");

  if (parts.length !== 2) {
    return { homeScore: 0, awayScore: 0 };
  }

  const homeScore = Number(parts[0]);
  const awayScore = Number(parts[1]);

  return {
    homeScore: Number.isNaN(homeScore) ? 0 : homeScore,
    awayScore: Number.isNaN(awayScore) ? 0 : awayScore,
  };
}

function getMatchOutcome(match: SzfbMatch, ownTeamName: string) {
  const { homeTeam } = getTeams(match, ownTeamName);
  const { homeScore, awayScore } = getScore(match);

  const ownTeamIsHome = isOwnTeam(homeTeam, ownTeamName);
  const ownTeamScore = ownTeamIsHome ? homeScore : awayScore;
  const opponentScore = ownTeamIsHome ? awayScore : homeScore;

  return {
    scoreClassName:
      ownTeamScore >= opponentScore ? styles.winScore : styles.lossScore,
  };
}

export default function RecentMatches({ results, ownTeamName }: RecentMatchesProps) {
  return (
    <section className={styles.recentMatchesCard}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Posledné zápasy</h2>
        </div>
      </div>

      <div className={styles.recentMatchesList}>
        {results.length > 0 ? (
          results.slice(0, 4).map((match) => {
            const outcome = getMatchOutcome(match, ownTeamName);
            const { homeTeam, awayTeam } = getTeams(match, ownTeamName);
            const { homeScore, awayScore } = getScore(match);

            return (
              <article key={match.id} className={styles.recentMatchCard}>
                <div className={styles.recentMatchTop}>
                  <span className={styles.recentMatchDate}>
                    {formatDate(match.match_date)}
                  </span>
                </div>

                <div className={styles.recentTeams}>
                  <div className={styles.recentTeamRow}>
                    <span
                      className={`${styles.recentTeamName} ${
                        isOwnTeam(homeTeam, ownTeamName) ? styles.atuTeam : ""
                      }`}
                    >
                      {homeTeam}
                    </span>
                  </div>

                  <div className={styles.recentVsRow}>vs</div>

                  <div className={styles.recentTeamRow}>
                    <span
                      className={`${styles.recentTeamName} ${
                        isOwnTeam(awayTeam, ownTeamName) ? styles.atuTeam : ""
                      }`}
                    >
                      {awayTeam}
                    </span>
                  </div>
                </div>

                <div className={styles.recentScoreRow}>
                  <span
                    className={`${styles.recentScore} ${outcome.scoreClassName}`}
                  >
                    {homeScore}:{awayScore}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <article className={styles.recentMatchCard}>
            <div className={styles.recentTeams}>
              <div className={styles.recentTeamRow}>
                <span className={styles.recentTeamName}>
                  Zatiaľ nie sú dostupné posledné výsledky.
                </span>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
