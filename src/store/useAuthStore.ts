'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole = 'admin' | 'anggota' | 'staf' | 'operator' | 'superadmin' | 'member';

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
  anggotaId?: string;
  nama: string;
  phone?: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isLoaded: boolean;
  profileImages: Record<string, string>;
  setToken: (token: string) => void;
  setAuthSession: (token: string, user: AuthUser) => void;
  updateUser: (partial: Partial<AuthUser>) => void;
  setProfileImage: (userId: string, imageBase64: string) => void;
  logout: () => void;
  setLoaded: (isLoaded: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoaded: false,
      profileImages: {},

      setToken: (token: string) =>
        set({
          token,
        }),

      setAuthSession: (token: string, user: AuthUser) =>
        set({
          token,
          user,
          isLoaded: true,
        }),

      updateUser: (partial: Partial<AuthUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setProfileImage: (userId: string, imageBase64: string) =>
        set((state) => ({
          profileImages: {
            ...state.profileImages,
            [userId]: imageBase64,
          },
        })),

      logout: () =>
        set({
          token: null,
          user: null,
          isLoaded: true,
        }),

      setLoaded: (isLoaded: boolean) => set({ isLoaded }),
    }),
    {
      name: 'koperasi_auth_storage',
      storage: createJSONStorage(() => localStorage),
      // Saat Zustand selesai membaca dari localStorage di browser, set isLoaded = true
      onRehydrateStorage: () => (state) => {
        state?.setLoaded(true);
      },
    }
  )
);
