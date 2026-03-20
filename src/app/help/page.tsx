import Link from "next/link";
import { ArrowLeft, Search, HelpCircle, MessageCircle, FileText, Phone } from "lucide-react";

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Booking & Itinerary",
      description: "How to generate and manage your trip plans.",
      icon: <FileText size={24} />
    },
    {
        title: "Accounts & Security",
        description: "Managing your login and personal data.",
        icon: <HelpCircle size={24} />
      },
      {
        title: "Community & Support",
        description: "Connect with other travelers and get help.",
        icon: <MessageCircle size={24} />
      },
      {
        title: "Contact Us",
        description: "Speak directly to our support team.",
        icon: <Phone size={24} />
      }
  ];

  const popularQuestions = [
    "How does the AI itinerary generator work?",
    "Can I save my trip plans for later?",
    "Is TravelMind free to use?",
    "How do I change my destination after generating?",
    "Can I download the itinerary as a PDF?"
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight mb-8">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
            <input 
              type="text" 
              placeholder="Search help articles..." 
              className="w-full bg-white/5 border border-white/10 px-12 py-4 rounded-full focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {helpCategories.map((cat, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/[0.08] transition-colors cursor-pointer group">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 mb-6 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{cat.title}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                {cat.description}
              </p>
              <Link href="#" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                EXPLORE ARTICLES →
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl">
          <h2 className="text-2xl font-bold mb-8">Popular Questions</h2>
          <div className="space-y-6">
            {popularQuestions.map((q, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-white/5 last:border-none group cursor-pointer">
                <span className="text-zinc-300 group-hover:text-white transition-colors">{q}</span>
                <ArrowLeft className="rotate-180 text-zinc-600 group-hover:text-emerald-400" size={16} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-12 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-zinc-400">Our support team is available 24/7 to help you with any issues.</p>
          </div>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg shadow-emerald-500/10">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
