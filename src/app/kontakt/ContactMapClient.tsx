"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
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

const DEFAULT_CENTER: [number, number] = [48.69814880000001, 21.23390379325404];

const DEFAULT_LOCATION: Location = {
  name: "Jedlíkova",
  address: "Jedlíkova 7, 040 11 Košice",
  lat: DEFAULT_CENTER[0],
  lng: DEFAULT_CENTER[1],
};

const getInitialZoom = () => {
  if (typeof window === "undefined") return 16;
  return window.innerWidth <= 640 ? 15 : 17;
};

function MapAutoCenter() {
  const map = useMap();

  useEffect(() => {
    map.setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng], map.getZoom(), {
      animate: true,
    });
  }, [map]);

  return null;
}

export default function ContactMap({
  locations,
  activeLocation,
}: ContactMapProps) {
  const [zoom, setZoom] = useState(16);

  useEffect(() => {
    setZoom(getInitialZoom());
  }, []);

  const markerEntries = useMemo(() => {
    const isActive = true;

    const icon = L.divIcon({
      html: `
        <div class="${styles.customMarker} ${isActive ? styles.markerActive : ""}">
          <div class="${styles.markerDot}"></div>
          <div class="${styles.markerLabel}">
            <strong>${DEFAULT_LOCATION.name}</strong>
            <span>${DEFAULT_LOCATION.address}</span>
          </div>
        </div>
      `,
      className: "",
      iconSize: [0, 0],
      iconAnchor: [9, 9],
    });

    return [
      {
        id: "default",
        loc: DEFAULT_LOCATION,
        icon,
        isActive,
      },
    ];
  }, []);

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={zoom}
        className={styles.leafletMap}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <MapAutoCenter />

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