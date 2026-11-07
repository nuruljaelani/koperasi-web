'use client';

import { useCallback } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore, type AuthUser, type UserRole } from '@/store/useAuthStore';

export type { AuthUser, UserRole };

export function useAuth() {
  const { user, isLoaded, setAuthSession, logout: storeLogout, updateUser } = useAuthStore();

  const login = useCallback(
    async (
      identifier: string,
      password: string
    ): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
      try {
        const res = await authApi.login({ identifier, password });

        if (res.status === 'success' && res.data) {
          const apiUser = res.data.user;
          const apiMember = res.data.member;
          const token = res.data.token?.accessToken || res.data.token || '';

          // Mapping role backend ke role frontend
          const appRole: UserRole =
            apiUser.role === 'member' ? 'anggota' : (apiUser.role as UserRole);

          const authUser: AuthUser = {
            id: apiUser.id,
            username: apiUser.username,
            role: appRole,
            anggotaId: apiMember?.id || apiUser.id,
            nama: apiMember?.nama_lengkap || apiMember?.namaLengkap || apiUser.username,
            phone: apiUser.phone,
            email: apiUser.email || undefined,
          };

          setAuthSession(token, authUser);
          return { success: true, role: appRole };
        } else {
          return {
            success: false,
            error: res.message || 'Gagal login. Periksa kembali data Anda.',
          };
        }
      } catch (err: any) {
        return {
          success: false,
          error: err.message || 'Terjadi kesalahan saat menghubungi server.',
        };
      }
    },
    [setAuthSession]
  );

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const updateIdentity = useCallback(
    (id: string, namaBaru: string) => {
      if (user && user.id === id) {
        updateUser({ nama: namaBaru });
      }
    },
    [user, updateUser]
  );

  const changePassword = useCallback(
    async (_id: string, _oldPw: string, _newPw: string): Promise<{ success: boolean; error?: string }> => {
      // Endpoint ganti password nanti via API
      return { success: true };
    },
    []
  );

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    role: user?.role ?? null,
    login,
    setAuthSession,
    logout,
    updateIdentity,
    changePassword,
  };
}
