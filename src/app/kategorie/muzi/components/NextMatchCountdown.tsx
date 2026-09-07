"use client";

import { useEffect, useMemo, useState } from "react";
import heroStyles from "../../styles/CategoryHero.module.css";

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

function formatMatchDate(matchDate: string) {
  const [year, month, day] = matchDate.split("-");
  return day && month && year ? `${day}. ${month}. ${year}` : matchDate;
}

function buildTargetDate(matchDate: string | null, matchTime: string | null) {
  if (!matchDate || !matchTime || matchTime.slice(0, 5) === "00:00") return null;

  const parsed = new Date(`${matchDate}T${matchTime.slice(0, 5)}:00`);

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

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0);

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, [targetDate]);

  const matchupTitle =
    isHome === false
      ? `${opponent} vs ${ownTeamName}`
      : `${ownTeamName} vs ${opponent}`;

  const countdown = useMemo(() => {
    if (!targetDate || now === null) {
      return {
        isReady: false,
        isLive: false,
        isFinished: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const distance = targetDate.getTime() - now;
    const liveWindowMs = 3 * 60 * 60 * 1000;

    if (distance <= 0) {
      return {
        isReady: true,
        isLive: distance >= -liveWindowMs,
        isFinished: distance < -liveWindowMs,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      isReady: true,
      isLive: false,
      isFinished: false,
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      ),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  }, [targetDate, now]);

  if (matchDate && (!matchTime || matchTime.slice(0, 5) === "00:00")) {
    return (
      <div className={heroStyles.countdownWrapper}>
        <div className={heroStyles.countdownBar}>
          <span className={heroStyles.liveDot} />
          <span className={heroStyles.timer}>
            <span className={heroStyles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS:</span>{" "}
            {formatMatchDate(matchDate)} • čas bude doplnený
          </span>
        </div>
      </div>
    );
  }

  if (!targetDate) {
    return (
      <div className={heroStyles.countdownWrapper}>
        <div className={heroStyles.countdownBar}>
          <span className={heroStyles.liveDot} />

          <span className={heroStyles.timer}>
            <span className={heroStyles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS:</span>{" "}
            Zatiaľ nie je k dispozícii.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={heroStyles.countdownWrapper}>
      <div className={heroStyles.countdownBar}>
        <span
          className={heroStyles.liveDot}
          style={
            countdown.isReady && countdown.isLive
              ? {
                  backgroundColor: "#ff0000",
                  boxShadow: "0 0 15px #ff0000",
                }
              : undefined
          }
        />

        <span className={heroStyles.timer}>
          {!countdown.isReady ? (
            <>
              <span className={heroStyles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS:</span>{" "}
              {formatMatchDate(matchDate!)} •{" "}
              {matchTime?.slice(0, 5) || "čas bude doplnený"}
            </>
          ) : countdown.isLive ? (
            <span style={{ color: "#d32f2f", fontWeight: 900 }}>
              SLEDUJTE LIVE ⚡ {matchupTitle}
            </span>
          ) : countdown.isFinished ? (
            <span>{matchupTitle} • zápas sa už začal</span>
          ) : (
            <>
              <span className={heroStyles.countdownLabel}>NAJBLIŽŠÍ ZÁPAS O:</span>{" "}
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
