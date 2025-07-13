import { create } from 'zustand';
import { UsersItem } from '@/lib/api/users/users.service';

interface AuthState {
  user: UsersItem | null;
  userValidated: boolean;
  isLoading: boolean;
  userTypeId: number | null;
  setUser: (user: UsersItem) => void;
  clearUser: () => void;
  setUserTypeId: (id: number) => void;
  setUserValidated: (valid: boolean) => void;
  reset: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userValidated: false,
  isLoading: true,
  userTypeId: null,
  setUser: (user) => set({
    user,
    userTypeId: user.UserTypeId,
    isLoading: false,
    userValidated: true,
  }),
  clearUser: () => set({
    user: null,
    userTypeId: null,
    isLoading: false,
    userValidated: false,
  }),
  setUserTypeId: (id) => set({ userTypeId: id }),
  setUserValidated: (valid) => set({ userValidated: valid }),
  reset: () => set({
    user: null,
    userTypeId: null,
    isLoading: false,
    userValidated: false,
  }),
    logout: () =>
    set({
      user: null,
      userTypeId: null,
      isLoading: false,
    }),
}));
