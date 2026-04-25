'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeft, BarChart3, Download, Calendar, TrendingUp,
  TrendingDown, PiggyBank, Users, FileText, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSimpananData } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import TableFilter, { FilterField } from '@/components/TableFilter';

type GroupBy = 'bulan' | 'anggota' | 'jenis';

interface RekapRow {
  label: string;
  sub: string;
  setoran: number;
  penarikan: number;
  saldo: number;
  count: number;
}

export default function LaporanSimpananPage() {
  const router = useRouter();
  const { dataList, isLoaded } = useSimpananData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(''); // '' = all months
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [groupBy, setGroupBy] = useState<GroupBy>('bulan');

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  /* ── Base filter ── */
  const filtered = useMemo(() => {
    if (!isLoaded || !anggotaLoaded) return [];
    return dataList.filter(s => {
      const d = new Date(s.tanggal);
      const matchYear = year ? d.getFullYear().toString() === year : true;
      const matchMonth = month ? (d.getMonth() + 1).toString() === month : true;
      const matchJenis = jenisFilter === 'Semua' || s.jenis === jenisFilter;
      return matchYear && matchMonth && matchJenis && s.status === 'Selesai';
    });
  }, [dataList, year, month, jenisFilter, isLoaded, anggotaLoaded]);

  /* ── Summary ── */
  const totalSetoran = filtered.filter(s => s.tipe === 'Setoran').reduce((sum, s) => sum + s.jumlah, 0);
  const totalPenarikan = filtered.filter(s => s.tipe === 'Penarikan').reduce((sum, s) => sum + s.jumlah, 0);
  const saldoBersih = totalSetoran - totalPenarikan;
  const totalAnggota = new Set(filtered.map(s => s.anggotaId)).size;

  /* ── Group by bulan ── */
  const byBulan = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach(s => {
      const d = new Date(s.tanggal);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[key].setoran += s.jumlah;
      else map[key].penarikan += s.jumlah;
      map[key].count++;
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).map(([key, v]): RekapRow => {
      const [y, m] = key.split('-');
      return { label: `${monthNames[parseInt(m) - 1]} ${y}`, sub: '', ...v, saldo: v.setoran - v.penarikan };
    });
  }, [filtered]);

  /* ── Group by anggota ── */
  const byAnggota = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach(s => {
      if (!map[s.anggotaId]) map[s.anggotaId] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[s.anggotaId].setoran += s.jumlah;
      else map[s.anggotaId].penarikan += s.jumlah;
      map[s.anggotaId].count++;
    });
    return Object.entries(map).sort((a, b) => (b[1].setoran - b[1].penarikan) - (a[1].setoran - a[1].penarikan)).map(([id, v]): RekapRow => {
      const a = anggotaList.find(x => x.id === id);
      return { label: a?.nama || id, sub: a?.nomorAnggota || '', ...v, saldo: v.setoran - v.penarikan };
    });
  }, [filtered, anggotaList]);

  /* ── Group by jenis ── */
  const byJenis = useMemo((): RekapRow[] => {
    const map: Record<string, { setoran: number; penarikan: number; count: number }> = {};
    filtered.forEach(s => {
      if (!map[s.jenis]) map[s.jenis] = { setoran: 0, penarikan: 0, count: 0 };
      if (s.tipe === 'Setoran') map[s.jenis].setoran += s.jumlah;
      else map[s.jenis].penarikan += s.jumlah;
      map[s.jenis].count++;
    });
    return Object.entries(map).map(([jenis, v]): RekapRow => ({ label: jenis, sub: '', ...v, saldo: v.setoran - v.penarikan }));
  }, [filtered]);

  const activeData: RekapRow[] = groupBy === 'bulan' ? byBulan : groupBy === 'anggota' ? byAnggota : byJenis;

  /* ── CSV Export ── */
  const handleExport = () => {
    let header = '';
    let rows: string[] = [];
    if (groupBy === 'bulan') {
      header = 'Periode,Total Setoran,Total Penarikan,Saldo Bersih,Jumlah Transaksi';
      rows = activeData.map(r => `${r.label},${r.setoran},${r.penarikan},${r.saldo},${r.count}`);
    } else if (groupBy === 'anggota') {
      header = 'Nama Anggota,No. Anggota,Total Setoran,Total Penarikan,Saldo,Transaksi';
      rows = activeData.map(r => `${r.label},${r.sub},${r.setoran},${r.penarikan},${r.saldo},${r.count}`);
    } else {
      header = 'Jenis Simpanan,Total Setoran,Total Penarikan,Saldo,Transaksi';
      rows = activeData.map(r => `${r.label},${r.setoran},${r.penarikan},${r.saldo},${r.count}`);
    }
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_simpanan_${year || 'semua'}_${month || 'semua-bulan'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxVal = Math.max(...activeData.map(r => r.setoran), 1);

  if (!isLoaded || !anggotaLoaded) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Rekap Simpanan</h1>
            <p className="text-slate-500 font-semibold mt-1">Ringkasan transaksi simpanan per periode, anggota, atau jenis.</p>
          </div>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] text-sm">
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
              ...[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(y => ({ label: String(y), value: String(y) }))
            ]
          },
          {
            id: 'month',
            label: 'Bulan',
            type: 'select',
            value: month,
            onChange: setMonth,
            options: [
              { label: 'Semua Bulan', value: '' },
              ...monthNames.map((n, i) => ({ label: n, value: String(i + 1) }))
            ]
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
              { label: 'Simpanan Sukarela', value: 'Sukarela' }
            ]
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
              { label: 'Per Jenis', value: 'jenis' }
            ]
          }
        ]}
        onReset={() => {
          setYear(currentYear.toString());
          setMonth('');
          setJenisFilter('Semua');
          setGroupBy('bulan');
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Saldo Bersih', value: formatRupiah(saldoBersih), icon: PiggyBank, color: 'from-emerald-500 to-teal-500' },
          { label: 'Total Setoran', value: formatRupiah(totalSetoran), icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Penarikan', value: formatRupiah(totalPenarikan), icon: TrendingDown, color: 'from-rose-500 to-pink-500' },
          { label: 'Anggota Aktif', value: `${totalAnggota} orang`, icon: Users, color: 'from-amber-500 to-orange-500' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 mb-1">{c.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3 font-bold text-slate-800">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            Rekap per {groupBy === 'bulan' ? 'Bulan' : groupBy === 'anggota' ? 'Anggota' : 'Jenis'}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2 text-slate-500 font-medium"><span className="w-3 h-3 rounded bg-emerald-400" />Setoran</span>
            <span className="flex items-center gap-2 text-slate-500 font-medium"><span className="w-3 h-3 rounded bg-rose-400" />Penarikan</span>
          </div>
        </div>

        {activeData.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">Tidak ada data pada periode ini.</p>
          </div>
        ) : (
          <>
            {/* Bar chart */}
            <div className="px-8 py-6 space-y-4">
              {activeData.map((row, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-sm font-bold text-slate-700 w-36 truncate">{row.label}</span>
                    {'sub' in row && row.sub !== '' && <span className="text-xs text-slate-400 font-medium">{row.sub}</span>}
                    <span className="ml-auto text-xs font-bold text-slate-500">{row.count} transaksi</span>
                  </div>
                  {/* Setoran bar */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${(row.setoran / maxVal) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 w-32 text-right">{formatRupiah(row.setoran)}</span>
                  </div>
                  {/* Penarikan bar */}
                  {row.penarikan > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${(row.penarikan / maxVal) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-rose-600 w-32 text-right">{formatRupiah(row.penarikan)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="border-t border-slate-100 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {[groupBy === 'bulan' ? 'Periode' : groupBy === 'anggota' ? 'Anggota' : 'Jenis', 'Total Setoran', 'Total Penarikan', 'Saldo Bersih', 'Jml. Transaksi'].map(h => (
                      <th key={h} className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{row.label}</div>
                        {row.sub && <div className="text-xs text-slate-400 mt-0.5">{row.sub}</div>}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700">{formatRupiah(row.setoran)}</td>
                      <td className="px-6 py-4 font-bold text-rose-600">{formatRupiah(row.penarikan)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-extrabold ${row.saldo >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>{formatRupiah(row.saldo)}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{row.count}</td>
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-emerald-50/50 border-t-2 border-emerald-100">
                    <td className="px-6 py-4 font-extrabold text-slate-800">TOTAL</td>
                    <td className="px-6 py-4 font-extrabold text-emerald-700">{formatRupiah(totalSetoran)}</td>
                    <td className="px-6 py-4 font-extrabold text-rose-600">{formatRupiah(totalPenarikan)}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-900">{formatRupiah(saldoBersih)}</td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">{filtered.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
