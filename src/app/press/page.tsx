import { ArrowLeft, Download, FileText, ImageIcon, Mail } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
  const assets = [
    { name: "Brand Logo (SVG)", icon: <FileText size={20} /> },
    { name: "Brand Guide (PDF)", icon: <FileText size={20} /> },
    { name: "App Interface Mockups", icon: <ImageIcon size={20} /> },
    { name: "Founder Headshots", icon: <ImageIcon size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold tracking-tight mb-8">Press & Media</h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mb-16">
          Everything you need to know about TravelMind. For press inquiries, please reach out directly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-xl font-bold mb-6 italic text-zinc-400">Press Kit</h3>
            <div className="space-y-4">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-none group cursor-pointer hover:bg-white/5 px-2 rounded-lg transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-600">{asset.icon}</span>
                    <span className="text-zinc-400 group-hover:text-white transition-colors">{asset.name}</span>
                  </div>
                  <Download className="text-zinc-700 group-hover:text-emerald-400 transition-colors" size={16} />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Press Inquiries</h3>
            <p className="text-zinc-400 mb-8 sm:text-xs">Reach out for interviews or high-resolution assets.</p>
            <a href="mailto:press@travelmind.com" className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors">Contact US</a>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Recent Press Coverage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl italic">
              <p className="text-white mb-6 leading-relaxed">"The AI-powered travel planner that actually works... It's like having a travel agent in your pocket."</p>
              <div className="text-sm text-zinc-500">TechDaily · Mar 2026</div>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl italic">
              <p className="text-white mb-6 leading-relaxed">"TravelMind is changing the way we explore India, one smart itinerary at a time."</p>
              <div className="text-sm text-zinc-500">The Wanderer · Jan 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
