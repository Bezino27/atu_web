"use client";

import dynamic from "next/dynamic";
import styles from "./kontakt.module.css";

type Location = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

interface ContactMapProps {
  locations: Record<string, Location>;
  activeLocation: string | null;
}

const ContactMapClient = dynamic(() => import("./ContactMapClient"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>Pripravujem mapu...</div>
  ),
});

export default function ContactMap(props: ContactMapProps) {
  return <ContactMapClient {...props} />;
}