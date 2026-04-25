import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simpanan - UPK Mekarsari",
  description: "Kembangkan dana anda dengan berbagai produk simpanan yang menguntungkan dan aman.",
};

const simpananTypes = [
  { title: "Simpanan Wajib", desc: "Simpanan rutin setiap bulan" },
  { title: "Simpanan Pokok", desc: "Simpanan wajib sebagai syarat keanggotaan" },
  { title: "Simpanan Sukarela", desc: "Simpanan yang dapat disetorkan kapan saja" },
  { title: "Simpanan Berjangka", desc: "Simpanan dengan jangka waktu tertentu" },
];

const caraSteps = [
  "Menjadi anggota UPK Mekarsari",
  "Mengisi formulir pembukaan simpanan",
  "Menyerahkan syarat-syarat Dokumen yang dibutuhkan",
  "Melakukan setoran awal sesuai ketentuan",
  "Menerima buku simpanan atau bukti simpanan",
];

export default function SimpananPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">Simpanan</h1>
              <p className="text-white/80 max-w-lg leading-relaxed">
                Kembangkan dana anda dengan berbagai produk simpanan yang menguntungkan dan aman.
              </p>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image src="/images/plant-simpanan.png" alt="Simpanan tumbuh" width={400} height={280} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jenis Simpanan */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">Jenis Simpanan</h2>
            <p className="text-neutral-500">Pilih Produk simpanan yang sesuai dengan kebutuhan anda</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {simpananTypes.map((s, i) => (
              <div key={i} className="card-hover bg-white rounded-xl border border-neutral-200 p-8 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto mb-4 bg-primary-50 rounded-xl flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{s.title}</h3>
                <p className="text-neutral-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Keuntungan */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">Keuntungan Simpanan</h2>
            <p className="text-neutral-500">Mengapa memilih simpan di UPK Mekarsari</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="card-hover bg-white rounded-xl p-8 shadow-sm text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">Bagi Hasil Menguntungkan</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">Dapatkan bagi hasil yang kompetitif dan menguntungkan dari simpanan anda</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Membuka */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">Cara Membuka Simpanan</h2>
            <p className="text-neutral-500">Mudah dan Cepat</p>
          </div>
          <div className="max-w-xl mx-auto bg-neutral-50 rounded-2xl p-8">
            <ol className="space-y-5">
              {caraSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-primary-700 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                  <span className="text-neutral-700 pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
