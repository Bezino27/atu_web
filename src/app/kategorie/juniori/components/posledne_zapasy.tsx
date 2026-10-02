import matchesStyles from "../../styles/CategoryMatches.module.css";
import { getTeamLogo } from "@/app/lib/teamLogos";
import type {
  SzfbFormCode,
  SzfbMatch,
  SzfbTeamBrand,
} from "@/app/lib/szfb";

type RecentMatchesProps = {
  results: SzfbMatch[];
  form: SzfbFormCode[];
  ownTeamName: string;
  ownTeamBrand: SzfbTeamBrand | null;
  competitionName: string;
  competitionLogoSrc?: string;
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

function formatFormDate(dateString?: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

function parseScore(result: string) {
  const normalized = result.replace(/\s+/g, "");
  const match = normalized.match(/^(\d+):(\d+)$/);

  if (!match) return null;

  return {
    home: Number(match[1]),
    away: Number(match[2]),
  };
}

function getTeams(
  match: SzfbMatch,
  ownTeamName: string,
  ownTeamBrand: SzfbTeamBrand | null,
) {
  const ownDisplayName = ownTeamBrand?.display_name || ownTeamName;
  const opponentDisplayName =
    match.opponent_brand?.display_name || match.opponent;

  if (match.is_home === false) {
    return {
      homeTeam: opponentDisplayName,
      awayTeam: ownDisplayName,
      homeBrand: match.opponent_brand,
      awayBrand: ownTeamBrand,
    };
  }

  return {
    homeTeam: ownDisplayName,
    awayTeam: opponentDisplayName,
    homeBrand: ownTeamBrand,
    awayBrand: match.opponent_brand,
  };
}

function getResultCode(match: SzfbMatch): SzfbFormCode | null {
  const score = parseScore(match.result);

  if (!score || match.is_home === null) return null;

  const ownScore = match.is_home ? score.home : score.away;
  const opponentScore = match.is_home ? score.away : score.home;
  const won = ownScore > opponentScore;

  if (match.decision_type === "overtime") {
    return won ? "VP" : "PP";
  }

  if (match.decision_type === "shootout") {
    return won ? "VN" : "PN";
  }

  return won ? "V" : "P";
}

function isWinCode(code: SzfbFormCode) {
  return code.startsWith("V");
}

function getScoreSuffix(code?: SzfbFormCode | null) {
  if (code === "VP" || code === "PP" || code === "VN" || code === "PN") {
    return code;
  }

  return null;
}

function getBrandLogo(teamName: string, brand: SzfbTeamBrand | null) {
  return brand?.logo_url || getTeamLogo(teamName);
}

function TeamLogo({
  teamName,
  brand,
  large = false,
  small = false,
}: {
  teamName: string;
  brand: SzfbTeamBrand | null;
  large?: boolean;
  small?: boolean;
}) {
  const logo = getBrandLogo(teamName, brand);
  const isAtuLogo = logo === "/logo/znak_atu_nove.svg";
  const initials = teamName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`${matchesStyles.resultTeamLogo} ${
        large ? matchesStyles.resultTeamLogoLarge : ""
      } ${small ? matchesStyles.resultTeamLogoSmall : ""} ${
        isAtuLogo ? matchesStyles.resultTeamLogoAtu : ""
      }`}
    >
      {logo ? (
        <img src={logo} alt="" />
      ) : (
        <span className={matchesStyles.resultTeamLogoFallback} aria-hidden="true">
          {initials || "?"}
        </span>
      )}
    </span>
  );
}

function Score({
  result,
  resultCode,
  compact = false,
}: {
  result: string;
  resultCode?: SzfbFormCode | null;
  compact?: boolean;
}) {
  const score = parseScore(result);
  const suffix = getScoreSuffix(resultCode);

  if (!score) {
    return <span>—</span>;
  }

  return (
    <span
      className={`${matchesStyles.scoreDisplay} ${
        compact ? matchesStyles.scoreDisplayCompact : ""
      }`}
    >
      <span>{score.home}</span>
      <span
        className={`${matchesStyles.scoreColon} ${
          resultCode && isWinCode(resultCode)
            ? matchesStyles.scoreColonWin
            : matchesStyles.scoreColonLoss
        }`}
      >
        :
      </span>
      <span>{score.away}</span>
      {suffix ? (
        <small
          className={matchesStyles.scoreSuffix}
          title={getResultTitle(suffix)}
          aria-label={getResultTitle(suffix)}
        >
          {suffix}
        </small>
      ) : null}
    </span>
  );
}

function getResultBadgeClass(code: SzfbFormCode) {
  return isWinCode(code)
    ? matchesStyles.resultBadgeWin
    : matchesStyles.resultBadgeLoss;
}

function getResultTitle(code: SzfbFormCode) {
  if (code === "VP") return "Výhra po predĺžení";
  if (code === "VN") return "Výhra po nájazdoch";
  if (code === "PP") return "Prehra po predĺžení";
  if (code === "PN") return "Prehra po nájazdoch";
  if (code === "V") return "Výhra";
  return "Prehra";
}

export default function RecentMatches({
  results,
  form,
  ownTeamName,
  ownTeamBrand,
  competitionName,
  competitionLogoSrc,
}: RecentMatchesProps) {
  const finishedResults = results
    .filter(
      (match) =>
        match.match_type === "finished" &&
        /^\d+\s*:\s*\d+$/.test(match.result),
    )
    .slice(0, 5);

  const latestMatch = finishedResults[0] ?? null;
  const otherResults = finishedResults.slice(1, 5);
  const latestTeams = latestMatch
    ? getTeams(latestMatch, ownTeamName, ownTeamBrand)
    : null;

  const formCodes =
    form.length > 0
      ? form.slice(0, 5)
      : finishedResults
          .map((match) => getResultCode(match))
          .filter((code): code is SzfbFormCode => Boolean(code))
          .slice(0, 5);
  const formEntries = formCodes
    .map((code, index) => ({
      code,
      date: finishedResults[index]?.match_date ?? null,
    }))
    .reverse();

  return (
    <div className={matchesStyles.resultsColumn}>
      <section className={matchesStyles.latestMatchPanel}>
        <h3 className={matchesStyles.resultsPanelTitle}>Posledný zápas</h3>

        {latestMatch && latestTeams ? (
          <div className={matchesStyles.latestMatchCardInner}>
            <div className={matchesStyles.latestMatchMeta}>
              <span>{formatDate(latestMatch.match_date)}</span>
              <span className={matchesStyles.latestMatchMetaDivider} />
              {competitionLogoSrc ? (
                <img
                  src={competitionLogoSrc}
                  alt={competitionName}
                  className={matchesStyles.latestMatchCompetitionLogo}
                />
              ) : (
                  <span className={matchesStyles.latestCompetitionText}>
                    {competitionName}
                  </span>
              )}
            </div>

            <div className={matchesStyles.latestMatchTeams}>
              <div className={matchesStyles.latestMatchTeam}>
                <TeamLogo
                  teamName={latestTeams.homeTeam}
                  brand={latestTeams.homeBrand}
                  large
                />
                <strong>{latestTeams.homeTeam}</strong>
              </div>

              <div className={matchesStyles.latestScoreBlock}>
                <div className={matchesStyles.latestScoreVisual}>
                  <img
                    src="/logo/ATU_logo_black_transp.svg"
                    alt=""
                    className={matchesStyles.latestCompetitionBackdrop}
                    aria-hidden="true"
                  />
                  <Score
                    result={latestMatch.result}
                    resultCode={getResultCode(latestMatch)}
                  />
                </div>
                <span className={matchesStyles.finalResultLabel}>
                  Konečný výsledok
                </span>
              </div>

              <div className={matchesStyles.latestMatchTeam}>
                <TeamLogo
                  teamName={latestTeams.awayTeam}
                  brand={latestTeams.awayBrand}
                  large
                />
                <strong>{latestTeams.awayTeam}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className={matchesStyles.resultsEmptyState}>
            Zatiaľ nie je dostupný posledný výsledok.
          </div>
        )}
      </section>

      <section className={matchesStyles.formPanel}>
        <div className={matchesStyles.formPanelHeader}>
          <div>
            <h3 className={matchesStyles.resultsPanelTitle}>Forma</h3>
            <p className={matchesStyles.formSubtitle}>Posledných 5 zápasov</p>
          </div>

        </div>

        <div className={matchesStyles.formTrack}>
          <div className={matchesStyles.formBadges}>
            {formEntries.length > 0 ? (
              formEntries.map(({ code, date }, index) => (
                <div
                  key={`${code}-${index}`}
                  className={matchesStyles.formResult}
                >
                  <span
                    className={`${matchesStyles.formBadge} ${getResultBadgeClass(
                      code,
                    )}`}
                    title={getResultTitle(code)}
                  >
                    {code}
                  </span>
                  <span className={matchesStyles.formResultDate}>
                    {formatFormDate(date)}
                  </span>
                </div>
              ))
            ) : (
              <span className={matchesStyles.formUnavailable}>—</span>
            )}
          </div>
          <div className={matchesStyles.formTrackEndpoints}>
            <span>Najstarší</span>
            <span>Najnovší</span>
          </div>
        </div>
      </section>

      <section className={matchesStyles.recentMatchesPanel}>
        <div className={matchesStyles.recentMatchesHeader}>
          <h3 className={matchesStyles.resultsPanelTitle}>Posledné zápasy</h3>
          <span className={matchesStyles.recentLeagueBadge}>
            {competitionLogoSrc ? (
              <img src={competitionLogoSrc} alt={competitionName} />
            ) : (
              competitionName
            )}
          </span>
        </div>

        {otherResults.length > 0 ? (
          <div className={matchesStyles.recentMatchesRows}>
            {otherResults.map((match) => {
              const teams = getTeams(match, ownTeamName, ownTeamBrand);
              const code = getResultCode(match);

              return (
                <article key={match.id} className={matchesStyles.recentMatchRow}>
                  <span className={matchesStyles.recentMatchDate}>
                    {formatDate(match.match_date)}
                  </span>

                  <div className={matchesStyles.recentMatchTeams}>
                    <div className={matchesStyles.recentMatchTeamLine}>
                      <TeamLogo
                        teamName={teams.homeTeam}
                        brand={teams.homeBrand}
                        small
                      />
                      <strong>{teams.homeTeam}</strong>
                    </div>
                    <div className={matchesStyles.recentMatchTeamLine}>
                      <TeamLogo
                        teamName={teams.awayTeam}
                        brand={teams.awayBrand}
                        small
                      />
                      <span>vs {teams.awayTeam}</span>
                    </div>
                  </div>

                  <Score result={match.result} resultCode={code} compact />

                  {code ? (
                    <span
                      className={`${matchesStyles.resultBadge} ${matchesStyles.resultBadgeSmall} ${getResultBadgeClass(
                        code,
                      )}`}
                      title={getResultTitle(code)}
                    >
                      {code}
                    </span>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className={matchesStyles.resultsEmptyState}>
            Ďalšie výsledky zatiaľ nie sú dostupné.
          </div>
        )}
      </section>
    </div>
  );
}
