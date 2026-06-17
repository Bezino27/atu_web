import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactMap from "./ContactMap";
import styles from "./kontakt.module.css";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";
import { getClubContact } from "../lib/contact";
import { getClubDocuments, getClubDocumentUrl } from "../lib/documents";

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

export default async function KontaktPage() {
  const [contact, documents] = await Promise.all([
    getClubContact("atu-kosice"),
    getClubDocuments("atu-kosice"),
  ]);

  const contactLocations: Record<string, ContactLocation> = contact
    ? {
        main: {
          name: contact.map_label || contact.title,
          address: contact.map_address || contact.address,
          lat: Number(contact.latitude),
          lng: Number(contact.longitude),
        },
      }
    : {};

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        <section className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">
                {contact?.section_label || "Kontakt"}
              </span>
              <h1 className="sectionTitle">
                {contact?.title || "FaBK ATU Košice"}
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

        {documents.length > 0 && (
          <section className="sectionContainer">
            <div className="resultsHeader">
              <div>
                <span className="preTitle">Dokumenty</span>
                <h2 className="sectionTitle">Dôležité dokumenty</h2>
              </div>
            </div>

            <div className={styles.documentsSection}>
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
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}