"use client";

import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuthStore } from "@/src/store/auth-store";

const OTP_LENGTH = 6;
const DEFAULT_OTP_WINDOW_SECONDS = 10 * 60;

type StoredUser = {
  email?: string;
  isEmailVerified?: boolean;
  [key: string]: unknown;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user as StoredUser | null);
  const isLoading = useAuthStore((state) => state.isLoading);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);
  const setUser = useAuthStore((state) => state.setUser);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeWindow, setTimeWindow] = useState(DEFAULT_OTP_WINDOW_SECONDS);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expiresAt, setExpiresAt] = useState(searchParams.get("expiresAt") ?? "");
  const [activeAction, setActiveAction] = useState<"verify" | "resend" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = searchParams.get("email") ?? user?.email ?? "";
  const isBusy = isLoading || activeAction !== null;

  useEffect(() => {
    if (!expiresAt) {
      setTimeLeft(0);
      return;
    }

    const expiresAtMs = new Date(expiresAt).getTime();

    if (!Number.isFinite(expiresAtMs)) {
      setTimeLeft(0);
      return;
    }

    const syncTimeLeft = () => {
      const remainingSeconds = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));
      setTimeLeft(remainingSeconds);
    };

    syncTimeLeft();

    const timer = window.setInterval(syncTimeLeft, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];

    if (value.length > 1) {
      value
        .slice(0, OTP_LENGTH)
        .split("")
        .forEach((digit, digitIndex) => {
          nextOtp[digitIndex] = digit;
        });

      setOtp(nextOtp);
      setLocalError("");
      setFeedback("");
      inputRefs.current[Math.min(value.length, OTP_LENGTH) - 1]?.focus();
      return;
    }

    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    setLocalError("");
    setFeedback("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pastedDigits) return;

    event.preventDefault();
    handleInputChange(pastedDigits, 0);
  };

  const handleVerify = async () => {
    const joinedOtp = otp.join("");

    if (!email) {
      const message = "Email not found. Please restart the signup flow.";
      setLocalError(message);
      setError(message);
      return;
    }

    if (joinedOtp.length !== OTP_LENGTH) {
      const message = "Enter the full 6-digit OTP.";
      setLocalError(message);
      setError(message);
      return;
    }

    try {
      setActiveAction("verify");
      setLoading(true);
      setLocalError("");
      setFeedback("");
      setError(null);

      const { data } = await api.post("/users/verify", {
        email,
        otp: joinedOtp,
      });

      if (user?.email === email) {
        setUser({
          ...user,
          isEmailVerified: true,
        });
      }

      setFeedback(data?.message ?? "OTP verified successfully.");

      window.setTimeout(() => {
        router.push(user?.email === email ? "/profile" : "/sign-in");
        router.refresh();
      }, 1000);
    } catch (error) {
      const message = getErrorMessage(error, "Could not verify OTP.");
      setLocalError(message);
      setError(message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleResend = async () => {
    if (!email) {
      const message = "Email not found. Please restart the signup flow.";
      setLocalError(message);
      setError(message);
      return;
    }

    try {
      setActiveAction("resend");
      setLoading(true);
      setLocalError("");
      setFeedback("");
      setError(null);

      const { data } = await api.post("/users/resend", { email });
      const nextWindow = (data?.otpExpiresInMinutes ?? 10) * 60;

      setOtp(["", "", "", "", "", ""]);
      setTimeWindow(nextWindow);
      setExpiresAt(data?.otpExpiresAt ?? "");
      setFeedback(data?.message ?? "OTP resent to your email.");
      inputRefs.current[0]?.focus();
    } catch (error) {
      const message = getErrorMessage(error, "Could not resend OTP.");
      setLocalError(message);
      setError(message);
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body text-on-surface">
      <header className="bg-[#fdf9eb] flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#002663]">
            edit_note
          </span>
          <h1 className="font-serif text-xl uppercase">PEN CLUB</h1>
        </div>

        <button
          type="button"
          onClick={() => router.push("/sign-in")}
          className="text-xs font-medium uppercase tracking-wider text-primary"
        >
          Sign in
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-xl otp-input-shadow">
          <div className="text-center mb-10">
            <h2 className="text-3xl mb-3 font-serif">Verify your email</h2>
            <p className="text-sm text-gray-500">
              Enter the OTP sent to {email || "your email"}.
            </p>
          </div>

          <div className="mb-10">
            <div className="flex justify-between gap-2 mb-6">
              {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  disabled={isBusy}
                  onChange={(event) => handleInputChange(event.target.value, index)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  placeholder="0"
                  className="w-12 h-16 text-center text-3xl bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase text-gray-500">
                <span>Verification window</span>
                <span className={`font-semibold ${timeLeft < 60 ? "text-red-500" : ""}`}>
                  OTP expires in {formatTime(timeLeft)}
                </span>
              </div>

              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timeLeft < 60 ? "bg-red-500" : "bg-blue-900"}`}
                  style={{ width: `${Math.max(0, Math.min(100, (timeLeft / Math.max(1, timeWindow)) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {localError ? (
            <p className="mb-4 text-center text-sm text-red-600">{localError}</p>
          ) : null}

          {feedback ? (
            <p className="mb-4 text-center text-sm text-green-700">{feedback}</p>
          ) : null}

          <div className="space-y-4">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isBusy || otp.join("").length < OTP_LENGTH}
              className="w-full ink-gradient text-primary py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              {activeAction === "verify" ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify Email</span>
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isBusy || timeLeft > 0}
              className="w-full text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {activeAction === "resend" ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Resending...</span>
                </>
              ) : (
                <span>{timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}</span>
              )}
            </button>
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => router.push("/sign-up")}
              className="text-[10px] uppercase text-gray-500 hover:text-blue-900 transition-colors tracking-widest font-bold"
            >
              Need to restart? Back to sign up
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
