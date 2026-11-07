'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi, SystemSettingsBundle } from '@/lib/api';
import {
  defaultProfil,
  defaultNotifikasi,
  defaultKeamanan,
  defaultLaporan,
  ProfilKoperasi,
  NotifikasiSettings,
  KeamananSettings,
  LaporanSettings,
} from '@/app/bo/pengaturan/types';
import { toast } from 'sonner';

export function usePengaturan() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<SystemSettingsBundle>({
    queryKey: ['bo-pengaturan'],
    queryFn: async () => {
      try {
        const res = await settingsApi.getAll();
        if (res.status === 'success' && res.data) {
          return {
            profil: { ...defaultProfil, ...res.data.profil },
            notifikasi: { ...defaultNotifikasi, ...res.data.notifikasi },
            keamanan: { ...defaultKeamanan, ...res.data.keamanan },
            laporan: { ...defaultLaporan, ...res.data.laporan },
          };
        }
      } catch (err) {
        console.warn('Gagal memuat pengaturan dari server, menggunakan default:', err);
      }
      return {
        profil: defaultProfil,
        notifikasi: defaultNotifikasi,
        keamanan: defaultKeamanan,
        laporan: defaultLaporan,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  const saveMutation = useMutation({
    mutationFn: async (bundle: Partial<SystemSettingsBundle>) => {
      const res = await settingsApi.updateAll(bundle);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal menyimpan pengaturan');
      }
      return res.data;
    },
    onSuccess: (updated) => {
      if (updated) {
        queryClient.setQueryData(['bo-pengaturan'], updated);
      }
      queryClient.invalidateQueries({ queryKey: ['bo-pengaturan'] });
      toast.success('Pengaturan sistem berhasil disimpan ke database!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Terjadi kesalahan saat menyimpan pengaturan');
    },
  });

  return {
    profil: data?.profil || defaultProfil,
    notifikasi: data?.notifikasi || defaultNotifikasi,
    keamanan: data?.keamanan || defaultKeamanan,
    laporan: data?.laporan || defaultLaporan,
    isLoading,
    refetch,
    saveSettings: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
  };
}
