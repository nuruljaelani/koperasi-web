'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePublicContent } from '@/hooks/useContentData';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';

export default function KontakPage() {
  const { content } = usePublicContent();
  const { settings } = content;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    subject: 'Informasi Umum',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;

    // Direct WhatsApp redirect with prefilled message
    const waNumber = (settings.whatsapp || settings.telepon || '6281234567890').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Halo Admin ${settings.namaOrganisasi || 'Koperasi'},\n\nNama: ${form.name}\nNo. HP: ${form.phone || '-'}\nTopik: ${form.subject}\n\nPesan:\n${form.message}`
    );
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactCards = [
    {
      icon: <MapPin size={24} className="text-emerald-700" />,
      title: 'Alamat Kantor',
      details: [
        settings.alamat || 'Jl. Raya Mekarsari No. 123, Cileungsi, Bogor, Jawa Barat 16820',
      ],
    },
    {
      icon: <Phone size={24} className="text-emerald-700" />,
      title: 'Telepon & WhatsApp',
      details: [
        settings.telepon ? `Telp: ${settings.telepon}` : 'Telp: (021) 823-4567',
        settings.whatsapp ? `WA: ${settings.whatsapp}` : 'WA: +62 812-3456-7890',
      ],
    },
    {
      icon: <Mail size={24} className="text-emerald-700" />,
      title: 'Email Resmi',
      details: [
        settings.email || 'info@upkmekarsari.com',
        settings.emailCs || 'cs@upkmekarsari.com',
      ],
    },
    {
      icon: <Clock size={24} className="text-emerald-700" />,
      title: 'Jam Layanan',
      details: [
        settings.jamOperasional || 'Senin - Jumat: 08:00 - 16:00 WIB',
        settings.jamSabtu || 'Sabtu: 08:00 - 13:00 WIB',
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/20">
            Layanan Pengaduan & Informasi
          </span>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight">Hubungi Kami</h1>
          <p className="text-emerald-100/80 max-w-xl mx-auto text-sm sm:text-base">
            Kami siap melayani kebutuhan informasi simpanan, pembiayaan, dan keanggotaan Anda.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-slate-50/60 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info & Map */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Informasi Kantor</h2>
                <div className="w-16 h-1 bg-emerald-600 rounded-full mb-8"></div>
                <div className="grid sm:grid-cols-2 gap-5">
                  {contactCards.map((info, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                          {info.icon}
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-base mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, dIdx) => (
                            <p key={dIdx} className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div className="relative h-56 rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src="/images/map-placeholder.png"
                    alt="Peta Lokasi Kantor"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center">
                    <a
                      href={settings.googleMapsUrl || 'https://maps.google.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-white text-slate-900 font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:bg-emerald-600 hover:text-white transition-all hover:scale-105"
                    >
                      <MapPin size={16} />
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 h-full space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Tinggalkan Pesan</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Isi formulir di bawah ini dan pesan Anda akan langsung diteruskan ke staf layanan kami via WhatsApp.
                  </p>
                </div>

                {submitted && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-semibold animate-in fade-in">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Pesan berhasil diteruskan ke WhatsApp Layanan Koperasi!
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium"
                        placeholder="Contoh: Budi Santoso"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">No. WhatsApp *</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium"
                        placeholder="081234567890"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Topik Pertanyaan</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium"
                    >
                      <option value="Informasi Pembiayaan">Informasi Pembiayaan & Pinjaman</option>
                      <option value="Informasi Simpanan">Informasi Simpanan & Bagi Hasil</option>
                      <option value="Pendaftaran Anggota">Pendaftaran & Aktivasi Anggota</option>
                      <option value="Lainnya">Lainnya / Pertanyaan Umum</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Pesan Anda *</label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium resize-none"
                      placeholder="Tuliskan pertanyaan atau kebutuhan konsultasi Anda secara lengkap..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    Kirim Pesan ke Layanan CS
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
