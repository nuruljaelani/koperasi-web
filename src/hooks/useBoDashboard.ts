'use client';

import { useQuery } from '@tanstack/react-query';
import { boApi } from '@/lib/api';

export function useBoDashboard() {
  return useQuery({
    queryKey: ['bo-dashboard'],
    queryFn: async () => {
      const res = await boApi.getDashboard();
      if (res.status === 'success' && res.data) {
        return res.data;
      }
      throw new Error(res.message || 'Gagal memuat ringkasan dashboard');
    },
  });
}
