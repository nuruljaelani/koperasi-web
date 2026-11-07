import { apiFetch } from "./client";

export const laporanApi = {
  getSimpanan: async (query?: { startDate?: string; endDate?: string }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch<any>(`/bo/laporan/simpanan${q}`);
  },
  getPinjaman: async (query?: { startDate?: string; endDate?: string; status?: string }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch<any>(`/bo/laporan/pinjaman${q}`);
  },
  getArusKas: async (query?: { startDate?: string; endDate?: string }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch<any>(`/bo/laporan/arus-kas${q}`);
  },
  getKolektibilitas: async () => {
    return apiFetch<any>('/bo/laporan/kolektibilitas');
  },
  getRekapSentra: async () => {
    return apiFetch<any>('/bo/laporan/rekap-sentra');
  },
  getSHU: async (query?: { totalSHU?: number; persenJasaModal?: number; persenJasaUsaha?: number }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch<any>(`/bo/laporan/shu${q}`);
  },
};
