"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { BouncingDots } from "@/components/ui/Loader";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || password.length < 6) {
      setMessage({ type: 'error', text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords do not match." });
      return;
    }

    setIsUpdating(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setIsUpdating(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Password updated successfully!" });
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      {/* Noise overlay */}
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Update Password</h1>
            <p className="text-sm text-zinc-400">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="new-password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 hover:border-white/20"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 hover:border-white/20"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 dark:before:from-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity mt-2"
            >
              {isUpdating ? <BouncingDots className="bg-current" /> : "Update Password"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
