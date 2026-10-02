import type { ClubLink } from "@/app/lib/club";

export const HEADER_DEFAULTS = {
  clubName: "FaBK ATU Košice",
  clubLabel: "ATU Košice • Florbalový klub",
  logoSrc: "/logo/znak_atu_nove.svg",
  contactEmail: "dudovic@dudovic.sk",
  navigation: [
    { href: "/", label: "Domov" },
    { href: "/o-klube", label: "O klube" },
    { href: "/kategorie/muzi", label: "A-tím" },
    { href: "/kategorie", label: "Mládež" },
    { href: "/kontakt", label: "Kontakt" },
  ],
  youthDropdown: {
    title: "Mládež",
    items: [
      { href: "/kategorie/pripravka", label: "Prípravky" },
      { href: "/kategorie/mladsi-ziaci", label: "Mladší žiaci" },
      { href: "/kategorie/starsi-ziaci", label: "Starší žiaci" },
      { href: "/kategorie/dorast", label: "Dorast" },
      { href: "/kategorie/juniori", label: "Juniori" },
    ],
  },
  cta: { href: "/pridaj_sa", label: "Staň sa súčasťou" },
  socialLinks: [
    {
      id: -1,
      title: "Facebook",
      url: "https://www.facebook.com/",
      icon_type: "facebook",
      order: 1,
      is_active: true,
    },
    {
      id: -2,
      title: "Instagram",
      url: "https://www.instagram.com/",
      icon_type: "instagram",
      order: 2,
      is_active: true,
    },
    {
      id: -3,
      title: "YouTube",
      url: "https://www.youtube.com/",
      icon_type: "youtube",
      order: 3,
      is_active: true,
    },
  ] satisfies ClubLink[],
} as const;
