"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube, Github, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-black border-t border-white/5 rounded-t-[3rem] mt-20 overflow-hidden">
      {/* Top Glow/Line Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent blur-[1px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[40px] bg-emerald-500/10 blur-[40px] rounded-full -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity w-fit">
              <span className="h-9 w-9 rounded-lg flex items-center justify-center text-zinc-950 text-sm bg-white font-bold">T</span>
              TravelMind
            </Link>
            <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
              Your AI-powered travel companion. We help you design, organize, and experience the perfect trip with personalized itineraries and expert guides.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Youtube size={18} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Product</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Itinerary Generator
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Destination Finder
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Budget Planner
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Packing Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Company</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Travel Blog
                  <span className="ml-2 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">New</span>
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Press Kit
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Resources</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <Link href="/help" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-white text-sm transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-xs">
            © {currentYear} TravelMind. Made with ❤️ for explorers.
          </p>
          <div className="flex items-center gap-8 text-xs text-zinc-500">
            <Link href="#" className="hover:text-zinc-300 transition-colors">Cookie Settings</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Status</Link>
            <Link href="#" className="hover:text-zinc-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
