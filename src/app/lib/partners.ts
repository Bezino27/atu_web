import { API_URL, getImageUrl } from "./api";

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
  if (partner.image_url) return partner.image_url;
  if (partner.logo_url) return partner.logo_url;
  if (partner.logo) return getImageUrl(partner.logo);

  return "";
}

export async function getClubPartners(clubSlug: string): Promise<Partner[]> {
  try {
    const response = await fetch(`${API_URL}/public/partners/${clubSlug}/`, {
      next: {
        revalidate: 300,
      },
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