"use client";

import React, { useState, Suspense, useEffect } from "react";
import Timeline from "@/components/Timeline";
import InteractiveMap from "@/components/InteractiveMap";
import { getTripByRoute } from "@/data/mock-itinerary";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

// Since we're using "useSearchParams", it needs to be wrapped in a suspense boundary
function ItineraryContent() {
  const searchParams = useSearchParams();
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  // Auth guard — redirect to login if not signed in
  useEffect(() => {
    if (isLoaded && !user) {
      const params = new URLSearchParams();
      if (fromParam) params.set('from', fromParam);
      if (toParam) params.set('to', toParam);
      const itineraryUrl = `/itinerary${params.toString() ? `?${params.toString()}` : ''}`;
      router.replace(`/login?redirect=${encodeURIComponent(itineraryUrl)}`);
    }
  }, [isLoaded, user, router, fromParam, toParam]);

  // Calculate which trip to show based on the query parameters
  const trip = getTripByRoute(fromParam, toParam);
  
  const [activeDayId, setActiveDayId] = useState(trip.days[0].id);
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);
  // Track the last-rendered trip ID to detect when the route changes.
  const [renderedTripId, setRenderedTripId] = useState(trip.id);
  if (renderedTripId !== trip.id) {
    setRenderedTripId(trip.id);
    setActiveDayId(trip.days[0].id);
    setFocusedLocation(null);
  }

  // Show a loading spinner while auth check runs or unauthenticated redirect is in progress
  if (!isLoaded || !user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-sm font-medium tracking-widest uppercase opacity-50">Verifying access...</span>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar Timeline - Left Column */}
      <div className="w-full md:w-5/12 lg:w-[38%] h-[55vh] md:h-full overflow-y-auto border-b md:border-b-0 md:border-r border-white/5 shrink-0 custom-scrollbar z-20 shadow-2xl bg-neutral-950">
        <Timeline 
          itinerary={trip.days} 
          activeDayId={activeDayId} 
          setActiveDayId={(id) => { setActiveDayId(id); setFocusedLocation(null); }} 
          tripTitle={trip.title}
          totalPriceINR={trip.totalPriceINR}
          onActivityClick={(loc) => setFocusedLocation(loc)}
        />
      </div>
      
      {/* Main Map Area - Right Column */}
      <div className="w-full md:w-7/12 lg:w-[62%] h-[45vh] md:h-full min-h-0 relative bg-[#050505] overflow-hidden z-10">
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
    <div className="flex flex-col md:flex-row w-full h-[100dvh] pt-[64px] bg-neutral-950 text-white overflow-hidden font-sans">
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
