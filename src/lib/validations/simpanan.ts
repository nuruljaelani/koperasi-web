import { z } from 'zod';

export const penarikanMemberSchema = z.object({
  jumlahTarik: z
    .string({ message: 'Nominal penarikan wajib diisi' })
    .min(1, 'Nominal penarikan wajib diisi')
    .refine((val) => {
      const num = parseInt((val || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num >= 10000;
    }, 'Minimal penarikan adalah Rp 10.000'),
  keteranganTarik: z.string().max(200, 'Keterangan maksimal 200 karakter').optional(),
});

export type PenarikanMemberFormValues = z.infer<typeof penarikanMemberSchema>;

export const setoranKasirSchema = z.object({
  anggotaId: z.string().min(1, 'Silakan pilih anggota terlebih dahulu'),
  jenis: z.enum(['Pokok', 'Wajib', 'Sukarela'], {
    message: 'Silakan pilih jenis simpanan',
  }),
  jumlah: z
    .string({ message: 'Nominal setoran wajib diisi' })
    .min(1, 'Nominal setoran wajib diisi')
    .refine((val) => {
      const num = parseInt((val || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num >= 1000;
    }, 'Nominal setoran minimal Rp 1.000'),
  metodePembayaran: z.enum(['tunai', 'transfer']),
  keterangan: z.string().max(255, 'Keterangan maksimal 255 karakter').optional(),
});

export type SetoranKasirFormValues = z.infer<typeof setoranKasirSchema>;

export const penarikanKasirSchema = z.object({
  anggotaId: z.string().min(1, 'Silakan pilih anggota terlebih dahulu'),
  jenisSimpanan: z.enum(['Pokok', 'Wajib', 'Sukarela'], {
    message: 'Silakan pilih jenis simpanan',
  }),
  jumlahTarik: z
    .string({ message: 'Nominal penarikan wajib diisi' })
    .min(1, 'Nominal penarikan wajib diisi')
    .refine((val) => {
      const num = parseInt((val || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num >= 1000;
    }, 'Nominal penarikan minimal Rp 1.000'),
  metodePembayaran: z.enum(['tunai', 'transfer']),
  keterangan: z.string().max(255, 'Keterangan maksimal 255 karakter').optional(),
});

export type PenarikanKasirFormValues = z.infer<typeof penarikanKasirSchema>;
