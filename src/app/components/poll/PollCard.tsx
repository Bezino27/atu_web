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

type VideoEmbed =
  | { type: "youtube" | "vimeo"; src: string }
  | { type: "file"; src: string };

type VideoOption = {
  text: string;
  video_url?: string | null;
  video_file_url?: string | null;
};

function getUploadedVideoEmbed(videoFileUrl?: string | null): VideoEmbed | null {
  return videoFileUrl ? { type: "file", src: videoFileUrl } : null;
}

function getVideoEmbed(videoUrl?: string | null): VideoEmbed | null {
  if (!videoUrl) return null;

  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.toLowerCase();
    const pathname = url.pathname;

    if (!["http:", "https:"].includes(url.protocol)) return null;

    if (hostname === "youtu.be") {
      const id = pathname.split("/").filter(Boolean)[0];
      return id ? { type: "youtube", src: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (hostname === "youtube.com" || hostname === "www.youtube.com") {
      const id = url.searchParams.get("v");
      return id ? { type: "youtube", src: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (hostname === "vimeo.com" || hostname === "www.vimeo.com") {
      const id = pathname.split("/").filter(Boolean)[0];
      return id ? { type: "vimeo", src: `https://player.vimeo.com/video/${id}` } : null;
    }

    if (hostname === "player.vimeo.com") {
      const parts = pathname.split("/").filter(Boolean);
      const id = parts[0] === "video" ? parts[1] : null;
      return id ? { type: "vimeo", src: `https://player.vimeo.com/video/${id}` } : null;
    }

    if (pathname.toLowerCase().endsWith(".mp4")) {
      return { type: "file", src: videoUrl };
    }
  } catch {
    return null;
  }

  return null;
}

function getOptionVideo(option: VideoOption) {
  return getUploadedVideoEmbed(option.video_file_url) ?? getVideoEmbed(option.video_url);
}

function PollVideo({ video, title }: { video: VideoEmbed; title: string }) {
  return (
    <div
      className={styles.optionVideo}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {video.type === "file" ? (
        <video
          src={video.src}
          controls
          playsInline
          preload="metadata"
        />
      ) : (
        <iframe
          src={video.src}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
}

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
  const canSelect = !hasVoted && poll.voting_open && !voting;

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
                const video = getOptionVideo(option);

                return (
                  <div
                    key={option.id}
                    role="button"
                    tabIndex={canSelect ? 0 : -1}
                    className={`${styles.optionButton} ${
                      isSelected ? styles.optionButtonActive : ""
                    }`}
                    aria-disabled={!canSelect}
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (canSelect) onSelect(option.id);
                    }}
                    onKeyDown={(event) => {
                      if (!canSelect) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(option.id);
                      }
                    }}
                  >
                    {video ? (
                      <PollVideo
                        video={video}
                        title={`Video možnosti: ${option.text}`}
                      />
                    ) : null}

                    <span className={styles.optionContent}>
                      <span className={styles.optionIndicator} />
                      <span className={styles.optionLabel}>{option.text}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.pollResultsList}>
              {results?.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const video = getOptionVideo(option);

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

                    {video ? (
                      <PollVideo
                        video={video}
                        title={`Video možnosti: ${option.text}`}
                      />
                    ) : null}
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
