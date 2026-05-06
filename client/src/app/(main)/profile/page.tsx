"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileEditor from "@/src/components/profile/Edit/ProfileEditor";
import ProfileRedesign from "@/src/components/profile/redesign/Profile";
import { useAppStore } from "@/src/lib/store/store";

/* ---------------- LOADING ---------------- */

function ProfileLoadingView() {
  return (
    <div className="min-h-screen pt-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="profile-panel rounded-[2rem] p-6 sm:p-10 border border-primary/10 bg-card/50 backdrop-blur-sm animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14">
            {/* Avatar Skeleton */}
            <div className="w-[150px] md:w-[190px] aspect-[4/5] rounded-[2rem] bg-muted/40" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-5 w-full">
              <div className="space-y-2">
                <div className="h-8 w-1/2 bg-muted/40 rounded-lg" />
                <div className="h-3 w-1/4 bg-muted/30 rounded-full" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/20 rounded-full" />
                <div className="h-4 w-5/6 bg-muted/20 rounded-full" />
              </div>

              <div className="flex gap-3 pt-6">
                <div className="h-10 w-20 bg-muted/30 rounded-xl" />
                <div className="h-10 w-20 bg-muted/30 rounded-xl" />
                <div className="h-10 w-20 bg-muted/30 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user = useAppStore((s) => s.user);
  const hydrated = useAppStore((s) => s.hydrated);

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
    <div className="relative min-h-screen">
      <div className="relative pt-24 pb-20 px-4 sm:px-6">
        <ProfileRedesign />
      </div>

      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-[#0A192F]/60 backdrop-blur-sm p-4 transition-all duration-300 animate-in fade-in"
          onClick={() => {
            setIsEditModalOpen(false);
            router.push("/profile");
          }}
        >
          <div
            className="relative w-full max-w-xl max-h-[92vh] overflow-hidden bg-white shadow-2xl border border-primary/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[92vh] scrollbar-hide">
              <ProfileEditor
                inModal={true}
                onClose={() => {
                  setIsEditModalOpen(false);
                  router.push("/profile");
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoadingView />}>
      <ProfilePageContent />
    </Suspense>
  );
}
