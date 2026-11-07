'use client';

import Image from "next/image";
import Link from "next/link";
import { usePublicContent } from "@/hooks/useContentData";
import type { Berita, Layanan, Testimoni } from "@/store/useContentStore";
import { ArrowRight, Star, ShieldCheck, Award, Users, ChevronRight, Newspaper, Calendar } from "lucide-react";

export default function BerandaPage() {
  const { content, isLoading } = usePublicContent();
  const { hero, layanan, testimoni, berita, settings } = content;

  const latestBerita = (berita || []).filter((b: Berita) => b.status === "published").slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1b5e20 0%, #164d1a 40%, #0d3311 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>{settings.namaOrganisasi || "UPK Mekarsari"} — Amanah & Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                {hero.judul || "Wujudkan Impian bersama UPK Mekarsari"}
              </h1>

              <p className="text-white/85 text-base lg:text-lg leading-relaxed max-w-lg font-medium">
                {hero.subjudul ||
                  "Koperasi bersyariah yang siap membantu anda mencapai kesejahteraan finansial melalui layanan Pembiayaan dan Simpanan yang terjamin dan menguntungkan."}
              </p>

              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  href={hero.hrefTombol || "/aktivasi"}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(251,191,36,0.3)] hover:-translate-y-0.5"
                >
                  {hero.labelTombol || "Aktivasi Akun Anggota"}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm"
                >
                  Masuk Portal
                </Link>
              </div>

              {/* Live Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 max-w-md">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">
                    {hero.statAnggota || "2000+"}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm font-medium mt-0.5">Anggota Aktif</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">
                    {hero.statTahun || "20+"}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm font-medium mt-0.5">Tahun Melayani</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-400">
                    {hero.statRating || "98%"}
                  </p>
                  <p className="text-white/70 text-xs sm:text-sm font-medium mt-0.5">Kepuasan</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                <Image
                  src="/images/hero-beranda.png"
                  alt="Pertanian & Koperasi Indonesia"
                  width={600}
                  height={420}
                  className="object-cover w-full h-[420px]"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Resmi</p>
                  <p className="text-sm font-extrabold text-slate-900">Kementerian Koperasi RI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Kami */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100">
              Solusi Finansial Anggota
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Layanan Unggulan Koperasi
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Kami menyediakan berbagai instrumen simpanan dan pembiayaan syariah yang terbukti menumbuhkan ekonomi anggota.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(layanan || []).map((s: Layanan, idx: number) => (
              <div
                key={s.id || idx}
                className={`bg-white border-t-4 ${
                  s.warnaBorder || "border-emerald-600"
                } rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-x border-b border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center ${s.warnaIkon || "text-emerald-700"} font-bold text-lg`}>
                    0{idx + 1}
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {s.judul}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {s.deskripsi}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <Link href="/layanan/simpanan" className="inline-flex items-center gap-1.5">
                    <span>Pelajari Detail</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Berita & Pengumuman Terbaru */}
      {latestBerita.length > 0 && (
        <section className="bg-slate-50/70 py-14 lg:py-20 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
                  Kabar Koperasi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Berita & Pengumuman Terbaru
                </h2>
              </div>
              <Link
                href="/berita"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Lihat Semua Berita</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestBerita.map((item: Berita) => (
                <Link
                  key={item.id}
                  href={`/berita/${item.slug || item.id}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.gambar || "/images/berita-1.png"}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/95 text-emerald-800 shadow-sm">
                        {item.kategori}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                        <Calendar size={12} />
                        <span>{item.tanggal}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {item.judul}
                      </h4>
                      <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>Baca artikel</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimoni Anggota */}
      <section className="bg-white py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Kisah & Suara Anggota
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Apa Kata Anggota Koperasi
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Pengalaman nyata dari para pelaku usaha dan anggota yang berkembang bersama kami.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {(testimoni || []).slice(0, 3).map((t: Testimoni, idx: number) => (
              <div
                key={t.id || idx}
                className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: t.bintang || 5 }).map((_, j) => (
                      <Star key={j} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                    &ldquo;{t.teks}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {t.nama?.slice(0, 2).toUpperCase() || "AG"}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{t.nama}</p>
                    <p className="text-xs text-slate-500 font-medium">{t.jabatan || "Anggota Aktif"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-gradient-to-r from-emerald-800 to-emerald-950 py-14 lg:py-18 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Sudah Terdaftar Sebagai Anggota {settings.namaOrganisasi || "UPK Mekarsari"}?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Aktifkan akun portal website Anda untuk memantau saldo simpanan, pengajuan pembiayaan, kuitansi transaksi, dan mutasi saldo secara real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/aktivasi"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Aktivasi Akun Sekarang
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/tentang-kami"
              className="inline-flex items-center px-6 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Tentang Koperasi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
