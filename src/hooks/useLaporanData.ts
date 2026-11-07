'use client';

import { useQuery } from '@tanstack/react-query';
import { laporanApi } from '@/lib/api';

export function useLaporanKolektibilitas() {
  return useQuery({
    queryKey: ['laporan-kolektibilitas'],
    queryFn: async () => {
      const res = await laporanApi.getKolektibilitas();
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan kolektibilitas');
    },
  });
}

export function useLaporanSentra() {
  return useQuery({
    queryKey: ['laporan-rekap-sentra'],
    queryFn: async () => {
      const res = await laporanApi.getRekapSentra();
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan rekap sentra');
    },
  });
}

export function useLaporanArusKas(query?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['laporan-arus-kas', query?.startDate, query?.endDate],
    queryFn: async () => {
      const res = await laporanApi.getArusKas(query);
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan arus kas');
    },
  });
}

export function useLaporanSHU(query?: {
  totalSHU?: number;
  persenJasaModal?: number;
  persenJasaUsaha?: number;
}) {
  return useQuery({
    queryKey: [
      'laporan-shu',
      query?.totalSHU,
      query?.persenJasaModal,
      query?.persenJasaUsaha,
    ],
    queryFn: async () => {
      const res = await laporanApi.getSHU(query);
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan SHU');
    },
  });
}

export function useLaporanSimpananBackend(query?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['laporan-simpanan-backend', query?.startDate, query?.endDate],
    queryFn: async () => {
      const res = await laporanApi.getSimpanan(query);
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan simpanan');
    },
  });
}

export function useLaporanPinjamanBackend(query?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: [
      'laporan-pinjaman-backend',
      query?.startDate,
      query?.endDate,
      query?.status,
    ],
    queryFn: async () => {
      const res = await laporanApi.getPinjaman(query);
      if (res.status === 'success') {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat laporan pinjaman');
    },
  });
}
