import Header from "../components/Header";
import ContactMap from "./ContactMap";
import styles from "./kontakt.module.css";

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
    <main className={styles.page}>
      <Header />

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <span className={styles.preTitle}>Kontakt</span>
          <h1 className={styles.sectionTitle}>FaBK ATU Košice</h1>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Adresa</span>
              <p className={styles.infoText}>Jedlíkova 7, 040 11 Košice</p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Predseda</span>
              <p className={styles.infoText}>Juraj Dudovič</p>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Email</span>
              <a className={styles.infoLink} href="mailto:dudovic@dudovic.sk">
                dudovic@dudovic.sk
              </a>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Telefón</span>
              <a className={styles.infoLink} href="tel:+421915932219">
                +421 915 932 219
              </a>
            </div>

            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>IBAN</span>
              <p className={styles.infoText}>SK76 3100 0000 0045 3000 8518</p>
            </div>
          </div>

          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <h2 className={styles.mapTitle}>Tréningová hala</h2>
              <p className={styles.mapAddress}>Jedlíkova 7, Košice</p>
            </div>

            <ContactMap
              locations={contactLocations}
              activeLocation="jedlikova"
            />
          </div>
        </div>
      </section>
    </main>
  );
}