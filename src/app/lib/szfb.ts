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
};

export async function getSzfbDashboard(
  watchId: number
): Promise<SzfbDashboardResponse | null> {
  try {
    const response = await fetch(
      `${API_URL}/public/szfb/watch/${watchId}/dashboard/`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      console.error("SZFB dashboard fetch failed:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("SZFB dashboard fetch error:", error);
    return null;
  }
}