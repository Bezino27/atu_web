"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./CopyEmailButton.module.css";

type CopyEmailButtonProps = {
  email: string;
  className?: string;
};

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.25 13.75 13.75 10.25M8.1 15.9l-1.25 1.25a3.54 3.54 0 0 1-5-5L5.1 8.9a3.54 3.54 0 0 1 5 0M15.9 8.1l1.25-1.25a3.54 3.54 0 0 1 5 5L18.9 15.1a3.54 3.54 0 0 1-5 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12.5 4.2 4.2L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CopyEmailButton({
  email,
  className = "",
}: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);

      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${copied ? styles.success : ""} ${className}`.trim()}
      onClick={copyEmail}
      aria-label={`Skopírovať emailovú adresu ${email}`}
    >
      <span className={styles.icon} aria-hidden="true">
        {copied ? <CheckIcon /> : <LinkIcon />}
      </span>

      <span className={styles.label} aria-live="polite">
        {copied ? "Email skopírovaný" : "Skopíruj emailovú adresu"}
      </span>
    </button>
  );
}
