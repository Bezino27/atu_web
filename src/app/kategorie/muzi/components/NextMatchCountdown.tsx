"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "../../styles/unified.module.css";

type NextMatchCountdownProps = {
  matchDate: string | null;
  matchTime: string | null;
  opponent: string;
  ownTeamName: string;
  isHome: boolean | null;
};

function formatUnit(value: number) {
  return value < 10 ? `0${value}` : `${value}`;
}

function buildTargetDate(matchDate: string | null, matchTime: string | null) {
  if (!matchDate) return null;

  const safeTime =
    matchTime && matchTime.length >= 5 ? matchTime.slice(0, 5) : "18:00";

  const parsed = new Date(`${matchDate}T${safeTime}:00`);

  if (Number.isNaN(parsed.getTime())) return null;

  return parsed;
}

export default function NextMatchCountdown({
  matchDate,
  matchTime,
  opponent,
  ownTeamName,
  isHome,
}: NextMatchCountdownProps) {
  const targetDate = useMemo(
    () => buildTargetDate(matchDate, matchTime),
    [matchDate, matchTime]
  );

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const matchupTitle =
    isHome === false
      ? `${opponent} vs ${ownTeamName}`
      : `${ownTeamName} vs ${opponent}`;

  const countdown = useMemo(() => {
    if (!targetDate) {
      return {
        isReady: false,
        isLive: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      return {
        isReady: true,
        isLive: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      isReady: true,
      isLive: false,
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, [targetDate, now]);

  if (!targetDate) {
    return (
      <div className={styles.countdownWrapper}>
        <div className={styles.countdownBar}>
          <span className={styles.liveDot} />

          <span className={styles.timer}>
            <span className={styles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS:</span>{" "}
            Zatiaľ nie je k dispozícii.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.countdownWrapper}>
      <div className={styles.countdownBar}>
        <span
          className={styles.liveDot}
          style={
            countdown.isReady && countdown.isLive
              ? {
                  backgroundColor: "#ff0000",
                  boxShadow: "0 0 15px #ff0000",
                }
              : undefined
          }
        />

        <span className={styles.timer}>
          {!countdown.isReady ? (
            <>
              <span className={styles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS:</span>{" "}
              {targetDate.toLocaleDateString("sk-SK")} •{" "}
              {matchTime?.slice(0, 5) || "čas bude doplnený"}
            </>
          ) : countdown.isLive ? (
            <span style={{ color: "#d32f2f", fontWeight: 900 }}>
              SLEDUJTE LIVE ⚡ {matchupTitle}
            </span>
          ) : (
            <>
              <span className={styles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS O:</span>{" "}
              {countdown.days}d : {formatUnit(countdown.hours)}h :{" "}
              {formatUnit(countdown.minutes)}m : {formatUnit(countdown.seconds)}
              s
            </>
          )}
        </span>
      </div>
    </div>
  );
}