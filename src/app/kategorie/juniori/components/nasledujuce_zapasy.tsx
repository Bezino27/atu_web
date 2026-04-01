import React from "react";
import styles from "../../styles/Nasledujuce_zapasy.module.css";
import { getSzfbDashboard, type SzfbMatch } from "@/app/lib/szfb";
import { getTeamLogo } from "@/app/lib/teamLogos";

function formatDate(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(timeString?: string | null) {
  if (!timeString) return "";
  return timeString.slice(0, 5);
}

function getMatchTeams(match: SzfbMatch, ownTeamName: string) {
  if (match.is_home === false) {
    return {
      homeTeam: match.opponent,
      awayTeam: ownTeamName,
    };
  }

  return {
    homeTeam: ownTeamName,
    awayTeam: match.opponent,
  };
}

export default async function NasledujuceZapasy() {
  const szfbDashboard = await getSzfbDashboard(1);

  const upcomingMatches = szfbDashboard?.upcoming ?? [];
  const resultMatches = szfbDashboard?.results ?? [];
  const ownTeamName = szfbDashboard?.watch?.team_name || "FaBK ATU Košice";
  const competitionName =
    szfbDashboard?.watch?.competition_name || "EXTRALIGA MUŽOV";

  const nextMatch = upcomingMatches[0];
  const lastResult = resultMatches[0];

  const hasAnyMatch = nextMatch || lastResult;

  return (
    <section className={styles.matchesSection}>
      {!hasAnyMatch ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <h3 className={styles.emptyTitle}>
            Momentálne nie sú dostupné žiadne zápasy
          </h3>
          <p className={styles.emptyText}>
            Sleduj túto sekciu neskôr, program doplníme hneď po zverejnení
            ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={styles.matchesGrid}>
          {nextMatch &&
            (() => {
              const { homeTeam, awayTeam } = getMatchTeams(
                nextMatch,
                ownTeamName
              );

              return (
                <article className={styles.matchCard}>
                  <div className={styles.cardTop}>
                    <span className={styles.matchBadge}>Najbližší zápas</span>
                    <span className={styles.matchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={styles.matchTeamsRow}>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamLogo}>
                        <img src={getTeamLogo(homeTeam)} alt={homeTeam} />
                      </div>
                      <span className={styles.team}>{homeTeam}</span>
                    </div>

                    <div className={styles.vsDivider}>VS</div>

                    <div className={styles.teamInfo}>
                      <div className={styles.teamLogo}>
                        <img src={getTeamLogo(awayTeam)} alt={awayTeam} />
                      </div>
                      <span className={styles.team}>{awayTeam}</span>
                    </div>
                  </div>

                  <div className={styles.matchFooter}>
                    <div className={styles.matchDateTime}>
                      <strong>{formatDate(nextMatch.match_date)}</strong> •{" "}
                      {formatTime(nextMatch.match_time)}
                    </div>
                    <div className={styles.matchPlace}>
                      {nextMatch.venue || "Miesto zatiaľ nie je uvedené"}
                    </div>
                  </div>
                </article>
              );
            })()}

          {lastResult &&
            (() => {
              const { homeTeam, awayTeam } = getMatchTeams(
                lastResult,
                ownTeamName
              );

              return (
                <article className={styles.matchCard}>
                  <div className={styles.cardTop}>
                    <span className={styles.resultBadge}>Posledný výsledok</span>
                    <span className={styles.matchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={styles.matchTeamsRow}>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamLogo}>
                        <img src={getTeamLogo(homeTeam)} alt={homeTeam} />
                      </div>
                      <span className={styles.team}>{homeTeam}</span>
                    </div>

                    <div className={styles.scoreDivider}>
                      {lastResult.result || "VS"}
                    </div>

                    <div className={styles.teamInfo}>
                      <div className={styles.teamLogo}>
                        <img src={getTeamLogo(awayTeam)} alt={awayTeam} />
                      </div>
                      <span className={styles.team}>{awayTeam}</span>
                    </div>
                  </div>

                  <div className={styles.matchFooter}>
                    <div className={styles.matchDateTime}>
                      <strong>{formatDate(lastResult.match_date)}</strong>
                    </div>
                    <div className={styles.matchPlace}>
                      Posledný odohraný zápas
                    </div>
                  </div>
                </article>
              );
            })()}
        </div>
      )}
    </section>
  );
}