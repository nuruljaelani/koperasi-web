'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  UserCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  aktivasiStep1Schema,
  aktivasiOtpSchema,
  aktivasiStep2Schema,
  type AktivasiStep1Values,
  type AktivasiOtpValues,
  type AktivasiStep2Values,
} from '@/lib/validations/auth';

export default function AktivasiAkunPage() {
  const router = useRouter();
  const { setAuthSession } = useAuth();

  // Wizard Step State: 1 = Identitas, 2 = OTP, 3 = Password
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Verified Data Preview (dari Step 1)
  const [verifiedMember, setVerifiedMember] = useState<{
    id: string;
    noAnggota: string;
    namaLengkap: string;
    noHp: string;
    isVerified?: boolean;
  } | null>(null);

  // Countdown timer untuk kirim ulang OTP
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Form Step 1: Identitas
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    getValues: getValuesStep1,
    formState: { errors: errorsStep1, isSubmitting: isSubmittingStep1 },
  } = useForm<AktivasiStep1Values>({
    resolver: zodResolver(aktivasiStep1Schema),
    defaultValues: {
      identifier: '',
      noHp: '',
      tanggalLahir: '',
    },
  });

  // Form Step 2: OTP
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    setValue: setValueOtp,
    formState: { errors: errorsOtp, isSubmitting: isSubmittingOtp },
  } = useForm<AktivasiOtpValues>({
    resolver: zodResolver(aktivasiOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Form Step 3: Kredensial (Username & Password)
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    setValue: setValueStep3,
    formState: { errors: errorsStep3, isSubmitting: isSubmittingStep3 },
  } = useForm<AktivasiStep2Values>({
    resolver: zodResolver(aktivasiStep2Schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Step 1: Verifikasi Data Anggota Lama
  const onStep1Submit = async (values: AktivasiStep1Values) => {
    setServerError('');
    setSuccessMsg('');

    try {
      const res = await authApi.cekAktivasi({
        identifier: values.identifier.trim(),
        noHp: values.noHp.trim(),
        tanggalLahir: values.tanggalLahir || undefined,
      });

      if (res.status === 'success' && res.data) {
        const data = res.data;
        const noAnggota = data.no_anggota || data.noAnggota || values.identifier;
        const namaLengkap = data.nama_lengkap || data.namaLengkap || 'Anggota Koperasi';
        const noHp = data.no_hp || data.noHp || values.noHp;

        setVerifiedMember({
          id: data.id,
          noAnggota,
          namaLengkap,
          noHp,
          isVerified: data.is_verified,
        });

        // Set saran username untuk step kredensial
        const suggestedUser =
          noAnggota.toLowerCase().replace(/[^a-z0-9_]/g, '') ||
          namaLengkap.toLowerCase().split(' ')[0] + Math.floor(10 + Math.random() * 90);
        setValueStep3('username', suggestedUser);

        // Jika nomor sudah terverifikasi sebelumnya, langsung ke step 3 (Buat Kredensial)
        if (data.is_verified) {
          toast.success('Data anggota terverifikasi!');
          setStep(3);
        } else {
          // Buka step 2 (Verifikasi OTP) - pastikan input OTP kosong untuk diisi manual oleh pengguna
          toast.info('Kode OTP telah dikirimkan via WhatsApp');
          setStep(2);
          setValueOtp('otp', '');
          setOtpCountdown(60);
        }
      } else {
        const msg = res.message ||
          'Data anggota tidak ditemukan. Pastikan Nomor Anggota/NIK dan No. HP sesuai data terdaftar di buku koperasi.';
        setServerError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat memverifikasi data.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  // Handle Kirim Ulang OTP
  const handleResendOtp = async () => {
    if (otpCountdown > 0) return;
    setServerError('');
    const step1Data = getValuesStep1();

    try {
      const res = await authApi.cekAktivasi({
        identifier: step1Data.identifier.trim(),
        noHp: step1Data.noHp.trim(),
        tanggalLahir: step1Data.tanggalLahir || undefined,
      });

      if (res.status === 'success') {
        setOtpCountdown(60);
        setValueOtp('otp', '');
        const msg = 'Kode OTP baru telah dikirimkan via WhatsApp.';
        setSuccessMsg(msg);
        toast.success(msg);
      } else {
        const msg = res.message || 'Gagal mengirim ulang kode OTP.';
        setServerError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Gagal mengirim ulang OTP.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  // Handle Step 2: Verifikasi OTP
  const onOtpSubmit = async (values: AktivasiOtpValues) => {
    setServerError('');
    setSuccessMsg('');
    const step1Data = getValuesStep1();

    try {
      const res = await authApi.verifyOTP({
        identifier: step1Data.identifier.trim(),
        noHp: step1Data.noHp.trim(),
        otp: values.otp.trim(),
      });

      if (res.status === 'success') {
        const msg = 'Nomor WhatsApp berhasil diverifikasi!';
        setSuccessMsg(msg);
        toast.success(msg);
        setVerifiedMember((prev) => (prev ? { ...prev, isVerified: true } : null));
        setStep(3);
      } else {
        const msg = res.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.';
        setServerError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan verifikasi OTP.';
      setServerError(msg);
      toast.error(msg);
    }
  };

  // Handle Step 3: Eksekusi Aktivasi Akun (Buat Password)
  const onStep3Submit = async (values: AktivasiStep2Values) => {
    setServerError('');
    setSuccessMsg('');

    const step1Data = getValuesStep1();

    try {
      const res = await authApi.aktivasi({
        identifier: step1Data.identifier.trim(),
        noHp: step1Data.noHp.trim(),
        tanggalLahir: step1Data.tanggalLahir || undefined,
        username: values.username.trim(),
        password: values.password,
        email: values.email?.trim() || undefined,
      });

      if (res.status === 'success' && res.data) {
        const msg = 'Aktivasi akun berhasil! Mengalihkan ke dashboard...';
        setSuccessMsg(msg);
        toast.success(msg);

        // Simpan sesi autentikasi langsung
        const apiUser = res.data.user;
        const apiMember = res.data.member;
        const token = res.data.token?.accessToken || res.data.token || '';
        console.log(res)

        setAuthSession(token, {
          id: apiUser.id,
          username: apiUser.username,
          role: apiUser.role,
          anggotaId: apiMember?.id,
          nama: apiMember?.nama_lengkap || apiMember?.namaLengkap || apiUser.username,
          phone: apiUser.phone,
        });

        // Redirect ke dashboard anggota
        setTimeout(() => {
          router.replace('/member/dashboard');
        }, 1200);
      } else {
        setServerError(res.message || 'Gagal mengaktifkan akun. Silakan coba lagi.');
      }
    } catch (err: any) {
      setServerError(err.message || 'Terjadi kesalahan koneksi.');
    }
  };

  return (
    <div className="min-h-[88vh] bg-gradient-to-b from-neutral-50 to-emerald-50/30 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-neutral-100 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 2L24 4L28 12L24 20L16 28L8 20L4 12L8 4Z" fill="#D4A017" />
              <path d="M12 8L16 6L20 8L22 12L20 16L16 20L12 16L10 12L12 8Z" fill="#1B5E20" />
              <path d="M14 10L16 9L18 10L19 12L18 14L16 16L14 14L13 12L14 10Z" fill="#F5C518" />
            </svg>
            <span className="text-xl font-bold text-neutral-900 tracking-tight">
              UPK Mekarsari
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Aktivasi Akun Anggota
          </h1>
          <p className="text-neutral-500 mt-2 text-sm max-w-md mx-auto">
            Khusus anggota yang sudah terdaftar di buku koperasi lama dan baru pertama kali mengakses layanan website.
          </p>
        </div>

        {/* Step Indicator (1 - Identitas, 2 - OTP, 3 - Password) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              step === 1
                ? 'bg-primary-700 text-white shadow-sm'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">
              1
            </span>
            <span className="hidden sm:inline">Identitas</span>
          </div>
          <div className="w-4 sm:w-6 h-0.5 bg-neutral-200" />
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              step === 2
                ? 'bg-primary-700 text-white shadow-sm'
                : step > 2
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">
              2
            </span>
            <span className="hidden sm:inline">Verifikasi OTP</span>
          </div>
          <div className="w-4 sm:w-6 h-0.5 bg-neutral-200" />
          <div
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
              step === 3
                ? 'bg-primary-700 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">
              3
            </span>
            <span className="hidden sm:inline">Password</span>
          </div>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm text-rose-600 font-medium leading-relaxed">{serverError}</p>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 font-semibold">{successMsg}</p>
          </div>
        )}

        {/* ================= STEP 1: VERIFIKASI IDENTITAS ================= */}
        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSubmitStep1(onStep1Submit)} noValidate>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Tidak memerlukan email. Masukkan <strong>Nomor Anggota</strong> atau <strong>NIK KTP</strong> dan <strong>Nomor HP</strong> yang pernah Anda daftarkan ke pengurus koperasi.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Nomor Anggota atau NIK KTP
              </label>
              <div className="relative">
                <CreditCard className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  {...registerStep1('identifier')}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                    errorsStep1.identifier
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                      : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Contoh: KOP-2023-0088 atau 3201xxxxxxxxxxxx"
                />
              </div>
              {errorsStep1.identifier && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorsStep1.identifier.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Nomor Handphone Terdaftar
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  {...registerStep1('noHp')}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                    errorsStep1.noHp
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                      : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Contoh: 085712345678"
                />
              </div>
              {errorsStep1.noHp && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorsStep1.noHp.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-neutral-800">
                  Tanggal Lahir (Opsional)
                </label>
                <span className="text-xs text-neutral-400 font-normal">Opsional</span>
              </div>
              <div className="relative">
                <Calendar className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  {...registerStep1('tanggalLahir')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingStep1}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary-700/20 text-sm cursor-pointer"
            >
              {isSubmittingStep1 ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mencari Data Anggota...
                </>
              ) : (
                <>
                  Verifikasi Data Anggota
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ================= STEP 2: VERIFIKASI OTP ================= */}
        {step === 2 && verifiedMember && (
          <form className="space-y-5" onSubmit={handleSubmitOtp(onOtpSubmit)} noValidate>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-lg">
                {verifiedMember.namaLengkap.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  <UserCheck className="w-3.5 h-3.5" />
                  Data Anggota Ditemukan
                </div>
                <h4 className="text-base font-bold text-neutral-900 truncate mt-0.5">
                  {verifiedMember.namaLengkap}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  No. Anggota: <strong>{verifiedMember.noAnggota}</strong> • No. HP: {verifiedMember.noHp}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Kami telah mengirimkan 6 digit kode OTP verifikasi ke WhatsApp nomor <strong>{verifiedMember.noHp}</strong>.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Masukkan 6 Digit Kode OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                {...registerOtp('otp')}
                className={`w-full px-4 py-3 rounded-xl border text-center tracking-widest text-xl font-bold outline-none transition-colors ${
                  errorsOtp.otp
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="------"
              />
              {errorsOtp.otp && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorsOtp.otp.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
              <span>Tidak menerima kode?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={otpCountdown > 0}
                className="font-semibold text-primary-700 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${otpCountdown > 0 ? 'animate-spin' : ''}`} />
                {otpCountdown > 0 ? `Kirim ulang (${otpCountdown}s)` : 'Kirim Ulang OTP'}
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors text-sm cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmittingOtp}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary-700/20 text-sm cursor-pointer"
              >
                {isSubmittingOtp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memverifikasi OTP...
                  </>
                ) : (
                  <>
                    Verifikasi OTP & Lanjutkan
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 3: BUAT PASSWORD & USERNAME ================= */}
        {step === 3 && verifiedMember && (
          <form className="space-y-5" onSubmit={handleSubmitStep3(onStep3Submit)} noValidate>
            {/* Kartu Profil Terverifikasi */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-lg">
                {verifiedMember.namaLengkap.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Anggota Terverifikasi
                </div>
                <h4 className="text-base font-bold text-neutral-900 truncate mt-0.5">
                  {verifiedMember.namaLengkap}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  No. Anggota: <strong>{verifiedMember.noAnggota}</strong> • HP: {verifiedMember.noHp}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Username Pilihan
              </label>
              <input
                type="text"
                {...registerStep3('username')}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                  errorsStep3.username
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="Buat username untuk login"
              />
              {errorsStep3.username ? (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorsStep3.username.message}
                </p>
              ) : (
                <p className="text-[11px] text-neutral-400 mt-1">
                  Gunakan kombinasi huruf, angka, dan underscore.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-neutral-800">
                  Email
                </label>
                <span className="text-xs text-neutral-400 font-normal">Boleh dikosongkan</span>
              </div>
              <input
                type="email"
                {...registerStep3('email')}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                  errorsStep3.email
                    ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                    : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                }`}
                placeholder="nama@email.com (Opsional)"
              />
              {errorsStep3.email && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorsStep3.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...registerStep3('password')}
                    className={`w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-colors text-sm ${
                      errorsStep3.password
                        ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                        : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Min. 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 transition-colors"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorsStep3.password && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errorsStep3.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...registerStep3('confirmPassword')}
                  className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors text-sm ${
                    errorsStep3.confirmPassword
                      ? 'border-rose-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400 bg-rose-50/20'
                      : 'border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="Ketik ulang password"
                />
                {errorsStep3.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errorsStep3.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(verifiedMember.isVerified ? 1 : 2)}
                className="px-5 py-3.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors text-sm cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmittingStep3}
                className="flex-1 flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary-700/20 text-sm cursor-pointer"
              >
                {isSubmittingStep3 ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan Akun...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Aktifkan Akun & Masuk
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <Link
            href="/login"
            className="text-neutral-600 hover:text-primary-700 font-medium transition-colors"
          >
            ← Kembali ke Halaman Login
          </Link>
          <Link
            href="/register"
            className="text-neutral-500 hover:text-neutral-700 text-xs transition-colors"
          >
            Info Pendaftaran Anggota Baru di Kantor →
          </Link>
        </div>
      </div>
    </div>
  );
}
