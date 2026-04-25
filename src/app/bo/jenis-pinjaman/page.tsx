'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit3, Trash2 } from 'lucide-react';
import { useJenisPinjamanData, JenisPinjaman } from '@/hooks/useJenisPinjamanData';
import DataTable from '@/components/admin/DataTable';
import TableFilter from '@/components/TableFilter';

export default function JenisPinjamanPage() {
  const { dataList, isLoaded, deleteData } = useJenisPinjamanData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tipeBungaFilter, setTipeBungaFilter] = useState('');

  if (!isLoaded) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat Data...</div>;

  const filteredData = dataList.filter(a => {
    const matchSearch =
      a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    const matchTipe = tipeBungaFilter ? a.tipeBunga === tipeBungaFilter : true;
    return matchSearch && matchStatus && matchTipe;
  });

  const columns = [
    { header: 'Kode', accessor: 'kode' as keyof JenisPinjaman },
    { 
      header: 'Nama Pinjaman', 
      accessor: (row: JenisPinjaman) => (
        <div className="font-extrabold text-slate-800">{row.nama}</div>
      )
    },
    { 
      header: 'Bunga', 
      accessor: (row: JenisPinjaman) => (
        <div>
          <div className="font-bold text-slate-800">{row.sukuBunga}% <span className="text-slate-400 font-medium ml-0.5">/ bln</span></div>
          <div className="text-xs text-emerald-600 font-bold mt-1">{row.tipeBunga}</div>
        </div>
      )
    },
    { 
      header: 'Tenor Maks', 
      accessor: (row: JenisPinjaman) => <span className="font-bold text-slate-700">{row.tenorMaksimal} Bulan</span>
    },
    { 
      header: 'Biaya Tambahan', 
      accessor: (row: JenisPinjaman) => (
        <div className="space-y-1">
          <div className="text-xs font-bold text-slate-600">Admin: <span className="text-slate-800">{row.biayaAdmin}%</span></div>
          <div className="text-xs font-bold text-rose-500">Denda: {row.denda}%/hari</div>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: JenisPinjaman) => (
        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${row.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Aksi',
      accessor: (row: JenisPinjaman) => (
        <div className="flex gap-3">
          <Link href={`/admin/jenis-pinjaman/edit/${row.id}`} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95">
            <Edit3 className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => {
              if (window.confirm(`Hapus jenis pinjaman ${row.nama} secara permanen?`)) {
                deleteData(row.id);
              }
            }}
            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Jenis Pinjaman</h1>
          <p className="text-slate-500 font-semibold">Kelola daftar produk pinjaman dan konfigurasi bunganya.</p>
        </div>
        <Link 
          href="/admin/jenis-pinjaman/create"
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-2xl font-medium tracking-wide shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          <Plus className="w-6 h-6" />
          Tambah Jenis
        </Link>
      </div>

      <TableFilter
        title="Saring Jenis Pinjaman"
        fields={[
          {
            id: 'search',
            label: 'Pencarian',
            type: 'input',
            placeholder: 'Nama produk atau kode...',
            value: searchTerm,
            onChange: setSearchTerm
          },
          {
            id: 'tipeBunga',
            label: 'Tipe Bunga',
            type: 'select',
            value: tipeBungaFilter,
            onChange: setTipeBungaFilter,
            options: [
              { label: 'Semua Tipe Bunga', value: '' },
              { label: 'Flat', value: 'Flat' },
              { label: 'Menurun', value: 'Menurun' },
              { label: 'Anuitas', value: 'Anuitas' }
            ]
          },
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'Semua Status', value: '' },
              { label: 'Aktif', value: 'Aktif' },
              { label: 'Tidak Aktif', value: 'Tidak Aktif' }
            ]
          }
        ]}
        onReset={(searchTerm || statusFilter || tipeBungaFilter) ? () => {
          setSearchTerm('');
          setStatusFilter('');
          setTipeBungaFilter('');
        } : undefined}
      />

      <DataTable 
        data={filteredData} 
        columns={columns} 
        keyExtractor={(row) => row.id} 
      />
    </div>
  );
}
