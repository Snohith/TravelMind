"use client";

import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ItineraryDay } from "@/data/mock-itinerary";

// Custom Icon for Active vs Inactive Days
const createCustomIcon = (isActive: boolean, dayNumber: number) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative w-8 h-8 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
        isActive 
          ? 'bg-emerald-500 text-neutral-900 shadow-emerald-500/50 scale-125 z-50 ring-4 ring-emerald-500/30' 
          : 'bg-neutral-800 border border-white/10 text-neutral-400'
      }">
        <span class="text-sm font-bold">${dayNumber}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Custom Icon for Activities
const createActivityIcon = (type: string, isActive: boolean) => {
  const getColors = () => {
    switch(type) {
      case 'dining': return isActive ? 'bg-orange-500' : 'bg-orange-900/50';
      case 'sightseeing': return isActive ? 'bg-blue-500' : 'bg-blue-900/50';
      case 'transit': return isActive ? 'bg-zinc-500' : 'bg-zinc-700/50';
      case 'accommodation': return isActive ? 'bg-purple-500' : 'bg-purple-900/50';
      default: return isActive ? 'bg-emerald-500' : 'bg-emerald-900/50';
    }
  };

  return L.divIcon({
    className: 'custom-activity-marker',
    html: `
      <div class="w-5 h-5 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center ${getColors()} transition-all duration-300 ${isActive ? 'scale-110 z-30' : 'scale-90 opacity-60'}">
        <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

interface MapUpdaterProps {
  activeDay: ItineraryDay;
  focusedLocation?: { lat: number; lng: number } | null;
}

// Helper component to auto-pan map using map context
function MapUpdater({ activeDay, focusedLocation }: MapUpdaterProps) {
  const map = useMap();
  
  useEffect(() => {
    if (focusedLocation) {
      // Fly to specific activity with higher zoom
      map.flyTo([focusedLocation.lat, focusedLocation.lng], 16, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    } else {
      // Day-level zoom
      map.flyTo([activeDay.location.lat, activeDay.location.lng], 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [activeDay, focusedLocation, map]);

  return null;
}

// Forces Leaflet to recalculate its container size after mount.
// Necessary when the map renders inside a flex/grid container
// whose dimensions are resolved via CSS after the initial render.
function MapInvalidator() {
  const map = useMap();
  useEffect(() => {
    // Small delay ensures the CSS layout has been fully applied
    const timer = setTimeout(() => { map.invalidateSize(); }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

interface RealMapProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  setActiveDayId: (id: string) => void;
  focusedLocation?: { lat: number; lng: number } | null;
}

export default function RealMap({ itinerary, activeDayId, setActiveDayId, focusedLocation }: RealMapProps) {
  const activeDay = useMemo(() => itinerary.find(day => day.id === activeDayId) || itinerary[0], [itinerary, activeDayId]);

  // Custom focused activity marker
  const focusedIcon = useMemo(() => L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative w-10 h-10 rounded-full flex items-center justify-center shadow-2xl bg-emerald-400 text-neutral-900 ring-4 ring-emerald-400/30 scale-110 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  }), []);

  // Use the first day's coordinates as a stable key — if the destination changes,
  // this forces MapContainer to fully unmount + remount (Leaflet ignores `center`
  // after the initial render, so a new key is the only reliable reset approach).
  const mapKey = `${itinerary[0]?.location.lat}-${itinerary[0]?.location.lng}`;

  // Calculate coordinates for the day's route polyline
  const routePositions = useMemo(() => {
    return activeDay.activities
      .filter(act => act.location)
      .map(act => [act.location!.lat, act.location!.lng] as L.LatLngExpression);
  }, [activeDay]);

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        key={mapKey}
        center={[activeDay.location.lat, activeDay.location.lng]} 
        zoom={13} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        zoomControl={false}
      >
        {/* Sleek Dark Mode CartoDB Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />
        
        <MapUpdater activeDay={activeDay} focusedLocation={focusedLocation} />
        <MapInvalidator />

        {/* Route Visualization - Polyline */}
        {routePositions.length > 1 && (
          <>
            {/* Outline/Glow Effect Polyline */}
            <Polyline 
              positions={routePositions} 
              pathOptions={{ 
                color: '#10b981', 
                weight: 6, 
                opacity: 0.2,
                lineCap: 'round',
                lineJoin: 'round'
              }} 
            />
            {/* Main Primary Polyline */}
            <Polyline 
              positions={routePositions} 
              pathOptions={{ 
                color: '#10b981', 
                weight: 2, 
                opacity: 0.8,
                dashArray: '8, 12',
                lineCap: 'round',
                lineJoin: 'round'
              }} 
            />
          </>
        )}

        {/* Focused activity pin - shown when user clicks a specific activity */}
        {focusedLocation && (
          <Marker
            position={[focusedLocation.lat, focusedLocation.lng]}
            icon={focusedIcon}
            zIndexOffset={1000}
          >
            <Popup className="custom-popup" closeButton={false} autoPan={false}>
              <div className="bg-neutral-900 text-white p-2 rounded-xl border border-emerald-500/30 shadow-2xl min-w-[160px]">
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Selected Location</span>
                </div>
                <p className="text-xs text-neutral-300">Click a day to return to the day view.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Activity markers for the active day */}
        {activeDay.activities.map((activity) => {
          if (!activity.location || (focusedLocation && activity.location.lat === focusedLocation.lat && activity.location.lng === focusedLocation.lng)) {
            return null;
          }
          return (
            <Marker
              key={activity.id}
              position={[activity.location.lat, activity.location.lng]}
              icon={createActivityIcon(activity.type, true)}
            >
              <Popup className="custom-popup" closeButton={false} autoPan={false}>
                <div className="bg-neutral-900 text-white p-2 rounded-xl border border-white/10 shadow-2xl min-w-[150px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">{activity.time}</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">{activity.type}</span>
                  </div>
                  <h4 className="font-bold text-sm">{activity.title}</h4>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {itinerary.map((day) => {
          const isActive = day.id === activeDayId;
          return (
            <Marker
              key={day.id}
              position={[day.location.lat, day.location.lng]}
              icon={createCustomIcon(isActive, day.dayNumber)}
              eventHandlers={{
                click: () => setActiveDayId(day.id),
              }}
              zIndexOffset={isActive ? 100 : 0}
            >
              <Popup className="custom-popup" closeButton={false} autoPan={false}>
                <div className="bg-neutral-900 text-white p-2 rounded-xl border border-white/10 shadow-2xl min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                      Day {day.dayNumber}
                    </div>
                    <span className="text-xs text-neutral-400 font-medium">{day.date}</span>
                  </div>
                  <h3 className="font-bold text-base mb-1">{day.title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {day.description}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>


      {/* Global overrides for leaflet defaults */}
      <style>{`
        .leaflet-container {
          background-color: #050505 !important;
          outline: none;
        }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0;
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .custom-leaflet-marker {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
