// store/auth.ts
import { create } from 'zustand';
import { User } from '~/types/types';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;

  userTypeId: number | null;
  setUserTypeId: (id: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  userTypeId: null,
  setUserTypeId: (id) => set({ userTypeId: id }),
}));