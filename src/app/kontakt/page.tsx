import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactMap from "./ContactMap";
import styles from "./kontakt.module.css";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";
import { getClubContact } from "../lib/contact";
import { getClubDocuments, getClubDocumentUrl } from "../lib/documents";
import { API_URL, getApiFetchOptions } from "../lib/api";

const CLUB_SLUG = "atu-kosice";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontakt na florbalový klub FaBK ATU Košice. Nájdite adresu haly, email, telefón, IBAN a mapu športoviska na Jedlíkovej ulici v Košiciach.",
  alternates: {
    canonical: absoluteUrl("/kontakt"),
  },
  openGraph: {
    title: `Kontakt | ${SITE_NAME}`,
    description:
      "Kontakt na florbalový klub FaBK ATU Košice – adresa, email, telefón, IBAN a mapa športoviska.",
    url: absoluteUrl("/kontakt"),
    type: "website",
    images: [DEFAULT_OG_IMAGE_URL],
  },
};

type ContactLocation = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type PageSection = {
  id: number;
  section_type: string;
  title: string;
  pre_title: string;
  order: number;
  is_active: boolean;
  hide_when_empty: boolean;
  config: Record<string, unknown>;
};

type ClubPage = {
  id: number;
  title: string;
  slug: string;
  menu_title: string;
  page_type: string;
  is_published: boolean;
  club_slug: string;
  sections: PageSection[];
};

const fallbackSections: PageSection[] = [
  {
    id: -1,
    section_type: "contact",
    title: "FaBK ATU Košice",
    pre_title: "Kontakt",
    order: 1,
    is_active: true,
    hide_when_empty: false,
    config: {},
  },
  {
    id: -2,
    section_type: "documents",
    title: "Dôležité dokumenty",
    pre_title: "Dokumenty",
    order: 2,
    is_active: true,
    hide_when_empty: true,
    config: {},
  },
];

async function getContactPage(): Promise<ClubPage | null> {
  try {
    const res = await fetch(
      `${API_URL}/public/pages/${CLUB_SLUG}/by-slug/kontakt/`,
      getApiFetchOptions(60)
    );

    if (!res.ok) {
      console.error(`Nepodarilo sa načítať stránku Kontakt: ${res.status}`);
      return null;
    }

    return (await res.json()) as ClubPage;
  } catch (error) {
    console.error("Chyba pri načítaní stránky Kontakt:", error);
    return null;
  }
}

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function getDocumentMeta(fileUrl: string) {
  const cleanUrl = fileUrl.split("?")[0]?.split("#")[0] || "";
  const extension = cleanUrl.includes(".")
    ? cleanUrl.split(".").pop()?.toUpperCase()
    : "PDF";

  return extension || "PDF";
}

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

export default async function KontaktPage() {
  const [page, contact, documents] = await Promise.all([
    getContactPage(),
    getClubContact(CLUB_SLUG),
    getClubDocuments(CLUB_SLUG),
  ]);

  const sections =
    page?.sections && page.sections.length > 0
      ? [...page.sections].sort((a, b) => a.order - b.order || a.id - b.id)
      : fallbackSections;

  const contactLocations: Record<string, ContactLocation> = contact
    ? {
        main: {
          name: contact.map_label || "FaBK ATU Košice",
          address: contact.map_address || contact.address,
          lat: Number(contact.latitude),
          lng: Number(contact.longitude),
        },
      }
    : {};

  const renderContactSection = (section: PageSection) => {
    if (section.hide_when_empty && !contact) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="resultsHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Kontakt")}
            </span>
            <h1 className="sectionTitle">
              {getSectionTitle(section, "FaBK ATU Košice")}
            </h1>
          </div>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.contactInfoCard}>
            {contact ? (
              <div className={styles.contactInfoList}>
                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Adresa</span>
                  <p className={styles.contactInfoText}>{contact.address}</p>
                </div>

                {contact.chairman_name && (
                  <div className={styles.contactInfoItem}>
                    <span className={styles.contactInfoLabel}>Predseda</span>
                    <p className={styles.contactInfoText}>
                      {contact.chairman_name}
                    </p>
                  </div>
                )}

                {contact.email && (
                  <div className={styles.contactInfoItem}>
                    <span className={styles.contactInfoLabel}>Email</span>
                    <a
                      className={styles.contactInfoLink}
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </a>
                  </div>
                )}

                {contact.phone && (
                  <div className={styles.contactInfoItem}>
                    <span className={styles.contactInfoLabel}>Telefón</span>
                    <a
                      className={styles.contactInfoLink}
                      href={getPhoneHref(contact.phone)}
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}

                {contact.iban && (
                  <div className={styles.contactInfoItem}>
                    <span className={styles.contactInfoLabel}>IBAN</span>
                    <p className={styles.contactInfoText}>{contact.iban}</p>
                  </div>
                )}

                {contact.note && (
                  <div className={styles.contactInfoItem}>
                    <span className={styles.contactInfoLabel}>Poznámka</span>
                    <p className={styles.contactInfoText}>{contact.note}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.contactInfoList}>
                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Kontakt</span>
                  <p className={styles.contactInfoText}>
                    Kontaktné údaje sa momentálne nepodarilo načítať.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className={styles.contactMapCard}>
            <div className={styles.contactMapWrap}>
              <ContactMap
                locations={contactLocations}
                activeLocation={contact ? "main" : null}
              />
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderDocumentsSection = (section: PageSection) => {
    if (section.hide_when_empty && documents.length === 0) {
      return null;
    }

    return (
      <section key={section.id} className="sectionContainer">
        <div className="resultsHeader">
          <div>
            <span className="preTitle">
              {getSectionPreTitle(section, "Dokumenty")}
            </span>
            <h2 className="sectionTitle">
              {getSectionTitle(section, "Dôležité dokumenty")}
            </h2>
          </div>
        </div>

        <div className={styles.documentsSection}>
          {documents.length > 0 ? (
            <div className={styles.documentsGrid}>
              {documents.map((document) => {
                const documentUrl = getClubDocumentUrl(document);
                const documentMeta = getDocumentMeta(
                  document.file_url || document.file || ""
                );

                return (
                  <a
                    key={document.id}
                    className={styles.documentCard}
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.documentIcon} aria-hidden="true">
                      {documentMeta}
                    </span>

                    <span className={styles.documentContent}>
                      <strong>{document.title}</strong>
                      <small>Otvoriť dokument</small>
                    </span>

                    <span className={styles.documentArrow} aria-hidden="true">
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className={styles.contactInfoCard}>
              <p className={styles.contactInfoText}>
                Dokumenty budú doplnené čoskoro.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderSection = (section: PageSection) => {
    switch (section.section_type) {
      case "contact":
        return renderContactSection(section);
      case "documents":
        return renderDocumentsSection(section);
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        {sections.map((section) => renderSection(section))}
      </main>

      <Footer />
    </div>
  );
}
