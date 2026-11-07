'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simpananApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { SimpananJenis } from '@/store/useSimpananStore';

export type { SimpananJenis };

export interface Simpanan {
  id: string;
  kodeTransaksi?: string;
  anggotaId: string;
  namaAnggota?: string;
  nomorAnggota?: string;
  rekeningId?: string;
  nomorRekening?: string;
  jenis: SimpananJenis;
  jumlah: number;
  saldo?: number;
  saldoAwal?: number;
  tanggal: string;
  keterangan: string;
  tipe: 'Setoran' | 'Penarikan';
  status: 'Selesai' | 'Menunggu' | 'Ditolak';
  metodePembayaran?: 'tunai' | 'transfer';
  operator?: string;
}

export interface SimpananSummary {
  totalSetor: number;
  totalTarik: number;
  totalSaldo: number;
  totalTransaksi: number;
}

const mapTipeToJenis = (rawTipe: string = ''): SimpananJenis => {
  const t = rawTipe.toLowerCase();
  if (t.includes('pokok')) return 'Pokok';
  if (t.includes('wajib')) return 'Wajib';
  return 'Sukarela';
};

export interface SimpananPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UseSimpananParams {
  page?: number;
  limit?: number;
  search?: string;
  jenisMutasi?: string;
  tipe?: string;
  startDate?: string;
  endDate?: string;
}

export function useSimpananData(params?: UseSimpananParams) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const isBackOffice =
    user?.role === 'superadmin' ||
    user?.role === 'admin' ||
    user?.role === 'operator' ||
    user?.role === 'staf';

  // 1. Query Back Office: Seluruh Transaksi Simpanan
  const { data: boData, isLoading: boLoading } = useQuery({
    queryKey: [
      'all-simpanan-transaksi',
      user?.role,
      params?.page,
      params?.limit,
      params?.search,
      params?.jenisMutasi,
      params?.tipe,
      params?.startDate,
      params?.endDate,
    ],
    queryFn: async () => {
      if (!isAuthenticated || !isBackOffice) return null;
      try {
        const res = await simpananApi.getAllTransaksi({
          page: params?.page || 1,
          limit: params?.limit || 10,
          search: params?.search,
          jenisMutasi: params?.jenisMutasi,
          tipe: params?.tipe,
          startDate: params?.startDate,
          endDate: params?.endDate,
        });
        if (res.status === 'success' && res.data) {
          const rawItems = res.data.items || [];
          const items: Simpanan[] = rawItems.map((item: any) => ({
            id: item.id,
            kodeTransaksi: item.kodeTransaksi,
            anggotaId: item.anggota?.id || '',
            namaAnggota: item.anggota?.namaLengkap || '-',
            nomorAnggota: item.anggota?.noAnggota || '-',
            rekeningId: item.rekeningId,
            nomorRekening: item.nomorRekening,
            jenis: mapTipeToJenis(item.jenisSimpanan?.tipe || item.jenisSimpanan?.nama),
            jumlah: Number(item.nominal || 0),
            saldo: Number(item.saldoAkhir || 0),
            saldoAwal: Number(item.saldoAwal || 0),
            tanggal: item.tanggalTransaksi || item.created_at || new Date().toISOString(),
            keterangan: item.keterangan || '-',
            tipe: item.jenisMutasi === 'setor' ? 'Setoran' : 'Penarikan',
            status: 'Selesai',
            metodePembayaran: item.metodePembayaran || 'tunai',
            operator: item.operator?.username || 'Kasir',
          }));

          const pagination: SimpananPagination = res.meta || res.data.pagination || {
            page: params?.page || 1,
            limit: params?.limit || 10,
            total: items.length,
            totalPages: Math.ceil(items.length / (params?.limit || 10)),
          };

          return { items, ringkasan: res.data.ringkasan as SimpananSummary, pagination };
        }
      } catch (err) {
        console.warn('Gagal memuat semua transaksi simpanan dari API:', err);
      }
      return null;
    },
    enabled: isAuthenticated && isBackOffice,
  });

  // 2. Query Member: Rekening Milik Sendiri
  const { data: memberData, isLoading: memberLoading } = useQuery({
    queryKey: ['my-simpanan-rekening', user?.id],
    queryFn: async () => {
      if (!isAuthenticated || isBackOffice) return [] as Simpanan[];
      try {
        const res = await simpananApi.getMyRekening();
        if (res.status === 'success' && Array.isArray(res.data)) {
          return res.data.map((item: any) => ({
            id: item.id,
            rekeningId: item.id,
            nomorRekening: item.nomor_rekening,
            anggotaId: user?.anggotaId || user?.id || '',
            jenis: mapTipeToJenis(item.jenis?.tipe || item.jenis?.nama),
            jumlah: Number(item.saldo || 0),
            saldo: Number(item.saldo || 0),
            tanggal: item.created_at || new Date().toISOString(),
            keterangan: `Rekening ${item.nomor_rekening || item.id}`,
            tipe: 'Setoran' as const,
            status: item.status === 'aktif' ? 'Selesai' : 'Menunggu',
          })) as Simpanan[];
        }
      } catch (err) {
        console.warn('Gagal memuat rekening simpanan pribadi dari API:', err);
      }
      return [] as Simpanan[];
    },
    enabled: isAuthenticated && !isBackOffice,
  });

  // 3. Mutasi Transaksi Simpanan
  const transaksiMutation = useMutation({
    mutationFn: async (payload: {
      rekeningId?: string;
      memberId?: string;
      jenisSimpananId?: string;
      jenisMutasi: 'setor' | 'tarik';
      nominal: number;
      keterangan?: string;
      metodePembayaran?: 'tunai' | 'transfer';
      buktiPembayaran?: string;
    }) => {
      const res = await simpananApi.transaksi(payload);
      if (res.status !== 'success') {
        throw new Error(res.message || 'Transaksi simpanan gagal');
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-simpanan-transaksi'] });
      queryClient.invalidateQueries({ queryKey: ['my-simpanan-rekening'] });
      queryClient.invalidateQueries({ queryKey: ['member-cashier-rekening'] });
      queryClient.invalidateQueries({ queryKey: ['bo-dashboard'] });
    },
  });

  const dataList: Simpanan[] = isBackOffice
    ? boData?.items || []
    : memberData || [];

  const ringkasan: SimpananSummary = boData?.ringkasan || {
    totalSetor: 0,
    totalTarik: 0,
    totalSaldo: 0,
    totalTransaksi: 0,
  };

  const isLoaded = isBackOffice ? !boLoading : !memberLoading;

  const getByAnggota = (anggotaId: string) =>
    dataList.filter((s) => !anggotaId || s.anggotaId === anggotaId);

  const getTotalByAnggota = (anggotaId: string) =>
    dataList
      .filter((s) => (!anggotaId || s.anggotaId === anggotaId) && s.status === 'Selesai')
      .reduce((sum, s) => (s.tipe === 'Penarikan' ? sum - s.jumlah : sum + s.jumlah), 0);

  const getTotalSukarelaByAnggota = (anggotaId: string) =>
    dataList
      .filter((s) => (!anggotaId || s.anggotaId === anggotaId) && s.jenis === 'Sukarela' && s.status === 'Selesai')
      .reduce((sum, s) => (s.tipe === 'Penarikan' ? sum - s.jumlah : sum + s.jumlah), 0);

  const getTotalByJenis = (jenis: SimpananJenis) =>
    dataList
      .filter((s) => s.jenis === jenis && s.status === 'Selesai')
      .reduce((sum, s) => (s.tipe === 'Penarikan' ? sum - s.jumlah : sum + s.jumlah), 0);

  const addSimpanan = async (
    anggotaId: string,
    _jenis: SimpananJenis,
    jumlah: number,
    keterangan: string,
    tipe: 'Setoran' | 'Penarikan' = 'Setoran',
    _status: 'Selesai' | 'Menunggu' | 'Ditolak' = 'Selesai',
    options?: {
      rekeningId?: string;
      jenisSimpananId?: string;
      metodePembayaran?: 'tunai' | 'transfer';
      buktiPembayaran?: string;
    }
  ) => {
    return await transaksiMutation.mutateAsync({
      rekeningId: options?.rekeningId,
      memberId: anggotaId,
      jenisSimpananId: options?.jenisSimpananId,
      jenisMutasi: tipe === 'Setoran' ? 'setor' : 'tarik',
      nominal: jumlah,
      keterangan,
      metodePembayaran: options?.metodePembayaran || 'tunai',
      buktiPembayaran: options?.buktiPembayaran,
    });
  };

  return {
    dataList,
    ringkasan,
    pagination: boData?.pagination,
    isLoaded,
    isLoading: isBackOffice ? boLoading : memberLoading,
    getByAnggota,
    getTotalByAnggota,
    getTotalSukarelaByAnggota,
    addSimpanan,
    addBulkSimpanan: (_entries: Omit<Simpanan, 'id'>[]) => [],
    updateSimpananStatus: (_id: string, _status: any) => {},
    getTotalByJenis,
    isSubmitting: transaksiMutation.isPending,
  };
}

// Hook khusus Kasir untuk memuat rekening & saldo anggota tertentu
export function useMemberCashierRekening(memberId: string | null) {
  return useQuery({
    queryKey: ['member-cashier-rekening', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      try {
        const res = await simpananApi.getMemberRekening(memberId);
        if (res.status === 'success' && res.data) {
          return res.data;
        }
      } catch (err) {
        console.warn('Gagal memuat rekening kasir anggota:', err);
      }
      return null;
    },
    enabled: Boolean(memberId),
  });
}
