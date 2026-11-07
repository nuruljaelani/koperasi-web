'use client';

import Image from "next/image";
import { usePublicContent } from "@/hooks/useContentData";
import { CheckCircle2, Shield, Target, Compass, Users } from "lucide-react";

const orgChart = [
  {
    level: 0,
    items: [{ title: "RAPAT ANGGOTA (RA)", subtitle: "Kekuasaan Tertinggi", color: "bg-amber-400 text-slate-900" }],
  },
  {
    level: 1,
    items: [
      { title: "PENGURUS (BOARD OF DIRECTORS)", subtitle: "Ketua, Sekretaris, Bendahara, Pelaksana Kebijakan", color: "bg-emerald-800 text-white" },
      { title: "PENGAWAS (SUPERVISORY BOARD)", subtitle: "Melakukan Pengawasan Terhadap Pengurus & Pengelola", color: "bg-emerald-800 text-white" },
    ],
  },
  {
    level: 2,
    items: [{ title: "PENGELOLA / MANAJER", subtitle: "Tenaga Profesional, Mengelola Operasional Harian", color: "bg-emerald-700 text-white" }],
  },
  {
    level: 3,
    items: [
      { title: "UNIT SIMPAN PINJAM (USP)", subtitle: "Savings & Loans", color: "bg-amber-400 text-slate-900" },
      { title: "UNIT TOKO / RETAIL", subtitle: "Cooperative Store", color: "bg-emerald-600 text-white" },
      { title: "UNIT JASA (SERVICES)", subtitle: "Transportation/Rental/Etc.", color: "bg-rose-600 text-white" },
      { title: "UNIT PRODUKSI / LAINNYA", subtitle: "Production/Other Ventures", color: "bg-amber-500 text-slate-900" },
    ],
  },
];

export default function TentangKamiPage() {
  const { content } = usePublicContent();
  const { tentang, settings } = content;

  const visi = tentang.visi || "Menjadi koperasi terdepan dan terpercaya yang memberdayakan masyarakat dalam mencapai kesejahteraan finansial dan kemakmuran bersama.";
  const misi = tentang.misi?.length ? tentang.misi : [
    "Memberikan layanan finansial yang mudah, cepat, dan terpercaya",
    "Meningkatkan kesejahteraan anggota melalui bagi hasil yang optimal",
    "Mengembangkan sistem yang transparan dan akuntabel",
    "Memberdayakan masyarakat melalui edukasi finansial",
  ];
  const keunggulan = tentang.poinKeunggulan?.length ? tentang.poinKeunggulan : [
    "Terdaftar resmi di Kementerian Koperasi RI",
    "Telah melayani lebih dari ribuan anggota aktif",
    "Aset yang terus bertumbuh sehat setiap tahunnya",
    "Pengelolaan profesional, amanah, dan akuntabel",
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/20">
            Profil Lembaga
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Tentang {settings.namaOrganisasi || "UPK Mekarsari"}</h1>
          <p className="text-emerald-100/80 max-w-xl mx-auto text-sm sm:text-base">
            Lebih dekat dengan koperasi yang telah melayani dan menumbuhkan perekonomian masyarakat selama belasan tahun.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
              <Image
                src="/images/building-tentang.png"
                alt="Kantor Koperasi"
                width={600}
                height={400}
                className="object-cover w-full h-[360px]"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  Sejarah & Komitmen
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Tumbuh Bersama Mensejahterakan Anggota
                </h2>
              </div>

              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                {tentang.deskripsi ||
                  "UPK Mekarsari adalah koperasi yang telah berdiri sejak lebih dari 15 tahun lalu dengan komitmen untuk membantu anggota mencapai kesejahteraan finansial."}
              </p>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                {tentang.deskripsiParagraf2 ||
                  "Dengan sistem yang transparan dan profesional, kami terus berkembang menjadi pilihan utama bagi ribuan anggota yang mempercayakan keuangan mereka kepada kami."}
              </p>

              <ul className="space-y-3 pt-2">
                {keunggulan.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="bg-slate-50/70 py-12 lg:py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-100/60 px-3 py-1 rounded-full">
              Fondasi Organisasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Visi & Misi Kami
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Arah Masa Depan</span>
                  <h3 className="text-xl font-bold text-slate-900">Visi Koperasi</h3>
                </div>
              </div>
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                &ldquo;{visi}&rdquo;
              </p>
            </div>

            {/* Misi */}
            <div className="bg-emerald-900 rounded-3xl p-8 sm:p-10 shadow-lg text-white space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center font-bold">
                  <Target size={24} />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Langkah Nyata</span>
                  <h3 className="text-xl font-bold text-white">Misi Koperasi</h3>
                </div>
              </div>
              <ul className="space-y-3.5">
                {misi.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-white/90 text-sm sm:text-base leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bagan Struktur Organisasi */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-700 font-extrabold text-xs uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Tata Kelola
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Struktur Organisasi
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Sistem kepengurusan dan manajemen operasional Koperasi UPK Mekarsari.
            </p>
          </div>

          <div className="space-y-6">
            {orgChart.map((lvl) => (
              <div
                key={lvl.level}
                className={`flex flex-wrap justify-center gap-4 ${
                  lvl.level === 0 ? "max-w-md mx-auto" : ""
                }`}
              >
                {lvl.items.map((it, idx) => (
                  <div
                    key={idx}
                    className={`${it.color} rounded-2xl p-4 sm:p-5 shadow-sm text-center flex-1 min-w-[220px] max-w-[280px] border border-black/5`}
                  >
                    <p className="font-extrabold text-xs sm:text-sm tracking-wide">{it.title}</p>
                    <p className="text-[11px] opacity-80 mt-1">{it.subtitle}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
