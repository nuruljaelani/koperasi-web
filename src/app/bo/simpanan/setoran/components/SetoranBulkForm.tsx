'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';
import { SimpananJenis } from '@/hooks/useSimpananData';

export interface BulkRow {
  nomorAnggota: string;
  jenis: SimpananJenis;
  jumlah: number;
  keterangan: string;
  valid: boolean;
  error?: string;
  anggota?: Anggota;
}

interface SetoranBulkFormProps {
  anggotaList: Anggota[];
  formatRupiah: (v: number) => string;
}

export function SetoranBulkForm({ anggotaList, formatRupiah }: SetoranBulkFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim());
      const dataLines = lines.slice(1);

      const rows: BulkRow[] = dataLines.map((line) => {
        const [nomorAnggota, jenisRaw, jumlahRaw, keteranganRaw] = line
          .split(',')
          .map((s) => s.trim().replace(/^"|"$/g, ''));

        const anggota = anggotaList.find(
          (a) => a.nomorAnggota.toLowerCase() === nomorAnggota?.toLowerCase()
        );

        const validJenis: SimpananJenis[] = ['Pokok', 'Wajib', 'Sukarela'];
        const jenisVal = (jenisRaw?.charAt(0).toUpperCase() +
          jenisRaw?.slice(1).toLowerCase()) as SimpananJenis;
        const jumlahNum = parseInt(jumlahRaw?.replace(/\D/g, ''), 10);

        let valid = true;
        let error = '';
        if (!anggota) {
          valid = false;
          error = 'Nomor anggota tidak ditemukan';
        } else if (!validJenis.includes(jenisVal)) {
          valid = false;
          error = `Jenis tidak valid: ${jenisRaw}`;
        } else if (!jumlahNum || jumlahNum < 1000) {
          valid = false;
          error = 'Nominal tidak valid';
        }

        return {
          nomorAnggota,
          jenis: jenisVal,
          jumlah: jumlahNum,
          keterangan: keteranganRaw || `Setoran ${jenisVal}`,
          valid,
          error,
          anggota,
        };
      });

      setBulkRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const csv =
      'NomorAnggota,Jenis,Jumlah,Keterangan\nKOP-2025-0102,Wajib,25000,Setoran Wajib Bulanan\nKOP-2024-0001,Sukarela,100000,Setoran Tabungan Sukarela';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_setoran_simpanan.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
        <div>
          <h4 className="font-bold text-slate-800 text-sm">Unduh Contoh Template CSV</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Gunakan format kolom yang sesuai untuk import massal setoran anggota.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="px-4 py-2 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Unduh Template
        </button>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-10 text-center cursor-pointer bg-slate-50/50 hover:bg-emerald-50/30 transition-all"
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />
        <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-base">Klik untuk Memilih File CSV</h3>
        <p className="text-xs text-slate-400 mt-1">
          Format: NomorAnggota, Jenis, Jumlah, Keterangan
        </p>
      </div>

      {bulkRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              Pratinjau Data ({bulkRows.length} Baris):
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {bulkRows.filter((r) => r.valid).length} Valid •{' '}
              {bulkRows.filter((r) => !r.valid).length} Tidak Valid
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-72 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="p-3 text-left">No. Anggota</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Jenis</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {bulkRows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">
                      {r.nomorAnggota}
                    </td>
                    <td className="p-3 font-medium text-slate-700">
                      {r.anggota?.nama || '-'}
                    </td>
                    <td className="p-3 font-semibold text-slate-600">{r.jenis}</td>
                    <td className="p-3 font-bold text-slate-900 font-mono">
                      {formatRupiah(r.jumlah || 0)}
                    </td>
                    <td className="p-3">
                      {r.valid ? (
                        <span className="text-emerald-600 font-bold">Siap</span>
                      ) : (
                        <span className="text-rose-500 font-bold">{r.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
