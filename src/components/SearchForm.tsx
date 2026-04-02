"use client";

import { BouncingDots } from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronDown, IndianRupee, MapPin, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const searchSchema = z.object({
  from: z.string().min(2, "Select origin"),
  to: z.string().min(2, "Select destination"),
  budget: z.number().min(1000, "Minimum ₹1,000 required"),
  adults: z.number().min(1),
  children: z.number().min(0),
  rooms: z.number().min(1),
  vibe: z.string(),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }).refine(data => data.to >= data.from, {
    message: "End date cannot be before start date",
    path: ["to"]
  })
});

type SearchValues = z.infer<typeof searchSchema>;

export default function SearchForm() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [vibeOpen, setVibeOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const cities = ["Hyderabad", "Warangal", "Vizag", "Mumbai", "Bangalore", "Goa", "Delhi", "Chennai", "Kashmir", "Rajasthan", "Pune", "Kolkata", "Ahmedabad", "Lucknow", "Jaipur", "Kochi", "Manali", "Leh", "Shimla", "Agra"];
  const vibes = ["Adventure", "Relaxing", "Cultural", "Luxury", "Balanced"];

  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      from: "Bangalore",
      to: "Goa",
      budget: 35000 as any,
      adults: 2,
      children: 0,
      rooms: 1,
      vibe: "Balanced",
      dates: {
        from: new Date(),
        to: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
      }
    }
  });

  const fromCity = watch("from");
  const toCity = watch("to");
  const vibe = watch("vibe");
  const budget = watch("budget");
  const adults = watch("adults");
  const children = watch("children");
  const rooms = watch("rooms");
  const dateRange = watch("dates");

  const filteredFromCities = cities.filter(c => c.toLowerCase().includes(fromSearch.toLowerCase()));
  const filteredToCities = cities.filter(c => c.toLowerCase().includes(toSearch.toLowerCase()));

  const onSubmit = async (data: SearchValues) => {
    setIsGenerating(true);
    try {
      const params = new URLSearchParams({ 
        from: data.from, 
        to: data.to,
        vibe: data.vibe.toLowerCase(),
        budget: data.budget.toString(),
        start: data.dates.from.toISOString(),
        end: data.dates.to.toISOString()
      });
      router.push(`/itinerary?${params.toString()}`);
    } catch (error) {
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
        onSubmit={handleSubmit(onSubmit) as any}
        className="relative bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y lg:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
          
          {/* From City */}
          <div className="relative">
            <div className="w-full px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> From
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${fromOpen ? 'rotate-180' : ''}`} />
              </label>
              <button
                type="button"
                onClick={() => { setFromOpen(!fromOpen); setFromSearch(""); setToOpen(false); setGuestsOpen(false); setVibeOpen(false); setDateOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight truncate"
              >
                {fromCity || <span className="text-zinc-400">Origin</span>}
              </button>
              <span className="text-xs font-medium text-zinc-400 mt-1">Indian Locations</span>
              {errors.from && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.from.message}</p>}
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
                        onClick={() => { setValue("from", city, { shouldValidate: true }); setFromOpen(false); }}
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
                onClick={() => { setToOpen(!toOpen); setToSearch(""); setFromOpen(false); setGuestsOpen(false); setVibeOpen(false); setDateOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight truncate"
              >
                {toCity || <span className="text-zinc-400">Destination</span>}
              </button>
              <span className="text-xs font-medium text-zinc-400 mt-1">Indian Locations</span>
              {errors.to && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.to.message}</p>}
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
                        onClick={() => { setValue("to", city, { shouldValidate: true }); setToOpen(false); }}
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

          {/* Date Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setDateOpen(!dateOpen); setFromOpen(false); setToOpen(false); setGuestsOpen(false); setVibeOpen(false); }}
              className="w-full text-left px-4 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex flex-col justify-center border-t sm:border-t-0"
            >
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" /> Dates
                <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${dateOpen ? 'rotate-180' : ''}`} />
              </label>
              <div className="flex items-baseline gap-1.5 leading-tight truncate">
                <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd")
                    )
                  ) : (
                    <span>Pick dates</span>
                  )}
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-400 mt-1">Duration</span>
              {errors.dates?.to && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.dates.to.message}</p>}
            </button>

            <AnimatePresence>
              {dateOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 p-4 bg-white dark:bg-zinc-950 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-zinc-200 dark:border-zinc-800 z-[70]"
                >
                  <Controller
                    control={control}
                    name="dates"
                    render={({ field }) => (
                      <DayPicker
                        mode="range"
                        selected={field.value as DateRange}
                        onSelect={(range) => {
                          field.onChange(range);
                          // We don't close on first click for range selection
                        }}
                        numberOfMonths={1}
                        className="dark:text-white"
                      />
                    )}
                  />
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Select your window</p>
                    <Button 
                      type="button" 
                      onClick={() => setDateOpen(false)}
                      className="rounded-full h-8 px-4 text-xs font-bold bg-zinc-900 dark:bg-white dark:text-zinc-950"
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Guests & Rooms */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setGuestsOpen(!guestsOpen); setFromOpen(false); setToOpen(false); setVibeOpen(false); setDateOpen(false); }}
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
                       { label: "Rooms", sub: null, value: rooms, setter: (v: number) => setValue("rooms", v), min: 1 },
                      { label: "Adults", sub: "> 12 Years", value: adults, setter: (v: number) => setValue("adults", v), min: 1 },
                      { label: "Children", sub: "2 – 12 Years", value: children, setter: (v: number) => setValue("children", v), min: 0 },
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
                onClick={() => { setVibeOpen(!vibeOpen); setFromOpen(false); setToOpen(false); setGuestsOpen(false); setDateOpen(false); }}
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
                      onClick={() => { setValue("vibe", v); setVibeOpen(false); }}
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
                {...register("budget", { valueAsNumber: true })}
                onFocus={() => { setFromOpen(false); setToOpen(false); setGuestsOpen(false); setVibeOpen(false); setDateOpen(false); }}
                className="block w-full text-left text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none leading-tight"
                placeholder="Amount"
              />
              <span className="text-xs font-medium text-zinc-400 mt-1">Max per trip</span>
              {errors.budget && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">{errors.budget.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02] rounded-b-2xl">
          <Button
            disabled={isGenerating}
            type="submit"
            variant="liquid"
            size="lg"
            className="group h-16 px-12 rounded-full text-base md:text-lg font-black uppercase tracking-[0.2em]"
          >
            {isGenerating ? (
              <BouncingDots className="bg-current" />
            ) : (
              <>
                <motion.svg 
                  className="w-6 h-6 sm:w-7 sm:h-7 transition-all duration-[1.5s] ease-in-out group-hover:rotate-[250deg]" 
                  viewBox="0 0 512 512" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fill="currentColor" 
                    d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" 
                  />
                </motion.svg>
                <span>EXPLORE THE WORLD</span>
              </>
            )}
          </Button>
        </div>

      </form>
    </motion.div>
  );
}
