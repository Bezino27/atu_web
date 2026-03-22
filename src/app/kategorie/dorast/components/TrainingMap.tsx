'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './TrainingTable.module.css';
import { Location } from '@/data/treningy_dorast';

interface TrainingMapProps {
  locations: Record<string, Location>;
  activeLocation: string | null;
}

const TrainingMap: React.FC<TrainingMapProps> = ({ locations, activeLocation }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Definícia ikony vnútri, aby sme mali istotu, že L (Leaflet) je dostupný
  const createMarkerIcon = (isActive: boolean, loc: Location) => {
    if (typeof window === 'undefined') return null;
    
    return L.divIcon({
      html: `
        <div class="${styles.customMarker} ${isActive ? styles.markerActive : ''}">
          <div class="${styles.markerDot}" style="
            background: ${isActive ? '#ffffff' : '#e63946'};
            border: 3px solid ${isActive ? '#e63946' : 'rgba(255,255,255,0.9)'};
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          "></div>
          <div class="${styles.markerLabel}">
            <strong>${loc.name}</strong>
            <span>${loc.address}</span>
          </div>
        </div>
      `,
      className: '',
      iconSize: [0, 0],
      iconAnchor: [9, 9],
    });
  };

  // Ak ešte nie sme na klientovi, nevypisujeme nič (predídeme appendChild chybe)
  if (!isMounted || typeof window === 'undefined') {
    return <div className={styles.mapLoading}>Pripravujem mapu...</div>;
  }

  const center: [number, number] = [48.70186, 21.24410];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100%', minHeight: '420px' }}
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
          maxZoom={19}
        />
        
        <ZoomControl position="topleft" />
        
        {Object.entries(locations).map(([id, loc]) => {
          const isActive = activeLocation === id;
          const icon = createMarkerIcon(isActive, loc);
          
          if (!icon) return null;

          return (
            <Marker
              key={id}
              position={[loc.lat, loc.lng]}
              icon={icon as L.DivIcon}
              zIndexOffset={isActive ? 1000 : 0}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TrainingMap;