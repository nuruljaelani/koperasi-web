import { apiFetch } from "./client";
import { useAuthStore } from "@/store/useAuthStore";

export const authApi = {
  // Step 1: Cek Data Anggota Lama
  cekAktivasi: async (payload: {
    identifier: string;
    noHp?: string;
    no_hp?: string;
    tanggalLahir?: string;
    tgl_lahir?: string;
  }) => {
    return apiFetch("/auth/aktivasi/cek", {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.identifier.trim(),
        no_hp: (payload.no_hp || payload.noHp || "").trim(),
        tgl_lahir: payload.tgl_lahir || payload.tanggalLahir || undefined,
      }),
    });
  },

  // Step 1.5: Verifikasi OTP WhatsApp
  verifyOTP: async (payload: {
    identifier: string;
    noHp?: string;
    no_hp?: string;
    otp: string;
  }) => {
    return apiFetch("/auth/aktivasi/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.identifier.trim(),
        no_hp: (payload.no_hp || payload.noHp || "").trim(),
        otp: payload.otp.trim(),
      }),
    });
  },

  // Step 2: Eksekusi Aktivasi Akun
  aktivasi: async (payload: {
    identifier: string;
    noHp?: string;
    no_hp?: string;
    tanggalLahir?: string;
    tgl_lahir?: string;
    username: string;
    password: string;
    email?: string;
  }) => {
    return apiFetch("/auth/aktivasi", {
      method: "POST",
      body: JSON.stringify({
        identifier: payload.identifier.trim(),
        no_hp: (payload.no_hp || payload.noHp || "").trim(),
        tgl_lahir: payload.tgl_lahir || payload.tanggalLahir || undefined,
        username: payload.username.trim(),
        password: payload.password,
        email: payload.email?.trim() || undefined,
      }),
    });
  },

  // Login (Username / No HP / No Anggota / Email)
  login: async (payload: { identifier: string; password: string }) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Registrasi Anggota Baru
  register: async (payload: any) => {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get Profil User Login
  getMe: async () => {
    return apiFetch("/auth/me");
  },

  // Refresh Token
  refreshToken: async () => {
    return apiFetch("/auth/refresh-token", {
      method: "POST",
    });
  },

  // Logout (membersihkan sesi di frontend dan cookie di backend)
  logout: async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      useAuthStore.getState().logout();
    }
  },
};
