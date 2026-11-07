'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export function useUserProfile() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ['auth-me', token],
    queryFn: async () => {
      const res = await authApi.getMe();
      if (res.status === 'success' && res.data) {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat profil user');
    },
    enabled: Boolean(token),
  });
}

export function useLoginMutation() {
  const setAuthSession = useAuthStore((s) => s.setAuthSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { identifier: string; password: string }) => {
      const res = await authApi.login(payload);
      if (res.status !== 'success' || !res.data) {
        throw new Error(res.message || 'Login gagal');
      }
      return res.data;
    },
    onSuccess: (data) => {
      const apiUser = data.user;
      const apiMember = data.member;
      const token = data.token?.accessToken || data.token || '';
      const appRole = apiUser.role === 'member' ? 'anggota' : apiUser.role;

      setAuthSession(token, {
        id: apiUser.id,
        username: apiUser.username,
        role: appRole,
        anggotaId: apiMember?.id || apiUser.id,
        nama: apiMember?.nama_lengkap || apiMember?.namaLengkap || apiUser.username,
        phone: apiUser.phone,
        email: apiUser.email || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
  });
}

export function useCekAktivasiMutation() {
  return useMutation({
    mutationFn: (payload: {
      identifier: string;
      noHp?: string;
      no_hp?: string;
      tanggalLahir?: string;
      tgl_lahir?: string;
    }) => authApi.cekAktivasi(payload),
  });
}

export function useVerifyOTPMutation() {
  return useMutation({
    mutationFn: (payload: {
      identifier: string;
      noHp?: string;
      no_hp?: string;
      otp: string;
    }) => authApi.verifyOTP(payload),
  });
}

export function useAktivasiMutation() {
  return useMutation({
    mutationFn: (payload: {
      identifier: string;
      noHp?: string;
      no_hp?: string;
      tanggalLahir?: string;
      tgl_lahir?: string;
      username: string;
      password: string;
      email?: string;
    }) => authApi.aktivasi(payload),
  });
}
