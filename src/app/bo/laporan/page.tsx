'use client';

import { useState, useMemo, useRef } from 'react';
import { useSimpananData } from '@/hooks/useSimpananData';
import { usePinjamanData } from '@/hooks/usePinjamanData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Filter,
  Calendar,
  Search,
  Building2,
  TrendingUp,
  TrendingDown,
  WalletCards,
  PiggyBank,
  Users,
  PieChart,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

type ReportType = 'simpanan' | 'pinjaman' | 'keuangan' | 'anggota' | 'shu';
type PeriodePreset = 'bulan_ini' | 'triwulan' | 'tahun_ini' | 'kustom';

export default function AdminLaporanPage() {
  const { dataList: simpananList } = useSimpananData();
  const { dataList: pinjamanList } = usePinjamanData();
  const { dataList: anggotaList } = useAnggotaData();
  const { dataList: jenisList } = useJenisPinjamanData();

  // Active Report Category Tab
  const [reportType, setReportType] = useState<ReportType>('simpanan');

  // Filter States
  const [periodePreset, setPeriodePreset] = useState<PeriodePreset>('bulan_ini');
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('semua');

  // Print Modal State
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  // Handle Preset Change
  const handlePresetChange = (preset: PeriodePreset) => {
    setPeriodePreset(preset);
    const now = new Date();

    if (preset === 'bulan_ini') {
      setStartDate(format(startOfMonth(now), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
    } else if (preset === 'triwulan') {
      setStartDate(format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd'));
      setEndDate(format(endOfMonth(now), 'yyyy-MM-dd'));
    } else if (preset === 'tahun_ini') {
      setStartDate(`${now.getFullYear()}-01-01`);
      setEndDate(`${now.getFullYear()}-12-31`);
    }
  };

  // Helper map for Anggota Names
  const anggotaMap = useMemo(() => {
    const map = new Map<string, string>();
    (anggotaList || []).forEach((a) => map.set(a.id, a.nama));
    return map;
  }, [anggotaList]);

  // Helper map for Jenis Pinjaman
  const jenisMap = useMemo(() => {
    const map = new Map<string, string>();
    (jenisList || []).forEach((j) => map.set(j.id, j.nama));
    return map;
  }, [jenisList]);

  // Filtered Data based on Date Range & Search
  const filteredData = useMemo(() => {
    const start = startDate ? new Date(startDate) : new Date(2020, 0, 1);
    const end = endDate ? new Date(`${endDate}T23:59:59`) : new Date();

    if (reportType === 'simpanan') {
      return (simpananList || []).filter((s) => {
        const itemDate = s.tanggal ? new Date(s.tanggal) : new Date();
        const inDateRange = itemDate >= start && itemDate <= end;
        const namaAnggota = anggotaMap.get(s.anggotaId) || '';
        const matchSearch =
          !searchTerm ||
          namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (s.id && s.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (s.keterangan && s.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || s.tipe === statusFilter;
        return inDateRange && matchSearch && matchStatus;
      });
    }

    if (reportType === 'pinjaman') {
      return (pinjamanList || []).filter((p) => {
        const itemDate = p.tanggalPengajuan ? new Date(p.tanggalPengajuan) : new Date();
        const inDateRange = itemDate >= start && itemDate <= end;
        const namaAnggota = anggotaMap.get(p.anggotaId) || '';
        const matchSearch =
          !searchTerm ||
          namaAnggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.nomorPinjaman && p.nomorPinjaman.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || p.status === statusFilter;
        return inDateRange && matchSearch && matchStatus;
      });
    }

    if (reportType === 'anggota') {
      return (anggotaList || []).filter((a) => {
        const matchSearch =
          !searchTerm ||
          (a.nama && a.nama.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (a.nik && a.nik.includes(searchTerm)) ||
          (a.nomorHp && a.nomorHp.includes(searchTerm)) ||
          (a.nomorAnggota && a.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchStatus = statusFilter === 'semua' || a.status === statusFilter;
        return matchSearch && matchStatus;
      });
    }

    if (reportType === 'shu') {
      return (anggotaList || []).map((a) => {
        const mySimpanan = (simpananList || [])
          .filter((s) => s.anggotaId === a.id)
          .reduce((sum, s) => sum + (s.tipe === 'Setoran' ? s.jumlah : -s.jumlah), 0);
        const myPinjaman = (pinjamanList || [])
          .filter((p) => p.anggotaId === a.id && (p.status === 'Cair' || p.status === 'Lunas'))
          .reduce((sum, p) => sum + p.jumlahPengajuan, 0);

        const shuSimpanan = Math.round(mySimpanan * 0.05);
        const shuPinjaman = Math.round(myPinjaman * 0.03);
        const totalShu = shuSimpanan + shuPinjaman;

        return {
          id: a.id,
          nomorAnggota: a.nomorAnggota || '-',
          nama: a.nama || '-',
          totalSimpanan: Math.max(0, mySimpanan),
          totalPinjaman: myPinjaman,
          shuSimpanan,
          shuPinjaman,
          totalShu,
        };
      }).filter((item) => {
        return (
          !searchTerm ||
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return [];
  }, [reportType, simpananList, pinjamanList, anggotaList, startDate, endDate, searchTerm, statusFilter, anggotaMap]);

  // Aggregated Metrics for Header Cards
  const metrics = useMemo(() => {
    if (reportType === 'simpanan') {
      const data = filteredData as typeof simpananList;
      const totalSetoran = data.filter((s) => s.tipe === 'Setoran').reduce((acc, s) => acc + s.jumlah, 0);
      const totalPenarikan = data.filter((s) => s.tipe === 'Penarikan').reduce((acc, s) => acc + s.jumlah, 0);
      const saldoNetto = totalSetoran - totalPenarikan;
      return {
        card1Title: 'Total Setoran',
        card1Val: formatRupiah(totalSetoran),
        card2Title: 'Total Penarikan',
        card2Val: formatRupiah(totalPenarikan),
        card3Title: 'Arus Bersih (Netto)',
        card3Val: formatRupiah(saldoNetto),
        card4Title: 'Jumlah Transaksi',
        card4Val: `${data.length} Trx`,
      };
    }

    if (reportType === 'pinjaman') {
      const data = filteredData as typeof pinjamanList;
      const totalDisalurkan = data.filter((p) => p.status === 'Cair' || p.status === 'Lunas').reduce((acc, p) => acc + p.jumlahPengajuan, 0);
      const totalCairCount = data.filter((p) => p.status === 'Cair').length;
      const totalReviewCount = data.filter((p) => p.status === 'Review').length;
      return {
        card1Title: 'Total Pinjaman Cair',
        card1Val: formatRupiah(totalDisalurkan),
        card2Title: 'Pinjaman Aktif (Cair)',
        card2Val: `${totalCairCount} Berkas`,
        card3Title: 'Menunggu Review',
        card3Val: `${totalReviewCount} Berkas`,
        card4Title: 'Total Berkas Masuk',
        card4Val: `${data.length} Pengajuan`,
      };
    }

    if (reportType === 'keuangan') {
      const totalSimpanan = (simpananList || []).reduce((acc, s) => acc + (s.tipe === 'Setoran' ? s.jumlah : -s.jumlah), 0);
      const totalPinjamanCair = (pinjamanList || []).filter((p) => p.status === 'Cair').reduce((acc, p) => acc + p.jumlahPengajuan, 0);
      const estimasiBunga = Math.round(totalPinjamanCair * 0.015 * 12);
      const kasKoperasi = Math.max(0, totalSimpanan - totalPinjamanCair + 500000000);

      return {
        card1Title: 'Estimasi Kas & Bank',
        card1Val: formatRupiah(kasKoperasi),
        card2Title: 'Portofolio Simpanan',
        card2Val: formatRupiah(totalSimpanan),
        card3Title: 'Pinjaman Beredar (Cair)',
        card3Val: formatRupiah(totalPinjamanCair),
        card4Title: 'Est. Pendapatan Bunga (Thn)',
        card4Val: formatRupiah(estimasiBunga),
      };
    }

    if (reportType === 'anggota') {
      const data = filteredData as typeof anggotaList;
      const aktifCount = data.filter((a) => a.status === 'Aktif').length;
      const nonAktifCount = data.filter((a) => a.status !== 'Aktif').length;
      return {
        card1Title: 'Total Anggota Registered',
        card1Val: `${data.length} Orang`,
        card2Title: 'Anggota Aktif',
        card2Val: `${aktifCount} Orang`,
        card3Title: 'Anggota Non-Aktif',
        card3Val: `${nonAktifCount} Orang`,
        card4Title: 'Rasio Keaktifan',
        card4Val: `${data.length > 0 ? Math.round((aktifCount / data.length) * 100) : 0}%`,
      };
    }

    if (reportType === 'shu') {
      const data = filteredData as Array<{ totalShu: number; shuSimpanan: number; shuPinjaman: number }>;
      const totalSHU = data.reduce((acc, item) => acc + item.totalShu, 0);
      const totalSHUSimpanan = data.reduce((acc, item) => acc + item.shuSimpanan, 0);
      const totalSHUPinjaman = data.reduce((acc, item) => acc + item.shuPinjaman, 0);
      return {
        card1Title: 'Total Alokasi SHU',
        card1Val: formatRupiah(totalSHU),
        card2Title: 'SHU Jasa Simpanan (50%)',
        card2Val: formatRupiah(totalSHUSimpanan),
        card3Title: 'SHU Jasa Pinjaman (50%)',
        card3Val: formatRupiah(totalSHUPinjaman),
        card4Title: 'Penerima SHU',
        card4Val: `${data.length} Anggota`,
      };
    }

    return {
      card1Title: '-', card1Val: '-',
      card2Title: '-', card2Val: '-',
      card3Title: '-', card3Val: '-',
      card4Title: '-', card4Val: '-',
    };
  }, [reportType, filteredData, simpananList, pinjamanList, anggotaList]);

  // Export CSV Handler
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];

    if (reportType === 'simpanan') {
      headers = ['No', 'ID Transaksi', 'Anggota', 'Jenis Simpanan', 'Tipe', 'Tanggal', 'Jumlah (Rp)'];
      const data = filteredData as typeof simpananList;
      rows = data.map((s, idx) => [
        (idx + 1).toString(),
        s.id || `-`,
        `"${anggotaMap.get(s.anggotaId) || s.anggotaId}"`,
        s.jenis,
        s.tipe,
        s.tanggal ? format(new Date(s.tanggal), 'dd/MM/yyyy') : '-',
        s.jumlah.toString(),
      ]);
    } else if (reportType === 'pinjaman') {
      headers = ['No', 'Nomor Pinjaman', 'Anggota', 'Jenis Pinjaman', 'Jumlah (Rp)', 'Tenor (Bln)', 'Status', 'Tanggal Pengajuan'];
      const data = filteredData as typeof pinjamanList;
      rows = data.map((p, idx) => [
        (idx + 1).toString(),
        p.nomorPinjaman,
        `"${anggotaMap.get(p.anggotaId) || p.anggotaId}"`,
        `"${jenisMap.get(p.jenisPinjamanId) || p.jenisPinjamanId}"`,
        p.jumlahPengajuan.toString(),
        p.tenor.toString(),
        p.status,
        format(new Date(p.tanggalPengajuan), 'dd/MM/yyyy'),
      ]);
    } else if (reportType === 'anggota') {
      headers = ['No', 'Nomor Anggota', 'Nama Lengkap', 'NIK', 'No Telepon', 'Alamat', 'Status'];
      const data = filteredData as typeof anggotaList;
      rows = data.map((a, idx) => [
        (idx + 1).toString(),
        a.nomorAnggota,
        `"${a.nama}"`,
        `'${a.nik}`,
        `'${a.nomorHp}`,
        `"${a.alamat}"`,
        a.status,
      ]);
    } else if (reportType === 'shu') {
      headers = ['No', 'No Anggota', 'Nama Anggota', 'Total Simpanan (Rp)', 'Total Pinjaman (Rp)', 'SHU Simpanan (Rp)', 'SHU Pinjaman (Rp)', 'Total SHU (Rp)'];
      const data = filteredData as Array<any>;
      rows = data.map((item, idx) => [
        (idx + 1).toString(),
        item.nomorAnggota,
        `"${item.nama}"`,
        item.totalSimpanan.toString(),
        item.totalPinjaman.toString(),
        item.shuSimpanan.toString(),
        item.shuPinjaman.toString(),
        item.totalShu.toString(),
      ]);
    } else if (reportType === 'keuangan') {
      headers = ['Kategori Keuangan', 'Nilai (Rp)', 'Keterangan'];
      rows = [
        ['Estimasi Kas & Bank Koperasi', (metrics.card1Val || '0').replace(/\D/g, ''), 'Kas berjalan'],
        ['Total Portofolio Simpanan Anggota', (metrics.card2Val || '0').replace(/\D/g, ''), 'Kewajiban kepada anggota'],
        ['Total Pinjaman Beredar (Cair)', (metrics.card3Val || '0').replace(/\D/g, ''), 'Piutang pinjaman'],
        ['Est. Pendapatan Bunga Per Tahun', (metrics.card4Val || '0').replace(/\D/g, ''), 'Estimasi pendapatan operasional'],
      ];
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Laporan_${reportType.toUpperCase()}_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPrintModal = () => {
    setShowPrintModal(true);
  };

  const handleExecutePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2 sm:p-4">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Pusat Pelaporan Koperasi
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Laporan & Rekapitulasi Executive
          </h1>
          <p className="text-slate-500 text-sm">
            Generate, filter, dan ekspor seluruh laporan transaksi keuangan, simpanan, pinjaman, dan SHU anggota.
          </p>
        </div>
        {/* Export Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel (.csv)
          </button>
          <button
            onClick={handleOpenPrintModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Export PDF / Cetak
          </button>
        </div>
      </div>

      {/* Main Report Category Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-hide">
        {[
          { id: 'simpanan', label: 'Laporan Simpanan', icon: PiggyBank },
          { id: 'pinjaman', label: 'Laporan Pinjaman', icon: WalletCards },
          { id: 'keuangan', label: 'Ringkasan Keuangan', icon: TrendingUp },
          { id: 'anggota', label: 'Rekapitulasi Anggota', icon: Users },
          { id: 'shu', label: 'Distribusi SHU', icon: PieChart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = reportType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as ReportType)}
              className={`flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-white text-emerald-800 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Periode Preset Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5" /> Periode:
            </span>
            {[
              { id: 'bulan_ini', label: 'Bulan Ini' },
              { id: 'triwulan', label: 'Triwulan (3 Bln)' },
              { id: 'tahun_ini', label: 'Tahun Ini' },
              { id: 'kustom', label: 'Kustom Tanggal' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id as PeriodePreset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  periodePreset === p.id
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Date Pickers */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriodePreset('kustom');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-400 font-bold">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriodePreset('kustom');
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Second Filter Row: Search & Status Dropdown */}
        <div className="grid md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kata kunci nama anggota, ID transaksi, NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {reportType !== 'keuangan' && reportType !== 'shu' && (
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="semua">Semua Status</option>
                {reportType === 'simpanan' && (
                  <>
                    <option value="Setoran">Setoran</option>
                    <option value="Penarikan">Penarikan</option>
                  </>
                )}
                {reportType === 'pinjaman' && (
                  <>
                    <option value="Cair">Aktif (Cair)</option>
                    <option value="Review">Dalam Review</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Ditolak">Ditolak</option>
                  </>
                )}
                {reportType === 'anggota' && (
                  <>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </>
                )}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Key Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: metrics.card1Title, val: metrics.card1Val, bg: 'bg-emerald-50', text: 'text-emerald-800' },
          { title: metrics.card2Title, val: metrics.card2Val, bg: 'bg-blue-50', text: 'text-blue-800' },
          { title: metrics.card3Title, val: metrics.card3Val, bg: 'bg-purple-50', text: 'text-purple-800' },
          { title: metrics.card4Title, val: metrics.card4Val, bg: 'bg-amber-50', text: 'text-amber-800' },
        ].map((card, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-1`}>
            <span className="text-xs font-medium text-slate-400 block">{card.title}</span>
            <p className={`text-xl sm:text-2xl font-extrabold ${card.text}`}>{card.val}</p>
          </div>
        ))}
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              Pratinjau Data Laporan {reportType.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-400">
              Menampilkan {filteredData.length} baris data transaksi untuk periode terfilter.
            </p>
          </div>
        </div>

        {/* Table Content Based on Report Type */}
        <div className="overflow-x-auto">
          {reportType === 'simpanan' && (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Nama Anggota</th>
                  <th className="py-3 px-4">Jenis Simpanan</th>
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(filteredData as typeof simpananList).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{s.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{anggotaMap.get(s.anggotaId) || s.anggotaId}</td>
                    <td className="py-3 px-4 text-slate-600">{s.jenis}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.tipe === 'Setoran' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {s.tipe}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{s.tanggal ? format(new Date(s.tanggal), 'dd MMM yyyy', { locale: localeID }) : '-'}</td>
                    <td className={`py-3 px-4 text-right font-bold ${s.tipe === 'Setoran' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {s.tipe === 'Setoran' ? '+' : '-'}{formatRupiah(s.jumlah)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'pinjaman' && (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Pinjaman</th>
                  <th className="py-3 px-4">Nama Anggota</th>
                  <th className="py-3 px-4">Jenis Pinjaman</th>
                  <th className="py-3 px-4 text-center">Tenor</th>
                  <th className="py-3 px-4">Tgl Pengajuan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Jumlah Pinjaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(filteredData as typeof pinjamanList).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{p.nomorPinjaman}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{anggotaMap.get(p.anggotaId) || p.anggotaId}</td>
                    <td className="py-3 px-4 text-slate-600">{jenisMap.get(p.jenisPinjamanId) || p.jenisPinjamanId}</td>
                    <td className="py-3 px-4 text-center font-medium">{p.tenor} Bln</td>
                    <td className="py-3 px-4 text-slate-500">{format(new Date(p.tanggalPengajuan), 'dd MMM yyyy', { locale: localeID })}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${p.status === 'Cair' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">{formatRupiah(p.jumlahPengajuan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'anggota' && (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Anggota</th>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">NIK</th>
                  <th className="py-3 px-4">Telepon</th>
                  <th className="py-3 px-4">Alamat</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(filteredData as typeof anggotaList).map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{a.nomorAnggota}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{a.nama}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{a.nik}</td>
                    <td className="py-3 px-4 text-slate-600">{a.nomorHp}</td>
                    <td className="py-3 px-4 text-slate-500 truncate max-w-xs">{a.alamat}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${a.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'shu' && (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Anggota</th>
                  <th className="py-3 px-4">Nama Anggota</th>
                  <th className="py-3 px-4 text-right">Tot. Simpanan</th>
                  <th className="py-3 px-4 text-right">Tot. Pinjaman</th>
                  <th className="py-3 px-4 text-right">SHU Jasa Simpanan</th>
                  <th className="py-3 px-4 text-right">SHU Jasa Pinjaman</th>
                  <th className="py-3 px-4 text-right">Total Est. SHU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(filteredData as Array<any>).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{item.nomorAnggota}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{item.nama}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatRupiah(item.totalSimpanan)}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{formatRupiah(item.totalPinjaman)}</td>
                    <td className="py-3 px-4 text-right font-medium text-emerald-700">{formatRupiah(item.shuSimpanan)}</td>
                    <td className="py-3 px-4 text-right font-medium text-blue-700">{formatRupiah(item.shuPinjaman)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">{formatRupiah(item.totalShu)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'keuangan' && (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Pos Laporan Keuangan</th>
                  <th className="py-3.5 px-6 text-right">Nilai Nominal (Rp)</th>
                  <th className="py-3.5 px-6">Keterangan Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">1. Kas & Setara Kas Koperasi</td>
                  <td className="py-4 px-6 text-right font-bold text-emerald-700">{metrics.card1Val}</td>
                  <td className="py-4 px-6 text-slate-500">Likuiditas kas siap pakai di bank & brankas</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">2. Portofolio Simpanan Anggota</td>
                  <td className="py-4 px-6 text-right font-bold text-blue-700">{metrics.card2Val}</td>
                  <td className="py-4 px-6 text-slate-500">Kewajiban simpanan pokok, wajib & sukarela</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">3. Portofolio Pinjaman Beredar</td>
                  <td className="py-4 px-6 text-right font-bold text-purple-700">{metrics.card3Val}</td>
                  <td className="py-4 px-6 text-slate-500">Piutang pembiayaan yang sedang berjalan di anggota</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-bold text-slate-800">4. Est. Pendapatan Bunga Operasional (Tahun)</td>
                  <td className="py-4 px-6 text-right font-bold text-amber-700">{metrics.card4Val}</td>
                  <td className="py-4 px-6 text-slate-500">Proyeksi bagi hasil & pendapatan jasa pinjaman</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Official PDF / Print Preview Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Pratinjau Laporan Resmi Cetak (PDF)</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExecutePrint}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" /> Cetak / Save PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official Report Document Area */}
            <div className="space-y-6 p-4 border border-slate-200 rounded-2xl bg-white">
              {/* Official Kop Surat */}
              <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                <div className="flex items-center justify-center gap-3">
                  <Building2 className="w-8 h-8 text-emerald-700" />
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-wide uppercase">
                    UNIT PENGELOLA KEGIATAN (UPK) MEKARSARI
                  </h2>
                </div>
                <p className="text-xs text-slate-600">
                  Jl. Mekarsari No. 12 RT 03 RW 05, Bandung, Jawa Barat • Telp: (022) 5678901 • Email: info@upkmekarsari.co.id
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  SK Pendirian: SK/BH/PAD/XVI/IV/2010 • NPWP: 12.345.678.9-012.000
                </p>
              </div>

              {/* Document Metadata */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-slate-800 uppercase underline">
                  LAPORAN REKAPITULASI {reportType.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Periode Tanggal: {format(new Date(startDate), 'dd MMMM yyyy', { locale: localeID })} s/d {format(new Date(endDate), 'dd MMMM yyyy', { locale: localeID })}
                </p>
              </div>

              {/* Brief Summary Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">{metrics.card1Title}</span>
                  <span className="font-bold text-slate-800">{metrics.card1Val}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{metrics.card2Title}</span>
                  <span className="font-bold text-slate-800">{metrics.card2Val}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{metrics.card3Title}</span>
                  <span className="font-bold text-slate-800">{metrics.card3Val}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{metrics.card4Title}</span>
                  <span className="font-bold text-slate-800">{metrics.card4Val}</span>
                </div>
              </div>

              {/* Printable Table Summary */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Keterangan / Subjek</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3 text-right">Nilai Nominal (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredData.slice(0, 15).map((item: any, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium">
                          {item.nama || item.nomorPinjaman || item.id || `Transaksi #${idx + 1}`}
                        </td>
                        <td className="py-2 px-3 text-slate-500">
                          {item.jenis || item.status || 'Umum'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold">
                          {formatRupiah(item.jumlah || item.jumlahPengajuan || item.totalShu || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Official Signatures Block */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
                <div className="space-y-12">
                  <p className="text-slate-500">Mengetahui,<br /><strong className="text-slate-800">Ketua Koperasi UPK Mekarsari</strong></p>
                  <p className="font-bold text-slate-900 underline">( H. Ahmad Subarkah, S.E. )</p>
                </div>
                <div className="space-y-12">
                  <p className="text-slate-500">Bandung, {format(new Date(), 'dd MMMM yyyy', { locale: localeID })}<br /><strong className="text-slate-800">Bendahara / Admin Utama</strong></p>
                  <p className="font-bold text-slate-900 underline">( Hj. Nurul Jaelani, M.M. )</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
