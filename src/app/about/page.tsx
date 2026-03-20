import Link from "next/link";
import { ArrowLeft, Target, Users, Landmark } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
          About TravelMind
        </h1>
        
        <p className="text-xl text-zinc-400 leading-relaxed mb-16">
          We are on a mission to make world-class travel planning accessible to everyone through the power of Artificial Intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-zinc-400 leading-relaxed">
              To eliminate the stress of travel planning by providing personalized, budget-conscious, and logistically sound itineraries in seconds.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">The Team</h3>
            <p className="text-zinc-400 leading-relaxed">
              A diverse group of explorers, data scientists, and engineers dedicated to building the future of intelligent travel.
            </p>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="prose prose-invert max-w-none text-zinc-400 space-y-6">
            <p>
              TravelMind started in 2024 when our founders realized they spent more time planning their trips than actually enjoying them. The endless tabs of reviews, flights, and maps were overwhelming.
            </p>
            <p>
              We built TravelMind to be the travel agent we always wanted: one that knows the best local spots, understands your budget constraints, and organizes everything into a beautiful, interactive timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
