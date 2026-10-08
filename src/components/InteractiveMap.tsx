"use client";

import { ItineraryDay } from "@/data/mock-itinerary";
import dynamic from "next/dynamic";

// Dynamically import the RealMap component, disabling SSR
// This is required because Leaflet relies on the `window` object which is not available on the server.
const RealMap = dynamic(() => import("@/components/RealMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
      <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      <span className="text-sm font-medium tracking-widest uppercase opacity-50">Loading Map...</span>
    </div>
  )
});

interface InteractiveMapProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  setActiveDayId: (id: string) => void;
  focusedLocation?: { lat: number; lng: number } | null;
}

export default function InteractiveMap(props: InteractiveMapProps) {
  return <RealMap {...props} />;
}
