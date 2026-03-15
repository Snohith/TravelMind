import React from "react";

const steps = [
  {
    num: 1,
    title: "Choose Your Route",
    desc: "Select your starting city and your dream destination in India from our curated network.",
    color: "from-blue-500/10",
    glow: "bg-blue-500",
    hexGrad: "from-blue-400 to-blue-600"
  },
  {
    num: 2,
    title: "Count Your Crew",
    desc: "Tell us how many rooms, adults, and children are coming along for the adventure.",
    color: "from-yellow-400/10",
    glow: "bg-yellow-400",
    hexGrad: "from-yellow-300 to-yellow-500"
  },
  {
    num: 3,
    title: "Set Your Vibe",
    desc: "Looking for relaxation, adventure, or a family getaway? Let us know what you prefer.",
    color: "from-indigo-500/10",
    glow: "bg-indigo-500",
    hexGrad: "from-indigo-400 to-indigo-600"
  },
  {
    num: 4,
    title: "Hit Search",
    desc: "Click the prominent search button and let our smart systems do the heavy lifting.",
    color: "from-emerald-500/10",
    glow: "bg-emerald-500",
    hexGrad: "from-emerald-400 to-emerald-600"
  },
  {
    num: 5,
    title: "Get Your Itinerary",
    desc: "Instantly receive a flawlessly tailored, day-by-day travel plan designed just for you.",
    color: "from-pink-500/10",
    glow: "bg-pink-500",
    hexGrad: "from-pink-400 to-pink-600"
  }
];

export default function HowToUse() {
  return (
    <section className="w-full max-w-6xl mx-auto mt-24 sm:mt-32 mb-16 px-4" id="how-to-use">
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">How To Use TravelMind?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {steps.map((step) => (
          <div 
            key={step.num}
            className="relative flex flex-col items-center text-center p-8 sm:p-10 rounded-2xl border border-white/5 bg-[#0a0a0a] overflow-hidden hover:border-white/10 transition-colors group"
          >
            {/* Soft gradient from top to bottom on hover */}
            <div className={`absolute inset-0 bg-gradient-to-b ${step.color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`} />
            
            {/* Top background glow spill behind the hexagon */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 ${step.glow} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none`} />

            {/* Glowing Hexagon container simulating a glowing border */}
            <div className="relative mb-6 z-10 flex flex-col items-center justify-center">
              {/* Outer Hexagon (Gradient Border) */}
              <div 
                className={`w-[52px] h-[60px] bg-gradient-to-b ${step.hexGrad} flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-shadow`}
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                {/* Inner Hexagon (Dark Background) */}
                <div 
                  className="w-[48px] h-[56px] bg-[#0a0a0a] flex items-center justify-center"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  <span className="text-white font-bold text-xl">{step.num}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 relative z-10">{step.title}</h3>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed relative z-10">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
