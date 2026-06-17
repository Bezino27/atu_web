import { API_URL, getApiFetchOptions, normalizeMediaUrl } from "./api";

export type ClubDocument = {
  id: number;
  title: string;
  file: string;
  file_url: string | null;
  order: number;
  is_active: boolean;
  updated_at: string;
};

export function getClubDocumentUrl(document: ClubDocument): string {
  if (document.file_url) return normalizeMediaUrl(document.file_url, "");
  if (document.file) return normalizeMediaUrl(document.file, "");

  return "";
}

export async function getClubDocuments(
  clubSlug: string
): Promise<ClubDocument[]> {
  try {
    const response = await fetch(
      `${API_URL}/public/documents/${clubSlug}/`,
      getApiFetchOptions(300)
    );

    if (!response.ok) {
      console.error("Nepodarilo sa načítať dokumenty:", response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Nepodarilo sa načítať dokumenty:", error);
    return [];
  }
}