'use client';

import { useState } from 'react';
import { ArrowLeft, Banknote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSimpananData, Simpanan } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import KuitansiModal, { KuitansiData } from '@/components/admin/KuitansiModal';
import { toast } from 'sonner';
import { type PenarikanKasirFormValues } from '@/lib/validations/simpanan';

import { PenarikanKasirForm } from './components/PenarikanKasirForm';
import { PenarikanRiwayatTable } from './components/PenarikanRiwayatTable';

export default function PenarikanPage() {
  const router = useRouter();
  const { dataList, isLoaded, addSimpanan, isSubmitting } = useSimpananData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const [activeView, setActiveView] = useState<'riwayat' | 'form-tarik'>('riwayat');

  // Filter States for Riwayat Penarikan
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState<string[]>([]);

  // Kuitansi Modal State
  const [kuitansiModalOpen, setKuitansiModalOpen] = useState(false);
  const [kuitansiData, setKuitansiData] = useState<KuitansiData | null>(null);

  if (!isLoaded || !anggotaLoaded) {
    return (
      <div className="p-10 text-center text-slate-400 font-bold animate-pulse">
        Memuat Data Penarikan...
      </div>
    );
  }

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v);

  const penarikanOnly = dataList.filter((s) => s.tipe === 'Penarikan');

  const filtered = penarikanOnly
    .filter((row) => {
      const a = anggotaList.find((x) => x.id === row.anggotaId);
      const matchSearch =
        !searchTerm ||
        a?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a?.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.kodeTransaksi?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchJenis = jenisFilter.length === 0 || jenisFilter.includes(row.jenis);
      return matchSearch && matchJenis;
    })
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const handleTarikSubmit = async (
    values: PenarikanKasirFormValues,
    selectedAccount: any
  ) => {
    const jumlahNum = parseInt(values.jumlahTarik.replace(/\D/g, ''), 10);
    const selectedAnggota = anggotaList.find((a) => a.id === values.anggotaId);

    const res = await addSimpanan(
      values.anggotaId,
      values.jenisSimpanan,
      jumlahNum,
      values.keterangan || `Penarikan Tunai ${values.jenisSimpanan}`,
      'Penarikan',
      'Selesai',
      {
        rekeningId: selectedAccount?.rekeningId || undefined,
        jenisSimpananId: selectedAccount?.jenisId || undefined,
        metodePembayaran: values.metodePembayaran,
      }
    );

    toast.success(
      `Penarikan ${values.jenisSimpanan} sebesar ${formatRupiah(jumlahNum)} berhasil diproses!`
    );

    if (res?.kuitansi) {
      setKuitansiData(res.kuitansi);
    } else {
      setKuitansiData({
        kodeTransaksi: res?.mutasi?.kode_transaksi || `TRX-TRK-${Date.now()}`,
        tanggalTransaksi: new Date().toISOString(),
        jenisMutasi: 'tarik',
        nominal: jumlahNum,
        saldoAwal: res?.rekening?.saldoSebelumnya,
        saldoAkhir: res?.rekening?.saldoSaatIni,
        metodePembayaran: values.metodePembayaran,
        keterangan: values.keterangan || `Penarikan Tunai ${values.jenisSimpanan}`,
        nomorRekening: selectedAccount?.nomorRekening || '-',
        jenisSimpanan: `Simpanan ${values.jenisSimpanan}`,
        namaAnggota: selectedAnggota?.nama || '-',
        nomorAnggota: selectedAnggota?.nomorAnggota || '-',
        nik: selectedAnggota?.nik,
        noHp: selectedAnggota?.nomorHp,
        alamat: selectedAnggota?.alamat,
      });
    }

    setKuitansiModalOpen(true);
    setActiveView('riwayat');
  };

  const openKuitansiForRow = (row: Simpanan) => {
    const a = anggotaList.find((x) => x.id === row.anggotaId);
    setKuitansiData({
      kodeTransaksi: row.kodeTransaksi || `TRX-TRK-${row.id.slice(0, 8)}`,
      tanggalTransaksi: row.tanggal,
      jenisMutasi: 'tarik',
      nominal: row.jumlah,
      saldoAwal: row.saldoAwal,
      saldoAkhir: row.saldo,
      metodePembayaran: row.metodePembayaran || 'tunai',
      keterangan: row.keterangan,
      nomorRekening: row.nomorRekening || '-',
      jenisSimpanan: `Simpanan ${row.jenis}`,
      namaAnggota: row.namaAnggota || a?.nama || '-',
      nomorAnggota: row.nomorAnggota || a?.nomorAnggota || '-',
      nik: a?.nik,
      noHp: a?.nomorHp,
      alamat: a?.alamat,
      operator: row.operator,
    });
    setKuitansiModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <KuitansiModal
        isOpen={kuitansiModalOpen}
        onClose={() => setKuitansiModalOpen(false)}
        data={kuitansiData}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Penarikan Simpanan
            </h1>
            <p className="text-slate-500 font-semibold mt-1">
              Layanan penarikan dana simpanan sukarela anggota di kasir counter.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView(activeView === 'form-tarik' ? 'riwayat' : 'form-tarik')}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-95 cursor-pointer ${
            activeView === 'form-tarik'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          <Banknote size={18} />
          {activeView === 'form-tarik' ? 'Lihat Riwayat Penarikan' : '+ Tarik Tunai di Kasir'}
        </button>
      </div>

      {activeView === 'form-tarik' ? (
        <PenarikanKasirForm
          anggotaList={anggotaList}
          isSubmitting={isSubmitting}
          onCancel={() => setActiveView('riwayat')}
          onSubmit={handleTarikSubmit}
          formatRupiah={formatRupiah}
        />
      ) : (
        <PenarikanRiwayatTable
          filtered={filtered}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          jenisFilter={jenisFilter}
          onJenisFilterChange={setJenisFilter}
          onOpenKuitansi={openKuitansiForRow}
          formatRupiah={formatRupiah}
        />
      )}
    </div>
  );
}
