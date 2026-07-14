import pageStyles from "../../styles/CategoryPage.module.css";
import matchesStyles from "../../styles/CategoryMatches.module.css";
import type { SzfbMatch } from "@/app/lib/szfb";

type RecentMatchesProps = {
  results: SzfbMatch[];
  ownTeamName: string;
};

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

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
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

  if (ownTeamScore >= opponentScore) {
    return {
      scoreClassName: matchesStyles.winScore,
    };
  }

  return {
    scoreClassName: matchesStyles.lossScore,
  };
}

export default function RecentMatches({
  results,
  ownTeamName,
}: RecentMatchesProps) {
  return (
    <section className={matchesStyles.recentMatchesCard}>
      <div className={pageStyles.panelHeader}>
        <h3 className={pageStyles.panelTitle}>Posledné zápasy</h3>
      </div>

      <div className={matchesStyles.recentMatchesList}>
        {results.length > 0 ? (
          results.slice(0, 4).map((match) => {
            const outcome = getMatchOutcome(match, ownTeamName);
            const { homeTeam, awayTeam } = getTeams(match, ownTeamName);
            const { homeScore, awayScore } = getScore(match);

            return (
              <article key={match.id} className={matchesStyles.recentMatchCard}>
                <div className={matchesStyles.recentMatchTop}>
                  <span className={matchesStyles.recentMatchDate}>
                    {formatDate(match.match_date)}
                  </span>
                </div>

                <div className={matchesStyles.recentTeams}>
                  <div className={matchesStyles.recentTeamRow}>
                    <span
                      className={`${matchesStyles.recentTeamName} ${
                        isOwnTeam(homeTeam, ownTeamName) ? matchesStyles.atuTeam : ""
                      }`}
                    >
                      {homeTeam}
                    </span>
                  </div>

                  <div className={matchesStyles.recentVsRow}>vs</div>

                  <div className={matchesStyles.recentTeamRow}>
                    <span
                      className={`${matchesStyles.recentTeamName} ${
                        isOwnTeam(awayTeam, ownTeamName) ? matchesStyles.atuTeam : ""
                      }`}
                    >
                      {awayTeam}
                    </span>
                  </div>
                </div>

                <div className={matchesStyles.recentScoreRow}>
                  <span
                    className={`${matchesStyles.recentScore} ${outcome.scoreClassName}`}
                  >
                    {homeScore}:{awayScore}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <article className={matchesStyles.recentMatchCard}>
            <div className={matchesStyles.recentTeams}>
              <div className={matchesStyles.recentTeamRow}>
                <span className={matchesStyles.recentTeamName}>
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
