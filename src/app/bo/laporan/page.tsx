'use client';

import { useState, useMemo } from 'react';
import { useSimpananData } from '@/hooks/useSimpananData';
import { usePinjamanData } from '@/hooks/usePinjamanData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import {
  useLaporanKolektibilitas,
  useLaporanSentra,
  useLaporanSHU,
} from '@/hooks/useLaporanData';
import {
  FileSpreadsheet,
  Printer,
  Sparkles,
  PiggyBank,
  WalletCards,
  ShieldAlert,
  Building2,
  TrendingUp,
  Users,
  PieChart,
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

import { ReportType, PeriodePreset } from './types';
import { exportLaporanToCsv } from './utils/exportCsv';
import { useLaporanFilter } from './hooks/useLaporanFilter';
import { LaporanFilterBar } from './components/LaporanFilterBar';
import { LaporanKpiCards } from './components/LaporanKpiCards';
import { LaporanTable } from './components/LaporanTable';
import { LaporanPrintModal } from './components/LaporanPrintModal';

export default function AdminLaporanPage() {
  const { dataList: simpananList } = useSimpananData();
  const { dataList: pinjamanList } = usePinjamanData();
  const { dataList: anggotaList } = useAnggotaData();
  const { dataList: jenisList } = useJenisPinjamanData();

  // Queries for specialized backend reports
  const { data: kolReport, isLoading: kolLoading } = useLaporanKolektibilitas();
  const { data: sentraReport, isLoading: sentraLoading } = useLaporanSentra();
  const { data: shuReport } = useLaporanSHU();

  // Active Report Category Tab
  const [reportType, setReportType] = useState<ReportType>('simpanan');

  // Filter States
  const [periodePreset, setPeriodePreset] = useState<PeriodePreset>('bulan_ini');
  const [startDate, setStartDate] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
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

  // Compute Filtered Data and KPI Metrics via custom hook
  const { filteredData, metrics } = useLaporanFilter({
    reportType,
    startDate,
    endDate,
    searchTerm,
    statusFilter,
    simpananList: simpananList || [],
    pinjamanList: pinjamanList || [],
    anggotaList: anggotaList || [],
    kolReport,
    sentraReport,
    shuReport,
    anggotaMap,
  });

  const handleExportCSV = () => {
    exportLaporanToCsv({
      reportType,
      filteredData,
      anggotaMap,
      jenisMap,
      metrics,
    });
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
            Generate, filter, dan ekspor seluruh laporan transaksi keuangan, simpanan, pinjaman, dan
            SHU anggota.
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
            onClick={() => setShowPrintModal(true)}
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
          { id: 'kolektibilitas', label: 'Kolektibilitas & NPL', icon: ShieldAlert },
          { id: 'sentra', label: 'Rekap Sentra / Wilayah', icon: Building2 },
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
      <LaporanFilterBar
        periodePreset={periodePreset}
        startDate={startDate}
        endDate={endDate}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        reportType={reportType}
        onPresetChange={handlePresetChange}
        onStartDateChange={(v) => {
          setStartDate(v);
          setPeriodePreset('kustom');
        }}
        onEndDateChange={(v) => {
          setEndDate(v);
          setPeriodePreset('kustom');
        }}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      {/* KPI Key Financial Metrics */}
      <LaporanKpiCards metrics={metrics} />

      {/* Data Preview Table */}
      <LaporanTable
        reportType={reportType}
        filteredData={filteredData}
        anggotaMap={anggotaMap}
        jenisMap={jenisMap}
        metrics={metrics}
        kolReport={kolReport}
        kolLoading={kolLoading}
        sentraLoading={sentraLoading}
      />

      {/* Official PDF / Print Preview Modal */}
      <LaporanPrintModal
        show={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        reportType={reportType}
        startDate={startDate}
        endDate={endDate}
        metrics={metrics}
        filteredData={filteredData}
      />
    </div>
  );
}
