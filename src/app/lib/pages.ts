import { API_URL, getApiFetchOptions } from "./api";

export type PageSection = {
  id: number;
  section_type: string;
  title: string;
  pre_title: string;
  content?: string;
  image?: string | null;
  image_url?: string | null;
  url?: string;
  file?: string | null;
  file_url?: string | null;
  order: number;
  is_active: boolean;
  hide_when_empty: boolean;
  config: Record<string, unknown>;
  items?: PageSectionItem[];
  contact_items?: PageSectionContactItem[];
};

export type PageSectionItem = {
  id: number;
  title: string;
  url: string;
  file?: string | null;
  file_url?: string | null;
  order: number;
  is_active: boolean;
};

export type PageSectionContactItem = {
  id: number;
  contact_type: "phone" | "email" | "iban" | "address" | "person" | "web" | "text";
  value: string;
  url: string;
  order: number;
  is_active: boolean;
};

export type ClubPage = {
  id: number;
  title: string;
  slug: string;
  menu_title: string;
  page_type: string;
  is_published: boolean;
  club_slug: string;
  public_path?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string | null;
  team_category?: {
    id: number;
    name: string;
    slug: string;
    category_subname?: string;
    league_name?: string;
  } | null;
  sections: PageSection[];
};

export type NavigationPage = {
  id: number;
  title: string;
  menu_title: string;
  slug: string;
  page_type: string;
  navigation_order: number;
  menu_group?: string;
  menu_group_title?: string;
  url: string;
};

export type NavigationDropdown = {
  title: string;
  group?: string;
  items: NavigationPage[];
};

export type ClubNavigation = {
  main: NavigationPage[];
  dropdowns: NavigationDropdown[];
  cta: NavigationPage | null;
  footer: NavigationPage[];
};

type NavigationPageResponse = Omit<NavigationPage, "url"> & {
  url?: string | null;
};

type ClubNavigationResponse = {
  main?: NavigationPageResponse[];
  dropdowns?: Array<{
    title?: string;
    group?: string;
    items?: NavigationPageResponse[];
  }>;
  cta?: NavigationPageResponse | null;
  footer?: NavigationPageResponse[];
  header?: NavigationPageResponse[];
  header_pages?: NavigationPageResponse[];
  footer_pages?: NavigationPageResponse[];
};

function getPageUrl(page: NavigationPageResponse) {
  if (page.url) return page.url;
  if (page.page_type === "home" || page.slug === "home") return "/";
  if (page.page_type === "about" || page.slug === "about" || page.slug === "o-klube") {
    return "/o-klube";
  }
  if (page.page_type === "contact" || page.slug === "kontakt") return "/kontakt";
  if (
    page.page_type === "recruitment" ||
    page.slug === "pridaj-sa" ||
    page.slug === "pridaj_sa"
  ) {
    return "/pridaj_sa";
  }
  if (page.page_type === "category" || page.page_type === "team_category") {
    return `/kategorie/${page.slug}`;
  }
  if (page.page_type === "custom") return `/stranka/${page.slug}`;

  return `/${page.slug}`;
}

function normalizeNavigationPage(page: NavigationPageResponse): NavigationPage {
  return {
    ...page,
    url: getPageUrl(page),
  };
}

export function getNavigationLabel(page: NavigationPage) {
  return page.menu_title || page.title;
}

export function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

export function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

export function getActiveSortedSections(
  sections: PageSection[] | undefined,
  fallbackSections: PageSection[],
) {
  const source = sections && sections.length > 0 ? sections : fallbackSections;
  const seenSectionTypes = new Set<string>();

  return [...source]
    .filter((section) => section.is_active)
    .sort((a, b) => a.order - b.order || a.id - b.id)
    .filter((section) => {
      if (seenSectionTypes.has(section.section_type)) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(
            `Duplicate PageSection ${section.section_type} is configured and was skipped.`,
          );
        }

        return false;
      }

      seenSectionTypes.add(section.section_type);
      return true;
    });
}

export function warnUnsupportedSection(route: string, sectionType: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `Section ${sectionType} is configured but not implemented on ${route}.`,
    );
  }
}

export async function getClubPageBySlug(
  clubSlug: string,
  pageSlug: string,
): Promise<ClubPage | null> {
  try {
    const response = await fetch(
      `${API_URL}/public/pages/${clubSlug}/by-slug/${pageSlug}/`,
      getApiFetchOptions(60),
    );

    if (!response.ok) {
      console.error(`Nepodarilo sa načítať stránku ${pageSlug}:`, response.status);
      return null;
    }

    return (await response.json()) as ClubPage;
  } catch (error) {
    console.error(`Chyba pri načítaní stránky ${pageSlug}:`, error);
    return null;
  }
}

export async function getClubNavigation(
  clubSlug: string,
): Promise<ClubNavigation | null> {
  try {
    const response = await fetch(
      `${API_URL}/public/pages/${clubSlug}/navigation/`,
      getApiFetchOptions(300),
    );

    if (!response.ok) {
      console.error("Nepodarilo sa načítať navigáciu:", response.status);
      return null;
    }

    const data = (await response.json()) as ClubNavigationResponse;
    const main = data.main ?? data.header ?? data.header_pages ?? [];
    const footer = data.footer ?? data.footer_pages ?? [];

    return {
      main: main.map(normalizeNavigationPage),
      dropdowns: (data.dropdowns ?? []).map((dropdown) => ({
        title: dropdown.title || "Mládež",
        group: dropdown.group,
        items: (dropdown.items ?? []).map(normalizeNavigationPage),
      })),
      cta: data.cta ? normalizeNavigationPage(data.cta) : null,
      footer: footer.map(normalizeNavigationPage),
    };
  } catch (error) {
    console.error("Nepodarilo sa načítať navigáciu:", error);
    return null;
  }
}
