import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Nomor Anggota / No. HP / Username wajib diisi'),
  password: z
    .string()
    .min(1, 'Password wajib diisi'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const aktivasiStep1Schema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Nomor Anggota atau NIK KTP wajib diisi'),
  noHp: z
    .string()
    .trim()
    .min(1, 'Nomor Handphone wajib diisi')
    .regex(/^(08|\+?628)[0-9]{7,13}$/, 'Format nomor HP tidak valid (contoh: 08123456789)'),
  tanggalLahir: z.string().optional(),
});

export type AktivasiStep1Values = z.infer<typeof aktivasiStep1Schema>;

export const aktivasiOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Kode OTP harus 6 digit angka')
    .regex(/^\d+$/, 'Kode OTP hanya boleh berisi angka'),
});

export type AktivasiOtpValues = z.infer<typeof aktivasiOtpSchema>;

export const aktivasiStep2Schema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username minimal 3 karakter')
      .max(30, 'Username maksimal 30 karakter')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan garis bawah (_)'),
    email: z
      .string()
      .trim()
      .email('Format email tidak valid')
      .or(z.literal(''))
      .optional(),
    password: z
      .string()
      .min(6, 'Password minimal 6 karakter'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok dengan password baru.',
    path: ['confirmPassword'],
  });

export type AktivasiStep2Values = z.infer<typeof aktivasiStep2Schema>;
