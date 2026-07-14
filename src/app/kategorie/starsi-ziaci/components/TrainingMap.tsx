"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../../styles/TrainingTable.module.css";
import type { PublicTrainingLocation } from "./treningy_starsi_ziaci";

interface TrainingMapProps {
  locations: Record<string, PublicTrainingLocation>;
  activeLocation: number | null;
}

const MAP_CENTER: [number, number] = [48.70186, 21.2441];

const getInitialZoom = () => {
  if (typeof window === "undefined") return 16;
  return window.innerWidth <= 640 ? 15 : 17;
};

function getMarkerScale(zoom: number) {
  if (zoom >= 17) return 1;
  if (zoom >= 16) return 0.92;
  if (zoom >= 15) return 0.82;
  if (zoom >= 14) return 0.72;
  if (zoom >= 13) return 0.62;
  return 0.54;
}

function getActiveLocation(
  locations: Record<string, PublicTrainingLocation>,
  activeLocation: number | null,
) {
  if (activeLocation !== null && locations[String(activeLocation)]) {
    return locations[String(activeLocation)];
  }

  return Object.values(locations)[0] ?? null;
}

function MapAutoCenter({ location }: { location: PublicTrainingLocation | null }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;
    map.setView([location.lat, location.lng], map.getZoom(), { animate: true });
  }, [map, location]);

  return null;
}

function MapZoomWatcher({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMapEvents({
    zoom() { onZoomChange(map.getZoom()); },
    zoomend() { onZoomChange(map.getZoom()); },
  });

  useEffect(() => { onZoomChange(map.getZoom()); }, [map, onZoomChange]);
  return null;
}

const TrainingMap: React.FC<TrainingMapProps> = ({ locations, activeLocation }) => {
  const [initialZoom] = useState(getInitialZoom);
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  const currentLocation = useMemo(
    () => getActiveLocation(locations, activeLocation),
    [locations, activeLocation],
  );

  const markerScale = getMarkerScale(currentZoom);
  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : MAP_CENTER;

  const markerEntries = useMemo(() => {
    return Object.entries(locations).map(([id, location]) => {
      const isActive = activeLocation === location.id || activeLocation === null;
      const icon = L.divIcon({
        html: `
          <div class="${styles.customMarker} ${isActive ? styles.markerActive : ""}" style="--marker-scale: ${markerScale};">
            <div class="${styles.markerDot}"></div>
            <div class="${styles.markerLabel}">
              <strong>${location.name}</strong>
              <span>${location.address}</span>
            </div>
          </div>
        `,
        className: styles.leafletMarkerIcon,
        iconSize: [270, 90],
        iconAnchor: [21, 54],
      });

      return { id, location, icon, isActive };
    });
  }, [locations, activeLocation, markerScale]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <MapContainer
        center={mapCenter}
        zoom={initialZoom}
        minZoom={12}
        maxZoom={18}
        style={{ width: "100%", height: "100%", minHeight: "420px" }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <MapAutoCenter location={currentLocation} />
        <MapZoomWatcher onZoomChange={setCurrentZoom} />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
          maxZoom={20}
        />
        <ZoomControl position="topleft" />
        {markerEntries.map(({ id, location, icon, isActive }) => (
          <Marker
            key={id}
            position={[location.lat, location.lng]}
            icon={icon}
            zIndexOffset={isActive ? 1000 : 0}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default TrainingMap;
