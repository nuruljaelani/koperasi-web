import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Anggota - UPK Mekarsari",
  description: "Daftar menjadi anggota UPK Mekarsari.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-neutral-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">UPK Mekarsari</span>
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900">Daftar Anggota Baru</h2>
          <p className="text-neutral-500 mt-2 text-sm">Lengkapi formulir di bawah ini untuk bergabung</p>
        </div>

        <form className="space-y-5" action="/dashboard">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Lengkap</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
              placeholder="Sesuai KTP"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nomor HP/WA</label>
              <input 
                type="tel" 
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email (Opsional)</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Minimal 8 karakter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Konfirmasi Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Ulangi password"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3">
              <input type="checkbox" required className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer" />
              <span className="text-sm text-neutral-600 leading-relaxed">
                Saya menyetujui <Link href="#" className="text-primary-700 hover:text-primary-800 font-medium">Syarat & Ketentuan</Link> serta <Link href="#" className="text-primary-700 hover:text-primary-800 font-medium">Kebijakan Privasi</Link> yang berlaku di koperasi UPK Mekarsari.
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm mt-4"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-600">
            Sudah punya akun? <Link href="/login" className="text-primary-700 hover:text-primary-800 font-semibold">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
