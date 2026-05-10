"use client";

import styles from "./PollCard.module.css";
import type { ApiPoll, ApiPollResults } from "./poll.types";

type PollCardProps = {
  poll: ApiPoll;
  results: ApiPollResults | null;
  selectedOptionId: number | null;
  voting: boolean;
  error: string | null;
  onVote: () => void;
  onSelect: (optionId: number) => void;
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

export default function PollCard({
  poll,
  results,
  selectedOptionId,
  voting,
  error,
  onVote,
  onSelect,
}: PollCardProps) {
  const hasVoted = Boolean(poll.has_voted);
  const showResults = Boolean(results);
  const isVoteDisabled =
    !selectedOptionId || voting || hasVoted || !poll.voting_open;

  const endsAtLabel = formatDateTime(poll.ends_at);

  return (
    <div className={styles.pollCard}>
      <div className={styles.pollCardInner}>
        <div className={styles.pollBody}>
          <div className={styles.pollTopMeta}>
            <span className={styles.pollMiniLabel}>Aktuálna anketa</span>

            {endsAtLabel ? (
              <span className={styles.pollDeadline}>
                Hlasovanie končí {endsAtLabel}
              </span>
            ) : null}
          </div>

          <p className={styles.pollQuestion}>{poll.question}</p>

          {poll.description ? (
            <p className={styles.pollDescription}>{poll.description}</p>
          ) : null}

          {!showResults ? (
            <div className={styles.optionsList}>
              {poll.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`${styles.optionButton} ${
                      isSelected ? styles.optionButtonActive : ""
                    }`}
                    onClick={() => onSelect(option.id)}
                    disabled={hasVoted || !poll.voting_open || voting}
                  >
                    <span className={styles.optionIndicator} />
                    <span className={styles.optionLabel}>{option.text}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.pollResultsList}>
              {results?.options.map((option) => {
                const isSelected = selectedOptionId === option.id;

                return (
                  <div
                    key={option.id}
                    className={`${styles.pollResultItem} ${
                      isSelected ? styles.pollResultItemActive : ""
                    }`}
                  >
                    <div className={styles.pollResultTop}>
                      <span className={styles.pollResultLabel}>{option.text}</span>
                      <span className={styles.pollResultValue}>
                        {option.percent} %
                      </span>
                    </div>

                    <div className={styles.pollResultBar}>
                      <div
                        className={`${styles.pollResultBarFill} ${
                          isSelected ? styles.pollResultBarFillActive : ""
                        }`}
                        style={{ width: `${option.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.pollFooter}>
          {!showResults ? (
            <>
              <button
                type="button"
                className={styles.voteButton}
                onClick={onVote}
                disabled={isVoteDisabled}
              >
                {voting ? "Odosielam..." : "Hlasovať"}
              </button>

              <span className={styles.pollFooterText}>
                Po odoslaní sa zobrazia výsledky hlasovania.
              </span>
            </>
          ) : (
            <>
              <div className={styles.voteSuccess}>
                {hasVoted ? "Ďakujeme za hlas" : "Výsledky hlasovania"}
              </div>

              <span className={styles.pollFooterText}>
                Celkovo hlasov: {results?.total_votes ?? 0}
              </span>
            </>
          )}

          {error ? <span className={styles.pollErrorText}>{error}</span> : null}
        </div>
      </div>
    </div>
  );
}