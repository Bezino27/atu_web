"use client";

import { useState } from "react";
import styles from "./pridaj_sa.module.css";

type FaqItem = {
  question: string;
  answer: string | string[];
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem((current) => (current === index ? null : index));
  };

  return (
    <div className={styles.faqList}>
      {items.map((item, index) => {
        const isOpen = openItem === index;
        const answerId = `faq-answer-${index}`;

        return (
          <div
            key={item.question}
            className={`${styles.faqItem} ${isOpen ? styles.open : ""}`}
          >
            <button
              type="button"
              className={styles.faqQuestion}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(index)}
            >
              <span className={styles.faqQuestionText}>{item.question}</span>
              <span className={styles.faqChevron} aria-hidden="true" />
            </button>

            <div
              id={answerId}
              className={styles.faqAnswer}
              aria-hidden={!isOpen}
            >
              <div className={styles.faqAnswerInner}>
                {Array.isArray(item.answer) ? (
                  <div className={styles.faqAnswerList}>
                    {item.answer.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p>{item.answer}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
