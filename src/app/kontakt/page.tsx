import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PiArrowRight } from "react-icons/pi";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactMap from "./ContactMap";
import CopyEmailButton from "../components/CopyEmailButton";
import styles from "./kontakt.module.css";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";
import { getClubContact } from "../lib/contact";
import { getClubDocuments, getClubDocumentUrl } from "../lib/documents";
import { getClub, getClubLinkLogoUrl } from "../lib/club";
import { getActiveClubLinks, getClubLinkIcon } from "../lib/clubLinks";
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

function getSectionPreTitle(section: PageSection, fallback: string) {
  return section.pre_title?.trim() || fallback;
}

function getSectionTitle(section: PageSection, fallback: string) {
  return section.title?.trim() || fallback;
}

export default async function KontaktPage() {
  const [page, contact, documents, club] = await Promise.all([
    getContactPage(),
    getClubContact(CLUB_SLUG),
    getClubDocuments(CLUB_SLUG),
    getClub(CLUB_SLUG),
  ]);

  const socialLinks = getActiveClubLinks(club?.links).filter((link) =>
    ["facebook", "instagram", "youtube"].includes(link.icon_type)
  );

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

        <div className={styles.contactShowcase}>
          <div className={styles.contactMapLayer}>
            <div className={styles.contactMapWrap}>
              <ContactMap
                locations={contactLocations}
                activeLocation={contact ? "main" : null}
              />
            </div>
          </div>

          <div className={styles.contactMapFade} aria-hidden="true" />

          <div className={styles.contactContent}>
            {contact ? (
              <>
                <div className={styles.contactIntro}>
                  <Link
                    href="/pridaj_sa#kontakt"
                    className={styles.contactIntroLink}
                    aria-label="Prejsť na náborový formulár"
                  >
                    <h2 className={styles.contactIntroTitle}>Ozvite sa nám</h2>
                    <span className={styles.contactIntroArrow} aria-hidden="true">
                      <PiArrowRight />
                    </span>
                  </Link>

                  <p className={styles.contactIntroText}>
                    Otázky ohľadom klubu, spolupráce alebo náboru? Radi vám odpovieme.
                  </p>
                </div>

                <div className={styles.contactInfoList}>
                  <div className={styles.contactInfoItem}>
                    <div className={styles.contactInfoBody}>
                      <span className={styles.contactInfoLabel}>Adresa</span>
                      <p className={styles.contactInfoText}>{contact.address}</p>
                    </div>
                  </div>

                  {contact.chairman_name && (
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactInfoBody}>
                        <span className={styles.contactInfoLabel}>Predseda</span>
                        <p className={styles.contactInfoText}>
                          {contact.chairman_name}
                        </p>
                      </div>
                    </div>
                  )}

                  {contact.email && (
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactInfoBody}>
                        <span className={styles.contactInfoLabel}>Email</span>
                        <a
                          className={styles.contactInfoLink}
                          href={`mailto:${contact.email}`}
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.phone && (
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactInfoBody}>
                        <span className={styles.contactInfoLabel}>Telefón</span>
                        <a
                          className={styles.contactInfoLink}
                          href={getPhoneHref(contact.phone)}
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.iban && (
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactInfoBody}>
                        <span className={styles.contactInfoLabel}>IBAN</span>
                        <p className={styles.contactInfoText}>{contact.iban}</p>
                      </div>
                    </div>
                  )}

                  {contact.note && (
                    <div className={styles.contactInfoItem}>
                      <div className={styles.contactInfoBody}>
                        <span className={styles.contactInfoLabel}>Poznámka</span>
                        <p className={styles.contactInfoText}>{contact.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {contact.email && (
                  <CopyEmailButton
                    email={contact.email}
                    className={styles.contactCopyButton}
                  />
                )}

                {socialLinks.length > 0 && (
                  <div className={styles.contactSocials}>
                    <span className={styles.contactSocialsLabel}>
                      Sledujte nás
                    </span>
                    <div className={styles.contactSocialLinks}>
                      {socialLinks.map((socialLink) => {
                        const logoUrl = getClubLinkLogoUrl(socialLink);

                        return (
                          <a
                            key={socialLink.id}
                            href={socialLink.url}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.contactSocialLink}
                            aria-label={socialLink.title}
                            title={socialLink.title}
                          >
                            {logoUrl ? (
                              <Image
                                src={logoUrl}
                                alt=""
                                width={18}
                                height={18}
                                className={styles.contactSocialLogo}
                              />
                            ) : (
                              getClubLinkIcon(socialLink.icon_type)
                            )}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.contactUnavailable}>
                <Link
                  href="/pridaj_sa#kontakt"
                  className={styles.contactIntroLink}
                  aria-label="Prejsť na náborový formulár"
                >
                  <h2 className={styles.contactIntroTitle}>Ozvite sa nám</h2>
                  <span className={styles.contactIntroArrow} aria-hidden="true">
                    <PiArrowRight />
                  </span>
                </Link>

                <p className={styles.contactIntroText}>
                  Kontaktné údaje sa momentálne nepodarilo načítať.
                </p>
              </div>
            )}
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
      <section
        id="dokumenty"
        key={section.id}
        className={`sectionContainer ${styles.documentsAnchor}`}
      >
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

                return (
                  <a
                    key={document.id}
                    className={styles.documentCard}
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.documentIcon} aria-hidden="true">
                      <span
                        className={`${styles.documentPaper} ${styles.documentPaperBackTwo}`}
                      />
                      <span
                        className={`${styles.documentPaper} ${styles.documentPaperBackOne}`}
                      />
                      <span
                        className={`${styles.documentPaper} ${styles.documentPaperFront}`}
                      >
                        <Image
                          src="/logo/znak_atu_nove.svg"
                          alt=""
                          width={28}
                          height={28}
                          className={styles.documentLogo}
                        />
                      </span>
                    </span>

                    <span className={styles.documentContent}>
                      <strong>{document.title}</strong>
                      <small>PDF dokument</small>
                    </span>

                    <span className={styles.documentArrow} aria-hidden="true">
                      <svg
                        className={styles.documentArrowSvg}
                        viewBox="0 0 56 32"
                        fill="none"
                      >
                        <path
                          className={styles.documentArrowStraightLine}
                          d="M4 16H44"
                          pathLength="1"
                        />
                        <path
                          className={styles.documentArrowStraightHead}
                          d="M37 9L44 16L37 23"
                          pathLength="1"
                        />
                        <path
                          className={styles.documentArrowLoopLine}
                          d="M4 16C12 16 12 6 24 6C38 6 40 26 25 26C13 26 12 16 25 16H44"
                          pathLength="1"
                        />
                        <path
                          className={styles.documentArrowLoopHead}
                          d="M37 9L44 16L37 23"
                          pathLength="1"
                        />
                      </svg>
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className={styles.documentEmptyCard}>
              <p>Dokumenty budú doplnené čoskoro.</p>
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
