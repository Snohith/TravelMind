"use client";

import { motion } from "framer-motion";
import SearchForm from "./SearchForm";
import { Spotlight } from "./ui/Spotlight"; // We noticed this component exists

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 flex flex-col items-center justify-center min-h-[90vh] sm:min-h-screen overflow-hidden bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      
      {/* Dynamic Background Effects */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-0">
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm sm:text-base text-zinc-300 font-medium">
              ✨ Discover Your Next Adventure
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight mb-6 leading-[1.1]"
          >
            <span className="text-white block pb-2">
              TravelMind
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl text-zinc-300 font-medium max-w-3xl mx-auto"
          >
            Your Journey Intelligently Travelled
          </motion.p>
        </div>

        {/* Search Form Integration */}
        <SearchForm />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 sm:mt-28 flex flex-col items-center justify-center text-zinc-500"
        >
          <span className="text-sm font-medium mb-4 uppercase tracking-widest text-zinc-600">Popular Destinations</span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['Hyderabad', 'Warangal', 'Vizag', 'Mumbai', 'Bangalore'].map((dest, i) => (
              <span key={i} className="text-sm sm:text-base font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer">
                {dest}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
