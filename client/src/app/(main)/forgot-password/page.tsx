"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import { forgotPasswordAPi } from "@/src/lib/auth";
import { extractErrorMessage } from "@/src/lib/http-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await forgotPasswordAPi(email.trim(), setLoading);
      setMessage(response?.message ?? "Reset link sent. Please check your email.");
    } catch (error) {
      setMessage(extractErrorMessage(error, "Failed to request password reset."));
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FDF9F0]/60 pt-24 pb-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md border border-gray-100 bg-white p-8 sm:p-10 rounded-3xl shadow-xl">
        <div className="border-b border-gray-100 pb-5 mb-6 text-center">
          <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#E6693E] block">
            Security
          </span>
          <h1 className="text-center text-3xl font-serif font-bold text-[#1D4E89] tracking-tight mt-1">Forgot Password</h1>
          <p className="mt-2 text-center text-xs text-[#1D4E89]/60 font-serif italic leading-relaxed">
            Enter your account email and we will send a secure password reset link to your registered inbox.
          </p>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#1D4E89]/60">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-gray-100 bg-[#FDF9F0]/40 px-4 py-3.5 text-sm font-sans font-bold text-[#1D4E89] placeholder:text-[#1D4E89]/30 outline-none transition-all duration-300 focus:border-[#1D4E89] focus:bg-white rounded-2xl"
              placeholder="you@example.com"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="h-14 w-full bg-[#1D4E89] text-white hover:bg-[#11325C] font-sans font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-[#1D4E89]/20 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </motion.button>
        </form>

        {message && (
          <div className="mt-6 border border-gray-100 bg-[#FDF9F0]/80 p-4 rounded-2xl text-center shadow-sm">
            <p className="text-xs font-serif italic text-[#1D4E89] leading-relaxed">{message}</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/sign-in">
            <motion.span 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block text-[10px] font-sans font-black uppercase tracking-widest text-[#E6693E] hover:text-[#1D4E89] transition-colors cursor-pointer"
            >
              &larr; Back to Sign In
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  );
}
