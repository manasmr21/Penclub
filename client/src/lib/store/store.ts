"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


type AppStore = {
  user: Object | null;
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setHydrated: (value: boolean) => void;
  setUser: (user: any | null) => void;
  updateUser: (payload: Partial<any>) => void;
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
