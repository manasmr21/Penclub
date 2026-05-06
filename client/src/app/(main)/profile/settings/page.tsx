"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, UserCog, KeyRound, LogOut } from "lucide-react";
import ProfileEditor from "@/src/components/profile/Edit/ProfileEditor";
import { useAppStore } from "@/src/lib/store/store";
import { logoutUser } from "@/src/lib/auth-api";
import { extractErrorMessage } from "@/src/lib/http-client";

type SettingsSection = "details" | "edit";

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

  if (!hydrated) {
    return <div className="pt-24 px-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return <div className="pt-24 px-4 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        <div className="mb-10 sm:mb-12 flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight leading-tight text-[#0A192F]">Profile Settings</h1>
          <p className="text-sm md:text-base font-serif italic text-primary/60">Manage your details and preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 items-start">
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-32">
            <div className="flex flex-col border-l border-primary/10">
              <button
                type="button"
                onClick={() => setActiveSection("details")}
                className={`flex w-full items-center gap-3 px-6 py-4 text-left text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all border-l-2 -ml-[1px] ${
                  activeSection === "details"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-primary/40 hover:text-primary/70 hover:bg-primary/5"
                }`}
              >
                <Settings size={14} />
                Profile Details
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("edit")}
                className={`flex w-full items-center gap-3 px-6 py-4 text-left text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all border-l-2 -ml-[1px] ${
                  activeSection === "edit"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent text-primary/40 hover:text-primary/70 hover:bg-primary/5"
                }`}
              >
                <UserCog size={14} />
                Edit Profile
              </button>

              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="flex w-full items-center gap-3 px-6 py-4 text-left text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all border-l-2 -ml-[1px] border-transparent text-primary/40 hover:text-primary/70 hover:bg-primary/5"
              >
                <KeyRound size={14} />
                Reset Password
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={logoutLoading}
                className="flex w-full items-center gap-3 px-6 py-4 text-left text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all border-l-2 -ml-[1px] border-transparent text-red-600/60 hover:text-red-600 hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={14} />
                {logoutLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </aside>

          <section className="md:col-span-8 lg:col-span-9 w-full max-w-3xl">
            {activeSection === "edit" ? (
              <ProfileEditor inModal={false} onClose={() => setActiveSection("details")} />
            ) : (
              <div className="border border-primary/10 bg-white p-8 md:p-10 rounded-none relative">
                <h2 className="text-2xl font-serif font-bold text-[#0A192F] mb-8">User Details</h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="border border-primary/10 bg-zinc-50/50 p-4 rounded-none">
                    <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">Name</p>
                    <p className="mt-2 text-sm font-sans font-medium text-[#0A192F]">{fieldValue(user.name)}</p>
                  </div>
                  <div className="border border-primary/10 bg-zinc-50/50 p-4 rounded-none">
                    <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">Username</p>
                    <p className="mt-2 text-sm font-sans font-medium text-[#0A192F]">@{fieldValue(user.username)}</p>
                  </div>
                  <div className="border border-primary/10 bg-zinc-50/50 p-4 rounded-none">
                    <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">Email</p>
                    <p className="mt-2 text-sm font-sans font-medium text-[#0A192F] break-all">{fieldValue(user.email)}</p>
                  </div>
                  <div className="border border-primary/10 bg-zinc-50/50 p-4 rounded-none">
                    <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">Role</p>
                    <p className="mt-2 text-sm font-sans font-medium capitalize text-[#0A192F]">{fieldValue(user.role)}</p>
                  </div>
                  <div className="border border-primary/10 bg-zinc-50/50 p-4 rounded-none">
                    <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40">Email Verified</p>
                    <p className="mt-2 text-sm font-sans font-medium text-[#0A192F]">{user.isEmailVerified ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="mt-6 border border-primary/10 bg-zinc-50/50 p-6 rounded-none">
                  <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40 mb-3">Bio</p>
                  <p className="text-sm font-sans text-primary/80 leading-relaxed">{fieldValue(user.bio)}</p>
                </div>

                <div className="mt-6 border border-primary/10 bg-zinc-50/50 p-6 rounded-none">
                  <p className="text-[10px] uppercase font-sans font-bold tracking-[0.2em] text-primary/40 mb-4">Interests</p>
                  {parsedInterests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {parsedInterests.map((interest) => (
                        <span key={interest} className="px-4 py-1.5 border border-primary/10 text-[10px] font-sans font-bold uppercase tracking-[0.1em] text-primary/80 bg-white">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-sans text-primary/60 italic">No interests added yet.</p>
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
