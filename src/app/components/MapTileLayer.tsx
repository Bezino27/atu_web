"use client";

import { useState } from "react";
import { TileLayer } from "react-leaflet";

import styles from "./MapTileLayer.module.css";

const TILE_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

const TILE_ATTRIBUTION =
  '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function MapTileLayer() {
  const [hasTileError, setHasTileError] = useState(false);

  return (
    <>
      <TileLayer
        attribution={TILE_ATTRIBUTION}
        url={TILE_URL}
        maxZoom={20}
        eventHandlers={{
          loading: () => setHasTileError(false),
          tileerror: () => setHasTileError(true),
        }}
      />

      {hasTileError ? (
        <div className={styles.tileError} role="status">
          Mapový podklad sa nepodarilo načítať
        </div>
      ) : null}
    </>
  );
}
