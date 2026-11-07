'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pinjamanApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { PinjamanStatus, DokumenPersyaratan } from '@/store/usePinjamanStore';

export type { PinjamanStatus, DokumenPersyaratan };

export interface Pinjaman {
  id: string;
  nomorPinjaman: string;
  anggotaId: string;
  namaAnggota?: string;
  nomorAnggota?: string;
  jenisPinjamanId: string;
  namaJenisPinjaman?: string;
  jumlahPengajuan: number;
  tenor: number;
  tanggalPengajuan: string;
  tujuanPinjaman: string;
  status: PinjamanStatus;
  dokumenPersyaratan: DokumenPersyaratan[];
  catatanAdmin: string;
}

export interface PinjamanPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsePinjamanParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jenisPinjamanId?: string;
  startDate?: string;
  endDate?: string;
}

const mapBackendStatus = (status: string): PinjamanStatus => {
  switch (status?.toLowerCase()) {
    case 'disetujui':
      return 'Disetujui';
    case 'cair':
    case 'aktif':
    case 'dicairkan':
      return 'Cair';
    case 'lunas':
      return 'Lunas';
    case 'ditolak':
      return 'Ditolak';
    case 'diajukan':
    case 'review':
    case 'menunggu':
      return 'Review';
    default:
      return 'Draft';
  }
};

const parseDokumen = (val: any): DokumenPersyaratan[] => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [{ jenis: 'Dokumen', namaFile: 'Lampiran', url: val }];
    }
  }
  return [];
};

export function usePinjamanData(params?: UsePinjamanParams) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const isBackOffice =
    user?.role === 'superadmin' ||
    user?.role === 'admin' ||
    user?.role === 'operator' ||
    user?.role === 'staf';

  // 1. Query Back Office: Seluruh Pengajuan Pinjaman dengan serverside pagination & filter
  const { data: boData, isLoading: boLoading } = useQuery({
    queryKey: [
      'bo-all-pinjaman',
      params?.page,
      params?.limit,
      params?.search,
      params?.status,
      params?.jenisPinjamanId,
      params?.startDate,
      params?.endDate,
    ],
    queryFn: async () => {
      if (!isAuthenticated || !isBackOffice) return null;
      try {
        const res = await pinjamanApi.getAllPengajuan({
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          status: params?.status,
          jenisPinjamanId: params?.jenisPinjamanId,
          startDate: params?.startDate,
          endDate: params?.endDate,
        });

        if (res.status === 'success' && res.data) {
          const rawItems = Array.isArray(res.data) ? res.data : (res.data.items || []);
          const items: Pinjaman[] = rawItems.map((item: any) => ({
            id: item.id,
            nomorPinjaman: item.nomor_pinjaman || item.nomorPinjaman || `PJ-${item.id.slice(0, 6)}`,
            anggotaId: item.member_id || item.memberId || item.member?.id || '',
            namaAnggota: item.member?.nama_lengkap || item.namaAnggota || '',
            nomorAnggota: item.member?.no_anggota || item.nomorAnggota || '',
            jenisPinjamanId: item.jenis_pinjaman_id || item.jenis?.id || item.jenisPinjamanId || '',
            namaJenisPinjaman: item.jenis?.nama || item.namaJenisPinjaman || '',
            jumlahPengajuan: Number(item.jumlah_pinjaman || item.jumlahPengajuan || 0),
            tenor: Number(item.tenor_bulan || item.tenor || 12),
            tanggalPengajuan: item.created_at || item.tanggalPengajuan || new Date().toISOString(),
            tujuanPinjaman: item.tujuan_pinjaman || item.tujuanPinjaman || '',
            status: mapBackendStatus(item.status),
            dokumenPersyaratan: parseDokumen(item.dokumen_pendukung || item.dokumen_persyaratan || item.dokumenPersyaratan),
            catatanAdmin: item.catatan_review || item.catatanAdmin || '',
          }));

          const pagination: PinjamanPagination = res.meta || res.data.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: items.length,
            totalPages: Math.ceil(items.length / (params?.limit || 10)),
          };

          return { items, pagination };
        }
      } catch (err) {
        console.warn('Gagal memuat daftar pinjaman backoffice dari API:', err);
      }
      return null;
    },
    enabled: isAuthenticated && isBackOffice,
  });

  // 2. Query Member: Pinjaman Pribadi
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['my-pinjaman', user?.id],
    queryFn: async () => {
      if (!isAuthenticated || isBackOffice) return [] as Pinjaman[];
      try {
        const res = await pinjamanApi.getMyPinjaman();
        if (res.status === 'success' && Array.isArray(res.data)) {
          return res.data.map((item: any) => ({
            id: item.id,
            nomorPinjaman: item.nomor_pinjaman || item.nomorPinjaman || `PJ-${item.id.slice(0, 6)}`,
            anggotaId: item.member_id || item.memberId || user?.anggotaId || '',
            jenisPinjamanId: item.jenis_pinjaman_id || item.jenis?.id || item.jenisPinjamanId || '',
            jumlahPengajuan: Number(item.jumlah_pinjaman || item.jumlahPengajuan || 0),
            tenor: Number(item.tenor_bulan || item.tenor || 12),
            tanggalPengajuan: item.created_at || item.tanggalPengajuan || new Date().toISOString(),
            tujuanPinjaman: item.tujuan_pinjaman || item.tujuanPinjaman || '',
            status: mapBackendStatus(item.status),
            dokumenPersyaratan: parseDokumen(item.dokumen_pendukung || item.dokumen_persyaratan || item.dokumenPersyaratan),
            catatanAdmin: item.catatan_review || item.catatanAdmin || '',
          })) as Pinjaman[];
        }
      } catch (err) {
        console.warn('Gagal memuat daftar pinjaman dari API:', err);
      }
      return [] as Pinjaman[];
    },
    enabled: isAuthenticated && !isBackOffice,
  });

  const ajukanMutation = useMutation({
    mutationFn: async (payload: {
      jenisPinjamanId: string;
      jumlahPengajuan: number;
      tenor: number;
      tujuanPinjaman: string;
      dokumenPersyaratan?: any[];
    }) => {
      const res = await pinjamanApi.ajukan({
        jenisPinjamanId: payload.jenisPinjamanId,
        jumlahPinjaman: payload.jumlahPengajuan,
        tenorBulan: payload.tenor,
        tujuanPinjaman: payload.tujuanPinjaman,
        dokumenPendukung: payload.dokumenPersyaratan,
      });
      if (res.status !== 'success') {
        throw new Error(res.message || 'Gagal mengajukan pinjaman');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pinjaman'] });
      queryClient.invalidateQueries({ queryKey: ['bo-all-pinjaman'] });
    },
  });

  const dataList: Pinjaman[] = isBackOffice
    ? boData?.items || []
    : memberData || [];

  const pagination = boData?.pagination;
  const isLoaded = isBackOffice ? !boLoading : !memberLoading;
  const isLoading = isBackOffice ? boLoading : memberLoading;

  const getByAnggotaId = (anggotaId: string) => {
    if (!anggotaId) return dataList;
    return dataList.filter((a) => !a.anggotaId || a.anggotaId === anggotaId);
  };

  const addData = async (item: Omit<Pinjaman, 'id' | 'nomorPinjaman'>) => {
    return await ajukanMutation.mutateAsync({
      jenisPinjamanId: item.jenisPinjamanId,
      jumlahPengajuan: item.jumlahPengajuan,
      tenor: item.tenor,
      tujuanPinjaman: item.tujuanPinjaman,
      dokumenPersyaratan: item.dokumenPersyaratan,
    });
  };

  const updateData = (_id: string, _updated: Omit<Pinjaman, 'id'>) => {
    // Implementasi update pinjaman jika ada
  };

  const deleteData = (_id: string) => {
    // Implementasi delete pinjaman jika ada
  };

  return {
    dataList,
    pagination,
    isLoaded,
    isLoading,
    addData,
    updateData,
    deleteData,
    getByAnggotaId,
    isSubmitting: ajukanMutation.isPending,
  };
}
