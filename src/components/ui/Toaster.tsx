'use client';

import { Toaster as SonnerToaster } from 'sonner';

export default function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      theme="light"
      toastOptions={{
        classNames: {
          toast: '!rounded-2xl !shadow-[0_12px_36px_rgba(0,0,0,0.12)] !border !border-slate-100 font-sans p-4 gap-3',
          title: '!font-bold !text-sm text-slate-800',
          description: '!text-xs !text-slate-500 !font-medium mt-0.5',
          actionButton: '!bg-emerald-600 !text-white !font-bold !rounded-xl !text-xs !px-3 !py-1.5',
          cancelButton: '!bg-slate-100 !text-slate-700 !font-bold !rounded-xl !text-xs !px-3 !py-1.5',
          closeButton: '!bg-white/80 !border !border-slate-200 !text-slate-500 hover:!text-slate-800 !transition-colors',
          success: '!bg-emerald-50/95 !border-emerald-200 !text-emerald-950',
          error: '!bg-rose-50/95 !border-rose-200 !text-rose-950',
          warning: '!bg-amber-50/95 !border-amber-200 !text-amber-950',
          info: '!bg-sky-50/95 !border-sky-200 !text-sky-950',
        },
      }}
    />
  );
}
