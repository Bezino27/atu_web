import { API_URL, getApiFetchOptions, normalizeMediaUrl } from "./api";

export type ClubLink = {
  id: number;
  title: string;
  url: string;
  icon_type: string;
  logo?: string | null;
  logo_url?: string | null;
  order: number;
  is_active: boolean;
};

export type Club = {
  id: number;
  name: string;
  slug: string;
  short_name: string;
  description: string;
  logo?: string | null;
  cover_image?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  links: ClubLink[];
};

export function getClubLinkLogoUrl(link: ClubLink) {
  if (link.logo_url) return normalizeMediaUrl(link.logo_url, "");
  if (link.logo) return normalizeMediaUrl(link.logo, "");

  return "";
}

export async function getClub(clubSlug: string): Promise<Club | null> {
  try {
    const response = await fetch(
      `${API_URL}/public/clubs/${clubSlug}/`,
      getApiFetchOptions(300)
    );

    if (!response.ok) {
      console.error("Nepodarilo sa načítať klub:", response.status);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Nepodarilo sa načítať klub:", error);
    return null;
  }
}
