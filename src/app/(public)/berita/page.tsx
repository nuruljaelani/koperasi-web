import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita - UPK Mekarsari",
  description: "Kabar terbaru, pengumuman, dan artikel seputar UPK Mekarsari.",
};

const beritaUtama = {
  title: "Rapat Anggota Tahunan (RAT) Tahun Buku 2025 Sukses Digelar",
  date: "15 Maret 2026",
  category: "Pengumuman",
  excerpt: "Koperasi UPK Mekarsari sukses menyelenggarakan Rapat Anggota Tahunan dengan agenda pembagian SHU dan pemaparan rencana kerja untuk tahun mendatang. Terima kasih atas partisipasi aktif seluruh anggota.",
  image: "/images/berita-headline.png",
  url: "#",
};

const beritaLainnya = [
  {
    title: "Peluncuran Layanan Simulasi Pembiayaan Digital",
    date: "10 Maret 2026",
    category: "Layanan",
    excerpt: "Untuk memudahkan anggota dalam merencanakan keuangannya, kami meluncurkan fitur kalkulator simulasi pembiayaan dan simpanan langsung dari website kami.",
    image: "/images/berita-1.png",
    url: "#",
  },
  {
    title: "Kisah Sukses: Bantuan Modal untuk Warung Ibu Siti",
    date: "28 Februari 2026",
    category: "Kisah Sukses",
    excerpt: "Melalui program Pembiayaan Usaha, Ibu Siti berhasil mengembangkan warungnya menjadi minimarket kecil yang melayani kebutuhan warga desa.",
    image: "/images/berita-2.png",
    url: "#",
  },
  {
    title: "Beasiswa Pendidikan untuk Putra/Putri Anggota Berprestasi",
    date: "15 Februari 2026",
    category: "Sosial",
    excerpt: "Sebagai bentuk tanggung jawab sosial, UPK Mekarsari membagikan beasiswa kepada 50 pelajar berprestasi dari keluarga anggota aktif.",
    image: "/images/berita-3.png",
    url: "#",
  },
  {
    title: "Peluncuran Layanan Simulasi Pembiayaan Digital",
    date: "10 Maret 2026",
    category: "Layanan",
    excerpt: "Untuk memudahkan anggota dalam merencanakan keuangannya, kami meluncurkan fitur kalkulator simulasi pembiayaan dan simpanan langsung dari website kami.",
    image: "/images/berita-1.png",
    url: "#",
  },
  {
    title: "Kisah Sukses: Bantuan Modal untuk Warung Ibu Siti",
    date: "28 Februari 2026",
    category: "Kisah Sukses",
    excerpt: "Melalui program Pembiayaan Usaha, Ibu Siti berhasil mengembangkan warungnya menjadi minimarket kecil yang melayani kebutuhan warga desa.",
    image: "/images/berita-2.png",
    url: "#",
  },
  {
    title: "Beasiswa Pendidikan untuk Putra/Putri Anggota Berprestasi",
    date: "15 Februari 2026",
    category: "Sosial",
    excerpt: "Sebagai bentuk tanggung jawab sosial, UPK Mekarsari membagikan beasiswa kepada 50 pelajar berprestasi dari keluarga anggota aktif.",
    image: "/images/berita-3.png",
    url: "#",
  },
];

export default function BeritaPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Berita & Pengumuman</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Kabar terbaru, agenda kegiatan, dan kisah sukses anggota UPK Mekarsari.
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">Berita Utama</h2>
            <div className="w-20 h-1 bg-primary-700 rounded-full"></div>
          </div>
          
          <Link href={beritaUtama.url} className="group grid lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white rounded-2xl overflow-hidden shadow-md border border-neutral-100 hover:shadow-xl transition-all">
            <div className="relative h-[300px] lg:h-[400px] w-full overflow-hidden">
              <Image 
                src={beritaUtama.image} 
                alt={beritaUtama.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 lg:p-12 lg:pl-0">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-primary-100 text-primary-800 text-xs font-bold rounded-full">
                  {beritaUtama.category}
                </span>
                <span className="text-neutral-500 text-sm flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {beritaUtama.date}
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-6 group-hover:text-primary-700 transition-colors">
                {beritaUtama.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed mb-8">
                {beritaUtama.excerpt}
              </p>
              <div className="inline-flex items-center gap-2 text-primary-700 font-semibold group-hover:gap-3 transition-all">
                Baca Selengkapnya
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Other News Grid */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">Semua Berita</h2>
              <div className="w-20 h-1 bg-primary-700 rounded-full"></div>
            </div>
            {/* <Link href="#" className="hidden sm:inline-flex items-center gap-2 text-primary-700 font-semibold hover:text-primary-800 transition-colors">
              Lihat Semua Berita
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link> */}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beritaLainnya.map((berita, i) => (
              <Link key={i} href={berita.url} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-lg transition-all flex flex-col">
                <div className="relative h-[240px] w-full overflow-hidden">
                  <Image 
                    src={berita.image} 
                    alt={berita.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white border border-neutral-200 text-neutral-900 text-xs font-bold rounded-full shadow-sm">
                      {berita.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-neutral-500 text-sm flex items-center gap-1 mb-4">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {berita.date}
                  </span>
                  <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-700 transition-colors">
                    {berita.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mb-6 flex-grow">
                    {berita.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                    Baca Selengkapnya
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-1 sm:gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-700 text-white font-semibold shadow-sm cursor-pointer">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 font-medium transition-colors cursor-pointer">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 font-medium transition-colors cursor-pointer">
              3
            </button>
            
            <span className="w-10 h-10 flex items-center justify-center text-neutral-500">
              ...
            </span>
            
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 font-medium transition-colors cursor-pointer">
              12
            </button>

            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-primary-700 transition-colors cursor-pointer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
