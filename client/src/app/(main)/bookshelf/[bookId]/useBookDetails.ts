import { type FormEvent, useEffect, useMemo } from "react";
import { useAppStore } from "@/src/lib/store/store";
import { useBookStore } from "@/src/lib/store/bookStore";
import { followAuthor } from "@/src/lib/auth-api";
import {
  createBookReview,
  fetchAuthorNameById,
  fetchBookById,
  fetchReviewsByBook,
  updateBookReview,
} from "@/src/lib/books-api";

export function useBookDetails(bookId: string | undefined) {
  const user = useAppStore((s) => s.user);
  const updateUser = useAppStore((s) => s.updateUser);
  const followedAuthorsByUser = useAppStore((s) => s.followedAuthorsByUser);
  const addFollowedAuthor = useAppStore((s) => s.addFollowedAuthor);
  const removeFollowedAuthor = useAppStore((s) => s.removeFollowedAuthor);

  const book = useBookStore((s) => s.book);
  const reviews = useBookStore((s) => s.reviews);
  const authorName = useBookStore((s) => s.authorName);
  const loading = useBookStore((s) => s.loading);
  const selectedImage = useBookStore((s) => s.selectedImage);
  const isFollowing = useBookStore((s) => s.isFollowing);
  const followLoading = useBookStore((s) => s.followLoading);
  const reviewRating = useBookStore((s) => s.reviewRating);
  const reviewContent = useBookStore((s) => s.reviewContent);
  const reviewSubmitting = useBookStore((s) => s.reviewSubmitting);

  const {
    setBook, setReviews, setAuthorName, setLoading,
    setSelectedImage, setIsFollowing, setFollowLoading,
    setReviewRating, setReviewContent, setReviewSubmitting,
    resetBookStore,
  } = useBookStore.getState();

  const bookImageUrls = useMemo<string[]>(() => {
    if (!book) return [];
    const urls = (book.images ?? []).map((img) => img?.url).filter((url): url is string => Boolean(url));
    if (book.coverImage && !urls.includes(book.coverImage)) return [book.coverImage, ...urls];
    return urls;
  }, [book]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const roundedAverageRating = useMemo(() => Math.round(averageRating * 10) / 10, [averageRating]);

  const myReview = useMemo(
    () => (user?.id ? (reviews.find((r) => r.user?.id === user.id) ?? null) : null),
    [reviews, user?.id],
  );

  const canReview = Boolean(user?.isEmailVerified);
  const canFollowAuthor = Boolean(
    user && user.role === "reader" && book?.authorId && user.id !== book.authorId,
  );

  useEffect(() => {
    resetBookStore();
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [bookData, reviewData] = await Promise.all([fetchBookById(bookId), fetchReviewsByBook(bookId)]);
        setBook(bookData);
        setReviews(reviewData);

        const directName = bookData?.author?.name?.trim() || bookData?.author?.username?.trim();
        if (directName) return setAuthorName(directName);

        if (bookData?.authorId && user?.id === bookData.authorId) {
          const ownName = user.name?.trim() || user.username?.trim();
          if (ownName) return setAuthorName(ownName);
        }

        if (bookData?.authorId) {
          const resolved = await fetchAuthorNameById(bookData.authorId);
          return setAuthorName(resolved ?? "Unknown author");
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
    void load();
  }, [bookId, user?.id, user?.name, user?.username]);

  useEffect(() => {
    if (myReview) {
      setReviewRating(myReview.rating || 0);
      setReviewContent(myReview.content ?? "");
    }
  }, [myReview]);

  useEffect(() => {
    if (!user?.id || !book?.authorId) return;
    const followed = followedAuthorsByUser[user.id] ?? [];
    setIsFollowing(followed.includes(book.authorId));
  }, [user?.id, book?.authorId, followedAuthorsByUser]);

  useEffect(() => {
    setSelectedImage(bookImageUrls[0] ?? null);
  }, [bookImageUrls]);

  const handleFollowAuthor = async () => {
    if (!book?.authorId || !canFollowAuthor || !user?.id) return;
    try {
      setFollowLoading(true);
      const res = await followAuthor(book.authorId);
      const msg = String(res?.message ?? "").toLowerCase();
      if (msg.includes("unfollowed")) {
        setIsFollowing(false);
        removeFollowedAuthor(user.id, book.authorId);
        updateUser({ followingCount: Math.max(0, (user.followingCount ?? 0) - 1) });
      } else if (msg.includes("followed")) {
        setIsFollowing(true);
        addFollowedAuthor(user.id, book.authorId);
        updateUser({ followingCount: (user.followingCount ?? 0) + 1 });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to follow author.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!bookId || !canReview) return;
    if (reviewRating < 1) { alert("Please select a star rating before submitting."); return; }
    try {
      setReviewSubmitting(true);
      if (myReview?.id) {
        await updateBookReview(myReview.id, { rating: reviewRating, content: reviewContent.trim() || undefined });
      } else {
        await createBookReview({ bookId, rating: reviewRating, content: reviewContent.trim() || undefined });
      }
      setReviews(await fetchReviewsByBook(bookId));
      if (!myReview?.id) { setReviewContent(""); setReviewRating(0); }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Unable to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return {
    book, reviews, authorName, loading,
    bookImageUrls, selectedImage, setSelectedImage,
    averageRating, roundedAverageRating,
    isFollowing, followLoading,
    myReview, reviewRating, reviewContent, reviewSubmitting,
    canReview, canFollowAuthor,
    setReviewRating, setReviewContent,
    handleFollowAuthor, handleSubmitReview,
  };
}
