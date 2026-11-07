import { z } from 'zod';

export const jenisPinjamanSchema = z.object({
  kode: z.string().optional(),
  nama: z
    .string()
    .trim()
    .min(3, 'Nama jenis pinjaman minimal 3 karakter')
    .max(100, 'Nama jenis pinjaman maksimal 100 karakter'),
  tipeBunga: z.enum(['Flat', 'Menurun', 'Anuitas']),
  sukuBunga: z.coerce
    .number()
    .min(0, 'Suku bunga tidak boleh negatif')
    .max(100, 'Suku bunga maksimal 100% per tahun'),
  tenorMaksimal: z.coerce
    .number()
    .int('Tenor harus berupa bilangan bulat')
    .min(1, 'Tenor minimal 1 bulan')
    .max(120, 'Tenor maksimal 120 bulan (10 tahun)'),
  biayaAdmin: z.coerce
    .number()
    .min(0, 'Biaya admin tidak boleh negatif')
    .max(100, 'Biaya admin maksimal 100%'),
  denda: z.coerce
    .number()
    .min(0, 'Denda tidak boleh negatif')
    .max(100, 'Denda maksimal 100%')
    .default(0.1),
  status: z.enum(['Aktif', 'Tidak Aktif']).default('Aktif'),
  deskripsi: z.string().optional(),
});

export type JenisPinjamanFormValues = z.infer<typeof jenisPinjamanSchema>;
