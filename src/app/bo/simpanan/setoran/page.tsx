'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useSimpananData } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import KuitansiModal, { KuitansiData } from '@/components/admin/KuitansiModal';
import { toast } from 'sonner';
import { type SetoranKasirFormValues } from '@/lib/validations/simpanan';

import { SetoranManualForm } from './components/SetoranManualForm';
import { SetoranBulkForm } from './components/SetoranBulkForm';

type Tab = 'manual' | 'bulk';

export default function SetoranPage() {
  const router = useRouter();
  const { addSimpanan, isSubmitting } = useSimpananData();
  const { anggotaList, isLoaded } = useAnggotaData();

  const [tab, setTab] = useState<Tab>('manual');

  /* ── Kuitansi State ── */
  const [kuitansiModalOpen, setKuitansiModalOpen] = useState(false);
  const [kuitansiData, setKuitansiData] = useState<KuitansiData | null>(null);

  if (!isLoaded) {
    return (
      <div className="p-10 text-center text-slate-400 font-bold animate-pulse">
        Memuat Data Kasir...
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

  const handleManualSubmit = async (
    values: SetoranKasirFormValues,
    selectedAccount: any
  ) => {
    const jumlahNum = parseInt(values.jumlah.replace(/\D/g, ''), 10);
    const selectedAnggota = anggotaList.find((a) => a.id === values.anggotaId);

    const res = await addSimpanan(
      values.anggotaId,
      values.jenis,
      jumlahNum,
      values.keterangan || `Setoran ${values.jenis}`,
      'Setoran',
      'Selesai',
      {
        rekeningId: selectedAccount?.rekeningId || undefined,
        jenisSimpananId: selectedAccount?.jenisId || undefined,
        metodePembayaran: values.metodePembayaran,
      }
    );

    toast.success(`Setoran ${values.jenis} sebesar ${formatRupiah(jumlahNum)} berhasil diproses!`);

    if (res?.kuitansi) {
      setKuitansiData(res.kuitansi);
    } else {
      setKuitansiData({
        kodeTransaksi: res?.mutasi?.kode_transaksi || `TRX-STR-${Date.now()}`,
        tanggalTransaksi: new Date().toISOString(),
        jenisMutasi: 'setor',
        nominal: jumlahNum,
        saldoAwal: res?.rekening?.saldoSebelumnya,
        saldoAkhir: res?.rekening?.saldoSaatIni,
        metodePembayaran: values.metodePembayaran,
        keterangan: values.keterangan || `Setoran ${values.jenis}`,
        nomorRekening: selectedAccount?.nomorRekening || '-',
        jenisSimpanan: `Simpanan ${values.jenis}`,
        namaAnggota: selectedAnggota?.nama || '-',
        nomorAnggota: selectedAnggota?.nomorAnggota || '-',
        nik: selectedAnggota?.nik,
        noHp: selectedAnggota?.nomorHp,
        alamat: selectedAnggota?.alamat,
      });
    }

    setKuitansiModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <KuitansiModal
        isOpen={kuitansiModalOpen}
        onClose={() => setKuitansiModalOpen(false)}
        data={kuitansiData}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Input Setoran Simpanan (Kasir)
          </h1>
          <p className="text-slate-500 font-semibold mt-1">
            Terima dan catat setoran simpanan anggota dengan kuitansi bukti sah terbit otomatis.
          </p>
        </div>
      </div>

      {/* Card Form */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(['manual', 'bulk'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-4 font-bold text-sm transition-all cursor-pointer ${
                tab === t
                  ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/40'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'manual' ? '✍️ Input Kasir Manual' : '📋 Upload Massal (CSV)'}
            </button>
          ))}
        </div>

        <div className="p-8">
          {tab === 'manual' && (
            <SetoranManualForm
              anggotaList={anggotaList}
              isSubmitting={isSubmitting}
              onCancel={() => router.back()}
              onSubmit={handleManualSubmit}
              formatRupiah={formatRupiah}
            />
          )}

          {tab === 'bulk' && (
            <SetoranBulkForm anggotaList={anggotaList} formatRupiah={formatRupiah} />
          )}
        </div>
      </div>
    </div>
  );
}
