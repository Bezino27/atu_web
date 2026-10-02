import { Fragment } from "react";
import pageStyles from "../../styles/CategoryPage.module.css";
import standingsStyles from "../../styles/CategoryStandings.module.css";
import { getTeamLogo } from "@/app/lib/teamLogos";
import type {
  SzfbStandingRow,
  SzfbStandingZone,
  SzfbStandingZoneKind,
} from "@/app/lib/szfb";

type TabulkaProps = {
  standings: SzfbStandingRow[];
  zones: SzfbStandingZone[];
  ownTeamName: string;
  competitionName: string;
  competitionLogoSrc?: string;
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

function isOwnTeam(teamName: string, ownTeamName: string) {
  const normalizedTeamName = normalizeText(teamName);
  const normalizedOwnTeamName = normalizeText(ownTeamName);

  return (
    normalizedTeamName.includes(normalizedOwnTeamName) ||
    normalizedOwnTeamName.includes(normalizedTeamName) ||
    normalizedTeamName.includes("atu kosice")
  );
}

function getZoneForPosition(position: number, zones: SzfbStandingZone[]) {
  return zones.find(
    (zone) =>
      zone.is_active &&
      position >= zone.start_position &&
      position <= zone.end_position,
  );
}

function getZoneClass(kind: SzfbStandingZoneKind) {
  if (kind === "playoff") return standingsStyles.playoffZone;
  if (kind === "barage") return standingsStyles.barageZone;
  return standingsStyles.relegationZone;
}

function getRangeLabel(zone: SzfbStandingZone) {
  if (zone.start_position === zone.end_position) {
    return `${zone.start_position}. miesto`;
  }

  return `${zone.start_position}. – ${zone.end_position}. miesto`;
}

function getScore(team: SzfbStandingRow) {
  if (team.score) return team.score;

  if (team.goals_for !== null && team.goals_against !== null) {
    return `${team.goals_for}:${team.goals_against}`;
  }

  return "—";
}

function ZoneIcon({ kind }: { kind: SzfbStandingZoneKind }) {
  if (kind === "playoff") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4v1.5A4.5 4.5 0 0 0 8.5 12M17 6h3v1.5A4.5 4.5 0 0 1 15.5 12" />
        <path d="M12 13v4M9 20h6M10 17h4" />
      </svg>
    );
  }

  if (kind === "barage") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3 19 6v5c0 4.2-2.8 7.3-7 9-4.2-1.7-7-4.8-7-9V6l7-3Z" />
        <path d="m9 11 2 2 4-4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 19 6v5c0 4.2-2.8 7.3-7 9-4.2-1.7-7-4.8-7-9V6l7-3Z" />
      <path d="M12 8v7M9.5 12.5 12 15l2.5-2.5" />
    </svg>
  );
}

function TeamLogo({ team }: { team: SzfbStandingRow }) {
  const backendLogo = team.team_brand?.logo_url;
  const fallbackLogo = getTeamLogo(team.team_name);
  const logo = backendLogo || fallbackLogo;
  const isAtuLogo = logo === "/logo/znak_atu_nove.svg";
  const displayName = team.team_brand?.display_name || team.team_name;

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`${standingsStyles.teamLogo} ${
        isAtuLogo ? standingsStyles.teamLogoAtu : ""
      }`}
    >
      {logo ? (
        <img src={logo} alt="" loading="lazy" />
      ) : (
        <span className={standingsStyles.teamLogoFallback} aria-hidden="true">
          {initials || "?"}
        </span>
      )}
    </span>
  );
}

export default function Tabulka({
  standings,
  zones,
  ownTeamName,
  competitionName,
  competitionLogoSrc,
}: TabulkaProps) {
  const activeZones = zones
    .filter((zone) => zone.is_active)
    .sort(
      (a, b) =>
        a.display_order - b.display_order ||
        a.start_position - b.start_position ||
        a.id - b.id,
    );

  return (
    <div className={standingsStyles.tablePanel}>
      <div className={`${pageStyles.panelHeader} ${standingsStyles.tableHeader}`}>
        <h3 className={pageStyles.panelTitle}>Aktuálna tabuľka</h3>

        <div className={standingsStyles.competitionBrand}>
          {competitionLogoSrc ? (
            <img
              src={competitionLogoSrc}
              alt={competitionName}
              className={standingsStyles.competitionLogo}
            />
          ) : (
            <span className={standingsStyles.competitionName}>
              {competitionName}
            </span>
          )}
        </div>
      </div>

      <div className={standingsStyles.tableWrap}>
        <table className={standingsStyles.table}>
          <colgroup>
            <col className={standingsStyles.positionColumn} />
            <col className={standingsStyles.teamColumn} />
            <col className={standingsStyles.playedColumn} />
            <col className={standingsStyles.scoreColumn} />
            <col className={standingsStyles.pointsColumn} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Tím</th>
              <th>Z</th>
              <th>Skóre</th>
              <th>B</th>
            </tr>
          </thead>

          <tbody>
            {standings.length > 0 ? (
              standings.map((team) => {
                const zone = getZoneForPosition(team.position, activeZones);
                const startsZone = zone?.start_position === team.position;
                const endsZone = zone?.end_position === team.position;
                const ownTeam = isOwnTeam(team.team_name, ownTeamName);
                const displayName =
                  team.team_brand?.display_name || team.team_name;
                const zoneClass = zone ? getZoneClass(zone.kind) : "";
                const boundaryClasses = [
                  startsZone ? standingsStyles.zoneStartRow : "",
                  endsZone ? standingsStyles.zoneEndRow : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Fragment key={`${team.team_name}-${team.position}`}>
                    {startsZone && zone ? (
                      <tr className={standingsStyles.zoneHeaderRow}>
                        <td
                          colSpan={5}
                          className={`${standingsStyles.zoneHeaderCell} ${zoneClass}`}
                        >
                          <div className={standingsStyles.zoneHeaderContent}>
                            <span className={standingsStyles.zoneIcon}>
                              <ZoneIcon kind={zone.kind} />
                            </span>
                            <strong>{zone.label}</strong>
                            <span>{getRangeLabel(zone)}</span>
                          </div>
                        </td>
                      </tr>
                    ) : null}

                    {ownTeam ? (
                      <tr className={`${standingsStyles.highlightRow} ${zoneClass} ${boundaryClasses}`}>
                        <td colSpan={5} className={standingsStyles.highlightRowCell}>
                          <div className={standingsStyles.highlightRowGrid}>
                            <div className={standingsStyles.highlightPositionCell}>
                              <span className={standingsStyles.positionBadge}>
                                {team.position}
                              </span>
                            </div>

                            <div className={standingsStyles.teamCell}>
                              <TeamLogo team={team} />
                              <span className={standingsStyles.tableTeamName}>
                                {displayName}
                              </span>
                            </div>

                            <div className={standingsStyles.numericCell}>
                              {team.played}
                            </div>

                            <div className={standingsStyles.scoreCell}>
                              {getScore(team)}
                            </div>

                            <div className={standingsStyles.pointsCell}>
                              {team.points}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr className={`${zoneClass} ${boundaryClasses}`}>
                        <td>
                          <span className={standingsStyles.positionBadge}>
                            {team.position}
                          </span>
                        </td>

                        <td>
                          <div className={standingsStyles.teamCell}>
                            <TeamLogo team={team} />
                            <span className={standingsStyles.tableTeamName}>
                              {displayName}
                            </span>
                          </div>
                        </td>

                        <td className={standingsStyles.numericCell}>
                          {team.played}
                        </td>

                        <td className={standingsStyles.scoreCell}>
                          {getScore(team)}
                        </td>

                        <td className={standingsStyles.pointsCell}>
                          {team.points}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>Tabuľka zatiaľ nie je dostupná.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeZones.length > 0 ? (
        <div className={standingsStyles.zoneLegend}>
          {activeZones.map((zone) => (
            <div key={zone.id} className={standingsStyles.zoneLegendItem}>
              <span
                className={`${standingsStyles.zoneLegendDot} ${getZoneClass(
                  zone.kind,
                )}`}
              />
              <span>{zone.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
