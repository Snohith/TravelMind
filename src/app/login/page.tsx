"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import Link from "next/link";

function LoginForm() {
  const { login, user, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/itinerary";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoaded && user) {
      router.replace(redirect);
    }
  }, [isLoaded, user, router, redirect]);

  function validate() {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLogging(true);
    // Simulate a tiny loading delay for UX
    await new Promise((r) => setTimeout(r, 700));
    login(name.trim(), email.trim());
    router.push(redirect);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      {/* Noise overlay for premium texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <span className="h-10 w-10 rounded-xl flex items-center justify-center text-zinc-950 text-lg bg-white font-black shadow-lg group-hover:scale-105 transition-transform">
              T
            </span>
            <span className="text-2xl font-black text-white tracking-tight">
              TravelMind
            </span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-400">
              Sign in to access your personalized itineraries
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name Field */}
            <div>
              <label
                htmlFor="travelmind-name"
                className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2"
              >
                Full Name
              </label>
              <input
                id="travelmind-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arjun Sharma"
                autoComplete="name"
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 ${
                  errors.name
                    ? "border-red-500/60"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="travelmind-email"
                className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2"
              >
                Email
              </label>
              <input
                id="travelmind-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="arjun@example.com"
                autoComplete="email"
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 ${
                  errors.email
                    ? "border-red-500/60"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLogging}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              {isLogging ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In & Plan My Trip →"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-500 text-center leading-relaxed">
              By signing in, you agree to our{" "}
              <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center gap-2"
        >
          {[
            "✈️ Smart Itineraries",
            "🗺️ Interactive Maps",
            "💰 Cost Estimates",
          ].map((pill) => (
            <span
              key={pill}
              className="text-xs text-zinc-500 bg-white/[0.03] border border-white/[0.07] rounded-full px-3 py-1"
            >
              {pill}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
