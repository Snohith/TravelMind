import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageSquare, Compass, Heart, Share2 } from "lucide-react";

export default function CommunityPage() {
  const communityStats = [
    { label: "Travelers", value: "2M+", icon: <Compass size={24} /> },
    { label: "Itineraries Shared", value: "150K+", icon: <Share2 size={24} /> },
    { label: "Positive Reviews", value: "45K+", icon: <Heart size={24} /> },
    { label: "Active Channels", value: "12", icon: <MessageSquare size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row items-center gap-16 mb-32">
          <div className="flex-1">
            <h1 className="text-6xl font-bold tracking-tight mb-8">A community of dreamers.</h1>
            <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed mb-12">
              Join millions of travelers sharing their favorite spots, hidden gems, and perfectly planned itineraries. Together, we're building the world's best travel library.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-sm">Join Discord</button>
              <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/[0.08] transition-all uppercase tracking-widest text-sm">Follow on Reddit</button>
            </div>
          </div>
          <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
            <div className="relative w-full aspect-square">
              <Image 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="TravelMind Community" 
                fill
                className="rounded-full border border-white/10 p-4 object-cover" 
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 text-center">
            {communityStats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-4 p-8 bg-white/5 border border-white/10 rounded-3xl">
                    <div className="text-emerald-400">{stat.icon}</div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
                </div>
            ))}
        </div>

        <div className="p-16 bg-white/5 border border-white/10 rounded-3xl text-center">
          <h2 className="text-4xl font-bold mb-8">The World's Best Travel Library</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Every itinerary generated on TravelMind helps others plan their next adventure. Our community's collective wisdom ensures your next trip is always better than your last.
          </p>
          <div className="flex justify-center gap-4">
              <div className="h-12 w-12 rounded-full border-2 border-zinc-900 bg-emerald-500 flex items-center justify-center -ml-4 shadow-xl shadow-emerald-500/20">A</div>
              <div className="h-12 w-12 rounded-full border-2 border-zinc-900 bg-blue-500 flex items-center justify-center -ml-4 shadow-xl shadow-blue-500/20">B</div>
              <div className="h-12 w-12 rounded-full border-2 border-zinc-900 bg-red-500 flex items-center justify-center -ml-4 shadow-xl shadow-red-500/20">C</div>
              <div className="h-12 w-12 rounded-full border-2 border-zinc-900 bg-yellow-500 flex items-center justify-center -ml-4 shadow-xl shadow-yellow-500/20">D</div>
              <div className="h-12 w-12 rounded-full border-2 border-zinc-900 bg-purple-500 flex items-center justify-center -ml-4 shadow-xl shadow-purple-500/20 text-xs">+1M</div>
          </div>
        </div>
      </div>
    </div>
  );
}
