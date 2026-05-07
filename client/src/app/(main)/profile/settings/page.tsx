"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, UserCog, KeyRound, LogOut } from "lucide-react";
import { motion } from "motion/react";
import ProfileEditor from "@/src/components/profile/Edit/ProfileEditor";
import { useAppStore } from "@/src/lib/store/store";
import { logoutUser, forgotPassword } from "@/src/lib/auth-api";
import { extractErrorMessage } from "@/src/lib/http-client";

type SettingsSection = "details" | "edit" | "password";

function fieldValue(value?: string) {
  return value?.trim() ? value : "Not added";
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);
  const clearAuth = useAppStore((s) => s.clearAuth);
  const setError = useAppStore((s) => s.setError);

  const [activeSection, setActiveSection] = useState<SettingsSection>("details");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/sign-in");
    }
  }, [hydrated, user, router]);

  const parsedInterests = useMemo(() => {
    if (!user) return [];

    const interests = (user as any).interests;

    if (Array.isArray(interests)) return interests.filter(Boolean);
    if (typeof interests === "string") {
      return interests
        .split(",")
        .map((interest: string) => interest.trim())
        .filter(Boolean);
    }

    return [];
  }, [user]);

  const handleLogout = async () => {
    setError(null);
    try {
      setLogoutLoading(true);
      await logoutUser();
    } catch (error) {
      const message = extractErrorMessage(error, "Logout failed.");
      setError(message);
      alert(message);
    } finally {
      clearAuth();
      router.push("/");
      router.refresh();
      setLogoutLoading(false);
    }
  };

  const handleSendResetLink = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    try {
      await forgotPassword(user.email);
      alert(
        `A secure password reset link has been dispatched to ${user.email}. Please verify your inbox.`
      );
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to dispatch reset link.");
      alert(message);
    } finally {
      setResetLoading(false);
    }
  };

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-[#FDF9F0] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20" />
          <div className="h-4 w-24 bg-primary/10 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FDF9F0]/60">
      <div className="max-w-5xl mx-auto px-4 pt-20 pb-20">
        <div className="mb-10 sm:mb-12 flex flex-col gap-2">

          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight text-[#1D4E89]">
            Profile Settings
          </h1>
          <p className="text-sm md:text-base font-serif italic text-[#1D4E89]/70">
            Manage your details and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-28">
            <div className="flex flex-col rounded-3xl border border-gray-100 bg-white p-4 shadow-md gap-1.5">
              <motion.button
                type="button"
                onClick={() => setActiveSection("details")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all cursor-pointer rounded-2xl ${activeSection === "details"
                  ? "bg-[#1D4E89] text-white shadow-lg shadow-primary/20"
                  : "text-[#1D4E89]/50 hover:text-[#1D4E89] hover:bg-gray-50"
                  }`}
              >
                <Settings size={14} />
                Profile Details
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setActiveSection("edit")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all cursor-pointer rounded-2xl ${activeSection === "edit"
                  ? "bg-[#1D4E89] text-white shadow-lg shadow-primary/20"
                  : "text-[#1D4E89]/50 hover:text-[#1D4E89] hover:bg-gray-50"
                  }`}
              >
                <UserCog size={14} />
                Edit Profile
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setActiveSection("password")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all cursor-pointer rounded-2xl ${activeSection === "password"
                  ? "bg-[#1D4E89] text-white shadow-lg shadow-primary/20"
                  : "text-[#1D4E89]/50 hover:text-[#1D4E89] hover:bg-gray-50"
                  }`}
              >
                <KeyRound size={14} />
                Reset Password
              </motion.button>

              <motion.button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-[10px] font-sans font-black uppercase tracking-[0.2em] transition-all cursor-pointer rounded-2xl text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={14} />
                {logoutLoading ? "Logging out..." : "Logout"}
              </motion.button>
            </div>
          </aside>

          <section className="md:col-span-8 lg:col-span-9 w-full max-w-3xl">
            {activeSection === "edit" ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
                <ProfileEditor inModal={false} onClose={() => setActiveSection("details")} />
              </div>
            ) : activeSection === "password" ? (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative">
                <h2 className="text-2xl font-serif font-bold text-[#1D4E89] mb-6">Reset Password</h2>

                <div className="max-w-md space-y-6">
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">
                      Your Registered Email
                    </p>
                    <p className="mt-2 text-base font-sans font-bold text-[#1D4E89]">{user.email}</p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleSendResetLink}
                    disabled={resetLoading}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full cursor-pointer bg-[#E6693E] text-white text-xs uppercase tracking-widest font-black rounded-2xl px-6 py-4 hover:bg-[#d5582f] transition-all duration-300 shadow-lg shadow-[#E6693E]/20 disabled:opacity-50"
                  >
                    {resetLoading ? "Dispatching..." : "Send Password Reset Link"}
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl relative">
                <h2 className="text-2xl font-serif font-bold text-[#1D4E89] mb-6">User Details</h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">Name</p>
                    <p className="mt-2 text-sm font-sans font-bold text-[#1D4E89]">{fieldValue(user.name)}</p>
                  </div>
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">Username</p>
                    <p className="mt-2 text-sm font-sans font-bold text-[#1D4E89]">@{fieldValue(user.username)}</p>
                  </div>
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">Email</p>
                    <p className="mt-2 text-sm font-sans font-bold text-[#1D4E89] break-all">{fieldValue(user.email)}</p>
                  </div>
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">Role</p>
                    <p className="mt-2 text-sm font-sans font-bold capitalize text-[#1D4E89]">{fieldValue(user.role)}</p>
                  </div>
                  <div className="border border-gray-100 bg-[#FDF9F0]/50 p-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 sm:col-span-2">
                    <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40">Email Verified</p>
                    <p className="mt-2 text-sm font-sans font-bold text-[#1D4E89]">{user.isEmailVerified ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="mt-6 border border-gray-100 bg-[#FDF9F0]/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40 mb-3">Bio</p>
                  <p className="text-sm font-sans text-[#1D4E89]/80 leading-relaxed font-serif italic">{fieldValue(user.bio)}</p>
                </div>

                <div className="mt-6 border border-gray-100 bg-[#FDF9F0]/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <p className="text-[10px] uppercase font-sans font-black tracking-[0.2em] text-[#1D4E89]/40 mb-4">Interests</p>
                  {parsedInterests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-4 py-1.5 border border-gray-100 rounded-full text-[9px] font-sans font-black uppercase tracking-[0.1em] text-[#E6693E] bg-white shadow-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground font-serif">No interests added yet.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
