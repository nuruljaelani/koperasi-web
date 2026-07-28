'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import {
  Calculator,
  Building2,
  TrendingDown,
  Percent,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  DollarSign,
  Printer,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Sliders,
  Sparkles,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type TipeBungaCalc = 'Flat' | 'Anuitas' | 'Menurun' | 'Syariah';

interface ScheduleRow {
  bulan: number;
  tanggal: Date;
  angsuranPokok: number;
  angsuranBunga: number;
  totalAngsuran: number;
  sisaPokok: number;
}

export default function MemberSimulasiPage() {
  const router = useRouter();
  const { dataList: jenisList, isLoaded: jpLoaded } = useJenisPinjamanData();

  // Selected preset product or custom mode
  const [selectedJenisId, setSelectedJenisId] = useState<string>('custom');

  // Input states
  const [jumlah, setJumlah] = useState<number>(25000000);
  const [tenor, setTenor] = useState<number>(12); // months
  const [tipeBunga, setTipeBunga] = useState<TipeBungaCalc>('Flat');
  const [bungaValue, setBungaValue] = useState<number>(1.2); // input rate
  const [bungaUnit, setBungaUnit] = useState<'bulan' | 'tahun'>('bulan');
  const [tanggalMulai, setTanggalMulai] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Advanced / Optional fees
  const [biayaAdminPercent, setBiayaAdminPercent] = useState<number>(0);
  const [biayaProvisiPercent, setBiayaProvisiPercent] = useState<number>(0);

  // Active view tab (Simulasi vs Komparasi vs Jadwal)
  const [activeTab, setActiveTab] = useState<'simulasi' | 'komparasi' | 'jadwal'>('simulasi');

  // Print reference
  const printRef = useRef<HTMLDivElement>(null);

  // Standardize monthly interest rate
  const bungaBulananPercent = useMemo(() => {
    return bungaUnit === 'tahun' ? bungaValue / 12 : bungaValue;
  }, [bungaValue, bungaUnit]);

  // Handle Preset Selection
  const handleSelectJenis = (id: string) => {
    setSelectedJenisId(id);
    if (id === 'custom') return;

    const selected = jenisList.find((j) => j.id === id);
    if (selected) {
      setBungaValue(selected.sukuBunga);
      setBungaUnit('bulan');
      if (selected.tipeBunga === 'Flat' || selected.tipeBunga === 'Anuitas' || selected.tipeBunga === 'Menurun') {
        setTipeBunga(selected.tipeBunga);
      }
      setTenor(Math.min(selected.tenorMaksimal, 12));
      setBiayaAdminPercent(selected.biayaAdmin || 0);
    }
  };

  // Calculation logic for current selection
  const calcResult = useMemo(() => {
    const P = jumlah;
    const n = Math.max(1, tenor);
    const i = bungaBulananPercent / 100;
    const startDate = tanggalMulai ? new Date(tanggalMulai) : new Date();

    const schedule: ScheduleRow[] = [];
    let totalBunga = 0;
    let totalPembayaran = 0;
    let angsuranPertama = 0;
    let angsuranTerakhir = 0;
    let angsuranRataRata = 0;

    if (i === 0) {
      const pokokPerBulan = Math.round(P / n);
      let sisa = P;

      for (let k = 1; k <= n; k++) {
        const blnPokok = k === n ? sisa : pokokPerBulan;
        sisa -= blnPokok;
        schedule.push({
          bulan: k,
          tanggal: addMonths(startDate, k),
          angsuranPokok: blnPokok,
          angsuranBunga: 0,
          totalAngsuran: blnPokok,
          sisaPokok: Math.max(0, sisa),
        });
      }
      totalBunga = 0;
      totalPembayaran = P;
      angsuranPertama = pokokPerBulan;
      angsuranTerakhir = pokokPerBulan;
      angsuranRataRata = pokokPerBulan;
    } else if (tipeBunga === 'Flat') {
      const bungaPerBulan = Math.round(P * i);
      const pokokPerBulan = Math.round(P / n);
      const totalPerBulan = pokokPerBulan + bungaPerBulan;

      let sisa = P;
      for (let k = 1; k <= n; k++) {
        const blnPokok = k === n ? sisa : pokokPerBulan;
        sisa -= blnPokok;
        schedule.push({
          bulan: k,
          tanggal: addMonths(startDate, k),
          angsuranPokok: blnPokok,
          angsuranBunga: bungaPerBulan,
          totalAngsuran: blnPokok + bungaPerBulan,
          sisaPokok: Math.max(0, sisa),
        });
      }

      totalBunga = bungaPerBulan * n;
      totalPembayaran = P + totalBunga;
      angsuranPertama = totalPerBulan;
      angsuranTerakhir = totalPerBulan;
      angsuranRataRata = totalPerBulan;
    } else if (tipeBunga === 'Anuitas') {
      // Monthly installment formula A = P * i / (1 - (1+i)^-n)
      const A = Math.round((P * i) / (1 - Math.pow(1 + i, -n)));
      let sisa = P;

      for (let k = 1; k <= n; k++) {
        const bng = Math.round(sisa * i);
        let pk = A - bng;
        if (k === n) pk = sisa;

        sisa -= pk;
        totalBunga += bng;

        schedule.push({
          bulan: k,
          tanggal: addMonths(startDate, k),
          angsuranPokok: pk,
          angsuranBunga: bng,
          totalAngsuran: pk + bng,
          sisaPokok: Math.max(0, sisa),
        });
      }

      totalPembayaran = P + totalBunga;
      angsuranPertama = A;
      angsuranTerakhir = A;
      angsuranRataRata = A;
    } else if (tipeBunga === 'Menurun') {
      // Declining balance: Fixed principal, interest on remaining balance
      const pokokPerBulan = Math.round(P / n);
      let sisa = P;

      for (let k = 1; k <= n; k++) {
        const bng = Math.round(sisa * i);
        const pk = k === n ? sisa : pokokPerBulan;
        const tot = pk + bng;

        sisa -= pk;
        totalBunga += bng;

        if (k === 1) angsuranPertama = tot;
        if (k === n) angsuranTerakhir = tot;

        schedule.push({
          bulan: k,
          tanggal: addMonths(startDate, k),
          angsuranPokok: pk,
          angsuranBunga: bng,
          totalAngsuran: tot,
          sisaPokok: Math.max(0, sisa),
        });
      }

      totalPembayaran = P + totalBunga;
      angsuranRataRata = Math.round(totalPembayaran / n);
    } else if (tipeBunga === 'Syariah') {
      // Syariah Murabahah: Total Margin = P * i * n
      const totalMargin = Math.round(P * i * n);
      const totalAkad = P + totalMargin;
      const angsuranBulan = Math.round(totalAkad / n);
      const marginPerBulan = Math.round(totalMargin / n);
      const pokokPerBulan = Math.round(P / n);

      let sisa = P;
      for (let k = 1; k <= n; k++) {
        const pk = k === n ? sisa : pokokPerBulan;
        sisa -= pk;
        schedule.push({
          bulan: k,
          tanggal: addMonths(startDate, k),
          angsuranPokok: pk,
          angsuranBunga: marginPerBulan, // termed as margin
          totalAngsuran: pk + marginPerBulan,
          sisaPokok: Math.max(0, sisa),
        });
      }

      totalBunga = totalMargin;
      totalPembayaran = totalAkad;
      angsuranPertama = angsuranBulan;
      angsuranTerakhir = angsuranBulan;
      angsuranRataRata = angsuranBulan;
    }

    const nominalAdmin = Math.round(P * (biayaAdminPercent / 100));
    const nominalProvisi = Math.round(P * (biayaProvisiPercent / 100));
    const totalBiayaAwal = nominalAdmin + nominalProvisi;
    const pencairanBersih = P - totalBiayaAwal;

    return {
      totalPinjaman: P,
      totalBunga,
      totalPembayaran,
      angsuranPertama,
      angsuranTerakhir,
      angsuranRataRata,
      nominalAdmin,
      nominalProvisi,
      totalBiayaAwal,
      pencairanBersih,
      schedule,
    };
  }, [jumlah, tenor, tipeBunga, bungaBulananPercent, tanggalMulai, biayaAdminPercent, biayaProvisiPercent]);

  // Comparison logic across Flat, Anuitas, Menurun, Syariah for current parameters
  const comparisonResults = useMemo(() => {
    const P = jumlah;
    const n = Math.max(1, tenor);
    const i = bungaBulananPercent / 100;

    const calculateForType = (type: TipeBungaCalc) => {
      if (type === 'Flat') {
        const bPerBln = Math.round(P * i);
        const pPerBln = Math.round(P / n);
        const totalB = bPerBln * n;
        return {
          tipe: 'Flat',
          angsuranFirst: pPerBln + bPerBln,
          angsuranLast: pPerBln + bPerBln,
          totalBunga: totalB,
          totalBayar: P + totalB,
          ket: 'Pokok & Bunga tetap setiap bulan',
        };
      } else if (type === 'Anuitas') {
        const A = i === 0 ? Math.round(P / n) : Math.round((P * i) / (1 - Math.pow(1 + i, -n)));
        let sisa = P;
        let totB = 0;
        for (let k = 1; k <= n; k++) {
          const bng = Math.round(sisa * i);
          const pk = k === n ? sisa : A - bng;
          sisa -= pk;
          totB += bng;
        }
        return {
          tipe: 'Anuitas',
          angsuranFirst: A,
          angsuranLast: A,
          totalBunga: totB,
          totalBayar: P + totB,
          ket: 'Total angsuran tetap, porsi pokok naik & bunga turun',
        };
      } else if (type === 'Menurun') {
        const pPerBln = Math.round(P / n);
        let sisa = P;
        let totB = 0;
        let firstA = 0;
        let lastA = 0;
        for (let k = 1; k <= n; k++) {
          const bng = Math.round(sisa * i);
          const tot = pPerBln + bng;
          if (k === 1) firstA = tot;
          if (k === n) lastA = tot;
          sisa -= pPerBln;
          totB += bng;
        }
        return {
          tipe: 'Menurun',
          angsuranFirst: firstA,
          angsuranLast: lastA,
          totalBunga: totB,
          totalBayar: P + totB,
          ket: 'Pokok tetap, bunga dihitung dari sisa pinjaman (angsuran mengecil)',
        };
      } else {
        const totalMargin = Math.round(P * i * n);
        const angsuran = Math.round((P + totalMargin) / n);
        return {
          tipe: 'Syariah (Murabahah)',
          angsuranFirst: angsuran,
          angsuranLast: angsuran,
          totalBunga: totalMargin,
          totalBayar: P + totalMargin,
          ket: 'Margin disepakati awal dan rata tiap bulan',
        };
      }
    };

    return [
      calculateForType('Flat'),
      calculateForType('Anuitas'),
      calculateForType('Menurun'),
      calculateForType('Syariah'),
    ];
  }, [jumlah, tenor, bungaBulananPercent]);

  // Direct application handler
  const handleAjukan = () => {
    const query = new URLSearchParams({
      tab: 'Pengajuan',
      nominal: jumlah.toString(),
      tenor: tenor.toString(),
      tipeBunga: tipeBunga,
      bunga: bungaValue.toString(),
    }).toString();
    router.push(`/member/pinjaman?${query}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Kalkulator Keuangan Anggota
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simulasi Pinjaman Anggota
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Hitung estimasi angsuran, bandingkan berbagai tipe suku bunga (Flat, Anuitas, Menurun, & Syariah), dan periksa skedul pengembalian Anda secara rinci.
            </p>
          </div>
          <button
            onClick={handleAjukan}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
          >
            Ajukan Pinjaman Ini
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Controls & Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base">Parameter Pinjaman</h2>
                  <p className="text-xs text-slate-400">Atur jumlah, tenor & tipe bunga</p>
                </div>
              </div>
            </div>

            {/* Product Preset Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pilih Produk Koperasi
              </label>
              <select
                value={selectedJenisId}
                onChange={(e) => handleSelectJenis(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
                <option value="custom">✨ Mode Kustom Bebas</option>
                {jenisList.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama} ({j.sukuBunga}% /bln - {j.tipeBunga})
                  </option>
                ))}
              </select>
            </div>

            {/* Jumlah Pinjaman Input & Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jumlah Pinjaman
                </label>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {formatRupiah(jumlah)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                  Rp
                </span>
                <input
                  type="number"
                  min={1000000}
                  max={500000000}
                  step={500000}
                  value={jumlah}
                  onChange={(e) => setJumlah(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
              <input
                type="range"
                min={1000000}
                max={200000000}
                step={1000000}
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Rp 1 Jt</span>
                <span>Rp 100 Jt</span>
                <span>Rp 200 Jt</span>
              </div>
              {/* Quick Amount Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[5000000, 10000000, 25000000, 50000000, 100000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setJumlah(amt)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                      jumlah === amt
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {amt >= 100000000 ? `${amt / 100000000}00 Jt` : `${amt / 1000000} Jt`}
                  </button>
                ))}
              </div>
            </div>

            {/* Jangka Waktu / Tenor Input & Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tenor (Jangka Waktu)
                </label>
                <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {tenor} Bulan ({ (tenor / 12).toFixed(1) } Tahun)
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={60}
                step={1}
                value={tenor}
                onChange={(e) => setTenor(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>3 bln</span>
                <span>12 bln</span>
                <span>24 bln</span>
                <span>36 bln</span>
                <span>60 bln</span>
              </div>
              {/* Quick Tenor Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[6, 12, 18, 24, 36, 48, 60].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTenor(t)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                      tenor === t
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {t} Bln
                  </button>
                ))}
              </div>
            </div>

            {/* Tipe Perhitungan Bunga */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tipe Suku Bunga / Margin
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Flat', name: 'Flat (Tetap)', desc: 'Pokok & Bunga Tetap' },
                  { id: 'Anuitas', name: 'Anuitas', desc: 'Angsuran Tetap' },
                  { id: 'Menurun', name: 'Menurun', desc: 'Angsuran Mengecil' },
                  { id: 'Syariah', name: 'Syariah', desc: 'Margin Fixed' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTipeBunga(type.id as TipeBungaCalc)}
                    className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      tipeBunga === type.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    {tipeBunga === type.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute top-2.5 right-2.5" />
                    )}
                    <p className="font-bold text-xs">{type.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Suku Bunga Input with Unit Toggle (% per bulan vs % per tahun) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {tipeBunga === 'Syariah' ? 'Margin Suku Bunga' : 'Suku Bunga'}
                </label>
                {/* Toggle Unit */}
                <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setBungaUnit('bulan')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      bungaUnit === 'bulan'
                        ? 'bg-white text-emerald-700 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    % / Bulan
                  </button>
                  <button
                    type="button"
                    onClick={() => setBungaUnit('tahun')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      bungaUnit === 'tahun'
                        ? 'bg-white text-emerald-700 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    % / Tahun
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    step={bungaUnit === 'bulan' ? 0.1 : 0.5}
                    min={0}
                    max={50}
                    value={bungaValue}
                    onChange={(e) => setBungaValue(Math.max(0, Number(e.target.value)))}
                    className="w-full pr-8 pl-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    %
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-lg shrink-0">
                  ≈ {bungaBulananPercent.toFixed(2)}% / bulan
                </div>
              </div>
            </div>

            {/* Tanggal Mulai Pinjaman */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tanggal Mulai Pencairan
              </label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Results, Comparisons & Schedule (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs for Right Panel */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('simulasi')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'simulasi'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Hasil Ringkasan
            </button>
            <button
              onClick={() => setActiveTab('komparasi')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'komparasi'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Komparasi Metode
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'jadwal'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Jadwal Angsuran
            </button>
          </div>

          {/* TAB 1: Hasil Ringkasan Simulasi */}
          {activeTab === 'simulasi' && (
            <div className="space-y-6">
              {/* Highlight Card: Monthly Payment */}
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />

                <div className="flex items-center justify-between text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Estimasi Angsuran Per Bulan</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-100">
                    Bunga {tipeBunga}
                  </span>
                </div>

                <div className="my-2">
                  {tipeBunga === 'Menurun' ? (
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                        {formatRupiah(calcResult.angsuranPertama)} ~ {formatRupiah(calcResult.angsuranTerakhir)}
                      </div>
                      <p className="text-xs text-emerald-200 mt-1">
                        *Angsuran bulan ke-1 sebesar {formatRupiah(calcResult.angsuranPertama)} dan berangsur turun hingga {formatRupiah(calcResult.angsuranTerakhir)} di bulan terakhir.
                      </p>
                    </div>
                  ) : (
                    <div className="text-3xl sm:text-4xl font-extrabold text-amber-300">
                      {formatRupiah(calcResult.angsuranPertama)}
                      <span className="text-sm font-normal text-emerald-200 ml-2">/ bulan</span>
                    </div>
                  )}
                </div>

                {/* Progress breakdown bar */}
                <div className="mt-6 pt-6 border-t border-emerald-700/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-emerald-100">
                    <span>Komposisi Pengembalian</span>
                    <span>Total {formatRupiah(calcResult.totalPembayaran)}</span>
                  </div>
                  <div className="w-full h-3 bg-emerald-950/60 rounded-full overflow-hidden flex p-0.5 gap-0.5">
                    <div
                      style={{
                        width: `${Math.round((calcResult.totalPinjaman / calcResult.totalPembayaran) * 100)}%`,
                      }}
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      title="Pokok Pinjaman"
                    />
                    <div
                      style={{
                        width: `${Math.round((calcResult.totalBunga / calcResult.totalPembayaran) * 100)}%`,
                      }}
                      className="h-full bg-amber-400 rounded-full transition-all"
                      title="Total Bunga/Margin"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-emerald-200 font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                      Pokok ({Math.round((calcResult.totalPinjaman / calcResult.totalPembayaran) * 100)}%)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                      Bunga ({Math.round((calcResult.totalBunga / calcResult.totalPembayaran) * 100)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Detail Financial Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-medium text-slate-400">Total Pokok Pinjaman</span>
                  <p className="text-xl font-extrabold text-slate-800">
                    {formatRupiah(calcResult.totalPinjaman)}
                  </p>
                  <p className="text-[11px] text-slate-500">Nominal yang diajukan</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-medium text-slate-400">
                    {tipeBunga === 'Syariah' ? 'Total Margin Syariah' : 'Total Bunga Pinjaman'}
                  </span>
                  <p className="text-xl font-extrabold text-emerald-700">
                    {formatRupiah(calcResult.totalBunga)}
                  </p>
                  <p className="text-[11px] text-slate-500">Selama {tenor} bulan</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
                  <span className="text-xs font-medium text-slate-400">Total Pengembalian</span>
                  <p className="text-xl font-extrabold text-slate-900">
                    {formatRupiah(calcResult.totalPembayaran)}
                  </p>
                  <p className="text-[11px] text-slate-500">Pokok + Bunga/Margin</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-1">
                  <span className="text-xs font-medium text-emerald-800">Dana Bersih Diterima</span>
                  <p className="text-xl font-extrabold text-emerald-700">
                    {formatRupiah(calcResult.pencairanBersih)}
                  </p>
                  <p className="text-[11px] text-emerald-600">Pencairan setelah potong biaya</p>
                </div>
              </div>

              {/* Information Note */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Catatan Perhitungan Simulasi:</p>
                  <p className="text-amber-800 leading-relaxed">
                    Hasil kalkulasi ini bersifat estimasi awal untuk membantu perencanaan keuangan Anda. Nilai pasti dan persetujuan pengajuan akan ditentukan saat verifikasi berkas oleh pengurus UPK Mekarsari.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAjukan}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Ajukan Pinjaman Dengan Simulasi Ini
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('jadwal')}
                  className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
                >
                  Lihat Jadwal Angsuran
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Komparasi Metode Bunga */}
          {activeTab === 'komparasi' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      Perbandingan Metode Suku Bunga
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pinjaman {formatRupiah(jumlah)} dengan tenor {tenor} bulan ({bungaBulananPercent.toFixed(2)}% / bulan)
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                        <th className="py-3 px-3">Metode Bunga</th>
                        <th className="py-3 px-3">Angsuran Bln 1</th>
                        <th className="py-3 px-3">Angsuran Akhir</th>
                        <th className="py-3 px-3 text-right">Total Bunga</th>
                        <th className="py-3 px-3 text-right">Total Bayar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonResults.map((item) => {
                        const isCurrent = item.tipe.startsWith(tipeBunga);
                        return (
                          <tr
                            key={item.tipe}
                            onClick={() => {
                              if (item.tipe.includes('Flat')) setTipeBunga('Flat');
                              else if (item.tipe.includes('Anuitas')) setTipeBunga('Anuitas');
                              else if (item.tipe.includes('Menurun')) setTipeBunga('Menurun');
                              else if (item.tipe.includes('Syariah')) setTipeBunga('Syariah');
                            }}
                            className={`cursor-pointer transition-colors ${
                              isCurrent
                                ? 'bg-emerald-50/80 font-semibold text-emerald-950'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-2">
                                {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                                <div>
                                  <span className="font-bold block">{item.tipe}</span>
                                  <span className="text-[11px] text-slate-400 font-normal block">{item.ket}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {formatRupiah(item.angsuranFirst)}
                            </td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              {formatRupiah(item.angsuranLast)}
                            </td>
                            <td className="py-3.5 px-3 text-right font-bold text-emerald-700 whitespace-nowrap">
                              {formatRupiah(item.totalBunga)}
                            </td>
                            <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                              {formatRupiah(item.totalBayar)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <p className="font-bold text-slate-800">💡 Tips Memilih Metode Bunga:</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>
                      <strong>Flat:</strong> Cocok untuk anggota yang menyukai kepastian nominal angsuran tetap setiap bulannya.
                    </li>
                    <li>
                      <strong>Menurun:</strong> Menghasilkan <em>total beban bunga termurah</em> karena bunga dihitung berdasarkan sisa pokok yang terus berkurang.
                    </li>
                    <li>
                      <strong>Anuitas:</strong> Porsi angsuran per bulan konstan, sangat ideal untuk pengelolaan arus kas pribadi bulanan.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Tabel Jadwal Angsuran Complete */}
          {activeTab === 'jadwal' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">
                      Jadwal Pengembalian Angsuran
                    </h3>
                    <p className="text-xs text-slate-400">
                      Metode {tipeBunga} • Tenor {tenor} Bulan • Bunga {bungaBulananPercent.toFixed(2)}%/bln
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Jadwal
                  </button>
                </div>

                {/* Printable Schedule Table */}
                <div ref={printRef} className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold text-[11px] z-10">
                      <tr>
                        <th className="py-3 px-3 text-center">Bulan</th>
                        <th className="py-3 px-3">Tgl Jatuh Tempo</th>
                        <th className="py-3 px-3 text-right">Angsuran Pokok</th>
                        <th className="py-3 px-3 text-right">
                          {tipeBunga === 'Syariah' ? 'Margin' : 'Bunga'}
                        </th>
                        <th className="py-3 px-3 text-right">Total Angsuran</th>
                        <th className="py-3 px-3 text-right">Sisa Pokok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calcResult.schedule.map((row) => (
                        <tr key={row.bulan} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                            {row.bulan}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 font-medium">
                            {format(row.tanggal, 'dd MMM yyyy', { locale: localeID })}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-700">
                            {formatRupiah(row.angsuranPokok)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-emerald-700">
                            {formatRupiah(row.angsuranBunga)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                            {formatRupiah(row.totalAngsuran)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-500">
                            {formatRupiah(row.sisaPokok)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900 text-xs">
                      <tr>
                        <td colSpan={2} className="py-3 px-3 text-left uppercase tracking-wider">
                          Total Akumulasi
                        </td>
                        <td className="py-3 px-3 text-right">{formatRupiah(calcResult.totalPinjaman)}</td>
                        <td className="py-3 px-3 text-right text-emerald-700">{formatRupiah(calcResult.totalBunga)}</td>
                        <td className="py-3 px-3 text-right text-slate-900">{formatRupiah(calcResult.totalPembayaran)}</td>
                        <td className="py-3 px-3 text-right">Rp 0</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
