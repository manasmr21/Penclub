"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetUserPassword } from "@/src/lib/api";
import { extractErrorMessage } from "@/src/lib/http-client";

export default function ResetPasswordPage() {
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
    <div className="mx-auto mt-28 w-full max-w-md rounded-2xl bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h1 className="text-center text-2xl font-extrabold text-[#0a192f]">Reset Password</h1>
      <p className="mt-2 text-center text-sm text-slate-500">Choose a new password for your account.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <label className="ml-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary"
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="ml-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-16 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !userId || !token}
          className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
      {!userId || !token ? (
        <p className="mt-2 text-center text-xs text-red-500">
          Invalid reset link. Please request a new password reset email.
        </p>
      ) : null}

      <p className="mt-5 text-center text-sm text-slate-500">
        <Link href="/sign-in" className="font-semibold text-primary hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
