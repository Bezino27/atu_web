"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

const navItems = [
  { href: "/", label: "Domov" },
  { href: "/klub", label: "O klube" },
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
        isScrolled ? styles.headerScrolled : ""
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

      {/* MAIN BAR */}
      <div className={styles.mainBar}>
        <div className={styles.container}>
          <div className={styles.mainBarInner}>
            {/* LOGO */}
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
                <span>Extraliga mužov</span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
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
                  <Link key={item.href} href={item.href} className={styles.navLink}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <Link href="/kontakt" className={styles.ctaButton}>
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

            <Link href="/kontakt" className={styles.mobileCta} onClick={closeMenu}>
              Pridaj sa k nám
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}