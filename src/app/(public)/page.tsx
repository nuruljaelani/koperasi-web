import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.5-11 5 0 1.7 0 3 2 4.5V20h4v-2h3v2h4v-3.5c1.5-.92 2.5-2.5 2.5-4.5 0-3-2-5.5-4.5-5.5" />
        <circle cx="17" cy="10" r="1" />
      </svg>
    ),
    title: "Simpanan Pokok & Wajib",
    desc: "Simpanan wajib bagi anggota dengan bagi hasil yang menguntungkan setiap bulannya",
    color: "border-primary-500",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-600">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 14h4" />
      </svg>
    ),
    title: "Pinjaman Reguler",
    desc: "Pinjaman reguler dengan persyaratan mudah dan pembayaran dengan suku bunga kompetitif",
    color: "border-red-500",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-green-600">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Pembiayaan Usaha (UMKM)",
    desc: "Dana pinjaman bagi pelaku usaha UMKM dengan bunga yang rendah dan proses mudah",
    color: "border-green-500",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-600">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Simpanan Berjangka",
    desc: "Simpanan berjangka dengan imbal hasil yang kompetitif dan perlindungan nilai dana anda",
    color: "border-accent-500",
  },
];

const benefits = [
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: "Bunga Kompetitif",
    desc: "Nikmati bunga yang rendah untuk pinjaman dan bagi hasil yang menguntungkan untuk simpanan anda",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Terpercaya & Aman",
    desc: "Terdaftar resmi di Kementerian Koperasi dan telah melayani masyarakat selama lebih dari 15 tahun",
  },
  {
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary-700">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Profesional",
    desc: "Tim profesional yang berpengalaman siap membantu anda dengan pelayanan yang profesional dan ramah",
  },
];

const testimonials = [
  {
    text: "Saya sangat terbantu dengan pinjaman dari UPK Mekarsari. Prosesnya mudah dan bunganya sangat kompetitif.",
    name: "Budi",
    stars: 5,
  },
  {
    text: "Sangat bersyukur bisa menjadi anggota UPK Mekarsari. Pelayanan yang ramah dan profesional.",
    name: "Budi",
    stars: 5,
  },
  {
    text: "Dengan pelayanan yang baik dan bagi hasil yang kompetitif, UPK Mekarsari menjadi pilihan terbaik.",
    name: "Budi",
    stars: 5,
  },
];

export default function BerandaPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1b5e20 0%, #164d1a 40%, #0d3311 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Wujudkan Impian bersama UPK Mekarsari
              </h1>
              <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-lg">
                Koperasi bersyariah yang siap membantu anda mencapai kesejahteraan finansial melalui layanan Pembiayaan dan Simpanan yang terjamin dan menguntungkan.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold rounded-lg transition-colors shadow-lg"
                >
                  Mulai Sekarang
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-accent-400">2000+</p>
                  <p className="text-white/60 text-sm">Anggota Aktif</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-400">20+</p>
                  <p className="text-white/60 text-sm">Tahun</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent-400">98%</p>
                  <p className="text-white/60 text-sm">Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-beranda.png"
                  alt="Pertanian Indonesia"
                  width={600}
                  height={400}
                  className="object-cover w-full h-[400px]"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Terdaftar & Resmi</p>
                    <p className="text-xs text-neutral-500">Kementerian Koperasi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Kami */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Layanan Kami
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Kami menyediakan berbagai layanan finansial yang dirancang untuk memenuhi kebutuhan anda
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className={`card-hover bg-white border-t-4 ${s.color} rounded-xl p-8 shadow-md`}
              >
                <div className="mb-4">{s.icon}</div>
                <h3 className="font-semibold text-xl text-neutral-900 mb-3">{s.title}</h3>
                <p className="text-neutral-500 leading-relaxed mb-6 block min-h-[50px]">{s.desc}</p>
                <Link
                  href="/layanan/pembiayaan"
                  className="inline-flex items-center gap-1 text-primary-700 text-sm font-medium hover:text-primary-800 transition-colors"
                >
                  Pelajari lebih lanjut
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kenapa Memilih */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Kenapa Memilih UPK Mekarsari?
            </h2>
            <p className="text-neutral-500">
              Kami berkomitmen memberikan pelayanan terbaik untuk kesejahteraan anggota
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="font-bold text-neutral-900 text-lg">{b.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-neutral-900 mb-4">
              Apa kata anggota kami
            </h2>
            <p className="text-neutral-500">Testimoni dari anggota kami</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="card-hover bg-white rounded-xl border border-neutral-200 p-8 shadow-sm"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <svg key={j} width="18" height="18" viewBox="0 0 24 24" fill="#F5C518" className="text-accent-400">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-600 text-base leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="font-semibold text-neutral-900">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Siap bergabung dengan kami?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Bergabunglah bersama ribuan anggota lainnya yang telah merasakan manfaat dari layanan koperasi kami.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold rounded-lg transition-colors"
            >
              Daftar Sekarang
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
