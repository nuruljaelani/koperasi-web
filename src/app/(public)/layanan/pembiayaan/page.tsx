import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembiayaan - UPK Mekarsari",
  description: "Solusi pembiayaan yang mudah, cepat dan terpercaya untuk berbagai kebutuhan Anda dengan bunga yang kompetitif.",
};

const products = [
  {
    title: "Pembiayaan Usaha",
    desc: "Solusi pembiayaan untuk mengembangkan usaha anda",
    color: "bg-primary-700",
    features: [
      "Plafon hingga Rp 100.000.000",
      "Bunga 1% per bulan",
      "Tenor hingga 36 bulan",
      "Proses persetujuan 3 - 5 hari kerja",
    ],
  },
  {
    title: "Pembiayaan Konsumtif",
    desc: "Wujudkan kebutuhan pribadi dan keluarga anda",
    color: "bg-accent-500",
    features: [
      "Plafon hingga Rp 50.000.000",
      "Bunga 1,2% per bulan",
      "Tenor hingga 36 bulan",
      "Proses cepat dan mudah",
    ],
  },
  {
    title: "Pembiayaan Multiguna",
    desc: "Fleksibel untuk berbagai keperluan",
    color: "bg-primary-600",
    features: [
      "Plafon hingga Rp 50.000.000",
      "Bunga 1,1% per bulan",
      "Tenor hingga 30 bulan",
      "Proses cepat dan mudah",
    ],
  },
];

const steps = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Ajukan permohonan",
    desc: "Lengkapi formulir permohonan dan siapkan dokumen",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
        <path d="M13 13h4M13 17h4" />
      </svg>
    ),
    title: "Survey & Analisa",
    desc: "Tim kami melakukan survei dan analisa kelayakan",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Persetujuan",
    desc: "Permohonan disetujui dan akad pembiayaan dilakukan",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    title: "Pencairan",
    desc: "Dana dicairkan ke rekening anda",
  },
];

export default function PembiayaanPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold">Pembiayaan</h1>
              <p className="text-white/80 max-w-lg leading-relaxed">
                Solusi pembiayaan yang mudah, cepat dan terpercaya untuk berbagai kebutuhan
                Anda dengan bunga yang kompetitif.
              </p>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/coins-pembiayaan.png"
                  alt="Koin pembiayaan"
                  width={400}
                  height={280}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              Produk Pembiayaan
            </h2>
            <p className="text-neutral-500">
              Pilih Produk yang sesuai dengan kebutuhan anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <div key={i} className="card-hover rounded-xl overflow-hidden shadow-md border border-neutral-100">
                <div className={`${p.color} text-white p-8`}>
                  <h3 className="font-bold text-lg mb-1">{p.title}</h3>
                  <p className="text-white/80 text-sm">{p.desc}</p>
                </div>
                <div className="p-8 bg-white">
                  <ul className="space-y-3">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700 shrink-0">
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-neutral-700 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Pengajuan */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-3">
              Cara Pengajuan
            </h2>
            <p className="text-neutral-500">Proses mudah dan cepat</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-white rounded-2xl shadow-md flex items-center justify-center">
                  {s.icon}
                </div>
                <h3 className="font-bold text-neutral-900">{s.title}</h3>
                <p className="text-neutral-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
