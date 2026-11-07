'use client';

import React from 'react';
import { LucideIcon, CheckCircle2, AlertCircle, Save, Loader2 } from 'lucide-react';

export const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-slate-300';

export const textareaClass = `${inputClass} resize-none font-mono text-xs leading-relaxed`;

export const getInputClass = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-xl text-slate-800 text-sm font-medium transition-all placeholder:text-slate-300 focus:outline-none ${
    hasError
      ? 'bg-rose-50/40 border border-rose-300 focus:ring-2 focus:ring-rose-400 focus:bg-white text-rose-900'
      : 'bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:bg-white'
  }`;

export const getTextareaClass = (hasError?: boolean) =>
  `${getInputClass(hasError)} resize-none font-mono text-xs leading-relaxed`;

interface SectionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function SectionCard({ title, description, icon: Icon, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, hint, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-500 font-medium mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}

interface ToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}

export function Toggle({ value, onChange, label, desc }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div>
        <p className="text-sm font-bold text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
          value ? 'bg-emerald-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

interface SaveBannerProps {
  onSave: () => void;
  saved: boolean;
  isSaving?: boolean;
}

export function SaveBanner({ onSave, saved, isSaving }: SaveBannerProps) {
  return (
    <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 font-semibold">Perubahan tersimpan</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Ada perubahan yang belum disimpan</span>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </div>
  );
}
