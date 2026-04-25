"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  {
    label: "Layanan",
    children: [
      { href: "/layanan/pembiayaan", label: "Pembiayaan" },
      { href: "/layanan/simpanan", label: "Simpanan" },
      { href: "/layanan/simulasi", label: "Simulasi" },
    ],
  },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href;
  const isLayananActive = pathname?.startsWith("/layanan");

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav className="bg-primary-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          {/* <Link href="/" className="flex items-center gap-2 group">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-lg font-bold tracking-tight">
              Koperasi Mekar Sari
            </span>
          </Link> */}

          <Image src="/logo/Logo-putih.png" alt="Logo" width={250} height={150} />
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      isLayananActive
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/90"
                    }`}
                  >
                    {link.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl py-2 min-w-[180px] z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setDropdownOpen(false)}
                          className={`block px-4 py-2.5 text-sm transition-colors ${
                            isActive(child.href)
                              ? "bg-primary-50 text-primary-700 font-semibold"
                              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/10 text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-5 py-2 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold text-sm rounded-full transition-colors shadow-md"
            >
              Masuk Anggota
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <path d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary-800 border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/10 text-white/90"
                  >
                    {link.label}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="ml-4 space-y-1 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => { setMobileOpen(false); setDropdownOpen(false); }}
                          className={`block px-3 py-2 text-sm rounded-lg ${
                            isActive(child.href)
                              ? "bg-white/20 text-white font-semibold"
                              : "text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 text-sm font-medium rounded-lg ${
                    isActive(link.href)
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/login"
              className="block text-center mt-3 px-5 py-2.5 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold text-sm rounded-full transition-colors"
            >
              Masuk Anggota
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
