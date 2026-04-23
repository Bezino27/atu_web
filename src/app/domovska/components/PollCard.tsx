"use client";

import { useMemo } from "react";
import styles from "./PollCard.module.css";
import type { PollData } from "./poll.types";

type PollCardProps = {
  poll: PollData;
  onVote: (optionId: string) => void;
  onSelect: (optionId: string) => void;
  selectedOptionId: string | null;
  hasVoted: boolean;
};

export default function PollCard({
  poll,
  onVote,
  onSelect,
  selectedOptionId,
  hasVoted,
}: PollCardProps) {
  const selectedOption =
    poll.options.find((option) => option.id === selectedOptionId) ?? null;

  const totalVotes = useMemo(() => {
    if (typeof poll.totalVotes === "number") return poll.totalVotes;

    return poll.options.reduce((sum, option) => sum + option.votes, 0);
  }, [poll]);

  const optionsWithPercentages = useMemo(() => {
    return poll.options.map((option) => {
      const percentage =
        totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

      return {
        ...option,
        percentage,
      };
    });
  }, [poll.options, totalVotes]);

  const handleVote = () => {
    if (!selectedOptionId || hasVoted) return;
    onVote(selectedOptionId);
  };

  return (
    <div className={styles.pollCard}>
      <div className={styles.pollCardInner}>
        <div className={styles.pollBody}>
          <div className={styles.pollTopMeta}>
            <span className={styles.pollMiniLabel}>Otázka dňa</span>

            {poll.endsAt ? (
              <span className={styles.pollDeadline}>
                Hlasovanie končí {poll.endsAt}
              </span>
            ) : null}
          </div>

          <p className={styles.pollQuestion}>{poll.question}</p>

          {poll.description ? (
            <p className={styles.pollDescription}>{poll.description}</p>
          ) : null}

          {!hasVoted ? (
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
                    disabled={hasVoted}
                  >
                    <span className={styles.optionIndicator} />
                    <span className={styles.optionLabel}>{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className={styles.pollResultsList}>
              {optionsWithPercentages.map((option) => {
                const isSelected = selectedOptionId === option.id;

                return (
                  <div
                    key={option.id}
                    className={`${styles.pollResultItem} ${
                      isSelected ? styles.pollResultItemActive : ""
                    }`}
                  >
                    <div className={styles.pollResultTop}>
                      <span className={styles.pollResultLabel}>
                        {option.label}
                      </span>
                      <span className={styles.pollResultValue}>
                        {option.percentage} %
                      </span>
                    </div>

                    <div className={styles.pollResultBar}>
                      <div
                        className={`${styles.pollResultBarFill} ${
                          isSelected ? styles.pollResultBarFillActive : ""
                        }`}
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.pollFooter}>
          {!hasVoted ? (
            <>
              <button
                type="button"
                className={styles.voteButton}
                onClick={handleVote}
                disabled={!selectedOptionId}
              >
                {poll.buttonLabel || "Hlasovať"}
              </button>

              <span className={styles.pollFooterText}>
                Po odoslaní sa zobrazia výsledky hlasovania.
              </span>
            </>
          ) : (
            <>
              <div className={styles.voteSuccess}>
                Ďakujeme za hlas
                {selectedOption ? ` – ${selectedOption.label}` : ""}
              </div>

              <span className={styles.pollFooterText}>
                Celkovo hlasov: {totalVotes}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}