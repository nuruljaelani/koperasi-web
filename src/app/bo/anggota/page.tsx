'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit3, Trash2 } from 'lucide-react';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';
import DataTable from '@/components/admin/DataTable';
import TableFilter from '@/components/TableFilter';

export default function DataAnggotaPage() {
  const { anggotaList, isLoaded, deleteAnggota } = useAnggotaData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  if (!isLoaded) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat Data...</div>;

  const filteredData = anggotaList.filter(a => {
    const matchSearch = 
      a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.nik.includes(searchTerm);
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const columns = [
    { header: 'No. Anggota', accessor: 'nomorAnggota' as keyof Anggota },
    { 
      header: 'Nama Lengkap', 
      accessor: (row: Anggota) => (
        <div>
          <div className="font-extrabold text-slate-800">{row.nama}</div>
          <div className="text-xs text-slate-400 font-bold mt-0.5">{row.nik}</div>
        </div>
      )
    },
    { header: 'No. HP', accessor: 'nomorHp' as keyof Anggota },
    { 
      header: 'Status', 
      accessor: (row: Anggota) => (
        <span className={`px-4 py-1.5 rounded-xl text-xs font-bold ${row.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Aksi',
      accessor: (row: Anggota) => (
        <div className="flex gap-3">
          <Link href={`/admin/anggota/edit/${row.id}`} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95">
            <Edit3 className="w-5 h-5" />
          </Link>
          <button 
            onClick={() => {
              if (window.confirm(`Hapus anggota ${row.nama} secara permanen?`)) {
                deleteAnggota(row.id);
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Data Anggota</h1>
          <p className="text-slate-500 font-semibold">Kelola informasi seluruh anggota koperasi.</p>
        </div>
        <Link 
          href="/admin/anggota/create"
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-2xl font-medium shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-6 h-6" />
          Tambah Anggota
        </Link>
      </div>

      <TableFilter
        title="Saring Data Anggota"
        fields={[
          {
            id: 'search',
            label: 'Pencarian',
            type: 'input',
            placeholder: 'Nama, No. Anggota, NIK...',
            value: searchTerm,
            onChange: setSearchTerm
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
        onReset={(searchTerm || statusFilter) ? () => {
          setSearchTerm('');
          setStatusFilter('');
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
