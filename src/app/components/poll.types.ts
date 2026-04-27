export type PollOption = {
  id: string;
  label: string;
  votes: number;
};

export type PollData = {
  id: string;
  title: string;
  question: string;
  description?: string;
  endsAt?: string;
  buttonLabel?: string;
  totalVotes?: number;
  options: PollOption[];
};

export type PreviousPollResult = {
  id: string;
  title: string;
  subtitle?: string;
  winnerName: string;
  winnerPercent: number;
  totalVotes: number;
  ranking: Array<{
    id: string;
    label: string;
    percent: number;
  }>;
};