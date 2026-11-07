'use client';

import React from 'react';
import { QrCode, RefreshCw, Clock, CheckCircle2, X } from 'lucide-react';
import { WaDeviceData } from '@/lib/api';

interface WhatsAppQrModalProps {
  open: boolean;
  onClose: () => void;
  device: WaDeviceData | null;
  countdown: number;
  actionLoading: boolean;
  onSimulateScan: () => Promise<void>;
  status?: 'loading' | 'qr' | 'connected' | 'timeout';
}

export function WhatsAppQrModal({
  open,
  onClose,
  device,
  countdown,
  actionLoading,
  onSimulateScan,
  status = 'loading',
}: WhatsAppQrModalProps) {
  const qrImageSrc = React.useMemo(() => {
    if (!device?.qr_code) return '';
    if (
      device.qr_code.startsWith('data:') ||
      device.qr_code.startsWith('http://') ||
      device.qr_code.startsWith('https://')
    ) {
      return device.qr_code;
    }
    return `data:image/png;base64,${device.qr_code}`;
  }, [device?.qr_code]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Scan QR Code WhatsApp</h3>
              <p className="text-[11px] text-slate-500">Tautkan akun WhatsApp pengirim</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Body */}
        <div className="p-6 text-center space-y-5">
          <div className="relative mx-auto w-64 h-64 p-3 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-inner flex items-center justify-center">
            {status === 'connected' ? (
              <div className="text-emerald-600 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                <span className="text-sm font-semibold text-emerald-800">WhatsApp Terhubung!</span>
              </div>
            ) : qrImageSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrImageSrc}
                alt="WhatsApp QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-slate-400 flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="text-xs">
                  {status === 'timeout' ? 'Memuat ulang QR Code...' : 'Memuat QR Code...'}
                </span>
              </div>
            )}

            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-emerald-600 rounded-tl" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-emerald-600 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-emerald-600 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-emerald-600 rounded-br" />
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Kode QR diperbarui otomatis dalam{' '}
              <strong className="text-emerald-700 font-mono">{countdown} detik</strong>
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Cara Menautkan Perangkat:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 leading-relaxed text-[11px]">
              <li>Buka aplikasi <strong>WhatsApp</strong> di smartphone Anda</li>
              <li>Ketuk Menu <strong>Titik Tiga</strong> (Android) atau <strong>Pengaturan</strong> (iOS)</li>
              <li>Pilih <strong>Perangkat Tertaut</strong>, lalu ketuk <strong>Tautkan Perangkat</strong></li>
              <li>Arahkan kamera smartphone ke kode QR di atas</li>
            </ol>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-[11px] text-amber-700 bg-amber-50/80 border border-amber-200/70 p-2.5 rounded-xl text-left">
              <strong>💡 Mode Gateway Dummy:</strong> Karena endpoint gateway riil belum terpasang, Anda dapat mengklik tombol di bawah untuk menyimulasikan smartphone berhasil memindai QR code ini.
            </div>
            <button
              type="button"
              onClick={onSimulateScan}
              disabled={actionLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLoading ? 'Menyambungkan...' : 'Simulasikan Scan Berhasil'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
