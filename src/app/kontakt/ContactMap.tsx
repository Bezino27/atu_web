"use client";

import dynamic from "next/dynamic";
import styles from "./kontakt.module.css";

type Location = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type ContactMapProps = {
  locations: Record<string, Location>;
  activeLocation: string | null;
};

const ContactMapClient = dynamic<ContactMapProps>(
  () => import("./ContactMapClient"),
  {
  ssr: false,
    loading: () => (
      <div className={styles.mapLoading}>Pripravujem mapu...</div>
    ),
  }
);

export default function ContactMap(props: ContactMapProps) {
  return <ContactMapClient {...props} />;
}
