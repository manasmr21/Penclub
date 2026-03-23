"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

  const [loading, setLoading] = useState(false);

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

      const user = {
        ...pendingUser,
        id: data?.data?.id ?? pendingUser.id,
        penName: data?.data?.penName ?? pendingUser.penName,
        expiresAt: undefined,
      };

      setStoredUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        penName: user.penName,
        username: user.username,
        profilePicture: user.profilePicture,
        phoneNumber: user.phoneNumber,
        interests: user.interests,
        bio: user.bio,
      });
      clearPendingOtpUser();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#fff8cf,_#faf8e3_52%,_#efe7b8)] px-5 py-3 md:px-8 md:py-6">
      <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(13,56,125,0.12)] backdrop-blur">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "url('/images/pensignup.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "66%",
          }}
        />

        <section className="relative z-10 flex flex-col items-center px-6 py-6 md:px-6 md:py-5">
          <div className="w-full max-w-md text-center">
            <p className="text-sm font-medium text-primary">OTP expires in {timeLeft || "10:00"}</p>
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
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Enter OTP
                  </label>
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
                    className="w-full rounded-xl border border-slate-200 bg-white/85 px-3.5 py-2.5 text-center text-sm tracking-[0.5em] outline-none transition focus:border-primary focus:bg-white"
                    placeholder="000000"
                  />
                </div>

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
        </section>
      </div>
    </main>
  );
}
