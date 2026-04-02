"use client";

import InteractiveMap from "@/components/InteractiveMap";
import Timeline from "@/components/Timeline";
import { BouncingDots } from "@/components/ui/Loader";
import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Since we're using "useSearchParams", it needs to be wrapped in a suspense boundary
import { generateTrip, getTripById } from "@/app/actions/trips";
import { type Trip } from "@/data/mock-itinerary";

function ItineraryContent() {
  const searchParams = useSearchParams();
  const tripId = searchParams.get('id');
  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');
  const vibeParam = searchParams.get('vibe');
  const budgetParam = searchParams.get('budget');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  const { user, isLoaded } = useAuth();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (isLoaded && !user) {
      const params = new URLSearchParams();
      if (fromParam) params.set('from', fromParam);
      if (toParam) params.set('to', toParam);
      // ... redirect to login
      router.replace(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    async function fetchTrip() {
      setLoading(true);
      setError(null);
      try {
        if (tripId) {
          const data = await getTripById(tripId);
          if (data && 'error' in data) {
            setError(data.error as string);
          } else {
            setTrip(data as any);
          }
        } else {
          const result = await generateTrip(fromParam, toParam, vibeParam, budgetParam, startParam, endParam);
          if (result && 'error' in result) {
            setError(result.error as string);
          } else if (result && result.tripId) {
            router.push(`/dashboard?new=${result.tripId}`);
            return;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load trip. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId, fromParam, toParam, vibeParam, budgetParam]);
  
  const [activeDayId, setActiveDayId] = useState("");
  const [focusedLocation, setFocusedLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (trip && trip.days.length > 0) {
      setActiveDayId(trip.days[0].id);
      setFocusedLocation(null);
    }
  }, [trip?.id]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
        <BouncingDots className="bg-emerald-500 w-2 h-2" />
        <span className="text-sm font-medium tracking-widest uppercase opacity-50">
          Generating your trip...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-red-400 gap-4 px-6 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm font-medium max-w-sm">{error}</p>
        <a href="/dashboard" className="text-xs text-emerald-500 hover:text-emerald-400 underline transition-colors">
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-zinc-500 gap-4">
        <span className="text-sm font-medium tracking-widest uppercase opacity-50">Trip not found</span>
        <a href="/dashboard" className="text-xs text-emerald-500 hover:text-emerald-400 underline transition-colors">
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  // Show a loading spinner while auth check runs or unauthenticated redirect is in progress
  if (!isLoaded || !user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
        <BouncingDots className="bg-emerald-500 w-2 h-2" />
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
          vibe={vibeParam || 'balanced'}
          tripTitle={trip.title}
          totalPriceINR={trip.totalPriceINR}
          onActivityClick={(loc) => setFocusedLocation(loc)}
          delicacies={trip.localDelicacies}
          photoGallery={trip.photoGallery}
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


export default function ItineraryClient() {
  return (
    <div className="flex flex-col md:flex-row w-full h-[100dvh] pt-[64px] bg-neutral-950 text-white overflow-hidden font-sans">
      <Suspense fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] text-emerald-500 gap-4">
          <BouncingDots className="bg-emerald-500 w-2 h-2" />
          <span className="text-sm font-medium tracking-widest uppercase opacity-50">Loading Dashboard...</span>
        </div>
      }>
        <ItineraryContent />
      </Suspense>

    </div>
  );
}
