import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { reverseGeocode } from '../utils/geocoding';
import { Crosshair, Loader2 } from 'lucide-react';
import { Language } from '../types';

interface MapViewProps {
  customerLocation: { lat: number; lng: number; address?: string };
  specialistLocation?: { lat: number; lng: number; heading?: number; etaMinutes?: number };
  onSelectLocation?: (loc: { lat: number; lng: number; address: string }) => void;
  interactive?: boolean;
  height?: string;
  showRoute?: boolean;
  language?: Language;
}

export const MapView: React.FC<MapViewProps> = ({
  customerLocation,
  specialistLocation,
  onSelectLocation,
  interactive = false,
  height = '320px',
  showRoute = true,
  language = 'hy',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const specialistMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const langRef = useRef<Language>(language);

  useEffect(() => {
    langRef.current = language;
  }, [language]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [customerLocation.lat, customerLocation.lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (interactive && onSelectLocation) {
        map.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          const address = await reverseGeocode(lat, lng, langRef.current);
          onSelectLocation({
            lat,
            lng,
            address,
          });
        });
      }
    }
  }, []);

  // Update Markers and Map View
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Customer marker icon
    const customerIcon = L.divIcon({
      className: 'custom-customer-pin',
      html: `
        <div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -34],
    });

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
    } else {
      customerMarkerRef.current = L.marker([customerLocation.lat, customerLocation.lng], {
        icon: customerIcon,
        draggable: interactive,
      }).addTo(map);

      if (interactive && onSelectLocation) {
        customerMarkerRef.current.on('dragend', async (e) => {
          const latlng = (e.target as L.Marker).getLatLng();
          const address = await reverseGeocode(latlng.lat, latlng.lng, langRef.current);
          onSelectLocation({
            lat: latlng.lat,
            lng: latlng.lng,
            address,
          });
        });
      }
    }

    // If single customer location in interactive mode, smoothly fly to updated coordinates
    if (!specialistLocation && interactive) {
      map.flyTo([customerLocation.lat, customerLocation.lng], Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }

    // Specialist marker icon (Vehicle / Master)
    if (specialistLocation) {
      const specialistIcon = L.divIcon({
        className: 'custom-specialist-pin',
        html: `
          <div style="background-color: #f59e0b; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(245,158,11,0.5); border: 2px solid #ffffff; animation: pulse 2s infinite;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      if (specialistMarkerRef.current) {
        specialistMarkerRef.current.setLatLng([specialistLocation.lat, specialistLocation.lng]);
      } else {
        specialistMarkerRef.current = L.marker([specialistLocation.lat, specialistLocation.lng], {
          icon: specialistIcon,
        }).addTo(map);
      }

      // Route line
      if (showRoute) {
        const routePoints: [number, number][] = [
          [specialistLocation.lat, specialistLocation.lng],
          [(specialistLocation.lat + customerLocation.lat) / 2, (specialistLocation.lng + customerLocation.lng) / 2 + 0.001],
          [customerLocation.lat, customerLocation.lng],
        ];

        if (routeLineRef.current) {
          routeLineRef.current.setLatLngs(routePoints);
        } else {
          routeLineRef.current = L.polyline(routePoints, {
            color: '#2563eb',
            weight: 4,
            dashArray: '6, 8',
            opacity: 0.8,
          }).addTo(map);
        }
      }
    } else {
      if (specialistMarkerRef.current) {
        map.removeLayer(specialistMarkerRef.current);
        specialistMarkerRef.current = null;
      }
      if (routeLineRef.current) {
        map.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }
    }

    // Fit bounds if both points exist
    if (specialistLocation && showRoute) {
      const bounds = L.latLngBounds([
        [customerLocation.lat, customerLocation.lng],
        [specialistLocation.lat, specialistLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [customerLocation.lat, customerLocation.lng, specialistLocation, interactive, showRoute, language]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !onSelectLocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocode(latitude, longitude, langRef.current);
        onSelectLocation({
          lat: latitude,
          lng: longitude,
          address,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed:', err.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
      {interactive && (
        <>
          <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            {language === 'ru'
              ? 'Нажмите на карту или переместите метку'
              : language === 'en'
              ? 'Click map or drag the pin'
              : 'Սեղմեք քարտեզին կամ տեղաշարժեք նշիչը'}
          </div>

          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title={language === 'ru' ? 'Мое местоположение' : language === 'en' ? 'My location' : 'Իմ տեղադրությունը'}
            className="absolute top-3 right-3 z-[1000] bg-white text-slate-700 hover:text-blue-600 p-2 rounded-lg border border-slate-200 shadow-md hover:bg-slate-50 transition flex items-center gap-1 text-xs font-semibold"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4 text-blue-600" />
            )}
            <span className="hidden sm:inline">
              {language === 'ru' ? 'Где я?' : language === 'en' ? 'My GPS' : 'Իմ դիրքը'}
            </span>
          </button>
        </>
      )}
    </div>
  );
};
