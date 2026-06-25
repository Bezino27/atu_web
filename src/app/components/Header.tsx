"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  PiArrowRightBold,
  PiCaretDownBold,
  PiEnvelopeSimple,
  PiHouse,
  PiShieldCheck,
  PiUserCircle,
  PiUsersThree,
} from "react-icons/pi";
import { getClub, getClubLinkLogoUrl, type ClubLink } from "@/app/lib/club";
import { getActiveClubLinks, getClubLinkIcon } from "@/app/lib/clubLinks";
import { getClubContact } from "@/app/lib/contact";
import {
  getClubNavigation,
  getNavigationLabel,
  type NavigationDropdown,
  type NavigationPage,
} from "@/app/lib/pages";
import styles from "./Header.module.css";

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { href: "/", label: "Domov", icon: PiHouse },
  { href: "/o-klube", label: "O klube", icon: PiShieldCheck },
  { href: "/kategorie/muzi", label: "A-tím", icon: PiUsersThree },
  { href: "/kategorie", label: "Mládež", icon: PiUserCircle },
  { href: "/kontakt", label: "Kontakt", icon: PiEnvelopeSimple },
];

const categoryItems = [
  { href: "/kategorie/pripravka", label: "Prípravky" },
  { href: "/kategorie/mladsi-ziaci", label: "Mladší žiaci" },
  { href: "/kategorie/starsi-ziaci", label: "Starší žiaci" },
  { href: "/kategorie/dorast", label: "Dorast" },
  { href: "/kategorie/juniori", label: "Juniori" },
];

const headerLinkIconTypes = new Set(["instagram", "youtube", "facebook"]);
const CLUB_SLUG = "atu-kosice";

type CategoryItem = {
  href: string;
  label: string;
};

type HeaderCta = {
  href: string;
  label: string;
};

function getNavigationIcon(page: NavigationPage): IconType {
  if (page.url === "/") return PiHouse;
  if (page.page_type === "about" || page.slug === "o-klube") return PiShieldCheck;
  if (page.page_type === "contact" || page.slug === "kontakt") {
    return PiEnvelopeSimple;
  }
  if (page.page_type === "category" || page.page_type === "team_category") {
    return PiUsersThree;
  }

  return PiUserCircle;
}

function mapNavigationPages(pages: NavigationPage[]): NavItem[] {
  return pages.map((page) => ({
    href: page.url,
    label: getNavigationLabel(page),
    icon: getNavigationIcon(page),
  }));
}

function mapDropdown(dropdown: NavigationDropdown): CategoryItem[] {
  return dropdown.items.map((item) => ({
    href: item.url,
    label: getNavigationLabel(item),
  }));
}

function addYouthDropdownItem(items: NavItem[], title: string): NavItem[] {
  if (items.some((item) => item.label === title)) {
    return items;
  }

  const dropdownItem = { href: "/kategorie", label: title, icon: PiUserCircle };
  const teamIndex = items.findIndex((item) => item.href === "/kategorie/muzi");

  if (teamIndex === -1) {
    return [...items, dropdownItem];
  }

  return [
    ...items.slice(0, teamIndex + 1),
    dropdownItem,
    ...items.slice(teamIndex + 1),
  ];
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [clubLinks, setClubLinks] = useState<ClubLink[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavItem[]>(navItems);
  const [youthDropdownTitle, setYouthDropdownTitle] = useState("Mládež");
  const [youthItems, setYouthItems] = useState<CategoryItem[]>(categoryItems);
  const [ctaItem, setCtaItem] = useState<HeaderCta>({
    href: "/pridaj_sa",
    label: "Pridaj sa k nám",
  });

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
    let isMounted = true;

    async function loadClubInfo() {
      const [club, contact, navigation] = await Promise.all([
        getClub(CLUB_SLUG),
        getClubContact(CLUB_SLUG),
        getClubNavigation(CLUB_SLUG),
      ]);

      if (!isMounted) return;

      setClubLinks(
        getActiveClubLinks(club?.links).filter((link) =>
          headerLinkIconTypes.has(link.icon_type)
        )
      );
      setContactEmail(contact?.email ?? "");

      if (navigation) {
        const mappedMain = mapNavigationPages(navigation.main);

        const youthDropdown = navigation.dropdowns.find(
          (dropdown) => dropdown.group === "youth" || dropdown.title === "Mládež",
        );

        if (mappedMain.length) {
          setNavigationItems(
            youthDropdown
              ? addYouthDropdownItem(mappedMain, youthDropdown.title || "Mládež")
              : mappedMain,
          );
        }

        if (youthDropdown?.items.length) {
          setYouthDropdownTitle(youthDropdown.title || "Mládež");
          setYouthItems(mapDropdown(youthDropdown));
        }

        if (navigation.cta) {
          setCtaItem({
            href: navigation.cta.url,
            label: getNavigationLabel(navigation.cta),
          });
        }
      }
    }

    loadClubInfo();

    return () => {
      isMounted = false;
    };
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
              {contactEmail && (
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              )}

              {clubLinks.length > 0 && (
                <div className={styles.socialLinks}>
                  {clubLinks.map((link) => {
                    const logoUrl = getClubLinkLogoUrl(link);

                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.title}
                        className={styles.socialLink}
                      >
                        {logoUrl ? (
                          <Image
                            src={logoUrl}
                            alt=""
                            width={22}
                            height={22}
                            className={styles.socialLogo}
                          />
                        ) : (
                          getClubLinkIcon(link.icon_type)
                        )}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BAR */}
      <div className={styles.mainBar}>
        <div className={styles.container}>
          <div className={styles.mainBarInner}>
            <Link href="/" className={styles.logoWrap} onClick={closeMenu}>
              <Image
                src="/logo/znak_atu_nove.svg"
                alt="ATU Košice logo"
                width={72}
                height={72}
                className={styles.logo}
                priority
              />
              <div className={styles.logoText}>
                <strong>FaBK ATU Košice</strong>

              </div>
            </Link>

            <nav className={styles.desktopNav}>
              {navigationItems.map((item) => {
                const Icon = item.icon;

                if (item.label === youthDropdownTitle) {
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
                        <Icon className={styles.navIcon} aria-hidden="true" />
                        <span>{item.label}</span>
                        <PiCaretDownBold
                          className={`${styles.navChevron} ${
                            categoriesOpen ? styles.navChevronOpen : ""
                          }`}
                          aria-hidden="true"
                        />
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

                          {youthItems.map((category) => (
                            <Link
                              key={category.href}
                              href={category.href}
                              onClick={() => setCategoriesOpen(false)}
                            >
                              <span className={styles.dropdownDot} />
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
                    <Icon className={styles.navIcon} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className={styles.actions}>
              <Link href={ctaItem.href} className={styles.ctaButton}>
                <span>{ctaItem.label}</span>
                <PiArrowRightBold className={styles.ctaIcon} aria-hidden="true" />
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
            {navigationItems.map((item) => {
              const Icon = item.icon;

              if (item.label === youthDropdownTitle) {
                return (
                  <div key={item.href} className={styles.mobileDropdown}>
                    <button
                      type="button"
                      className={styles.mobileNavToggle}
                      onClick={handleMobileCategoriesToggle}
                      aria-expanded={mobileCategoriesOpen}
                    >
                      <span className={styles.mobileNavLabel}>
                        <Icon
                          className={styles.mobileNavIcon}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </span>
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
                      {youthItems.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          className={styles.mobileSubmenuLink}
                          onClick={closeMenu}
                        >
                          <span className={styles.mobileSubmenuDot} />
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
                  <Icon className={styles.mobileNavIcon} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <Link
              href={ctaItem.href}
              className={styles.mobileCta}
              onClick={closeMenu}
            >
              <span>{ctaItem.label}</span>
              <PiArrowRightBold aria-hidden="true" />
            </Link>

            {clubLinks.length > 0 && (
              <div className={styles.mobileSocialRow}>
                {clubLinks.map((link) => {
                  const logoUrl = getClubLinkLogoUrl(link);

                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.title}
                      className={styles.mobileSocialIcon}
                    >
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt=""
                          width={26}
                          height={26}
                          className={styles.mobileSocialLogo}
                        />
                      ) : (
                        getClubLinkIcon(link.icon_type)
                      )}
                    </a>
                  );
                })}
              </div>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}
