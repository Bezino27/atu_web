import { API_URL } from "@/app/lib/api";

export type ClubSeasonResponse = {
  id: number;
  club: number;
  season: string;
};

export async function getClubSeason(
  clubSlug: string
): Promise<ClubSeasonResponse | null> {
  try {
    const res = await fetch(`${API_URL}/public/teams/${clubSlug}/season/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}