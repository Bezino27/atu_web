"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Domov" },
  { href: "/novinky", label: "Novinky" },
  { href: "/zapas", label: "Zápasy" },
  { href: "/tabulka", label: "Tabuľka" },
  { href: "/kategorie", label: "Kategórie" },
  { href: "/about", label: "O klube" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarInner}>
            <div className={styles.topLeft}>
              <span>ATU Košice • Florbalový klub</span>
            </div>

            <div className={styles.topRight}>
              <a href="mailto:info@atukosice.sk">info@atukosice.sk</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainBar}>
        <div className={styles.container}>
          <div className={styles.mainBarInner}>
            <Link href="/" className={styles.logoWrap} onClick={closeMenu}>
              <div className={styles.logoBox}>
                <Image
                  src="/images/logo.png"
                  alt="ATU Košice logo"
                  width={52}
                  height={52}
                  className={styles.logo}
                />
              </div>

              <div className={styles.logoText}>
                <strong>ATU Košice</strong>
                <span>Florbalový klub</span>
              </div>
            </Link>

            <nav className={styles.desktopNav}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className={styles.actions}>
              <Link href="/kontakt" className={styles.ctaButton}>
                Pridať sa k nám
              </Link>

              <button
                type="button"
                className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Otvoriť menu"
                aria-expanded={menuOpen}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.container}>
          <nav className={styles.mobileNav}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <Link href="/kontakt" className={styles.mobileCta} onClick={closeMenu}>
              Pridať sa k nám
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}