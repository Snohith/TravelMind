import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Service Description",
      content: "TravelMind provides an AI-powered travel planning service. While we strive for accuracy, itineraries are generated for guidance only and do not guarantee availability or accuracy of destination information."
    },
    {
      title: "User Responsibilities",
      content: "By using our service, you agree to provide truthful information and represent that you are of legal age to form a binding contract."
    },
    {
        title: "Intellectual Property",
        content: "The TravelMind logo, design, and AI-generated itineraries are the intellectual property of TravelMind. Users are granted a limited license for personal use."
    },
    {
        title: "Disclaimers",
        content: "We are not liable for any losses or damages resulting from the use of our itineraries, including travel disruptions or inaccuracies in travel data."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <h1 className="text-5xl font-bold tracking-tight mb-8 font-medium italic text-zinc-500">Terms of Service</h1>
        <div className="flex items-center gap-2 text-sm text-zinc-800 mb-16 uppercase tracking-widest">
            <Clock size={14} />
            Version 1.2 · Effective Mar 20, 2026
        </div>

        <div className="space-y-16">
          {sections.map((section, index) => (
            <div key={index} className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 text-emerald-400">{section.title}</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-zinc-900 text-zinc-600 text-sm">
          By continuing to use TravelMind, you signify your acceptance of these Terms of Service. For full legal disclosure, contact legal@travelmind.com.
        </div>
      </div>
    </div>
  );
}
