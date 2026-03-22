'use client';

// /kategorie/dorast/components/TrainingMap.tsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/data/treningy_dorast';

interface TrainingMapProps {
  locations: Record<string, Location>;
  activeLocation: string | null;
}

const createMarkerIcon = (isActive: boolean) =>
  L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: ${isActive ? '#ffffff' : '#e63946'};
        border: 3px solid ${isActive ? '#e63946' : 'rgba(255,255,255,0.85)'};
        border-radius: 50%;
        box-shadow:
          0 0 0 ${isActive ? '6px' : '0px'} rgba(230, 57, 70, 0.25),
          0 4px 14px rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
      "></div>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -16],
  });

const TrainingMap: React.FC<TrainingMapProps> = ({ locations, activeLocation }) => {
  const [isMounted, setIsMounted] = useState(false);
  const center: [number, number] = [48.7290, 21.2510];

  // Zaistí že mapa sa renderuje len na klientovi, nie počas hydration
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <MapContainer
      key="dorast-training-map"
      center={center}
      zoom={13}
      style={{ width: '100%', height: '100%', minHeight: '420px' }}
      scrollWheelZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        maxZoom={19}
      />

      {Object.entries(locations).map(([id, loc]) => (
        <Marker
          key={id}
          position={[loc.lat, loc.lng]}
          icon={createMarkerIcon(activeLocation === id)}
        >
          <Popup>
            <div style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: '13px',
              lineHeight: 1.5,
            }}>
              <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                {loc.name}
              </strong>
              <span style={{ color: '#666' }}>{loc.address}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TrainingMap;