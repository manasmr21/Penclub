"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import { resendUserOtp, verifyUserOtp } from "@/src/lib/auth-api";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { setError, setUser } = useAuthStore();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input changes
  const handleInputChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  


  return (
    <div className="min-h-screen flex flex-col font-body text-on-surface">

      {/* Header */}
      <header className="bg-[#fdf9eb] flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#002663]">
            edit_note
          </span>
          <h1 className="font-serif text-xl uppercase">PEN CLUB</h1>
        </div>

        <button
          onClick={() => router.push("/sign-in")}
          className="text-xs font-medium uppercase tracking-wider text-[#002663]"
        >
          Sign in
        </button>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">

        {/* Card */}
        <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-xl otp-input-shadow">

          <div className="text-center mb-10">
            <h2 className="text-3xl mb-3 font-serif">Verify your email</h2>
            <p className="text-sm text-gray-500">
              Enter the OTP sent to someone
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="mb-10">
            <div className="flex justify-between gap-2 mb-6">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={otp[i]}
                  onChange={(e) => handleInputChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  placeholder="•"
                  className="w-12 h-16 text-center text-3xl bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                />
              ))}
            </div>

            {/* Timer */}
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
                  style={{ width: `${(timeLeft / 600) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button

              disabled={isLoading || otp.join("").length < 6}
              className="w-full ink-gradient text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              disabled={isLoading || timeLeft > 0}
              className="w-full text-gray-500 py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Resending..." : timeLeft > 0 ? `Resend OTP in ${timeLeft}s` : "Resend OTP"}
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-10 text-center">
            <button
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
