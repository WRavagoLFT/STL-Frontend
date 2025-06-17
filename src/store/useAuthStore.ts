// store/auth.ts
import { create } from 'zustand';
import { User } from '~/types/types';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoading: boolean, // <-- Add this

  userTypeId: number | null;
  setUserTypeId: (id: number) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) =>
  set({
    user,
    userTypeId: user?.UserTypeId ?? null,
    isLoading: false,
  }),
  clearUser: () =>
  set({
    user: null,
    userTypeId: null,
    isLoading: false,
  }),
  isLoading: true,
  userTypeId: null,
  setUserTypeId: (id) => set({ userTypeId: id }),
  reset: () => set({ userTypeId: null })
}));