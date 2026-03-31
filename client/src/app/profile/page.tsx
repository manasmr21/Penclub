"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { ArrowUpRight, BookOpen, FileText, Plus, UserRound, Users, Pencil } from "lucide-react";
import AuthShell from "@/src/components/auth/AuthShell";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ProfileHero } from "@/src/components/profile/ProfileHero";
import ProfileEditor from "@/src/components/profile/ProfileEditor";
import { createBook } from "@/src/lib/books-api";
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
  profilePicture,
  interests,
  verified,
  bio,
  email,
  phoneNumber,
}: {
  displayName: string;
  initials: string;
  profilePicture?: string;
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
        profilePicture={profilePicture}
        bio={
          bio ||
          "A clean reader profile showing your reading identity, favorite genre, and essential details."
        }
        initials={initials}
        editHref="/profile?edit=1"
        action={
          <Button asChild variant="outline" className="rounded-xl border-white/60 bg-card text-primary hover:bg-accent">
            <Link href="/profile?edit=1">
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
              <Link href="/profile?edit=1" className="text-sm font-medium text-slate-900 underline underline-offset-2">
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
  profilePicture,
  bio,
  email,
  phoneNumber,
  authorId,
}: {
  displayName: string;
  initials: string;
  profilePicture?: string;
  bio?: string;
  email?: string;
  phoneNumber?: string;
  authorId?: string;
}) {
  const [activeTab, setActiveTab] = useState<"books" | "posts">("books");
  const [booksCount, setBooksCount] = useState(0);
  const postsCount = 0;
  const followersCount = 0;
  const followingCount = 0;
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bookTitle, setBookTitle] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookReleaseDate, setBookReleaseDate] = useState("");
  const [bookPurchaseLinks, setBookPurchaseLinks] = useState("");
  const [bookCoverFile, setBookCoverFile] = useState<File | null>(null);
  const [bookFormError, setBookFormError] = useState("");
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const panelTitle = activeTab === "books" ? "Books published" : "Posts published";
  const panelDescription =
    activeTab === "books"
      ? "No books published yet. Use Add book to start building your author shelf."
      : "No posts published yet. Use Add post to share your latest writing.";

  const resetBookForm = () => {
    setBookTitle("");
    setBookDescription("");
    setBookGenre("");
    setBookReleaseDate("");
    setBookPurchaseLinks("");
    setBookCoverFile(null);
    setBookFormError("");
  };

  const closeAddBookModal = () => {
    setShowAddBookModal(false);
    resetBookForm();
  };

  const handleCreateBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authorId) {
      setBookFormError("Could not identify author account.");
      return;
    }

    if (!bookTitle.trim() || !bookDescription.trim() || !bookGenre.trim()) {
      setBookFormError("Title, description, and genre are required.");
      return;
    }

    if (bookCoverFile && !bookCoverFile.type.startsWith("image/")) {
      setBookFormError("Cover image must be an image file.");
      return;
    }

    try {
      setBookSubmitting(true);
      setBookFormError("");

      const purchaseLinks = bookPurchaseLinks
        .split("\n")
        .map((link) => link.trim())
        .filter(Boolean);

      await createBook({
        title: bookTitle.trim(),
        description: bookDescription.trim(),
        genre: bookGenre.trim(),
        releaseDate: bookReleaseDate || undefined,
        purchaseLinks: purchaseLinks.length ? purchaseLinks : undefined,
        authorId,
        coverImageFile: bookCoverFile ?? undefined,
      });

      setBooksCount((current) => current + 1);
      closeAddBookModal();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Could not add book.";

      setBookFormError(message ?? "Could not add book.");
    } finally {
      setBookSubmitting(false);
    }
  };

  return (
    <div className="profile-surface">
      <ProfileHero
        label="Author profile"
        displayName={displayName}
        profilePicture={profilePicture}
        bio={bio}
        email={email}
        phoneNumber={phoneNumber}
        initials={initials}
        editHref="/profile?edit=1"
        compact
        stats={[
          { label: "Followers", value: followersCount },
          { label: "Following", value: followingCount },
          { label: "Books", value: booksCount },
          { label: "Blogs", value: postsCount },
        ]}
        action={
          <Button asChild variant="outline" className="rounded-xl border-white/60 bg-card text-primary hover:bg-accent">
            <Link href="/profile?edit=1">
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
               <Button type="button" className="rounded-xl shadow-lg" onClick={() => setShowAddBookModal(true)}>
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

      {showAddBookModal ? (
        <div
          className="fixed inset-0 z-[1100] flex items-start justify-center bg-slate-950/50 p-4 pt-20 sm:p-6 sm:pt-24"
          onClick={closeAddBookModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold text-primary sm:text-2xl">Add book</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Publish a new book to your author profile.
              </p>
            </div>

            <form onSubmit={handleCreateBook} className="mt-6 space-y-3">
              <input
                type="text"
                value={bookTitle}
                onChange={(event) => setBookTitle(event.target.value)}
                placeholder="Book title"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                value={bookGenre}
                onChange={(event) => setBookGenre(event.target.value)}
                placeholder="Genre"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="date"
                value={bookReleaseDate}
                onChange={(event) => setBookReleaseDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={bookDescription}
                onChange={(event) => setBookDescription(event.target.value)}
                placeholder="Book description"
                className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <textarea
                value={bookPurchaseLinks}
                onChange={(event) => setBookPurchaseLinks(event.target.value)}
                placeholder="Purchase links (one per line)"
                className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setBookCoverFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary"
              />

              {bookFormError ? <p className="text-sm text-red-600">{bookFormError}</p> : null}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit" disabled={bookSubmitting} className="w-full rounded-xl">
                  {bookSubmitting ? "Adding..." : "Add book"}
                </Button>
                <Button type="button" variant="outline" className="w-full rounded-xl" onClick={closeAddBookModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit");
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (searchParams.get("edit") === "1") {
      setIsEditModalOpen(true);
      return;
    }
    setIsEditModalOpen(false);
  }, [searchParams]);

  useEffect(() => {
    if (!isEditModalOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEditModalOpen]);

  if (!hydrated) return <ProfileLoadingView />;
  if (hydrated && !user) return <GuestView />;

  const displayName = getDisplayName(user?.name, user?.username, user?.penName);
  const initials = displayName.charAt(0).toUpperCase();
  const interests = user?.interests ?? [];
  const verified = user?.isEmailVerified ?? false;

  return (
    <>
      <AuthShell
        cardClassName="auth-shell-card-profile"
        contentClassName="auth-shell-content-profile"
      >
        {user?.role === "author" ? (
          <AuthorProfile
            displayName={displayName}
            initials={initials}
            profilePicture={user?.profilePicture}
            bio={user?.bio}
            email={user?.email}
            phoneNumber={user?.phoneNumber}
            authorId={user?.id}
          />
        ) : (
          <ReaderProfile
            displayName={displayName}
            initials={initials}
            profilePicture={user?.profilePicture}
            interests={interests}
            verified={verified}
            bio={user?.bio}
            email={user?.email}
            phoneNumber={user?.phoneNumber}
          />
        )}
      </AuthShell>

      {isEditModalOpen ? (
        <div
          className="fixed inset-0 z-[1100] flex items-start justify-center bg-slate-950/50 p-4 pt-20 sm:p-6 sm:pt-24"
          onClick={closeEditModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <ProfileEditor inModal onClose={closeEditModal} />
          </div>
        </div>
      ) : null}
    </>
  );
}
