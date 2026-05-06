"use client";

import { useState } from "react";
import pageStyles from "../page.module.css";
import PollCard from "./PollCard";
import PollResultsCard from "./PollResultsCard";
import { mockPoll, mockPreviousPollResult } from "./poll.mock";
import styles from "./PollCard.module.css";

export default function PollSection() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Neskôr sem dáš dáta z backendu/API.
  // Keď nebude žiadna anketa, hodnota bude null.
  //const activePoll = mockPoll ?? null;
  //const previousPollResult = mockPreviousPollResult ?? null;
  // TEST: stav bez ankiet
  const activePoll = null;
  const previousPollResult = null;

  const hasActivePoll = Boolean(activePoll);
  const hasPreviousPoll = Boolean(previousPollResult);
  const hasAnyPoll = hasActivePoll || hasPreviousPoll;

  const handleSelect = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOptionId(optionId);
  };

  const handleVote = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasVoted(true);
  };

  return (
    <section className={pageStyles.sectionContainer}>
      <div className={pageStyles.resultsHeader}>
        <div>
          <span className={pageStyles.preTitle}>Anketa</span>
          <h2 className={pageStyles.sectionTitle}>Hlasovanie fanúšikov</h2>
        </div>
      </div>

      {!hasAnyPoll ? (
        <div className={styles.pollEmptyState}>
          <div className={styles.pollEmptyIcon}>💬</div>

          <h3 className={styles.pollEmptyTitle}>Momentálne nie je dostupná anketa</h3>

          <p className={styles.pollEmptyText}>
            Aktuálne neprebieha žiadne hlasovanie fanúšikov. Novú anketu
            pridáme po ďalšom zápase alebo klubovej udalosti.
          </p>
        </div>
      ) : (
        <div className={styles.pollGrid}>
          {activePoll ? (
            <PollCard
              poll={activePoll}
              selectedOptionId={selectedOptionId}
              hasVoted={hasVoted}
              onSelect={handleSelect}
              onVote={handleVote}
            />
          ) : (
            <div className={styles.pollCard}>
              <div className={styles.pollCardInner}>
                <div className={styles.pollEmptyCompact}>
                  <span className={styles.pollMiniLabel}>Aktuálna anketa</span>

                  <h3 className={styles.pollEmptyTitle}>
                    Momentálne neprebieha žiadne hlasovanie
                  </h3>

                  <p className={styles.pollEmptyText}>
                    Nová anketa sa zobrazí hneď, ako ju klub zverejní.
                  </p>
                </div>
              </div>
            </div>
          )}

          {previousPollResult ? (
            <PollResultsCard result={previousPollResult} />
          ) : null}
        </div>
      )}
    </section>
  );
}