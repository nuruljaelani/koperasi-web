'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Download, Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField } from './common';

export function TabLaporan() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const formatDefault = watch('laporan.formatDefault');
  const jadwalBackup = watch('laporan.jadwalBackup');
  const retensiBackup = watch('laporan.retensiBackup');
  const laporanErrors = errors.laporan;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Format Ekspor Laporan"
        icon={Download}
        description="Pengaturan default untuk ekspor dan cetak laporan"
      >
        <FormField
          label="Format Default Ekspor"
          hint="Format ini digunakan saat mengklik tombol 'Export' di halaman laporan"
        >
          <div className="flex gap-3">
            {(['excel', 'pdf'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() =>
                  setValue('laporan.formatDefault', fmt, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                  formatDefault === fmt
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                {fmt === 'excel' ? '📊 Microsoft Excel (.xlsx)' : '📄 PDF Document (.pdf)'}
              </button>
            ))}
          </div>
        </FormField>
      </SectionCard>

      <SectionCard
        title="Backup Data"
        icon={Database}
        description="Jadwal dan pengaturan backup data koperasi secara otomatis"
      >
        <FormField label="Jadwal Backup Otomatis" hint="Backup data seluruh sistem secara berkala">
          <div className="flex gap-3 flex-wrap">
            {([
              { value: 'harian', label: '🕐 Harian', desc: 'Setiap hari pukul 02:00' },
              { value: 'mingguan', label: '📅 Mingguan', desc: 'Setiap Minggu pagi' },
              { value: 'bulanan', label: '🗓️ Bulanan', desc: 'Tanggal 1 setiap bulan' },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue('laporan.jadwalBackup', opt.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  jadwalBackup === opt.value
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <p
                  className={`text-sm font-bold ${
                    jadwalBackup === opt.value ? 'text-emerald-800' : 'text-slate-700'
                  }`}
                >
                  {opt.label}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          label="Retensi Backup"
          hint="Backup yang lebih lama dari periode ini akan dihapus otomatis"
          error={laporanErrors?.retensiBackup?.message}
        >
          <div className="flex items-center gap-3 max-w-xs">
            <input
              type="range"
              min={7}
              max={365}
              step={7}
              value={retensiBackup || 30}
              onChange={(e) =>
                setValue('laporan.retensiBackup', Number(e.target.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg min-w-[70px] text-center">
              {retensiBackup || 30} hari
            </span>
          </div>
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => toast.success('Proses backup instan berhasil dijalankan!')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Backup Sekarang
          </button>
          <button
            type="button"
            onClick={() => toast.info('Mengunduh arsip backup terbaru...')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Backup Terakhir
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
