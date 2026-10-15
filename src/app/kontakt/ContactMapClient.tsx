"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import MapTileLayer from "@/app/components/MapTileLayer";
import { escapeHtml } from "@/app/lib/html";
import styles from "./kontakt.module.css";

type Location = {
  name: string;
  address: string;
  lat: number;
  lng: number;
};

type ContactMapClientProps = {
  locations: Record<string, Location>;
  activeLocation: string | null;
};

const FALLBACK_CENTER: [number, number] = [48.69814880000001, 21.23390379325404];

const getInitialZoom = () => (typeof window === "undefined" ? 16 : 17);

function getMarkerScale(zoom: number) {
  if (zoom >= 17) return 1;
  if (zoom >= 16) return 0.92;
  if (zoom >= 15) return 0.82;
  if (zoom >= 14) return 0.72;
  if (zoom >= 13) return 0.62;
  return 0.54;
}

function getActiveLocation(
  locations: Record<string, Location>,
  activeLocation: string | null,
) {
  if (activeLocation && locations[activeLocation]) {
    return locations[activeLocation];
  }

  const firstLocation = Object.values(locations)[0];

  return firstLocation ?? null;
}

function MapAutoCenter({
  location,
  markerScale,
}: {
  location: Location | null;
  markerScale: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    let animationFrame = 0;

    const positionLocation = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        map.invalidateSize({ animate: false, pan: false });
        map.setView([location.lat, location.lng], map.getZoom(), {
          animate: false,
        });

        animationFrame = requestAnimationFrame(() => {
          const mapElement = map.getContainer();
          const markerElement = mapElement.querySelector<HTMLElement>(
            `.${styles.markerActive}`,
          );

          if (!markerElement) return;

          const mapBounds = mapElement.getBoundingClientRect();
          const markerBounds = markerElement.getBoundingClientRect();
          const safeInset = 12;
          const rightOverflow = Math.max(
            0,
            markerBounds.right - (mapBounds.right - safeInset),
          );

          if (rightOverflow > 0) {
            map.panBy([rightOverflow, 0], { animate: false });
          }
        });
      });
    };

    positionLocation();

    const mapElement = map.getContainer();
    const resizeObserver = new ResizeObserver(positionLocation);
    resizeObserver.observe(mapElement);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [map, location, markerScale]);

  return null;
}

function MapZoomWatcher({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void;
}) {
  const map = useMapEvents({
    zoom() {
      onZoomChange(map.getZoom());
    },
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

export default function ContactMap({
  locations,
  activeLocation,
}: ContactMapClientProps) {
  const [initialZoom] = useState(getInitialZoom);
  const [currentZoom, setCurrentZoom] = useState(initialZoom);

  const currentLocation = useMemo(
    () => getActiveLocation(locations, activeLocation),
    [locations, activeLocation]
  );

  const markerScale = getMarkerScale(currentZoom);

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : FALLBACK_CENTER;

  const markerEntries = useMemo(() => {
    return Object.entries(locations).map(([id, loc]) => {
      const isActive = id === activeLocation || !activeLocation;

      const icon = L.divIcon({
        html: `
          <div
            class="${styles.customMarker} ${isActive ? styles.markerActive : ""}"
            style="--marker-scale: ${markerScale};"
          >
            <div class="${styles.markerDot}"></div>
            <div class="${styles.markerLabel}">
              <strong>${escapeHtml(loc.name)}</strong>
              <span>${escapeHtml(loc.address)}</span>
            </div>
          </div>
        `,
        className: styles.leafletMarkerIcon,
        iconSize: [270, 90],
        iconAnchor: [21, 54],
      });

      return {
        id,
        loc,
        icon,
        isActive,
      };
    });
  }, [locations, activeLocation, markerScale]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={initialZoom}
      minZoom={12}
      maxZoom={18}
      className={styles.leafletMap}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <MapAutoCenter location={currentLocation} markerScale={markerScale} />
      <MapZoomWatcher onZoomChange={setCurrentZoom} />

      <MapTileLayer />

      <ZoomControl position="topright" />

      {markerEntries.map(({ id, loc, icon, isActive }) => (
        <Marker
          key={id}
          position={[loc.lat, loc.lng]}
          icon={icon}
          zIndexOffset={isActive ? 1000 : 0}
        />
      ))}
    </MapContainer>
  );
}
