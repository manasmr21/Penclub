"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { forgotPasswordAPi } from "@/src/lib/api";
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
      //@ts-expect-error
      setMessage(response?.message ?? "Reset link sent. Please check your email.");
    } catch (error) {
      setMessage(extractErrorMessage(error, "Failed to request password reset."));
    }
  }

  return (
    <div className="mx-auto mt-28 w-full max-w-md rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h1 className="text-center text-2xl font-extrabold text-[#0a192f]">Forgot Password</h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        Enter your account email and we will send a reset link.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label className="ml-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}

      <p className="mt-5 text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
