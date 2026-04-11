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
    <div className="main-container px-3 sm:px-6 pt-20 sm:pt-24 pb-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-3 text-primary">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition hover:bg-muted/60"
          >
            Back to Profile
          </button>
        </div>

        <div className="mb-5 sm:mb-6 flex items-center gap-2 text-primary">
          <Settings size={18} />
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
          <aside className="md:col-span-4 lg:col-span-3 md:sticky md:top-24 md:self-start">
            <div className="rounded-2xl border border-border bg-card p-3 sm:p-4">
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setActiveSection("details")}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    activeSection === "details"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <Settings size={16} />
                  Profile Details
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection("edit")}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    activeSection === "edit"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/70"
                  }`}
                >
                  <UserCog size={16} />
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-muted/70"
                >
                  <KeyRound size={16} />
                  Reset Password
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  <LogOut size={16} />
                  {logoutLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </aside>

          <section className="md:col-span-8 lg:col-span-9">
            {activeSection === "edit" ? (
              <ProfileEditor inModal={false} onClose={() => setActiveSection("details")} />
            ) : (
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
                <h2 className="text-xl font-semibold text-foreground">User Details</h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-background p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Name</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{fieldValue(user.name)}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Username</p>
                    <p className="mt-1 text-sm font-medium text-foreground">@{fieldValue(user.username)}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                    <p className="mt-1 text-sm font-medium text-foreground break-all">{fieldValue(user.email)}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Role</p>
                    <p className="mt-1 text-sm font-medium capitalize text-foreground">{fieldValue(user.role)}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Email Verified</p>
                    <p className="mt-1 text-sm font-medium text-foreground">{user.isEmailVerified ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-border/70 bg-background p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Bio</p>
                  <p className="mt-2 text-sm text-foreground">{fieldValue(user.bio)}</p>
                </div>

                <div className="mt-5 rounded-xl border border-border/70 bg-background p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Interests</p>
                  {parsedInterests.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parsedInterests.map((interest) => (
                        <span key={interest} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">No interests added yet.</p>
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
