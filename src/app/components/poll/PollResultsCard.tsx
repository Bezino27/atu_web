"use client";

import { useState } from "react";
import styles from "./PollCard.module.css";
import type { ApiPollResults } from "./poll.types";

type PollResultsCardProps = {
  result: ApiPollResults;
};

type VideoEmbed =
  | { type: "youtube" | "vimeo"; src: string }
  | { type: "file"; src: string };

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

function getResultOptionVideo(option: ApiPollResults["options"][number]) {
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

export default function PollResultsCard({ result }: PollResultsCardProps) {
  const [showEndedNotice, setShowEndedNotice] = useState(false);
  const sortedOptions = [...result.options].sort((a, b) => b.votes - a.votes);
  const winner = sortedOptions[0] ?? null;
  const winnerVideo = winner ? getResultOptionVideo(winner) : null;
  const endedAtLabel = formatDateTime(result.ends_at);

  function highlightEndedPoll() {
    setShowEndedNotice(true);
  }

  return (
    <div className={styles.pollResultsCard}>
      <div className={styles.pollResultsInner}>
        <div className={styles.pollResultsBody}>
          <div className={styles.pollTopMeta}>
            <span className={styles.pollMiniLabel}>Posledná anketa</span>

            {endedAtLabel ? (
              <span
                className={`${styles.pollDeadline} ${
                  showEndedNotice ? styles.pollDeadlineEndedActive : ""
                }`}
              >
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
            <div
              className={styles.previousWinnerCard}
              role="button"
              tabIndex={0}
              onClick={highlightEndedPoll}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  highlightEndedPoll();
                }
              }}
            >
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

              {winnerVideo ? (
                <PollVideo
                  video={winnerVideo}
                  title={`Video víťaza ankety: ${winner.text}`}
                />
              ) : null}
            </div>
          ) : null}

          <div className={styles.previousRankingList}>
            {sortedOptions.slice(1, 3).map((item, index) => (
              <div
                key={item.id}
                className={styles.previousRankingItem}
                role="button"
                tabIndex={0}
                onClick={highlightEndedPoll}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    highlightEndedPoll();
                  }
                }}
              >
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
