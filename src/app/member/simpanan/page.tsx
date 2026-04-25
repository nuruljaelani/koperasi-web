'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSimpananData, SimpananJenis } from '@/hooks/useSimpananData';
import {
  Loader2,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Wallet,
  AlertCircle
} from 'lucide-react';

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const JENIS_COLOR: Record<string, string> = {
  Pokok: 'bg-blue-50 text-blue-600 border-blue-100',
  Wajib: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Sukarela: 'bg-amber-50 text-amber-600 border-amber-100',
};

const STATUS_COLOR: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  Selesai: { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
  Menunggu: { label: 'Menunggu', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock },
  Ditolak: { label: 'Ditolak', bg: 'bg-rose-50', text: 'text-rose-600', icon: XCircle },
};

export default function SimpananPage() {
  const { user } = useAuth();
  const { isLoaded, getByAnggota, addSimpanan, getTotalByAnggota } = useSimpananData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [jumlahTarik, setJumlahTarik] = useState('');
  const [keteranganTarik, setKeteranganTarik] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const anggotaId = user?.anggotaId ?? '';
  const mySimpanan = useMemo(() => getByAnggota(anggotaId), [getByAnggota, anggotaId]);
  
  const totalSimpanan = useMemo(() => getTotalByAnggota(anggotaId), [getTotalByAnggota, anggotaId]);

  const summary = useMemo(() => {
    let pokok = 0;
    let wajib = 0;
    let sukarela = 0;

    mySimpanan.forEach((s) => {
      if (s.status === 'Selesai') {
        const amt = s.tipe === 'Penarikan' ? -s.jumlah : s.jumlah;
        if (s.jenis === 'Pokok') pokok += amt;
        if (s.jenis === 'Wajib') wajib += amt;
        if (s.jenis === 'Sukarela') sukarela += amt;
      }
    });

    return { pokok, wajib, sukarela };
  }, [mySimpanan]);

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const handleAjukanPenarikan = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const numTarik = parseInt(jumlahTarik.replace(/\D/g, ''), 10);
    
    if (!numTarik || numTarik <= 0) {
      setErrorMsg('Jumlah penarikan tidak valid.');
      return;
    }
    
    // Hanya simpanan sukarela yang umum boleh ditarik
    if (numTarik > summary.sukarela) {
      setErrorMsg(`Maksimal penarikan adalah ${formatRupiah(summary.sukarela)} (Simpanan Sukarela)`);
      return;
    }
    
    setIsSubmitting(true);
    // Simulasi delay jaringan
    await new Promise((r) => setTimeout(r, 800));
    
    addSimpanan(anggotaId, 'Sukarela', numTarik, keteranganTarik || 'Pengajuan Penarikan', 'Penarikan', 'Menunggu');
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    setJumlahTarik('');
    setKeteranganTarik('');
  };

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue, 10);
    if (!isNaN(numValue)) {
      setJumlahTarik(new Intl.NumberFormat('id-ID').format(numValue));
    } else {
      setJumlahTarik('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Simpanan Saya</h1>
          <p className="text-slate-500">Kelola dan pantau mutasi simpanan Anda</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors active:scale-95 shadow-[0_4px_12px_rgba(5,150,105,0.2)]"
        >
          <Plus className="w-5 h-5" />
          <span>Tarik Simpanan</span>
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-700 text-white rounded-[20px] p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4 relative z-10 text-white">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs text-emerald-100 font-medium uppercase tracking-wide mb-1 relative z-10">Total Simpanan</p>
          <p className="text-2xl font-extrabold tracking-tight relative z-10">{formatRupiah(totalSimpanan)}</p>
        </div>

        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Simpanan Pokok</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{formatRupiah(summary.pokok)}</p>
        </div>

        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Simpanan Wajib</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{formatRupiah(summary.wajib)}</p>
        </div>

        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Simpanan Sukarela</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{formatRupiah(summary.sukarela)}</p>
          <span className="absolute top-4 right-4 text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 flex items-center gap-1 font-bold rounded-md">
            Dapat Ditarik
          </span>
        </div>
      </div>

      {/* ── Mutasi List ── */}
      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Riwayat Mutasi Simpanan</h2>

        {mySimpanan.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <PiggyBank className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm font-medium">Belum ada riwayat mutasi.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[...mySimpanan]
              .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
              .map((s) => {
                const StatusIcon = STATUS_COLOR[s.status]?.icon || Clock;
                const setoran = s.tipe === 'Setoran';

                return (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          setoran ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {setoran ? <ArrowDownCircle className="w-6 h-6" /> : <ArrowUpCircle className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-800 text-sm md:text-base">{s.keterangan}</p>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${JENIS_COLOR[s.jenis]}`}
                          >
                            {s.jenis}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{formatDate(s.tanggal)}</span>
                          <span>&bull;</span>
                          <span className={`${STATUS_COLOR[s.status]?.text} font-semibold flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" /> {s.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:text-right flex items-center sm:block pl-16 sm:pl-0">
                      <p
                        className={`font-extrabold text-lg ${
                          setoran ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {setoran ? '+' : '-'}{formatRupiah(s.jumlah)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ── Modal Pengajuan ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-[24px] w-full max-w-md relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Ajukan Penarikan</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAjukanPenarikan} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl flex items-start gap-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Jumlah Penarikan (Rp)
                </label>
                <input
                  type="text"
                  value={jumlahTarik}
                  onChange={handleJumlahChange}
                  placeholder="Misal: 500.000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Saldo Sukarela tersedia: <strong className="text-emerald-600">{formatRupiah(summary.sukarela)}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tujuan / Keterangan Penarikan
                </label>
                <textarea
                  value={keteranganTarik}
                  onChange={(e) => setKeteranganTarik(e.target.value)}
                  placeholder="Contoh: Keperluan pendidikan anak"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none resize-none"
                  required
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                  Pencairan dana hanya dapat dilakukan maksimal 2x24 jam di hari kerja setelah disetujui. Dana akan ditransfer ke rekening terdaftar Anda.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !jumlahTarik}
                  className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Konfirmasi Penarikan</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
