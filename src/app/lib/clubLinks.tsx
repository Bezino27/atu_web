import type { ReactNode } from "react";
import {
  FaFacebookF,
  FaFlickr,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import type { ClubLink } from "./club";

export function getClubLinkIcon(iconType?: string | null): ReactNode {
  switch (iconType) {
    case "instagram":
      return <FaInstagram />;
    case "facebook":
      return <FaFacebookF />;
    case "youtube":
      return <FaYoutube />;
    case "tiktok":
      return <FaTiktok />;
    case "flickr":
      return <FaFlickr />;
    case "szfb":
      return <span aria-hidden="true">SZ</span>;
    case "florbal_expert":
      return <span aria-hidden="true">FE</span>;
    case "ludimus":
      return <span aria-hidden="true">L</span>;
    case "website":
      return <FaGlobe />;
    case "custom":
    default:
      return <FaLink />;
  }
}

export function getClubLinkColor(iconType?: string | null) {
  switch (iconType) {
    case "facebook":
      return "#1877f2";
    case "youtube":
      return "#ff0000";
    case "instagram":
      return "#e4405f";
    case "tiktok":
      return "#111111";
    case "flickr":
      return "#ff0084";
    case "szfb":
    case "florbal_expert":
    case "ludimus":
      return "#111111";
    case "website":
    case "custom":
    default:
      return "#334155";
  }
}

export function getActiveClubLinks(links?: ClubLink[] | null) {
  return [...(links ?? [])]
    .filter((link) => link.is_active && link.url)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "sk"));
}
