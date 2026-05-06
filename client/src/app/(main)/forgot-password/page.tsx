"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
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
    <div className="mx-auto mt-32 w-full max-w-md border border-primary/20 bg-card p-8 rounded-none shadow-[0_4px_25px_rgba(13,56,125,0.02)]">
      <div className="border-b border-primary/15 pb-4 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary text-center block">
          Security Atelier
        </span>
        <h1 className="text-center text-3xl font-serif font-bold text-primary tracking-tight mt-1">Forgot Password</h1>
        <p className="mt-2 text-center text-xs text-muted-foreground tracking-wide leading-relaxed">
          Enter your account email and we will send a secure password reset link to your registered inbox.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b border-primary/20 bg-transparent py-2.5 text-sm font-serif text-primary outline-none transition duration-150 focus:border-primary rounded-none"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full bg-primary border border-primary text-xs font-bold uppercase tracking-widest text-white hover:bg-transparent hover:text-primary rounded-none transition duration-150 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>

      {message && (
        <div className="mt-6 border border-primary/10 bg-primary/5 p-3 rounded-none text-center">
          <p className="text-xs font-serif italic text-primary leading-relaxed">{message}</p>
        </div>
      )}

      <p className="mt-6 text-center text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition duration-150">
        <Link href="/sign-in">
          &larr; Back to Sign In
        </Link>
      </p>
    </div>
  );
}
