"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

const MAP_CENTER: [number, number] = [48.70186, 21.2441];

const getInitialZoom = () => {
  if (typeof window === "undefined") return 13;
  return window.innerWidth <= 640 ? 13 : 15;
};

export default function ContactMap({
  locations,
  activeLocation,
}: ContactMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    setIsMounted(true);
    setZoom(getInitialZoom());
  }, []);

  const markerEntries = useMemo(() => {
    if (typeof window === "undefined") return [];

    return Object.entries(locations).map(([id, loc]) => {
      const isActive = activeLocation === id;

      const icon = L.divIcon({
        html: `
          <div class="${styles.customMarker} ${isActive ? styles.markerActive : ""}">
            <div class="${styles.markerDot}"></div>
            <div class="${styles.markerLabel}">
              <strong>${loc.name}</strong>
              <span>${loc.address}</span>
            </div>
          </div>
        `,
        className: "",
        iconSize: [0, 0],
        iconAnchor: [9, 9],
      });

      return { id, loc, icon, isActive };
    });
  }, [locations, activeLocation]);

  if (!isMounted || typeof window === "undefined") {
    return <div className={styles.mapLoading}>Pripravujem mapu...</div>;
  }

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={MAP_CENTER}
        zoom={zoom}
        className={styles.leafletMap}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />

        <ZoomControl position="topleft" />

        {markerEntries.map(({ id, loc, icon, isActive }) => (
          <Marker
            key={id}
            position={[loc.lat, loc.lng]}
            icon={icon}
            zIndexOffset={isActive ? 1000 : 0}
          />
        ))}
      </MapContainer>
    </div>
  );
}