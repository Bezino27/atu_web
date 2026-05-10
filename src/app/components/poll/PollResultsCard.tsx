"use client";

import styles from "./PollCard.module.css";
import type { ApiPollResults } from "./poll.types";

type PollResultsCardProps = {
  result: ApiPollResults;
};

function formatDateTime(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function PollResultsCard({ result }: PollResultsCardProps) {
  const sortedOptions = [...result.options].sort((a, b) => b.votes - a.votes);
  const winner = sortedOptions[0] ?? null;
  const endedAtLabel = formatDateTime(result.ends_at);

  return (
    <div className={styles.pollResultsCard}>
      <div className={styles.pollResultsInner}>
        <div className={styles.pollResultsBody}>
          <div className={styles.pollTopMeta}>
            <span className={styles.pollMiniLabel}>Posledná anketa</span>

            {endedAtLabel ? (
              <span className={styles.pollDeadline}>
                Ukončená {endedAtLabel}
              </span>
            ) : null}
          </div>

          <div className={styles.pollResultsHeader}>
            <h3 className={styles.pollResultsTitle}>{result.question}</h3>

            {result.description ? (
              <p className={styles.pollDescription}>{result.description}</p>
            ) : null}
          </div>

          {winner ? (
            <div className={styles.previousWinnerCard}>
              <span className={styles.previousWinnerSubtitle}>
                Víťaz hlasovania
              </span>

              <div className={styles.previousWinnerMainRow}>
                <h4 className={styles.previousWinnerName}>{winner.text}</h4>

                <div className={styles.previousWinnerNumbers}>
                  <span className={styles.previousWinnerPercent}>
                    {winner.percent} %
                  </span>
                  <span className={styles.previousWinnerVotes}>
                    {winner.votes} hlasov
                  </span>
                </div>
              </div>

              <div className={styles.previousWinnerBar}>
                <div
                  className={styles.previousWinnerBarFill}
                  style={{ width: `${winner.percent}%` }}
                />
              </div>
            </div>
          ) : null}

          <div className={styles.previousRankingList}>
            {sortedOptions.slice(1, 3).map((item, index) => (
              <div key={item.id} className={styles.previousRankingItem}>
                <span className={styles.previousRankingOrder}>{index + 2}.</span>
                <span className={styles.previousRankingName}>{item.text}</span>
                <span className={styles.previousRankingPercent}>
                  {item.percent} %
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.pollFooter}>
          <div className={styles.voteSuccess}>Výsledok poslednej ankety</div>

          <span className={styles.pollFooterText}>
            Celkovo hlasov: {result.total_votes}
          </span>
        </div>
      </div>
    </div>
  );
}
