import { apiFetch } from "./client";
import type {
  ProfilKoperasi,
  NotifikasiSettings,
  KeamananSettings,
  LaporanSettings,
} from "@/app/bo/pengaturan/types";

export interface SystemSettingsBundle {
  profil: ProfilKoperasi;
  notifikasi: NotifikasiSettings;
  keamanan: KeamananSettings;
  laporan: LaporanSettings;
}

export const settingsApi = {
  getAll: async () => {
    return apiFetch<SystemSettingsBundle>('/bo/pengaturan');
  },
  updateAll: async (payload: Partial<SystemSettingsBundle>) => {
    return apiFetch<SystemSettingsBundle>('/bo/pengaturan', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getProfil: async () => {
    return apiFetch<ProfilKoperasi>('/bo/pengaturan/profil');
  },
  updateProfil: async (payload: Partial<ProfilKoperasi>) => {
    return apiFetch<ProfilKoperasi>('/bo/pengaturan/profil', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getNotifikasi: async () => {
    return apiFetch<NotifikasiSettings>('/bo/pengaturan/notifikasi');
  },
  updateNotifikasi: async (payload: Partial<NotifikasiSettings>) => {
    return apiFetch<NotifikasiSettings>('/bo/pengaturan/notifikasi', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getKeamanan: async () => {
    return apiFetch<KeamananSettings>('/bo/pengaturan/keamanan');
  },
  updateKeamanan: async (payload: Partial<KeamananSettings>) => {
    return apiFetch<KeamananSettings>('/bo/pengaturan/keamanan', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  getLaporan: async () => {
    return apiFetch<LaporanSettings>('/bo/pengaturan/laporan');
  },
  updateLaporan: async (payload: Partial<LaporanSettings>) => {
    return apiFetch<LaporanSettings>('/bo/pengaturan/laporan', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
