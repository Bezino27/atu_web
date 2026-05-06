"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaFlickr,
  FaInstagram,
  FaShoppingBag,
  FaYoutube,
} from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import styles from "./Footer.module.css";

type NavItem = {
  label: string;
  href: string;
};

type SocialItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  color?: string;
  placeholder?: boolean;
};

const clubLinks: NavItem[] = [
  { label: "O klube", href: "/o-klube" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Pridaj sa", href: "/pridaj_sa" },
  { label: "Články", href: "/clanky" },
];

const categoryLinks: NavItem[] = [
  { label: "Muži", href: "/kategorie/muzi" },
  { label: "Juniori", href: "/kategorie/juniori" },
  { label: "Dorastenci", href: "/kategorie/dorast" },
  { label: "Starší žiaci", href: "/kategorie/starsi_ziaci" },
  { label: "Mladší žiaci", href: "/kategorie/mladsi_ziaci" },
  { label: "Prípravka", href: "/kategorie/pripravky" },
];

const socialItems: SocialItem[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/atukosice/",
    icon: <FaFacebookF />,
    color: "#1877f2",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@FaBKATUKosice",
    icon: <FaYoutube />,
    color: "#ff0000",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/atu_kosice/",
    icon: <FaInstagram />,
    color: "#e4405f",
  },
  {
    label: "Flickr",
    href: "https://www.flickr.com/photos/155654294@N03/",
    icon: <FaFlickr />,
    color: "#ff0084",
  },
  {
    label: "SZFB",
    href: "https://www.szfb.sk/sk/stats/teams/1164/florbalova-extraliga-muzov/team/669426/fabk-atu-kosice",
    icon: (
      <Image
        src="/logo/szfb_badge.png"
        alt="SZFB"
        width={30}
        height={30}
        className={styles.socialImageIcon}
      />
    ),
    color: "#111111",
  },
  {
    label: "Placeholder",
    placeholder: true,
  },
  {
    label: "Fanshop",
    href: "https://fanzone.sk/kategoria-produktu/florbal/atu-kosice/",
    icon: <FaShoppingBag />,
    color: "#111111",
  },
];

export default function Footer() {
  const shareSectionRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const shareSectionElement = shareSectionRef.current;

    if (!shareSectionElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMenuOpen(entry.isIntersecting);
      },
      {
        threshold: 0.45,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(shareSectionElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.logoWrap}>
        <Link href="/" className={styles.logoLink} aria-label="ATU Košice domov">
          <Image
            src="/logo/znak_atu_nove.svg"
            alt="ATU Košice"
            width={360}
            height={360}
            className={styles.logo}
          />
        </Link>
      </div>

      <div className={styles.container}>
        <div className={styles.topRow}>
          <nav className={styles.navArea} aria-label="Pätičková navigácia">
            <div className={styles.navColumn}>
              <h3 className={styles.navTitle}>O klube</h3>

              <ul className={styles.navList}>
                {clubLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.navLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.navColumn}>
              <h3 className={styles.navTitle}>Kategórie</h3>

              <ul className={`${styles.navList} ${styles.navListDense}`}>
                {categoryLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.navLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div ref={shareSectionRef} className={styles.shareSection}>
            <h3 className={styles.navTitle}>Odkazy</h3>

            <div className={styles.shareBlock}>
              <div className={styles.shareBlockInner}>
                <div
                  className={`${styles.shareMenu} ${
                    isMenuOpen ? styles.shareMenuOpen : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.shareToggle}
                    aria-label="Sociálne odkazy"
                    aria-expanded={isMenuOpen}
                    tabIndex={-1}
                  >
                    <IoShareSocialOutline />
                  </button>

                  {socialItems.map((item, index) => {
                    const customStyle = {
                      "--i": index,
                      "--clr": item.color ?? "#ffffff",
                    } as CSSProperties;

                    if (item.placeholder) {
                      return (
                        <span
                          key={`${item.label}-${index}`}
                          className={`${styles.shareItem} ${styles.sharePlaceholder}`}
                          style={customStyle}
                          aria-hidden="true"
                        />
                      );
                    }

                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.shareItem}
                        style={customStyle}
                        aria-label={item.label}
                        title={item.label}
                      >
                        <span className={styles.shareItemIcon}>{item.icon}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} ATU Košice / Martin Guľaš / všetky práva</p>
        </div>
      </div>
    </footer>
  );
}