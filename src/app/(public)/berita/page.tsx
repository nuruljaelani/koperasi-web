'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBeritaData } from '@/hooks/useContentData';
import { Search, Calendar, ArrowRight, Newspaper } from 'lucide-react';

const KATEGORI_LIST = ['Semua', 'Pengumuman', 'Layanan', 'Kisah Sukses', 'Sosial', 'Kegiatan'];

const KATEGORI_COLOR: Record<string, string> = {
  Pengumuman: 'bg-blue-100 text-blue-700',
  Layanan: 'bg-emerald-100 text-emerald-700',
  'Kisah Sukses': 'bg-amber-100 text-amber-700',
  Sosial: 'bg-pink-100 text-pink-700',
  Kegiatan: 'bg-purple-100 text-purple-700',
  Lainnya: 'bg-slate-100 text-slate-600',
};

export default function BeritaPage() {
  const { items, isLoading } = useBeritaData();
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [search, setSearch] = useState('');

  const published = items.filter((b) => b.status === 'published');

  const filtered = published.filter((b) => {
    const matchCat = selectedKategori === 'Semua' || b.kategori === selectedKategori;
    const matchSearch =
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const beritaUtama = published.find((b) => b.isUtama) || published[0];
  const listToRender = filtered.filter((b) => b.id !== (selectedKategori === 'Semua' && !search ? beritaUtama?.id : null));

  return (
    <>
      {/* Hero */}
      <section className="page-hero py-12 lg:py-16 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Newspaper size={14} />
            Kabar & Informasi Terkini
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Berita & Pengumuman</h1>
          <p className="text-emerald-100/80 max-w-xl mx-auto text-base sm:text-lg">
            Kabar terbaru, agenda kegiatan, dan kisah sukses anggota Koperasi Simpan Pinjam UPK Mekarsari.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="bg-neutral-50/60 py-10 lg:py-16 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Featured News (Only on Default view without search) */}
          {selectedKategori === 'Semua' && !search && beritaUtama && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Berita Utama Pilihan</h2>
              </div>

              <Link
                href={`/berita/${beritaUtama.slug || beritaUtama.id}`}
                className="group grid lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                <div className="relative h-[280px] lg:h-[380px] w-full overflow-hidden bg-slate-100">
                  <img
                    src={beritaUtama.gambar || '/images/berita-headline.png'}
                    alt={beritaUtama.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white/95 text-emerald-800 shadow-md backdrop-blur-sm">
                      {beritaUtama.kategori}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-10 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Calendar size={13} />
                    <span>{beritaUtama.tanggal}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {beritaUtama.judul}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 text-sm sm:text-base leading-relaxed">
                    {beritaUtama.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 pt-2 group-hover:translate-x-1 transition-transform">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Filters & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {KATEGORI_LIST.map((kat) => (
                <button
                  key={kat}
                  onClick={() => setSelectedKategori(kat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedKategori === kat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {kat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berita atau artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              />
            </div>
          </div>

          {/* News Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-medium text-slate-400">Memuat kabar terbaru...</p>
            </div>
          ) : listToRender.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
              <Newspaper size={36} className="mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-800 text-lg">Tidak ada berita yang sesuai</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau pilih kategori lain untuk melihat artikel lainnya.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {listToRender.map((b) => (
                <Link
                  key={b.id}
                  href={`/berita/${b.slug || b.id}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={b.gambar || '/images/berita-1.png'}
                      alt={b.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          KATEGORI_COLOR[b.kategori] || 'bg-slate-100 text-slate-700'
                        } shadow-sm`}
                      >
                        {b.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Calendar size={12} />
                        <span>{b.tanggal}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                        {b.judul}
                      </h4>
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                      <span>Selengkapnya</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
