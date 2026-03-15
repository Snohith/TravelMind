"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState("Bangalore");
  const [toCity, setToCity] = useState("Goa");
  
  // Dropdown states
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  
  const cities = ["Hyderabad", "Warangal", "Vizag", "Mumbai", "Bangalore", "Goa", "Delhi", "Chennai", "Kashmir", "Rajasthan"];

  // Guests & Rooms state
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity) return;
    
    const params = new URLSearchParams({
       from: fromCity,
       to: toCity,
    });
    
    router.push(`/itinerary?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative z-10 w-full max-w-5xl mx-auto mt-8"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 pt-3 pb-8 sm:pb-12 relative"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
          
          {/* From City */}
          <div className="relative group">
            <div className="w-full relative px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors h-full flex flex-col justify-center">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1 cursor-text pointer-events-none">
                From City <ChevronDown className={`w-3 h-3 transition-transform ${fromOpen ? 'rotate-180' : ''}`} />
              </label>
              <input 
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                onFocus={() => { setFromOpen(true); setToOpen(false); setGuestsOpen(false); }}
                onBlur={() => setTimeout(() => setFromOpen(false), 200)}
                placeholder="Origin"
                className="block w-full text-3xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none truncate leading-none mb-1 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
              <span className="text-sm font-medium text-zinc-500 block truncate pointer-events-none">Global Locations</span>
            </div>
            
            <AnimatePresence>
              {fromOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 mt-2 w-[280px] sm:w-72 max-h-64 overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60] custom-scrollbar"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setFromCity(city); setFromOpen(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-medium text-zinc-900 dark:text-zinc-100 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* To City */}
          <div className="relative group">
            <div className="w-full relative px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors h-full flex flex-col justify-center">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1 cursor-text pointer-events-none">
                To City <ChevronDown className={`w-3 h-3 transition-transform ${toOpen ? 'rotate-180' : ''}`} />
              </label>
              <input 
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                onFocus={() => { setToOpen(true); setFromOpen(false); setGuestsOpen(false); }}
                onBlur={() => setTimeout(() => setToOpen(false), 200)}
                placeholder="Destination"
                className="block w-full text-3xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none truncate leading-none mb-1 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              />
              <span className="text-sm font-medium text-zinc-500 block truncate pointer-events-none">Global Locations</span>
            </div>

            <AnimatePresence>
              {toOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 mt-2 w-[280px] sm:w-72 max-h-64 overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60] custom-scrollbar"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setToCity(city); setToOpen(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-medium transition-colors ${fromCity === city ? 'opacity-50 cursor-not-allowed text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}
                      disabled={fromCity === city}
                    >
                      {city} {fromCity === city && "(Origin)"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Rooms & Guests */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => { setGuestsOpen(!guestsOpen); setFromOpen(false); setToOpen(false); }}
              className="w-full text-left px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors h-full flex flex-col justify-center"
            >
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1 cursor-pointer">
                Rooms & Guests <ChevronDown className={`w-3 h-3 transition-transform ${guestsOpen ? 'rotate-180' : ''}`} />
              </label>
              <div className="flex items-baseline gap-1 leading-none mb-1">
                <span className="text-3xl font-black text-zinc-900 dark:text-zinc-100">{adults + children}</span>
                <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Travelers</span>
              </div>
              <span className="text-sm font-medium text-zinc-500 block truncate">{rooms} Room</span>
            </button>

            {/* Guests Dropdown */}
            <AnimatePresence>
              {guestsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-0 mt-2 w-[300px] sm:w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 z-[60]"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Rooms</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">-</button>
                        <span className="w-4 text-center font-bold">{rooms}</span>
                        <button type="button" onClick={() => setRooms(rooms + 1)} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">+</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Adults</p>
                        <p className="text-xs font-medium text-zinc-500">&gt; 12 Years</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">-</button>
                        <span className="w-4 text-center font-bold">{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">+</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">Children</p>
                        <p className="text-xs font-medium text-zinc-500">2 - 12 Years</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">-</button>
                        <span className="w-4 text-center font-bold">{children}</span>
                        <button type="button" onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">+</button>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setGuestsOpen(false)}
                      className="w-full py-3 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all uppercase tracking-wide"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search Button positioned Absolute like MMT */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 sm:py-4 px-12 sm:px-16 text-lg sm:text-xl font-bold shadow-xl transition-all uppercase tracking-widest"
          >
            Search
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}
