"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

function formatRupiah(num: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export default function SimulasiPage() {
  const [tab, setTab] = useState<"pembiayaan" | "simpanan">("pembiayaan");
  const [jumlah, setJumlah] = useState(80000000);
  const [tenor, setTenor] = useState(12);
  const [bunga, setBunga] = useState(0.8);

  // Simpanan state
  const [simpananAwal, setSimpananAwal] = useState(10000000);
  const [simpananBulanan, setSimpananBulanan] = useState(500000);
  const [simpananTenor, setSimpananTenor] = useState(12);
  const [simpananBunga, setSimpananBunga] = useState(0.5);

  const cicilanPerBulan = useCallback(() => {
    const bungaBulanan = bunga / 100;
    const totalBunga = jumlah * bungaBulanan * tenor;
    const totalPembayaran = jumlah + totalBunga;
    return {
      cicilan: Math.round(totalPembayaran / tenor),
      totalPembayaran: Math.round(totalPembayaran),
      totalBunga: Math.round(totalBunga),
    };
  }, [jumlah, tenor, bunga]);

  const hasilSimpanan = useCallback(() => {
    const bungaBulanan = simpananBunga / 100;
    let total = simpananAwal;
    for (let i = 0; i < simpananTenor; i++) {
      total = total * (1 + bungaBulanan) + simpananBulanan;
    }
    const totalSetoran = simpananAwal + simpananBulanan * simpananTenor;
    return {
      totalAkhir: Math.round(total),
      totalSetoran: Math.round(totalSetoran),
      totalKeuntungan: Math.round(total - totalSetoran),
    };
  }, [simpananAwal, simpananBulanan, simpananTenor, simpananBunga]);

  const hasil = cicilanPerBulan();
  const hasilSmp = hasilSimpanan();

  return (
    <>
      {/* Hero */}
      <section className="page-hero py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Simulasi Keuangan</h1>
          <p className="text-white/70 max-w-xl mx-auto">
            Hitung estimasi cicilan pembiayaan dan keuntungan simpanan anda dengan kalkulator kami
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => setTab("pembiayaan")}
              className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${
                tab === "pembiayaan"
                  ? "bg-primary-700 text-white shadow-lg"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Simulasi Pembiayaan
            </button>
            <button
              onClick={() => setTab("simpanan")}
              className={`flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${
                tab === "simpanan"
                  ? "bg-primary-700 text-white shadow-lg"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.5-11 5 0 1.7 0 3 2 4.5V20h4v-2h3v2h4v-3.5c1.5-.92 2.5-2.5 2.5-4.5 0-3-2-5.5-4.5-5.5" />
              </svg>
              Simulasi Simpanan
            </button>
          </div>

          {tab === "pembiayaan" ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                <h3 className="font-bold text-lg text-neutral-900 mb-6">Data Pembiayaan</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Jumlah Pembiayaan</label>
                    <input type="range" min={5000000} max={200000000} step={1000000} value={jumlah} onChange={(e) => setJumlah(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>Rp 5 jt</span><span>{formatRupiah(jumlah)}</span><span>Rp 200 jt</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Jangka Waktu (Bulan)</label>
                    <input type="range" min={3} max={36} step={1} value={tenor} onChange={(e) => setTenor(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>3 bulan</span><span>{tenor} bulan</span><span>36 bulan</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Bunga per bulan (%)</label>
                    <input type="range" min={0.5} max={2} step={0.1} value={bunga} onChange={(e) => setBunga(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>0,5%</span><span>{bunga}%</span><span>2%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-primary-700 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-6">Hasil Simulasi Pembiayaan</h3>
                <div className="space-y-4">
                  <div className="bg-primary-800 rounded-xl p-4">
                    <p className="text-white/70 text-sm mb-1">Cicilan per Bulan:</p>
                    <p className="text-2xl font-bold">{formatRupiah(hasil.cicilan)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-800 rounded-xl p-4">
                      <p className="text-white/70 text-xs mb-1">Total Pembayaran</p>
                      <p className="text-lg font-bold">{formatRupiah(hasil.totalPembayaran)}</p>
                    </div>
                    <div className="bg-primary-800 rounded-xl p-4">
                      <p className="text-white/70 text-xs mb-1">Total Bunga</p>
                      <p className="text-lg font-bold">{formatRupiah(hasil.totalBunga)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 text-sm">
                    <div className="flex justify-between"><span className="text-white/70">Jumlah Pinjaman:</span><span className="font-semibold">{formatRupiah(jumlah)}</span></div>
                    <div className="flex justify-between"><span className="text-white/70">Jangka Waktu:</span><span className="font-semibold">{tenor} Bulan</span></div>
                    <div className="flex justify-between"><span className="text-white/70">Bunga:</span><span className="font-semibold">{bunga}% per Bulan</span></div>
                  </div>
                  <p className="text-white/50 text-xs mt-2">*Hasil simulasi bersifat estimasi dan dapat berbeda dengan perhitungan detail</p>
                  <button className="w-full py-3 bg-accent-400 hover:bg-accent-500 text-primary-900 font-semibold rounded-xl transition-colors mt-2">
                    Ajukan
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Simpanan Inputs */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                <h3 className="font-bold text-lg text-neutral-900 mb-6">Data Simpanan</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Simpanan Awal</label>
                    <input type="range" min={1000000} max={100000000} step={500000} value={simpananAwal} onChange={(e) => setSimpananAwal(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>Rp 1 jt</span><span>{formatRupiah(simpananAwal)}</span><span>Rp 100 jt</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Simpanan Bulanan</label>
                    <input type="range" min={100000} max={10000000} step={100000} value={simpananBulanan} onChange={(e) => setSimpananBulanan(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>Rp 100 rb</span><span>{formatRupiah(simpananBulanan)}</span><span>Rp 10 jt</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Jangka Waktu (Bulan)</label>
                    <input type="range" min={3} max={60} step={1} value={simpananTenor} onChange={(e) => setSimpananTenor(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>3 bulan</span><span>{simpananTenor} bulan</span><span>60 bulan</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Bagi Hasil per bulan (%)</label>
                    <input type="range" min={0.1} max={1.5} step={0.1} value={simpananBunga} onChange={(e) => setSimpananBunga(Number(e.target.value))} />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>0,1%</span><span>{simpananBunga}%</span><span>1,5%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Simpanan Results */}
              <div className="bg-primary-700 rounded-2xl p-8 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-6">Hasil Simulasi Simpanan</h3>
                <div className="space-y-4">
                  <div className="bg-primary-800 rounded-xl p-4">
                    <p className="text-white/70 text-sm mb-1">Total Simpanan Akhir:</p>
                    <p className="text-2xl font-bold">{formatRupiah(hasilSmp.totalAkhir)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-800 rounded-xl p-4">
                      <p className="text-white/70 text-xs mb-1">Total Setoran</p>
                      <p className="text-lg font-bold">{formatRupiah(hasilSmp.totalSetoran)}</p>
                    </div>
                    <div className="bg-primary-800 rounded-xl p-4">
                      <p className="text-white/70 text-xs mb-1">Total Keuntungan</p>
                      <p className="text-lg font-bold">{formatRupiah(hasilSmp.totalKeuntungan)}</p>
                    </div>
                  </div>
                  <p className="text-white/50 text-xs mt-2">*Hasil simulasi bersifat estimasi dan dapat berbeda dengan perhitungan detail</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Cards */}
      <section className="bg-neutral-50 py-10 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Pembiayaan", desc: "Simulasi ini membantu anda menghitung estimasi cicilan bulanan untuk pembiayaan yang diajukan", color: "border-primary-700", href: "/layanan/pembiayaan" },
              { title: "Simpanan", desc: "Hitung perkiraan keuntungan yang akan Anda dapatkan dari produk simpanan kami", color: "border-accent-500", href: "/layanan/simpanan" },
              { title: "Konsultasi", desc: "Butuh bantuan? Tim kami siap membantu perhitungan yang lebih detail sesuai kebutuhan", color: "border-red-500", href: "/kontak" },
            ].map((c, i) => (
              <Link key={i} href={c.href} className={`card-hover bg-white border-l-4 ${c.color} rounded-xl p-8 shadow-sm block`}>
                <h3 className="font-bold text-neutral-900 mb-2">{c.title}</h3>
                <p className="text-neutral-500 text-sm">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
