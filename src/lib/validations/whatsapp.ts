import { z } from 'zod';

export const waDeviceConfigSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Nama label perangkat minimal 3 karakter')
    .max(100, 'Nama label maksimal 100 karakter'),
  device_id: z
    .string()
    .trim()
    .min(3, 'Device ID minimal 3 karakter')
    .max(50, 'Device ID maksimal 50 karakter'),
  phone_number: z
    .string()
    .trim()
    .nonempty('Nomor WhatsApp pengirim wajib diisi')
    .refine(
      (val) => /^(0|\+?62)[0-9]{8,15}$/.test(val),
      'Format nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)'
    ),
  api_url: z
    .string()
    .trim()
    .refine((val) => !val || /^https?:\/\/.+/.test(val), {
      message: 'Format URL API harus diawali http:// atau https://',
    }),
  status: z
    .string()
    .optional(),
});

export const waSendTestSchema = z.object({
  to: z
    .string()
    .trim()
    .min(10, 'Nomor tujuan minimal 10 digit')
    .max(20, 'Nomor tujuan maksimal 20 digit')
    .regex(
      /^(0|\+?62)[0-9]{8,15}$/,
      'Format nomor WhatsApp tidak valid (contoh: 08123456789 atau 628123456789)'
    ),
  message: z
    .string()
    .trim()
    .min(3, 'Isi pesan tes minimal 3 karakter')
    .max(1000, 'Isi pesan tes maksimal 1000 karakter'),
});

export type WaDeviceConfigFormValues = z.infer<typeof waDeviceConfigSchema>;
export type WaSendTestFormValues = z.infer<typeof waSendTestSchema>;
