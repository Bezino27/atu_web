import { API_URL } from "./api";
import type { ApiPoll, ApiPollResults } from "@/app/components/poll/poll.types";

async function readErrorMessage(response: Response, fallback: string) {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail.join(" ");
    }

    if (typeof data?.message === "string") {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export async function getPolls(): Promise<ApiPoll[]> {
  const response = await fetch(`${API_URL}/polls/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Ankety sa nepodarilo načítať."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function getPollDetail(pollId: number): Promise<ApiPoll> {
  const response = await fetch(`${API_URL}/polls/${pollId}/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Detail ankety sa nepodarilo načítať."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function getPollResults(
  pollId: number
): Promise<ApiPollResults> {
  const response = await fetch(`${API_URL}/polls/${pollId}/results/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Výsledky ankety sa nepodarilo načítať."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function getLatestPollResult(): Promise<ApiPollResults | null> {
  const response = await fetch(`${API_URL}/polls/latest-result/`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Posledný výsledok ankety sa nepodarilo načítať."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function voteInPoll(
  pollId: number,
  optionId: number
): Promise<{ message: string; has_voted: boolean }> {
  const response = await fetch(`${API_URL}/polls/${pollId}/vote/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      option_id: optionId,
    }),
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Hlas sa nepodarilo odoslať."
    );

    throw new Error(message);
  }

  return response.json();
}
