"use client";

import { useState } from "react";
import pageStyles from "../page2.module.css";
import PollCard from "./PollCard";
import PollResultsCard from "./PollResultsCard";
import { mockPoll, mockPreviousPollResult } from "./poll.mock";
import styles from "./PollCard.module.css";

export default function PollSection() {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

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

      <div className={styles.pollGrid}>
        <PollCard
          poll={mockPoll}
          selectedOptionId={selectedOptionId}
          hasVoted={hasVoted}
          onSelect={handleSelect}
          onVote={handleVote}
        />

        <PollResultsCard result={mockPreviousPollResult} />
      </div>
    </section>
  );
}