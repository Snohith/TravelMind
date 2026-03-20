"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Users, Sparkles, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { generateAndSaveTrip } from "@/app/actions/trips";

export default function SearchForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [fromCity, setFromCity] = useState("Bangalore");
  const [toCity, setToCity] = useState("Goa");
  
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [vibe, setVibe] = useState("Balanced");
  const [vibeOpen, setVibeOpen] = useState(false);
  const vibes = ["Adventure", "Relaxing", "Cultural", "Luxury", "Balanced"];

  const [budget, setBudget] = useState("35000");

  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");

  const cities = ["Hyderabad", "Warangal", "Vizag", "Mumbai", "Bangalore", "Goa", "Delhi", "Chennai", "Kashmir", "Rajasthan", "Pune", "Kolkata", "Ahmedabad", "Lucknow", "Jaipur", "Kochi", "Manali", "Leh", "Shimla", "Agra"];

  const filteredFromCities = cities.filter(c => c.toLowerCase().includes(fromSearch.toLowerCase()));
  const filteredToCities = cities.filter(c => c.toLowerCase().includes(toSearch.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity) return;

    setIsGenerating(true);

    try {
      if (user) {
        // Logged in: generate and save to DB immediately
        const tripId = await generateAndSaveTrip(fromCity, toCity, vibe, budget, user.id);
        router.push(`/itinerary?id=${tripId}`);
      } else {
        // Guest: proceed with query params
        const params = new URLSearchParams({ 
          from: fromCity, 
          to: toCity,
          vibe: vibe.toLowerCase(),
          budget: budget
        });
        router.push(`/itinerary?${params.toString()}`);
      }
    } catch (error) {
      console.error("Selection error:", error);
      // Fallback
      const params = new URLSearchParams({ from: fromCity, to: toCity, vibe, budget });
      router.push(`/itinerary?${params.toString()}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative z-10 w-full max-w-6xl mx-auto mt-28 px-2 sm:px-0"
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
          
          {/* From City */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> From
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${fromOpen ? 'rotate-180' : ''}`} />
              </label>
              <button
                type="button"
                onClick={() => { setFromOpen(!fromOpen); setFromSearch(""); setToOpen(false); setGuestsOpen(false); setVibeOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight truncate"
              >
                {fromCity || <span className="text-zinc-400">Origin City</span>}
              </button>
              <span className="text-xs font-medium text-zinc-400 mt-1">Indian Locations</span>
            </div>

            <AnimatePresence>
              {fromOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-72 mt-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60]"
                >
                  <input 
                    autoFocus
                    type="text"
                    value={fromSearch}
                    onChange={(e) => setFromSearch(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-4 py-2 mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 shadow-inner"
                  />
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredFromCities.length > 0 ? filteredFromCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => { setFromCity(city); setFromOpen(false); }}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-medium text-zinc-900 dark:text-zinc-100 transition-colors text-sm"
                      >
                        {city}
                      </button>
                    )) : (
                      <p className="px-4 py-3 text-xs text-zinc-500 italic">No cities found matching "{fromSearch}"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* To City */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> To
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${toOpen ? 'rotate-180' : ''}`} />
              </label>
              <button
                type="button"
                onClick={() => { setToOpen(!toOpen); setToSearch(""); setFromOpen(false); setGuestsOpen(false); setVibeOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight truncate"
              >
                {toCity || <span className="text-zinc-400">Destination City</span>}
              </button>
              <span className="text-xs font-medium text-zinc-400 mt-1">Indian Locations</span>
            </div>

            <AnimatePresence>
              {toOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-72 mt-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60]"
                >
                  <input 
                    autoFocus
                    type="text"
                    value={toSearch}
                    onChange={(e) => setToSearch(e.target.value)}
                    placeholder="Search city..."
                    className="w-full px-4 py-2 mb-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 shadow-inner"
                  />
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {filteredToCities.length > 0 ? filteredToCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => { setToCity(city); setToOpen(false); }}
                        disabled={fromCity === city}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors text-sm ${fromCity === city ? 'opacity-40 cursor-not-allowed text-zinc-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}
                      >
                        {city} {fromCity === city && "(Origin)"}
                      </button>
                    )) : (
                      <p className="px-4 py-3 text-xs text-zinc-500 italic">No cities found matching "{toSearch}"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guests & Rooms */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setGuestsOpen(!guestsOpen); setFromOpen(false); setToOpen(false); setVibeOpen(false); }}
              className="w-full text-left px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center border-t sm:border-t-0"
            >
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1 pointer-events-none">
                <Users className="w-3 h-3" /> Guests
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${guestsOpen ? 'rotate-180' : ''}`} />
              </label>
              <div className="flex items-baseline gap-1.5 leading-tight">
                <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">{adults + children}</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Travelers</span>
              </div>
              <span className="text-xs font-medium text-zinc-400 mt-1">{rooms} Room{rooms > 1 ? 's' : ''}</span>
            </button>

            <AnimatePresence>
              {guestsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 sm:right-0 sm:left-auto sm:w-80 mt-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 z-[60]"
                >
                  <div className="space-y-4">
                    {[
                      { label: "Rooms", sub: null, value: rooms, setter: setRooms, min: 1 },
                      { label: "Adults", sub: "> 12 Years", value: adults, setter: setAdults, min: 1 },
                      { label: "Children", sub: "2 – 12 Years", value: children, setter: setChildren, min: 0 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{item.label}</p>
                          {item.sub && <p className="text-xs text-zinc-500">{item.sub}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          <button type="button" onClick={() => item.setter(Math.max(item.min, item.value - 1))} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-lg leading-none">−</button>
                          <span className="w-5 text-center font-bold text-zinc-900 dark:text-zinc-100">{item.value}</span>
                          <button type="button" onClick={() => item.setter(item.value + 1)} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-lg leading-none">+</button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setGuestsOpen(false)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all uppercase tracking-wide"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trip Vibe */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center border-t lg:border-t-0">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" /> Vibe
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${vibeOpen ? 'rotate-180' : ''}`} />
              </label>
              <button
                type="button"
                onClick={() => { setVibeOpen(!vibeOpen); setFromOpen(false); setToOpen(false); setGuestsOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight truncate"
              >
                {vibe || <span className="text-zinc-400">Select Vibe</span>}
              </button>
              <span className="text-xs font-medium text-zinc-400 mt-1">Travel Style</span>
            </div>

            <AnimatePresence>
              {vibeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 sm:right-0 sm:left-auto lg:left-0 lg:right-auto sm:w-64 mt-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60]"
                >
                  {vibes.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setVibe(v); setVibeOpen(false); }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors text-sm ${vibe === v ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}
                    >
                      {v}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Budget Field */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center border-t lg:border-t-0">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-amber-500" /> Budget
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                onFocus={() => { setFromOpen(false); setToOpen(false); setGuestsOpen(false); setVibeOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight"
                placeholder="Amount"
              />
              <span className="text-xs font-medium text-zinc-400 mt-1">Max per trip</span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-center justify-center px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isGenerating}
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full py-3 px-16 text-base md:text-xl font-bold shadow-xl transition-all uppercase tracking-widest"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting Itinerary...
              </>
            ) : (
              "Search"
            )}
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}
