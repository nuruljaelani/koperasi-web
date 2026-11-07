import { create } from 'zustand';
import React from 'react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmOptions {
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

interface ConfirmStore {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  proceed: () => void;
  cancel: () => void;
}

const defaultOptions: ConfirmOptions = {
  title: 'Konfirmasi Tindakan',
  message: 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText: 'Lanjutkan',
  cancelText: 'Batal',
  variant: 'danger',
};

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  options: defaultOptions,
  resolve: null,

  confirm: (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options: {
          ...defaultOptions,
          ...options,
        },
        resolve,
      });
    });
  },

  proceed: () => {
    const { resolve } = get();
    if (resolve) resolve(true);
    set({ isOpen: false, resolve: null });
  },

  cancel: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null });
  },
}));
