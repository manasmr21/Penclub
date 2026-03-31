"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { Suspense, useEffect, useState } from "react";
import AuthField from "@/src/components/auth/AuthField";
import AuthShell from "@/src/components/auth/AuthShell";
import { authInputClassName } from "@/src/components/auth/auth-styles";
import { formatTimeLeft, type UserRole } from "@/src/lib/auth";
import { resendUserOtp, verifyUserOtp } from "@/src/lib/auth-api";
import { useAuthStore } from "@/src/store/auth-store";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingOtpUser = useAuthStore((state) => state.pendingOtpUser);
  const setUser = useAuthStore((state) => state.setUser);
  const setPendingOtpUser = useAuthStore((state) => state.setPendingOtpUser);

  const email = searchParams.get("email") ?? pendingOtpUser?.email ?? "";
  const role = (searchParams.get("role") as UserRole | null) ?? pendingOtpUser?.role ?? "author";
  const canResendOtp = role === "author";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pendingOtpUser) return;

    const updateTimer = () => {
      const remaining = pendingOtpUser.expiresAt - Date.now();
      if (remaining <= 0) {
        setTimeLeft("00:00");
        return;
      }
      setTimeLeft(formatTimeLeft(remaining));
    };

    updateTimer();
    const timer = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(timer);
  }, [pendingOtpUser]);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!pendingOtpUser || pendingOtpUser.email !== email) {
      setError("Verification session not found. Please sign up again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await verifyUserOtp(role, email, otp.trim());

      setUser({
        ...pendingOtpUser,
        id: data?.data?.id ?? data?.id ?? pendingOtpUser.id,
        name: data?.data?.name ?? pendingOtpUser.name,
        email: data?.data?.email ?? pendingOtpUser.email,
        penName: data?.data?.penName ?? pendingOtpUser.penName,
        username: data?.data?.username ?? pendingOtpUser.username,
        profilePicture: data?.data?.profilePicture ?? pendingOtpUser.profilePicture,
        isEmailVerified: true,
      });
      setPendingOtpUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "OTP does not match. Please try again.";
      setError(message ?? "OTP does not match. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    if (!canResendOtp) {
      setError("Resend OTP is not available for readers in the current server API.");
      return;
    }

    try {
      setResending(true);
      setError("");
      const data = await resendUserOtp(role, email);
      setPendingOtpUser(
        pendingOtpUser
          ? {
              ...pendingOtpUser,
              expiresAt: Date.now() + (data?.otpExpiresInMinutes ?? 10) * 60 * 1000,
              devOtp: data?.devOtp,
            }
          : null,
      );
      setMessage("OTP resent to your email.");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not resend OTP.";
      setError(message ?? "Could not resend OTP.");
    } finally {
      setResending(false);
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
          {pendingOtpUser?.devOtp ? (
            <p className="mt-2 text-sm font-medium text-amber-700">
              Development OTP: {pendingOtpUser.devOtp}
            </p>
          ) : null}
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
                    setMessage("");
                  }}
                  className={`${authInputClassName} text-center tracking-[0.5em]`}
                  placeholder="000000"
                />
              </AuthField>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-green-700">{message}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending || !canResendOtp}
                className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                {resending ? "Sending..." : canResendOtp ? "Resend OTP" : "Resend unavailable"}
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

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
