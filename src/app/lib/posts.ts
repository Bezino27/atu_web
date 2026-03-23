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
  excerpt?: string;
  content?: string;
  featured_image?: string | null;
  published_at?: string;
  category?: PostCategory | null;
};

export async function getHomepagePosts(clubSlug: string): Promise<Post[]> {
  const res = await fetch(`${API_URL}/public/posts/${clubSlug}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať články: ${res.status}`);
  }

  return res.json();
}


export async function getPostDetail(clubSlug: string, slug: string): Promise<Post> {
  const res = await fetch(`${API_URL}/public/posts/${clubSlug}/${slug}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať detail článku: ${res.status}`);
  }

  return res.json();
}