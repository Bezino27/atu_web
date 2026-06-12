import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactMap from "./ContactMap";
import styles from "./kontakt.module.css";
import { absoluteUrl, DEFAULT_OG_IMAGE_URL, SITE_NAME } from "../lib/seo";

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

const contactLocations = {
  jedlikova: {
    name: "Jedlíkova",
    address: "Jedlíkova 7, 040 11 Košice",
    lat: 48.70186,
    lng: 21.2441,
  },
};

export default function KontaktPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.content}>
        <section className="sectionContainer">
          <div className="resultsHeader">
            <div>
              <span className="preTitle">Kontakt</span>
              <h1 className="sectionTitle">FaBK ATU Košice</h1>
            </div>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfoCard}>
              <div className={styles.contactInfoList}>
                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Adresa</span>
                  <p className={styles.contactInfoText}>
                    Jedlíkova 7, 040 11 Košice
                  </p>
                </div>

                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Predseda</span>
                  <p className={styles.contactInfoText}>Juraj Dudovič</p>
                </div>

                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Email</span>
                  <a
                    className={styles.contactInfoLink}
                    href="mailto:dudovic@dudovic.sk"
                  >
                    dudovic@dudovic.sk
                  </a>
                </div>

                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>Telefón</span>
                  <a
                    className={styles.contactInfoLink}
                    href="tel:+421915932219"
                  >
                    +421 915 932 219
                  </a>
                </div>

                <div className={styles.contactInfoItem}>
                  <span className={styles.contactInfoLabel}>IBAN</span>
                  <p className={styles.contactInfoText}>
                    SK76 3100 0000 0045 3000 8518
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.contactMapCard}>

              <div className={styles.contactMapWrap}>
                <ContactMap
                  locations={contactLocations}
                  activeLocation="jedlikova"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
