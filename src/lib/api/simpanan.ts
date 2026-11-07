import { apiFetch, buildQueryString } from "./client";

export const simpananApi = {
  getJenis: async () => {
    return apiFetch('/simpanan/jenis');
  },
  createJenis: async (payload: any) => {
    return apiFetch('/simpanan/jenis', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  bukaRekening: async (payload: {
    memberId: string;
    jenisSimpananId: string;
    setoranAwal?: number;
  }) => {
    return apiFetch('/simpanan/rekening/buka', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyRekening: async () => {
    return apiFetch('/simpanan/rekening/me');
  },
  getRekeningDetail: async (id: string) => {
    return apiFetch(`/simpanan/rekening/${id}`);
  },
  getMutasi: async (id: string, query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/simpanan/rekening/${id}/mutasi${q}`);
  },
  transaksi: async (payload: {
    rekeningId?: string;
    memberId?: string;
    jenisSimpananId?: string;
    jenisMutasi: 'setor' | 'tarik';
    nominal?: number;
    jumlah?: number;
    keterangan?: string;
    metodePembayaran?: 'tunai' | 'transfer';
    buktiPembayaran?: string;
  }) => {
    return apiFetch('/simpanan/transaksi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMemberRekening: async (memberId: string) => {
    return apiFetch(`/simpanan/member/${memberId}/rekening`);
  },
  getAllTransaksi: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/simpanan/all-transaksi${q}`);
  },
};
