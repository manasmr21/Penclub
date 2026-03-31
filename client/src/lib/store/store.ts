"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthUser, PendingOtpUser } from "../auth";

type AppStore = {
  user: AuthUser | null;
  pendingOtpUser: PendingOtpUser | null;
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setHydrated: (value: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (payload: Partial<AuthUser>) => void;
  setPendingOtpUser: (user: PendingOtpUser | null) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  clearAuth: () => void;
  resetStore: () => void;
};

const initialState = {
  user: null,
  pendingOtpUser: null,
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
      setPendingOtpUser: (pendingOtpUser) => set({ pendingOtpUser }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (message) => set({ error: message }),
      clearAuth: () => set({ user: null, pendingOtpUser: null }),
      resetStore: () => set(initialState),
    }),
    {
      name: "penclub-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        pendingOtpUser: state.pendingOtpUser,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
