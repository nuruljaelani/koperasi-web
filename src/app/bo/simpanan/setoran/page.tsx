'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Upload, CheckCircle2, AlertCircle,
  User, Banknote, FileText, ChevronDown, X, Download
} from 'lucide-react';
import { useSimpananData, SimpananJenis } from '@/hooks/useSimpananData';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';

type Tab = 'manual' | 'bulk';

interface BulkRow {
  nomorAnggota: string;
  jenis: SimpananJenis;
  jumlah: number;
  keterangan: string;
  valid: boolean;
  error?: string;
  anggota?: Anggota;
}

export default function SetoranPage() {
  const router = useRouter();
  const { addSimpanan, addBulkSimpanan } = useSimpananData();
  const { anggotaList, isLoaded } = useAnggotaData();

  const [tab, setTab] = useState<Tab>('manual');

  /* ── Manual Form State ── */
  const [selectedAnggota, setSelectedAnggota] = useState('');
  const [jenis, setJenis] = useState<SimpananJenis>('Wajib');
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [anggotaSearch, setAnggotaSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);
  const [manualError, setManualError] = useState('');

  /* ── Bulk State ── */
  const fileRef = useRef<HTMLInputElement>(null);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkSaved, setBulkSaved] = useState(false);
  const [bulkError, setBulkError] = useState('');

  if (!isLoaded) return <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat...</div>;

  const formatRupiah = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

  /* ── Manual Submit ── */
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    if (!selectedAnggota) { setManualError('Pilih anggota terlebih dahulu.'); return; }
    const jumlahNum = parseInt(jumlah.replace(/\D/g, ''), 10);
    if (!jumlahNum || jumlahNum < 1000) { setManualError('Jumlah minimal Rp 1.000.'); return; }
    addSimpanan(selectedAnggota, jenis, jumlahNum, keterangan || `Setoran ${jenis}`, 'Setoran', 'Selesai');
    setManualSuccess(true);
    setSelectedAnggota(''); setJumlah(''); setKeterangan(''); setAnggotaSearch('');
    setTimeout(() => setManualSuccess(false), 3500);
  };

  const filteredAnggota = anggotaList.filter(a =>
    a.nama.toLowerCase().includes(anggotaSearch.toLowerCase()) ||
    a.nomorAnggota.toLowerCase().includes(anggotaSearch.toLowerCase())
  );
  const selectedAnggotaData = anggotaList.find(a => a.id === selectedAnggota);

  /* ── Bulk CSV Parse ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkError('');
    setBulkSaved(false);
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      // Skip header row
      const dataLines = lines.slice(1);
      const rows: BulkRow[] = dataLines.map(line => {
        const [nomorAnggota, jenisRaw, jumlahRaw, keteranganRaw] = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        const anggota = anggotaList.find(a => a.nomorAnggota === nomorAnggota);
        const validJenis: SimpananJenis[] = ['Pokok', 'Wajib', 'Sukarela'];
        const jenisVal = jenisRaw as SimpananJenis;
        const jumlahNum = parseInt(jumlahRaw?.replace(/\D/g, ''), 10);
        let valid = true;
        let error = '';
        if (!anggota) { valid = false; error = 'Anggota tidak ditemukan'; }
        else if (!validJenis.includes(jenisVal)) { valid = false; error = `Jenis tidak valid: ${jenisRaw}`; }
        else if (!jumlahNum || jumlahNum < 1000) { valid = false; error = 'Jumlah tidak valid'; }
        return { nomorAnggota, jenis: jenisVal, jumlah: jumlahNum, keterangan: keteranganRaw || `Setoran ${jenisVal}`, valid, error, anggota };
      });
      setBulkRows(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleBulkSave = () => {
    const valid = bulkRows.filter(r => r.valid && r.anggota);
    if (!valid.length) { setBulkError('Tidak ada data valid untuk disimpan.'); return; }
    addBulkSimpanan(valid.map(r => ({
      anggotaId: r.anggota!.id,
      jenis: r.jenis,
      jumlah: r.jumlah,
      tanggal: new Date().toISOString(),
      keterangan: r.keterangan,
      tipe: 'Setoran',
      status: 'Selesai',
    })));
    setBulkSaved(true);
    setBulkRows([]);
  };

  const downloadTemplate = () => {
    const csv = 'NomorAnggota,Jenis,Jumlah,Keterangan\nA-1001,Wajib,150000,Simpanan wajib Mei 2026\nA-1002,Sukarela,500000,Setoran sukarela';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'template_setoran.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors active:scale-95 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Input Setoran Simpanan</h1>
          <p className="text-slate-500 font-semibold mt-1">Catat setoran anggota secara manual atau unggah file bulk.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex border-b border-slate-100">
          {(['manual', 'bulk'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-4 font-bold text-sm transition-all ${tab === t ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
              {t === 'manual' ? '✍️  Input Manual' : '📋  Bulk Upload (CSV)'}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* ── MANUAL TAB ── */}
          {tab === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              {manualSuccess && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Setoran berhasil dicatat!
                </div>
              )}
              {manualError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 font-bold animate-in fade-in duration-300">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {manualError}
                </div>
              )}

              {/* Anggota Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pilih Anggota <span className="text-rose-500">*</span></label>
                {selectedAnggotaData ? (
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {selectedAnggotaData.nama.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{selectedAnggotaData.nama}</div>
                        <div className="text-xs text-slate-500">{selectedAnggotaData.nomorAnggota}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => setSelectedAnggota('')} className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                      <User className="w-5 h-5 text-slate-400 ml-1 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Cari nama atau nomor anggota..."
                        className="flex-1 bg-transparent outline-none text-slate-700 font-medium text-sm placeholder:text-slate-400"
                        value={anggotaSearch}
                        onChange={e => { setAnggotaSearch(e.target.value); setShowDropdown(true); }}
                        onFocus={() => setShowDropdown(true)}
                      />
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                    {showDropdown && (
                      <div className="absolute z-20 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl max-h-52 overflow-y-auto">
                        {filteredAnggota.length === 0
                          ? <div className="p-4 text-sm text-slate-400 text-center">Anggota tidak ditemukan</div>
                          : filteredAnggota.map(a => (
                            <button key={a.id} type="button" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left" onClick={() => { setSelectedAnggota(a.id); setAnggotaSearch(a.nama); setShowDropdown(false); }}>
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm flex-shrink-0">{a.nama.charAt(0)}</div>
                              <div>
                                <div className="font-bold text-slate-800 text-sm">{a.nama}</div>
                                <div className="text-xs text-slate-500">{a.nomorAnggota}</div>
                              </div>
                            </button>
                          ))
                        }
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Jenis */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Simpanan <span className="text-rose-500">*</span></label>
                  <select value={jenis} onChange={e => setJenis(e.target.value as SimpananJenis)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-700 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-50 appearance-none cursor-pointer">
                    <option value="Pokok">Simpanan Pokok</option>
                    <option value="Wajib">Simpanan Wajib</option>
                    <option value="Sukarela">Simpanan Sukarela</option>
                  </select>
                </div>

                {/* Jumlah */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Jumlah Setoran <span className="text-rose-500">*</span></label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                    <Banknote className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="0"
                      className="flex-1 bg-transparent outline-none text-slate-700 font-bold text-sm"
                      value={jumlah ? parseInt(jumlah.replace(/\D/g, '') || '0', 10).toLocaleString('id-ID') : ''}
                      onChange={e => setJumlah(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  {jumlah && (
                    <p className="mt-1.5 text-xs font-bold text-emerald-600 ml-1">
                      {formatRupiah(parseInt(jumlah.replace(/\D/g, '') || '0', 10))}
                    </p>
                  )}
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Keterangan</label>
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <FileText className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <textarea
                    rows={3}
                    placeholder={`Setoran ${jenis} - ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`}
                    className="flex-1 bg-transparent outline-none text-slate-700 font-medium text-sm resize-none placeholder:text-slate-400"
                    value={keterangan}
                    onChange={e => setKeterangan(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] text-base">
                <Plus className="w-5 h-5" /> Simpan Setoran
              </button>
            </form>
          )}

          {/* ── BULK TAB ── */}
          {tab === 'bulk' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">Upload file CSV untuk input setoran sekaligus untuk banyak anggota.</p>
                <button onClick={downloadTemplate} className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                  <Download className="w-4 h-4" /> Unduh Template
                </button>
              </div>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
                onClick={() => fileRef.current?.click()}
              >
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                <Upload className="w-10 h-10 text-slate-300 group-hover:text-emerald-400 mx-auto mb-3 transition-colors" />
                <p className="text-slate-600 font-bold">Klik untuk pilih file CSV</p>
                <p className="text-slate-400 text-sm mt-1">Format: NomorAnggota, Jenis, Jumlah, Keterangan</p>
              </div>

              {bulkSaved && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-bold animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  Data berhasil disimpan!
                </div>
              )}
              {bulkError && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 font-bold">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" /> {bulkError}
                </div>
              )}

              {bulkRows.length > 0 && (
                <>
                  <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                    <div className="px-5 py-3 text-xs font-extrabold text-slate-500 uppercase tracking-wider grid grid-cols-5 border-b border-slate-200">
                      <span>No. Anggota</span><span>Nama</span><span>Jenis</span><span>Jumlah</span><span>Status</span>
                    </div>
                    {bulkRows.map((row, i) => (
                      <div key={i} className={`px-5 py-3.5 grid grid-cols-5 text-sm items-center border-b border-slate-100 last:border-0 ${!row.valid ? 'bg-rose-50/50' : ''}`}>
                        <span className="font-bold text-slate-700">{row.nomorAnggota}</span>
                        <span className="font-medium text-slate-600">{row.anggota?.nama || '—'}</span>
                        <span className="font-medium text-slate-600">{row.jenis}</span>
                        <span className="font-bold text-emerald-700">{row.jumlah ? formatRupiah(row.jumlah) : '—'}</span>
                        <span>
                          {row.valid
                            ? <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> Valid</span>
                            : <span className="flex items-center gap-1 text-rose-500 font-bold text-xs"><AlertCircle className="w-4 h-4" /> {row.error}</span>
                          }
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium">
                      <span className="text-emerald-600 font-bold">{bulkRows.filter(r => r.valid).length}</span> valid,{' '}
                      <span className="text-rose-500 font-bold">{bulkRows.filter(r => !r.valid).length}</span> error
                    </span>
                    <button onClick={handleBulkSave} disabled={!bulkRows.some(r => r.valid)} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" /> Simpan {bulkRows.filter(r => r.valid).length} Data Valid
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
