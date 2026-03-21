"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";


const navItems = [
  { href: "/", label: "Domov" },
  { href: "/klub", label: "O klube" },
  { href: "/zapas", label: "Zápasy" },
  { href: "/tabulka", label: "Tabuľka" },
  { href: "/kategorie", label: "Kategórie" },
  { href: "/kontakt", label: "Kontakt" },
];


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
   // Toggle on click
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };



 useEffect(() => {
  const handleScroll = () => {
    const shouldShow = window.scrollY <= 50;
    setShowTopBar((prev) => {
      if (prev !== shouldShow) return shouldShow;
      return prev;
    });
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  return (
    <header
      className={`${styles.header} ${
        !showTopBar ? styles.headerShifted : ""
      }`}
    >
      <div className={`${styles.topBar} ${!showTopBar ? styles.topBarHidden : ""}`}>
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
      
        <div
          className={`${styles.mainBar} ${
            !showTopBar ? styles.mainBarShifted : ""
          }`}
        >
        <div className={styles.container}>
          <div className={styles.mainBarInner}>
            <Link href="/" className={styles.logoWrap} onClick={closeMenu}>
              <div className={styles.logoBox}>
                <Image
                  src="/logo/znak_atu_white.svg"
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

          {navItems.map((item) => {
            if (item.label === "Kategórie") {
              return (
                <div
                  key={item.href}
                  className={styles.dropdown}
                  
                >
                  {/* TRIGGER */}
                  <button
                    className={styles.navLink}
                    onClick={handleToggle}
                  >
                    {item.label}
                  </button>

                  {/* DROPDOWN */}
                  <div
                    className={`${styles.dropdownMenu} ${
                      isOpen ? styles.show : ""
                    }`}
                  >
                    <div className={styles.dropdownContent}>

                      <div>
                        <Link href="/kategorie/pripravky">Prípravky</Link>
                        <Link href="/kategorie/mladsi_ziaci">Mladší žiaci</Link>
                        <Link href="/kategorie/starsi_ziaci">Starší žiaci</Link>
                        <Link href="/kategorie/dorast">Dorast</Link>
                        <Link href="/kategorie/juniori">Juniori</Link>
                        <Link href="/kategorie/muzi">Muži</Link>


                      </div>

                    </div>
                  </div>
                </div>
              );
            }

            // ostatné linky normálne
            return (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            );
          })}

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