'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { useAnggotaData, Anggota } from '@/hooks/useAnggotaData';
import {
  Camera,
  User,
  Shield,
  Loader2,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import PhotoUploadModal from '@/components/member/PhotoUploadModal';
import { uploadApi } from '@/lib/api';

export default function ProfilPage() {
  const { user, changePassword, updateIdentity } = useAuth();
  const { getAnggota, updateAnggota, isLoaded: anggotaLoaded } = useAnggotaData();

  // State Profile Image Modal & Data
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // State Tabs
  const [activeTab, setActiveTab] = useState<'DataPribadi' | 'Keamanan'>('DataPribadi');

  // State Form Data Pribadi
  const [formData, setFormData] = useState({
    nama: '',
    nomorHp: '',
    alamat: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki'
  });
  const [isSavingData, setIsSavingData] = useState(false);
  const [dataMessage, setDataMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // State Form Keamanan
  const [passwordForm, setPasswordForm] = useState({
    lama: '',
    baru: '',
    konfirmasi: ''
  });
  const [isSavingPw, setIsSavingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (anggotaLoaded && user?.anggotaId) {
      const data = getAnggota(user.anggotaId);
      if (!data) return;

      setFormData({
        nama: data.nama,
        nomorHp: data.nomorHp,
        alamat: data.alamat,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin
      });

      const img = data.fotoProfil || useAuthStore.getState().profileImages[user.id];
      if (img) setProfileImage(img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anggotaLoaded, user?.anggotaId]);


  if (!user || !anggotaLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  // Handle Save Photo from Modal to Backend (Cloudinary)
  const handleSavePhoto = async (base64: string) => {
    try {
      const res = await uploadApi.uploadAvatar({
        image: base64,
        memberId: user.anggotaId || undefined,
      });

      const photoUrl = res?.data?.url || base64;
      setProfileImage(photoUrl);
      useAuthStore.getState().setProfileImage(user.id, photoUrl);

      if (res?.data?.isCloudinary) {
        toast.success('Foto profil berhasil diunggah ke Cloudinary!');
      } else {
        toast.success(res?.data?.message || 'Foto profil berhasil diperbarui!');
      }
    } catch (err: any) {
      console.warn('Gagal upload ke server Cloudinary, fallback ke local store:', err);
      setProfileImage(base64);
      useAuthStore.getState().setProfileImage(user.id, base64);
      toast.success('Foto profil berhasil diperbarui!');
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.anggotaId) return;

    setIsSavingData(true);
    setDataMessage(null);

    // Mock API delay
    await new Promise(r => setTimeout(r, 600));

    try {
      updateAnggota(user.anggotaId, {
        ...getAnggota(user.anggotaId)!,
        nama: formData.nama,
        nomorHp: formData.nomorHp,
        alamat: formData.alamat,
        tanggalLahir: formData.tanggalLahir,
        jenisKelamin: formData.jenisKelamin as 'Laki-laki' | 'Perempuan',
      });
      updateIdentity(user.id, formData.nama);
      const msg = 'Data pribadi berhasil diperbarui.';
      setDataMessage({ type: 'success', text: msg });
      toast.success(msg);
    } catch {
      const msg = 'Terjadi kesalahan saat menyimpan data.';
      setDataMessage({ type: 'error', text: msg });
      toast.error(msg);
    } finally {
      setIsSavingData(false);
      setTimeout(() => setDataMessage(null), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);

    if (passwordForm.baru !== passwordForm.konfirmasi) {
      const msg = 'Konfirmasi password tidak cocok.';
      setPwMessage({ type: 'error', text: msg });
      toast.error(msg);
      return;
    }

    if (passwordForm.baru.length < 6) {
      const msg = 'Password minimal 6 karakter.';
      setPwMessage({ type: 'error', text: msg });
      toast.error(msg);
      return;
    }

    setIsSavingPw(true);
    await new Promise(r => setTimeout(r, 600));

    const result = await changePassword(user.id, passwordForm.lama, passwordForm.baru);
    
    if (result.success) {
      const msg = 'Password berhasil diubah!';
      setPwMessage({ type: 'success', text: msg });
      toast.success(msg);
      setPasswordForm({ lama: '', baru: '', konfirmasi: '' });
    } else {
      const msg = result.error || 'Gagal mengubah password.';
      setPwMessage({ type: 'error', text: msg });
      toast.error(msg);
    }
    
    setIsSavingPw(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-slate-500">Kelola data pribadi dan keamanan akun Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar / Profile Summary */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-emerald-50 border-4 border-white shadow-lg flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-emerald-600">
                    {formData.nama.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button 
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Ganti Foto Profil"
                aria-label="Ganti Foto Profil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 leading-tight">{formData.nama || user.nama}</h3>
            <p className="text-xs font-semibold text-emerald-600 mt-1">{user.username}</p>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <button
              onClick={() => setActiveTab('DataPribadi')}
              className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'DataPribadi' 
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600' 
                  : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <User className="w-5 h-5" /> Data Pribadi
            </button>
            <button
              onClick={() => setActiveTab('Keamanan')}
              className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'Keamanan' 
                  ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600' 
                  : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <Shield className="w-5 h-5" /> Keamanan & Akun
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* TAB: DATA PRIBADI */}
          {activeTab === 'DataPribadi' && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Edit Data Pribadi</h2>
              
              <form onSubmit={handleSaveData} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={e => setFormData({...formData, nama: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nomor HP</label>
                    <input
                      type="text"
                      required
                      value={formData.nomorHp}
                      onChange={e => setFormData({...formData, nomorHp: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal Lahir</label>
                    <input
                      type="date"
                      required
                      value={formData.tanggalLahir}
                      onChange={e => setFormData({...formData, tanggalLahir: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Jenis Kelamin</label>
                    <select
                      value={formData.jenisKelamin}
                      onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.alamat}
                      onChange={e => setFormData({...formData, alamat: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {dataMessage && (
                  <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                    dataMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {dataMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p>{dataMessage.text}</p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSavingData}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isSavingData ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: KEAMANAN */}
          {activeTab === 'Keamanan' && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm animate-in fade-in">
              <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Ganti Password</h2>
              
              <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Lama</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.lama}
                    onChange={e => setPasswordForm({...passwordForm, lama: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password Baru</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.baru}
                    onChange={e => setPasswordForm({...passwordForm, baru: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.konfirmasi}
                    onChange={e => setPasswordForm({...passwordForm, konfirmasi: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-colors"
                  />
                </div>

                {pwMessage && (
                  <div className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
                    pwMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {pwMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p>{pwMessage.text}</p>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSavingPw}
                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {isSavingPw ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Modal Upload & Ganti Foto Profil */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImage={profileImage}
        userName={formData.nama || user.nama}
        onSave={handleSavePhoto}
      />
    </div>
  );
}
