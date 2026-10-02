"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  PiArrowRightBold,
  PiCaretDownBold,
  PiEnvelopeSimple,
  PiFileText,
  PiHouse,
  PiShieldCheck,
  PiUserCircle,
  PiUsersThree,
} from "react-icons/pi";
import { getClub, getClubLinkLogoUrl, type ClubLink } from "@/app/lib/club";
import { getActiveClubLinks, getClubLinkIcon } from "@/app/lib/clubLinks";
import { getClubContact } from "@/app/lib/contact";
import { ADMIN_URL } from "@/app/lib/admin";
import {
  getClubNavigation,
  getNavigationLabel,
  type NavigationDropdown,
  type NavigationPage,
} from "@/app/lib/pages";
import styles from "./Header.module.css";
import { HEADER_DEFAULTS } from "./headerDefaults";

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

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

function getFallbackNavigationIcon(href: string): IconType {
  if (href === "/") return PiHouse;
  if (href === "/o-klube") return PiShieldCheck;
  if (href === "/kontakt") return PiEnvelopeSimple;
  if (href === "/kategorie/muzi") return PiUsersThree;
  return PiUserCircle;
}

const fallbackNavigationItems: NavItem[] = HEADER_DEFAULTS.navigation.map(
  (item) => ({ ...item, icon: getFallbackNavigationIcon(item.href) }),
);

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

function MobileYouthTree({
  itemCount,
  activeIndex,
}: {
  itemCount: number;
  activeIndex: number;
}) {
  if (itemCount === 0) return null;

  const width = 58;
  const trunkX = 18;
  const rowHeight = 60;
  const entryHeight = 24;
  const radius = 11;
  const viewHeight = entryHeight + itemCount * rowHeight + 10;
  const rowY = (index: number) => entryHeight + (index + 0.5) * rowHeight;
  const branchPath = (index: number) => {
    const y = rowY(index);
    return `M ${trunkX} ${y - radius} A ${radius} ${radius} 0 0 0 ${
      trunkX + radius
    } ${y} H ${width}`;
  };
  const activePath =
    activeIndex >= 0
      ? `M ${trunkX} 0 V ${rowY(activeIndex) - radius} A ${radius} ${radius} 0 0 0 ${
          trunkX + radius
        } ${rowY(activeIndex)} H ${width}`
      : null;

  return (
    <svg
      className={styles.mobileSubmenuTree}
      viewBox={`0 0 ${width} ${viewHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className={styles.mobileSubmenuTreeBase}
        d={`M ${trunkX} 0 V ${rowY(itemCount - 1) - radius}`}
      />
      {Array.from({ length: itemCount }, (_, index) => (
        <path
          key={index}
          className={`${styles.mobileSubmenuTreeBase} ${styles.mobileSubmenuTreeBranch}`}
          d={branchPath(index)}
        />
      ))}
      {activePath ? (
        <path
          key={activeIndex}
          className={styles.mobileSubmenuTreeActive}
          d={activePath}
          pathLength={1}
        />
      ) : null}
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState<string>(
    HEADER_DEFAULTS.contactEmail,
  );
  const [clubLinks, setClubLinks] = useState<ClubLink[]>([
    ...HEADER_DEFAULTS.socialLinks,
  ]);
  const [navigationItems, setNavigationItems] = useState<NavItem[]>(
    fallbackNavigationItems,
  );
  const [youthDropdownTitle, setYouthDropdownTitle] = useState<string>(
    HEADER_DEFAULTS.youthDropdown.title,
  );
  const [youthItems, setYouthItems] = useState<CategoryItem[]>([
    ...HEADER_DEFAULTS.youthDropdown.items,
  ]);
  const [ctaItem, setCtaItem] = useState<HeaderCta | null>(HEADER_DEFAULTS.cta);

  const closeMenu = () => {
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
  };

  const handleCategoriesToggle = () => {
    const nextOpen = !categoriesOpen;
    setCategoriesOpen(nextOpen);

    if (nextOpen) {
      setContactOpen(false);
    }
  };

  const handleContactToggle = () => {
    const nextOpen = !contactOpen;
    setContactOpen(nextOpen);

    if (nextOpen) {
      setCategoriesOpen(false);
    }
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

      if (club) {
        setClubLinks(
          getActiveClubLinks(club.links).filter((link) =>
            headerLinkIconTypes.has(link.icon_type)
          )
        );
      }

      if (contact?.email) {
        setContactEmail(contact.email);
      }

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

        setCtaItem(
          navigation.cta
            ? {
                href: navigation.cta.url,
                label: getNavigationLabel(navigation.cta),
              }
            : null,
        );
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
              <span>{HEADER_DEFAULTS.clubLabel}</span>
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

              <a
                href={ADMIN_URL}
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="Otvoriť administráciu"
                title="Administrácia"
                className={styles.adminTopLink}
              >
                <PiShieldCheck aria-hidden="true" />
              </a>
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
                src={HEADER_DEFAULTS.logoSrc}
                alt="ATU Košice logo"
                width={72}
                height={72}
                className={styles.logo}
                priority
              />
              <div className={styles.logoText}>
                <strong>{HEADER_DEFAULTS.clubName}</strong>

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
                      onMouseEnter={() => {
                        setCategoriesOpen(true);
                        setContactOpen(false);
                      }}
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

                if (item.href === "/kontakt") {
                  return (
                    <div
                      key={item.href}
                      className={styles.dropdown}
                      onMouseEnter={() => {
                        setContactOpen(true);
                        setCategoriesOpen(false);
                      }}
                      onMouseLeave={() => setContactOpen(false)}
                    >
                      <button
                        type="button"
                        className={styles.navLink}
                        onClick={handleContactToggle}
                        aria-expanded={contactOpen}
                      >
                        <Icon className={styles.navIcon} aria-hidden="true" />
                        <span>{item.label}</span>
                        <PiCaretDownBold
                          className={`${styles.navChevron} ${
                            contactOpen ? styles.navChevronOpen : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <div
                        className={`${styles.dropdownMenu} ${
                          contactOpen ? styles.show : ""
                        }`}
                      >
                        <div className={styles.dropdownContent}>
                          <span className={styles.dropdownLabel}>
                            Kontakt
                          </span>

                          <Link
                            href="/kontakt"
                            onClick={() => setContactOpen(false)}
                          >
                            Kontaktné údaje
                          </Link>

                          <Link
                            href="/kontakt#dokumenty"
                            onClick={() => setContactOpen(false)}
                          >
                            Dôležité dokumenty
                          </Link>
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
              {ctaItem ? (
                <Link href={ctaItem.href} className={styles.ctaButton}>
                  <span>{ctaItem.label}</span>
                  <PiArrowRightBold className={styles.ctaIcon} aria-hidden="true" />
                </Link>
              ) : null}

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
                      <MobileYouthTree
                        itemCount={youthItems.length}
                        activeIndex={youthItems.findIndex(
                          (category) => pathname === category.href,
                        )}
                      />
                      {youthItems.map((category) => {
                        const isActive = pathname === category.href;

                        return (
                          <Link
                            key={category.href}
                            href={category.href}
                            className={`${styles.mobileSubmenuLink} ${
                              isActive ? styles.mobileSubmenuLinkActive : ""
                            }`}
                            onClick={closeMenu}
                          >
                            <PiArrowRightBold
                              className={`${styles.mobileSubmenuArrow} ${
                                isActive ? styles.mobileSubmenuArrowActive : ""
                              }`}
                              aria-hidden="true"
                            />
                            <span>{category.label}</span>
                          </Link>
                        );
                      })}
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
              href="/kontakt#dokumenty"
              className={`${styles.mobileNavLink} ${styles.mobileNavLinkLong}`}
              onClick={closeMenu}
            >
              <PiFileText className={styles.mobileNavIcon} aria-hidden="true" />
              <span>Dôležité dokumenty</span>
            </Link>

            {ctaItem ? (
              <Link
                href={ctaItem.href}
                className={styles.mobileCta}
                onClick={closeMenu}
              >
                <span>{ctaItem.label}</span>
                <PiArrowRightBold aria-hidden="true" />
              </Link>
            ) : null}

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

              <a
                href={ADMIN_URL}
                target="_blank"
                rel="nofollow noreferrer"
                aria-label="Otvoriť administráciu"
                title="Administrácia"
                className={styles.mobileAdminIcon}
                onClick={closeMenu}
              >
                <PiShieldCheck aria-hidden="true" />
              </a>
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
}
