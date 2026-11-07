import { z } from 'zod';

export const anggotaSchema = z.object({
  nomorAnggota: z.string().optional(),
  nik: z
    .string()
    .trim()
    .length(16, 'NIK harus tepat 16 digit')
    .regex(/^\d{16}$/, 'NIK hanya boleh berupa angka'),
  nama: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(150, 'Nama lengkap maksimal 150 karakter'),
  nomorHp: z
    .string()
    .trim()
    .min(10, 'Nomor HP minimal 10 digit')
    .max(20, 'Nomor HP maksimal 20 digit')
    .regex(/^(0|\+?62)[0-9]{8,14}$/, 'Format nomor HP tidak valid (contoh: 08123456789)'),
  tanggalLahir: z
    .string()
    .min(1, 'Tanggal lahir wajib diisi')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan']),
  alamat: z
    .string()
    .trim()
    .min(5, 'Alamat domisili minimal 5 karakter')
    .max(500, 'Alamat domisili maksimal 500 karakter'),
  status: z.enum(['Aktif', 'Tidak Aktif']),
});

export type AnggotaFormValues = z.infer<typeof anggotaSchema>;
