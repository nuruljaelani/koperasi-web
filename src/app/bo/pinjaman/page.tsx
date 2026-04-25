'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Edit3, Eye, Filter } from 'lucide-react';
import { usePinjamanData, Pinjaman } from '@/hooks/usePinjamanData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import DataTable from '@/components/admin/DataTable';

export default function PinjamanPage() {
  const { dataList, isLoaded: pinjamanLoaded } = usePinjamanData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();
  const { dataList: jenisList, isLoaded: jenisLoaded } = useJenisPinjamanData();

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [jenisFilter, setJenisFilter] = useState('Semua');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  if (!pinjamanLoaded || !anggotaLoaded || !jenisLoaded) {
    return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat Data...</div>;
  }

  // Formatting helpers
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Filter Logic
  const filteredData = dataList.filter(row => {
    const anggota = anggotaList.find(a => a.id === row.anggotaId);
    
    // 1. Search (Nomor Pinjaman or Nama Anggota)
    const matchSearch = searchTerm === '' || 
      row.nomorPinjaman.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (anggota?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
    // 2. Status
    const matchStatus = statusFilter === 'Semua' || row.status === statusFilter;
    
    // 3. Jenis Pinjaman
    const matchJenis = jenisFilter === 'Semua' || row.jenisPinjamanId === jenisFilter;
    
    // 4. Date Range
    let matchDate = true;
    if (dateFrom) {
      matchDate = matchDate && new Date(row.tanggalPengajuan) >= new Date(dateFrom);
    }
    if (dateTo) {
      matchDate = matchDate && new Date(row.tanggalPengajuan) <= new Date(dateTo);
    }

    return matchSearch && matchStatus && matchJenis && matchDate;
  });

  const columns = [
    { 
      header: 'No. Pinjaman', 
      accessor: (row: Pinjaman) => (
        <div className="font-extrabold text-slate-700">{row.nomorPinjaman}</div>
      ) 
    },
    { 
      header: 'Anggota', 
      accessor: (row: Pinjaman) => {
        const agt = anggotaList.find(a => a.id === row.anggotaId);
        return (
          <div>
            <div className="font-bold text-slate-800">{agt?.nama || 'Unknown'}</div>
            <div className="text-xs text-slate-500 font-medium">NIK: {agt?.nik || '-'}</div>
          </div>
        )
      }
    },
    { 
      header: 'Jenis', 
      accessor: (row: Pinjaman) => {
        const jns = jenisList.find(j => j.id === row.jenisPinjamanId);
        return <span className="font-bold text-emerald-600">{jns?.nama || 'Unknown'}</span>
      }
    },
    { 
      header: 'Pengajuan', 
      accessor: (row: Pinjaman) => (
        <div>
          <div className="font-bold text-slate-800">{formatRupiah(row.jumlahPengajuan)}</div>
          <div className="text-xs text-slate-500 font-medium mt-0.5">{row.tenor} Bulan</div>
        </div>
      )
    },
    { 
      header: 'Tanggal', 
      accessor: (row: Pinjaman) => {
        const date = new Date(row.tanggalPengajuan);
        return <span className="font-bold text-slate-600">{date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      }
    },
    { 
      header: 'Status', 
      accessor: (row: Pinjaman) => {
        let colors = '';
        switch(row.status) {
          case 'Menunggu': colors = 'bg-amber-50 text-amber-600'; break;
          case 'Disetujui': colors = 'bg-emerald-50 text-emerald-600'; break;
          case 'Ditolak': colors = 'bg-rose-50 text-rose-600'; break;
          case 'Berjalan': colors = 'bg-blue-50 text-blue-600'; break;
          case 'Lunas': colors = 'bg-slate-100 text-slate-600'; break;
          default: colors = 'bg-slate-50 text-slate-600';
        }
        return (
          <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${colors}`}>
            {row.status}
          </span>
        )
      }
    },
    {
      header: 'Aksi',
      accessor: (row: Pinjaman) => (
        <div className="flex gap-2">
          <Link href={`/admin/pinjaman/detail/${row.id}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95" title="Lihat Detail">
            <Eye className="w-5 h-5" />
          </Link>
          <Link href={`/admin/pinjaman/edit/${row.id}`} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95" title="Ubah Status">
            <Edit3 className="w-5 h-5" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Data Pinjaman</h1>
          <p className="text-slate-500 font-semibold">Tinjau, setujui, dan kelola semua transaksi pinjaman anggota.</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3 mb-6 text-slate-800 font-bold">
          <Filter className="w-5 h-5 text-emerald-500" />
          Filter Data
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center gap-3 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
            <div className="w-10 h-10 flex items-center justify-center text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Cari Nama / No. Pinjaman"
              className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 placeholder:text-slate-400 text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Disetujui">Disetujui</option>
            <option value="Ditolak">Ditolak</option>
            <option value="Berjalan">Berjalan</option>
            <option value="Lunas">Lunas</option>
          </select>

          {/* Jenis Dropdown */}
          <select 
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Jenis Pinjaman</option>
            {jenisList.map(j => (
              <option key={j.id} value={j.id}>{j.nama}</option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex gap-2">
            <input 
              type="date" 
              title="Tanggal Mulai"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer"
            />
            <input 
              type="date" 
              title="Tanggal Akhir"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer"
            />
          </div>

        </div>
      </div>

      <DataTable 
        data={filteredData} 
        columns={columns} 
        keyExtractor={(row) => row.id} 
      />
    </div>
  );
}
