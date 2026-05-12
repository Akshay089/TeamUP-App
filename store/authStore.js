import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isGuest: false,

  setUser: (user) => set({ user }),
  setIsGuest: (value) => set({ isGuest: value }),
  logout: () => set({ user: null, isGuest: false }),
}));
