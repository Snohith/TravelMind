"use client";

import React, { useEffect, useRef } from "react";
import { ItineraryDay, Activity } from "@/data/mock-itinerary";
import { motion } from "framer-motion";
import { Utensils, Camera, Train, MapPin, Bed } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineProps {
  itinerary: ItineraryDay[];
  activeDayId: string;
  setActiveDayId: (id: string) => void;
  tripTitle?: string;
  onActivityClick?: (location: { lat: number; lng: number }) => void;
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

export default function Timeline({ itinerary, activeDayId, setActiveDayId, tripTitle, onActivityClick }: TimelineProps) {
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

  return (
    <div className="min-h-full bg-neutral-950 p-6 md:p-8 relative" ref={containerRef}>
      <div className="mb-8 sticky top-0 bg-neutral-950/90 backdrop-blur-xl z-30 py-4 -mt-4 border-b border-white/5">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
          {tripTitle || "Your Itinerary"}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">Review your personalized journey day by day.</p>
      </div>

      <div className="relative border-l border-white/10 ml-4 md:ml-6 pb-20">
        {itinerary.map((day) => {
          const isActive = day.id === activeDayId;
          
          return (
            <div 
              key={day.id} 
              data-day-id={day.id}
              className={cn(
                "mb-12 relative pl-8 md:pl-10 transition-all duration-500 cursor-pointer group",
                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
              )}
              onClick={() => setActiveDayId(day.id)}
            >
              {/* Timeline Dot Component */}
              <div className={cn(
                "absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-neutral-950 flex items-center justify-center transition-all duration-500",
                isActive 
                  ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-110" 
                  : "bg-neutral-800 group-hover:bg-neutral-600"
              )}>
                <div className={cn("w-2 h-2 rounded-full transition-colors duration-300", isActive ? "bg-white" : "bg-neutral-400")} />
              </div>

              {/* Day Header Context */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
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
                  "text-2xl font-bold transition-colors duration-300 mt-1",
                  isActive ? "text-white" : "text-neutral-300"
                )}>
                  {day.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-3 leading-relaxed max-w-lg">
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
                      "relative pl-6 py-4 border-l-2 ml-[3px] rounded-r-2xl transition-all duration-300",
                      isActive 
                        ? "border-emerald-500/40 bg-white/[0.03] hover:bg-white/[0.05]" 
                        : "border-transparent hover:bg-white/[0.02]",
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
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "text-sm font-semibold mb-1 transition-colors duration-300",
                            isActive ? "text-neutral-100" : "text-neutral-400"
                          )}>
                            {activity.title}
                          </h4>
                          {activity.location && isActive && (
                            <span className="text-[10px] text-emerald-400/70 font-medium flex items-center gap-0.5 mb-1">
                              <MapPin className="w-2.5 h-2.5" /> View on map
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-neutral-500 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
