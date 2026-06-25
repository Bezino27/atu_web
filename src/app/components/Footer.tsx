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
import { getClubNavigation, getNavigationLabel } from "@/app/lib/pages";
import styles from "./Footer.module.css";

type NavItem = {
  label: string;
  href: string;
};

const clubLinks: NavItem[] = [
  { label: "Domov", href: "/" },
  { label: "O klube", href: "/o-klube" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Pridaj sa", href: "/pridaj_sa" },
  { label: "Články", href: "/clanky" },
];

const categoryLinks: NavItem[] = [
  { label: "A-tím", href: "/kategorie/muzi" },
  { label: "Juniori", href: "/kategorie/juniori" },
  { label: "Dorastenci", href: "/kategorie/dorast" },
  { label: "Starší žiaci", href: "/kategorie/starsi-ziaci" },
  { label: "Mladší žiaci", href: "/kategorie/mladsi-ziaci" },
  { label: "Prípravka", href: "/kategorie/pripravka" },
];

const CLUB_SLUG = "atu-kosice";

function isCategoryHref(href: string) {
  return href.startsWith("/kategorie/");
}

function removeDuplicatesByHref(items: NavItem[]) {
  return items.filter((item, index, array) => {
    return array.findIndex((arrayItem) => arrayItem.href === item.href) === index;
  });
}

function normalizeFooterLinks(items: NavItem[], categories: NavItem[]) {
  const categoryHrefs = new Set(categories.map((item) => item.href));

  const cleanedItems = items.filter((item) => {
    if (isCategoryHref(item.href)) {
      return false;
    }

    return !categoryHrefs.has(item.href);
  });

  const hasHome = cleanedItems.some((item) => item.href === "/");

  const withHome = hasHome
    ? cleanedItems
    : [{ label: "Domov", href: "/" }, ...cleanedItems];

  return removeDuplicatesByHref(withHome);
}

export default function Footer() {
  const shareSectionRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [socialItems, setSocialItems] = useState<ClubLink[]>([]);
  const [footerLinks, setFooterLinks] = useState<NavItem[]>(clubLinks);
  const [footerCategoryLinks, setFooterCategoryLinks] =
    useState<NavItem[]>(categoryLinks);

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

    async function loadFooterData() {
      const [club, navigation] = await Promise.all([
        getClub(CLUB_SLUG),
        getClubNavigation(CLUB_SLUG),
      ]);

      if (!isMounted) return;

      setSocialItems(getActiveClubLinks(club?.links));

      const youthDropdown = navigation?.dropdowns.find(
        (dropdown) => dropdown.group === "youth" || dropdown.title === "Mládež"
      );

      const youthCategoryLinks = youthDropdown?.items.length
        ? youthDropdown.items.map((page) => ({
            label: getNavigationLabel(page),
            href: page.url,
          }))
        : categoryLinks.filter((item) => item.href !== "/kategorie/muzi");

      const mainTeamPage = navigation?.main.find(
        (page) => page.url === "/kategorie/muzi"
      );

      const mainTeamLink: NavItem = mainTeamPage
        ? {
            label: getNavigationLabel(mainTeamPage),
            href: mainTeamPage.url,
          }
        : { label: "A-tím", href: "/kategorie/muzi" };

      const backendCategoryLinks = removeDuplicatesByHref([
        mainTeamLink,
        ...youthCategoryLinks,
      ]);

      setFooterCategoryLinks(backendCategoryLinks);

      if (navigation?.footer.length) {
        const backendFooterLinks = navigation.footer.map((page) => ({
          label: getNavigationLabel(page),
          href: page.url,
        }));

        setFooterLinks(
          normalizeFooterLinks(backendFooterLinks, backendCategoryLinks)
        );
      } else {
        setFooterLinks(normalizeFooterLinks(clubLinks, backendCategoryLinks));
      }
    }

    loadFooterData();

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
              <h3 className={styles.navTitle}>Klub</h3>

              <ul className={styles.navList}>
                {footerLinks.map((item) => (
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
                {footerCategoryLinks.map((item) => (
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