import Link from "next/link";
import { ArrowLeft, MapPin, Search, PlusCircle, Briefcase, Globe, TrendingUp } from "lucide-react";

export default function CareersPage() {
  const openRoles = [
    { title: "Senior AI Engineer", department: "Engineering", location: "Bangalore / Remote" },
    { title: "Product Designer", department: "Design", location: "Global Remote" },
    { title: "Travel Data Specialist", department: "Operations", location: "Hyderabad / Hybrid" },
    { title: "Community Manager", department: "Marketing", location: "Remote" }
  ];

  const benefits = [
      { title: "Work From Anywhere", description: "Remote-first culture with occasional team meetups.", icon: <Globe size={24} /> },
      { title: "Professional Growth", description: "Learning budget and mentorship from industry leaders.", icon: <TrendingUp size={24} /> },
      { title: "Travel Perks", description: "Discounts and credits for your own adventures.", icon: <MapPin size={24} /> },
      { title: "Mental Health Support", description: "A healthy work-life balance is our priority.", icon: <PlusCircle size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="mb-20">
          <h1 className="text-6xl font-bold tracking-tight mb-8">Join the journey.</h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Help us build the most intelligent travel platform in the world. We're looking for passionate explorers and creative problem solvers to join our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {benefits.map((b, index) => (
            <div key={index} className="flex flex-col gap-6 p-8 bg-white/5 border border-white/10 rounded-3xl">
              <div className="text-emerald-400">{b.icon}</div>
              <h3 className="text-xl font-bold">{b.title}</h3>
              <p className="text-zinc-500 text-sm">{b.description}</p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12">Open Opportunities</h2>
          <div className="space-y-4">
            {openRoles.map((role, index) => (
              <Link href="#" key={index} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/[0.08] hover:border-emerald-500/30 transition-all group">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{role.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-500 font-medium font-medium">
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} />
                      {role.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {role.location}
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white/5 border border-white/20 rounded-xl font-bold hover:bg-white hover:text-black transition-all">VIEW ROLE →</button>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-12 bg-white/5 border border-white/10 rounded-3xl text-center">
          <h2 className="text-2xl font-bold mb-4 italic text-zinc-400">"Not finding the perfect role?"</h2>
          <p className="text-zinc-500 mb-8">Send us your CV and a story about your most memorable trip.</p>
          <button className="px-8 py-4 bg-emerald-500 text-black font-bold rounded-2xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm">Join the Talent Pool</button>
        </div>
      </div>
    </div>
  );
}
