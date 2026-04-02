"use client";

import { deleteTrip, getUserTrips } from "@/app/actions/trips";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { user, isLoaded } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 9;

  useEffect(() => {
    async function fetchTrips() {
      if (user) {
        setLoading(true);
        const { data, count } = await getUserTrips(1, limit);
        setTrips(data);
        setHasMore((data.length) < count);
        setPage(2);
        setLoading(false);
      }
    }
    if (isLoaded) {
      if (!user) {
        window.location.href = "/login";
      } else {
        fetchTrips();
      }
    }
  }, [user, isLoaded]);

  async function handleDelete(tripId: string) {
    if (!user || !confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await deleteTrip(tripId);
      setTrips(prev => prev.filter(t => t.id !== tripId));
    } catch (err) {
      alert("Failed to delete trip. Please try again.");
    }
  }

  async function loadMore() {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data, count } = await getUserTrips(page, limit);
      const newTrips = [...trips, ...data];
      setTrips(newTrips);
      setHasMore(newTrips.length < count);
      setPage(p => p + 1);
    } catch (err) {
    } finally {
      setLoadingMore(false);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-emerald-500 gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-sm font-medium tracking-widest uppercase opacity-50">Loading your trips...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500 tracking-tight">
              My Adventures
            </h1>
            <p className="text-neutral-500 mt-2 text-lg">Your curated collection of past and upcoming journeys.</p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="border border-white/5 bg-white/[0.02] rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-neutral-700" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No trips found</h2>
            <p className="text-neutral-500 mb-8 max-w-sm mx-auto">You haven't saved any travel plans yet. Start by designing your perfect itinerary.</p>
            <Link 
              href="/"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
            >
              Start Planning &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all hover:bg-neutral-900"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 bg-emerald-500/10 px-2 py-1 rounded">
                      {trip.duration} Days
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                    {trip.from_city} to {trip.to_city}
                  </h3>
                  <p className="text-neutral-500 text-xs font-medium uppercase tracking-tighter mb-4 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {trip.vibe.charAt(0).toUpperCase() + trip.vibe.slice(1)} Adventure
                  </p>

                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                    <Link 
                      href={`/itinerary?id=${trip.id}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-emerald-400 transition-colors"
                    >
                      View Trip
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(trip.id)}
                      className="text-neutral-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {hasMore && (
              <div className="mt-12 flex justify-center w-full col-span-full">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-neutral-900 border border-white/10 hover:border-emerald-500/50 hover:bg-neutral-800 rounded-full text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
                >
                  {loadingMore ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  ) : "Load More Trips"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
