import { API_URL } from "@/app/lib/api";
import type { ApiPoll, ApiPollResults } from "@/app/components/poll/poll.types";

const POLLS_URL = `${API_URL}/polls`;

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      "Nepodarilo sa spracovať požiadavku.";

    throw new Error(Array.isArray(message) ? message.join(" ") : message);
  }

  return data as T;
}

export async function getPolls(): Promise<ApiPoll[]> {
  const response = await fetch(`${POLLS_URL}/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<ApiPoll[]>(response);
}

export async function getPollDetail(pollId: number): Promise<ApiPoll> {
  const response = await fetch(`${POLLS_URL}/${pollId}/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<ApiPoll>(response);
}

export async function voteInPoll(
  pollId: number,
  optionId: number
): Promise<{ message: string; has_voted: boolean }> {
  const response = await fetch(`${POLLS_URL}/${pollId}/vote/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option_id: optionId,
    }),
  });

  return parseResponse<{ message: string; has_voted: boolean }>(response);
}

export async function getPollResults(pollId: number): Promise<ApiPollResults> {
  const response = await fetch(`${POLLS_URL}/${pollId}/results/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<ApiPollResults>(response);
}

export async function getLatestPollResult(): Promise<ApiPollResults | null> {
  const response = await fetch(`${POLLS_URL}/latest-result/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return parseResponse<ApiPollResults | null>(response);
}