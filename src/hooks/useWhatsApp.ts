'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappApi, WaDeviceData } from '@/lib/api';

export type { WaDeviceData };

export function useWhatsAppDevice() {
  return useQuery({
    queryKey: ['whatsapp-device'],
    queryFn: async () => {
      const res = await whatsappApi.getDevice();
      if (res.status === 'success' && res.data) {
        return res.data;
      }
      throw new Error(res.message || 'Gagal mengambil data perangkat WhatsApp');
    },
    refetchInterval: (query) => {
      // Auto polling saat menghubungkan atau menunggu QR
      const status = query.state.data?.status;
      if (status === 'connecting' || status === 'qr_ready') {
        return 3000;
      }
      return false;
    },
  });
}

export function useWhatsAppOutbox(query?: { status?: string; limit?: number; page?: number }) {
  return useQuery({
    queryKey: ['whatsapp-outbox', query?.status, query?.limit, query?.page],
    queryFn: async () => {
      const res = await whatsappApi.getOutbox(query);
      if (res.status === 'success' && res.data) {
        return res.data;
      }
      throw new Error(res.message || 'Gagal mengambil data outbox');
    },
  });
}

export function useWhatsApp() {
  const queryClient = useQueryClient();

  const deviceQuery = useWhatsAppDevice();
  const outboxQuery = useWhatsAppOutbox({ limit: 15 });

  const refreshMutation = useMutation({
    mutationFn: () => whatsappApi.refresh(),
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        queryClient.setQueryData(['whatsapp-device'], res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['whatsapp-device'] });
    },
  });

  const connectMutation = useMutation({
    mutationFn: () => whatsappApi.connect(),
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        queryClient.setQueryData(['whatsapp-device'], res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['whatsapp-device'] });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => whatsappApi.disconnect(),
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        queryClient.setQueryData(['whatsapp-device'], res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['whatsapp-device'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: {
      name?: string;
      device_id?: string;
      phone_number?: string;
      api_url?: string;
      api_key?: string;
    }) => whatsappApi.updateDevice(payload),
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        queryClient.setQueryData(['whatsapp-device'], res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['whatsapp-device'] });
    },
  });

  const sendTestMutation = useMutation({
    mutationFn: (payload: { to: string; message: string }) => whatsappApi.sendTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-outbox'] });
    },
  });

  const blastMutation = useMutation({
    mutationFn: (daysAhead?: number) => whatsappApi.blastReminders(daysAhead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-outbox'] });
    },
  });

  const simulatePairMutation = useMutation({
    mutationFn: (payload?: { phone_number?: string }) => whatsappApi.simulatePair(payload),
    onSuccess: (res) => {
      if (res.status === 'success' && res.data) {
        queryClient.setQueryData(['whatsapp-device'], res.data);
      }
      queryClient.invalidateQueries({ queryKey: ['whatsapp-device'] });
    },
  });

  const processOutboxMutation = useMutation({
    mutationFn: (limit?: number) => whatsappApi.processOutbox(limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whatsapp-outbox'] });
    },
  });

  return {
    device: deviceQuery.data || null,
    isDeviceLoading: deviceQuery.isLoading,
    deviceError: deviceQuery.error,
    outbox: outboxQuery.data || { items: [], stats: { total: 0, pending: 0, sent: 0, failed: 0 }, pagination: null },
    isOutboxLoading: outboxQuery.isLoading,
    refreshDevice: refreshMutation.mutateAsync,
    isRefreshing: refreshMutation.isPending,
    connectDevice: connectMutation.mutateAsync,
    isConnecting: connectMutation.isPending,
    disconnectDevice: disconnectMutation.mutateAsync,
    isDisconnecting: disconnectMutation.isPending,
    updateDevice: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    sendTest: sendTestMutation.mutateAsync,
    isSendingTest: sendTestMutation.isPending,
    blastReminders: blastMutation.mutateAsync,
    isBlasting: blastMutation.isPending,
    simulatePair: simulatePairMutation.mutateAsync,
    isSimulatingPair: simulatePairMutation.isPending,
    processOutbox: processOutboxMutation.mutateAsync,
    isProcessingOutbox: processOutboxMutation.isPending,
  };
}
