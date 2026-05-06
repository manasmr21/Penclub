"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, UserCog, KeyRound, LogOut } from "lucide-react";
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
    if (Array.isArray(user.interests)) return user.interests;
    if (typeof user.interests === "string") {
      //@ts-expect-error
      return user.interests.split(",").map((interest) => interest.trim()).filter(Boolean);
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
      alert(`A secure password reset link has been dispatched to ${user.email}. Please verify your inbox.`);
    } catch (error) {
      const message = extractErrorMessage(error, "Failed to dispatch reset link.");
      alert(message);
    } finally {
      setResetLoading(false);
    }
  };

  if (!hydrated) {
    return <div className="pt-24 px-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="pt-24 px-4 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="main-container px-3 sm:px-6 pt-24 sm:pt-28 pb-16">
      <div className="mx-auto max-w-6xl">
        {/* EDITORIAL HEADER */}
        <div className="mb-8 border-b-2 border-primary/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
              Atelier Settings
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mt-1 tracking-tight">
              Account Dossier & Settings
            </h1>
          </div>
          <div className="text-sm font-medium text-muted-foreground font-serif italic">
            Refining your digital voice
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* SIDEBAR NAVIGATION */}
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-28 md:self-start">
            <div className="border border-primary/20 bg-card p-4 rounded-none shadow-[0_4px_20px_rgba(13,56,125,0.02)]">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-primary/40 mb-3 px-2">Navigation</h3>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition duration-200 rounded-none border-l-2 ${
                    activeSection === "details"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Settings size={15} />
                  Profile Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("edit")}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition duration-200 rounded-none border-l-2 ${
                    activeSection === "edit"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <UserCog size={15} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("password")}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold transition duration-200 rounded-none border-l-2 ${
                    activeSection === "password"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <KeyRound size={15} />
                  Reset Password
                </button>

                <div className="my-2 border-t border-primary/10" />

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition duration-200 rounded-none border-l-2 border-transparent hover:bg-red-50/50 disabled:opacity-60"
                >
                  <LogOut size={15} />
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN SETTINGS CONTENT */}
          <section className="md:col-span-8 lg:col-span-9">
            {activeSection === "password" ? (
              <div className="border border-primary/20 bg-card p-6 md:p-8 rounded-none shadow-[0_4px_20px_rgba(13,56,125,0.02)]">
                <div className="border-b border-primary/15 pb-4 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">Reset Password</h2>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wide">Request a secure password reset link to your registered email address</p>
                </div>

                <div className="max-w-md space-y-6">
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">Your Registered Email</p>
                    <p className="mt-1.5 text-base font-medium text-primary">{user.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendResetLink}
                    disabled={resetLoading}
                    className="cursor-pointer bg-primary text-white text-xs uppercase tracking-widest font-bold rounded-none px-6 py-3.5 border border-primary hover:bg-transparent hover:text-primary transition duration-200 disabled:opacity-50"
                  >
                    {resetLoading ? "Dispatching..." : "Send Password Reset Link"}
                  </button>
                </div>
              </div>
            ) : activeSection === "edit" ? (
              <div className="border border-primary/20 bg-card p-4 sm:p-6 rounded-none shadow-[0_4px_20px_rgba(13,56,125,0.02)]">
                <ProfileEditor inModal={false} onClose={() => setActiveSection("details")} />
              </div>
            ) : (
              <div className="border border-primary/20 bg-card p-6 md:p-8 rounded-none shadow-[0_4px_20px_rgba(13,56,125,0.02)]">
                <div className="border-b border-primary/15 pb-4 mb-6">
                  <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">Atelier Dossier</h2>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wide">Current account details & system metadata</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">Full Name</p>
                    <p className="mt-1 text-base font-serif font-medium text-primary">{fieldValue(user.name)}</p>
                  </div>
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">Username</p>
                    <p className="mt-1 text-base font-mono text-primary/90">@{fieldValue(user.username)}</p>
                  </div>
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">Email Address</p>
                    <p className="mt-1 text-base text-primary/90 break-all">{fieldValue(user.email)}</p>
                  </div>
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">System Role</p>
                    <p className="mt-1 text-base font-serif capitalize text-primary">{fieldValue(user.role)}</p>
                  </div>
                  <div className="border-b border-primary/10 pb-4">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50">Verification Status</p>
                    <div className="mt-1.5 flex items-center">
                      {user.isEmailVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-b border-primary/10 pb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50 mb-2">Biography</p>
                  <p className="text-base font-serif text-primary/90 leading-relaxed italic">
                    "{fieldValue(user.bio)}"
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/50 mb-3">Interests & Topics</p>
                  {parsedInterests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedInterests.map((interest) => (
                        <span key={interest} className="rounded-none border border-primary/20 bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition duration-150">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">No interests added yet.</p>
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
