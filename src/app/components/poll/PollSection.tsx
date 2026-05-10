"use client";

import { useCallback, useEffect, useState } from "react";
import pageStyles from "../../page.module.css";
import PollCard from "./PollCard";
import PollResultsCard from "./PollResultsCard";
import styles from "./PollCard.module.css";
import type { ApiPoll, ApiPollResults } from "./poll.types";
import {
  getLatestPollResult,
  getPollDetail,
  getPollResults,
  getPolls,
  voteInPoll,
} from "@/app/lib/polls";

type PollState = {
  poll: ApiPoll;
  selectedOptionId: number | null;
  results: ApiPollResults | null;
  voting: boolean;
  error: string | null;
};

export default function PollSection() {
  const [polls, setPolls] = useState<PollState[]>([]);
  const [latestResult, setLatestResult] = useState<ApiPollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionError, setSectionError] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      setSectionError(null);

      const [list, previousResult] = await Promise.all([
        getPolls(),
        getLatestPollResult(),
      ]);
      const activePollLimit = previousResult ? 1 : 2;

      const openPolls = await Promise.all(
        list.slice(0, activePollLimit).map(async (poll) => {
          let results: ApiPollResults | null = null;

          if (poll.has_voted) {
            results = await getPollResults(poll.id);
          }

          return {
            poll,
            selectedOptionId: null,
            results,
            voting: false,
            error: null,
          };
        })
      );

      setPolls(openPolls);
      setLatestResult(previousResult);
    } catch (error) {
      setSectionError(
        error instanceof Error ? error.message : "Ankety sa nepodarilo načítať."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const handleSelect = (pollId: number, optionId: number) => {
    setPolls((currentPolls) =>
      currentPolls.map((item) => {
        if (item.poll.id !== pollId) return item;

        if (item.poll.has_voted || !item.poll.voting_open || item.voting) {
          return item;
        }

        return {
          ...item,
          selectedOptionId: optionId,
          error: null,
        };
      })
    );
  };

  const handleVote = async (pollId: number) => {
    const targetPoll = polls.find((item) => item.poll.id === pollId);

    if (!targetPoll || !targetPoll.selectedOptionId) return;

    try {
      setPolls((currentPolls) =>
        currentPolls.map((item) =>
          item.poll.id === pollId
            ? {
                ...item,
                voting: true,
                error: null,
              }
            : item
        )
      );

      await voteInPoll(pollId, targetPoll.selectedOptionId);

      const [updatedPoll, results] = await Promise.all([
        getPollDetail(pollId),
        getPollResults(pollId),
      ]);

      setPolls((currentPolls) =>
        currentPolls.map((item) =>
          item.poll.id === pollId
            ? {
                ...item,
                poll: updatedPoll,
                results,
                voting: false,
                error: null,
              }
            : item
        )
      );
    } catch (error) {
      setPolls((currentPolls) =>
        currentPolls.map((item) =>
          item.poll.id === pollId
            ? {
                ...item,
                voting: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Hlas sa nepodarilo odoslať.",
              }
            : item
        )
      );
    }
  };

  const hasOpenPolls = polls.length > 0;
  const hasLatestResult = Boolean(latestResult);
  const hasAnyContent = hasOpenPolls || hasLatestResult;

  return (
    <section className={pageStyles.sectionContainer}>
      <div className={pageStyles.resultsHeader}>
        <div>
          <span className={pageStyles.preTitle}>Anketa</span>
          <h2 className={pageStyles.sectionTitle}>Hlasovanie fanúšikov</h2>
        </div>
      </div>

      {loading ? (
        <div className={styles.pollEmptyState}>
          <div className={styles.pollEmptyIcon}>⏳</div>
          <h3 className={styles.pollEmptyTitle}>Načítavam ankety</h3>
          <p className={styles.pollEmptyText}>
            Chvíľu počkaj, pripravujeme aktuálne hlasovanie.
          </p>
        </div>
      ) : sectionError ? (
        <div className={styles.pollEmptyState}>
          <div className={styles.pollEmptyIcon}>⚠️</div>
          <h3 className={styles.pollEmptyTitle}>Ankety sa nepodarilo načítať</h3>
          <p className={styles.pollEmptyText}>{sectionError}</p>
        </div>
      ) : !hasAnyContent ? (
        <div className={styles.pollEmptyState}>
          <div className={styles.pollEmptyIcon}>💬</div>
          <h3 className={styles.pollEmptyTitle}>
            Momentálne nie je dostupná anketa
          </h3>
          <p className={styles.pollEmptyText}>
            Aktuálne neprebieha žiadne hlasovanie fanúšikov.
          </p>
        </div>
      ) : (
        <div className={styles.pollGrid}>
          {polls.map((item) => (
            <PollCard
              key={item.poll.id}
              poll={item.poll}
              selectedOptionId={item.selectedOptionId}
              results={item.results}
              voting={item.voting}
              error={item.error}
              onSelect={(optionId) => handleSelect(item.poll.id, optionId)}
              onVote={() => handleVote(item.poll.id)}
            />
          ))}

          {latestResult ? (
            <PollResultsCard result={latestResult} />
          ) : null}
        </div>
      )}
    </section>
  );
}
