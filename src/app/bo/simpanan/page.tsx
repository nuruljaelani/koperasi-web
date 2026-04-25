'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  PiggyBank, Search, Filter, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownLeft, Users, Plus, Upload
} from 'lucide-react';
import { useSimpananData, Simpanan } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import DataTable from '@/components/admin/DataTable';

export default function SimpananPage() {
  const { dataList, isLoaded, getTotalByJenis } = useSimpananData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [tipeFilter, setTipeFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  if (!isLoaded || !anggotaLoaded) {
    return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat Data...</div>;
  }

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  /* ── Summary Calculations ── */
  const totalSetoran = dataList
    .filter(s => s.status === 'Selesai' && s.tipe === 'Setoran')
    .reduce((sum, s) => sum + s.jumlah, 0);

  const totalPenarikan = dataList
    .filter(s => s.status === 'Selesai' && s.tipe === 'Penarikan')
    .reduce((sum, s) => sum + s.jumlah, 0);

  const totalSaldo = totalSetoran - totalPenarikan;
  const pending = dataList.filter(s => s.status === 'Menunggu').length;

  /* ── Filter ── */
  const filtered = dataList.filter(row => {
    const anggota = anggotaList.find(a => a.id === row.anggotaId);
    const matchSearch = !searchTerm ||
      anggota?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anggota?.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = jenisFilter === 'Semua' || row.jenis === jenisFilter;
    const matchTipe = tipeFilter === 'Semua' || row.tipe === tipeFilter;
    const matchStatus = statusFilter === 'Semua' || row.status === statusFilter;
    let matchDate = true;
    if (dateFrom) matchDate = matchDate && new Date(row.tanggal) >= new Date(dateFrom);
    if (dateTo) matchDate = matchDate && new Date(row.tanggal) <= new Date(dateTo);
    return matchSearch && matchJenis && matchTipe && matchStatus && matchDate;
  }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const columns = [
    {
      header: 'Anggota',
      accessor: (row: Simpanan) => {
        const a = anggotaList.find(x => x.id === row.anggotaId);
        return (
          <div>
            <div className="font-bold text-slate-800">{a?.nama || 'Unknown'}</div>
            <div className="text-xs text-slate-500 font-medium">{a?.nomorAnggota || '-'}</div>
          </div>
        );
      }
    },
    {
      header: 'Jenis',
      accessor: (row: Simpanan) => {
        const colors: Record<string, string> = {
          Pokok: 'bg-blue-50 text-blue-600',
          Wajib: 'bg-emerald-50 text-emerald-600',
          Sukarela: 'bg-amber-50 text-amber-600',
        };
        return <span className={`px-3 py-1 rounded-xl text-xs font-bold ${colors[row.jenis] ?? ''}`}>{row.jenis}</span>;
      }
    },
    {
      header: 'Tipe',
      accessor: (row: Simpanan) => (
        <div className={`flex items-center gap-1.5 font-bold text-sm ${row.tipe === 'Setoran' ? 'text-emerald-600' : 'text-rose-500'}`}>
          {row.tipe === 'Setoran'
            ? <ArrowDownLeft className="w-4 h-4" />
            : <ArrowUpRight className="w-4 h-4" />}
          {row.tipe}
        </div>
      )
    },
    {
      header: 'Jumlah',
      accessor: (row: Simpanan) => (
        <span className={`font-extrabold ${row.tipe === 'Setoran' ? 'text-emerald-700' : 'text-rose-600'}`}>
          {row.tipe === 'Penarikan' ? '- ' : '+ '}{formatRupiah(row.jumlah)}
        </span>
      )
    },
    {
      header: 'Tanggal',
      accessor: (row: Simpanan) => (
        <span className="font-medium text-slate-600 text-sm">
          {new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Simpanan) => {
        const colors: Record<string, string> = {
          Selesai: 'bg-emerald-50 text-emerald-600',
          Menunggu: 'bg-amber-50 text-amber-600',
          Ditolak: 'bg-rose-50 text-rose-600',
        };
        return <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${colors[row.status] ?? ''}`}>{row.status}</span>;
      }
    },
    {
      header: 'Keterangan',
      accessor: (row: Simpanan) => (
        <span className="text-slate-500 text-sm truncate max-w-[180px] block">{row.keterangan}</span>
      )
    },
  ];

  const summaryCards = [
    { label: 'Total Saldo Simpanan', value: formatRupiah(totalSaldo), icon: PiggyBank, color: 'from-emerald-500 to-teal-500', sub: `${dataList.length} transaksi` },
    { label: 'Total Setoran', value: formatRupiah(totalSetoran), icon: TrendingUp, color: 'from-blue-500 to-cyan-500', sub: `${dataList.filter(s => s.tipe === 'Setoran').length} transaksi` },
    { label: 'Total Penarikan', value: formatRupiah(totalPenarikan), icon: TrendingDown, color: 'from-rose-500 to-pink-500', sub: `${dataList.filter(s => s.tipe === 'Penarikan').length} transaksi` },
    { label: 'Menunggu Persetujuan', value: `${pending}`, icon: Users, color: 'from-amber-500 to-orange-500', sub: 'permintaan masuk' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Manajemen Simpanan</h1>
          <p className="text-slate-500 font-semibold">Pantau seluruh transaksi simpanan anggota koperasi.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/bo/simpanan/setoran" className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] text-sm">
            <Plus className="w-4 h-4" /> Input Setoran
          </Link>
          <Link href="/bo/simpanan/penarikan" className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 border border-slate-200 transition-all active:scale-[0.98] text-sm">
            <Upload className="w-4 h-4" /> Proses Penarikan
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-sm`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mb-1">{card.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
            <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-5 text-slate-800 font-bold">
          <Filter className="w-5 h-5 text-emerald-500" /> Filter Data
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="xl:col-span-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center gap-3 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
            <div className="w-10 h-10 flex items-center justify-center text-slate-400"><Search className="w-5 h-5" /></div>
            <input type="text" placeholder="Cari nama / nomor anggota" className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          {([
            { label: 'Jenis', value: jenisFilter, setter: setJenisFilter, options: ['Semua', 'Pokok', 'Wajib', 'Sukarela'] },
            { label: 'Tipe', value: tipeFilter, setter: setTipeFilter, options: ['Semua', 'Setoran', 'Penarikan'] },
            { label: 'Status', value: statusFilter, setter: setStatusFilter, options: ['Semua', 'Selesai', 'Menunggu', 'Ditolak'] },
          ] as const).map(f => (
            <select key={f.label} value={f.value} onChange={e => (f.setter as (v: string) => void)(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer">
              {f.options.map(o => <option key={o} value={o}>{o === 'Semua' ? `Semua ${f.label}` : o}</option>)}
            </select>
          ))}
          <div className="flex gap-2">
            <input type="date" title="Dari" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50" />
            <input type="date" title="Sampai" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50" />
          </div>
        </div>
      </div>

      <DataTable data={filtered} columns={columns} keyExtractor={row => row.id} />
    </div>
  );
}
