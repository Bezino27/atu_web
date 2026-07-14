import pageStyles from "../../styles/CategoryPage.module.css";
import standingsStyles from "../../styles/CategoryStandings.module.css";
import type { SzfbStandingRow } from "@/app/lib/szfb";

type TabulkaProps = {
  standings: SzfbStandingRow[];
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

function isOwnTeam(teamName: string, ownTeamName: string) {
  const normalizedTeamName = normalizeText(teamName);
  const normalizedOwnTeamName = normalizeText(ownTeamName);

  return (
    normalizedTeamName.includes(normalizedOwnTeamName) ||
    normalizedOwnTeamName.includes(normalizedTeamName) ||
    normalizedTeamName.includes("atu kosice")
  );
}

function getStandingsRowClass(
  position: number,
  teamName: string,
  ownTeamName: string
) {
  const classNames = [];

  if (position <= 8) classNames.push(standingsStyles.playoffRow);
  if (position === 10 || position === 11) classNames.push(standingsStyles.playoutRow);
  if (position === 12) classNames.push(standingsStyles.relegationRow);
  if (isOwnTeam(teamName, ownTeamName)) classNames.push(standingsStyles.highlightRow);

  return classNames.join(" ");
}

export default function Tabulka({ standings, ownTeamName }: TabulkaProps) {
  return (
    <div className={standingsStyles.tablePanel}>
      <div className={pageStyles.panelHeader}>
        <h3 className={pageStyles.panelTitle}>Aktuálna tabuľka</h3>
      </div>

      <div className={standingsStyles.tableWrap}>
        <table className={standingsStyles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tím</th>
              <th>Z</th>
              <th>B</th>
            </tr>
          </thead>
          <tbody>
            {standings.length > 0 ? (
              standings.map((team) => (
                <tr
                  key={team.position}
                  className={getStandingsRowClass(
                    team.position,
                    team.team_name,
                    ownTeamName
                  )}
                >
                  <td>
                    <span className={standingsStyles.positionBadge}>{team.position}</span>
                  </td>
                  <td>
                    <div className={standingsStyles.teamCell}>
                      <span className={standingsStyles.tableTeamName}>{team.team_name}</span>
                    </div>
                  </td>
                  <td>{team.played}</td>
                  <td className={standingsStyles.pointsCell}>{team.points}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Tabuľka zatiaľ nie je dostupná.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
