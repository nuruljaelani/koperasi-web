'use client';

import { useState, useEffect, useTransition, Suspense, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { usePinjamanData } from '@/hooks/usePinjamanData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import DataTable from '@/components/admin/DataTable';
import { PinjamanFilterBar } from './components/PinjamanFilterBar';
import { getPinjamanColumns } from './components/PinjamanTableColumns';

function PinjamanContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // URL state synchronization
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const currentLimit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'Semua';
  const currentJenis = searchParams.get('jenis') || 'Semua';
  const currentDateFrom = searchParams.get('startDate') || '';
  const currentDateTo = searchParams.get('endDate') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);

  // Load master data jenis pinjaman untuk dropdown filter
  const { dataList: jenisList } = useJenisPinjamanData();

  // Load pengajuan pinjaman dari API backend dengan serverside filter & pagination
  const {
    dataList,
    pagination,
    isLoading,
  } = usePinjamanData({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch || undefined,
    status: currentStatus !== 'Semua' ? currentStatus : undefined,
    jenisPinjamanId: currentJenis !== 'Semua' ? currentJenis : undefined,
    startDate: currentDateFrom || undefined,
    endDate: currentDateTo || undefined,
  });

  // Keep searchInput in sync when URL changes
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const updateUrlParams = (updates: Record<string, string | number | undefined | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === 'Semua') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateUrlParams({ search: searchInput, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateUrlParams({ limit: newLimit, page: 1 });
  };

  const handleResetFilter = () => {
    setSearchInput('');
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentStatus !== 'Semua' ||
    currentJenis !== 'Semua' ||
    Boolean(currentDateFrom) ||
    Boolean(currentDateTo);

  const columns = useMemo(() => getPinjamanColumns({ jenisList }), [jenisList]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Data Pengajuan Pinjaman
          </h1>
          <p className="text-slate-500 font-semibold">
            Tinjau, setujui, cairkan, dan pantau seluruh transaksi pinjaman anggota koperasi.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <PinjamanFilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        currentStatus={currentStatus}
        onStatusChange={(val) => updateUrlParams({ status: val, page: 1 })}
        currentJenis={currentJenis}
        onJenisChange={(val) => updateUrlParams({ jenis: val, page: 1 })}
        jenisList={jenisList}
        currentDateFrom={currentDateFrom}
        onDateFromChange={(val) => updateUrlParams({ startDate: val, page: 1 })}
        currentDateTo={currentDateTo}
        onDateToChange={(val) => updateUrlParams({ endDate: val, page: 1 })}
        hasActiveFilters={hasActiveFilters}
        onResetFilter={handleResetFilter}
      />

      <DataTable
        data={dataList}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyState={
          <div className="p-12 text-center text-slate-400">
            {isLoading ? (
              <div className="font-bold text-sm animate-pulse">Memuat data pengajuan pinjaman...</div>
            ) : (
              <div>
                <p className="font-bold text-base text-slate-600">Tidak ada pengajuan pinjaman ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">
                  Coba ubah kata kunci pencarian atau sesuaikan filter status dan tanggal.
                </p>
              </div>
            )}
          </div>
        }
        pagination={{
          page: pagination?.page || currentPage,
          limit: pagination?.limit || currentLimit,
          total: pagination?.total || 0,
          totalPages: pagination?.totalPages || 1,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
          limitOptions: [10, 25, 50, 100],
          isLoading: isLoading,
        }}
      />
    </div>
  );
}

export default function PinjamanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 font-bold animate-pulse">
          Memuat Data Pinjaman...
        </div>
      }
    >
      <PinjamanContent />
    </Suspense>
  );
}
