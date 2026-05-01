import styles from "../../styles/unified.module.css";
import { getSzfbDashboard, type SzfbMatch } from "@/app/lib/szfb";

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

function isAtuTeam(team: string) {
  return team.toLowerCase().includes("atu košice");
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

  const atuIsHome = isAtuTeam(homeTeam);
  const atuScore = atuIsHome ? homeScore : awayScore;
  const opponentScore = atuIsHome ? awayScore : homeScore;

  return {
    scoreClassName:
      atuScore > opponentScore ? styles.winScore : styles.lossScore,
  };
}

export default async function RecentMatches() {
  const szfbDashboard = await getSzfbDashboard(1);

  const results: SzfbMatch[] = szfbDashboard?.results ?? [];
  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";

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
                        isAtuTeam(homeTeam) ? styles.atuTeam : ""
                      }`}
                    >
                      {homeTeam}
                    </span>
                  </div>

                  <div className={styles.recentVsRow}>vs</div>

                  <div className={styles.recentTeamRow}>
                    <span
                      className={`${styles.recentTeamName} ${
                        isAtuTeam(awayTeam) ? styles.atuTeam : ""
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