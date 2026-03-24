"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type AuthUser, type PendingOtpUser } from "@/src/lib/auth";

type AuthStore = {
  user: AuthUser | null;
  pendingOtpUser: PendingOtpUser | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setUser: (user: AuthUser | null) => void;
  setPendingOtpUser: (user: PendingOtpUser | null) => void;
  updateUser: (payload: Partial<AuthUser>) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      pendingOtpUser: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setUser: (user) => set({ user }),
      setPendingOtpUser: (pendingOtpUser) => set({ pendingOtpUser }),
      updateUser: (payload) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...payload } : state.user,
        })),
      clearAuth: () => set({ user: null, pendingOtpUser: null }),
    }),
    {
      name: "penclub-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
