'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  QrCode,
  RefreshCw,
  Settings2,
  Phone,
  Cpu,
  Clock,
  Copy,
  Check,
  WifiOff,
} from 'lucide-react';
import { WaDeviceData } from '@/lib/api';
import { toast } from 'sonner';

interface WhatsAppDeviceStatusCardProps {
  device: WaDeviceData | null;
  loading: boolean;
  refreshing: boolean;
  actionLoading: boolean;
  onRefresh: () => void;
  onOpenEditModal: () => void;
  onOpenQrModal: () => void;
  onDisconnect: () => void;
}

export function WhatsAppDeviceStatusCard({
  device,
  loading,
  refreshing,
  actionLoading,
  onRefresh,
  onOpenEditModal,
  onOpenQrModal,
  onDisconnect,
}: WhatsAppDeviceStatusCardProps) {
  const [copied, setCopied] = useState(false);
  const isConnected = device?.status === 'connected';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isConnected
                ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/20'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-bold text-slate-800 text-sm">
                {device?.name || 'Nomor WhatsApp Notifikasi'}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
                  isConnected
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : device?.status === 'qr_ready'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected
                      ? 'bg-emerald-500 animate-pulse'
                      : device?.status === 'qr_ready'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                {isConnected
                  ? 'TERHUBUNG (ONLINE)'
                  : device?.status === 'qr_ready'
                  ? 'MENUNGGU SCAN'
                  : 'TERPUTUS (OFFLINE)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengelolaan sesi WhatsApp untuk pengiriman OTP & notifikasi koperasi via Kafka
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 ${
                refreshing ? 'animate-spin text-emerald-600' : ''
              }`}
            />
            <span>Refresh Status</span>
          </button>
          <button
            type="button"
            onClick={onOpenEditModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Ganti Device / Nomor</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Nomor WhatsApp Aktif
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-base font-bold text-slate-800 font-mono">
                {device?.phone_number || 'Belum Terkonfigurasi'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              {isConnected ? 'Siap mengirim pesan' : 'Koneksikan untuk mengirim notifikasi'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Device ID
            </span>
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {device?.device_id || 'koperasi-app'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(device?.device_id || 'koperasi-app')}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                title="Salin Device ID"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              Dipakai service auth & event worker
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Terakhir Sinkron / Terhubung
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-slate-800">
                {device?.last_connected_at
                  ? new Date(device.last_connected_at).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Belum pernah terhubung'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1">
              Mode REST API: {device?.api_url ? 'Custom Gateway' : 'Staging / Dummy Adapter'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 via-slate-50 to-emerald-50/40 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full shrink-0 ${
                isConnected
                  ? 'bg-emerald-500 ring-4 ring-emerald-100'
                  : 'bg-rose-400 ring-4 ring-rose-100'
              }`}
            />
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isConnected
                  ? 'Layanan Notifikasi WhatsApp Berfungsi Normal'
                  : 'Layanan WhatsApp Sedang Tidak Terhubung'}
              </p>
              <p className="text-[11px] text-slate-500">
                {isConnected
                  ? 'Pesan OTP aktivasi akun dan reminder angsuran terkirim otomatis ke member.'
                  : 'Silakan hubungkan nomor WhatsApp Anda dengan memindai kode QR.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isConnected ? (
              <button
                type="button"
                onClick={onOpenQrModal}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                <QrCode className="w-4 h-4" />
                <span>Hubungkan / Scan QR</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onDisconnect}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <WifiOff className="w-4 h-4 text-rose-600" />
                <span>Putus Koneksi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
