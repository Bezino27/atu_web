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
  featured_image?: string | null;
  published_at: string;
  is_featured?: boolean;
  category?: PostCategory | null;
  club_slug: string;
};

type PostsResponse = Post[] | { results: Post[] };

export async function getHomepagePosts(clubSlug: string): Promise<Post[]> {
  const baseUrl = process.env.API_URL || "http://178.104.54.84:8000/api";

  const res = await fetch(`${baseUrl}/public/posts/${clubSlug}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch posts: ${res.status} ${res.statusText} - ${errorText}`
    );
  }

  const data: PostsResponse = await res.json();

  if (Array.isArray(data)) {
    return data;
  }

  if ("results" in data && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}