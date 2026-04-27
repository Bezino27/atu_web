import type { PollData, PreviousPollResult } from "./poll.types";

export const mockPoll: PollData = {
  id: "player-of-the-match-001",
  title: "Hlasovanie fanúšikov",
  question: "Kto bol podľa teba hráčom posledného zápasu?",
  description: "Vyber jedného hráča a odošli svoj hlas.",
  endsAt: "25. 4. 2026",
  buttonLabel: "Hlasovať",
  totalVotes: 100,
  options: [
    {
      id: "novak",
      label: "Michal Novák",
      votes: 42,
    },
    {
      id: "kovac",
      label: "Tomáš Kováč",
      votes: 31,
    },
    {
      id: "hudak",
      label: "Samuel Hudák",
      votes: 18,
    },
    {
      id: "iny",
      label: "Iný hráč",
      votes: 9,
    },
  ],
};

export const mockPreviousPollResult: PreviousPollResult = {
  id: "previous-poll-001",
  title: "Výsledok poslednej ankety",
  subtitle: "Hráč posledného zápasu",
  winnerName: "Michal Novák",
  winnerPercent: 42,
  totalVotes: 100,
  ranking: [
    {
      id: "novak",
      label: "Michal Novák",
      percent: 42,
    },
    {
      id: "kovac",
      label: "Tomáš Kováč",
      percent: 31,
    },
    {
      id: "hudak",
      label: "Samuel Hudák",
      percent: 18,
    },
    {
      id: "iny",
      label: "Iný hráč",
      percent: 9,
    },
  ],
};