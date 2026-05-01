"use client";

import React, { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./o-klube.module.css";
import type { HeroLocation } from "./o-klube-hero-data";

interface ClubVenueMapProps {
  locations: Record<string, HeroLocation>;
  activeLocation: string | null;
}

const MAP_CENTER: [number, number] = [48.70386010126878, 21.25058525154437];

const getInitialZoom = () => {
  if (typeof window === "undefined") return 13;
  return window.innerWidth <= 640 ? 16 : 17;
};

const ClubVenueMap: React.FC<ClubVenueMapProps> = ({
  locations,
  activeLocation,
}) => {
  const [initialZoom] = useState(getInitialZoom);

  const markerEntries = useMemo(() => {
    return Object.entries(locations).map(([id, loc]) => {
      const isActive = activeLocation === id;

      const icon = L.divIcon({
        html: `
          <div class="${styles.customMarker} ${isActive ? styles.markerActive : ""}">
            <div
              class="${styles.markerDot}"
              style="
                background: ${isActive ? "#ffffff" : "#e63946"};
                border: 3px solid ${isActive ? "#e63946" : "rgba(255,255,255,0.9)"};
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              "
            ></div>
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
    <div className={styles.mapWrapper}>
      <MapContainer
        center={MAP_CENTER}
        zoom={initialZoom}
        style={{ width: "100%", height: "100%", minHeight: "210px" }}
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
};

export default ClubVenueMap;