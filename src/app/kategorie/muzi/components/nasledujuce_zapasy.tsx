import Image from "next/image";
import matchesStyles from "../../styles/CategoryMatches.module.css";
import type { SzfbMatch } from "@/app/lib/szfb";
import { getTeamLogo } from "@/app/lib/teamLogos";

type NasledujuceZapasyProps = {
  upcomingMatches: SzfbMatch[];
  ownTeamName: string;
  competitionName: string;
  preTitle?: string;
  title?: string;
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
  if (!timeString || timeString.slice(0, 5) === "00:00") {
    return "čas bude doplnený";
  }

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
  const fallback = teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${matchesStyles.featuredMatchTeamLogo} ${
        isAtuLogo ? matchesStyles.featuredMatchTeamLogoAtu : ""
      }`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${teamName} logo`}
          width={56}
          height={56}
        />
      ) : (
        <span aria-label={`Logo tímu ${teamName} nie je dostupné`}>
          {fallback || "?"}
        </span>
      )}
    </div>
  );
}

export default function NasledujuceZapasy({
  upcomingMatches,
  ownTeamName,
  competitionName,
  preTitle = "Zápasy",
  title = "Najbližšie zápasy",
}: NasledujuceZapasyProps) {
  const nextMatches = upcomingMatches.slice(0, 2);

  return (
    <section className={matchesStyles.featuredMatchesSection}>
      <div className={matchesStyles.featuredMatchesHeading}>
        <span className="preTitle">{preTitle}</span>
        <h2 className="sectionTitle">{title}</h2>
      </div>

      {nextMatches.length === 0 ? (
        <div className={matchesStyles.featuredMatchesEmptyState}>
          <div className={matchesStyles.featuredMatchesEmptyIcon}>📅</div>

          <h3 className={matchesStyles.featuredMatchesEmptyTitle}>
            Momentálne nie sú dostupné žiadne najbližšie zápasy
          </h3>

          <p className={matchesStyles.featuredMatchesEmptyText}>
            Program doplníme hneď po zverejnení ďalších stretnutí.
          </p>
        </div>
      ) : (
        <div className={matchesStyles.featuredMatchesGrid}>
          {nextMatches.map((match, index) => {
            const { homeTeam, awayTeam } = getMatchTeams(
              match,
              ownTeamName
            );

            return (
              <article
                key={match.id}
                className={matchesStyles.featuredMatchCard}
              >
                <div className={matchesStyles.featuredMatchCardTop}>
                  <span className={matchesStyles.featuredMatchBadge}>
                    {index === 0 ? "Najbližší zápas" : "Ďalší zápas"}
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

                  <div className={matchesStyles.featuredMatchVsDivider}>
                    VS
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
                    <strong>{formatDate(match.match_date)}</strong> •{" "}
                    {formatTime(match.match_time)}
                  </div>

                  <div className={matchesStyles.featuredMatchPlace}>
                    {match.venue || "Miesto zatiaľ nie je uvedené"}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
