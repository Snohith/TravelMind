"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  }

  // Get initials for avatar
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

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

          {/* Right side auth buttons */}
          <div className="flex items-center gap-3">
            {isLoaded && (
              <>
                {user ? (
                  // Logged in state
                  <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-black">
                        {initials}
                      </div>
                      <span className="text-sm text-zinc-300 font-medium max-w-[120px] truncate">
                        {user.name.split(" ")[0]}
                      </span>
                    </div>
                    <button
                      id="navbar-signout-btn"
                      onClick={handleLogout}
                      className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  // Logged out state
                  <Link
                    id="navbar-signin-btn"
                    href="/login"
                    className="hidden md:flex items-center gap-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-zinc-400 hover:text-white bg-white/5 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg suppressHydrationWarning xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            className="block py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors border-b border-white/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            How To Use
          </Link>
          {isLoaded && (
            <>
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-3 border-b border-white/5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block py-3 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In →
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
