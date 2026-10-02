"use client";

import { useEffect, useMemo, useState } from "react";

import styles from "./GlitchText.module.css";

export type GlitchTextProps = {
  phrases: readonly string[];
  pauseMs?: number;
  flipDurationMs?: number;
  staggerMs?: number;
  flips?: number;
  className?: string;
};

const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getFlipCharacter(characterIndex: number, flipIndex: number) {
  return SCRAMBLE_CHARACTERS[
    (characterIndex * 11 + flipIndex * 7) % SCRAMBLE_CHARACTERS.length
  ];
}

export default function GlitchText({
  phrases,
  pauseMs = 2600,
  flipDurationMs = 150,
  staggerMs = 70,
  flips = 8,
  className = "",
}: GlitchTextProps) {
  const safePhrases = useMemo(
    () => phrases.map((phrase) => phrase.trim()).filter(Boolean),
    [phrases],
  );
  const firstPhrase = safePhrases[0] ?? "";
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState(firstPhrase);
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    if (
      safePhrases.length <= 1 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let timeoutId = 0;
    let animationFrameId = 0;
    let currentIndex = 0;
    let lastFrameTime = 0;

    const scheduleNextPhrase = () => {
      timeoutId = window.setTimeout(() => {
        const nextIndex = (currentIndex + 1) % safePhrases.length;
        const previous = safePhrases[currentIndex];
        const target = safePhrases[nextIndex];
        const characterCount = Math.max(previous.length, target.length, 12);
        const startedAt = performance.now();

        setIsScrambling(true);

        const drawFrame = (timestamp: number) => {
          if (timestamp - lastFrameTime < 30) {
            animationFrameId = window.requestAnimationFrame(drawFrame);
            return;
          }

          lastFrameTime = timestamp;
          const elapsed = timestamp - startedAt;
          const totalDuration =
            Math.max(0, characterCount - 1) * staggerMs +
            flips * flipDurationMs;

          const nextText = Array.from({ length: characterCount }, (_, index) => {
            const targetCharacter = target[index] ?? " ";
            const previousCharacter = previous[index] ?? " ";
            const localElapsed = elapsed - index * staggerMs;

            if (localElapsed < 0) return previousCharacter;

            const flipIndex = Math.floor(localElapsed / flipDurationMs);

            if (flipIndex >= flips) return targetCharacter;
            if (targetCharacter === " ") return " ";

            return getFlipCharacter(index, flipIndex);
          }).join("");

          setDisplayText(nextText);

          if (elapsed < totalDuration) {
            animationFrameId = window.requestAnimationFrame(drawFrame);
            return;
          }

          currentIndex = nextIndex;
          setActiveIndex(nextIndex);
          setDisplayText(target);
          setIsScrambling(false);
          scheduleNextPhrase();
        };

        animationFrameId = window.requestAnimationFrame(drawFrame);
      }, pauseMs);
    };

    scheduleNextPhrase();

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [flipDurationMs, flips, pauseMs, safePhrases, staggerMs]);

  if (!firstPhrase) return null;

  return (
    <span
      className={`${styles.root} ${className}`.trim()}
      aria-label={safePhrases[activeIndex] ?? firstPhrase}
    >
      <span
        className={styles.text}
        data-scrambling={isScrambling}
        aria-hidden="true"
      >
        {displayText}
      </span>
    </span>
  );
}
