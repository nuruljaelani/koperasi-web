'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boApi, pinjamanApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export interface JenisPinjaman {
  id: string;
  kode?: string;
  nama: string;
  sukuBunga: number;
  tipeBunga: 'Flat' | 'Menurun' | 'Anuitas';
  tenorMinimal?: number;
  tenorMaksimal: number;
  plafonMin?: number;
  plafonMax?: number;
  biayaAdmin: number;
  denda: number;
  deskripsi?: string;
  status: 'Aktif' | 'Tidak Aktif';
}

export interface UseJenisPinjamanOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface JenisPinjamanPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const formatTipeBunga = (raw: any): 'Flat' | 'Menurun' | 'Anuitas' => {
  const val = String(raw || '').toLowerCase();
  if (val === 'menurun') return 'Menurun';
  if (val === 'anuitas') return 'Anuitas';
  return 'Flat';
};

const mapItemToJenisPinjaman = (item: any): JenisPinjaman => ({
  id: item.id,
  kode: item.kode || '',
  nama: item.nama,
  sukuBunga: Number(item.suku_bunga_tahunan ?? item.sukuBungaTahunan ?? item.sukuBunga ?? 0),
  tipeBunga: formatTipeBunga(item.metode_bunga || item.metodeBunga || item.tipeBunga),
  tenorMinimal: Number(item.tenor_min_bulan ?? item.tenorMinBulan ?? item.tenorMinimal ?? 1),
  tenorMaksimal: Number(item.tenor_max_bulan ?? item.tenorMaxBulan ?? item.tenorMaksimal ?? 36),
  plafonMin: Number(item.plafon_min ?? item.plafonMin ?? 0),
  plafonMax: Number(item.plafon_max ?? item.plafonMax ?? 0),
  biayaAdmin: Number(item.biaya_admin_persen ?? item.biayaAdminPersen ?? item.biayaAdmin ?? 1),
  denda: Number(item.denda ?? 0.1),
  deskripsi: item.deskripsi || '',
  status: item.is_active !== false && item.status !== 'Tidak Aktif' ? 'Aktif' : 'Tidak Aktif',
});

export function useJenisPinjamanData(options?: UseJenisPinjamanOptions) {
  const queryClient = useQueryClient();

  const page = options?.page;
  const limit = options?.limit;
  const search = options?.search;
  const status = options?.status;

  const { data, isLoading } = useQuery({
    queryKey: ['master-jenis-pinjaman', page, limit, search, status],
    queryFn: async () => {
      const currentUser = useAuthStore.getState().user;
      const isBoStaff =
        currentUser && ['admin', 'superadmin', 'staf', 'operator'].includes(currentUser.role);

      const apiStatus =
        status === 'Aktif' ? 'active' : status === 'Tidak Aktif' ? 'inactive' : undefined;

      const queryParams: Record<string, any> = {};
      if (page !== undefined) queryParams.page = page;
      if (limit !== undefined) queryParams.limit = limit;
      if (search) queryParams.search = search.trim();
      if (apiStatus) queryParams.status = apiStatus;

      if (isBoStaff) {
        try {
          const res = await boApi.getJenisPinjaman(queryParams);
          if (res.status === 'success' && res.data) {
            const rawItems = Array.isArray(res.data)
              ? res.data
              : (res.data as any)?.items || [];
            const items = rawItems.map(mapItemToJenisPinjaman);

            const paginationMeta = (res as any)?.meta || (res.data as any)?.pagination;

            return {
              items,
              pagination: paginationMeta
                ? {
                    page: Number(paginationMeta.page) || page || 1,
                    limit: Number(paginationMeta.limit) || limit || 10,
                    total: Number(paginationMeta.total) || items.length,
                    totalPages: Number(paginationMeta.totalPages) || 1,
                  }
                : null,
            };
          }
        } catch (err) {
          console.warn('Gagal memuat master jenis pinjaman dari boApi, fallback ke pinjamanApi:', err);
        }
      }

      try {
        const res = await pinjamanApi.getJenis();
        if (res.status === 'success' && Array.isArray(res.data)) {
          const items = res.data.map(mapItemToJenisPinjaman);
          return {
            items,
            pagination: null,
          };
        }
      } catch (fallbackErr) {
        console.warn('Fallback pinjamanApi juga gagal:', fallbackErr);
      }

      return {
        items: [] as JenisPinjaman[],
        pagination: null,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: Omit<JenisPinjaman, 'id'>) => {
      const res = await boApi.createJenisPinjaman({
        kode: payload.kode || undefined,
        nama: payload.nama,
        metodeBunga: (payload.tipeBunga || 'Flat').toLowerCase(),
        sukuBungaTahunan: payload.sukuBunga,
        tenorMaxBulan: payload.tenorMaksimal,
        biayaAdminPersen: payload.biayaAdmin,
        denda: payload.denda,
        isActive: payload.status ? payload.status === 'Aktif' : true,
        status: payload.status || 'Aktif',
      });
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal menambahkan jenis pinjaman');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-jenis-pinjaman'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JenisPinjaman> }) => {
      const res = await boApi.updateJenisPinjaman(id, {
        kode: data.kode || undefined,
        nama: data.nama,
        metodeBunga: data.tipeBunga ? data.tipeBunga.toLowerCase() : undefined,
        sukuBungaTahunan: data.sukuBunga,
        tenorMaxBulan: data.tenorMaksimal,
        biayaAdminPersen: data.biayaAdmin,
        denda: data.denda,
        isActive: data.status ? data.status === 'Aktif' : undefined,
      });
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal memperbarui jenis pinjaman');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-jenis-pinjaman'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await boApi.deleteJenisPinjaman(id);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal menghapus jenis pinjaman');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-jenis-pinjaman'] });
    },
  });

  const dataList: JenisPinjaman[] = data?.items || [];
  const pagination: JenisPinjamanPagination = data?.pagination || {
    page: page || 1,
    limit: limit || 10,
    total: dataList.length,
    totalPages: 1,
  };
  const isLoaded = !isLoading;

  const getData = (id: string) => {
    return dataList.find((a) => a.id === id);
  };

  const addData = async (item: Omit<JenisPinjaman, 'id'>) => {
    return await createMutation.mutateAsync(item);
  };

  const updateData = async (id: string, updated: Partial<JenisPinjaman>) => {
    return await updateMutation.mutateAsync({ id, data: updated });
  };

  const deleteData = async (id: string) => {
    return await deleteMutation.mutateAsync(id);
  };

  return {
    dataList,
    pagination,
    isLoaded,
    isLoading,
    addData,
    updateData,
    deleteData,
    getData,
  };
}
