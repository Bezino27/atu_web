import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { IconType } from "react-icons";
import {
  PiBank,
  PiEnvelopeSimple,
  PiGlobe,
  PiMapPin,
  PiNotePencil,
  PiPhone,
  PiUser,
} from "react-icons/pi";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ContactMap from "@/app/kontakt/ContactMap";
import { getClubLinkLogoUrl, type ClubLink } from "@/app/lib/club";
import { getClubLinkIcon } from "@/app/lib/clubLinks";
import { getClubDocumentUrl, type ClubDocument } from "@/app/lib/documents";
import {
  getClubPageBySlug,
  getSectionPreTitle,
  getSectionTitle,
  warnUnsupportedSection,
  type ClubPage,
  type PageSection,
} from "@/app/lib/pages";
import { normalizeHtmlMediaUrls, normalizeMediaUrl } from "@/app/lib/api";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "@/app/lib/seo";
import contactStyles from "@/app/kontakt/kontakt.module.css";
import styles from "./stranka.module.css";
import richTextStyles from "@/app/styles/rich-text.module.css";

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

type ContactSectionData = {
  address: string;
  chairmanName: string;
  email: string;
  phone: string;
  iban: string;
  note: string;
  mapLabel: string;
  mapAddress: string;
  latitude: number | null;
  longitude: number | null;
};

type ContactDisplayItem = {
  id: string | number;
  type: string;
  label: string;
  value: string;
  href: string;
};

type ContactMapLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

function getConfigString(config: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = config[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
}

function getConfigNumber(config: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = config[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number.parseFloat(value.replace(",", "."));

      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

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

function getContactSectionData(section: PageSection): ContactSectionData {
  const { config } = section;

  return {
    address: getConfigString(config, ["address", "adresa"]),
    chairmanName: getConfigString(config, [
      "chairman_name",
      "chairmanName",
      "predseda",
    ]),
    email: getConfigString(config, ["email", "mail"]),
    phone: getConfigString(config, ["phone", "telefon", "telefón"]),
    iban: getConfigString(config, ["iban", "IBAN"]),
    note:
      getConfigString(config, ["note", "poznamka", "poznámka"]) ||
      section.content?.trim() ||
      "",
    mapLabel: getConfigString(config, ["map_label", "mapLabel", "map_name"]),
    mapAddress: getConfigString(config, [
      "map_address",
      "mapAddress",
      "map_adresa",
    ]),
    latitude: getConfigNumber(config, ["latitude", "lat"]),
    longitude: getConfigNumber(config, ["longitude", "lng", "lon"]),
  };
}

function hasContactSectionData(contact: ContactSectionData) {
  return Boolean(
    contact.address ||
      contact.chairmanName ||
      contact.email ||
      contact.phone ||
      contact.iban ||
      contact.note,
  );
}

function hasContactMap(contact: ContactSectionData) {
  return contact.latitude !== null && contact.longitude !== null;
}

function getContactTypeLabel(type: string) {
  if (type === "phone") return "Telefón";
  if (type === "email") return "Email";
  if (type === "iban") return "IBAN";
  if (type === "address") return "Adresa";
  if (type === "person") return "Osoba";
  if (type === "web") return "Web";
  return "Poznámka";
}

function getContactIcon(type: string): IconType {
  if (type === "phone") return PiPhone;
  if (type === "email") return PiEnvelopeSimple;
  if (type === "iban") return PiBank;
  if (type === "address") return PiMapPin;
  if (type === "person") return PiUser;
  if (type === "web") return PiGlobe;
  return PiNotePencil;
}

function getContactHref(type: string, value: string, url: string) {
  if (url) return url;
  if (type === "phone") return getPhoneHref(value);
  if (type === "email") return `mailto:${value}`;
  if (type === "web" && value) return value;

  return "";
}

function getFallbackContactItems(contact: ContactSectionData): ContactDisplayItem[] {
  return [
    {
      id: "address",
      type: "address",
      label: "Adresa",
      value: contact.address,
      href: "",
    },
    {
      id: "chairman",
      type: "person",
      label: "Predseda",
      value: contact.chairmanName,
      href: "",
    },
    {
      id: "email",
      type: "email",
      label: "Email",
      value: contact.email,
      href: getContactHref("email", contact.email, ""),
    },
    {
      id: "phone",
      type: "phone",
      label: "Telefón",
      value: contact.phone,
      href: getContactHref("phone", contact.phone, ""),
    },
    {
      id: "iban",
      type: "iban",
      label: "IBAN",
      value: contact.iban,
      href: "",
    },
    {
      id: "note",
      type: "text",
      label: "Poznámka",
      value: contact.note,
      href: "",
    },
  ].filter((item) => item.value);
}

function getContactDisplayItems(section: PageSection) {
  const contactItems = [...(section.contact_items ?? [])]
    .filter((item) => item.is_active)
    .sort((a, b) => a.order - b.order || Number(a.id) - Number(b.id))
    .map((item) => {
      const value = item.value?.trim() || item.url?.trim() || "";
      const url = item.url?.trim() || "";

      if (!value && !url) {
        return null;
      }

      return {
        id: item.id,
        type: item.contact_type,
        label: getContactTypeLabel(item.contact_type),
        value,
        href: getContactHref(item.contact_type, value, url),
      };
    })
    .filter(Boolean) as ContactDisplayItem[];

  if (contactItems.length > 0) {
    return contactItems;
  }

  return getFallbackContactItems(getContactSectionData(section));
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
    .filter((item) => item.is_active !== false)
    .sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || Number(a.id) - Number(b.id),
    );
}

function hasSectionHeaderText(section: PageSection) {
  return Boolean(section.pre_title?.trim() || section.title?.trim());
}

function renderOptionalSectionHeader(section: PageSection) {
  const preTitle = section.pre_title?.trim();
  const title = section.title?.trim();

  if (!hasSectionHeaderText(section)) {
    return null;
  }

  return (
    <div className="sectionHeader">
      <div>
        {preTitle && <span className="preTitle">{preTitle}</span>}
        {title && <h2 className="sectionTitle">{title}</h2>}
      </div>
    </div>
  );
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

function getClubLinkItems(section: PageSection): ClubLink[] {
  return getActiveItems(section)
    .filter((item) => item.url)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url || "",
      icon_type: item.icon_type || "custom",
      logo: item.logo ?? null,
      logo_url: item.logo_url ?? null,
      order: item.order ?? 0,
      is_active: item.is_active !== false,
    }));
}

function getClubDocumentItems(section: PageSection): ClubDocument[] {
  return getActiveItems(section)
    .filter((item) => item.file_url || item.file)
    .map((item) => ({
      id: item.id,
      title: item.title,
      file: item.file || "",
      file_url: item.file_url ?? null,
      order: item.order ?? 0,
      is_active: item.is_active !== false,
      updated_at: "",
    }));
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

  const sections = [...page.sections]
    .filter((section) => section.is_active)
    .sort((a, b) => a.order - b.order || a.id - b.id);

  const renderHeroSection = (section: PageSection) => {
    const imageUrl = getSectionImageUrl(section);
    const title = getSectionTitle(section, page.title);

    return (
      <section key={section.id} className={styles.heroSection}>
        <div
          className={`${styles.heroInner} ${
            imageUrl ? styles.heroInnerWithImage : ""
          }`}
        >
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

          {!imageUrl && <div className={styles.heroShade} />}

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

          {!imageUrl && (
            <div className={styles.heroContent}>
              {section.pre_title?.trim() && (
                <span className="preTitle">{section.pre_title}</span>
              )}
              <h1 className={styles.heroTitle}>{title}</h1>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderCustomTextSection = (section: PageSection) => {
    const content = normalizeHtmlMediaUrls(section.content?.trim() || "");

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
            <div
              className={`${styles.textContent} ${richTextStyles.richTextContent}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className={styles.emptyText}>Obsah bude doplnený čoskoro.</p>
          )}
        </div>
      </section>
    );
  };

  const renderLinksSection = (section: PageSection) => {
    const selectedIds = getConfiguredIds(section.config, "link_ids");
    const sectionLinks = getClubLinkItems(section);
    const links =
      selectedIds.length > 0
        ? filterByConfiguredIds(sectionLinks, selectedIds)
        : sectionLinks;

    if (
      links.length === 0 &&
      (section.hide_when_empty || !hasSectionHeaderText(section))
    ) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        {renderOptionalSectionHeader(section)}

        {links.length > 0 ? (
          <div className={styles.linkGrid}>
            {links.map((link) => {
              const logoUrl = getClubLinkLogoUrl(link);

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
                      getClubLinkIcon(link.icon_type || "custom")
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

    if (
      links.length === 0 &&
      (section.hide_when_empty || !hasSectionHeaderText(section))
    ) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        {renderOptionalSectionHeader(section)}

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
    const sectionDocuments = getClubDocumentItems(section);
    const documentsToRender =
      selectedIds.length > 0
        ? filterByConfiguredIds(sectionDocuments, selectedIds)
        : sectionDocuments;

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
    const contact = getContactSectionData(section);
    const contactItems = getContactDisplayItems(section);
    const hasContact = contactItems.length > 0 || hasContactSectionData(contact);
    const hasMap = hasContactMap(contact);
    const contactLocations: Record<string, ContactMapLocation> = hasMap
      ? {
          main: {
            name: contact.mapLabel || getSectionTitle(section, "Kontakt"),
            address: contact.mapAddress || contact.address,
            lat: contact.latitude as number,
            lng: contact.longitude as number,
          },
        }
      : {};

    if (section.hide_when_empty && !hasContact) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="sectionHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Kontakt")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Kontakt")}
            </h2>
          </div>
        </div>

        <div className={hasMap ? styles.contactGrid : undefined}>
          <div className={styles.contactInfoCard}>
            {hasContact ? (
              <div className={styles.contactInfoList}>
                {contactItems.map((item) => (
                  <div key={item.id} className={styles.contactInfoItem}>
                    <div className={styles.contactInfoContent}>
                      <span className={styles.contactInfoLabel}>{item.label}</span>
                      {item.href ? (
                        <a className={styles.contactInfoLink} href={item.href}>
                          {item.value}
                        </a>
                      ) : (
                        <p className={styles.contactInfoText}>{item.value}</p>
                      )}
                    </div>
                    <span className={styles.contactInfoIcon} aria-hidden="true">
                      {(() => {
                        const Icon = getContactIcon(item.type);
                        return <Icon />;
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>
                Kontaktné údaje budú doplnené čoskoro.
              </p>
            )}
          </div>

          {hasMap && (
            <div className={styles.contactMapCard}>
              <div className={contactStyles.contactMapWrap}>
                <ContactMap
                  locations={contactLocations}
                  activeLocation="main"
                />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderGallerySection = (section: PageSection) => {
    const content = normalizeHtmlMediaUrls(section.content?.trim() || "");

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
            <div
              className={`${styles.textContent} ${richTextStyles.richTextContent}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
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
