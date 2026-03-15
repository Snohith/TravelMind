"use client";

import React, { useEffect } from "react";
import Hero from "@/components/Hero";
import HowToUse from "@/components/HowToUse";

export default function Home() {
  useEffect(() => {
    // Force scroll to top on mount/refresh
    window.scrollTo(0, 0);
    // If a hash exists (e.g., #how-to-use) from a previous session, clear it 
    // from the URL to prevent the browser from automatically snapping down again.
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <HowToUse />
    </div>
  );
}
