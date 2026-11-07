'use client';

const DUMMY_STORAGE_KEYS = [
  'koperasi_simpanan_storage',
  'koperasi_pinjaman_storage',
  'koperasi_jenis_pinjaman_storage',
  'koperasi_anggota_storage',
  'koperasi_mock_users',
  'koperasi_simpanan_mock',
  'koperasi_pinjaman_mock_v2',
  'koperasi_anggota_mock',
];

export function cleanupLegacyMockStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    for (const key of DUMMY_STORAGE_KEYS) {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn('Gagal membersihkan legacy mock storage:', err);
  }
}
