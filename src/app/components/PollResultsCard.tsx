import styles from "./PollCard.module.css";
import type { PreviousPollResult } from "./poll.types";

type PollResultsCardProps = {
  result: PreviousPollResult;
};

export default function PollResultsCard({ result }: PollResultsCardProps) {
  return (
    <div className={styles.pollResultsCard}>
      <div className={styles.pollResultsInner}>
        <div className={styles.pollResultsHeader}>
          <span className={styles.pollMiniLabel}>Posledná anketa</span>
        </div>

        <div className={styles.previousWinnerCard}>
          {result.subtitle ? (
            <span className={styles.previousWinnerSubtitle}>
              {result.subtitle}
            </span>
          ) : null}

          <h4 className={styles.previousWinnerName}>{result.winnerName}</h4>

          <div className={styles.previousWinnerPercent}>
            {result.winnerPercent} %
          </div>

          <div className={styles.previousWinnerBar}>
            <div
              className={styles.previousWinnerBarFill}
              style={{ width: `${result.winnerPercent}%` }}
            />
          </div>
        </div>

        <div className={styles.previousRankingList}>
          {result.ranking.slice(0, 4).map((item, index) => (
            <div key={item.id} className={styles.previousRankingItem}>
              <span className={styles.previousRankingOrder}>{index + 1}.</span>
              <span className={styles.previousRankingName}>{item.label}</span>
              <strong className={styles.previousRankingPercent}>
                {item.percent} %
              </strong>
            </div>
          ))}
        </div>

        <div className={styles.resultsFooterBox}>
          <div className={styles.resultsFooterRow}>
            <span className={styles.resultsFooterLabel}>Celkovo hlasov</span>
            <strong className={styles.resultsFooterValue}>
              {result.totalVotes}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}