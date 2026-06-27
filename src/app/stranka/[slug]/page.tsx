import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { getClub, getClubLinkLogoUrl } from "@/app/lib/club";
import { getActiveClubLinks, getClubLinkIcon } from "@/app/lib/clubLinks";
import { getClubContact } from "@/app/lib/contact";
import {
  getClubDocuments,
  getClubDocumentUrl,
  type ClubDocument,
} from "@/app/lib/documents";
import {
  getClubPageBySlug,
  getSectionPreTitle,
  getSectionTitle,
  warnUnsupportedSection,
  type ClubPage,
  type PageSection,
} from "@/app/lib/pages";
import { normalizeMediaUrl } from "@/app/lib/api";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "@/app/lib/seo";
import styles from "./stranka.module.css";

const CLUB_SLUG = "atu-kosice";
const SUPPORTED_PAGE_TYPES = new Set(["custom", "standard"]);

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ManualLinkItem = {
  id: string | number;
  title: string;
  url: string;
};

type ManualDocumentItem = ManualLinkItem & {
  meta: string;
};

function getConfiguredIds(config: Record<string, unknown>, key: string) {
  const value = config[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
}

function filterByConfiguredIds<T extends { id: number }>(
  items: T[],
  ids: number[],
) {
  if (ids.length === 0) {
    return items;
  }

  const allowedIds = new Set(ids);
  return items.filter((item) => allowedIds.has(item.id));
}

function getManualItems(config: Record<string, unknown>, key: string) {
  const value = config[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const record = item as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title.trim() : "";
      const url = typeof record.url === "string" ? record.url.trim() : "";

      if (!title || !url) {
        return null;
      }

      return {
        id: `${key}-${index}-${title}`,
        title,
        url,
        meta: typeof record.meta === "string" ? record.meta.trim() : "",
      };
    })
    .filter(Boolean) as ManualDocumentItem[];
}

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function getDocumentMeta(document: ClubDocument) {
  const fileUrl = document.file_url || document.file || "";
  const cleanUrl = fileUrl.split("?")[0]?.split("#")[0] || "";
  const extension = cleanUrl.includes(".")
    ? cleanUrl.split(".").pop()?.toUpperCase()
    : "PDF";

  return extension || "PDF";
}

function getUrlMeta(url: string) {
  const cleanUrl = url.split("?")[0]?.split("#")[0] || "";
  const extension = cleanUrl.includes(".")
    ? cleanUrl.split(".").pop()?.toUpperCase()
    : "";

  return extension || "URL";
}

function getSectionImageUrl(section: PageSection) {
  if (section.image_url) return normalizeMediaUrl(section.image_url, "");
  if (section.image) return normalizeMediaUrl(section.image, "");

  return "";
}

function getActiveItems(section: PageSection) {
  return [...(section.items ?? [])]
    .filter((item) => item.is_active)
    .sort((a, b) => a.order - b.order || Number(a.id) - Number(b.id));
}

function getCustomDocumentItems(section: PageSection) {
  return getActiveItems(section)
    .map((item) => {
      const url = item.file_url
        ? normalizeMediaUrl(item.file_url, "")
        : item.file
          ? normalizeMediaUrl(item.file, "")
          : "";

      if (!url) {
        return null;
      }

      return {
        id: item.id,
        title: item.title,
        url,
        meta: getUrlMeta(url),
      };
    })
    .filter(Boolean) as ManualDocumentItem[];
}

async function getCustomPage(slug: string): Promise<ClubPage | null> {
  const page = await getClubPageBySlug(CLUB_SLUG, slug);

  if (!page || !SUPPORTED_PAGE_TYPES.has(page.page_type)) {
    return null;
  }

  return page;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCustomPage(slug);

  if (!page) {
    return {
      title: "Stránka neexistuje",
    };
  }

  const title = page.meta_title?.trim() || page.title;
  const description = page.meta_description?.trim() || undefined;
  const path = page.public_path || `/stranka/${page.slug}`;
  const ogImage = page.og_image
    ? normalizeMediaUrl(page.og_image, DEFAULT_OG_IMAGE_URL)
    : DEFAULT_OG_IMAGE_URL;

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(path),
      type: "website",
      images: [ogImage],
    },
  };
}

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getCustomPage(slug);

  if (!page) {
    notFound();
  }

  const [club, documents, contact] = await Promise.all([
    getClub(CLUB_SLUG),
    getClubDocuments(CLUB_SLUG),
    getClubContact(CLUB_SLUG),
  ]);

  const activeDocuments = documents
    .filter((document) => document.is_active)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "sk"));

  const activeLinks = getActiveClubLinks(club?.links);

  const sections = [...page.sections]
    .filter((section) => section.is_active)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  const renderHeroSection = (section: PageSection) => {
    const imageUrl = getSectionImageUrl(section);
    const title = getSectionTitle(section, page.title);

    return (
      <section key={section.id} className={styles.heroSection}>
        <div className={styles.heroInner}>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1300px"
              className={styles.heroImage}
            />
          )}

          <div className={styles.heroShade} />

          {!imageUrl && (
            <Image
              src="/logo/znak_atu_nove.svg"
              alt=""
              width={520}
              height={520}
              className={styles.heroWatermark}
              aria-hidden="true"
            />
          )}

          <div className={styles.heroContent}>
            {section.pre_title?.trim() && (
              <span className="preTitle">{section.pre_title}</span>
            )}
            <h1 className={styles.heroTitle}>{title}</h1>
          </div>
        </div>
      </section>
    );
  };

  const renderCustomTextSection = (section: PageSection) => {
    const content = section.content?.trim();

    if (section.hide_when_empty && !content) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            {section.pre_title?.trim() && (
              <span className="preTitle">{section.pre_title}</span>
            )}
            {section.title?.trim() && (
              <h2 className="sectionTitle">{section.title}</h2>
            )}
          </div>
        </div>

        <div className={styles.textPanel}>
          {content ? (
            <div className={styles.textContent}>{content}</div>
          ) : (
            <p className={styles.emptyText}>Obsah bude doplnený čoskoro.</p>
          )}
        </div>
      </section>
    );
  };

  const renderLinksSection = (section: PageSection) => {
    const selectedIds = getConfiguredIds(section.config, "link_ids");
    const links =
      selectedIds.length > 0
        ? filterByConfiguredIds(activeLinks, selectedIds)
        : activeLinks;

    if (section.hide_when_empty && links.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Odkazy")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Klubové odkazy")}
            </h2>
          </div>
        </div>

        {links.length > 0 ? (
          <div className={styles.linkGrid}>
            {links.map((link) => {
              const isBackendLink = "icon_type" in link;
              const logoUrl = isBackendLink ? getClubLinkLogoUrl(link) : "";

              return (
                <a
                  key={link.id}
                  className={styles.linkCard}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.linkIcon} aria-hidden="true">
                    {logoUrl ? (
                      <Image src={logoUrl} alt="" width={34} height={34} />
                    ) : (
                      getClubLinkIcon(isBackendLink ? link.icon_type : "custom")
                    )}
                  </span>
                  <span className={styles.linkContent}>
                    <strong>{link.title}</strong>
                    <small>Otvoriť odkaz</small>
                  </span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyText}>Odkazy budú doplnené čoskoro.</p>
        )}
      </section>
    );
  };

  const renderCustomLinksSection = (section: PageSection) => {
    const itemLinks = getActiveItems(section)
      .filter((item) => item.url)
      .slice(0, 30);

    const manualLinks = getManualItems(section.config, "links").slice(0, 30);
    const links = itemLinks.length > 0 ? itemLinks : manualLinks;

    if (section.hide_when_empty && links.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Odkazy")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Vlastné odkazy")}
            </h2>
          </div>
        </div>

        {links.length > 0 ? (
          <div className={styles.linkGrid}>
            {links.map((link) => (
              <a
                key={link.id}
                className={styles.linkCard}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.linkIcon} aria-hidden="true">
                  {getClubLinkIcon("custom")}
                </span>
                <span className={styles.linkContent}>
                  <strong>{link.title}</strong>
                  <small>Otvoriť odkaz</small>
                </span>
                <span className={styles.cardArrow} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Odkazy budú doplnené čoskoro.</p>
        )}
      </section>
    );
  };

  const renderDocumentsSection = (section: PageSection) => {
    const selectedIds = getConfiguredIds(section.config, "document_ids");
    const documentsToRender =
      selectedIds.length > 0
        ? filterByConfiguredIds(activeDocuments, selectedIds)
        : activeDocuments;

    if (section.hide_when_empty && documentsToRender.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Dokumenty")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Klubové dokumenty")}
            </h2>
          </div>
        </div>

        {documentsToRender.length > 0 ? (
          <div className={styles.documentGrid}>
            {documentsToRender.map((document) => {
              const documentUrl = getClubDocumentUrl(document);

              return (
                <a
                  key={document.id}
                  className={styles.documentCard}
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.documentBadge} aria-hidden="true">
                    {getDocumentMeta(document)}
                  </span>
                  <span className={styles.linkContent}>
                    <strong>{document.title}</strong>
                    <small>Otvoriť dokument</small>
                  </span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyText}>Dokumenty budú doplnené čoskoro.</p>
        )}
      </section>
    );
  };

  const renderCustomDocumentsSection = (section: PageSection) => {
    const itemDocuments = getCustomDocumentItems(section).slice(0, 30);
    const manualDocuments = getManualItems(section.config, "documents").slice(0, 30);
    const documentsToRender =
      itemDocuments.length > 0 ? itemDocuments : manualDocuments;

    if (section.hide_when_empty && documentsToRender.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Dokumenty")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Vlastné dokumenty")}
            </h2>
          </div>
        </div>

        {documentsToRender.length > 0 ? (
          <div className={styles.documentGrid}>
            {documentsToRender.map((document) => (
              <a
                key={document.id}
                className={styles.documentCard}
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.documentBadge} aria-hidden="true">
                  {document.meta || "PDF"}
                </span>
                <span className={styles.linkContent}>
                  <strong>{document.title}</strong>
                  <small>Otvoriť dokument</small>
                </span>
                <span className={styles.cardArrow} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Dokumenty budú doplnené čoskoro.</p>
        )}
      </section>
    );
  };

  const renderContactSection = (section: PageSection) => {
    if (section.hide_when_empty && !contact) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, contact?.section_label || "Kontakt")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, contact?.title || "Kontakt")}
            </h2>
          </div>
        </div>

        <div className={styles.contactPanel}>
          {contact ? (
            <div className={styles.contactList}>
              {contact.address && (
                <div className={styles.contactItem}>
                  <span>Adresa</span>
                  <p>{contact.address}</p>
                </div>
              )}

              {contact.email && (
                <div className={styles.contactItem}>
                  <span>Email</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              )}

              {contact.phone && (
                <div className={styles.contactItem}>
                  <span>Telefón</span>
                  <a href={getPhoneHref(contact.phone)}>{contact.phone}</a>
                </div>
              )}

              {contact.note && (
                <div className={styles.contactItem}>
                  <span>Poznámka</span>
                  <p>{contact.note}</p>
                </div>
              )}
            </div>
          ) : (
            <p className={styles.emptyText}>
              Kontaktné údaje sa momentálne nepodarilo načítať.
            </p>
          )}
        </div>
      </section>
    );
  };

  const renderGallerySection = (section: PageSection) => {
    const content = section.content?.trim();

    if (section.hide_when_empty && !content) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Galéria")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Galéria")}
            </h2>
          </div>
        </div>

        <div className={styles.textPanel}>
          {content ? (
            <div className={styles.textContent}>{content}</div>
          ) : (
            <p className={styles.emptyText}>Galéria bude doplnená čoskoro.</p>
          )}
        </div>
      </section>
    );
  };

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "hero":
        return renderHeroSection(section);

      case "custom_text":
        return renderCustomTextSection(section);

      case "links":
        return renderLinksSection(section);

      case "custom_links":
        return renderCustomLinksSection(section);

      case "documents":
        return renderDocumentsSection(section);

      case "custom_documents":
        return renderCustomDocumentsSection(section);

      case "contact":
        return renderContactSection(section);

      case "gallery":
        return renderGallerySection(section);

      default:
        warnUnsupportedSection(`/stranka/${page.slug}`, section.section_type);
        return null;
    }
  };

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.content}>
        {sections.length > 0 ? (
          sections.map((section) => renderSection(section))
        ) : (
          <section className={styles.heroSection}>
            <div className={styles.heroInner}>
              <h1 className={styles.heroTitle}>{page.title}</h1>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}