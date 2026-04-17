"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { 
  fetchAuthorArticles, 
  fetchAuthorBooksPage, 
  fetchAuthorBooksCount, 
  fetchAuthorArticlesCount,
  AuthorArticle, 
  AuthorBook 
} from "@/src/lib/profile-stats-api";

export type UserRole = "reader" | "author";
export type TabType = 'Bookshelf' | 'Articles';

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  username?: string;
  bio?: string;
  interests?: string[];
  socialLinks?: string[];
  profilePicture?: string;
  profilePictureId?: string;
  followersCount?: number;
  followingCount?: number;
  bookCount?: number;
  articleCount?: number;
  isEmailVerified?: boolean;
  isLoggedIn?: boolean;
};

type AppStore = {
  user: AuthUser | null;
  followedAuthorsByUser: Record<string, string[]>;
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;

  // Profile specific state
  activeTab: TabType;
  books: AuthorBook[];
  articles: AuthorArticle[];
  loading: {
    books: boolean;
    moreBooks: boolean;
    articles: boolean;
  };
  booksPage: number;
  hasMoreBooks: boolean;
  articlesLoaded: boolean;

  setHydrated: (value: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (payload: Partial<AuthUser>) => void;
  setFollowedAuthors: (userId: string, authorIds: string[]) => void;
  addFollowedAuthor: (userId: string, authorId: string) => void;
  removeFollowedAuthor: (userId: string, authorId: string) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  clearAuth: () => void;
  resetStore: () => void;

  // Profile Actions
  setActiveTab: (tab: TabType) => void;
  fetchCounts: (userId: string) => Promise<void>;
  fetchBooks: (userId: string, targetPage?: number) => Promise<void>;
  fetchArticles: (userId: string) => Promise<void>;
};

const initialState: Omit<AppStore, "setHydrated" | "setUser" | "updateUser" | "setFollowedAuthors" | "addFollowedAuthor" | "removeFollowedAuthor" | "setLoading" | "setError" | "clearAuth" | "resetStore" | "setActiveTab" | "fetchCounts" | "fetchBooks" | "fetchArticles"> = {
  user: null,
  followedAuthorsByUser: {},
  hydrated: false,
  isLoading: false,
  error: null,
  activeTab: 'Bookshelf',
  books: [],
  articles: [],
  loading: {
    books: false,
    moreBooks: false,
    articles: false,
  },
  booksPage: 1,
  hasMoreBooks: true,
  articlesLoaded: false,
};

const sortNewest = (items: AuthorBook[]) =>
  [...items].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHydrated: (value) => set({ hydrated: value }),
      setUser: (user) => set({ user }),
      updateUser: (payload) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...payload } : state.user,
        })),
      setFollowedAuthors: (userId, authorIds) =>
        set((state) => ({
          followedAuthorsByUser: {
            ...state.followedAuthorsByUser,
            [userId]: Array.from(new Set(authorIds)),
          },
        })),
      addFollowedAuthor: (userId, authorId) =>
        set((state) => {
          const current = state.followedAuthorsByUser[userId] ?? [];
          if (current.includes(authorId)) return state;
          return {
            followedAuthorsByUser: {
              ...state.followedAuthorsByUser,
              [userId]: [...current, authorId],
            },
          };
        }),
      removeFollowedAuthor: (userId, authorId) =>
        set((state) => {
          const current = state.followedAuthorsByUser[userId] ?? [];
          return {
            followedAuthorsByUser: {
              ...state.followedAuthorsByUser,
              [userId]: current.filter((id) => id !== authorId),
            },
          };
        }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (message) => set({ error: message }),
      clearAuth: () => set({ user: null }),
      resetStore: () => set(initialState as any),

      // Profile Actions
      setActiveTab: (activeTab) => set({ activeTab }),

      fetchCounts: async (userId) => {
        try {
          const [bookCount, articleCount] = await Promise.all([
            fetchAuthorBooksCount(userId),
            fetchAuthorArticlesCount(userId),
          ]);
          set((state) => ({
            user: state.user ? { ...state.user, bookCount, articleCount } : state.user,
          }));
        } catch (error) {
          console.error("Failed to fetch counts:", error);
        }
      },

      fetchBooks: async (userId, targetPage = 1) => {
        const isFirstPage = targetPage === 1;
        set((state) => ({
          loading: {
            ...state.loading,
            [isFirstPage ? 'books' : 'moreBooks']: true,
          },
        }));

        try {
          const { books: newBooks, pagination } = await fetchAuthorBooksPage(userId, targetPage, 10);
          
          set((state) => {
            const combined = isFirstPage 
              ? newBooks 
              : [...state.books, ...newBooks.filter(b => !state.books.some(p => p.id === b.id))];
            
            return {
              books: sortNewest(combined),
              booksPage: targetPage,
              hasMoreBooks: pagination?.hasNextPage ?? false,
            };
          });
        } catch (error) {
          if (isFirstPage) set({ books: [] });
          console.error("Failed to fetch books:", error);
        } finally {
          set((state) => ({
            loading: {
              ...state.loading,
              books: false,
              moreBooks: false,
            },
          }));
        }
      },

      fetchArticles: async (userId) => {
        set((state) => ({
          loading: { ...state.loading, articles: true },
        }));

        try {
          const articles = await fetchAuthorArticles(userId);
          set({ articles, articlesLoaded: true });
        } catch (error) {
          console.error("Failed to fetch articles:", error);
        } finally {
          set((state) => ({
            loading: { ...state.loading, articles: false },
          }));
        }
      },
    }),
    {
      name: "penclub-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        followedAuthorsByUser: state.followedAuthorsByUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
