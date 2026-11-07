'use client';

import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import { useSimpananData } from '@/hooks/useSimpananData';
import { usePinjamanData, PinjamanStatus } from '@/hooks/usePinjamanData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import {
  PiggyBank,
  WalletCards,
  BadgeCheck,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Banknote,
  CalendarDays,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

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

const STATUS_CONFIG: Record<
  PinjamanStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  Draft: { label: 'Draft', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Clock },
  Review: { label: 'Menunggu', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  Disetujui: { label: 'Disetujui', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CheckCircle2 },
  Ditolak: { label: 'Ditolak', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: XCircle },
  Cair: { label: 'Berjalan', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: TrendingUp },
  Lunas: { label: 'Lunas', color: 'bg-slate-100 text-slate-500 border-slate-200', icon: BadgeCheck },
};

const JENIS_COLOR: Record<string, string> = {
  Pokok: 'bg-blue-50 text-blue-600',
  Wajib: 'bg-emerald-50 text-emerald-600',
  Sukarela: 'bg-amber-50 text-amber-600',
};

export default function MemberDashboardPage() {
  const { user } = useAuth();
  const { anggotaList, isLoaded: aLoaded } = useAnggotaData();
  const { dataList: dataListSimpanan, isLoaded: sLoaded, getByAnggota, getTotalByAnggota } = useSimpananData();
  const { dataList: pinjamanList, isLoaded: pLoaded } = usePinjamanData();
  const { dataList: jenisList, isLoaded: jLoaded } = useJenisPinjamanData();

  const isLoaded = aLoaded && sLoaded && pLoaded && jLoaded;

  const anggotaId = user?.anggotaId ?? '';
  console.log(pinjamanList)

  const anggota = useMemo(
    () =>
      anggotaList.find((a) => a.id === anggotaId) || {
        id: user?.anggotaId || user?.id || '',
        nomorAnggota: (user as any)?.noAnggota || 'A-1001',
        nama: user?.nama || user?.username || 'Anggota',
        nik: '',
        nomorHp: user?.phone || '',
        alamat: '',
        tanggalLahir: '',
        jenisKelamin: 'Laki-laki' as const,
        status: 'Aktif' as const,
      },
    [anggotaList, anggotaId, user]
  );

  const mySimpanan = useMemo(() => (dataListSimpanan?.length ? dataListSimpanan : getByAnggota(anggotaId)), [dataListSimpanan, getByAnggota, anggotaId]);
  const totalSimpanan = useMemo(() => getTotalByAnggota(anggotaId), [getTotalByAnggota, anggotaId]);

  const myPinjaman = useMemo(() => pinjamanList, [pinjamanList]);

  const activePinjaman = useMemo(
    () => myPinjaman.find((p) => p.status === 'Cair' || p.status === 'Review' || p.status === 'Disetujui'),
    [myPinjaman]
  );

  const totalPinjaman = activePinjaman?.jumlahPengajuan ?? 0;
  // Mock: assume 4 of 12 installments paid
  const installmentsPaid = activePinjaman ? 4 : 0;
  const installmentsTotal = activePinjaman?.tenor ?? 12;
  const progressPct = installmentsTotal ? Math.round((installmentsPaid / installmentsTotal) * 100) : 0;
  const monthlyInstallment = activePinjaman
    ? Math.round(activePinjaman.jumlahPengajuan / activePinjaman.tenor)
    : 0;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!anggota) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertTriangle className="w-12 h-12 text-amber-400" />
        <p className="text-slate-500 font-medium">Data anggota tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden bg-emerald-700 rounded-[28px] p-6 md:p-8 text-white shadow-[0_12px_40px_rgba(5,150,105,0.25)]">
        {/* Background decoration */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -right-2 top-16 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -left-4 -bottom-8 w-32 h-32 rounded-full bg-black/10" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-emerald-200 text-sm font-semibold mb-1">
              Selamat datang kembali 👋
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              {anggota.nama}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="bg-white/15 px-3 py-1 rounded-lg text-xs font-bold tracking-wider">
                {anggota.nomorAnggota}
              </span>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  anggota.status === 'Aktif'
                    ? 'bg-emerald-500/30 border-emerald-400/30 text-emerald-100'
                    : 'bg-rose-400/20 border-rose-300/20 text-rose-100'
                }`}
              >
                {anggota.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-emerald-200 text-xs font-medium">Total Kekayaan Simpanan</p>
            <p className="text-2xl font-extrabold tracking-tight">{formatRupiah(totalSimpanan)}</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Simpanan */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <PiggyBank className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Total Simpanan</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{formatRupiah(totalSimpanan)}</p>
          <p className="text-xs text-slate-400 mt-1">{mySimpanan.length} transaksi</p>
        </div>

        {/* Pinjaman Aktif */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <WalletCards className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Pinjaman Aktif</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">
            {activePinjaman ? formatRupiah(totalPinjaman) : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {activePinjaman ? `Tenor ${activePinjaman.tenor} bulan` : 'Tidak ada'}
          </p>
        </div>

        {/* Angsuran Bulan Ini */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Banknote className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Angsuran/Bulan</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">
            {activePinjaman ? formatRupiah(monthlyInstallment) : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {activePinjaman ? `${installmentsPaid}/${installmentsTotal} terbayar` : 'Tidak ada'}
          </p>
        </div>

        {/* Total Pengajuan */}
        <div className="bg-white rounded-[20px] p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <CalendarDays className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Total Pengajuan</p>
          <p className="text-xl font-extrabold text-slate-800 tracking-tight">{myPinjaman.length}</p>
          <p className="text-xs text-slate-400 mt-1">Sepanjang waktu</p>
        </div>
      </div>

      {/* ── Active Loan Progress ── */}
      {activePinjaman && (
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Pinjaman Berjalan</h2>
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              Aktif
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Nomor Pinjaman</p>
              <p className="text-sm font-bold text-slate-800">{activePinjaman.nomorPinjaman}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Jenis</p>
              <p className="text-sm font-bold text-slate-800">
                {jenisList.find((j) => j.id === activePinjaman.jenisPinjamanId)?.nama ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Jumlah Pinjaman</p>
              <p className="text-sm font-bold text-slate-800">{formatRupiah(activePinjaman.jumlahPengajuan)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Tujuan</p>
              <p className="text-sm font-bold text-slate-800">{activePinjaman.tujuanPinjaman}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-slate-600">
                Angsuran ke-{installmentsPaid} dari {installmentsTotal}
              </p>
              <p className="text-sm font-bold text-emerald-600">{progressPct}% terbayar</p>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-slate-400">Terbayar: {formatRupiah(installmentsPaid * monthlyInstallment)}</p>
              <p className="text-xs text-slate-400">
                Sisa: {formatRupiah((installmentsTotal - installmentsPaid) * monthlyInstallment)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Two-column: Simpanan + Pengajuan History ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Simpanan History */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Riwayat Simpanan</h2>
            <span className="text-xs font-semibold text-slate-400">{mySimpanan.length} entri</span>
          </div>

          {mySimpanan.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium py-12">
              Belum ada data simpanan.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {[...mySimpanan]
                .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group cursor-default"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        JENIS_COLOR[s.jenis] ?? 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.jenis[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{s.keterangan}</p>
                      <p className="text-xs text-slate-400">{formatDate(s.tanggal)}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600 shrink-0">
                      +{formatRupiah(s.jumlah)}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
            {(['Pokok', 'Wajib', 'Sukarela'] as const).map((jenis) => (
              <div key={jenis} className="flex items-center gap-1.5">
                <div
                  className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${JENIS_COLOR[jenis]}`}
                >
                  {jenis[0]}
                </div>
                <span className="text-xs text-slate-500 font-medium">{jenis}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Application History */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">Riwayat Pengajuan</h2>
            <span className="text-xs font-semibold text-slate-400">{myPinjaman.length} pengajuan</span>
          </div>

          {myPinjaman.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium py-12">
              Belum ada pengajuan pinjaman.
            </div>
          ) : (
            <div className="space-y-4">
              {[...myPinjaman]
                .sort(
                  (a, b) =>
                    new Date(b.tanggalPengajuan).getTime() -
                    new Date(a.tanggalPengajuan).getTime()
                )
                .map((p) => {
                  const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG['Review'];
                  const StatusIcon = cfg.icon;
                  const jenis = jenisList.find((j) => j.id === p.jenisPinjamanId);
                  return (
                    <div
                      key={p.id}
                      className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group cursor-default"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.color}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-bold text-slate-800">{p.nomorPinjaman}</p>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {jenis?.nama ?? '—'} &middot; {formatRupiah(p.jumlahPengajuan)} &middot; {p.tenor} bln
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{formatDate(p.tanggalPengajuan)}</p>
                        {p.catatanAdmin && (
                          <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-1.5 mt-2 italic">
                            {p.catatanAdmin}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 mt-1 group-hover:text-emerald-400 transition-colors shrink-0" />
                    </div>
                  );
                })}
            </div>
          )}

          {myPinjaman.length === 0 && (
            <button className="mt-6 w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors active:scale-[0.98]">
              Ajukan Pinjaman Baru
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
