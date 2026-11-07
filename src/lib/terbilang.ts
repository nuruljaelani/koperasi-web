/**
 * Fungsi konversi angka nominal ke kalimat terbilang Rupiah dalam Bahasa Indonesia.
 * Contoh: 1500000 -> "Satu Juta Lima Ratus Ribu Rupiah"
 */
export function terbilang(n: number): string {
  const angka = Math.floor(Math.abs(n));
  if (angka === 0) return 'Nol Rupiah';

  const satuan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function bilang(num: number): string {
    if (num < 12) {
      return satuan[num];
    } else if (num < 20) {
      return bilang(num - 10) + ' Belas';
    } else if (num < 100) {
      const sisa = num % 10;
      return bilang(Math.floor(num / 10)) + ' Puluh' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 200) {
      const sisa = num - 100;
      return 'Seratus' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 1000) {
      const sisa = num % 100;
      return bilang(Math.floor(num / 100)) + ' Ratus' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 2000) {
      const sisa = num - 1000;
      return 'Seribu' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 1000000) {
      const sisa = num % 1000;
      return bilang(Math.floor(num / 1000)) + ' Ribu' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 1000000000) {
      const sisa = num % 1000000;
      return bilang(Math.floor(num / 1000000)) + ' Juta' + (sisa ? ' ' + bilang(sisa) : '');
    } else if (num < 1000000000000) {
      const sisa = num % 1000000000;
      return bilang(Math.floor(num / 1000000000)) + ' Miliar' + (sisa ? ' ' + bilang(sisa) : '');
    } else {
      const sisa = num % 1000000000000;
      return bilang(Math.floor(num / 1000000000000)) + ' Triliun' + (sisa ? ' ' + bilang(sisa) : '');
    }
  }

  const hasil = bilang(angka).trim();
  return `${hasil} Rupiah`;
}
