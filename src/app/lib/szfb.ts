import "server-only";
import { API_URL } from "./api";

export type SzfbStandingRow = {
  position: number;
  team_name: string;
  played: number;
  points: number;
};

export type SzfbMatch = {
  id: number;
  match_type: "finished" | "upcoming";
  match_date: string | null;
  match_time: string | null;
  opponent: string;
  venue: string;
  result: string;
  is_home: boolean | null;
};

export type SzfbPlayerStat = {
  id: number;
  rank: number;
  player_name: string;
  birth_year: number | null;
  team_short_name: string;
  player_position: string;
  games: number;
  goals: number;
  assists: number;
  points: number;
};

export type SzfbDashboardResponse = {
  watch: {
    id: number;
    label: string;
    team_name: string;
    competition_name: string;
    competition_season: string;
  };
  standings: SzfbStandingRow[];
  results: SzfbMatch[];
  upcoming: SzfbMatch[];
  player_stats: SzfbPlayerStat[];
};

export async function getSzfbDashboard(
  watchId: number
): Promise<SzfbDashboardResponse | null> {
  try {
    const url = `${API_URL.replace(/\/$/, "")}/public/szfb/watch/${watchId}/dashboard/`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("SZFB dashboard fetch failed:", response.status, url);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("SZFB dashboard fetch error:", error);
    return null;
  }
}

export type SzfbSingleMatch = {
  id: number;
  match_type: "finished" | "upcoming";
  match_date: string | null;
  match_time: string | null;
  opponent: string;
  venue: string;
  result: string;
  is_home: boolean | null;
};

export type SzfbNextMatchResponse = {
  watch_id: number;
  next_match: SzfbSingleMatch | null;
};

export async function getSzfbNextMatch(
  watchId: number
): Promise<SzfbNextMatchResponse | null> {
  try {
    const url = `${API_URL.replace(/\/$/, "")}/public/szfb/watch/${watchId}/next-match/`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("SZFB next match fetch failed:", response.status, url);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("SZFB next match fetch error:", error);
    return null;
  }
}