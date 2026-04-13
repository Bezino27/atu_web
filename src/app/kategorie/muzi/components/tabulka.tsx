import styles from "../../styles/unified.module.css";
import type { SzfbStandingRow } from "@/app/lib/szfb";

type TabulkaProps = {
  standings: SzfbStandingRow[];
  ownTeamName: string;
};

function getStandingsRowClass(
  position: number,
  teamName: string,
  ownTeamName: string
) {
  const classNames = [];

  if (position <= 8) classNames.push(styles.playoffRow);
  if (position === 10 || position === 11) classNames.push(styles.playoutRow);
  if (position === 12) classNames.push(styles.relegationRow);
  if (teamName === ownTeamName) classNames.push(styles.highlightRow);

  return classNames.join(" ");
}

export default function Tabulka({ standings, ownTeamName }: TabulkaProps) {
  return (
    <div className={styles.tablePanel}>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Aktuálna tabuľka</h3>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
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
                    <span className={styles.positionBadge}>{team.position}</span>
                  </td>
                  <td>
                    <div className={styles.teamCell}>
                      <span className={styles.tableTeamName}>{team.team_name}</span>
                    </div>
                  </td>
                  <td>{team.played}</td>
                  <td className={styles.pointsCell}>{team.points}</td>
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