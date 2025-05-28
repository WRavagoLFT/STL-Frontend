import { create } from 'zustand'

interface AuthStore {
    email: string
    resetToken: string
    setEmail: (email: string) => void
    setResetToken: (resetToken: string) => void
    clearAuthStore: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    email: '',
    setEmail: (email: string) => set((state) => ({ ...state, email })),

    resetToken: '',
    setResetToken: (resetToken: string) => set((state) => ({ ...state, resetToken })),

    clearAuthStore: () => set({ email: '', resetToken: '' }),
}))