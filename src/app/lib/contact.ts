import { API_URL, getApiFetchOptions } from "./api";

export type ClubContact = {
  id: number;
  club: {
    id: number;
    name: string;
    slug: string;
    short_name: string;
  };
  address: string;
  chairman_name: string;
  email: string;
  phone: string;
  iban: string;
  map_label: string;
  map_address: string;
  latitude: string;
  longitude: string;
  note: string;
  is_active: boolean;
  updated_at: string;
};

export async function getClubContact(
  clubSlug: string
): Promise<ClubContact | null> {
  try {
    const response = await fetch(
      `${API_URL}/public/contact/${clubSlug}/`,
      getApiFetchOptions(300)
    );

    if (!response.ok) {
      console.error("Nepodarilo sa načítať kontakt:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Nepodarilo sa načítať kontakt:", error);
    return null;
  }
}
