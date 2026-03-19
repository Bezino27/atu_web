import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoBox}>ATU</div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>ATU Košice</span>
              <span className={styles.logoSub}>Florbalový klub</span>
            </div>
          </Link>

          <div className={styles.links}>
            <a href="#o-klube" className={styles.link}>
              O klube
            </a>
            <a href="#treningy" className={styles.link}>
              Tréningy
            </a>
            <a href="#tim" className={styles.link}>
              Tím
            </a>
            <a href="#kontakt" className={styles.link}>
              Kontakt
            </a>

            <Link href="/kontakt" className={styles.cta}>
              Pridať sa k nám
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}