'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boApi, authApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Anggota } from '@/store/useAnggotaStore';

export type { Anggota };

export interface UseAnggotaDataOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface AnggotaPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const mapItemToAnggota = (m: any): Anggota => {
  const rawStatus = m.statusKeanggotaan || m.status_keanggotaan || m.status || '';
  const isActive = rawStatus === 'active' || rawStatus === 'aktif' || rawStatus === 'Aktif';

  const rawJk = m.jenisKelamin || m.jenis_kelamin || '';
  const isLaki = rawJk === 'L' || rawJk === 'Laki-laki';

  return {
    id: m.id,
    nomorAnggota: m.noAnggota || m.no_anggota || m.nomorAnggota || `A-${String(m.id).slice(0, 4)}`,
    nik: m.nik || '',
    nama: m.namaLengkap || m.nama_lengkap || m.nama || '',
    nomorHp: m.noHp || m.no_hp || m.phone || m.nomorHp || '',
    alamat: m.alamat || '',
    tanggalLahir: m.tanggalLahir || m.tanggal_lahir || '',
    jenisKelamin: isLaki ? 'Laki-laki' : 'Perempuan',
    status: isActive ? 'Aktif' : 'Tidak Aktif',
    fotoProfil: m.foto_profil || m.fotoProfil || '',
  };
};

export function useAnggotaData(options?: UseAnggotaDataOptions) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const isBackOffice =
    user?.role === 'superadmin' ||
    user?.role === 'admin' ||
    user?.role === 'operator' ||
    user?.role === 'staf';

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 10;
  const search = options?.search ?? '';
  const status = options?.status ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['anggota-list', user?.role, user?.id, page, limit, search, status],
    queryFn: async () => {
      if (!isAuthenticated) {
        return {
          items: [] as Anggota[],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        };
      }

      // Jika role adalah staf/operator/admin/superadmin, ambil data anggota dari back office API
      if (isBackOffice) {
        try {
          const apiStatus =
            status === 'Aktif'
              ? 'active'
              : status === 'Tidak Aktif'
              ? 'inactive'
              : status || undefined;

          const res = await boApi.getAnggota({
            page,
            limit,
            search: search.trim() || undefined,
            status: apiStatus,
          });

          if (res.status === 'success' && res.data) {
            const rawItems = Array.isArray(res.data)
              ? res.data
              : (res.data as any)?.items || [];
            const items = rawItems.map(mapItemToAnggota);

            const paginationMeta = (res as any)?.meta || {
              page,
              limit,
              total: items.length,
              totalPages: Math.max(1, Math.ceil(items.length / limit)),
            };

            return {
              items,
              pagination: {
                page: Number(paginationMeta.page) || page,
                limit: Number(paginationMeta.limit) || limit,
                total: Number(paginationMeta.total) || items.length,
                totalPages: Number(paginationMeta.totalPages) || 1,
              },
            };
          }
          console.warn('boApi.getAnggota returned non-success:', res?.message);
        } catch (err) {
          console.warn('Gagal memuat daftar anggota dari boApi:', err);
        }
      } else {
        // Jika role adalah member, ambil profil dirinya dari authApi.getMe
        try {
          const res = await authApi.getMe();
          if (res.status === 'success' && res.data) {
            const m = res.data.member || res.data.user;
            if (m) {
              const mapped = mapItemToAnggota(m);
              return {
                items: [mapped],
                pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
              };
            }
          }
        } catch (err) {
          console.warn('Gagal memuat profil anggota dari authApi:', err);
        }
      }

      // Fallback profil user login jika ada (khusus member view)
      if (user && !isBackOffice) {
        const fallbackUser: Anggota = {
          id: user.anggotaId || user.id,
          nomorAnggota: 'A-1001',
          nik: '',
          nama: user.nama || user.username,
          nomorHp: user.phone || '',
          alamat: '',
          tanggalLahir: '',
          jenisKelamin: 'Laki-laki',
          status: 'Aktif',
        };
        return {
          items: [fallbackUser],
          pagination: { page: 1, limit: 1, total: 1, totalPages: 1 },
        };
      }

      return {
        items: [] as Anggota[],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    },
    enabled: isAuthenticated,
  });

  const anggotaList: Anggota[] = data?.items || [];
  const pagination: AnggotaPagination = data?.pagination || {
    page,
    limit,
    total: anggotaList.length,
    totalPages: 1,
  };
  const isLoaded = !isLoading;

  const createAnggotaMutation = useMutation({
    mutationFn: async (payload: Omit<Anggota, 'id'>) => {
      const res = await boApi.createAnggota({
        no_anggota: payload.nomorAnggota || undefined,
        nik: payload.nik,
        nama_lengkap: payload.nama,
        no_hp: payload.nomorHp,
        jenis_kelamin: payload.jenisKelamin === 'Laki-laki' ? 'L' : 'P',
        alamat: payload.alamat,
        tanggal_lahir: payload.tanggalLahir || undefined,
        status_keanggotaan: payload.status === 'Aktif' ? 'active' : 'inactive',
      });
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal mendaftarkan anggota');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] });
    },
  });

  const updateAnggotaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Anggota> }) => {
      const res = await boApi.updateAnggota(id, {
        nik: data.nik,
        nama_lengkap: data.nama,
        no_hp: data.nomorHp,
        jenis_kelamin: data.jenisKelamin ? (data.jenisKelamin === 'Laki-laki' ? 'L' : 'P') : undefined,
        alamat: data.alamat,
        tanggal_lahir: data.tanggalLahir || undefined,
        status_keanggotaan: data.status ? (data.status === 'Aktif' ? 'active' : 'inactive') : undefined,
      });
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal memperbarui data anggota');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await boApi.updateStatusAnggota(id, status);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal memperbarui status anggota');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] });
    },
  });

  const deleteAnggotaMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await boApi.deleteAnggota(id);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal menghapus anggota');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anggota-list'] });
    },
  });

  const getAnggota = useCallback(
    (id: string) => {
      return anggotaList.find((a) => a.id === id) || null;
    },
    [anggotaList]
  );

  const addAnggota = async (item: Omit<Anggota, 'id'>) => {
    return await createAnggotaMutation.mutateAsync(item);
  };

  const updateAnggota = async (id: string, updated: Omit<Anggota, 'id'>) => {
    await updateAnggotaMutation.mutateAsync({ id, data: updated });
    if (updated.status) {
      const backendStatus = updated.status === 'Aktif' ? 'active' : 'inactive';
      await updateStatusMutation.mutateAsync({ id, status: backendStatus });
    }
  };

  const updateStatus = async (id: string, status: string) => {
    return await updateStatusMutation.mutateAsync({ id, status });
  };

  const deleteAnggota = async (id: string) => {
    return await deleteAnggotaMutation.mutateAsync(id);
  };

  return {
    anggotaList,
    dataList: anggotaList,
    pagination,
    isLoaded,
    isLoading,
    addAnggota,
    updateAnggota,
    updateStatus,
    deleteAnggota,
    getAnggota,
  };
}

export function useAnggotaDetail(id: string) {
  return useQuery({
    queryKey: ['anggota-detail', id],
    queryFn: async () => {
      const res = await boApi.getAnggotaDetail(id);
      if (res.status === 'success' && res.data) {
        return mapItemToAnggota(res.data);
      }
      return null;
    },
    enabled: Boolean(id),
  });
}

