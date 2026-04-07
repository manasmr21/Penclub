"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createBookReview, fetchAuthorNameById, fetchBookById, fetchReviewsByBook, type BookReview, updateBookReview } from "@/src/lib/books-api";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import { useAppStore } from "@/src/lib/store/store";
import { followAuthor } from "@/src/lib/auth-api";

function renderStars(rating: number) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)));
  return "\u2605".repeat(safeRating) + "\u2606".repeat(5 - safeRating);
}

export default function BookDetailsPage() {
  const params = useParams<{ bookId: string }>();
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
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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

  const canReview = Boolean(user && user.isEmailVerified);
  const canFollowAuthor = Boolean(user && user.role === "reader" && book?.authorId && user.id !== book.authorId);
  const myReview = useMemo(
    () => (user?.id ? reviews.find((review) => review.user?.id === user.id) ?? null : null),
    [reviews, user?.id],
  );

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating || 5);
      setContent(myReview.content ?? "");
    }
  }, [myReview]);

  useEffect(() => {
    if (!user?.id || !book?.authorId) return;
    const followedAuthors = followedAuthorsByUser[user.id] ?? [];
    setIsFollowing(followedAuthors.includes(book.authorId));
  }, [user?.id, book?.authorId, followedAuthorsByUser]);

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
        setRating(5);
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
      <div className="main-container pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-on-surface-variant/70">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="main-container pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center text-on-surface-variant/70">
          Book not found.
          <div className="mt-4">
            <Link href="/bookshelf" className="text-[#1e2741] underline">
              Back to bookshelf
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/bookshelf" className="text-[14px] text-[#1e2741] underline">
          Back to bookshelf
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <div className="w-full aspect-[2/3] bg-gray-200 rounded-md overflow-hidden">
            {book.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-on-surface-variant/70 text-sm px-4 text-center">
                No cover image
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-[#1e2741]">{book.title}</h1>
            <p className="text-[#697282] italic text-[15px] mt-2 font-serif capitalize">{book.genre}</p>
            <div className="mt-3 flex items-center gap-3">
              <p className="text-[#3b4a64] text-[15px]">Author: {authorName}</p>
              {canFollowAuthor && (
                <button
                  type="button"
                  onClick={handleFollowAuthor}
                  disabled={followLoading}
                  className="h-8 rounded-md border border-[#1e2741] px-3 text-xs font-semibold text-[#1e2741] transition hover:bg-[#f5f7fb] disabled:opacity-60"
                >
                  {followLoading ? "Please wait..." : isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            <section className="mt-6">
              <h2 className="text-xl font-bold text-[#1e2741]">Ratings</h2>
              {reviews.length ? (
                <p className="mt-2 text-[14px] text-[#3b4a64]">
                  {renderStars(averageRating)} ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                </p>
              ) : (
                <p className="mt-2 text-[14px] text-[#697282]">No ratings yet.</p>
              )}
            </section>

            <section className="mt-6">
              <h2 className="text-xl font-bold text-[#1e2741]">Comments & Reviews</h2>
              <div className="mt-4 space-y-3">
                {reviews.length ? (
                  reviews.map((review) => (
                    <article key={review.id} className="rounded-md border border-[#dbe3ef] bg-white px-4 py-3">
                      <p className="text-[13px] text-[#1e2741]">{renderStars(review.rating)}</p>
                      <p className="mt-2 text-[14px] text-[#1e2741]">{review.content?.trim() || "No written comment."}</p>
                      <p className="mt-2 text-[12px] text-[#697282]">
                        By {review.user?.name || review.user?.username || "Reader"}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-[14px] text-[#697282]">No comments or reviews yet.</p>
                )}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-bold text-[#1e2741]">
                {myReview ? "Edit Your Rating & Comment" : "Add Your Rating & Comment"}
              </h2>
              {canReview ? (
                <form className="mt-4 space-y-3" onSubmit={handleSubmitReview}>
                  <div>
                    <p className="text-[13px] text-[#3b4a64]">
                      Rating
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          aria-label={`Set rating to ${value} star${value > 1 ? "s" : ""}`}
                          className="text-2xl leading-none text-[#1e2741]"
                        >
                          {value <= rating ? "\u2605" : "\u2606"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="content" className="text-[13px] text-[#3b4a64]">
                      Comment
                    </label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="Write your review..."
                      className="mt-1 w-full rounded-md border border-[#dbe3ef] p-3 text-sm text-[#1e2741] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-[#1e2741] px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : myReview ? "Update Review" : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p className="mt-3 text-[14px] text-[#697282]">
                  Only verified users can add rating and comment.
                </p>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}


