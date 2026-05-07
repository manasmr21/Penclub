"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useBookDetails } from "./useBookDetails";
import { BookHeader } from "@/src/components/book/BookHeader";
import { BookRating } from "@/src/components/book/BookRating";
import { BookReviews } from "@/src/components/book/BookReviews";
import Loader from "@/components/Loader";

function BookDetailsSkeleton() {
  return (
    <div className="main-container px-4 md:px-8 pt-2 md:pt-12 pb-16 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-36 bg-primary/10 rounded-none mb-10" />

      <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Book Header Skeleton */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 w-full">
          {/* Cover image skeleton */}
          <div className="md:col-span-4 aspect-[2/3] w-full bg-primary/10 rounded-none border border-primary/5" />
          
          {/* Info skeleton */}
          <div className="md:col-span-8 space-y-4 pt-2">
            <div className="h-4 w-20 bg-primary/10 rounded-none" />
            <div className="h-8 w-3/4 bg-primary/10 rounded-none" />
            <div className="h-5 w-1/2 bg-primary/10 rounded-none" />
            <div className="space-y-2 pt-4">
              <div className="h-3 w-full bg-primary/10 rounded-none" />
              <div className="h-3 w-5/6 bg-primary/10 rounded-none" />
              <div className="h-3 w-4/5 bg-primary/10 rounded-none" />
            </div>
          </div>
        </div>

        {/* Book Rating Skeleton */}
        <div className="lg:col-span-4 p-6 bg-[#FAF9F5] border border-primary/10 rounded-none space-y-6 w-full">
          <div className="h-5 w-24 bg-primary/10 rounded-none" />
          <div className="flex items-baseline gap-2">
            <div className="h-10 w-12 bg-primary/10 rounded-none" />
            <div className="h-4 w-16 bg-primary/10 rounded-none" />
          </div>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="h-3 w-4 bg-primary/10 rounded-none" />
                <div className="flex-1 h-2 bg-primary/5 rounded-none" />
                <div className="h-3 w-8 bg-primary/10 rounded-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Reviews Skeleton */}
      <div className="mt-16 border-t border-primary/10 pt-10 space-y-6">
        <div className="h-6 w-32 bg-primary/10 rounded-none mb-6" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4 p-6 bg-[#FAF9F5] border border-primary/5 rounded-none">
            <div className="h-10 w-10 bg-primary/10 rounded-none" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-primary/10 rounded-none" />
                <div className="h-3 w-20 bg-primary/10 rounded-none" />
              </div>
              <div className="h-3 w-full bg-primary/10 rounded-none" />
              <div className="h-3 w-2/3 bg-primary/10 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BookDetailsPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const from = useSearchParams().get("from");
  const backHref = from === "profile" ? "/profile" : "/bookshelf";
  const backLabel = from === "profile" ? "Back to profile" : "Back to bookshelf";
  const router = useRouter();

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
    return <BookDetailsSkeleton />;
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
    <div className="main-container px-4 md:px-8 pt-2 md:pt-12 pb-16">
      <p
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition hover:-translate-x-1 cursor-pointer"
      >
        <span aria-hidden="true">&larr;</span>
        {backLabel}
      </p>

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
