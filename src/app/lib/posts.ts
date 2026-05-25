import { API_URL } from "./api";

export type PostCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featured_image?: string | null;
  published_at?: string | null;
  author_username?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  category?: PostCategory | null;
};

export async function getHomepagePosts(
  clubSlug: string,
  limit?: number,
): Promise<Post[]> {
  try {
    const url = new URL(`${API_URL}/public/posts/${clubSlug}/`);

    if (limit) {
      url.searchParams.set("limit", String(limit));
    }

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Nepodarilo sa načítať články: ${res.status}`);
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.results)) {
      return data.results;
    }

    return [];
  } catch (error) {
    console.error("Chyba pri načítaní článkov:", error);
    return [];
  }
}

export async function getPostDetail(
  clubSlug: string,
  slug: string,
): Promise<Post> {
  const res = await fetch(`${API_URL}/public/posts/${clubSlug}/${slug}/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať detail článku: ${res.status}`);
  }

  return res.json();
}
