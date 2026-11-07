import { apiFetch } from "./client";

export interface WaDeviceData {
  id: string;
  device_id: string;
  name: string;
  phone_number: string | null;
  status: 'connected' | 'disconnected' | 'qr_ready' | 'connecting' | 'timeout' | 'waiting';
  qr_code: string | null;
  api_url?: string | null;
  api_key?: string | null;
  is_active: boolean;
  last_connected_at: string | null;
  created_at: string;
  updated_at: string;
}

export const whatsappApi = {
  getDevice: async () => {
    return apiFetch<WaDeviceData>('/whatsapp/device');
  },
  connect: async () => {
    return apiFetch<WaDeviceData>('/whatsapp/device/connect', {
      method: 'POST',
    });
  },
  disconnect: async () => {
    return apiFetch<WaDeviceData>('/whatsapp/device/disconnect', {
      method: 'POST',
    });
  },
  refresh: async () => {
    return apiFetch<WaDeviceData>('/whatsapp/device/refresh', {
      method: 'POST',
    });
  },
  updateDevice: async (payload: {
    name?: string;
    device_id?: string;
    phone_number?: string;
    api_url?: string;
    api_key?: string;
    status?: string;
  }) => {
    return apiFetch<WaDeviceData>('/whatsapp/device', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  update: async (payload: any) => {
    return apiFetch<WaDeviceData>('/whatsapp/device', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  simulatePair: async (payload?: { phone_number?: string }) => {
    return apiFetch<WaDeviceData>('/whatsapp/device/simulate-pair', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },
  sendTest: async (payload: { to: string; message: string }) => {
    return apiFetch('/whatsapp/send-test', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  blastReminders: async (daysAhead = 3) => {
    return apiFetch('/whatsapp/blast-reminders', {
      method: 'POST',
      body: JSON.stringify({ daysAhead }),
    });
  },
  getOutbox: async (query?: { status?: string; limit?: number; page?: number }) => {
    const q = query ? '?' + new URLSearchParams(query as any).toString() : '';
    return apiFetch<{
      items: any[];
      stats: { total: number; pending: number; sent: number; failed: number };
      pagination: any;
    }>(`/whatsapp/outbox${q}`);
  },
  processOutbox: async (limit = 20) => {
    return apiFetch('/whatsapp/process-outbox', {
      method: 'POST',
      body: JSON.stringify({ limit }),
    });
  },
};
