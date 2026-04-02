"use client";

import { Activity, ItineraryDay } from "@/data/mock-itinerary";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bed, Camera, Cloud, CloudRain, Droplets, IndianRupee, MapPin, Snowflake, Sun, Train, Utensils } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Delicacy } from "@/data/mock-itinerary";
import LocalFoodGuide from "./LocalFoodGuide";
import PackingList from "./PackingList";

interface TimelineProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  setActiveDayId: (id: string) => void;
  vibe?: string;
  tripTitle?: string;
  totalPriceINR?: number;
  onActivityClick?: (location: { lat: number; lng: number }) => void;
  delicacies: Delicacy[];
  photoGallery: string[];
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'dining': return <Utensils className="w-4 h-4" />;
    case 'sightseeing': return <Camera className="w-4 h-4" />;
    case 'transit': return <Train className="w-4 h-4" />;
    case 'accommodation': return <Bed className="w-4 h-4" />;
    case 'activity': return <MapPin className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getWeatherIcon = (condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Mist' | 'Snow' | undefined) => {
  if (!condition) return <Sun className="w-3 h-3 text-amber-400" />;
  switch (condition) {
    case 'Sunny': return <Sun className="w-3 h-3 text-amber-400" />;
    case 'Cloudy': return <Cloud className="w-3 h-3 text-neutral-400" />;
    case 'Rainy': return <CloudRain className="w-3 h-3 text-blue-400" />;
    case 'Mist': return <Droplets className="w-3 h-3 text-slate-400" />;
    case 'Snow': return <Snowflake className="w-3 h-3 text-teal-200" />;
    default: return <Sun className="w-3 h-3 text-amber-400" />;
  }
};

function formatINR(amount: number): string {
  if (amount === 0) return "Free";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Timeline({ 
  itinerary, 
  activeDayId, 
  setActiveDayId, 
  vibe = 'standard', 
  tripTitle, 
  totalPriceINR, 
  onActivityClick, 
  delicacies, 
  photoGallery
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll the timeline to the active day
  useEffect(() => {
    if (!containerRef.current) return;
    
    // We use setTimeout to ensure rendering has completed
    setTimeout(() => {
      const activeElement = containerRef.current?.querySelector(`[data-day-id="${activeDayId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }, [activeDayId]);

  const openStreetView = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`, '_blank');
  };

  return (
    <div className="min-h-full bg-neutral-950 p-4 md:p-8 relative" ref={containerRef}>
      <div className="mb-6 sticky top-0 bg-neutral-950/90 backdrop-blur-xl z-30 py-3 -mt-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 leading-tight">
            {tripTitle || "Your Itinerary"}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-neutral-500">Review your journey day by day.</p>
            {totalPriceINR !== undefined && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                <IndianRupee className="w-2.5 h-2.5" />
                {new Intl.NumberFormat('en-IN').format(totalPriceINR)} Total
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition-all shrink-0"
          >
            Edit Trip
          </button>
        </div>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-6 pb-4">
        {itinerary.map((day) => {
          const isActive = day.id === activeDayId;
          
          return (
            <div 
              key={day.id} 
              data-day-id={day.id}
              className={cn(
                "mb-12 relative pl-7 md:pl-10 transition-all duration-500 cursor-pointer group",
                isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
              onClick={() => setActiveDayId(day.id)}
            >
              {/* Day Header Image (Premium Visual) */}
              {day.headerImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isActive ? 1 : 0.6, y: 0 }}
                  className={cn(
                    "mb-4 overflow-hidden rounded-2xl aspect-[21/9] relative border border-white/5",
                    isActive ? "ring-2 ring-emerald-500/20" : ""
                  )}
                >
                  <Image 
                    src={day.headerImage} 
                    alt={day.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                  
                  {/* Weather Badge Overlay */}
                  {day.forecast && (
                    <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1.5">
                      {getWeatherIcon(day.forecast.condition)}
                      <span className="text-[10px] font-bold text-white leading-none">{day.forecast.temp}°C</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Timeline Dot Component */}
              <div className={cn(
                "absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-neutral-950 flex items-center justify-center transition-all duration-500 z-10",
                isActive 
                  ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110" 
                  : "bg-neutral-800 group-hover:bg-neutral-600"
              )}>
                <div className={cn("w-2 h-2 rounded-full transition-colors duration-300", isActive ? "bg-white" : "bg-neutral-400")} />
              </div>

              {/* Day Header Context */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300",
                    isActive ? "text-emerald-400" : "text-neutral-500"
                  )}>
                    Day {day.dayNumber}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-neutral-700 mt-0.5" />
                  <span className="text-xs text-neutral-500 font-medium">{day.date}</span>
                </div>
                <h2 className={cn(
                  "text-lg sm:text-2xl font-bold transition-colors duration-300 mt-1 leading-tight",
                  isActive ? "text-white" : "text-neutral-300"
                )}>
                  {day.title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  {day.description}
                </p>
              </div>

              {/* Day Activities List */}
              <div className="space-y-3">
                {day.activities.map((activity, actIndex) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * actIndex }}
                    onClick={() => {
                      if (activity.location && onActivityClick) {
                        onActivityClick(activity.location);
                      }
                    }}
                    className={cn(
                      "relative pl-6 py-4 border-l-2 ml-[3px] rounded-r-2xl transition-all duration-300 group/act",
                      isActive 
                        ? "border-emerald-500/40 bg-white/[0.03] hover:bg-white/[0.05]" 
                        : "border-transparent hover:bg-white/[0.01]",
                      activity.location ? "cursor-pointer" : ""
                    )}
                  >
                    {/* Activity Icon */}
                    <div className={cn(
                      "absolute -left-[11px] top-5 w-5 h-5 rounded-full bg-neutral-950 border flex items-center justify-center transition-colors duration-300",
                       isActive ? "border-emerald-500/50 text-emerald-400" : "border-white/10 text-neutral-500"
                    )}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-6">
                      <span className={cn(
                        "text-xs font-semibold mt-0.5 w-16 shrink-0 transition-colors duration-300",
                        isActive ? "text-emerald-400/90" : "text-neutral-500"
                      )}>
                        {activity.time}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className={cn(
                              "text-sm font-semibold mb-1 transition-colors duration-300",
                              isActive ? "text-neutral-100" : "text-neutral-400"
                            )}>
                              {activity.title}
                            </h4>
                            {activity.location && (
                              <span className={cn(
                                "text-[10px] font-medium flex items-center gap-0.5 mb-1 transition-colors duration-300",
                                isActive ? "text-emerald-400/70" : "text-neutral-600 group-hover/act:text-neutral-400"
                              )}>
                                <MapPin className="w-2.5 h-2.5" /> View on map
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[13px] text-neutral-500 leading-relaxed">
                          {activity.description}
                        </p>
                        {/* INR Price Badge */}
                        {activity.priceINR !== undefined && (
                          <div className={cn(
                            "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            activity.priceINR === 0
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          )}>
                            <IndianRupee className="w-2.5 h-2.5" />
                            {formatINR(activity.priceINR)}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trip Cost Summary */}
      {totalPriceINR !== undefined && (
        <div className="mx-4 md:mx-6 mb-6 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70 mb-1">
                Total Estimated Cost
              </p>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-5 h-5 text-emerald-400" />
                <span className="text-2xl font-black text-white">
                  {new Intl.NumberFormat('en-IN').format(totalPriceINR)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                For 5 days · Flights + Stay + Activities
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500 flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400/50 inline-block" />
                  Paid activities
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400/50 inline-block" />
                  Free experiences
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local Food Guide Integration */}
      <LocalFoodGuide delicacies={delicacies} />

      {/* AI Dynamic Packing List */}
      <PackingList 
        vibe={vibe} 
        weather={itinerary[0]?.forecast?.condition} 
      />
    </div>
  );
}
