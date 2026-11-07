'use client';

import React from 'react';
import {
  Inbox,
  Send,
  BellRing,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface OutboxItem {
  id: string | number;
  createdAt?: string;
  created_at?: string;
  topic?: string;
  recipientPhone?: string;
  recipient_phone?: string;
  messageBody?: string;
  message_body?: string;
  status: 'SENT' | 'PENDING' | 'FAILED' | string;
  retryCount?: number;
  retry_count?: number;
}

interface WhatsAppOutboxSectionProps {
  outboxData: {
    items: OutboxItem[];
    stats: { total: number; pending: number; sent: number; failed: number };
  };
  outboxLoading: boolean;
  blasting: boolean;
  processingOutbox: boolean;
  onOpenTestModal: () => void;
  onBlastReminders: () => Promise<void>;
  onProcessOutbox: () => Promise<void>;
  onFetchOutbox: () => Promise<void>;
}

export function WhatsAppOutboxSection({
  outboxData,
  outboxLoading,
  blasting,
  processingOutbox,
  onOpenTestModal,
  onBlastReminders,
  onProcessOutbox,
  onFetchOutbox,
}: WhatsAppOutboxSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm">
                Monitor Antrean & Otomasi Pesan WhatsApp (Outbox)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Worker Polling Aktif (10s)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Struk transaksi kasir otomatis, pengingat jatuh tempo angsuran pinjaman, dan log pengiriman
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenTestModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kirim Pesan Tes</span>
          </button>

          <button
            type="button"
            onClick={onBlastReminders}
            disabled={blasting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <BellRing className={`w-3.5 h-3.5 text-amber-600 ${blasting ? 'animate-bounce' : ''}`} />
            <span>{blasting ? 'Memindai...' : 'Pindai Jatuh Tempo (H-3)'}</span>
          </button>

          <button
            type="button"
            onClick={onProcessOutbox}
            disabled={processingOutbox}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${processingOutbox ? 'animate-spin' : ''}`} />
            <span>{processingOutbox ? 'Memproses...' : 'Proses Antrean'}</span>
          </button>

          <button
            type="button"
            onClick={onFetchOutbox}
            disabled={outboxLoading}
            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Log Outbox"
          >
            <RefreshCw className={`w-4 h-4 ${outboxLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Total Log Pesan
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-slate-800 font-mono">
                {outboxData.stats.total}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Berhasil Terkirim
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-emerald-700 font-mono">
                {outboxData.stats.sent}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">
              Menunggu Antrean
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-amber-700 font-mono">
                {outboxData.stats.pending}
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 shadow-xs">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
              Gagal / Error
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xl font-bold text-rose-700 font-mono">
                {outboxData.stats.failed}
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Messages */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <th className="px-5 py-3">Waktu Dibuat</th>
              <th className="px-5 py-3">Topik / Event</th>
              <th className="px-5 py-3">Tujuan</th>
              <th className="px-5 py-3">Isi Pesan</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Percobaan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {outboxLoading && outboxData.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-emerald-600 mb-2" />
                  Memuat log antrean pesan...
                </td>
              </tr>
            ) : outboxData.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                  <Inbox className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                  Belum ada antrean pesan di Outbox.
                </td>
              </tr>
            ) : (
              outboxData.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-slate-600 font-mono whitespace-nowrap text-[11px]">
                    {new Date(item.createdAt || item.created_at || '').toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-700">
                      {item.topic || 'NOTIFIKASI'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono font-medium text-slate-800 whitespace-nowrap">
                    {item.recipientPhone || item.recipient_phone}
                  </td>
                  <td
                    className="px-5 py-3.5 text-slate-600 max-w-md truncate"
                    title={item.messageBody || item.message_body}
                  >
                    {item.messageBody || item.message_body}
                  </td>
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'SENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'SENT'
                            ? 'bg-emerald-500'
                            : item.status === 'PENDING'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-rose-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-500 font-mono text-[11px]">
                    {item.retryCount ?? item.retry_count ?? 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
