"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Domov" },
  { href: "/o-klube", label: "O klube" },
  { href: "/kategorie/muzi", label: "A tím" },
  { href: "/kategorie", label: "Mládež" },
  { href: "/kontakt", label: "Kontakt" },
];

const categoryItems = [
  { href: "/kategorie/pripravky", label: "Prípravky" },
  { href: "/kategorie/mladsi_ziaci", label: "Mladší žiaci" },
  { href: "/kategorie/starsi_ziaci", label: "Starší žiaci" },
  { href: "/kategorie/dorast", label: "Dorast" },
  { href: "/kategorie/juniori", label: "Juniori" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  const handleCategoriesToggle = () => {
    setCategoriesOpen((prev) => !prev);
  };

  const handleMobileCategoriesToggle = () => {
    setMobileCategoriesOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 42);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`${styles.header} ${
        isScrolled ? styles.headerShifted : ""
      }`}
    >
      {/* TOP BAR */}
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.topBarInner}>
            <div className={styles.topLeft}>
              <span>ATU Košice • Florbalový klub</span>
            </div>

            <div className={styles.topRight}>
              <a href="mailto:info@atukosice.sk">info@atukosice.sk</a>

              <div className={styles.socialLinks}>
                <a
                  href="https://www.facebook.com/atukosice/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook ATU Košice"
                  className={styles.socialLink}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.9h-2.33V22C18.34 21.27 22 17.1 22 12.07Z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/atu_kosice/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram ATU Košice"
                  className={styles.socialLink}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.9 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className={styles.mainBar}>
        <div className={styles.container}>
          <div className={styles.mainBarInner}>
            <Link href="/" className={styles.logoWrap} onClick={closeMenu}>
              <div className={styles.logoBox}>
                <Image
                  src="/logo/znak_atu_white.svg"
                  alt="ATU Košice logo"
                  width={44}
                  height={44}
                  className={styles.logo}
                />
              </div>
              <div className={styles.logoText}>
                <strong>FaBK ATU Košice</strong>

              </div>
            </Link>

            <nav className={styles.desktopNav}>
              {navItems.map((item) => {
                if (item.label === "Mládež") {
                  return (
                    <div
                      key={item.href}
                      className={styles.dropdown}
                      onMouseEnter={() => setCategoriesOpen(true)}
                      onMouseLeave={() => setCategoriesOpen(false)}
                    >
                      <button
                        type="button"
                        className={styles.navLink}
                        onClick={handleCategoriesToggle}
                        aria-expanded={categoriesOpen}
                      >
                        {item.label}
                      </button>

                      <div
                        className={`${styles.dropdownMenu} ${
                          categoriesOpen ? styles.show : ""
                        }`}
                      >
                        <div className={styles.dropdownContent}>
                          <span className={styles.dropdownLabel}>
                            Výber kategórie
                          </span>

                          {categoryItems.map((category) => (
                            <Link
                              key={category.href}
                              href={category.href}
                              onClick={() => setCategoriesOpen(false)}
                            >
                              {category.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.navLink}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className={styles.actions}>
              <Link href="/pridaj_sa" className={styles.ctaButton}>
                Pridaj sa k nám
              </Link>

              <button
                type="button"
                className={`${styles.menuButton} ${
                  menuOpen ? styles.menuButtonOpen : ""
                }`}
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

      {/* MOBILE MENU */}
      <div
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <div className={styles.container}>
          <nav className={styles.mobileNav}>
            {navItems.map((item) => {
              if (item.label === "Mládež") {
                return (
                  <div key={item.href} className={styles.mobileDropdown}>
                    <button
                      type="button"
                      className={styles.mobileNavToggle}
                      onClick={handleMobileCategoriesToggle}
                      aria-expanded={mobileCategoriesOpen}
                    >
                      <span>{item.label}</span>
                      <span
                        className={`${styles.mobileChevron} ${
                          mobileCategoriesOpen ? styles.mobileChevronOpen : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`${styles.mobileSubmenu} ${
                        mobileCategoriesOpen ? styles.mobileSubmenuOpen : ""
                      }`}
                    >
                      {categoryItems.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          className={styles.mobileSubmenuLink}
                          onClick={closeMenu}
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <Link
              href="/pridaj_sa"
              className={styles.mobileCta}
              onClick={closeMenu}
            >
              Pridaj sa k nám
            </Link>

            <div className={styles.mobileSocialRow}>
              <a
                href="https://www.facebook.com/atukosice/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook ATU Košice"
                className={styles.mobileSocialIcon}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.9h-2.33V22C18.34 21.27 22 17.1 22 12.07Z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/atu_kosice/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram ATU Košice"
                className={styles.mobileSocialIcon}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.9 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" />
                </svg>
              </a>
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
}