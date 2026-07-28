'use client';

import { useState } from 'react';
import {
  Building2,
  Bell,
  Shield,
  BarChart3,
  Info,
  Save,
  CheckCircle2,
  Upload,
  Mail,
  MessageCircle,
  Lock,
  Key,
  Clock,
  Download,
  Database,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Cpu,
  Globe,
  Phone,
  MapPin,
  Hash,
  Calendar,
  CreditCard,
  Server,
  Send,
  RefreshCw,
  Smartphone
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfilKoperasi {
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

interface NotifikasiSettings {
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

interface KeamananSettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  logAktivitas: boolean;
}

interface LaporanSettings {
  formatDefault: 'excel' | 'pdf';
  jadwalBackup: 'harian' | 'mingguan' | 'bulanan';
  retensiBackup: number;
}

// ─── Initial States ────────────────────────────────────────────────────────────

const defaultProfil: ProfilKoperasi = {
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

const defaultNotifikasi: NotifikasiSettings = {
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

const defaultKeamanan: KeamananSettings = {
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  logAktivitas: true,
};

const defaultLaporan: LaporanSettings = {
  formatDefault: 'excel',
  jadwalBackup: 'harian',
  retensiBackup: 30,
};

// ─── Helper Components ─────────────────────────────────────────────────────────

function SectionCard({ title, description, icon: Icon, children }: {
  title: string;
  description?: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-300";
const textareaClass = `${inputClass} resize-none font-mono text-xs leading-relaxed`;

function Toggle({ value, onChange, label, desc }: { value: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div>
        <p className="text-sm font-bold text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${value ? 'bg-emerald-600' : 'bg-slate-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
}

function SaveBanner({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Perubahan tersimpan</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Ada perubahan yang belum disimpan</span>
          </>
        )}
      </div>
      <button
        onClick={onSave}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <Save className="w-4 h-4" />
        Simpan Pengaturan
      </button>
    </div>
  );
}

// ─── Tab Content Components ────────────────────────────────────────────────────

function TabProfilKoperasi({ data, onChange }: { data: ProfilKoperasi; onChange: (d: ProfilKoperasi) => void }) {
  const set = (key: keyof ProfilKoperasi) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <SectionCard title="Identitas Koperasi" icon={Building2} description="Informasi dasar yang ditampilkan ke anggota dan laporan resmi">
        <div className="grid md:grid-cols-2 gap-5">
          <FormField label="Nama Lengkap Koperasi">
            <input className={inputClass} value={data.nama} onChange={set('nama')} placeholder="Unit Pengelola Kegiatan..." />
          </FormField>
          <FormField label="Singkatan / Kode">
            <input className={inputClass} value={data.singkatan} onChange={set('singkatan')} placeholder="UPK Mekarsari" />
          </FormField>
          <FormField label="Tagline / Slogan" hint="Ditampilkan pada halaman publik dan dokumen resmi">
            <input className={inputClass} value={data.tagline} onChange={set('tagline')} placeholder="Bersama Menuju Kesejahteraan" />
          </FormField>
          <FormField label="Email Resmi">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} value={data.email} onChange={set('email')} type="email" placeholder="info@koperasi.co.id" />
            </div>
          </FormField>
          <FormField label="No. Telepon">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} value={data.noTelp} onChange={set('noTelp')} placeholder="022-..." />
            </div>
          </FormField>
          <FormField label="Website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} value={data.website} onChange={set('website')} placeholder="https://..." />
            </div>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Alamat" icon={MapPin} description="Alamat kantor utama koperasi">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-3">
            <FormField label="Alamat Lengkap">
              <input className={inputClass} value={data.alamat} onChange={set('alamat')} placeholder="Jl. Nama Jalan No. ..." />
            </FormField>
          </div>
          <FormField label="Kota / Kabupaten">
            <input className={inputClass} value={data.kota} onChange={set('kota')} placeholder="Bandung" />
          </FormField>
          <FormField label="Provinsi">
            <input className={inputClass} value={data.provinsi} onChange={set('provinsi')} placeholder="Jawa Barat" />
          </FormField>
          <FormField label="Kode Pos">
            <input className={inputClass} value={data.kodePos} onChange={set('kodePos')} placeholder="40xxx" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Legalitas" icon={Hash} description="Data legal dan perizinan koperasi">
        <div className="grid md:grid-cols-2 gap-5">
          <FormField label="No. SK Pendirian">
            <input className={inputClass} value={data.noSK} onChange={set('noSK')} placeholder="SK/BH/..." />
          </FormField>
          <FormField label="Tanggal Berdiri">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputClass} pl-9`} type="date" value={data.tanggalBerdiri} onChange={set('tanggalBerdiri')} />
            </div>
          </FormField>
          <FormField label="NPWP" hint="Format: XX.XXX.XXX.X-XXX.000">
            <input className={inputClass} value={data.npwp} onChange={set('npwp')} placeholder="12.345.678.9-012.000" />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Rekening Bank" icon={CreditCard} description="Rekening utama untuk transaksi koperasi">
        <div className="grid md:grid-cols-3 gap-5">
          <FormField label="Nama Bank">
            <input className={inputClass} value={data.bankNama} onChange={set('bankNama')} placeholder="Bank BRI" />
          </FormField>
          <FormField label="No. Rekening">
            <input className={inputClass} value={data.bankNoRekening} onChange={set('bankNoRekening')} placeholder="0000-0000-0000" />
          </FormField>
          <FormField label="Atas Nama">
            <input className={inputClass} value={data.bankAtasNama} onChange={set('bankAtasNama')} placeholder="UPK Mekarsari" />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}

function TabNotifikasi({ data, onChange }: { data: NotifikasiSettings; onChange: (d: NotifikasiSettings) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const set = (key: keyof NotifikasiSettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const varHint = 'Variabel: {nama_anggota}, {jumlah}, {status}, {tanggal_jatuh_tempo}, {jumlah_angsuran}';

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[#F8FAFC] text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Notifikasi Email
          </span>
        </div>
      </div>

      <SectionCard title="Konfigurasi SMTP" icon={Server} description="Server email untuk mengirimkan notifikasi kepada anggota">
        <Toggle
          value={data.emailAktif}
          onChange={(v) => onChange({ ...data, emailAktif: v })}
          label="Aktifkan Notifikasi Email"
          desc="Kirim email otomatis saat pengajuan, persetujuan, atau penolakan pinjaman"
        />

        {data.emailAktif && (
          <div className="space-y-5 pt-2">
            <div className="grid md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <FormField label="SMTP Host" hint="Misal: smtp.gmail.com atau mail.domain.com">
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input className={`${inputClass} pl-9`} value={data.emailHost} onChange={set('emailHost')} placeholder="smtp.gmail.com" />
                  </div>
                </FormField>
              </div>
              <FormField label="Port">
                <input className={inputClass} value={data.emailPort} onChange={set('emailPort')} placeholder="587" />
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <FormField label="Username SMTP">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className={`${inputClass} pl-9`} value={data.emailUser} onChange={set('emailUser')} placeholder="user@gmail.com" />
                </div>
              </FormField>
              <FormField label="Password SMTP">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className={`${inputClass} pl-9 pr-10`}
                    type={showPassword ? 'text' : 'password'}
                    value={data.emailPassword}
                    onChange={set('emailPassword')}
                    placeholder="App password / SMTP password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>
              <FormField label="Nama Pengirim">
                <input className={inputClass} value={data.namaPengirim} onChange={set('namaPengirim')} placeholder="UPK Mekarsari" />
              </FormField>
              <FormField label="Email Pengirim (From)">
                <div className="relative">
                  <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className={`${inputClass} pl-9`} value={data.emailPengirim} onChange={set('emailPengirim')} placeholder="noreply@koperasi.co.id" />
                </div>
              </FormField>
            </div>

            <Toggle
              value={data.emailSsl}
              onChange={(v) => onChange({ ...data, emailSsl: v })}
              label="Gunakan SSL/TLS"
              desc="Direkomendasikan untuk keamanan pengiriman email"
            />

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <span>Untuk Gmail, gunakan <strong>App Password</strong> (bukan password akun). Aktifkan 2-Step Verification terlebih dahulu di akun Google Anda.</span>
            </div>
          </div>
        )}
      </SectionCard>

      {data.emailAktif && (
        <SectionCard title="Template Email" icon={Mail} description="Teks email yang dikirimkan ke anggota pada setiap kejadian">
          <div className="space-y-5">
            <FormField label="Template: Pengajuan Diterima" hint={varHint}>
              <textarea className={`${textareaClass} h-28`} value={data.templatePengajuan} onChange={set('templatePengajuan')} />
            </FormField>
            <FormField label="Template: Pinjaman Disetujui" hint={varHint}>
              <textarea className={`${textareaClass} h-28`} value={data.templateDisetujui} onChange={set('templateDisetujui')} />
            </FormField>
            <FormField label="Template: Pinjaman Ditolak" hint={varHint}>
              <textarea className={`${textareaClass} h-28`} value={data.templateDitolak} onChange={set('templateDitolak')} />
            </FormField>
          </div>
        </SectionCard>
      )}

      {/* WhatsApp Section */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-[#F8FAFC] text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5" /> Notifikasi WhatsApp
          </span>
        </div>
      </div>

      <SectionCard title="Konfigurasi WhatsApp Gateway" icon={Smartphone} description="Kirim notifikasi WhatsApp otomatis menggunakan layanan gateway pihak ketiga">
        <Toggle
          value={data.whatsappAktif}
          onChange={(v) => onChange({ ...data, whatsappAktif: v })}
          label="Aktifkan Notifikasi WhatsApp"
          desc="Kirim pesan WhatsApp otomatis ke anggota dan admin"
        />

        {data.whatsappAktif && (
          <div className="space-y-5 pt-2">
            <FormField label="Provider Gateway" hint="Pilih layanan yang Anda gunakan">
              <select className={inputClass} value={data.whatsappProvider} onChange={set('whatsappProvider')}>
                <option value="fonnte">Fonnte</option>
                <option value="zenziva">Zenziva</option>
                <option value="wablas">Wablas</option>
                <option value="whatsapp_business">WhatsApp Business API (Meta)</option>
              </select>
            </FormField>

            <div className="grid md:grid-cols-2 gap-5">
              <FormField label="API Key / Token" hint="Dapatkan dari dashboard provider Anda">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className={`${inputClass} pl-9`} value={data.whatsappApiKey} onChange={set('whatsappApiKey')} placeholder="API Key..." />
                </div>
              </FormField>
              <FormField label="Nomor Pengirim (Sender)" hint="Nomor WA yang terdaftar di gateway">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className={`${inputClass} pl-9`} value={data.whatsappNomorPengirim} onChange={set('whatsappNomorPengirim')} placeholder="628xxx" />
                </div>
              </FormField>
              <FormField label="Nomor Admin Penerima Notif" hint="Nomor admin yang menerima notifikasi pengajuan baru">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input className={`${inputClass} pl-9`} value={data.whatsappNomorAdmin} onChange={set('whatsappNomorAdmin')} placeholder="628xxx" />
                </div>
              </FormField>
            </div>
          </div>
        )}
      </SectionCard>

      {data.whatsappAktif && (
        <SectionCard title="Template Pesan WhatsApp" icon={MessageCircle} description="Pesan WhatsApp yang dikirimkan ke anggota secara otomatis">
          <div className="space-y-5">
            <FormField label="Template: Pengajuan Masuk" hint={varHint}>
              <textarea className={`${textareaClass} h-24`} value={data.templateWaPengajuan} onChange={set('templateWaPengajuan')} />
            </FormField>
            <FormField label="Template: Status Berubah" hint={varHint}>
              <textarea className={`${textareaClass} h-24`} value={data.templateWaStatus} onChange={set('templateWaStatus')} />
            </FormField>
            <FormField label="Template: Pengingat Jatuh Tempo" hint={varHint}>
              <textarea className={`${textareaClass} h-24`} value={data.templateWaJatuhTempo} onChange={set('templateWaJatuhTempo')} />
            </FormField>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function TabKeamanan({ data, onChange }: { data: KeamananSettings; onChange: (d: KeamananSettings) => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleGantiPassword = () => {
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    setPwSuccess(true);
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    setTimeout(() => setPwSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Ganti Password Admin" icon={Lock} description="Ubah password untuk akun administrator">
        <div className="grid md:grid-cols-2 gap-5 max-w-xl">
          <div className="md:col-span-2">
            <FormField label="Password Saat Ini">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  className={`${inputClass} pl-9 pr-10`}
                  type={showPw ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Password saat ini"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>
          </div>
          <FormField label="Password Baru">
            <input
              className={inputClass}
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
            />
          </FormField>
          <FormField label="Konfirmasi Password Baru">
            <input
              className={`${inputClass} ${confirmPassword && newPassword !== confirmPassword ? 'border-rose-300 ring-1 ring-rose-300' : ''}`}
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-rose-500 mt-1">Password tidak cocok</p>
            )}
          </FormField>
        </div>

        {pwSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Password berhasil diubah!
          </div>
        )}

        <button
          onClick={handleGantiPassword}
          disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
        >
          Ganti Password
        </button>
      </SectionCard>

      <SectionCard title="Pengaturan Sesi & Akses" icon={Clock} description="Atur batas waktu sesi dan percobaan login yang diizinkan">
        <div className="grid md:grid-cols-2 gap-5 max-w-xl">
          <FormField label="Session Timeout" hint="Waktu tidak aktif sebelum otomatis logout (menit)">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className={`${inputClass} pl-9`}
                type="number"
                min={5}
                max={480}
                value={data.sessionTimeout}
                onChange={e => onChange({ ...data, sessionTimeout: Number(e.target.value) })}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">menit</span>
            </div>
          </FormField>
          <FormField label="Maks. Percobaan Login" hint="Jumlah login gagal sebelum akun dikunci sementara">
            <input
              className={inputClass}
              type="number"
              min={3}
              max={20}
              value={data.maxLoginAttempts}
              onChange={e => onChange({ ...data, maxLoginAttempts: Number(e.target.value) })}
            />
          </FormField>
        </div>

        <Toggle
          value={data.logAktivitas}
          onChange={v => onChange({ ...data, logAktivitas: v })}
          label="Rekam Log Aktivitas Admin"
          desc="Catat semua tindakan admin (login, ubah data, approve pinjaman, dll) ke dalam log audit"
        />
      </SectionCard>
    </div>
  );
}

function TabLaporan({ data, onChange }: { data: LaporanSettings; onChange: (d: LaporanSettings) => void }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Format Ekspor Laporan" icon={Download} description="Pengaturan default untuk ekspor dan cetak laporan">
        <FormField label="Format Default Ekspor" hint="Format ini digunakan saat mengklik tombol 'Export' di halaman laporan">
          <div className="flex gap-3">
            {(['excel', 'pdf'] as const).map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => onChange({ ...data, formatDefault: fmt })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all cursor-pointer ${
                  data.formatDefault === fmt
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                }`}
              >
                {fmt === 'excel' ? '📊 Microsoft Excel (.xlsx)' : '📄 PDF Document (.pdf)'}
              </button>
            ))}
          </div>
        </FormField>
      </SectionCard>

      <SectionCard title="Backup Data" icon={Database} description="Jadwal dan pengaturan backup data koperasi secara otomatis">
        <FormField label="Jadwal Backup Otomatis" hint="Backup data seluruh sistem secara berkala">
          <div className="flex gap-3 flex-wrap">
            {([
              { value: 'harian', label: '🕐 Harian', desc: 'Setiap hari pukul 02:00' },
              { value: 'mingguan', label: '📅 Mingguan', desc: 'Setiap Minggu pagi' },
              { value: 'bulanan', label: '🗓️ Bulanan', desc: 'Tanggal 1 setiap bulan' },
            ] as const).map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ ...data, jadwalBackup: opt.value })}
                className={`flex-1 min-w-[130px] py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  data.jadwalBackup === opt.value
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <p className={`text-sm font-bold ${data.jadwalBackup === opt.value ? 'text-emerald-800' : 'text-slate-700'}`}>{opt.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Retensi Backup" hint="Backup yang lebih lama dari periode ini akan dihapus otomatis">
          <div className="flex items-center gap-3 max-w-xs">
            <input
              type="range"
              min={7}
              max={365}
              step={7}
              value={data.retensiBackup}
              onChange={e => onChange({ ...data, retensiBackup: Number(e.target.value) })}
              className="flex-1 accent-emerald-600 cursor-pointer"
            />
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg min-w-[70px] text-center">
              {data.retensiBackup} hari
            </span>
          </div>
        </FormField>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Backup Sekarang
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Unduh Backup Terakhir
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

function TabTentangSistem() {
  const info = [
    { label: 'Nama Aplikasi', value: 'Koperasi Web — Portal Manajemen' },
    { label: 'Versi', value: 'v0.1.0' },
    { label: 'Framework', value: 'Next.js 16 + React 19' },
    { label: 'UI Library', value: 'Tailwind CSS v4 + Lucide React' },
    { label: 'Database (Mock)', value: 'localStorage (Client-side Mock)' },
    { label: 'Lingkungan', value: process.env.NODE_ENV || 'development' },
  ];

  return (
    <div className="space-y-6">
      <SectionCard title="Informasi Sistem" icon={Cpu} description="Detail teknis aplikasi yang sedang berjalan">
        <div className="divide-y divide-slate-100">
          {info.map(item => (
            <div key={item.label} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500 font-medium">{item.label}</span>
              <span className="text-sm font-bold text-slate-800 font-mono bg-slate-50 px-3 py-1 rounded-lg">{item.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pengembang" icon={Info} description="Informasi kontak tim pengembang aplikasi">
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
            <p className="text-sm font-bold text-emerald-900 mb-1">UPK Mekarsari Web Portal</p>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Sistem manajemen koperasi terintegrasi untuk pengelolaan anggota, simpanan, pinjaman, dan pelaporan keuangan secara digital.
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center pt-2">
            © 2026 UPK Mekarsari. Seluruh data bersifat rahasia dan dilindungi.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type TabKey = 'profil' | 'notifikasi' | 'keamanan' | 'laporan' | 'tentang';

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'profil', label: 'Profil Koperasi', icon: Building2 },
  { key: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { key: 'keamanan', label: 'Keamanan', icon: Shield },
  { key: 'laporan', label: 'Laporan & Backup', icon: BarChart3 },
  { key: 'tentang', label: 'Tentang Sistem', icon: Info },
];

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profil');
  const [saved, setSaved] = useState(true);

  const [profil, setProfil] = useState<ProfilKoperasi>(defaultProfil);
  const [notifikasi, setNotifikasi] = useState<NotifikasiSettings>(defaultNotifikasi);
  const [keamanan, setKeamanan] = useState<KeamananSettings>(defaultKeamanan);
  const [laporan, setLaporan] = useState<LaporanSettings>(defaultLaporan);

  const handleChange = (setter: (v: any) => void) => (v: any) => {
    setter(v);
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save — in production: PUT /api/settings
    setSaved(true);
  };

  return (
    <div className="space-y-0">
      <SaveBanner onSave={handleSave} saved={saved} />

      {/* Page Header */}
      <div className="pt-6 pb-2 space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Pengaturan Sistem</h1>
        <p className="text-slate-500 text-sm">Kelola konfigurasi dan preferensi sistem koperasi</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 py-3 scrollbar-hide">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'profil' && (
          <TabProfilKoperasi data={profil} onChange={handleChange(setProfil)} />
        )}
        {activeTab === 'notifikasi' && (
          <TabNotifikasi data={notifikasi} onChange={handleChange(setNotifikasi)} />
        )}
        {activeTab === 'keamanan' && (
          <TabKeamanan data={keamanan} onChange={handleChange(setKeamanan)} />
        )}
        {activeTab === 'laporan' && (
          <TabLaporan data={laporan} onChange={handleChange(setLaporan)} />
        )}
        {activeTab === 'tentang' && <TabTentangSistem />}
      </div>
    </div>
  );
}
