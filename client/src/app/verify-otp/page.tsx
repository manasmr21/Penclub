"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AuthField from "@/src/components/auth/AuthField";
import AuthShell from "@/src/components/auth/AuthShell";
import { authInputClassName } from "@/src/components/auth/auth-styles";
import {
  clearPendingOtpUser,
  formatTimeLeft,
  getPendingOtpUser,
  setStoredUser,
} from "@/src/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(false);

  const pendingUser = useMemo(() => getPendingOtpUser(), []);

  useEffect(() => {
    if (!pendingUser) return;

    const updateTimer = () => {
      const remaining = pendingUser.expiresAt - Date.now();
      if (remaining <= 0) {
        clearPendingOtpUser();
        setTimeLeft("00:00");
        setError("OTP expired. Please sign up again.");
        return;
      }

      setTimeLeft(formatTimeLeft(remaining));
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(timer);
  }, [pendingUser]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pendingUser || pendingUser.email !== email) {
      setError("Verification session not found. Please sign up again.");
      return;
    }

    if (pendingUser.expiresAt < Date.now()) {
      clearPendingOtpUser();
      setError("OTP expired. Please sign up again.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/authors/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp: otp.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setError(data?.message ?? "OTP does not match. Please try again.");
        return;
      }

      setStoredUser({
        id: data?.data?.id ?? pendingUser.id,
        name: pendingUser.name,
        email: pendingUser.email,
        role: pendingUser.role,
        penName: data?.data?.penName ?? pendingUser.penName,
        username: pendingUser.username,
        profilePicture: pendingUser.profilePicture,
        phoneNumber: pendingUser.phoneNumber,
        interests: pendingUser.interests,
        bio: pendingUser.bio,
      });
      clearPendingOtpUser();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md text-center">
          <p className="text-sm font-medium text-primary">
            OTP expires in {timeLeft || "10:00"}
          </p>
          <h1 className="mt-2 text-xl font-semibold text-primary md:text-4xl">
            Verify your email
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Enter the OTP sent to <span className="font-semibold">{email}</span>.
          </p>
        </div>

        <div className="mt-4 flex w-full justify-center">
          <div className="w-full max-w-md">
            <form onSubmit={handleVerify} className="space-y-4">
              <AuthField id="otp" label="Enter OTP">
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className={`${authInputClassName} text-center tracking-[0.5em]`}
                  placeholder="000000"
                />
              </AuthField>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Need to restart?{" "}
              <Link href="/sign-up" className="font-semibold text-primary">
                Back to sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
