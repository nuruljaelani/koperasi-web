import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami - UPK Mekarsari",
  description: "Hubungi kami untuk pertanyaan, masukan, atau informasi lebih lanjut tentang layanan UPK Mekarsari.",
};

const contactInfo = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
    title: "Alamat Kantor",
    details: ["Jl. Raya Mekarsari No. 123", "Desa Mekarsari, Kec. Cileungsi", "Kab. Bogor, Jawa Barat 16820"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
    title: "Telepon & WhatsApp",
    details: ["(021) 823-4567", "+62 812-3456-7890 (WA)"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <path d="M12 14l9-9"></path>
        <path d="M2 5l10 9-3-3"></path>
      </svg>
    ),
    title: "Email",
    details: ["info@upkmekarsari.com", "cs@upkmekarsari.com"],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-700">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
    title: "Jam Operasional",
    details: ["Senin - Jumat: 08:00 - 16:00 WIB", "Sabtu: 08:00 - 13:00 WIB", "Minggu & Libur Nasional: Tutup"],
  },
];

export default function KontakPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Kontak Kami</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami melalui form, telepon, atau kunjungi kantor kami langsung.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2">Informasi Kontak</h2>
                <div className="w-16 h-1 bg-primary-700 rounded-full mb-8"></div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 flex flex-col hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 text-primary-700">
                        {info.icon}
                      </div>
                      <h3 className="font-bold text-neutral-900 mb-2">{info.title}</h3>
                      <div className="text-neutral-600 text-sm space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl p-2 shadow-sm border border-neutral-100 overflow-hidden">
                <div className="relative h-[250px] w-full rounded-xl overflow-hidden bg-neutral-200">
                  <Image 
                    src="/images/kontak-map.png" 
                    alt="Peta Lokasi Kantor UPK Mekarsari" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm shadow text-neutral-800 font-semibold rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-primary-700 hover:text-white transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Buka di Google Maps
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl p-8 shadow-md border border-neutral-100 h-full">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Tinggalkan Pesan</h2>
                <p className="text-neutral-500 text-sm mb-8">Isi formulir di bawah ini dan tim kami akan segera membalas pesan Anda.</p>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-neutral-700">Nama Lengkap</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Contoh: Budi Santoso"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-neutral-700">No. WhatsApp</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none"
                        placeholder="Contoh: 081234567890"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-neutral-700">Subjek</label>
                    <select 
                      id="subject" 
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none appearance-none"
                    >
                      <option value="">Pilih Subjek Pertanyaan</option>
                      <option value="pembiayaan">Informasi Pembiayaan</option>
                      <option value="simpanan">Informasi Simpanan</option>
                      <option value="keanggotaan">Pendaftaran Anggota</option>
                      <option value="lainnya">Lainnya / Umum</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-neutral-700">Pesan Anda</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors outline-none resize-none"
                      placeholder="Tulis detail pertanyaan atau masukan Anda di sini..."
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
