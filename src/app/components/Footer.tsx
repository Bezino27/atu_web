import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div>
            <h3 className={styles.title}>ATU Košice</h3>
            <p className={styles.text}>
              Florbalový klub z Košíc. Tréningy, zápasy, komunita a spoločná
              vášeň pre šport.
            </p>
          </div>

          <div className={styles.links}>
            <a href="#o-klube">O klube</a>
            <a href="#treningy">Tréningy</a>
            <a href="#tim">Tím</a>
            <a href="#kontakt">Kontakt</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} ATU Košice. Všetky práva vyhradené.</span>
        </div>
      </div>
    </footer>
  );
}