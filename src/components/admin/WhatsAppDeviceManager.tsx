'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';
import { whatsappApi, WaDeviceData } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { confirmDialog } from '@/lib/confirm';
import { WaDeviceConfigFormValues, WaSendTestFormValues } from '@/lib/validations/whatsapp';
import { WhatsAppDeviceStatusCard } from './whatsapp/WhatsAppDeviceStatusCard';
import { WhatsAppEditDeviceModal } from './whatsapp/WhatsAppEditDeviceModal';
import { WhatsAppSendTestModal } from './whatsapp/WhatsAppSendTestModal';
import { WhatsAppQrModal } from './whatsapp/WhatsAppQrModal';
import { WhatsAppOutboxSection } from './whatsapp/WhatsAppOutboxSection';

export default function WhatsAppDeviceManager() {
  const { user } = useAuth();
  const isAdminOrSuperadmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [device, setDevice] = useState<WaDeviceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [outboxData, setOutboxData] = useState<{
    items: any[];
    stats: { total: number; pending: number; sent: number; failed: number };
  }>({ items: [], stats: { total: 0, pending: 0, sent: 0, failed: 0 } });
  const [outboxLoading, setOutboxLoading] = useState(false);
  const [blasting, setBlasting] = useState(false);
  const [processingOutbox, setProcessingOutbox] = useState(false);

  const [status, setStatus] = useState<'loading' | 'qr' | 'connected' | 'timeout'>('loading');
  const [qrPngBase64, setQrPngBase64] = useState<string>('');
  const [qrRawCode, setQrRawCode] = useState<string>('');

  const fetchOutbox = useCallback(async () => {
    setOutboxLoading(true);
    try {
      const res = await whatsappApi.getOutbox({ limit: 15 });
      if (res.status === 'success' && res.data) setOutboxData(res.data);
    } catch (err: any) {
      console.warn('Gagal memuat log outbox:', err);
    } finally {
      setOutboxLoading(false);
    }
  }, []);

  const fetchDevice = useCallback(async () => {
    try {
      const res = await whatsappApi.getDevice();
      if (res.status === 'success' && res.data) setDevice(res.data);
      else toast.error(res.message || 'Gagal mengambil informasi perangkat WhatsApp.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal terhubung ke API WhatsApp.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevice();
    fetchOutbox();
  }, [fetchDevice, fetchOutbox]);

  useEffect(() => {
    if (!qrModalOpen || !device?.device_id) return;
    setStatus('loading');
    setQrPngBase64('');
    // Buka stream SSE ke backend
    const url = `/api/wa/qr-stream?deviceId=${encodeURIComponent(device.device_id)}`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.status === 'qr') {
          setStatus('qr');
          setQrRawCode(payload.qr_code || '');
          const formattedQr = payload.qr_png_base64
            ? (payload.qr_png_base64.startsWith('data:')
                ? payload.qr_png_base64
                : `data:image/png;base64,${payload.qr_png_base64}`)
            : (payload.qr_code?.startsWith('data:')
                ? payload.qr_code
                : '');
          setQrPngBase64(formattedQr);
          if (formattedQr) {
            setDevice((prev) => (prev ? { ...prev, status: 'qr_ready', qr_code: formattedQr } : null));
          }
          setCountdown(20);
        } else if (payload.status === 'connected') {
          setStatus('connected');
          eventSource.close();
          setDevice((prev) => (prev ? { ...prev, status: 'connected' } : null));
          const phone = payload.jid
            ? payload.jid.split('@')[0].split(':')[0]
            : (payload.phone_number || device?.phone_number || undefined);
          whatsappApi.updateDevice({
            status: 'connected',
            phone_number: phone,
          }).then(() => {
            fetchDevice();
          }).catch((err) => {
            console.warn('Gagal update status device ke DB:', err);
            fetchDevice();
          });
          toast.success('WhatsApp berhasil terhubung!');
          setTimeout(() => setQrModalOpen(false), 1500);
        } else if (payload.status === 'timeout') {
          setDevice((prev) => (prev ? { ...prev, status: 'timeout' } : null));
          setStatus('timeout');
          whatsappApi.updateDevice({ status: 'timeout' }).catch((err) => {
            console.warn('Gagal update timeout status ke DB:', err);
          });
        } else if (payload.status === 'waiting') {
          setDevice((prev) => (prev ? { ...prev, status: 'waiting' } : null));
          setStatus('loading');
        }
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };
    eventSource.onerror = (err) => {
      console.warn('SSE connection closed or error:', err);
      eventSource.close();
    };
    // Bersihkan koneksi saat modal ditutup / unmount
    return () => {
      eventSource.close();
    };
  }, [qrModalOpen, device?.device_id, fetchDevice]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await whatsappApi.refresh();
      if (res.status === 'success' && res.data) {
        setDevice(res.data);
        toast.success('Status perangkat WhatsApp berhasil diperbarui.');
      } else {
        toast.error(res.message || 'Gagal menyinkronkan status.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat refresh status.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenQR = async () => {
    setActionLoading(true);
    try {
      const res = await whatsappApi.connect();
      if (res.status === 'success' && res.data) {
        setDevice(res.data);
        setCountdown(20);
        setQrModalOpen(true);
      } else {
        toast.error(res.message || 'Gagal memulai sesi pairing QR.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (qrModalOpen && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (qrModalOpen && countdown === 0) {
      whatsappApi.connect().then((res) => {
        if (res.status === 'success' && res.data) {
          const freshData = res.data;
          setDevice((prev) => {
            if (!prev) return freshData;
            return {
              ...freshData,
              qr_code: prev.qr_code || freshData.qr_code,
            };
          });
          setCountdown(20);
        }
      });
    }
    return () => clearInterval(timer);
  }, [qrModalOpen, countdown]);

  const handleDisconnect = async () => {
    const isConfirmed = await confirmDialog({
      title: 'Putus Koneksi WhatsApp?',
      message: 'Sesi WhatsApp akan dikeluarkan. Pengiriman OTP aktivasi dan reminder akan dihentikan.',
      confirmText: 'Ya, Putus Koneksi',
      cancelText: 'Batalkan',
      variant: 'danger',
    });
    if (!isConfirmed) return;

    setActionLoading(true);
    try {
      const res = await whatsappApi.disconnect();
      if (res.status === 'success' && res.data) {
        setDevice(res.data);
        toast.info('Koneksi perangkat WhatsApp berhasil diputus.');
      } else {
        toast.error(res.message || 'Gagal memutus koneksi.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat memutus koneksi.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveDevice = async (data: WaDeviceConfigFormValues) => {
    setActionLoading(true);
    try {
      const res = await whatsappApi.updateDevice(data);
      if (res.status === 'success' && res.data) {
        const payload = {
          id: data.device_id,
          name: data.name,
        }
        await fetch('/api/wa/store', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setDevice(res.data);
        setEditModalOpen(false);
        toast.success('Konfigurasi perangkat WhatsApp berhasil diperbarui.');
      } else {
        toast.error(res.message || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateScan = async () => {
    setActionLoading(true);
    try {
      const res = await whatsappApi.simulatePair({
        phone_number: device?.phone_number || '081298765432',
      });
      if (res.status === 'success' && res.data) {
        setDevice(res.data);
        setQrModalOpen(false);
        toast.success('Perangkat WhatsApp berhasil terhubung (Simulasi Berhasil)!');
      } else {
        toast.error(res.message || 'Simulasi scan gagal.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan simulasi.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendTest = async (data: WaSendTestFormValues) => {
    setActionLoading(true);
    try {
      const res = await whatsappApi.sendTest(data);
      if (res.status === 'success') {
        toast.success(res.message || 'Pesan tes berhasil dikirim!');
        setTestModalOpen(false);
        fetchOutbox();
      } else {
        toast.error(res.message || 'Gagal mengirim pesan tes.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan saat kirim pesan tes.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlastReminders = async () => {
    const isConfirmed = await confirmDialog({
      title: 'Pindai & Jadwalkan Reminder Jatuh Tempo?',
      message: 'Sistem akan memindai seluruh jadwal angsuran yang jatuh tempo dalam 3 hari ke depan.',
      confirmText: 'Ya, Jalankan Pindai',
      cancelText: 'Batalkan',
      variant: 'info',
    });
    if (!isConfirmed) return;

    setBlasting(true);
    try {
      const res = await whatsappApi.blastReminders(3);
      if (res.status === 'success') {
        toast.success(res.message || 'Pemeriksaan jatuh tempo berhasil dilakukan.');
        fetchOutbox();
      } else {
        toast.error(res.message || 'Gagal memicu pengingat jatuh tempo.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal menjalankan pemindaian reminder.');
    } finally {
      setBlasting(false);
    }
  };

  const handleProcessOutbox = async () => {
    setProcessingOutbox(true);
    try {
      const res = await whatsappApi.processOutbox(20);
      if (res.status === 'success') {
        toast.success(res.message || 'Batch antrean outbox berhasil diproses!');
        fetchOutbox();
      } else {
        toast.error(res.message || 'Gagal memproses antrean outbox.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses antrean pesan.');
    } finally {
      setProcessingOutbox(false);
    }
  };

  if (!isAdminOrSuperadmin) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Akses Terbatas</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            Pengelolaan nomor dan koneksi WhatsApp gateway hanya dapat diakses oleh peran <strong>Super Admin</strong> atau <strong>Admin</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <WhatsAppDeviceStatusCard
        device={device}
        loading={loading}
        refreshing={refreshing}
        actionLoading={actionLoading}
        onRefresh={handleRefresh}
        onOpenEditModal={() => setEditModalOpen(true)}
        onOpenQrModal={handleOpenQR}
        onDisconnect={handleDisconnect}
      />

      <WhatsAppOutboxSection
        outboxData={outboxData}
        outboxLoading={outboxLoading}
        blasting={blasting}
        processingOutbox={processingOutbox}
        onOpenTestModal={() => setTestModalOpen(true)}
        onBlastReminders={handleBlastReminders}
        onProcessOutbox={handleProcessOutbox}
        onFetchOutbox={fetchOutbox}
      />

      <WhatsAppQrModal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        device={device}
        countdown={countdown}
        actionLoading={actionLoading}
        onSimulateScan={handleSimulateScan}
        status={status}
      />

      <WhatsAppEditDeviceModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        defaultValues={{
          name: device?.name || '',
          device_id:
            device?.device_id && device.device_id !== 'koperasi-app'
              ? device.device_id
              : typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : 'dev-' + Math.random().toString(36).substring(2, 10),
          phone_number: device?.phone_number || '',
          api_url: device?.api_url || '',
        }}
        onSubmit={handleSaveDevice}
        loading={actionLoading}
      />

      <WhatsAppSendTestModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onSubmit={handleSendTest}
        loading={actionLoading}
      />
    </div>
  );
}
