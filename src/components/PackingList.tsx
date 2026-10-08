"use client";

import { Briefcase, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

interface PackingListProps {
  vibe?: string;
  weather?: 'Sunny' | 'Cloudy' | 'Rainy' | 'Mist' | 'Snow';
}

export default function PackingList({ vibe = 'standard', weather = 'Sunny' }: PackingListProps) {
  const getVibeItems = () => {
    switch (vibe.toLowerCase()) {
      case 'adventure':
        return [
          { item: "Rugged Hiking Boots", desc: "Break them in before you arrive." },
          { item: "Portable Power Bank", desc: "For those long days off-grid." },
          { item: "Hydration Bladder", desc: "Crucial for high-energy trails." },
        ];
      case 'luxury':
        return [
          { item: "Evening Formal Wear", desc: "For clifftop dining experiences." },
          { item: "Premium Skincare", desc: "Maintain your glow post-travel." },
          { item: "Boutique Perfume", desc: "Signature scent for the trip." },
        ];
      case 'relaxed':
      case 'balanced':
        return [
          { item: "Noise-Cancelling Headphones", desc: "For ultimate peace in transit." },
          { item: "Breathable Linens", desc: "Stay cool and comfortable." },
          { item: "Kindle/Book", desc: "Your best companion for downtime." },
        ];
      case 'culture':
        return [
          { item: "Conservative Attire", desc: "Essential for temple visits." },
          { item: "Comfortable Walking Shoes", desc: "Exploration involves mileage." },
          { item: "Compact Camera", desc: "Capture the heritage details." },
        ];
      default:
        return [
          { item: "Universal Adapter", desc: "Power up anywhere." },
          { item: "Reusable Water Bottle", desc: "Eco-friendly hydration." },
          { item: "Basic First-Aid Kit", desc: "Always safety first." },
        ];
    }
  };

  const getWeatherItems = () => {
    switch (weather) {
      case 'Rainy':
      case 'Mist':
        return [
          { item: "Compact Umbrella", desc: "Wind-resistant frame recommended." },
          { item: "Quick-Dry Jacket", desc: "Keeps you dry without the bulk." },
          { item: "Waterproof Phone Pouch", desc: "Protect your tech on the go." },
        ];
      case 'Snow':
        return [
          { item: "Thermal Base Layers", desc: "Retain heat in sub-zero temps." },
          { item: "Insulated Gloves", desc: "Touch-screen compatible is best." },
          { item: "Lip Balm & Moisturizer", desc: "Prevent dry skin in cold air." },
        ];
      case 'Sunny':
      default:
        return [
          { item: "Polarized Sunglasses", desc: "Reduce glare and eye strain." },
          { item: "Lightweight Sunscreen", desc: "SPF 50+ broad spectrum." },
          { item: "Wide-Brimmed Hat", desc: "Stylish sun protection." },
        ];
    }
  };

  const vibeItems = getVibeItems();
  const weatherItems = getWeatherItems();

  return (
    <div className="mt-12 mb-10 px-4 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
          <Briefcase className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white leading-none mb-1">AI Packing Assistant</h2>
          <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold italic">Based on {vibe} vibe & {weather} weather</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Vibe Specific Card */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">The {vibe} Look</span>
          </div>
          <div className="space-y-4">
            {vibeItems.map((v, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100">{v.item}</h4>
                  <p className="text-[12px] text-neutral-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Specific Card */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">{weather} Ready</span>
          </div>
          <div className="space-y-4">
            {weatherItems.map((w, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-blue-500/50" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-100">{w.item}</h4>
                  <p className="text-[12px] text-neutral-500">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-[10px] text-neutral-600 text-center italic">
        * Tailored suggestions powered by TravelMind AI logic
      </p>
    </div>
  );
}
