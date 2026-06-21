"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoShareSocialOutline } from "react-icons/io5";
import { getClub, getClubLinkLogoUrl, type ClubLink } from "@/app/lib/club";
import {
  getActiveClubLinks,
  getClubLinkColor,
  getClubLinkIcon,
} from "@/app/lib/clubLinks";
import styles from "./Footer.module.css";

type NavItem = {
  label: string;
  href: string;
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
  { label: "Starší žiaci", href: "/kategorie/starsi-ziaci" },
  { label: "Mladší žiaci", href: "/kategorie/mladsi-ziaci" },
  { label: "Prípravka", href: "/kategorie/pripravka" },
];

export default function Footer() {
  const shareSectionRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [socialItems, setSocialItems] = useState<ClubLink[]>([]);

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
  }, [socialItems.length]);

  useEffect(() => {
    let isMounted = true;

    async function loadClubLinks() {
      const club = await getClub("atu-kosice");

      if (!isMounted) return;

      setSocialItems(getActiveClubLinks(club?.links));
    }

    loadClubLinks();

    return () => {
      isMounted = false;
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

          {socialItems.length > 0 && (
            <div ref={shareSectionRef} className={styles.shareSection}>
              <h3 className={styles.navTitle}>Odkazy</h3>

              <div className={styles.shareBlock}>
                <div className={styles.shareBlockInner}>
                  <div
                    className={`${styles.shareMenu} ${
                      isMenuOpen ? styles.shareMenuOpen : ""
                    }`}
                    style={
                      {
                        "--items": socialItems.length,
                      } as CSSProperties
                    }
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
                      const logoUrl = getClubLinkLogoUrl(item);
                      const customStyle = {
                        "--i": index,
                        "--clr": getClubLinkColor(item.icon_type),
                      } as CSSProperties;

                      return (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.shareItem}
                          style={customStyle}
                          aria-label={item.title}
                          title={item.title}
                        >
                          <span className={styles.shareItemIcon}>
                            {logoUrl ? (
                              <Image
                                src={logoUrl}
                                alt=""
                                width={36}
                                height={36}
                                className={`${styles.clubLinkImageIcon} ${
                                  item.icon_type === "ludimus"
                                    ? styles.ludimusClubLinkImageIcon
                                    : ""
                                }`}
                              />
                            ) : (
                              getClubLinkIcon(item.icon_type)
                            )}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} ATU Košice / Ludimus / všetky práva</p>
        </div>
      </div>
    </footer>
  );
}
