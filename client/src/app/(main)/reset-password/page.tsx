"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetUserPassword } from "@/src/lib/auth";
import { extractErrorMessage } from "@/src/lib/http-client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const nextUserId =
      searchParams.get("userId") ??
      searchParams.get("userid") ??
      searchParams.get("id") ??
      "";
    const nextToken = searchParams.get("token") ?? searchParams.get("resetToken") ?? "";

    setUserId(nextUserId);
    setToken(nextToken);
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const queryUserId =
      searchParams.get("userId") ??
      searchParams.get("userid") ??
      searchParams.get("id") ??
      "";
    const queryToken = searchParams.get("token") ?? searchParams.get("resetToken") ?? "";

    const normalizedUserId = (queryUserId || userId).trim();
    const normalizedToken = (queryToken || token).trim();
    const normalizedNewPassword = newPassword.trim();

    if (!normalizedUserId || !normalizedToken) {
      setMessage("Invalid reset link. Please request a new password reset email.");
      return;
    }

    if (!normalizedNewPassword) {
      setMessage("New password is required.");
      return;
    }

    if (normalizedNewPassword !== confirmPassword.trim()) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await resetUserPassword(normalizedUserId, normalizedToken, normalizedNewPassword, setLoading);

      setMessage(response?.message ?? "Password reset successful.");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1200);
    } catch (error) {
      setMessage(extractErrorMessage(error, "Failed to reset password."));
    }
  }

  return (
    <div className="mx-auto mt-32 w-full max-w-md border border-primary/20 bg-card p-8 rounded-none shadow-[0_4px_25px_rgba(13,56,125,0.02)]">
      <div className="border-b border-primary/15 pb-4 mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary text-center block">
          Security Atelier
        </span>
        <h1 className="text-center text-3xl font-serif font-bold text-primary tracking-tight mt-1">Reset Password</h1>
        <p className="mt-2 text-center text-xs text-muted-foreground tracking-wide leading-relaxed">
          Choose a secure, strong new password for your editorial profile.
        </p>
      </div>

      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">New Password</label>
          <div className="relative flex items-center">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border-b border-primary/20 bg-transparent py-2.5 pr-16 text-sm font-serif text-primary outline-none transition duration-150 focus:border-primary rounded-none"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition duration-150"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">Confirm Password</label>
          <div className="relative flex items-center">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border-b border-primary/20 bg-transparent py-2.5 pr-16 text-sm font-serif text-primary outline-none transition duration-150 focus:border-primary rounded-none"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition duration-150"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !userId || !token}
          className="h-12 w-full bg-primary border border-primary text-xs font-bold uppercase tracking-widest text-white hover:bg-transparent hover:text-primary rounded-none transition duration-150 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && (
        <div className="mt-6 border border-primary/10 bg-primary/5 p-3 rounded-none text-center">
          <p className="text-xs font-serif italic text-primary leading-relaxed">{message}</p>
        </div>
      )}

      {!userId || !token ? (
        <div className="mt-4 border border-red-200 bg-red-50/40 p-3 rounded-none text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
            Invalid reset link. Please request a new password reset email.
          </p>
        </div>
      ) : null}

      <p className="mt-6 text-center text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary transition duration-150">
        <Link href="/sign-in">
          &larr; Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="pt-28 text-center text-slate-500">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
