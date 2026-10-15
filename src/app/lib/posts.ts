import { API_URL, getApiFetchOptions } from "./api";

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
  image_width?: number | null;
  image_height?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  author_username?: string | null;
  author_first_name?: string | null;
  author_last_name?: string | null;
  author_name?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  category?: PostCategory | null;
};

type PostListResponse =
  | Post[]
  | {
      results?: Post[];
      next?: string | null;
    };

const MAX_POST_PAGES = 100;

async function fetchPostsPage(url: string) {
  const response = await fetch(url, getApiFetchOptions(60));

  if (!response.ok) {
    throw new Error(`Nepodarilo sa načítať články: ${response.status}`);
  }

  return (await response.json()) as PostListResponse;
}

export async function getHomepagePosts(
  clubSlug: string,
  limit?: number,
): Promise<Post[]> {
  try {
    const url = new URL(`${API_URL}/public/posts/${clubSlug}/`);

    if (limit) {
      url.searchParams.set("limit", String(limit));
    }

    const data = await fetchPostsPage(url.toString());

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

export async function getAllPosts(clubSlug: string): Promise<Post[]> {
  const posts: Post[] = [];
  const visitedPages = new Set<string>();
  let nextUrl: string | null = `${API_URL}/public/posts/${clubSlug}/`;

  try {
    while (nextUrl && visitedPages.size < MAX_POST_PAGES) {
      const currentUrl: string = nextUrl;

      if (visitedPages.has(currentUrl)) {
        console.error("Stránkovanie článkov obsahuje opakovanú URL.");
        nextUrl = null;
        break;
      }

      visitedPages.add(currentUrl);

      const data = await fetchPostsPage(currentUrl);

      if (Array.isArray(data)) {
        posts.push(...data);
        nextUrl = null;
        break;
      }

      if (Array.isArray(data.results)) {
        posts.push(...data.results);
      }

      nextUrl = data.next ? new URL(data.next, currentUrl).toString() : null;
    }

    if (nextUrl) {
      console.error(`Stránkovanie článkov prekročilo limit ${MAX_POST_PAGES} strán.`);
    }

    return posts;
  } catch (error) {
    console.error("Chyba pri načítaní všetkých článkov:", error);
    return posts;
  }
}

function normalizeText(value?: string | null) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") ?? ""
  );
}

function isPostInCategory(post: Post, categorySlug: string) {
  const normalizedCategorySlug = normalizeText(categorySlug);
  const postCategorySlug = normalizeText(post.category?.slug);
  const postCategoryName = normalizeText(post.category?.name);
  const youthCategorySlugs = new Set([
    "juniori",
    "dorast",
    "starsi-ziaci",
    "mladsi-ziaci",
    "pripravka",
  ]);

  return (
    postCategorySlug === normalizedCategorySlug ||
    postCategoryName === normalizedCategorySlug ||
    (youthCategorySlugs.has(normalizedCategorySlug) && postCategoryName === "mladez")
  );
}

export function filterPostsByCategory(
  posts: Post[],
  categorySlug: string,
) {
  return posts.filter((post) => isPostInCategory(post, categorySlug));
}

export async function getPostDetail(
  clubSlug: string,
  slug: string,
): Promise<Post> {
  const res = await fetch(
    `${API_URL}/public/posts/${clubSlug}/${slug}/`,
    getApiFetchOptions(60)
  );

  if (!res.ok) {
    throw new Error(`Nepodarilo sa načítať detail článku: ${res.status}`);
  }

  return res.json();
}
