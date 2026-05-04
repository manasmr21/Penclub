"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useBookDetails } from "./useBookDetails";
import { BookHeader } from "@/src/components/book/BookHeader";
import { BookRating } from "@/src/components/book/BookRating";
import { BookReviews } from "@/src/components/book/BookReviews";
import Loader from "@/components/Loader";

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const from = useSearchParams().get("from");
  const backHref = from === "profile" ? "/profile" : "/bookshelf";
  const backLabel = from === "profile" ? "Back to profile" : "Back to bookshelf";

  const {
    book, reviews, authorName, loading,
    bookImageUrls, selectedImage, setSelectedImage,
    averageRating, roundedAverageRating,
    isFollowing, followLoading,
    myReview, reviewRating, reviewContent, reviewSubmitting,
    canReview, canFollowAuthor,
    setReviewRating, setReviewContent,
    handleFollowAuthor, handleSubmitReview,
  } = useBookDetails(bookId);

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!book) {
    return (
      <div className="main-container px-4 md:px-8 pt-28 pb-16">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          Book not found.
          <div className="mt-4">
            <Link href={backHref} className="font-medium text-primary underline">{backLabel}</Link>
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
        <BookHeader
          book={book}
          authorName={authorName}
          canFollowAuthor={canFollowAuthor}
          isFollowing={isFollowing}
          followLoading={followLoading}
          onFollowAuthor={handleFollowAuthor}
          imageUrls={bookImageUrls}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />
        <BookRating
          reviews={reviews}
          averageRating={averageRating}
          roundedAverageRating={roundedAverageRating}
        />
      </section>

      <BookReviews
        reviews={reviews}
        myReview={myReview}
        rating={reviewRating}
        content={reviewContent}
        submitting={reviewSubmitting}
        canReview={canReview}
        onRatingChange={setReviewRating}
        onContentChange={setReviewContent}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
