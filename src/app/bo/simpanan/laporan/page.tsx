'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSimpananData } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import TableFilter from '@/components/TableFilter';
import { LaporanSimpananChartTable } from './components/LaporanSimpananChartTable';
import { LaporanSimpananSummaryCards } from './components/LaporanSimpananSummaryCards';
import { useRekapSimpanan, GroupBy } from './hooks/useRekapSimpanan';

export default function LaporanSimpananPage() {
  const router = useRouter();
  const { dataList, isLoaded } = useSimpananData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [groupBy, setGroupBy] = useState<GroupBy>('bulan');

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(v);

  /* ── Base filter ── */
  const filtered = useMemo(() => {
    if (!isLoaded || !anggotaLoaded) return [];
    return dataList.filter((s) => {
      const d = new Date(s.tanggal);
      const matchYear = year ? d.getFullYear().toString() === year : true;
      const matchMonth = month ? (d.getMonth() + 1).toString() === month : true;
      const matchJenis = jenisFilter === 'Semua' || s.jenis === jenisFilter;
      return matchYear && matchMonth && matchJenis && s.status === 'Selesai';
    });
  }, [dataList, year, month, jenisFilter, isLoaded, anggotaLoaded]);

  /* ── Summary metrics ── */
  const totalSetoran = filtered
    .filter((s) => s.tipe === 'Setoran')
    .reduce((sum, s) => sum + s.jumlah, 0);
  const totalPenarikan = filtered
    .filter((s) => s.tipe === 'Penarikan')
    .reduce((sum, s) => sum + s.jumlah, 0);
  const saldoBersih = totalSetoran - totalPenarikan;
  const totalAnggota = new Set(filtered.map((s) => s.anggotaId)).size;

  const { activeData, maxVal, exportCsv, monthNames } = useRekapSimpanan({
    filtered,
    anggotaList,
    groupBy,
  });

  if (!isLoaded || !anggotaLoaded) {
    return (
      <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat...</div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Laporan Rekap Simpanan
            </h1>
            <p className="text-slate-500 font-semibold mt-1">
              Ringkasan transaksi simpanan per periode, anggota, atau jenis.
            </p>
          </div>
        </div>
        <button
          onClick={() => exportCsv(year, month)}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] text-sm cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <TableFilter
        title="Filter & Tampilan Laporan"
        defaultOpen={true}
        fields={[
          {
            id: 'year',
            label: 'Tahun',
            type: 'select',
            value: year,
            onChange: setYear,
            options: [
              { label: 'Semua Tahun', value: '' },
              ...[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((y) => ({
                label: String(y),
                value: String(y),
              })),
            ],
          },
          {
            id: 'month',
            label: 'Bulan',
            type: 'select',
            value: month,
            onChange: setMonth,
            options: [
              { label: 'Semua Bulan', value: '' },
              ...monthNames.map((n, i) => ({ label: n, value: String(i + 1) })),
            ],
          },
          {
            id: 'jenis',
            label: 'Jenis Simpanan',
            type: 'select',
            value: jenisFilter,
            onChange: setJenisFilter,
            options: [
              { label: 'Semua Jenis', value: 'Semua' },
              { label: 'Simpanan Pokok', value: 'Pokok' },
              { label: 'Simpanan Wajib', value: 'Wajib' },
              { label: 'Simpanan Sukarela', value: 'Sukarela' },
            ],
          },
          {
            id: 'groupBy',
            label: 'Pengelompokan (Group By)',
            type: 'radio',
            value: groupBy,
            onChange: (val) => setGroupBy(val as GroupBy),
            options: [
              { label: 'Per Bulan', value: 'bulan' },
              { label: 'Per Anggota', value: 'anggota' },
              { label: 'Per Jenis', value: 'jenis' },
            ],
          },
        ]}
        onReset={() => {
          setYear(currentYear.toString());
          setMonth('');
          setJenisFilter('Semua');
          setGroupBy('bulan');
        }}
      />

      {/* Summary Cards */}
      <LaporanSimpananSummaryCards
        saldoBersih={saldoBersih}
        totalSetoran={totalSetoran}
        totalPenarikan={totalPenarikan}
        totalAnggota={totalAnggota}
        formatRupiah={formatRupiah}
      />

      {/* Chart + Table */}
      <LaporanSimpananChartTable
        groupBy={groupBy}
        activeData={activeData}
        maxVal={maxVal}
        totalSetoran={totalSetoran}
        totalPenarikan={totalPenarikan}
        saldoBersih={saldoBersih}
        totalFilteredCount={filtered.length}
        formatRupiah={formatRupiah}
      />
    </div>
  );
}
