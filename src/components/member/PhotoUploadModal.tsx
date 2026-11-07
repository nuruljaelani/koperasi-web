'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Check, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string | null;
  userName?: string;
  onSave: (base64: string) => Promise<void> | void;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  currentImage,
  userName = 'Member',
  onSave,
}: PhotoUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPreview(null);
      setFileDetails(null);
      setIsDragging(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);



  if (!isOpen) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Format file tidak didukung. Harap pilih gambar (JPG, PNG, WEBP).');
      return;
    }

    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      toast.error('Ukuran file terlalu besar. Maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setFileDetails({
        name: file.name,
        size: formatFileSize(file.size),
      });
      toast.info('Foto terpilih! Silakan periksa pratinjau sebelum menyimpan.');
    };
    reader.onerror = () => {
      toast.error('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input value so re-selecting same file triggers onChange
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!preview) {
      toast.error('Silakan pilih foto terlebih dahulu.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(preview);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan foto profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPhoto = () => {
    setPreview(null);
    setFileDetails(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitting ? () => {} : onClose}
      title="Upload Foto Profil"
      description="Pilih foto terbaik untuk identitas akun anggota koperasi Anda."
      icon={<ImageIcon className="w-5 h-5" />}
      size="lg"
      closeOnBackdropClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="p-6 sm:p-8 space-y-6">

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Modal Body: Dropzone or Preview */}
        {!preview ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-3.5 group ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
                : 'border-slate-200 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/30'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 shadow-sm ${
                isDragging
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-600 border border-slate-100'
              }`}
            >
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Tarik & letakkan foto di sini, atau{' '}
                <span className="text-emerald-600 underline underline-offset-2">pilih file</span>
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Mendukung format JPG, PNG, atau WEBP (Maksimal 5 MB)
              </p>
            </div>

            {/* Current photo badge info */}
            {currentImage && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-500">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Foto profil saat ini sudah terpasang</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5 bg-slate-50/60 rounded-3xl p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Avatar Preview Container */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-100 ring-4 ring-emerald-100/70">
                  <img
                    src={preview}
                    alt="Preview Foto Baru"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* File Info and Re-pick Actions */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                  Pratinjau Baru
                </div>
                <h4 className="text-sm font-bold text-slate-800 truncate" title={fileDetails?.name}>
                  {fileDetails?.name || 'Foto Profil'}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  Ukuran: <span className="font-semibold text-slate-600">{fileDetails?.size}</span>
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Ganti File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors active:scale-95 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Foto ini akan tampil pada kartu anggota dan seluruh portal koperasi Anda.</span>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!preview || isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simpan Foto Profil</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
