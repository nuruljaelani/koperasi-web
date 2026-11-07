'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useJenisPinjamanData, JenisPinjaman } from '@/hooks/useJenisPinjamanData';
import { type JenisPinjamanFormValues } from '@/lib/validations/jenisPinjaman';
import { toast } from 'sonner';
import { confirmDialog } from '@/lib/confirm';
import DataTable from '@/components/admin/DataTable';
import TableFilter from '@/components/TableFilter';

import { JenisPinjamanHeader } from './components/JenisPinjamanHeader';
import { JenisPinjamanDrawer } from './components/JenisPinjamanDrawer';
import { createJenisPinjamanColumns } from './components/JenisPinjamanColumns';

function JenisPinjamanContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlPage = parseInt(searchParams.get('page') || '1', 10);
  const page = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;

  const urlLimit = parseInt(searchParams.get('limit') || '10', 10);
  const limit = isNaN(urlLimit) || urlLimit < 1 ? 10 : urlLimit;

  const urlSearch = searchParams.get('search') || '';
  const urlStatus = searchParams.get('status') || '';
  const urlTipeBunga = searchParams.get('tipeBunga') || '';

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

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
      if (val === undefined || val === '') {
        params.delete(key);
      } else {
        params.set(key, String(val));
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  const {
    dataList,
    pagination,
    isLoaded,
    isLoading,
    addData,
    updateData,
    deleteData,
  } = useJenisPinjamanData({
    page,
    limit,
    search: urlSearch,
    status: urlStatus,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedItem, setSelectedItem] = useState<JenisPinjaman | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold text-sm tracking-wide">
          Memuat Data Jenis Pinjaman...
        </p>
      </div>
    );
  }

  const filteredData = dataList.filter((a) => {
    return urlTipeBunga ? a.tipeBunga === urlTipeBunga : true;
  });

  const totalProduk = dataList.length;
  const totalAktif = dataList.filter((d) => d.status === 'Aktif').length;
  const avgBunga = totalProduk
    ? (dataList.reduce((acc, curr) => acc + (curr.sukuBunga || 0), 0) / totalProduk).toFixed(1)
    : '0';
  const maxTenor = totalProduk ? Math.max(...dataList.map((d) => d.tenorMaksimal || 0)) : 0;

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: JenisPinjaman) => {
    setModalMode('edit');
    setSelectedItem(item);
    setModalOpen(true);
  };

  const onValidSubmit = async (values: JenisPinjamanFormValues) => {
    try {
      setIsSubmitting(true);
      if (modalMode === 'create') {
        await addData(values);
        toast.success('Produk pinjaman baru berhasil ditambahkan');
      } else if (modalMode === 'edit' && selectedItem) {
        await updateData(selectedItem.id, values);
        toast.success(`Produk '${values.nama}' berhasil diperbarui`);
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan jenis pinjaman');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async (item: JenisPinjaman) => {
    const isConfirmed = await confirmDialog({
      title: 'Hapus Jenis Pinjaman?',
      message: (
        <span>
          Apakah Anda yakin ingin menghapus produk pinjaman{' '}
          <strong className="text-slate-800 font-bold">
            &apos;{item.nama}&apos; ({item.kode || '—'})
          </strong>
          ? Produk yang dihapus tidak akan dapat diajukan kembali oleh anggota.
        </span>
      ),
      confirmText: 'Ya, Hapus Produk',
      cancelText: 'Batalkan',
      variant: 'danger',
    });

    if (isConfirmed) {
      try {
        await deleteData(item.id);
        toast.success(`Produk '${item.nama}' berhasil dihapus`);
      } catch (err: any) {
        toast.error(err.message || 'Gagal menghapus jenis pinjaman');
      }
    }
  };

  const columns = createJenisPinjamanColumns({
    onOpenEdit: handleOpenEdit,
    onConfirmDelete: handleConfirmDelete,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-7xl mx-auto">
      <JenisPinjamanHeader
        totalProduk={totalProduk}
        totalAktif={totalAktif}
        avgBunga={avgBunga}
        maxTenor={maxTenor}
        onOpenCreate={handleOpenCreate}
      />

      <TableFilter
        title="Filter & Pencarian Produk"
        defaultOpen={true}
        fields={[
          {
            id: 'search',
            label: 'Pencarian',
            type: 'input',
            placeholder: 'Cari nama produk atau kode (JP-01)...',
            value: searchInput,
            onChange: setSearchInput,
          },
          {
            id: 'tipeBunga',
            label: 'Metode Bunga',
            type: 'select',
            value: urlTipeBunga,
            onChange: (val) => updateQuery({ tipeBunga: val || undefined, page: 1 }),
            options: [
              { label: 'Semua Metode', value: '' },
              { label: 'Flat', value: 'Flat' },
              { label: 'Menurun', value: 'Menurun' },
              { label: 'Anuitas', value: 'Anuitas' },
            ],
          },
          {
            id: 'status',
            label: 'Status Produk',
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
          urlSearch || urlStatus || urlTipeBunga || searchInput
            ? () => {
                setSearchInput('');
                updateQuery({
                  search: undefined,
                  status: undefined,
                  tipeBunga: undefined,
                  page: 1,
                });
              }
            : undefined
        }
      />

      <DataTable
        data={filteredData}
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

      <JenisPinjamanDrawer
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        modalMode={modalMode}
        selectedItem={selectedItem}
        onSubmit={onValidSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default function JenisPinjamanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 flex items-center justify-center gap-3 text-slate-400 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span>Memuat Data Jenis Pinjaman...</span>
        </div>
      }
    >
      <JenisPinjamanContent />
    </Suspense>
  );
}
