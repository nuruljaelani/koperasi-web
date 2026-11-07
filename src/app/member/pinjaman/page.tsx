'use client';

import { useMemo, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  pengajuanPinjamanMemberSchema,
  type PengajuanPinjamanMemberFormValues,
} from '@/lib/validations/pinjaman';
import { useAuth } from '@/hooks/useAuth';
import { usePinjamanData, Pinjaman } from '@/hooks/usePinjamanData';
import { useJenisPinjamanData } from '@/hooks/useJenisPinjamanData';
import { uploadApi } from '@/lib/api';
import TableFilter from '@/components/TableFilter';
import Modal from '@/components/ui/Modal';
import {
  Loader2,
  WalletCards,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  AlertCircle,
  FileText,
  Eye,
  FileUp,
  Download,
  Calculator,
  ExternalLink,
} from 'lucide-react';
import { addMonths, format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { toast } from 'sonner';

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy', { locale: localeID });
  } catch {
    return dateStr;
  }
};

const STATUS_COLOR: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  Cair: { label: 'Aktif (Cair)', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 },
  Lunas: { label: 'Lunas', bg: 'bg-blue-50', text: 'text-blue-600', icon: CheckCircle2 },
  Draft: { label: 'Draft', bg: 'bg-slate-50', text: 'text-slate-600', icon: FileText },
  Review: { label: 'Dalam Review', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock },
  Disetujui: { label: 'Disetujui', bg: 'bg-teal-50', text: 'text-teal-600', icon: CheckCircle2 },
  Ditolak: { label: 'Ditolak', bg: 'bg-rose-50', text: 'text-rose-600', icon: XCircle },
};

function PinjamanContent() {
  const { user } = useAuth();
  const { isLoaded: pjLoaded, getByAnggotaId, addData } = usePinjamanData();
  const { dataList: jenisList, isLoaded: jpLoaded } = useJenisPinjamanData();

  const [activeTab, setActiveTab] = useState<'Riwayat' | 'Pengajuan'>('Riwayat');
  const [searchTerm, setSearchTerm] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Simulasi UI Modal Detail
  const [selectedPinjaman, setSelectedPinjaman] = useState<Pinjaman | null>(null);

  // Form state using React Hook Form & Zod
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadedDocs, setUploadedDocs] = useState<{ jenis: string, file: File | null }[]>([
    { jenis: 'KTP', file: null },
    { jenis: 'KK', file: null },
    { jenis: 'Dokumen Agunan (BPKB dll)', file: null },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = useForm<PengajuanPinjamanMemberFormValues>({
    resolver: zodResolver(pengajuanPinjamanMemberSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      jenisPinjamanId: '',
      jumlahPengajuan: '',
      tenor: 0,
      tujuanPinjaman: '',
    },
  });

  const watchJenisId = watch('jenisPinjamanId');
  const watchJumlah = watch('jumlahPengajuan');
  const watchTenor = watch('tenor');

  const selectedJenis = useMemo(
    () => jenisList.find((j) => j.id === watchJenisId),
    [jenisList, watchJenisId]
  );

  const anggotaId = user?.anggotaId ?? '';
  const myPinjaman = useMemo(() => getByAnggotaId(anggotaId), [getByAnggotaId, anggotaId]);

  const { riwayat, pengajuan } = useMemo(() => {
    const filtered = myPinjaman.filter(p => {
      const pNo = p.nomorPinjaman || '';
      const matchSearch = !searchTerm || pNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchJenis = !jenisFilter || p.jenisPinjamanId === jenisFilter;
      return matchSearch && matchJenis;
    });
    const r = filtered.filter(p => p.status === 'Cair' || p.status === 'Lunas');
    const p = filtered.filter(p => !['Cair', 'Lunas'].includes(p.status));
    return { riwayat: r, pengajuan: p };
  }, [myPinjaman, searchTerm, jenisFilter]);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const nominalParam = searchParams.get('nominal');
      const tenorParam = searchParams.get('tenor');
      const tabParam = searchParams.get('tab');
      if (nominalParam) {
        const numValue = parseInt(nominalParam, 10);
        if (!isNaN(numValue)) {
          setValue('jumlahPengajuan', new Intl.NumberFormat('id-ID').format(numValue), {
            shouldValidate: true,
            shouldTouch: true,
          });
        }
      }
      if (tenorParam) {
        const tVal = parseInt(tenorParam, 10);
        if (!isNaN(tVal)) {
          setValue('tenor', tVal, { shouldValidate: true, shouldTouch: true });
        }
      }
      if (tabParam === 'Pengajuan' || nominalParam) {
        setIsModalOpen(true);
      }
    }
  }, [searchParams, setValue]);

  if (!pjLoaded || !jpLoaded || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const handleJumlahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue, 10);
    const formatted = !isNaN(numValue) ? new Intl.NumberFormat('id-ID').format(numValue) : '';
    setValue('jumlahPengajuan', formatted, {
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newDocs = [...uploadedDocs];
      newDocs[index].file = e.target.files[0];
      setUploadedDocs(newDocs);
    }
  };

  const onValidSubmit = async (values: PengajuanPinjamanMemberFormValues, isDraft: boolean) => {
    setErrorMsg('');
    const numPinjam = parseInt(values.jumlahPengajuan.replace(/\D/g, ''), 10);

    if (selectedJenis) {
      if (selectedJenis.plafonMin && selectedJenis.plafonMin > 0 && numPinjam < selectedJenis.plafonMin) {
        const msg = `Nominal pengajuan minimal ${formatRupiah(selectedJenis.plafonMin)} untuk ${selectedJenis.nama}.`;
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }
      if (selectedJenis.plafonMax && selectedJenis.plafonMax > 0 && numPinjam > selectedJenis.plafonMax) {
        const msg = `Nominal pengajuan maksimal ${formatRupiah(selectedJenis.plafonMax)} untuk ${selectedJenis.nama}.`;
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }
    }

    const unuploaded = uploadedDocs.filter(d => !d.file && d.jenis !== 'Dokumen Agunan (BPKB dll)');
    if (!isDraft && unuploaded.length > 0) {
      const msg = 'Harap upload dokumen KTP dan KK.';
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      let docUrls: Array<{ jenis: string; namaFile: string; url: string }> = [];
      try {
        docUrls = await Promise.all(
          uploadedDocs
            .filter((d) => d.file)
            .map(async (d) => {
              try {
                const res = await uploadApi.uploadFile({
                  file: d.file!,
                  folder: 'koperasi/pinjaman',
                });
                return {
                  jenis: d.jenis,
                  namaFile: d.file?.name || '',
                  url: res?.data?.url || '#',
                };
              } catch (err) {
                console.warn('Gagal upload berkas ke Cloudinary:', err);
                return {
                  jenis: d.jenis,
                  namaFile: d.file?.name || '',
                  url: '#',
                };
              }
            })
        );
      } catch (uploadErr) {
        console.warn('Error saat upload dokumen pinjaman:', uploadErr);
      }

      await addData({
        anggotaId,
        jenisPinjamanId: values.jenisPinjamanId,
        jumlahPengajuan: numPinjam,
        tenor: values.tenor,
        tanggalPengajuan: new Date().toISOString(),
        tujuanPinjaman: values.tujuanPinjaman,
        status: isDraft ? 'Draft' : 'Review',
        dokumenPersyaratan: docUrls,
        catatanAdmin: '',
      });

      if (isDraft) {
        toast.info('Pengajuan pinjaman disimpan sebagai draft');
      } else {
        toast.success('Pengajuan pinjaman beserta berkas berhasil dikirimkan!');
      }

      setIsModalOpen(false);
      reset();
      setUploadedDocs(uploadedDocs.map(d => ({ ...d, file: null })));
      setActiveTab('Pengajuan');
    } catch (submitErr: any) {
      const msg = submitErr?.message || 'Gagal mengajukan pinjaman. Silakan periksa kembali formulir Anda.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = () => {
    const curJenisId = watch('jenisPinjamanId');
    const curJumlah = watch('jumlahPengajuan');
    if (!curJenisId || !curJumlah) {
      toast.error('Harap pilih jenis pinjaman dan nominal untuk draft.');
      return;
    }
    const currentValues: PengajuanPinjamanMemberFormValues = {
      jenisPinjamanId: curJenisId,
      jumlahPengajuan: curJumlah,
      tenor: watchTenor || 1,
      tujuanPinjaman: watch('tujuanPinjaman') || 'Draft Pengajuan',
    };
    onValidSubmit(currentValues, true);
  };

  // Kalkulasi Jadwal Angsuran
  const renderJadwalAngsuran = (p: Pinjaman) => {
    const jenis = jenisList.find(j => j.id === p.jenisPinjamanId);
    if (!jenis) return null;

    const schedules = [];
    const pokokPinjaman = p.jumlahPengajuan;
    let sisaPokok = pokokPinjaman;
    let angsuranPokok = pokokPinjaman / p.tenor;

    const tglMulai = parseISO(p.tanggalPengajuan);

    const sukuBungaBulanan = (jenis.sukuBunga / 12) / 100;

    for (let i = 1; i <= p.tenor; i++) {
      let bungaBulanIni = 0;
      
      if (jenis.tipeBunga === 'Flat' || jenis.tipeBunga === 'Anuitas') {
        bungaBulanIni = pokokPinjaman * sukuBungaBulanan;
      } else if (jenis.tipeBunga === 'Menurun') {
        bungaBulanIni = sisaPokok * sukuBungaBulanan;
      }

      const totalAngsuran = angsuranPokok + bungaBulanIni;
      sisaPokok -= angsuranPokok;

      // Simulasi status bulan: bulan yg sudah lewat dr tanggal hari ini (kita mock)
      const tglJatuhTempo = addMonths(tglMulai, i);
      const isPast = tglJatuhTempo.getTime() < new Date().getTime();

      schedules.push({
        bulanKe: i,
        tglJatuhTempo,
        pokok: angsuranPokok,
        bunga: bungaBulanIni,
        total: totalAngsuran,
        sisaPokok: Math.max(0, sisaPokok),
        status: isPast && p.status === 'Cair' ? 'Lunas' : 'Belum Bayar'
      });
    }

    return (
      <div className="mt-4 border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Bulan</th>
                <th className="px-4 py-3 whitespace-nowrap">Jatuh Tempo</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Pokok</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Bunga</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Total Angsuran</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Sisa Hutang</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map((row) => (
                <tr key={row.bulanKe} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{row.bulanKe}</td>
                  <td className="px-4 py-3">{format(row.tglJatuhTempo, 'dd MMM yyyy', { locale: localeID })}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(row.pokok)}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(row.bunga)}</td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-700">{formatRupiah(row.total)}</td>
                  <td className="px-4 py-3 text-right">{formatRupiah(row.sisaPokok)}</td>
                  <td className="px-4 py-3 text-center">
                    {row.status === 'Lunas' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">Lunas</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-xs font-bold border border-amber-100">Belum Bayar</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pinjaman Saya</h1>
          <p className="text-slate-500">Kelola pinjaman dan status pengajuan Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/member/simulasi"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-colors"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Kalkulator Simulasi</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors active:scale-95 shadow-[0_4px_12px_rgba(5,150,105,0.2)]"
          >
            <Plus className="w-5 h-5" />
            <span>Ajukan Pinjaman</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('Riwayat')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'Riwayat'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Riwayat Pinjaman ({riwayat.length})
        </button>
        <button
          onClick={() => setActiveTab('Pengajuan')}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === 'Pengajuan'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          Status Pengajuan ({pengajuan.length})
        </button>
      </div>

      <TableFilter
        title="Saring Data Pinjaman"
        fields={[
          {
            id: 'search',
            label: 'Cari Nomor',
            type: 'input',
            placeholder: 'Nomor pinjaman...',
            value: searchTerm,
            onChange: setSearchTerm
          },
          {
            id: 'jenis',
            label: 'Jenis Pinjaman',
            type: 'select',
            value: jenisFilter,
            onChange: setJenisFilter,
            options: [
              { label: 'Semua Jenis', value: '' },
              ...jenisList.map(j => ({ label: j.nama, value: j.id }))
            ]
          }
        ]}
        onReset={(searchTerm || jenisFilter) ? () => {
          setSearchTerm('');
          setJenisFilter('');
        } : undefined}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
        {(activeTab === 'Riwayat' ? riwayat : pengajuan).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <WalletCards className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm font-medium">Belum ada data pinjaman.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {([...(activeTab === 'Riwayat' ? riwayat : pengajuan)])
              .sort((a, b) => new Date(b.tanggalPengajuan).getTime() - new Date(a.tanggalPengajuan).getTime())
              .map((p) => {
                const statusInfo = STATUS_COLOR[p.status] || {
                  label: p.status || 'Draft',
                  bg: 'bg-slate-50',
                  text: 'text-slate-600',
                  icon: Clock,
                };
                const StatusIcon = statusInfo.icon || Clock;
                const jp = jenisList.find(j => j.id === p.jenisPinjamanId);
                const isSelected = selectedPinjaman?.id === p.id;
                const borderClass = (statusInfo.text || 'text-slate-600').replace('text', 'border');

                return (
                  <div key={p.id} className={`rounded-xl border ${isSelected ? 'border-emerald-200' : 'border-slate-200'} overflow-hidden transition-all duration-300`}>
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/30' : ''}`}
                      onClick={() => activeTab === 'Riwayat' && setSelectedPinjaman(isSelected ? null : p)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusInfo.bg || 'bg-slate-50'} ${statusInfo.text || 'text-slate-600'}`}>
                          <WalletCards className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-bold text-slate-800 text-sm md:text-base">{p.nomorPinjaman}</p>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-600">
                              {jp?.nama || 'Unknown'}
                            </span>
                            <span className={`${statusInfo.text} ${statusInfo.bg} border ${borderClass} px-2 py-0.5 rounded text-[10px] uppercase font-bold flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" /> {statusInfo.label}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            <p>Tujuan: {p.tujuanPinjaman}</p>
                            <p className="mt-0.5">Tanggal Pengajuan: {formatDate(p.tanggalPengajuan)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sm:text-right mt-4 sm:mt-0 pl-16 sm:pl-0 flex flex-col justify-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Plafon</p>
                        <p className="font-extrabold text-lg text-slate-800">{formatRupiah(p.jumlahPengajuan)}</p>
                        <p className="text-xs text-slate-500 font-medium">{p.tenor} Bulan {jp?.tipeBunga && `· ${jp.tipeBunga} ${jp.sukuBunga}%`}</p>
                      </div>
                    </div>

                    {/* Expandable Details - Riwayat */}
                    {isSelected && activeTab === 'Riwayat' && (
                      <div className="p-4 border-t border-emerald-100 bg-white">
                        <h4 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
                          <Eye className="w-4 h-4" /> Jadwal Angsuran & Detail
                        </h4>
                        {renderJadwalAngsuran(p)}
                      </div>
                    )}
                    
                    {/* Expandable Details - Pengajuan */}
                    {activeTab === 'Pengajuan' && (
                      <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm">
                        <div className="flex flex-col gap-2">
                          <div>
                            <span className="text-slate-500 font-medium block mb-1.5">Berkas / Dokumen Persyaratan:</span>
                            {Array.isArray(p.dokumenPersyaratan) && p.dokumenPersyaratan.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {p.dokumenPersyaratan.map((d: any, idx: number) => {
                                  const nama = typeof d === 'string' ? d : d?.jenis || d?.namaFile || `Dokumen ${idx + 1}`;
                                  const url = typeof d === 'object' && d?.url ? d.url : (typeof d === 'string' && d.startsWith('http') ? d : null);
                                  const isHttp = url && url.startsWith('http');
                                  return isHttp ? (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold transition-all hover:shadow-sm"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      {nama}
                                      <ExternalLink className="w-3 h-3 text-emerald-500" />
                                    </a>
                                  ) : (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/70 text-slate-700 rounded-xl text-xs font-medium"
                                    >
                                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                                      {nama}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Belum ada dokumen yang dilampirkan</span>
                            )}
                          </div>
                          {p.catatanAdmin && (
                            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 mt-1">
                              <span className="font-semibold text-xs uppercase block mb-1">Catatan Admin:</span>
                              {p.catatanAdmin}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Modal Pengajuan Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form Pengajuan Pinjaman Baru"
        description="Lengkapi formulir dan dokumen persyaratan untuk mengajukan pinjaman baru."
        size="2xl"
      >
        <form onSubmit={handleSubmit((data) => onValidSubmit(data, false))} className="p-6 space-y-6">
          {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl flex items-start gap-2 border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Jenis Pinjaman <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('jenisPinjamanId')}
                    onChange={(e) => {
                      register('jenisPinjamanId').onChange(e);
                      setValue('tenor', 0, { shouldValidate: true });
                    }}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 outline-none transition-all ${
                      errors.jenisPinjamanId
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  >
                    <option value="" disabled>
                      {!jpLoaded
                        ? 'Memuat data jenis pinjaman...'
                        : jenisList.length === 0
                        ? 'Belum ada jenis pinjaman tersedia'
                        : 'Pilih Jenis Pinjaman'}
                    </option>
                    {jenisList
                      .filter((j) => j.status === 'Aktif')
                      .map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.nama} {j.kode ? `(${j.kode})` : ''} - {j.sukuBunga}% / thn ({j.tipeBunga})
                        </option>
                      ))}
                  </select>
                  {errors.jenisPinjamanId && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.jenisPinjamanId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tenor (Bulan) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('tenor', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 outline-none disabled:opacity-50 transition-all ${
                      errors.tenor
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                    disabled={!watchJenisId || !selectedJenis}
                  >
                    <option value="0" disabled>
                      {!watchJenisId ? 'Pilih jenis pinjaman terlebih dahulu' : 'Pilih Tenor'}
                    </option>
                    {selectedJenis &&
                      Array.from({
                        length:
                          (selectedJenis.tenorMaksimal || 12) -
                          (selectedJenis.tenorMinimal || 1) +
                          1,
                      }).map((_, i) => {
                        const val = (selectedJenis.tenorMinimal || 1) + i;
                        return (
                          <option key={val} value={val}>
                            {val} Bulan
                          </option>
                        );
                      })}
                  </select>
                  {errors.tenor && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.tenor.message}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Nominal Pengajuan (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={watchJumlah || ''}
                    onChange={handleJumlahChange}
                    onBlur={() => trigger('jumlahPengajuan')}
                    placeholder="Misal: 10.000.000"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 font-bold outline-none transition-all ${
                      errors.jumlahPengajuan
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.jumlahPengajuan && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.jumlahPengajuan.message}
                    </p>
                  )}
                  {selectedJenis && (
                    <div className="text-xs mt-2 space-y-1 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                      <p className="flex items-center gap-1.5 font-medium text-emerald-800">
                        <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Suku Bunga:</span>
                        <strong>{selectedJenis.sukuBunga}% / tahun ({selectedJenis.tipeBunga})</strong>
                      </p>
                      {((selectedJenis.plafonMin ?? 0) > 0 || (selectedJenis.plafonMax ?? 0) > 0) && (
                        <p className="text-slate-600">
                          Batas Plafon:{' '}
                          <span className="font-semibold text-slate-800">
                            {formatRupiah(selectedJenis.plafonMin || 0)} s/d {formatRupiah(selectedJenis.plafonMax || 0)}
                          </span>
                        </p>
                      )}
                      {(selectedJenis.biayaAdmin ?? 0) > 0 && (
                        <p className="text-slate-600">
                          Biaya Admin:{' '}
                          <span className="font-semibold text-slate-800">{selectedJenis.biayaAdmin}%</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tujuan Pinjaman <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    {...register('tujuanPinjaman')}
                    placeholder="Ceritakan singkat tujuan penggunaan dana pinjaman ini..."
                    rows={3}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-800 outline-none resize-none transition-all ${
                      errors.tujuanPinjaman
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                    }`}
                  />
                  {errors.tujuanPinjaman && (
                    <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.tujuanPinjaman.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Upload Dokumen */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-4">Upload Dokumen Persyaratan</h4>
                <div className="grid gap-3">
                  {uploadedDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${doc.file ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                          <FileUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                            {doc.jenis}
                            {doc.jenis !== 'Dokumen Agunan (BPKB dll)' && <span className="text-rose-500 text-xs">*</span>}
                          </p>
                          <p className="text-xs text-slate-500 truncate w-32 md:w-64">
                            {doc.file ? doc.file.name : 'Format PDF/JPG (Max 5MB)'}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(idx, e)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button type="button" className={`px-4 py-2 text-xs font-bold rounded-lg border ${doc.file ? 'border-slate-300 bg-white text-slate-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                          {doc.file ? 'Ganti File' : 'Pilih File'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDraft}
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  Simpan Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(5,150,105,0.2)]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                  ) : (
                    <>Ajukan Sekarang</>
                  )}
                </button>
              </div>
          </form>
        </Modal>
    </div>
  );
}

export default function PinjamanPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    }>
      <PinjamanContent />
    </Suspense>
  );
}
