import { create } from "zustand";
import type { AuthorBook } from "@/src/lib/profile-stats-api";
import type { BookReview } from "@/src/lib/books-api";

type BookStore = {
  book: AuthorBook | null;
  reviews: BookReview[];
  authorName: string;
  loading: boolean;
  error: string | null;
  selectedImage: string | null;
  isFollowing: boolean;
  followLoading: boolean;
  reviewRating: number;
  reviewContent: string;
  reviewSubmitting: boolean;
  setBook: (book: AuthorBook | null) => void;
  setReviews: (reviews: BookReview[]) => void;
  setAuthorName: (name: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedImage: (url: string | null) => void;
  setIsFollowing: (value: boolean) => void;
  setFollowLoading: (value: boolean) => void;
  setReviewRating: (rating: number) => void;
  setReviewContent: (content: string) => void;
  setReviewSubmitting: (value: boolean) => void;
  resetBookStore: () => void;
};

const initialState = {
  book: null,
  reviews: [],
  authorName: "Unknown author",
  loading: true,
  error: null,
  selectedImage: null,
  isFollowing: false,
  followLoading: false,
  reviewRating: 0,
  reviewContent: "",
  reviewSubmitting: false,
};

export const useBookStore = create<BookStore>()((set) => ({
  ...initialState,
  setBook: (book) => set({ book }),
  setReviews: (reviews) => set({ reviews }),
  setAuthorName: (authorName) => set({ authorName }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedImage: (selectedImage) => set({ selectedImage }),
  setIsFollowing: (isFollowing) => set({ isFollowing }),
  setFollowLoading: (followLoading) => set({ followLoading }),
  setReviewRating: (reviewRating) => set({ reviewRating }),
  setReviewContent: (reviewContent) => set({ reviewContent }),
  setReviewSubmitting: (reviewSubmitting) => set({ reviewSubmitting }),
  resetBookStore: () => set(initialState),
}));
