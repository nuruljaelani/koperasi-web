'use client';

import { useState, useMemo } from 'react';
import {
  ArrowLeft, Search, Filter, CheckCircle, XCircle,
  AlertCircle, Clock, ArrowUpRight, TrendingDown, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSimpananData, Simpanan } from '@/hooks/useSimpananData';
import { useAnggotaData } from '@/hooks/useAnggotaData';
import TableFilter, { FilterField } from '@/components/TableFilter';

type ActionModal = { row: Simpanan; action: 'approve' | 'reject' } | null;

export default function PenarikanPage() {
  const router = useRouter();
  const { dataList, isLoaded, updateSimpananStatus, getTotalByAnggota } = useSimpananData();
  const { anggotaList, isLoaded: anggotaLoaded } = useAnggotaData();

  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState<string[]>([]);
  const [tabFilter, setTabFilter] = useState<'Menunggu' | 'Selesai' | 'Ditolak'>('Menunggu');
  const [actionModal, setActionModal] = useState<ActionModal>(null);
  const [toastMsg, setToastMsg] = useState('');

  if (!isLoaded || !anggotaLoaded) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat...</div>;

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  /* ── Filter only penarikan ── */
  const penarikanOnly = dataList.filter(s => s.tipe === 'Penarikan');

  const filtered = penarikanOnly.filter(row => {
    const a = anggotaList.find(x => x.id === row.anggotaId);
    const matchSearch = !searchTerm ||
      a?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a?.nomorAnggota.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = jenisFilter.length === 0 || jenisFilter.includes(row.jenis);
    return matchSearch && matchJenis && row.status === tabFilter;
  }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const counts = {
    Menunggu: penarikanOnly.filter(s => s.status === 'Menunggu').length,
    Selesai: penarikanOnly.filter(s => s.status === 'Selesai').length,
    Ditolak: penarikanOnly.filter(s => s.status === 'Ditolak').length,
  };

  /* ── Handle action ── */
  const handleAction = () => {
    if (!actionModal) return;
    const newStatus = actionModal.action === 'approve' ? 'Selesai' : 'Ditolak';
    updateSimpananStatus(actionModal.row.id, newStatus);
    setToastMsg(actionModal.action === 'approve' ? 'Penarikan disetujui.' : 'Penarikan ditolak.');
    setActionModal(null);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const tabs = [
    { key: 'Menunggu' as const, label: 'Menunggu', icon: Clock, color: 'text-amber-600' },
    { key: 'Selesai' as const, label: 'Disetujui', icon: CheckCircle, color: 'text-emerald-600' },
    { key: 'Ditolak' as const, label: 'Ditolak', icon: XCircle, color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-400" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Proses Penarikan Simpanan</h1>
          <p className="text-slate-500 font-semibold mt-1">Setujui atau tolak permintaan penarikan dari anggota.</p>
        </div>
      </div>

      {/* Summary mini cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Menunggu', count: counts.Menunggu, color: 'border-amber-200 bg-amber-50', dot: 'bg-amber-500', text: 'text-amber-700' },
          { label: 'Disetujui', count: counts.Selesai, color: 'border-emerald-200 bg-emerald-50', dot: 'bg-emerald-500', text: 'text-emerald-700' },
          { label: 'Ditolak', count: counts.Ditolak, color: 'border-rose-200 bg-rose-50', dot: 'bg-rose-500', text: 'text-rose-700' },
        ].map(c => (
          <div key={c.label} className={`rounded-[24px] border p-5 ${c.color}`}>
            <div className={`text-3xl font-extrabold ${c.text}`}>{c.count}</div>
            <div className={`flex items-center gap-2 mt-1 text-sm font-bold ${c.text}`}>
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />{c.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex border-b border-slate-100">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTabFilter(t.key)} className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold text-sm transition-all ${tabFilter === t.key ? `${t.color} border-b-2 border-current bg-slate-50/50` : 'text-slate-400 hover:text-slate-600'}`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`px-2 py-0.5 rounded-lg text-xs font-extrabold ${tabFilter === t.key ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
          <TableFilter
            title="Saring Data"
            defaultOpen={false}
            fields={[
              {
                id: 'search',
                label: 'Pencarian',
                type: 'input',
                placeholder: 'Cari nama atau nomor anggota...',
                value: searchTerm,
                onChange: setSearchTerm
              },
              {
                id: 'jenis',
                label: 'Jenis Simpanan',
                type: 'checkbox',
                value: jenisFilter,
                onChange: setJenisFilter,
                options: [
                  { label: 'Simpanan Sukarela', value: 'Sukarela' },
                  { label: 'Simpanan Wajib', value: 'Wajib' },
                  { label: 'Simpanan Pokok', value: 'Pokok' }
                ]
              }
            ]}
            onReset={(searchTerm || jenisFilter.length > 0) ? () => {
              setSearchTerm('');
              setJenisFilter([]);
            } : undefined}
          />
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <TrendingDown className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-bold">Tidak ada transaksi di kategori ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Anggota', 'Jenis', 'Jumlah Diminta', 'Saldo Tersedia', 'Tanggal', 'Keterangan', tabFilter === 'Menunggu' ? 'Aksi' : 'Status'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-extrabold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => {
                  const a = anggotaList.find(x => x.id === row.anggotaId);
                  const saldo = getTotalByAnggota(row.anggotaId);
                  const insufficientFunds = row.jumlah > saldo;
                  return (
                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{a?.nama || '—'}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{a?.nomorAnggota || '—'}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${row.jenis === 'Sukarela' ? 'bg-amber-50 text-amber-600' : row.jenis === 'Wajib' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{row.jenis}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-extrabold text-rose-600 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" />{formatRupiah(row.jumlah)}</span>
                        {insufficientFunds && tabFilter === 'Menunggu' && (
                          <span className="flex items-center gap-1 text-rose-400 text-xs font-bold mt-0.5"><AlertCircle className="w-3 h-3" /> Saldo tidak cukup</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{formatRupiah(saldo)}</td>
                      <td className="px-5 py-4 text-slate-500 font-medium text-sm">
                        {new Date(row.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-sm max-w-[180px] truncate">{row.keterangan}</td>
                      <td className="px-5 py-4">
                        {tabFilter === 'Menunggu' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setActionModal({ row, action: 'approve' })}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors active:scale-95"
                            >
                              <CheckCircle className="w-4 h-4" /> Setujui
                            </button>
                            <button
                              onClick={() => setActionModal({ row, action: 'reject' })}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors active:scale-95"
                            >
                              <XCircle className="w-4 h-4" /> Tolak
                            </button>
                          </div>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${row.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{row.status === 'Selesai' ? 'Disetujui' : 'Ditolak'}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${actionModal.action === 'approve' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
              {actionModal.action === 'approve'
                ? <CheckCircle className="w-8 h-8 text-emerald-500" />
                : <XCircle className="w-8 h-8 text-rose-500" />}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">
              {actionModal.action === 'approve' ? 'Setujui Penarikan?' : 'Tolak Penarikan?'}
            </h3>
            {(() => {
              const a = anggotaList.find(x => x.id === actionModal.row.anggotaId);
              return (
                <p className="text-slate-500 text-center font-medium text-sm mb-6">
                  {actionModal.action === 'approve' ? 'Penarikan' : 'Penolakan'} <span className="font-bold text-slate-800">{formatRupiah(actionModal.row.jumlah)}</span> untuk <span className="font-bold text-slate-800">{a?.nama}</span> akan dikonfirmasi.
                </p>
              );
            })()}
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-colors active:scale-[0.98]">Batal</button>
              <button onClick={handleAction} className={`flex-1 py-3.5 text-white font-bold rounded-2xl transition-colors active:scale-[0.98] shadow-lg ${actionModal.action === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'}`}>
                {actionModal.action === 'approve' ? 'Ya, Setujui' : 'Ya, Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
