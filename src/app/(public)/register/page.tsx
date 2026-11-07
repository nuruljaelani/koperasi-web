import Link from "next/link";
import type { Metadata } from "next";
import {
  Building2,
  FileText,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pendaftaran Anggota Baru - UPK Mekarsari",
  description: "Prosedur dan persyaratan pendaftaran anggota baru Koperasi UPK Mekarsari di kantor operasional.",
};

export default function RegisterInfoPage() {
  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-neutral-50 to-emerald-50/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">UPK Mekarsari</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Pendaftaran Anggota Baru
          </h1>
          <p className="text-neutral-500 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Prosedur dan persyaratan resmi untuk bergabung menjadi anggota Koperasi UPK Mekarsari.
          </p>
        </div>

        {/* Banner Utama: Pendaftaran Offline di Kantor */}
        <div className="bg-amber-50 border-2 border-amber-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-amber-950">
                Pendaftaran Wajib Dilakukan Langsung di Kantor Koperasi
              </h2>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                Sesuai dengan Anggaran Dasar & Rumah Tangga (AD/ART) Koperasi UPK Mekarsari, pendaftaran calon anggota baru <strong>tidak dapat dilakukan secara online</strong>. Calon anggota diwajibkan hadir langsung di kantor pelayanan untuk verifikasi dokumen fisik asli serta penandatanganan akad keanggotaan.
              </p>
            </div>
          </div>
        </div>

        {/* Callout untuk Anggota Lama yang Ingin Aktivasi */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5" />
              Sudah Menjadi Anggota Sebelumnya?
            </div>
            <h3 className="text-xl font-bold">Aktifkan Akses Website Anda</h3>
            <p className="text-emerald-100 text-sm max-w-lg leading-relaxed">
              Jika Anda sudah terdaftar di buku koperasi lama, Anda <strong>tidak perlu mendaftar ulang</strong>. Cukup lakukan aktivasi dengan No. Anggota atau NIK dan No. HP Anda.
            </p>
          </div>
          <Link
            href="/aktivasi"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-400 hover:bg-accent-500 text-primary-950 font-bold text-sm rounded-xl shrink-0 transition-colors shadow-md"
          >
            Aktivasi Akun Sekarang
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Persyaratan & Prosedur Pendaftaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Syarat */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Berkas Persyaratan</h3>
            </div>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fotokopi KTP / e-KTP yang masih berlaku (1 lembar) serta membawa KTP asli.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Fotokopi Kartu Keluarga (KK) (1 lembar).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Pas foto berwarna ukuran 3x4 (2 lembar).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Nomor Handphone / WhatsApp aktif untuk keperluan notifikasi akun.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Setoran awal <strong>Simpanan Pokok</strong> dan <strong>Simpanan Wajib</strong> bulan pertama.</span>
              </li>
            </ul>
          </div>

          {/* Card Alur / Langkah di Kantor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Alur di Kantor Koperasi</h3>
            </div>
            <ol className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Mengambil formulir permohonan keanggotaan di loket customer service.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Petugas memverifikasi kelengkapan berkas KTP dan KK.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Penyetoran Simpanan Pokok & Wajib di kasir koperasi.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>Penerbitan <strong>Nomor Anggota Resmi</strong> dan buku anggota.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  5
                </span>
                <span>Anggota dapat langsung mengaktifkan akun website di menu <strong>Aktivasi Akun</strong>.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Informasi Kantor & Jam Layanan */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-900">Lokasi & Jam Operasional Pelayanan</h3>
            <div className="space-y-2 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Kantor Pelayanan UPK Mekarsari, Jl. Raya Koperasi No. 45</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Senin - Jumat: 08.00 - 15.00 WIB (Sabtu & Minggu Tutup)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Layanan Konsultasi WhatsApp: +62 812-3456-7890</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/kontak"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-semibold text-sm text-center transition-colors"
            >
              Lihat Peta Lokasi
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-semibold text-sm text-center transition-colors shadow-sm"
            >
              Masuk ke Akun
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
