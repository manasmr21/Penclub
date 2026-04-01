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
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setHydrated: (value: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (payload: Partial<AuthUser>) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  clearAuth: () => void;
  resetStore: () => void;
};

const initialState: Pick<AppStore, "user" | "hydrated" | "isLoading" | "error"> = {
  user: null,
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
      setLoading: (value) => set({ isLoading: value }),
      setError: (message) => set({ error: message }),
      clearAuth: () => set({ user: null }),
      resetStore: () => set(initialState),
    }),
    {
      name: "penclub-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
