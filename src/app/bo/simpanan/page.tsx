'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Plus, Banknote } from 'lucide-react';
import { useSimpananData, Simpanan } from '@/hooks/useSimpananData';
import DataTable from '@/components/admin/DataTable';
import KuitansiModal, { KuitansiData } from '@/components/admin/KuitansiModal';

import { SimpananSummaryCards } from './components/SimpananSummaryCards';
import { SimpananFilterBar } from './components/SimpananFilterBar';
import { createSimpananTableColumns } from './components/SimpananTableColumns';

function SimpananContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const currentLimit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
  const currentSearch = searchParams.get('search') || '';
  const currentJenis = searchParams.get('jenis') || 'Semua';
  const currentTipe = searchParams.get('tipe') || 'Semua';
  const currentDateFrom = searchParams.get('startDate') || '';
  const currentDateTo = searchParams.get('endDate') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);

  const backendTipe =
    currentJenis !== 'Semua' ? currentJenis.toLowerCase() : undefined;
  const backendJenisMutasi =
    currentTipe === 'Setoran'
      ? 'setor'
      : currentTipe === 'Penarikan'
      ? 'tarik'
      : undefined;

  const {
    dataList,
    ringkasan,
    pagination,
    isLoading,
  } = useSimpananData({
    page: currentPage,
    limit: currentLimit,
    search: currentSearch || undefined,
    tipe: backendTipe,
    jenisMutasi: backendJenisMutasi,
    startDate: currentDateFrom || undefined,
    endDate: currentDateTo || undefined,
  });

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateUrlParams({ search: searchInput, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const [kuitansiModalOpen, setKuitansiModalOpen] = useState(false);
  const [kuitansiData, setKuitansiData] = useState<KuitansiData | null>(null);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const openKuitansiForRow = (row: Simpanan) => {
    setKuitansiData({
      kodeTransaksi:
        row.kodeTransaksi ||
        `TRX-${row.tipe === 'Setoran' ? 'STR' : 'TRK'}-${row.id.slice(0, 8)}`,
      tanggalTransaksi: row.tanggal,
      jenisMutasi: row.tipe === 'Setoran' ? 'setor' : 'tarik',
      nominal: row.jumlah,
      saldoAwal: row.saldoAwal,
      saldoAkhir: row.saldo,
      metodePembayaran: row.metodePembayaran || 'tunai',
      keterangan: row.keterangan,
      nomorRekening: row.nomorRekening || '-',
      jenisSimpanan: `Simpanan ${row.jenis}`,
      namaAnggota: row.namaAnggota || '-',
      nomorAnggota: row.nomorAnggota || '-',
      operator: row.operator || 'Kasir',
    });
    setKuitansiModalOpen(true);
  };

  const columns = createSimpananTableColumns({
    openKuitansiForRow,
    formatRupiah,
  });

  const totalSaldoVal = ringkasan?.totalSaldo || 0;
  const totalSetorVal = ringkasan?.totalSetor || 0;
  const totalTarikVal = ringkasan?.totalTarik || 0;
  const totalTrxCount = ringkasan?.totalTransaksi || pagination?.total || dataList.length;

  const hasActiveFilters =
    Boolean(currentSearch) ||
    currentJenis !== 'Semua' ||
    currentTipe !== 'Semua' ||
    Boolean(currentDateFrom) ||
    Boolean(currentDateTo);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <KuitansiModal
        isOpen={kuitansiModalOpen}
        onClose={() => setKuitansiModalOpen(false)}
        data={kuitansiData}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Kasir & Manajemen Simpanan
          </h1>
          <p className="text-slate-500 font-semibold">
            Pantau dan layani transaksi simpanan anggota koperasi dengan kuitansi sah.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/bo/simpanan/setoran"
            className="flex items-center gap-2 px-5 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> + Input Setoran
          </Link>
          <Link
            href="/bo/simpanan/penarikan"
            className="flex items-center gap-2 px-5 py-3.5 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 border border-slate-200 transition-all active:scale-[0.98] text-sm shadow-sm cursor-pointer"
          >
            <Banknote className="w-4 h-4 text-emerald-600" /> Penarikan Simpanan
          </Link>
        </div>
      </div>

      <SimpananSummaryCards
        totalSaldoVal={totalSaldoVal}
        totalSetorVal={totalSetorVal}
        totalTarikVal={totalTarikVal}
        totalTrxCount={totalTrxCount}
        formatRupiah={formatRupiah}
      />

      <SimpananFilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        currentJenis={currentJenis}
        onJenisChange={(v) => updateUrlParams({ jenis: v, page: 1 })}
        currentTipe={currentTipe}
        onTipeChange={(v) => updateUrlParams({ tipe: v, page: 1 })}
        currentDateFrom={currentDateFrom}
        onDateFromChange={(v) => updateUrlParams({ startDate: v, page: 1 })}
        currentDateTo={currentDateTo}
        onDateToChange={(v) => updateUrlParams({ endDate: v, page: 1 })}
        hasActiveFilters={hasActiveFilters}
        onResetFilter={() => {
          setSearchInput('');
          startTransition(() => {
            router.push(pathname);
          });
        }}
      />

      <DataTable
        data={dataList}
        columns={columns}
        keyExtractor={(row) => row.id}
        emptyState={
          <div className="p-12 text-center text-slate-400">
            {isLoading ? (
              <div className="font-bold text-sm animate-pulse">
                Memuat data transaksi simpanan...
              </div>
            ) : (
              <div>
                <p className="font-bold text-base text-slate-600">Tidak ada transaksi ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">
                  Coba ubah kata kunci pencarian atau reset filter tanggal.
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
          onPageChange: (p) => updateUrlParams({ page: p }),
          onLimitChange: (l) => updateUrlParams({ limit: l, page: 1 }),
          limitOptions: [10, 25, 50, 100],
          isLoading: isLoading,
        }}
      />
    </div>
  );
}

export default function SimpananPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400 font-bold animate-pulse">
          Memuat Halaman Simpanan...
        </div>
      }
    >
      <SimpananContent />
    </Suspense>
  );
}
