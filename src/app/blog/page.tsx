import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "5 Hidden Gems in Goa You Didn't Know About",
    description: "Move beyond the rowdy beaches of Baga and explore the silent, soulful side of South Goa.",
    date: "Mar 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Mastering the 10k Budget Trip",
    description: "A complete guide on how to survive and thrive for 3 days in any metro city with just ₹10,000.",
    date: "Mar 15, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "The Top 10 Destinations for Couples in 2026",
    description: "From the snow-capped mountains of Kashmir to the serene backwaters of Kerala.",
    date: "Mar 10, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1610444317180-3330691e8bed?auto=format&fit=crop&q=80&w=800",
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-12 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex-1">
            <h1 className="text-5xl font-bold tracking-tight mb-4 text-white">
              TravelMind Blog
            </h1>
            <p className="text-xl text-zinc-400">
              Tips, guides, and stories from the road.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span>Filter By:</span>
            <button className="px-4 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">Destinations</button>
            <button className="px-4 py-2 rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors">Budget</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="group relative bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300">
              <div className="h-60 overflow-hidden relative">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 line-clamp-2">{post.title}</h3>
                <p className="text-zinc-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
                <Link href="#" className="flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  READ ARTICLE
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
            <p className="text-zinc-400 mb-8 max-w-md">Get travel tips and destination updates directly in your inbox.</p>
            <div className="w-full max-w-sm flex gap-2">
                <input type="email" placeholder="Email address" className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors" />
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors">Subscribe</button>
            </div>
        </div>
      </div>
    </div>
  );
}
