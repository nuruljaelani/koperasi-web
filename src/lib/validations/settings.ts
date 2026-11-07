import { z } from 'zod';

export const profilKoperasiSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, 'Nama koperasi minimal 3 karakter')
    .max(150, 'Nama koperasi maksimal 150 karakter'),
  singkatan: z
    .string()
    .trim()
    .min(2, 'Singkatan minimal 2 karakter')
    .max(50, 'Singkatan maksimal 50 karakter'),
  tagline: z.string().max(200, 'Tagline maksimal 200 karakter'),
  alamat: z
    .string()
    .trim()
    .min(5, 'Alamat minimal 5 karakter')
    .max(500, 'Alamat maksimal 500 karakter'),
  kota: z.string().trim().min(2, 'Kota/Kabupaten wajib diisi'),
  provinsi: z.string().trim().min(2, 'Provinsi wajib diisi'),
  kodePos: z
    .string()
    .trim()
    .regex(/^(\d{5})?$/, 'Kode pos harus 5 digit angka'),
  noTelp: z
    .string()
    .trim()
    .min(8, 'Nomor telepon minimal 8 karakter')
    .max(25, 'Nomor telepon maksimal 25 karakter'),
  email: z.string().trim().email('Format email resmi tidak valid'),
  website: z
    .string()
    .trim()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Format URL website harus diawali http:// atau https://',
    }),
  noSK: z.string().trim().min(3, 'No. SK Pendirian wajib diisi'),
  tanggalBerdiri: z.string().min(1, 'Tanggal berdiri wajib diisi'),
  npwp: z
    .string()
    .trim()
    .min(15, 'NPWP minimal 15 karakter')
    .max(25, 'NPWP maksimal 25 karakter'),
  bankNama: z.string().trim().min(2, 'Nama bank wajib diisi'),
  bankNoRekening: z.string().trim().min(5, 'Nomor rekening wajib diisi'),
  bankAtasNama: z.string().trim().min(2, 'Nama rekening wajib diisi'),
});

export const notifikasiSettingsSchema = z.object({
  emailAktif: z.boolean(),
  emailHost: z.string(),
  emailPort: z.string().regex(/^\d*$/, 'Port harus angka'),
  emailUser: z.string(),
  emailPassword: z.string(),
  emailPengirim: z
    .string()
    .trim()
    .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Format email pengirim tidak valid',
    }),
  namaPengirim: z.string(),
  emailSsl: z.boolean(),
  templatePengajuan: z.string().min(1, 'Template pengajuan email wajib diisi'),
  templateDisetujui: z.string().min(1, 'Template disetujui email wajib diisi'),
  templateDitolak: z.string().min(1, 'Template ditolak email wajib diisi'),
  whatsappAktif: z.boolean(),
  whatsappProvider: z.string(),
  whatsappApiKey: z.string(),
  whatsappNomorPengirim: z.string(),
  whatsappNomorAdmin: z.string(),
  templateWaPengajuan: z.string().min(1, 'Template WA pengajuan wajib diisi'),
  templateWaStatus: z.string().min(1, 'Template WA status wajib diisi'),
  templateWaJatuhTempo: z.string().min(1, 'Template WA jatuh tempo wajib diisi'),
});

export const keamananSettingsSchema = z.object({
  sessionTimeout: z
    .number()
    .min(5, 'Timeout sesi minimal 5 menit')
    .max(1440, 'Timeout sesi maksimal 1440 menit'),
  maxLoginAttempts: z
    .number()
    .min(1, 'Maksimal percobaan login minimal 1 kali')
    .max(20, 'Maksimal percobaan login maksimal 20 kali'),
  logAktivitas: z.boolean(),
});

export const gantiPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export const laporanSettingsSchema = z.object({
  formatDefault: z.enum(['excel', 'pdf']),
  jadwalBackup: z.enum(['harian', 'mingguan', 'bulanan']),
  retensiBackup: z
    .number()
    .min(1, 'Retensi backup minimal 1 hari')
    .max(365, 'Retensi backup maksimal 365 hari'),
});

export const pengaturanSystemSchema = z.object({
  profil: profilKoperasiSchema,
  notifikasi: notifikasiSettingsSchema,
  keamanan: keamananSettingsSchema,
  laporan: laporanSettingsSchema,
});

export type ProfilKoperasiFormValues = z.infer<typeof profilKoperasiSchema>;
export type NotifikasiSettingsFormValues = z.infer<typeof notifikasiSettingsSchema>;
export type KeamananSettingsFormValues = z.infer<typeof keamananSettingsSchema>;
export type GantiPasswordFormValues = z.infer<typeof gantiPasswordSchema>;
export type LaporanSettingsFormValues = z.infer<typeof laporanSettingsSchema>;
export type PengaturanSystemFormValues = z.infer<typeof pengaturanSystemSchema>;
