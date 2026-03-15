"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white cursor-pointer hover:opacity-80 transition-opacity">
              <span className="h-8 w-8 rounded flex items-center justify-center text-zinc-950 text-xs bg-white font-bold">T</span>
              TravelMind
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <Link href="/#how-to-use" className="hover:text-white transition-colors cursor-pointer">
                How To Use
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Nav */}
      {mobileMenuOpen && (
        <div className="fixed top-[65px] left-0 right-0 z-40 md:hidden bg-black/95 backdrop-blur-md border-b border-white/5 px-6 py-4">
          <Link
            href="/#how-to-use"
            className="block py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            How To Use
          </Link>
        </div>
      )}
    </>
  );
}
