'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';
import DataTable from '@/components/admin/DataTable';
import TableFilter from '@/components/TableFilter';
import { toast } from 'sonner';
import { QuickStatusModal } from './components/QuickStatusModal';
import { getAnggotaColumns } from './components/AnggotaTableColumns';

function DataAnggotaContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil state pagination & filter dari URL Query
  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const urlLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = isNaN(urlLimit) || urlLimit < 1 ? 10 : urlLimit;

  const urlSearch = searchParams.get('search') || '';
  const urlStatus = searchParams.get('status') || '';

  // Local state untuk input search agar responsif
  const [searchInput, setSearchInput] = useState(urlSearch);

  // Sync jika URL berubah dari luar
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Debounce search update ke URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== urlSearch) {
        updateQuery({ search: searchInput || undefined, page: 1 });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchInput, urlSearch]);

  const updateQuery = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '' || (key === 'page' && val === 1 && !updates.limit)) {
        if (key === 'page' && val === 1) {
          params.set('page', '1');
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, String(val));
      }
    });

    router.replace(`${pathname}?${params.toString()}`);
  };

  // Panggil hook dengan parameter server-side
  const {
    anggotaList,
    pagination,
    isLoaded,
    isLoading,
    deleteAnggota,
    updateStatus,
  } = useAnggotaData({
    page,
    limit,
    search: urlSearch,
    status: urlStatus,
  });

  // State untuk Quick Status Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState<Anggota | null>(null);
  const [newStatus, setNewStatus] = useState<string>('active');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleOpenStatusModal = (anggota: Anggota) => {
    setSelectedAnggota(anggota);
    setNewStatus(anggota.status === 'Aktif' ? 'active' : 'inactive');
    setStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedAnggota) return;
    try {
      setIsUpdatingStatus(true);
      await updateStatus(selectedAnggota.id, newStatus);
      toast.success(
        `Status ${selectedAnggota.nama || 'anggota'} berhasil diubah menjadi ${
          newStatus === 'active' ? 'Aktif' : 'Tidak Aktif'
        }`
      );
      setStatusModalOpen(false);
      setSelectedAnggota(null);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah status anggota');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const columns = useMemo(
    () =>
      getAnggotaColumns({
        onOpenStatusModal: handleOpenStatusModal,
        deleteAnggota,
      }),
    [deleteAnggota]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Data Anggota</h1>
          <p className="text-slate-500 font-semibold">
            Kelola identitas, keanggotaan resmi, dan verifikasi anggota koperasi.
          </p>
        </div>
        <Link
          href="/bo/anggota/create"
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-medium tracking-wide shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
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
            value: searchInput,
            onChange: setSearchInput,
          },
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            value: urlStatus,
            onChange: (val) => updateQuery({ status: val || undefined, page: 1 }),
            options: [
              { label: 'Semua Status', value: '' },
              { label: 'Aktif', value: 'Aktif' },
              { label: 'Tidak Aktif', value: 'Tidak Aktif' },
            ],
          },
        ]}
        onReset={
          urlSearch || urlStatus || searchInput
            ? () => {
                setSearchInput('');
                updateQuery({ search: undefined, status: undefined, page: 1 });
              }
            : undefined
        }
      />

      {/* Tabel dengan Server-side Pagination */}
      <DataTable
        data={anggotaList}
        columns={columns}
        keyExtractor={(row) => row.id}
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          totalPages: pagination.totalPages,
          isLoading: isLoading || !isLoaded,
          onPageChange: (newPage) => updateQuery({ page: newPage }),
          onLimitChange: (newLimit) => updateQuery({ limit: newLimit, page: 1 }),
        }}
      />

      {/* QUICK STATUS MODAL */}
      <QuickStatusModal
        isOpen={statusModalOpen}
        selectedAnggota={selectedAnggota}
        newStatus={newStatus}
        isUpdatingStatus={isUpdatingStatus}
        onClose={() => setStatusModalOpen(false)}
        onStatusSelect={setNewStatus}
        onSave={handleSaveStatus}
      />
    </div>
  );
}

export default function DataAnggotaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 flex items-center justify-center gap-3 text-slate-400 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Memuat Data Anggota...</span>
        </div>
      }
    >
      <DataAnggotaContent />
    </Suspense>
  );
}
