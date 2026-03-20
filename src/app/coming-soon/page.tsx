"use client";

import React from "react";
import Link from "next/link";
import ComingSoonPug from "@/components/ui/ComingSoonPug";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <ComingSoonPug />
        
        <div className="mt-[-2rem] text-center max-w-md">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Something Great is <span className="text-emerald-500">Brewing.</span>
          </h1>
          <p className="text-zinc-500 text-sm md:text-base mb-8 leading-relaxed">
            We're working hard to bring you the best travel planning tools. 
            This feature will be available very soon!
          </p>
          
          <Link href="/">
            <Button variant="liquid" size="lg" className="px-8 py-6 rounded-full font-bold text-base scale-110">
              Take Me Home
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 text-[10px] font-bold text-zinc-800 uppercase tracking-[0.5em] vertical-text hidden md:block">
        TravelMind AI
      </div>
    </div>
  );
}
