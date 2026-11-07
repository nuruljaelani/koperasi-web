'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { cleanupLegacyMockStorage } from '@/lib/cleanupStorage';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    cleanupLegacyMockStorage();
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 menit data dianggap fresh
            gcTime: 5 * 60 * 1000, // 5 menit garbage collection
            retry: 1, // Coba ulang 1x jika gagal
            refetchOnWindowFocus: false, // Hindari refetch berlebih saat pindah tab
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
