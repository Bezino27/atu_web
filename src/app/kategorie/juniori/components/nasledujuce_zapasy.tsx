import React from "react";
import Image from "next/image";
import matchesStyles from "../../styles/CategoryMatches.module.css";
import type { SzfbMatch } from "@/app/lib/szfb";
import { getTeamLogo } from "@/app/lib/teamLogos";

type NasledujuceZapasyProps = {
  upcomingMatches: SzfbMatch[];
  resultMatches: SzfbMatch[];
  ownTeamName: string;
  competitionName: string;
};

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

function TeamLogo({ teamName }: { teamName: string }) {
  const logo = getTeamLogo(teamName);
  const isAtuLogo = logo === "/logo/znak_atu_nove.svg";

  return (
    <div
      className={`${matchesStyles.featuredMatchTeamLogo} ${
        isAtuLogo ? matchesStyles.featuredMatchTeamLogoAtu : ""
      }`}
    >
      {logo ? (
        <Image src={logo} alt={`${teamName} logo`} width={56} height={56} />
      ) : null}
    </div>
  );
}

export default function NasledujuceZapasy({
  upcomingMatches,
  resultMatches,
  ownTeamName,
  competitionName,
}: NasledujuceZapasyProps) {
  const nextMatch = upcomingMatches[0];
  const lastResult = resultMatches[0];
  const hasAnyMatch = nextMatch || lastResult;

  return (
    <section className={matchesStyles.featuredMatchesSection}>
      {!hasAnyMatch ? (
        <div className={matchesStyles.featuredMatchesEmptyState}>
          <div className={matchesStyles.featuredMatchesEmptyIcon}>📅</div>
          <h3 className={matchesStyles.featuredMatchesEmptyTitle}>
            Momentálne nie sú dostupné žiadne zápasy
          </h3>
          <p className={matchesStyles.featuredMatchesEmptyText}>
            Sleduj túto sekciu neskôr, program doplníme hneď po zverejnení
            ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={matchesStyles.featuredMatchesGrid}>
          {nextMatch &&
            (() => {
              const { homeTeam, awayTeam } = getMatchTeams(
                nextMatch,
                ownTeamName
              );

              return (
                <article className={matchesStyles.featuredMatchCard}>
                  <div className={matchesStyles.featuredMatchCardTop}>
                    <span className={matchesStyles.featuredMatchBadge}>
                      Najbližší zápas
                    </span>
                    <span className={matchesStyles.featuredMatchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={matchesStyles.featuredMatchTeamsRow}>
                    <div className={matchesStyles.featuredMatchTeamInfo}>
                      <TeamLogo teamName={homeTeam} />
                      <span className={matchesStyles.featuredMatchTeam}>
                        {homeTeam}
                      </span>
                    </div>

                    <div className={matchesStyles.featuredMatchVsDivider}>VS</div>

                    <div className={matchesStyles.featuredMatchTeamInfo}>
                      <TeamLogo teamName={awayTeam} />
                      <span className={matchesStyles.featuredMatchTeam}>
                        {awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className={matchesStyles.featuredMatchFooter}>
                    <div className={matchesStyles.featuredMatchDateTime}>
                      <strong>{formatDate(nextMatch.match_date)}</strong>
                      {nextMatch.match_time ? (
                        <> • {formatTime(nextMatch.match_time)}</>
                      ) : null}
                    </div>
                    <div className={matchesStyles.featuredMatchPlace}>
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
                <article className={matchesStyles.featuredMatchCard}>
                  <div className={matchesStyles.featuredMatchCardTop}>
                    <span className={matchesStyles.featuredResultBadge}>
                      Posledný výsledok
                    </span>
                    <span className={matchesStyles.featuredMatchLeague}>
                      {competitionName}
                    </span>
                  </div>

                  <div className={matchesStyles.featuredMatchTeamsRow}>
                    <div className={matchesStyles.featuredMatchTeamInfo}>
                      <TeamLogo teamName={homeTeam} />
                      <span className={matchesStyles.featuredMatchTeam}>
                        {homeTeam}
                      </span>
                    </div>

                    <div className={matchesStyles.featuredMatchScoreDivider}>
                      {lastResult.result || "VS"}
                    </div>

                    <div className={matchesStyles.featuredMatchTeamInfo}>
                      <TeamLogo teamName={awayTeam} />
                      <span className={matchesStyles.featuredMatchTeam}>
                        {awayTeam}
                      </span>
                    </div>
                  </div>

                  <div className={matchesStyles.featuredMatchFooter}>
                    <div className={matchesStyles.featuredMatchDateTime}>
                      <strong>{formatDate(lastResult.match_date)}</strong>
                    </div>
                    <div className={matchesStyles.featuredMatchPlace}>
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
