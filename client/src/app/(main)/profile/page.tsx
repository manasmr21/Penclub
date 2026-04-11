"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileEditor from "@/src/components/profile/Edit/ProfileEditor";
import ProfileRedesign from "@/src/components/profile/redesign/Profile";
import { useAppStore } from "@/src/lib/store/store";

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
    <div className="pt-16 min-h-screen bg-background">
      <ProfileRedesign />

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 pt-6 sm:px-4 sm:pt-14 pb-4 backdrop-blur-sm">
            <ProfileEditor
              inModal={true}
              onClose={() => {
                setIsEditModalOpen(false);
                router.push("/profile");
              }}
            />
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
