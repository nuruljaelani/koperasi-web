'use client';

import { useEffect, useRef } from 'react';
import { useConfirmStore, type ConfirmVariant } from '@/store/useConfirmStore';
import { AlertTriangle, Trash2, Info, CheckCircle2, X } from 'lucide-react';

export default function ConfirmDialog() {
  const { isOpen, options, proceed, cancel } = useConfirmStore();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus cancel button by default for safety
    const timer = setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, cancel]);

  if (!isOpen) return null;

  const variant: ConfirmVariant = options.variant || 'danger';

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-6 h-6" />,
          badgeClass: 'bg-rose-50 text-rose-600 border-rose-100',
          confirmBtnClass:
            'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_8px_20px_rgba(225,29,72,0.28)] hover:shadow-[0_12px_25px_rgba(225,29,72,0.38)]',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6" />,
          badgeClass: 'bg-amber-50 text-amber-600 border-amber-100',
          confirmBtnClass:
            'bg-amber-500 hover:bg-amber-600 text-white shadow-[0_8px_20px_rgba(245,158,11,0.28)] hover:shadow-[0_12px_25px_rgba(245,158,11,0.38)]',
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6" />,
          badgeClass: 'bg-sky-50 text-sky-600 border-sky-100',
          confirmBtnClass:
            'bg-sky-600 hover:bg-sky-700 text-white shadow-[0_8px_20px_rgba(2,132,199,0.28)] hover:shadow-[0_12px_25px_rgba(2,132,199,0.38)]',
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6" />,
          badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          confirmBtnClass:
            'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_8px_20px_rgba(16,185,129,0.28)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.38)]',
        };
    }
  };

  const currentStyles = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) cancel();
      }}
    >
      <div className="relative bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={cancel}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Header with Icon */}
        <div className="flex items-start gap-4 pr-6">
          <div
            className={`p-3.5 rounded-2xl border shrink-0 ${currentStyles.badgeClass}`}
          >
            {currentStyles.icon}
          </div>
          <div className="space-y-1.5 pt-1">
            <h3
              id="confirm-dialog-title"
              className="text-lg font-extrabold text-slate-900 tracking-tight"
            >
              {options.title}
            </h3>
            <div className="text-sm text-slate-500 font-medium leading-relaxed">
              {options.message}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={cancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all text-sm cursor-pointer active:scale-95"
          >
            {options.cancelText || 'Batal'}
          </button>
          <button
            type="button"
            onClick={proceed}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 cursor-pointer hover:-translate-y-0.5 ${currentStyles.confirmBtnClass}`}
          >
            {options.confirmText || 'Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  );
}
