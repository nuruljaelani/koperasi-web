'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBeritaData, useBeritaDetail, type Berita } from '@/hooks/useContentData';
import { ArrowLeft, Calendar, Tag, Share2, Check, Clock, Newspaper } from 'lucide-react';

const KATEGORI_COLOR: Record<string, string> = {
  Pengumuman: 'bg-blue-100 text-blue-700',
  Layanan: 'bg-emerald-100 text-emerald-700',
  'Kisah Sukses': 'bg-amber-100 text-amber-700',
  Sosial: 'bg-pink-100 text-pink-700',
  Kegiatan: 'bg-purple-100 text-purple-700',
  Lainnya: 'bg-slate-100 text-slate-600',
};

export default function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { items: allBerita } = useBeritaData();
  const { data: serverBerita, isLoading: isQueryLoading } = useBeritaDetail(id);
  const berita: Berita | null = serverBerita || allBerita.find((b) => b.id === id || b.slug === id) || null;
  const isLoading = isQueryLoading && !berita;
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const related = allBerita
    .filter((b) => b.id !== berita?.id && b.status === 'published')
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memuat artikel berita...</p>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
          <Newspaper size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Berita Tidak Ditemukan</h2>
        <p className="text-slate-500 max-w-md mb-6">
          Artikel yang Anda tuju mungkin telah dipindahkan atau belum dipublikasikan oleh redaksi koperasi.
        </p>
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb / Back */}
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  KATEGORI_COLOR[berita.kategori] || 'bg-slate-100 text-slate-700'
                }`}
              >
                {berita.kategori}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Calendar size={13} />
                {berita.tanggal}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Clock size={13} />
                3 menit baca
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {berita.judul}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium border-l-4 border-emerald-500 pl-4 py-1 italic bg-emerald-50/40 rounded-r-xl">
              {berita.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          {berita.gambar && (
            <div className="relative w-full h-[280px] sm:h-[420px] rounded-2xl overflow-hidden shadow-md">
              <img
                src={berita.gambar}
                alt={berita.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base sm:text-lg font-normal">
            {berita.konten ? (
              berita.konten.split('\n\n').map((paragraph: string, idx: number) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="leading-relaxed">{berita.excerpt}</p>
            )}
          </div>

          {/* Share Section */}
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
              <Share2 size={16} />
              <span>Bagikan kabar baik ini:</span>
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              {copied ? 'Tautan Tersalin ke Clipboard!' : 'Salin Tautan Berita'}
            </button>
          </div>
        </article>

        {/* Related News */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Kabar Lainnya</h3>
              <Link href="/berita" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.gambar || '/images/berita-1.png'}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      {item.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-slate-400 mt-auto">{item.tanggal}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
