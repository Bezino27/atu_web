"use client";

import React, { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/TrainingTable.module.css";
import { Location } from "@/data/treningy_mz";

interface TrainingMapProps {
  locations: Record<string, Location>;
  activeLocation: string | null;
}

const MAP_CENTER: [number, number] = [48.698133, 21.234022];

const getInitialZoom = () => {
  if (typeof window === "undefined") return 13;

  return window.innerWidth <= 640 ? 13 : 15;
};

const TrainingMap: React.FC<TrainingMapProps> = ({
  locations,
  activeLocation,
}) => {
  const [initialZoom] = useState(getInitialZoom);

  const markerEntries = useMemo(() => {
    return Object.entries(locations).map(([id, loc]) => {
      const isActive = activeLocation === id;

      const markerClassName = isActive
        ? `${styles.customMarker} ${styles.markerActive}`
        : styles.customMarker;

      const markerDotStyle = isActive
        ? "background: #ffffff; border: 3px solid #e63946; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"
        : "background: #e63946; border: 3px solid rgba(255,255,255,0.9); box-shadow: 0 4px 10px rgba(0,0,0,0.3);";

      const icon = L.divIcon({
        html: `
          <div class="${markerClassName}">
            <div class="${styles.markerDot}" style="${markerDotStyle}"></div>
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

      return {
        id,
        loc,
        icon,
        isActive,
      };
    });
  }, [locations, activeLocation]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={initialZoom}
        style={{ width: "100%", height: "100%", minHeight: "420px" }}
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

export default TrainingMap;