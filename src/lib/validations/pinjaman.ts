import { z } from 'zod';

export const pengajuanPinjamanMemberSchema = z.object({
  jenisPinjamanId: z
    .string({ message: 'Silakan pilih jenis pinjaman' })
    .min(1, 'Silakan pilih jenis pinjaman'),
  jumlahPengajuan: z
    .string({ message: 'Nominal pinjaman wajib diisi' })
    .min(1, 'Nominal pinjaman wajib diisi')
    .refine((val) => {
      const num = parseInt((val || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num > 0;
    }, 'Nominal pinjaman harus lebih dari 0'),
  tenor: z.coerce
    .number({ message: 'Tenor harus diisi angka' })
    .int('Tenor harus berupa bilangan bulat')
    .min(1, 'Tenor minimal 1 bulan')
    .max(120, 'Tenor maksimal 120 bulan'),
  tujuanPinjaman: z
    .string({ message: 'Tujuan pinjaman minimal 5 karakter' })
    .trim()
    .min(5, 'Tujuan pinjaman minimal 5 karakter')
    .max(500, 'Tujuan pinjaman maksimal 500 karakter'),
});

export type PengajuanPinjamanMemberFormValues = z.infer<typeof pengajuanPinjamanMemberSchema>;

export const reviewPinjamanSchema = z.object({
  status: z.enum(['Draft', 'Review', 'Disetujui', 'Ditolak', 'Cair', 'Lunas']),
  catatanAdmin: z.string().max(500, 'Catatan admin maksimal 500 karakter').optional(),
});

export type ReviewPinjamanFormValues = z.infer<typeof reviewPinjamanSchema>;
