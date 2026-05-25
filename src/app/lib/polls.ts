import { API_URL } from "./api";
import type { ApiPoll, ApiPollResults } from "@/app/components/poll/poll.types";

const POLLS_API_URL = `${API_URL}/polls`;

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
  const response = await fetch(`${POLLS_API_URL}/`, {
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
  const response = await fetch(`${POLLS_API_URL}/${pollId}/`, {
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
  const response = await fetch(`${POLLS_API_URL}/${pollId}/results/`, {
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

export async function getLatestPollResult() {
  const response = await fetch(`${POLLS_API_URL}/latest-result/`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Nepodarilo sa spracovať výsledok ankety:", error);
    return null;
  }
}
export async function voteInPoll(
  pollId: number,
  optionId: number
): Promise<{ message: string; has_voted: boolean }> {
  const response = await fetch(`${POLLS_API_URL}/${pollId}/vote/`, {
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
