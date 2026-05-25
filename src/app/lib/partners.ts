import { API_URL, getImageUrl, normalizeMediaUrl } from "./api";

export type Partner = {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  website?: string | null;
  tier?: string | null;
  order?: number;
  is_active?: boolean;
};

export function getPartnerImageUrl(partner: Partner): string {
  if (partner.image_url) return normalizeMediaUrl(partner.image_url, "");
  if (partner.logo_url) return normalizeMediaUrl(partner.logo_url, "");
  if (partner.logo) return getImageUrl(partner.logo);

  return "";
}

export async function getClubPartners(clubSlug: string): Promise<Partner[]> {
  try {
    const response = await fetch(`${API_URL}/public/partners/${clubSlug}/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Nepodarilo sa načítať partnerov:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Nepodarilo sa načítať partnerov:", error);
    return [];
  }
}
