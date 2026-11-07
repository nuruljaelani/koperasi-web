import { apiFetch, buildQueryString } from "./client";

export const pinjamanApi = {
  getJenis: async () => {
    return apiFetch('/pinjaman/jenis');
  },
  createJenis: async (payload: any) => {
    return apiFetch('/pinjaman/jenis', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  simulasi: async (payload: {
    jumlah: number;
    tenor: number;
    jenisPinjamanId: string;
  }) => {
    return apiFetch('/pinjaman/simulasi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  ajukan: async (payload: {
    jenisPinjamanId: string;
    jumlahPinjaman: number;
    tenorBulan: number;
    tujuanPinjaman: string;
    dokumenPendukung?: any;
  }) => {
    return apiFetch('/pinjaman/ajukan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getMyPinjaman: async () => {
    return apiFetch('/pinjaman/me');
  },
  getAllPengajuan: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/pinjaman/all${q}`);
  },
  getDetail: async (id: string) => {
    return apiFetch(`/pinjaman/${id}`);
  },
  review: async (id: string, payload: { status: string; catatan?: string }) => {
    return apiFetch(`/pinjaman/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  cairkan: async (id: string) => {
    return apiFetch(`/pinjaman/${id}/cairkan`, {
      method: 'POST',
    });
  },
  bayarAngsuran: async (payload: {
    pinjamanId: string;
    jumlahBayar: number;
    angsuranKe?: number;
  }) => {
    return apiFetch('/pinjaman/angsuran/bayar', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
