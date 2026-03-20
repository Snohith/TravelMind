"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { BouncingDots } from "@/components/ui/Loader";

function SignupForm() {
  const { user, isLoaded } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<{ 
    firstName?: string; 
    lastName?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
    agreed?: string;
  }>({});

  useEffect(() => {
    if (isLoaded && user) {
      router.replace(redirect);
    }
  }, [isLoaded, user, router, redirect]);

  function validate() {
    const errs: typeof errors = {};
    if (!firstName.trim()) errs.firstName = "First name required";
    if (!lastName.trim()) errs.lastName = "Last name required";
    if (!email.trim()) errs.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email";
    if (!password) errs.password = "Password required";
    else if (password.length < 6) errs.password = "Min 6 characters";
    if (password !== confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!agreed) errs.agreed = "You must agree to terms";
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
    setIsSigningUp(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: {
          full_name: `${firstName.trim()} ${lastName.trim()}`,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    setIsSigningUp(false);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: "Verification email sent! Please check your inbox." });
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
            <p className="text-zinc-400">Enter your information to create a new account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className={`w-full bg-white/5 border ${errors.firstName ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
                  />
                </div>
                {errors.firstName && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={`w-full bg-white/5 border ${errors.lastName ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
                  />
                </div>
                {errors.lastName && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-11 pr-11 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50`}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 ml-1">
              <input
                type="checkbox"
                id="agreed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-black"
              />
              <label htmlFor="agreed" className="text-xs text-zinc-400 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-blue-500 hover:underline">Terms and Conditions</span> and <span className="text-blue-500 hover:underline">Privacy Policy</span>
              </label>
            </div>
            {errors.agreed && <p className="text-red-400 text-[10px] uppercase font-bold ml-1">{errors.agreed}</p>}

            {/* Message Area */}
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : null}
                {message.text}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full relative bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            >
              {isSigningUp ? <BouncingDots className="bg-white" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">Already have an account? </span>
            <Link href="/login" className="text-white hover:text-blue-400 font-bold transition-colors underline-offset-4 hover:underline">Sign In</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <BouncingDots className="bg-white w-3 h-3" />
        <span className="text-xs font-bold tracking-[0.2em] text-white/30 uppercase">Initializing</span>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
