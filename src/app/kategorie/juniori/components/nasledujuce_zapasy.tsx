import React from "react";
import Image from "next/image";
import styles from "../../styles/unified.module.css";
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
    <section className={styles.featuredMatchesSection}>
      {!hasAnyMatch ? (
        <div className={styles.featuredMatchesEmptyState}>
          <div className={styles.featuredMatchesEmptyIcon}>📅</div>
          <h3 className={styles.featuredMatchesEmptyTitle}>
            Momentálne nie sú dostupné žiadne zápasy
          </h3>
          <p className={styles.featuredMatchesEmptyText}>
            Sleduj túto sekciu neskôr, program doplníme hneď po zverejnení
            ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={styles.featuredMatchesGrid}>
          {nextMatch &&
            (() => {
              const { homeTeam, awayTeam } = getMatchTeams(
                nextMatch,
                ownTeamName
              );

              return (
                <article className={styles.featuredMatchCard}>
                  <div className={styles.featuredMatchCardTop}>
                    <span className={styles.featuredMatchBadge}>
                      Najbližší zápas
                    </span>
                    <span className={styles.featuredMatchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={styles.featuredMatchTeamsRow}>
                    <div className={styles.featuredMatchTeamInfo}>
                      <div className={styles.featuredMatchTeamLogo}>
                        <Image
                          src={getTeamLogo(homeTeam)}
                          alt={homeTeam}
                          width={56}
                          height={56}
                        />
                      </div>
                      <span className={styles.featuredMatchTeam}>
                        {homeTeam}
                      </span>
                    </div>

                    <div className={styles.featuredMatchVsDivider}>VS</div>

                    <div className={styles.featuredMatchTeamInfo}>
                      <div className={styles.featuredMatchTeamLogo}>
                        <Image
                          src={getTeamLogo(awayTeam)}
                          alt={awayTeam}
                          width={56}
                          height={56}
                        />
                      </div>
                      <span className={styles.featuredMatchTeam}>
                        {awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className={styles.featuredMatchFooter}>
                    <div className={styles.featuredMatchDateTime}>
                      <strong>{formatDate(nextMatch.match_date)}</strong> •{" "}
                      {formatTime(nextMatch.match_time)}
                    </div>
                    <div className={styles.featuredMatchPlace}>
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
                <article className={styles.featuredMatchCard}>
                  <div className={styles.featuredMatchCardTop}>
                    <span className={styles.featuredResultBadge}>
                      Posledný výsledok
                    </span>
                    <span className={styles.featuredMatchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={styles.featuredMatchTeamsRow}>
                    <div className={styles.featuredMatchTeamInfo}>
                      <div className={styles.featuredMatchTeamLogo}>
                        <Image
                          src={getTeamLogo(homeTeam)}
                          alt={homeTeam}
                          width={56}
                          height={56}
                        />
                      </div>
                      <span className={styles.featuredMatchTeam}>
                        {homeTeam}
                      </span>
                    </div>

                    <div className={styles.featuredMatchScoreDivider}>
                      {lastResult.result || "VS"}
                    </div>

                    <div className={styles.featuredMatchTeamInfo}>
                      <div className={styles.featuredMatchTeamLogo}>
                        <Image
                          src={getTeamLogo(awayTeam)}
                          alt={awayTeam}
                          width={56}
                          height={56}
                        />
                      </div>
                      <span className={styles.featuredMatchTeam}>
                        {awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className={styles.featuredMatchFooter}>
                    <div className={styles.featuredMatchDateTime}>
                      <strong>{formatDate(lastResult.match_date)}</strong>
                    </div>
                    <div className={styles.featuredMatchPlace}>
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