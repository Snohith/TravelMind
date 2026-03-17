"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const router = useRouter();
  const [fromCity, setFromCity] = useState("Bangalore");
  const [toCity, setToCity] = useState("Goa");
  
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  
  const cities = ["Hyderabad", "Warangal", "Vizag", "Mumbai", "Bangalore", "Goa", "Delhi", "Chennai", "Kashmir", "Rajasthan"];

  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity) return;
    const params = new URLSearchParams({ from: fromCity, to: toCity });
    router.push(`/itinerary?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="relative z-10 w-full max-w-5xl mx-auto mt-28 px-2 sm:px-0"
    >
      <form
        onSubmit={handleSubmit}
        className="relative bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-visible"
      >
        {/* Fields Row — stacked on mobile, side-by-side on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
          
          {/* From City */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> From
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${fromOpen ? 'rotate-180' : ''}`} />
              </label>
              <button
                type="button"
                onClick={() => { setFromOpen(!fromOpen); setToOpen(false); setGuestsOpen(false); }}
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
                  className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-72 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60]"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setFromCity(city); setFromOpen(false); }}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl font-medium text-zinc-900 dark:text-zinc-100 transition-colors text-sm"
                    >
                      {city}
                    </button>
                  ))}
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
                onClick={() => { setToOpen(!toOpen); setFromOpen(false); setGuestsOpen(false); }}
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
                  className="absolute top-full left-0 right-0 sm:left-0 sm:right-auto sm:w-72 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-[60]"
                >
                  {cities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => { setToCity(city); setToOpen(false); }}
                      disabled={fromCity === city}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-colors text-sm ${fromCity === city ? 'opacity-40 cursor-not-allowed text-zinc-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100'}`}
                    >
                      {city} {fromCity === city && "(Origin)"}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guests & Rooms */}
          <div className="relative sm:col-span-2 md:col-span-1">
            <button
              type="button"
              onClick={() => { setGuestsOpen(!guestsOpen); setFromOpen(false); setToOpen(false); }}
              className="w-full text-left px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center"
            >
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1 pointer-events-none">
                <Users className="w-3 h-3" /> Guests
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${guestsOpen ? 'rotate-180' : ''}`} />
              </label>
              <div className="flex items-baseline gap-1.5 leading-tight">
                <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">{adults + children}</span>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Travelers</span>
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
        </div>

        {/* Search Button — always centered below the fields, never overlapping */}
        <div className="flex items-center justify-center px-4 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-16 text-base md:text-xl font-bold shadow-xl transition-all uppercase tracking-widest"
          >
            Search
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}
