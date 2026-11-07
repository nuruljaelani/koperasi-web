export interface ProfilKoperasi {
  nama: string;
  singkatan: string;
  tagline: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  noTelp: string;
  email: string;
  website: string;
  noSK: string;
  tanggalBerdiri: string;
  npwp: string;
  bankNama: string;
  bankNoRekening: string;
  bankAtasNama: string;
}

export interface NotifikasiSettings {
  emailAktif: boolean;
  emailHost: string;
  emailPort: string;
  emailUser: string;
  emailPassword: string;
  emailPengirim: string;
  namaPengirim: string;
  emailSsl: boolean;
  templatePengajuan: string;
  templateDisetujui: string;
  templateDitolak: string;
  whatsappAktif: boolean;
  whatsappProvider: string;
  whatsappApiKey: string;
  whatsappNomorPengirim: string;
  whatsappNomorAdmin: string;
  templateWaPengajuan: string;
  templateWaStatus: string;
  templateWaJatuhTempo: string;
}

export interface KeamananSettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  logAktivitas: boolean;
}

export interface LaporanSettings {
  formatDefault: 'excel' | 'pdf';
  jadwalBackup: 'harian' | 'mingguan' | 'bulanan';
  retensiBackup: number;
}

export type TabKey = 'profil' | 'notifikasi' | 'keamanan' | 'laporan' | 'tentang';

export const defaultProfil: ProfilKoperasi = {
  nama: 'Unit Pengelola Kegiatan Mekarsari',
  singkatan: 'UPK Mekarsari',
  tagline: 'Bersama Menuju Kesejahteraan',
  alamat: 'Jl. Mekarsari No. 12 RT 03 RW 05',
  kota: 'Bandung',
  provinsi: 'Jawa Barat',
  kodePos: '40123',
  noTelp: '022-5678901',
  email: 'info@upkmekarsari.co.id',
  website: 'https://upkmekarsari.co.id',
  noSK: 'SK/BH/PAD/XVI/IV/2010',
  tanggalBerdiri: '2010-04-15',
  npwp: '12.345.678.9-012.000',
  bankNama: 'Bank BRI',
  bankNoRekening: '1234-5678-9012',
  bankAtasNama: 'UPK Mekarsari',
};

export const defaultNotifikasi: NotifikasiSettings = {
  emailAktif: false,
  emailHost: 'smtp.gmail.com',
  emailPort: '587',
  emailUser: '',
  emailPassword: '',
  emailPengirim: 'noreply@upkmekarsari.co.id',
  namaPengirim: 'UPK Mekarsari',
  emailSsl: true,
  templatePengajuan: 'Yth. {nama_anggota},\n\nPengajuan pinjaman Anda sebesar {jumlah} telah kami terima dan sedang dalam proses review.\n\nTerima kasih.\nUPK Mekarsari',
  templateDisetujui: 'Yth. {nama_anggota},\n\nSelamat! Pengajuan pinjaman Anda sebesar {jumlah} telah DISETUJUI.\n\nSilakan hubungi kami untuk proses pencairan.\n\nTerima kasih.\nUPK Mekarsari',
  templateDitolak: 'Yth. {nama_anggota},\n\nMohon maaf, pengajuan pinjaman Anda tidak dapat kami proses saat ini.\n\nSilakan hubungi pengurus untuk informasi lebih lanjut.\n\nTerima kasih.\nUPK Mekarsari',
  whatsappAktif: false,
  whatsappProvider: 'fonnte',
  whatsappApiKey: '',
  whatsappNomorPengirim: '',
  whatsappNomorAdmin: '',
  templateWaPengajuan: 'Halo {nama_anggota}, pengajuan pinjaman Rp {jumlah} Anda telah diterima dan sedang diproses. - UPK Mekarsari',
  templateWaStatus: 'Halo {nama_anggota}, status pinjaman Anda telah diperbarui menjadi *{status}*. Hubungi kami untuk informasi lebih lanjut. - UPK Mekarsari',
  templateWaJatuhTempo: 'Halo {nama_anggota}, ini adalah pengingat bahwa angsuran pinjaman Anda senilai Rp {jumlah_angsuran} akan jatuh tempo pada {tanggal_jatuh_tempo}. - UPK Mekarsari',
};

export const defaultKeamanan: KeamananSettings = {
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  logAktivitas: true,
};

export const defaultLaporan: LaporanSettings = {
  formatDefault: 'excel',
  jadwalBackup: 'harian',
  retensiBackup: 30,
};
