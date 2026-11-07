import { apiFetch, buildQueryString } from "./client";

export const boApi = {
  getDashboard: async () => {
    return apiFetch('/bo/dashboard');
  },
  getLaporanSimpanan: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/bo/laporan/simpanan${q}`);
  },
  getLaporanPinjaman: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/bo/laporan/pinjaman${q}`);
  },
  getLaporanArusKas: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/bo/laporan/arus-kas${q}`);
  },
  getAnggota: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/bo/anggota${q}`);
  },
  getAnggotaDetail: async (id: string) => {
    return apiFetch(`/bo/anggota/${id}`);
  },
  createAnggota: async (payload: any) => {
    return apiFetch('/bo/anggota', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateAnggota: async (id: string, payload: any) => {
    return apiFetch(`/bo/anggota/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  updateStatusAnggota: async (id: string, status: string) => {
    return apiFetch(`/bo/anggota/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  deleteAnggota: async (id: string) => {
    return apiFetch(`/bo/anggota/${id}`, {
      method: 'DELETE',
    });
  },
  // Master Jenis Pinjaman
  getJenisPinjaman: async (query?: Record<string, any>) => {
    const q = buildQueryString(query);
    return apiFetch(`/bo/jenis-pinjaman${q}`);
  },
  getJenisPinjamanDetail: async (id: string) => {
    return apiFetch(`/bo/jenis-pinjaman/${id}`);
  },
  createJenisPinjaman: async (payload: any) => {
    return apiFetch('/bo/jenis-pinjaman', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateJenisPinjaman: async (id: string, payload: any) => {
    return apiFetch(`/bo/jenis-pinjaman/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteJenisPinjaman: async (id: string) => {
    return apiFetch(`/bo/jenis-pinjaman/${id}`, {
      method: 'DELETE',
    });
  },
};
