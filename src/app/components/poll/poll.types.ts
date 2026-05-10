export type ApiPollOption = {
  id: number;
  text: string;
  order: number;
  votes_count?: number;
};

export type ApiPoll = {
  id: number;
  question: string;
  description: string;
  is_active: boolean;
  voting_open: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  options: ApiPollOption[];
  has_voted?: boolean;
};

export type ApiPollResultOption = {
  id: number;
  text: string;
  votes: number;
  percent: number;
};

export type ApiPollResults = {
  poll_id: number;
  question: string;
  description: string;
  voting_open: boolean;
  starts_at: string | null;
  ends_at: string | null;
  total_votes: number;
  options: ApiPollResultOption[];
};