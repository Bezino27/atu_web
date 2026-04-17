"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/TrainingTable.module.css";
import { Location } from "@/data/treningy_pripravka";

interface TrainingMapProps {
  locations: Record<string, Location>;
  activeLocation: string | null;
}

const MAP_CENTER: [number, number] = [48.70186, 21.2441];

const getInitialZoom = () => {
  if (typeof window === "undefined") return 13;
  return window.innerWidth <= 640 ? 13 : 15;
};

const TrainingMap: React.FC<TrainingMapProps> = ({
  locations,
  activeLocation,
}) => {
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

  if (!isMounted || typeof window === "undefined") {
    return <div className={styles.mapLoading}>Pripravujem mapu...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={MAP_CENTER}
        zoom={zoom}
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
