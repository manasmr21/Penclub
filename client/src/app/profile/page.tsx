"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, Plus, UserRound, Users, Pencil } from "lucide-react";
import AuthShell from "@/src/components/auth/AuthShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ProfileHero } from "@/src/components/profile/ProfileHero";
import {
  ProfileSectionCard,
  ProfileStatCard,
  ProfileSummaryCard,
} from "@/src/components/profile/ProfileCardPrimitives";
import { useAuthStore } from "@/src/store/auth-store";

function formatLabel(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getDisplayName(name?: string, username?: string, penName?: string) {
  return penName || name || username || "Reader";
}

function GuestView() {
  return (
    <AuthShell
      cardClassName="auth-shell-card-profile max-w-[42rem]"
      contentClassName="auth-shell-content-profile"
    >
      <div className="profile-panel rounded-[2rem] bg-[linear-gradient(160deg,#ffffff,#f8f1d4)] p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-200">
          <UserRound className="h-8 w-8 text-amber-700" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">Your profile</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          Sign in to view your reader or author profile, details, and activity.
        </p>
        <Button asChild className="mt-7 rounded-full px-5 py-3 text-sm font-semibold">
          <Link href="/sign-in">
            Sign in
            <ArrowUpRight size={16} />
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}

function ProfileLoadingView() {
  return (
    <AuthShell
      cardClassName="auth-shell-card-profile max-w-[42rem]"
      contentClassName="auth-shell-content-profile"
    >
      <div className="profile-panel rounded-[2rem] p-6 sm:p-8">
        <div className="animate-pulse space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 rounded-full bg-muted" />
              <div className="h-8 w-48 rounded-full bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-20 rounded-2xl bg-muted" />
          </div>
          <div className="h-28 rounded-3xl bg-muted" />
        </div>
      </div>
    </AuthShell>
  );
}

function ReaderProfile({
  displayName,
  initials,
  interests,
  verified,
  bio,
  email,
  phoneNumber,
}: {
  displayName: string;
  initials: string;
  interests: string[];
  verified: boolean;
  bio?: string;
  email?: string;
  phoneNumber?: string;
}) {
  const primaryInterest = interests[0];

  return (
    <div className="profile-surface">
      <ProfileHero
        label="Reader profile"
        displayName={displayName}
        bio={
          bio ||
          "A clean reader profile showing your reading identity, favorite genre, and essential details."
        }
        initials={initials}
        verified={verified}
        action={
          <Button asChild variant="outline" className="rounded-xl border-white/60 bg-card text-primary hover:bg-accent">
            <Link href="/profile/edit">
              <Pencil size={15} />
              Edit profile
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:gap-6 lg:p-7 xl:p-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <ProfileStatCard label="Following" value={0} />
            <ProfileStatCard label="Interest" value={primaryInterest ? formatLabel(primaryInterest) : "Add some"} />
            <ProfileStatCard label="Role" value="Reader" />
            <ProfileStatCard label="Status" value={verified ? "Active" : "Pending"} />
          </div>

          <ProfileSectionCard title="About">
            <p className="text-sm leading-7 text-slate-700">
              {bio ||
                "Add a short bio to introduce your reading style, favorite genres, and what keeps you turning pages."}
            </p>
          </ProfileSectionCard>
        </div>

        <div className="space-y-5">
          <ProfileSectionCard title="Interest">
            {primaryInterest ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                {formatLabel(primaryInterest)}
              </span>
            ) : (
              <Link href="/profile/edit" className="text-sm font-medium text-slate-900 underline underline-offset-2">
                Add some
              </Link>
            )}
          </ProfileSectionCard>

          <ProfileSummaryCard title="Summary">
            <dl className="space-y-3">
              {[
                { label: "Display name", value: displayName },
                { label: "Email", value: email ?? "-" },
                { label: "Phone", value: phoneNumber ?? "-" },
                { label: "Account", value: verified ? "Verified" : "Needs action" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-xs text-primary-foreground/70">{label}</dt>
                  <dd className="truncate text-right text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </ProfileSummaryCard>
        </div>
      </div>
    </div>
  );
}

function AuthorProfile({
  displayName,
  initials,
  verified,
  bio,
  email,
  phoneNumber,
}: {
  displayName: string;
  initials: string;
  verified: boolean;
  bio?: string;
  email?: string;
  phoneNumber?: string;
}) {
  const [activeTab, setActiveTab] = useState<"books" | "posts">("books");
  const booksCount = 0;
  const postsCount = 0;
  const followersCount = 0;
  const followingCount = 0;
  const panelTitle = activeTab === "books" ? "Books published" : "Posts published";
  const panelDescription =
    activeTab === "books"
      ? "No books published yet. Use Add book to start building your author shelf."
      : "No posts published yet. Use Add post to share your latest writing.";

  return (
    <div className="profile-surface">
      <ProfileHero
        label="Author profile"
        displayName={displayName}
        bio={
          bio ||
          "A premium author dashboard with audience metrics, publishing actions, and a clean workspace for books and posts."
        }
        email={email}
        phoneNumber={phoneNumber}
        initials={initials}
        verified={verified}
        compact
        stats={[
          { label: "Followers", value: followersCount },
          { label: "Following", value: followingCount },
          { label: "Books", value: booksCount },
          { label: "Blogs", value: postsCount },
        ]}
        action={
          <Button asChild variant="outline" className="rounded-xl border-white/60 bg-card text-primary hover:bg-accent">
            <Link href="/profile/edit">
              <Pencil size={15} />
              Edit profile
            </Link>
          </Button>
        }
      />

      <div className="space-y-3 p-4 sm:p-5 lg:p-6 xl:p-7">
        <Card className="profile-panel gap-0 rounded-[1.35rem] py-0">
          <CardContent className="p-3.5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            
              <div className="text-sm text-muted-foreground">
                Manage your published books and blogs from one place.
              </div>
              <div className="flex flex-wrap gap-3">
               <Button type="button" className="rounded-xl shadow-lg">
                  <Plus size={15} />
                  Add book
                </Button>
                <Button type="button" variant="outline" className="rounded-xl">
                  <Plus size={15} />
                  Add post
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => setActiveTab("books")}
            variant={activeTab === "books" ? "default" : "outline"}
            className={`rounded-xl ${activeTab === "books" ? "shadow-lg" : ""}`}
          >
            <BookOpen size={15} />
            Books
          </Button>
          <Button
            type="button"
            onClick={() => setActiveTab("posts")}
            variant={activeTab === "posts" ? "default" : "outline"}
            className={`rounded-xl ${activeTab === "posts" ? "shadow-lg" : ""}`}
          >
            <FileText size={15} />
            Posts
          </Button>
        </div>

        <Card className="profile-panel gap-0 py-0 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <CardContent className="p-4 sm:p-5">
            <div className="rounded-[1.25rem] bg-muted/30 p-5 ring-1 ring-border/60">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">{panelTitle}</h2>
                  <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{panelDescription}</p>
                </div>
                <div className="hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:block">
                  {activeTab}
                </div>
              </div>

              <div className="mt-5 rounded-[1.1rem] border border-dashed border-border bg-card px-5 py-12 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <p className="mt-3 text-sm font-medium text-card-foreground">Nothing published here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Publish your first {activeTab === "books" ? "book" : "post"} to populate this section.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) return <ProfileLoadingView />;
  if (hydrated && !user) return <GuestView />;

  const displayName = getDisplayName(user?.name, user?.username, user?.penName);
  const initials = displayName.charAt(0).toUpperCase();
  const interests = user?.interests ?? [];
  const verified = user?.isEmailVerified ?? false;

  return (
    <AuthShell
      cardClassName="auth-shell-card-profile"
      contentClassName="auth-shell-content-profile"
    >
      {user?.role === "author" ? (
        <AuthorProfile
          displayName={displayName}
          initials={initials}
          verified={verified}
          bio={user?.bio}
          email={user?.email}
          phoneNumber={user?.phoneNumber}
        />
      ) : (
        <ReaderProfile
          displayName={displayName}
          initials={initials}
          interests={interests}
          verified={verified}
          bio={user?.bio}
          email={user?.email}
          phoneNumber={user?.phoneNumber}
        />
      )}
    </AuthShell>
  );
}
