"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import type { MaplibreGL } from "@maplibre/maplibre-gl-leaflet";
import type { ErrorEvent, Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./OpenFreeMapLayer.module.css";

const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
const ATTRIBUTION =
  '<a href="https://openfreemap.org/">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function OpenFreeMapLayer() {
  const map = useMap();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let layer: InstanceType<typeof MaplibreGL> | undefined;
    let renderer: MapLibreMap | undefined;

    const handleError = (event: ErrorEvent) => {
      if (cancelled) return;
      console.error("OpenFreeMap:", event.error);
      setHasError(true);
    };
    const handleIdle = () => {
      if (!cancelled) setHasError(false);
    };

    // The adapter imports Leaflet and WebGL browser APIs. Keep it out of SSR
    // and guard late completion when React unmounts or replays this effect.
    void import("@maplibre/maplibre-gl-leaflet")
      .then(({ maplibreGL }) => {
        if (cancelled) return;

        layer = maplibreGL({
          style: STYLE_URL,
          interactive: false,
          attributionControl: { customAttribution: ATTRIBUTION },
        });
        layer.addTo(map);
        const glMap = layer.getMaplibreMap();
        renderer = glMap;
        glMap.on("error", handleError);
        glMap.on("idle", handleIdle);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("OpenFreeMap sa nepodarilo inicializovať:", error);
        setHasError(true);
      });

    return () => {
      cancelled = true;
      renderer?.off("error", handleError);
      renderer?.off("idle", handleIdle);
      layer?.remove();
    };
  }, [map]);

  return hasError ? (
    <div className={styles.error} role="status">
      Mapový podklad sa nepodarilo načítať.
    </div>
  ) : null;
}
