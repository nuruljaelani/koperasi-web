'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SiteSettings {
  namaOrganisasi: string;
  tagline: string;
  deskripsiSingkat: string;
  alamat: string;
  telepon: string;
  whatsapp: string;
  email: string;
  emailCs: string;
  jamOperasional: string;
  jamSabtu: string;
  facebook: string;
  instagram: string;
  youtube: string;
  googleMapsUrl: string;
}

export interface HeroContent {
  judul: string;
  subjudul: string;
  labelTombol: string;
  hrefTombol: string;
  statAnggota: string;
  statTahun: string;
  statRating: string;
}

export interface Layanan {
  id: string;
  judul: string;
  deskripsi: string;
  warnaBorder: string;
  warnaIkon: string;
  urutan: number;
}

export interface Berita {
  id: string;
  judul: string;
  slug?: string;
  kategori: string;
  tanggal: string;
  excerpt: string;
  konten?: string;
  gambar: string;
  isUtama: boolean;
  status: 'published' | 'draft';
}

export interface TentangKami {
  visi: string;
  misi: string[];
  deskripsi: string;
  deskripsiParagraf2: string;
  poinKeunggulan: string[];
}

export interface Testimoni {
  id: string;
  nama: string;
  teks: string;
  bintang: number;
  jabatan: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  namaOrganisasi: 'UPK Mekarsari',
  tagline: 'Wujudkan Impian bersama UPK Mekarsari',
  deskripsiSingkat: 'Koperasi bersyariah yang siap membantu anda mencapai kesejahteraan finansial melalui layanan Pembiayaan dan Simpanan yang terjamin dan menguntungkan.',
  alamat: 'Jl. Raya Mekarsari No. 123, Desa Mekarsari, Kec. Cileungsi, Kab. Bogor, Jawa Barat 16820',
  telepon: '(021) 823-4567',
  whatsapp: '+62 812-3456-7890',
  email: 'info@upkmekarsari.com',
  emailCs: 'cs@upkmekarsari.com',
  jamOperasional: 'Senin - Jumat: 08:00 - 16:00 WIB',
  jamSabtu: 'Sabtu: 08:00 - 13:00 WIB',
  facebook: 'https://facebook.com/upkmekarsari',
  instagram: 'https://instagram.com/upkmekarsari',
  youtube: '',
  googleMapsUrl: 'https://maps.google.com',
};

export const DEFAULT_HERO: HeroContent = {
  judul: 'Wujudkan Impian bersama UPK Mekarsari',
  subjudul: 'Koperasi bersyariah yang siap membantu anda mencapai kesejahteraan finansial melalui layanan Pembiayaan dan Simpanan yang terjamin dan menguntungkan.',
  labelTombol: 'Aktivasi Akun',
  hrefTombol: '/aktivasi',
  statAnggota: '2000+',
  statTahun: '20+',
  statRating: '98%',
};

export const DEFAULT_LAYANAN: Layanan[] = [
  { id: '1', judul: 'Simpanan Pokok & Wajib', deskripsi: 'Simpanan wajib bagi anggota dengan bagi hasil yang menguntungkan setiap bulannya', warnaBorder: 'border-green-700', warnaIkon: 'text-green-700', urutan: 1 },
  { id: '2', judul: 'Pinjaman Reguler', deskripsi: 'Pinjaman reguler dengan persyaratan mudah dan pembayaran dengan suku bunga kompetitif', warnaBorder: 'border-red-500', warnaIkon: 'text-red-600', urutan: 2 },
  { id: '3', judul: 'Pembiayaan Usaha (UMKM)', deskripsi: 'Dana pinjaman bagi pelaku usaha UMKM dengan bunga yang rendah dan proses mudah', warnaBorder: 'border-green-500', warnaIkon: 'text-green-600', urutan: 3 },
  { id: '4', judul: 'Simpanan Berjangka', deskripsi: 'Simpanan berjangka dengan imbal hasil yang kompetitif dan perlindungan nilai dana anda', warnaBorder: 'border-amber-500', warnaIkon: 'text-amber-600', urutan: 4 },
];

export const DEFAULT_BERITA: Berita[] = [
  { id: '1', judul: 'Rapat Anggota Tahunan (RAT) Tahun Buku 2025 Sukses Digelar', kategori: 'Pengumuman', tanggal: '2026-03-15', excerpt: 'Koperasi UPK Mekarsari sukses menyelenggarakan Rapat Anggota Tahunan dengan agenda pembagian SHU dan pemaparan rencana kerja untuk tahun mendatang.', gambar: '/images/berita-headline.png', isUtama: true, status: 'published' },
  { id: '2', judul: 'Peluncuran Layanan Simulasi Pembiayaan Digital', kategori: 'Layanan', tanggal: '2026-03-10', excerpt: 'Untuk memudahkan anggota dalam merencanakan keuangannya, kami meluncurkan fitur kalkulator simulasi pembiayaan dan simpanan langsung dari website kami.', gambar: '/images/berita-1.png', isUtama: false, status: 'published' },
  { id: '3', judul: 'Kisah Sukses: Bantuan Modal untuk Warung Ibu Siti', kategori: 'Kisah Sukses', tanggal: '2026-02-28', excerpt: 'Melalui program Pembiayaan Usaha, Ibu Siti berhasil mengembangkan warungnya menjadi minimarket kecil yang melayani kebutuhan warga desa.', gambar: '/images/berita-2.png', isUtama: false, status: 'published' },
  { id: '4', judul: 'Beasiswa Pendidikan untuk Putra/Putri Anggota Berprestasi', kategori: 'Sosial', tanggal: '2026-02-15', excerpt: 'Sebagai bentuk tanggung jawab sosial, UPK Mekarsari membagikan beasiswa kepada 50 pelajar berprestasi dari keluarga anggota aktif.', gambar: '/images/berita-3.png', isUtama: false, status: 'published' },
];

export const DEFAULT_TENTANG: TentangKami = {
  visi: 'Menjadi koperasi terdepan dan terpercaya yang memberdayakan masyarakat dalam mencapai kesejahteraan finansial dan kemakmuran bersama.',
  misi: [
    'Memberikan layanan finansial yang mudah, cepat, dan terpercaya',
    'Meningkatkan kesejahteraan anggota melalui bagi hasil yang optimal',
    'Mengembangkan sistem yang transparan dan akuntabel',
    'Memberdayakan masyarakat melalui edukasi finansial',
  ],
  deskripsi: 'UPK Mekarsari adalah koperasi yang telah berdiri sejak lebih dari 15 tahun lalu dengan komitmen untuk membantu anggota mencapai kesejahteraan finansial.',
  deskripsiParagraf2: 'Dengan sistem yang transparan dan profesional, kami terus berkembang menjadi pilihan utama bagi ribuan anggota yang mempercayakan keuangan mereka kepada kami.',
  poinKeunggulan: [
    'Terdaftar resmi di Kementerian Koperasi',
    'Telah melayani lebih dari 1000 anggota aktif',
    'Aset yang terus berkembang setiap tahunnya',
    'Tim profesional dan berpengalaman',
  ],
};

export const DEFAULT_TESTIMONI: Testimoni[] = [
  { id: '1', nama: 'Budi Santoso', jabatan: 'Anggota sejak 2018', teks: 'Saya sangat terbantu dengan pinjaman dari UPK Mekarsari. Prosesnya mudah dan bunganya sangat kompetitif.', bintang: 5 },
  { id: '2', nama: 'Siti Rahayu', jabatan: 'Anggota sejak 2020', teks: 'Sangat bersyukur bisa menjadi anggota UPK Mekarsari. Pelayanan yang ramah dan profesional.', bintang: 5 },
  { id: '3', nama: 'Ahmad Rahman', jabatan: 'Anggota sejak 2019', teks: 'Dengan pelayanan yang baik dan bagi hasil yang kompetitif, UPK Mekarsari menjadi pilihan terbaik saya.', bintang: 5 },
];

interface ContentState {
  settings: SiteSettings;
  hero: HeroContent;
  layanan: Layanan[];
  berita: Berita[];
  tentang: TentangKami;
  testimoni: Testimoni[];

  updateSettings: (patch: Partial<SiteSettings>) => void;
  updateHero: (patch: Partial<HeroContent>) => void;
  setLayanan: (items: Layanan[]) => void;
  setBerita: (items: Berita[]) => void;
  updateTentang: (patch: Partial<TentangKami>) => void;
  setTestimoni: (items: Testimoni[]) => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      hero: DEFAULT_HERO,
      layanan: DEFAULT_LAYANAN,
      berita: DEFAULT_BERITA,
      tentang: DEFAULT_TENTANG,
      testimoni: DEFAULT_TESTIMONI,

      updateSettings: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
      updateHero: (patch) =>
        set((state) => ({ hero: { ...state.hero, ...patch } })),
      setLayanan: (layanan) => set({ layanan }),
      setBerita: (berita) => set({ berita }),
      updateTentang: (patch) =>
        set((state) => ({ tentang: { ...state.tentang, ...patch } })),
      setTestimoni: (testimoni) => set({ testimoni }),
    }),
    {
      name: 'koperasi_content_storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
