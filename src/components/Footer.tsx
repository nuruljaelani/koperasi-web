"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-neutral-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 sm:gap-8 lg:gap-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 gap-y-2 flex flex-col">
            <Image src="/logo/Logo-putih.png" alt="Logo" width={250} height={150} />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Koperasi yang berkomitmen untuk kesejahteraan anggota melalui
              layanan finansial yang terpercaya dan menguntungkan.
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="font-semibold text-base mb-4">Layanan</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/layanan/pembiayaan" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  Pembiayaan
                </Link>
              </li>
              <li>
                <Link href="/layanan/simpanan" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  Simpanan
                </Link>
              </li>
              <li>
                <Link href="/layanan/simulasi" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  Simulasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Tentang Kami */}
          <div>
            <h3 className="font-semibold text-base mb-4">Tentang Kami</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/berita" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="#" className="text-neutral-400 hover:text-accent-400 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="font-semibold text-base mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-400 mt-0.5 shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-neutral-400 text-sm">
                  Jl. Abcd No. 24 Panongan Lor, Sedong
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-400 shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="text-neutral-400 text-sm">+628100928111</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-400 shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
                </svg>
                <span className="text-neutral-400 text-sm">info@kkmekarsari.co.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            ©2026 Koperasi Konsumen Mekarsari.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
