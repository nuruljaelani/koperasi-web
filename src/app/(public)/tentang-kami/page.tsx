import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - UPK Mekarsari",
  description: "Lebih dekat dengan UPK Mekarsari yang telah melayani masyarakat selama belasan tahun.",
};

const visiPoints = [
  "Menjadi koperasi terdepan dan terpercaya yang memberdayakan masyarakat dalam mencapai kesejahteraan finansial dan kemakmuran bersama.",
];

const misiPoints = [
  "Memberikan layanan finansial yang mudah, cepat, dan terpercaya",
  "Meningkatkan kesejahteraan anggota melalui bagi hasil yang optimal",
  "Mengembangkan sistem yang transparan dan akuntabel",
  "Memberdayakan masyarakat melalui edukasi finansial",
];

const orgChart = [
  {
    level: 0,
    items: [{ title: "RAPAT ANGGOTA (RA)", subtitle: "Kekuasaan Tertinggi", color: "bg-accent-400 text-primary-900" }],
  },
  {
    level: 1,
    items: [
      { title: "PENGURUS (BOARD OF DIRECTORS)", subtitle: "Ketua, Sekretaris, Bendahara, Pelaksana Kebijakan", color: "bg-primary-700 text-white" },
      { title: "PENGAWAS (SUPERVISORY BOARD)", subtitle: "Melakukan Pengawasan Terhadap Pengurus & Pengelola", color: "bg-primary-700 text-white" },
    ],
  },
  {
    level: 2,
    items: [{ title: "PENGELOLA / MANAJER", subtitle: "Tenaga Profesional, Mengelola Operasional Harian", color: "bg-primary-600 text-white" }],
  },
  {
    level: 3,
    items: [
      { title: "UNIT SIMPAN PINJAM (USP)", subtitle: "Savings & Loans", color: "bg-accent-400 text-primary-900" },
      { title: "UNIT TOKO / RETAIL", subtitle: "Cooperative Store", color: "bg-primary-500 text-white" },
      { title: "UNIT JASA (SERVICES)", subtitle: "Transportation/Rental/Etc.", color: "bg-red-600 text-white" },
      { title: "UNIT PRODUKSI / LAINNYA", subtitle: "Production/Other Ventures", color: "bg-accent-500 text-primary-900" },
    ],
  },
];

export default function TentangKamiPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Tentang Kami</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Lebih dekat dengan UPK Mekarsari yang telah melayani masyarakat selama belasan tahun.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/building-tentang.png"
                alt="Kantor UPK Mekarsari"
                width={600}
                height={400}
                className="object-cover w-full h-[350px]"
              />
            </div>
            <div className="space-y-5">
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6">
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                UPK Mekarsari adalah koperasi yang telah berdiri sejak lebih dari 15 tahun lalu
                dengan komitmen untuk membantu anggota mencapai kesejahteraan finansial.
                Kami menyediakan berbagai layanan pembiayaan dan simpanan yang
                dirancang untuk memenuhi kebutuhan masyarakat.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Dengan sistem yang transparan dan profesional, kami terus berkembang
                menjadi pilihan utama bagi ribuan anggota yang mempercayakan keuangan
                mereka kepada kami.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Terdaftar resmi di Kementerian Koperasi",
                  "Telah melayani lebih dari 1000 anggota aktif",
                  "Aset yang terus berkembang setiap tahunnya",
                  "Tim profesional dan berpengalaman",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-primary-700 shrink-0">
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    <span className="text-neutral-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-white rounded-2xl p-8 shadow-md border border-neutral-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900">Visi Kami</h2>
              </div>
              <p className="text-neutral-600 leading-relaxed">
                {visiPoints[0]}
              </p>
            </div>

            {/* Misi */}
            <div className="bg-primary-700 rounded-2xl p-8 shadow-md text-white">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-accent-400 rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Misi Kami</h2>
              </div>
              <ul className="space-y-3">
                {misiPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-400 mt-0.5 shrink-0">
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    <span className="text-white/90 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 text-center mb-12 uppercase tracking-wide">
            Struktur Organisasi
          </h2>

          <div className="space-y-8 max-w-5xl mx-auto">
            {orgChart.map((level, li) => (
              <div key={li}>
                {/* Connector */}
                {li > 0 && (
                  <div className="flex justify-center mb-4">
                    <div className="w-0.5 h-8 bg-neutral-300" />
                  </div>
                )}
                <div className={`flex flex-wrap justify-center gap-4 ${level.items.length > 2 ? "gap-3" : "gap-6"}`}>
                  {level.items.map((item, ii) => (
                    <div
                      key={ii}
                      className={`${item.color} rounded-xl px-6 py-4 text-center shadow-md min-w-[180px] max-w-[220px]`}
                    >
                      <p className="font-bold text-xs sm:text-sm leading-tight">{item.title}</p>
                      <p className="text-xs mt-1 opacity-80">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
