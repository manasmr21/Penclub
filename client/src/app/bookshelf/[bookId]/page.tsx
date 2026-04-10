"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { createBookReview, fetchAuthorNameById, fetchBookById, fetchReviewsByBook, type BookReview, updateBookReview } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { useAppStore } from "@/src/lib/store/store";
import { followAuthor } from "@/src/lib/auth-api";

function renderStars(rating: number) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return Array.from({ length: 5 }, (_, index) => index < safeRating);
}

function formatPublishedDate(dateInput?: string) {
  if (!dateInput) return "Unknown";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function formatRelativeTime(dateInput?: string) {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = date.getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) return "Today";
  if (Math.abs(diffDays) < 30) return formatter.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return formatter.format(diffMonths, "month");

  const diffYears = Math.round(diffMonths / 12);
  return formatter.format(diffYears, "year");
}

function getInitials(name?: string) {
  if (!name?.trim()) return "RD";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "RD";
}

export default function BookDetailsPage() {
  const params = useParams<{ bookId: string }>();
  const searchParams = useSearchParams();
  const bookId = params?.bookId;
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const followedAuthorsByUser = useAppStore((s) => s.followedAuthorsByUser);
  const addFollowedAuthor = useAppStore((s) => s.addFollowedAuthor);
  const removeFollowedAuthor = useAppStore((s) => s.removeFollowedAuthor);

  const [book, setBook] = useState<AuthorBook | null>(null);
  const [reviews, setReviews] = useState<BookReview[]>([]);
  const [authorName, setAuthorName] = useState<string>("Unknown author");
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) return;

    const loadDetails = async () => {
      setLoading(true);
      try {
        const [bookData, reviewData] = await Promise.all([fetchBookById(bookId), fetchReviewsByBook(bookId)]);
        setBook(bookData);
        setReviews(reviewData);

        const directName = bookData?.author?.name?.trim() || bookData?.author?.username?.trim();
        if (directName) {
          setAuthorName(directName);
          return;
        }

        if (bookData?.authorId && user?.id === bookData.authorId) {
          const ownName = user.name?.trim() || user.username?.trim();
          if (ownName) {
            setAuthorName(ownName);
            return;
          }
        }

        if (bookData?.authorId) {
          const resolvedName = await fetchAuthorNameById(bookData.authorId);
          setAuthorName(resolvedName ?? "Unknown author");
          return;
        }

        setAuthorName("Unknown author");
      } catch {
        setBook(null);
        setReviews([]);
        setAuthorName("Unknown author");
      } finally {
        setLoading(false);
      }
    };

    void loadDetails();
  }, [bookId, user?.id, user?.name, user?.username]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);
  const bookImageUrls = useMemo(() => {
    if (!book) return [];
    const urls = (book.images ?? []).map((image) => image?.url).filter((url): url is string => Boolean(url));
    if (book.coverImage && !urls.includes(book.coverImage)) {
      return [book.coverImage, ...urls];
    }
    return urls;
  }, [book]);
  const mainImage = selectedImage ?? bookImageUrls[0] ?? null;
  const roundedAverageRating = useMemo(() => Math.round(averageRating * 10) / 10, [averageRating]);
  const ratingDistribution = useMemo(() => {
    const totalReviews = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter((review) => Math.round(review.rating || 0) === star).length;
      return {
        star,
        count,
        width: `${Math.max(4, Math.round((count / totalReviews) * 100))}%`,
      };
    });
  }, [reviews]);

  const canReview = Boolean(user && user.isEmailVerified);
  const canFollowAuthor = Boolean(user && user.role === "reader" && book?.authorId && user.id !== book.authorId);
  const from = searchParams.get("from");
  const backHref = from === "profile" ? "/profile" : "/bookshelf";
  const backLabel = from === "profile" ? "Back to profile" : "Back to bookshelf";
  const myReview = useMemo(
    () => (user?.id ? reviews.find((review) => review.user?.id === user.id) ?? null : null),
    [reviews, user?.id],
  );

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 0);
      setContent(myReview.content ?? "");
    }
  }, [myReview]);

  useEffect(() => {
    if (!user?.id || !book?.authorId) return;
    const followedAuthors = followedAuthorsByUser[user.id] ?? [];
    setIsFollowing(followedAuthors.includes(book.authorId));
  }, [user?.id, book?.authorId, followedAuthorsByUser]);

  useEffect(() => {
    setSelectedImage(bookImageUrls[0] ?? null);
  }, [bookImageUrls]);

  const handleFollowAuthor = async () => {
    if (!book?.authorId || !canFollowAuthor || !user?.id) return;

    try {
      setFollowLoading(true);
      const response = await followAuthor(book.authorId);
      const message = String(response?.message ?? "").toLowerCase();

      if (message.includes("unfollowed")) {
        setIsFollowing(false);
        removeFollowedAuthor(user.id, book.authorId);
        const currentFollowingCount = user.followingCount ?? 0;
        updateUser({ followingCount: Math.max(0, currentFollowingCount - 1) });
      } else if (message.includes("followed")) {
        setIsFollowing(true);
        addFollowedAuthor(user.id, book.authorId);
        const currentFollowingCount = user.followingCount ?? 0;
        updateUser({ followingCount: currentFollowingCount + 1 });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to follow author.";
      alert(message);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookId || !canReview) return;
    if (rating < 1) {
      alert("Please select a star rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      if (myReview?.id) {
        await updateBookReview(myReview.id, {
          rating,
          content: content.trim() || undefined,
        });
      } else {
        await createBookReview({
          bookId,
          rating,
          content: content.trim() || undefined,
        });
      }

      const latest = await fetchReviewsByBook(bookId);
      setReviews(latest);
      if (!myReview?.id) {
        setContent("");
        setRating(0);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit review.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container px-4 md:px-8 pt-28 pb-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          Loading book details...
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="main-container px-4 md:px-8 pt-28 pb-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          Book not found.
          <div className="mt-4">
            <Link href={backHref} className="font-medium text-primary underline">
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container px-4 md:px-8 pt-28 pb-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-x-1"
      >
        <span aria-hidden="true">&larr;</span>
        {backLabel}
      </Link>

      <section className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-3">
          <div className="mx-auto aspect-[3/4] max-w-[260px] overflow-hidden rounded-xl border border-border bg-muted shadow-xl">
            {mainImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImage} alt={book.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center px-4 text-center text-sm text-muted-foreground">
                No cover image available
              </div>
            )}
          </div>
          {bookImageUrls.length > 1 && (
            <div className="mx-auto mt-3 flex max-w-[260px] items-center gap-2 overflow-x-auto pb-1">
              {bookImageUrls.map((url, index) => {
                const isActive = url === mainImage;
                return (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(url)}
                    className={`h-14 w-12 shrink-0 overflow-hidden rounded-md border bg-muted transition ${
                      isActive ? "border-primary ring-1 ring-primary/40" : "border-border"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`${book.title} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
          <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
        </div>

        <div className="lg:col-span-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {book.genre || "General"}
            </span>
            <span className="rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
              Featured
            </span>
          </div>

          <h1 className="font-quicksand text-3xl font-bold tracking-tight text-primary md:text-4xl">{book.title}</h1>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <p className="italic">
              by <span className="not-italic font-semibold text-foreground">{authorName}</span>
            </p>
            {canFollowAuthor && (
              <button
                type="button"
                onClick={handleFollowAuthor}
                disabled={followLoading}
                className=" text-xs font-semibold lowercase tracking-[0.12em] text-primary transition hover:bg-primary/10 disabled:opacity-60"
              >
                {followLoading ? "Please wait..." : isFollowing ? "Following" : "Follow author"}
              </button>
            )}
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">First Published</p>
            <p className="mt-1 text-base font-semibold text-foreground">{formatPublishedDate(book.createdAt)}</p>
          </div>

          <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {book.description?.trim() || "No description provided for this book yet."}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition hover:opacity-90">
              Read now
            </button>
            <button className="rounded-full border border-border bg-card px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-muted/60">
              Add to Readlist
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-xl">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] opacity-80">Reader Consensus</h3>
            <div className="mb-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold md:text-6xl">{roundedAverageRating.toFixed(1)}</span>
              <span className="text-lg opacity-70">/ 5.0</span>
            </div>
            <div className="mb-5 flex items-center gap-1 text-2xl leading-none text-[#f5c542]">
              {renderStars(averageRating).map((filled, index) => (
                <span key={`avg-star-${index}`} aria-hidden="true">
                  {filled ? "\u2605" : "\u2606"}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              {ratingDistribution.map(({ star, width }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="w-3 text-xs font-semibold">{star}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-foreground/20">
                    <div className="h-full rounded-full bg-secondary" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute -right-10 -top-8 h-28 w-28 rounded-full bg-primary-foreground/10 blur-2xl" />
          </div>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-9">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-quicksand text-3xl font-bold text-primary md:text-4xl">Comments &amp; Reviews</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {reviews.length} Discussion{reviews.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-5">
            {reviews.length ? (
              reviews.map((review) => {
                const reviewerName = review.user?.name || review.user?.username || "Reader";
                return (
                  <article key={review.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary/20 text-sm font-bold text-primary">
                          {getInitials(reviewerName)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{reviewerName}</p>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            Verified Reader &bull; {formatRelativeTime(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-lg leading-none text-[#d4a017]">
                        {renderStars(review.rating).map((filled, index) => (
                          <span key={`${review.id}-star-${index}`} aria-hidden="true">
                            {filled ? "\u2605" : "\u2606"}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="leading-relaxed text-muted-foreground">
                      {review.content?.trim() || "No written comment shared for this rating."}
                    </p>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 text-muted-foreground">
                No comments or reviews yet.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-8 lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-xl font-bold text-primary">{myReview ? "Edit Your Thoughts" : "Share Your Thoughts"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your perspective helps readers discover what to pick up next.
            </p>

            {canReview ? (
              <form className="mt-5 space-y-4" onSubmit={handleSubmitReview}>
                <div className="rounded-lg border border-border bg-background p-2.5">
                  <div className="flex items-center justify-center gap-1 text-2xl leading-none text-[#d4a017]">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`Set rating to ${value} star${value > 1 ? "s" : ""}`}
                        className="transition hover:scale-110"
                      >
                        {value <= rating ? "\u2605" : "\u2606"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Comment
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    placeholder="Write your review..."
                    className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Saving..." : myReview ? "Update Rating & Comment" : "Add Your Rating & Comment"}
                </button>
              </form>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">Only verified users can add rating and comment.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}


