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

const VOTED_POLLS_STORAGE_KEY = "atu_voted_poll_ids";

function getStoredVotedPollIds() {
  try {
    const storedValue = window.localStorage.getItem(VOTED_POLLS_STORAGE_KEY);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];

    if (!Array.isArray(parsedValue)) {
      return new Set<number>();
    }

    return new Set(
      parsedValue.filter((value): value is number => typeof value === "number")
    );
  } catch {
    return new Set<number>();
  }
}

function storeVotedPollId(pollId: number) {
  const votedPollIds = getStoredVotedPollIds();
  votedPollIds.add(pollId);

  window.localStorage.setItem(
    VOTED_POLLS_STORAGE_KEY,
    JSON.stringify(Array.from(votedPollIds))
  );
}

export default function PollSection() {
  const [polls, setPolls] = useState<PollState[]>([]);
  const [latestResult, setLatestResult] = useState<ApiPollResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [sectionError, setSectionError] = useState<string | null>(null);

  const loadPolls = useCallback(async () => {
    try {
      setLoading(true);
      setSectionError(null);

      const list = await getPolls();
      const previousResult = await getLatestPollResult().catch((error) => {
        console.error("Nepodarilo sa načítať posledný výsledok ankety:", error);
        return null;
      });
      const activePollLimit = previousResult ? 1 : 2;
      const votedPollIds = getStoredVotedPollIds();

      const openPolls = await Promise.all(
        list.slice(0, activePollLimit).map(async (poll) => {
          let results: ApiPollResults | null = null;
          const hasVoted = Boolean(poll.has_voted || votedPollIds.has(poll.id));

          if (hasVoted) {
            results = await getPollResults(poll.id);
          }

          return {
            poll: {
              ...poll,
              has_voted: hasVoted,
            },
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
      storeVotedPollId(pollId);

      const [updatedPoll, results] = await Promise.all([
        getPollDetail(pollId),
        getPollResults(pollId),
      ]);

      setPolls((currentPolls) =>
        currentPolls.map((item) =>
          item.poll.id === pollId
            ? {
                ...item,
                poll: {
                  ...updatedPoll,
                  has_voted: true,
                },
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
