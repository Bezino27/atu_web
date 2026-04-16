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

const getInitialZoom = () => {
  if (typeof window === "undefined") return 13;
  return window.innerWidth <= 640 ? 13 : 15;
};

function MapAutoCenter({
  locations,
  activeLocation,
}: {
  locations: Record<string, Location>;
  activeLocation: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    const values = Object.values(locations);

    if (values.length === 0) return;

    const activeLoc =
      activeLocation && locations[activeLocation]
        ? locations[activeLocation]
        : null;

    if (activeLoc) {
      map.setView([activeLoc.lat, activeLoc.lng], map.getZoom(), {
        animate: true,
      });
      return;
    }

    if (values.length === 1) {
      map.setView([values[0].lat, values[0].lng], map.getZoom(), {
        animate: true,
      });
      return;
    }

    const bounds = L.latLngBounds(values.map((loc) => [loc.lat, loc.lng]));
    map.fitBounds(bounds, {
      padding: [40, 40],
      animate: true,
    });
  }, [map, locations, activeLocation]);

  return null;
}

export default function ContactMap({
  locations,
  activeLocation,
}: ContactMapProps) {
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    setZoom(getInitialZoom());
  }, []);

  const markerEntries = useMemo(() => {
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

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={zoom}
        className={styles.leafletMap}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <MapAutoCenter locations={locations} activeLocation={activeLocation} />

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