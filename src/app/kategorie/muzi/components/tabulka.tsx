import styles from "../page.module.css";
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

function getPlacementLabel(position: number) {
  if (position <= 8) return "Playoff";
  if (position === 10 || position === 11) return "Baráž";
  if (position === 12) return "Zostup";
  return null;
}

export default function Tabulka({
  standings,
  ownTeamName,
}: TabulkaProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Liga</span>
          <h3>Aktuálna tabuľka</h3>
        </div>

        <div className={styles.legend}>
          <span className={`${styles.legendItem} ${styles.legendPlayoff}`}>
            Playoff
          </span>
          <span className={`${styles.legendItem} ${styles.legendBarage}`}>
            Baráž
          </span>
          <span className={`${styles.legendItem} ${styles.legendDrop}`}>
            Zostup
          </span>
        </div>
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
              standings.map((team) => {
                const label = getPlacementLabel(team.position);

                return (
                  <tr
                    key={team.position}
                    className={getStandingsRowClass(
                      team.position,
                      team.team_name,
                      ownTeamName
                    )}
                  >
                    <td>
                      <span className={styles.positionBadge}>
                        {team.position}
                      </span>
                    </td>
                    <td>
                      <div className={styles.teamCell}>
                        <span className={styles.teamName}>
                          {team.team_name}
                        </span>

                        {label && (
                          <span
                            className={
                              label === "Playoff"
                                ? styles.rowTag
                                : label === "Baráž"
                                ? styles.rowTagWarning
                                : styles.rowTagDanger
                            }
                          >
                            {label}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{team.played}</td>
                    <td className={styles.pointsCell}>{team.points}</td>
                  </tr>
                );
              })
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