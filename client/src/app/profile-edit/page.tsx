"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/auth-store";
import ProfileEditor from "@/src/components/profile/ProfileEditor";

function ProfileEditLoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[42rem]">
        <div className="profile-panel rounded-[2rem] p-6 sm:p-8 border border-outline-variant/10">
          <div className="animate-pulse space-y-5">
            <div className="h-8 w-48 bg-muted rounded-full" />
            <div className="h-24 w-full bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/sign-in");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <ProfileEditLoadingView />;

  return (
    <div className="pt-24 min-h-screen bg-background px-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl mx-auto p-8">
        <ProfileEditor />
      </div>
    </div>
  );
}
