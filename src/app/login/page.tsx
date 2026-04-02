"use client";

import { BouncingDots } from "@/components/ui/Loader";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

function LoginForm() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // If already logged in, redirect immediately
  useEffect(() => {
    if (isLoaded && user) {
      router.replace(redirect);
    }
  }, [isLoaded, user, router, redirect]);

  // Check for session conflict errors
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "session-conflict") {
      setMessage({ 
        type: 'error', 
        text: "You have been signed out because you logged in on another device. For security, only one session is allowed at a time." 
      });
    }
  }, [searchParams]);

  function validate() {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email.";
    if (!password) errs.password = "Please enter a password.";
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
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    setIsLogging(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      router.replace(redirect);
    }
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
          <div className="mb-8 ">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-sm text-zinc-400">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

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

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="travelmind-password"
                  className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
                >
                  Password
                </label>
                <Link href="/reset-password" className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="travelmind-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full bg-white/[0.05] border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 ${
                  errors.password
                    ? "border-red-500/60"
                    : "border-white/10 hover:border-white/20"
                }`}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Feedback Message */}
            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLogging}
              className="w-full mt-2 relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 dark:before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            >
              {isLogging ? (
                <BouncingDots className="bg-current" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Link to Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Don't have an account?{" "}
              <Link href="/signup" className="text-white hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <BouncingDots className="bg-emerald-500 w-3 h-3" />
        <span className="text-xs font-bold tracking-[0.2em] text-emerald-500/50 uppercase">Loading</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
