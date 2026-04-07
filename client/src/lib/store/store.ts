"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserRole = "reader" | "author";

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
  isEmailVerified?: boolean;
  isLoggedIn?: boolean;
};

type AppStore = {
  user: AuthUser | null;
  followedAuthorsByUser: Record<string, string[]>;
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
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
};

const initialState: Pick<AppStore, "user" | "followedAuthorsByUser" | "hydrated" | "isLoading" | "error"> = {
  user: null,
  followedAuthorsByUser: {},
  hydrated: false,
  isLoading: false,
  error: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
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
      resetStore: () => set(initialState),
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
