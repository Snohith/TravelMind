"use client";

import React, { useState, Suspense } from "react";
import Timeline from "@/components/Timeline";
import InteractiveMap from "@/components/InteractiveMap";
import { getTripByRoute } from "@/data/mock-itinerary";
import { useSearchParams } from "next/navigation";

// Since we're using "useSearchParams", it needs to be wrapped in a suspense boundary
function ItineraryContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  
  // Calculate which trip to show based on the query parameters
  const trip = getTripByRoute(fromParam, toParam);
  
  const [activeDayId, setActiveDayId] = useState(trip.days[0].id);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Track the last-rendered trip ID to detect when the route changes.
  // Using a state variable (not a ref) so React can batch the resets as an
  // early-return render rather than a cascading useEffect render.
  const [renderedTripId, setRenderedTripId] = useState(trip.id);
  if (renderedTripId !== trip.id) {
    setRenderedTripId(trip.id);
    setActiveDayId(trip.days[0].id);
    setFocusedLocation(null);
  }

  return (
    <>
      {/* Sidebar Timeline - Left Column */}
      <div className="w-full md:w-5/12 lg:w-1/3 h-[60vh] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-white/5 shrink-0 custom-scrollbar z-20 shadow-2xl bg-neutral-950">
        <Timeline 
          itinerary={trip.days} 
          activeDayId={activeDayId} 
          setActiveDayId={(id) => { setActiveDayId(id); setFocusedLocation(null); }} 
          tripTitle={trip.title}
          onActivityClick={(loc) => setFocusedLocation(loc)}
        />
      </div>
      
      {/* Main Map Area - Right Column */}
      <div className="w-full md:w-7/12 lg:w-2/3 h-[40vh] md:h-full relative bg-[#050505] overflow-hidden z-10">
        <InteractiveMap 
          itinerary={trip.days}
          activeDayId={activeDayId} 
          setActiveDayId={setActiveDayId}
          focusedLocation={focusedLocation}
        />
      </div>
    </>
  );
}


export default function ItineraryDashboard() {
  return (
    <div className="flex flex-col md:flex-row w-full h-[100dvh] pt-[72px] bg-neutral-950 text-white overflow-hidden font-sans">
      <Suspense fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          <span className="text-sm font-medium tracking-widest uppercase opacity-50">Loading Dashboard...</span>
        </div>
      }>
        <ItineraryContent />
      </Suspense>

      <style jsx global>{`
        /* Minimal sleek scrollbar for the timeline */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
