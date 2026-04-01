"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileEditor from "@/src/components/profile/ProfileEditor";
import ProfileRedesign from "@/src/components/profile/redesign/Profile";
import { useAuthStore } from "@/src/store/auth-store";

/* ---------------- LOADING ---------------- */

function ProfileLoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[42rem]">
        <div className="profile-panel rounded-[2rem] p-6 sm:p-8 border border-outline-variant/10">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 bg-muted rounded-full" />
                <div className="h-8 w-48 bg-muted rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setIsEditModalOpen(searchParams.get("edit") === "1");
  }, [searchParams]);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/sign-in");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) return <ProfileLoadingView />;

  return (
    <div className="pt-24 min-h-screen bg-background">
      <ProfileRedesign />

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
            <ProfileEditor 
              inModal={true} 
              onClose={() => {
                setIsEditModalOpen(false);
                router.push("/profile");
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}